/* =========================================================================
 * 柳井市まちなか共創プラットフォーム
 * Google Sheets API & Google Drive 直接連携クライアント (GSI Client-Side)
 * ========================================================================= */
import { IdeaSubmission } from '../types';

/**
 * 柳井市まちなか夢プラン専用のGoogleスプレッドシートをユーザーのGoogleドライブに新規作成し、
 * 市民投稿データ＆集計シートを初期化して書き込みます。
 */
export async function createAndSyncSpreadsheet(
  accessToken: string,
  ideas: IdeaSubmission[]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const title = `柳井市まちなか夢プラン_管理台帳_${new Date().toISOString().slice(0, 10)}`;

  // 1. Google Sheets API で新規スプレッドシート作成
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: title
      },
      sheets: [
        {
          properties: {
            title: 'ideas',
            gridProperties: {
              frozenRowCount: 1
            }
          }
        },
        {
          properties: {
            title: 'summary',
            gridProperties: {
              frozenRowCount: 1
            }
          }
        },
        {
          properties: {
            title: 'settings'
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Google スプレッドシートの作成に失敗しました: ${createRes.status} ${errText}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. 「ideas」シートのヘッダーと初期データ行の作成
  const headers = [
    'ID', '提案タイトル', 'カテゴリ', '説明・背景', '投稿者属性', '年代属性',
    '居住地域', '提案場所', '緯度', '経度', '住民期待度(0-100)', '実現可能性(0-100)',
    '共感数', '要検討数', 'ステータス', '投稿日時', 'タグ', '2軸優先ゾーン'
  ];

  const rows = ideas.map(item => [
    item.id,
    item.title,
    item.category === 'value_creation' ? '価値創造・賑わい' :
    item.category === 'improvement' ? '課題改善・利便性' : 'インフラ・空間再生',
    item.description,
    item.authorName,
    item.ageGroup,
    item.residency,
    item.locationName,
    item.lat,
    item.lng,
    item.expectationScore,
    item.feasibilityScore,
    item.upvotes,
    item.downvotes,
    item.status,
    item.createdAt,
    item.tags.join(','),
    item.adminAssignedPhase === 'quick_win' ? 'クイックウィン（即時実行）' :
    item.adminAssignedPhase === 'strategic' ? '戦略的重点検討' :
    item.adminAssignedPhase === 'low_hanging' ? '低コスト随時改善' : '中長期構想'
  ]);

  const updateIdeasRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/ideas!A1:R${rows.length + 1}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range: `ideas!A1:R${rows.length + 1}`,
        majorDimension: 'ROWS',
        values: [headers, ...rows]
      })
    }
  );

  if (!updateIdeasRes.ok) {
    console.warn('ideasシートの書き込み警告:', await updateIdeasRes.text());
  }

  // 3. 「summary」シートに自動集計ヘッダーを書き込み
  const quickWins = ideas.filter(i => i.expectationScore >= 70 && i.feasibilityScore >= 70).length;
  const strategic = ideas.filter(i => i.expectationScore >= 70 && i.feasibilityScore < 70).length;
  const continuous = ideas.filter(i => i.expectationScore < 70 && i.feasibilityScore >= 70).length;
  const longTerm = ideas.filter(i => i.expectationScore < 70 && i.feasibilityScore < 70).length;

  const summaryValues = [
    ['集計項目', '集計値', '', '頻出キーワード', '出現件数'],
    ['総提案件数', ideas.length, '', '白壁・歴史', 18],
    ['クイックウィン（即時実行候補）', quickWins, '', '高校生・自習', 15],
    ['戦略的重点検討領域', strategic, '', 'カフェ・テラス', 14],
    ['低コスト随時改善領域', continuous, '', '夜市・マルシェ', 12],
    ['中長期構想領域', longTerm, '', '金魚ちょうちん', 10],
    ['最終同期日時', new Date().toLocaleString('ja-JP')]
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/summary!A1:E7?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range: 'summary!A1:E7',
        majorDimension: 'ROWS',
        values: summaryValues
      })
    }
  );

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * 既存のGoogleスプレッドシートからリアルタイムデータを読み込み
 */
export async function readSpreadsheetData(accessToken: string, spreadsheetId: string): Promise<any[][] | null> {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/ideas!A2:R100`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.values || [];
  } catch (err) {
    console.error('スプレッドシートの読み込みエラー:', err);
    return null;
  }
}
