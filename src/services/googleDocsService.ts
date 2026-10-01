/* =========================================================================
 * 柳井市まちなか共創プラットフォーム
 * Google Docs & Drive API エクスポートクライアント (Client-Side OAuth GSI)
 * ========================================================================= */

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

/**
 * Google Docs API を呼び出して Vercel & GAS 完全運用マニュアルを作成・書き込み
 */
export async function exportManualToGoogleDocs(accessToken: string): Promise<{ documentId: string; documentUrl: string }> {
  // 1. Google Docsの新規ドキュメント作成
  const title = `【完全運用マニュアル】柳井市まちなか夢プラン_共創プラットフォーム_Vercel_GAS運用_${new Date().toISOString().slice(0, 10)}`;
  
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Google Docsの作成に失敗しました: ${createRes.status} ${errText}`);
  }

  const docData = await createRes.json();
  const documentId = docData.documentId;

  // 2. マニュアル本文のテキスト構築
  const manualText = `柳井市まちなか夢プラン 共創プラットフォーム
【完全運用・公開マニュアル（Vercel ＋ GAS 独立運用編）】
策定支援：柳井市役所 ＆ 市民共創推進チーム
作成日：${new Date().toLocaleDateString('ja-JP')}
--------------------------------------------------------------------------------

■ 1. アーキテクチャ概要（完全無料・永年¥0 運用）
本プラットフォームは、外部の有償サーバーや高額なAI API（Gemini等）を一切呼び出さず、
完全無料で運用できる「Vercel (フロントエンド) ＋ Google スプレッドシート/GAS (DB・バックエンド)」構成を採用しています。

【構成要素と費用】
1. フロントエンド（市民・職員向けUI）：Vercel または Netlify（無料枠：¥0）
2. データベース（アイデア台帳・投票）：Google スプレッドシート（無料：¥0）
3. バックエンド（API・夜間集計）：Google Apps Script (GAS)（無料：¥0）
4. AI依存度：0%（ルールベース判定 ＆ 統計関数によりサーバーレス自律集計）

--------------------------------------------------------------------------------

■ 2. Google Apps Script (GAS) ＆ スプレッドシート設定手順（所要時間：約3分）

【手順 1】Googleスプレッドシートを作成
1. Googleドライブを開き、「新規」>「Google スプレッドシート」を作成します。
2. ファイル名を「柳井市まちなか夢プラン_管理台帳」に変更します。

【手順 2】スクリプトエディタの起動とコード配置
1. スプレッドシートのメニューバーから「拡張機能」>「Apps Script」をクリックします。
2. エディタに表示されている既存のコードをすべて消去します。
3. リポジトリ内の「/gas/Code.gs」のコードをすべてコピー＆ペーストします。
4. 「保存（フロッピーアイコンまたはCtrl+S）」をクリックします。

【手順 3】ウェブアプリとしてのデプロイ
1. 画面右上の「デプロイ」青色ボタン >「新しいデプロイ」をクリックします。
2. 種類の選択（歯車アイコン）>「ウェブアプリ」を選択します。
3. 設定項目を以下のように指定します：
   - 次のユーザーとして実行: 「自分」
   - アクセスできるユーザー: 「全員」（※市民からの投稿・投票を受け付けるため）
4. 「デプロイ」をクリックします。
5. 「アクセスを承認」のポップアップが出た場合は、ご自身のアカウントを選択し「詳細」>「安全ではないページに移動」>「許可」をクリックします。
6. 発行された「ウェブアプリ URL（https://script.google.com/macros/s/.../exec）」をコピーして控えます。

【手順 4】毎晩午前3時の自動集計トリガーの設定
1. Apps Script画面の左側メニュー「トリガー（時計アイコン）」をクリックします。
2. 右下の「トリガーを追加」をクリックします。
3. 以下のように設定して「保存」します：
   - 実行する関数: 「nightlyBatchAnalysisTrigger」
   - イベントのソース: 「時間主導型」
   - 時間ベースのタイプ: 「日タイマー」
   - 時刻: 「午前3時〜4時」
※これにより、毎晩市民の投稿が集計され、2軸マトリックス・優先ゾーン・頻出キーワードが自動更新されます。

--------------------------------------------------------------------------------

■ 3. Vercel へのワンクリック公開手順（所要時間：約2分）

【手順 1】Vercel にログイン
1. https://vercel.com にアクセスし、GitHubアカウント等でログインします。

【手順 2】プロジェクトのインポート
1. ダッシュボードの「Add New...」>「Project」をクリックします。
2. 本プラットフォームのリポジトリを選択し「Import」をクリックします。

【手順 3】環境変数の登録（重要）
1. 「Environment Variables」の欄を開きます。
2. 以下を登録します：
   - Key: VITE_GAS_API_URL
   - Value: 【手順2】でコピーした GASのウェブアプリURL
3. 「Deploy」ボタンをクリックします。
4. 約1分でビルドが完了し、公開URL（https://xxxx.vercel.app）が発行されます。

--------------------------------------------------------------------------------

■ 4. 日常の庁内運用 ＆ モデレーション方法

【市民投稿の確認と公開承認】
・Googleスプレッドシートの「ideas」シートにリアルタイムで投稿が蓄積されます。
・「ステータス」列を職員が編集することで、Web上の表示を即時コントロールできます：
   - approved: Webマップ・一覧に即時公開
   - in_review: 庁内審査中（フロントには非表示）
   - rejected: 不適切・非公開（フロントには非表示）
   - reflected: 夢プラン本編へ採用・反映済バッジ表示

【2軸マトリックスのスコア調整】
・市民の期待度スコアや実現性スコアは、スプレッドシートの数値を直接書き換えることで、ダッシュボード上の散布図の位置を自由に微調整できます。

【議会・策定委員会への資料提出】
・Web画面右上の「データ出力」>「会議用資料PDF (A3) 印刷プレビュー」から、A3横1枚にまとまった高品質な図面資料をいつでもワンクリックで印刷・PDF保存できます。

--------------------------------------------------------------------------------
柳井市まちなか夢プラン 共創プラットフォーム
システム管理・運用ドキュメント（完）
`;

  // 3. ドキュメントにテキストを挿入
  const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: manualText
          }
        }
      ]
    })
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`Google Docsへのテキスト書き込みに失敗しました: ${updateRes.status} ${errText}`);
  }

  const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
  return { documentId, documentUrl };
}
