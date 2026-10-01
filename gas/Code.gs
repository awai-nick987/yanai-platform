/**
 * =========================================================================
 * 柳井市まちなか夢プラン 共創プラットフォーム
 * Google Apps Script (GAS) 独立運用バックエンド・スクリプト (Code.gs)
 * =========================================================================
 *
 * 【概要】
 * ・外部サーバーや有償AI APIを一切使わず、Googleスプレッドシートのみで完結する完全無料のバックエンドです。
 * ・市民フロントエンド（Vercel/Netlify等）からのアイデア投稿・投票受付、
 *   および毎晩の2軸マトリックス自動集計・キーワード分析・公開データ配信を担います。
 *
 * 【導入手順】
 * 1. Googleドライブで新規スプレッドシートを作成し、名前を「柳井市まちなか夢プラン_管理台帳」にします。
 * 2. 以下のシートを作成します：
 *    - 「ideas」シート（市民投稿データ）
 *    - 「votes」シート（ビジョン投票・共感数）
 *    - 「summary」シート（毎晩3時自動集計結果）
 *    - 「settings」シート（フロント公開設定）
 * 3. ツール > スクリプトエディタ を開き、このコードを貼り付けます。
 * 4. デプロイ > 新しいデプロイ > 種類: ウェブアプリ
 *    - 次のユーザーとして実行: 自分
 *    - アクセスできるユーザー: 全員（匿名ユーザーを含む）
 * 5. 発行された「ウェブアプリURL」をフロントエンドの環境変数または設定に設定します。
 */

// ==========================================
// 1. GET リクエスト（フロントエンドへのデータ配信）
// ==========================================
function doGet(e) {
  try {
    const action = e.parameter.action || 'get_all_data';
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === 'get_all_data') {
      const ideasSheet = ss.getSheetByName('ideas') || initIdeasSheet(ss);
      const summarySheet = ss.getSheetByName('summary') || initSummarySheet(ss);
      
      const ideas = getSheetDataAsJson(ideasSheet);
      // 承認済（status === 'approved' または 'reflected'）のみフロントに返却
      const publicIdeas = ideas.filter(item => item.status === 'approved' || item.status === 'reflected');
      
      const response = {
        status: 'success',
        timestamp: new Date().toISOString(),
        ideasCount: publicIdeas.length,
        ideas: publicIdeas,
        lastNightlyBatch: summarySheet.getRange('B1').getValue() || '未集計'
      };
      
      return ContentService.createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Unknown action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// 2. POST リクエスト（市民投稿・投票の受付）
// ==========================================
function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action || 'submit_idea';
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === 'submit_idea') {
      const ideasSheet = ss.getSheetByName('ideas') || initIdeasSheet(ss);
      const id = 'sub-' + Utilities.formatDate(new Date(), 'JST', 'yyyyMMddHHmmss');
      
      // ルールベース自動スコアリング（AI不要）
      const calculatedScores = calculateHeuristicScore(contents);
      
      const rowData = [
        id,                                          // ID
        contents.title || '無題',                     // タイトル
        contents.category || 'value_creation',       // カテゴリ
        contents.description || '',                  // 詳細
        contents.authorName || '市民有志',            // 投稿者名
        contents.ageGroup || 'twenties_thirties',    // 年代属性
        contents.residency || 'downtown_station',    // 居住地域
        contents.locationName || '柳井市中心市街地',  // 提案場所
        contents.lat || 33.9678,                     // 緯度
        contents.lng || 132.1075,                    // 経度
        calculatedScores.expectationScore,           // 住民期待度 (0-100)
        calculatedScores.feasibilityScore,           // 実現可能性 (0-100)
        1,                                           // 共感数 (初期値1)
        0,                                           // 要検討数
        'approved',                                  // ステータス (即時公開または 'in_review')
        Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd HH:mm'),
        (contents.tags || ['まちなか共創']).join(','),
        calculatedScores.priorityZone                // 2軸ゾーン判定
      ];
      
      ideasSheet.appendRow(rowData);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'アイデアを受付・登録しました',
        id: id,
        scores: calculatedScores
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 共感（いいね）投票の加算
    if (action === 'upvote') {
      const ideasSheet = ss.getSheetByName('ideas');
      const targetId = contents.id;
      const data = ideasSheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === targetId) {
          const currentVotes = Number(data[i][12]) || 0;
          ideasSheet.getRange(i + 1, 13).setValue(currentVotes + 1);
          // 期待度スコアも微増
          const currentExp = Number(data[i][10]) || 50;
          ideasSheet.getRange(i + 1, 11).setValue(Math.min(99, currentExp + 1));
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Unknown POST action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// =========================================================
// 3. 毎晩午前3:00 自動定期集計バッチ（Time-driven Trigger）
//    ※ 有償AIを使わず、スプレッドシート上で統計計算＆集約
// =========================================================
function nightlyBatchAnalysisTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ideasSheet = ss.getSheetByName('ideas');
  const summarySheet = ss.getSheetByName('summary') || initSummarySheet(ss);
  
  if (!ideasSheet) return;
  
  const data = ideasSheet.getDataRange().getValues();
  if (data.length <= 1) return;
  
  let totalSubmissions = data.length - 1;
  let quickWins = 0;
  let strategic = 0;
  let continuous = 0;
  let longTerm = 0;
  
  const keywordDict = {};
  const targetKeywords = ['白壁', 'カフェ', '高校生', '夜市', '金魚', '歩行者', '空き家', 'イベント', 'Wi-Fi', '自習', '駐車場', 'テラス'];
  targetKeywords.forEach(k => keywordDict[k] = 0);
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const exp = Number(row[10]) || 50;
    const feas = Number(row[11]) || 50;
    const text = (row[1] + ' ' + row[3]).toString();
    
    // 4象限マトリックス自動判定
    if (exp >= 70 && feas >= 70) quickWins++;
    else if (exp >= 70 && feas < 70) strategic++;
    else if (exp < 70 && feas >= 70) continuous++;
    else longTerm++;
    
    // キーワード頻度カウント
    targetKeywords.forEach(k => {
      if (text.indexOf(k) !== -1) {
        keywordDict[k]++;
      }
    });
  }
  
  // 集計結果の書き込み
  const nowStr = Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd HH:mm');
  summarySheet.getRange('A1').setValue('最終実行日時');
  summarySheet.getRange('B1').setValue(nowStr);
  
  summarySheet.getRange('A3:B7').setValues([
    ['総提案数', totalSubmissions],
    ['クイックウィン（即時実行候補）', quickWins],
    ['戦略的重点検討領域', strategic],
    ['低コスト随時改善領域', continuous],
    ['中長期構想領域', longTerm]
  ]);
  
  // キーワードランキング出力
  const kwSorted = Object.keys(keywordDict).map(k => [k, keywordDict[k]]).sort((a, b) => b[1] - a[1]);
  summarySheet.getRange('D1').setValue('頻出キーワード');
  summarySheet.getRange('E1').setValue('出現件数');
  summarySheet.getRange(2, 4, kwSorted.length, 2).setValues(kwSorted);
  
  Logger.log('夜間自動集計バッチが正常に完了しました: ' + nowStr);
}

// ==========================================
// 4. ルールベースの自動スコアリング関数
// ==========================================
function calculateHeuristicScore(item) {
  let exp = 70;
  let feas = 65;
  
  // 年代による重み（若者・高校生提案や子育て世代の加点）
  if (item.ageGroup === 'high_school') exp += 15;
  if (item.ageGroup === 'twenties_thirties') exp += 10;
  
  // カテゴリ別実現性初期値
  if (item.category === 'improvement') feas += 15; // 課題改善は実現性が高い
  if (item.category === 'value_creation') feas += 5;
  
  // キーワードによる補正
  const text = (item.title || '') + ' ' + (item.description || '');
  if (text.includes('実験') || text.includes('テスト') || text.includes('マルシェ')) feas += 10;
  if (text.includes('新設') || text.includes('建設') || text.includes('鉄道')) feas -= 20;
  
  exp = Math.max(10, Math.min(98, exp));
  feas = Math.max(10, Math.min(95, feas));
  
  let zone = 'quick_win';
  if (exp >= 70 && feas >= 70) zone = 'quick_win';
  else if (exp >= 70 && feas < 70) zone = 'strategic_priority';
  else if (exp < 70 && feas >= 70) zone = 'continuous_improvement';
  else zone = 'long_term';
  
  return {
    expectationScore: exp,
    feasibilityScore: feas,
    priorityZone: zone
  };
}

// ==========================================
// 5. 初期シート生成ヘルパー
// ==========================================
function initIdeasSheet(ss) {
  let sheet = ss.getSheetByName('ideas');
  if (!sheet) sheet = ss.insertSheet('ideas');
  sheet.getRange(1, 1, 1, 18).setValues([[
    'ID', 'タイトル', 'カテゴリ', '説明', '投稿者名', '年代属性', '居住地域', 
    '場所名', '緯度', '経度', '住民期待度', '実現可能性', '共感数', '要検討数', 
    'ステータス', '投稿日時', 'タグ', '優先ゾーン'
  ]]);
  sheet.setFrozenRows(1);
  return sheet;
}

function initSummarySheet(ss) {
  let sheet = ss.getSheetByName('summary');
  if (!sheet) sheet = ss.insertSheet('summary');
  return sheet;
}

function getSheetDataAsJson(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  const results = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const item = {
      id: row[0],
      title: row[1],
      category: row[2],
      description: row[3],
      authorName: row[4],
      ageGroup: row[5],
      residency: row[6],
      locationName: row[7],
      lat: Number(row[8]),
      lng: Number(row[9]),
      expectationScore: Number(row[10]),
      feasibilityScore: Number(row[11]),
      upvotes: Number(row[12]),
      downvotes: Number(row[13]),
      status: row[14],
      createdAt: row[15],
      tags: row[16] ? row[16].toString().split(',') : [],
      adminAssignedPhase: row[17]
    };
    results.push(item);
  }
  return results;
}
