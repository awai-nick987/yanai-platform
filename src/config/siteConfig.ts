/**
 * =========================================================================
 * 柳井市まちなか共創プラットフォーム - サイト設定＆レイアウト構成ファイル
 * =========================================================================
 * 行政担当者や準備会メンバーからの「文言修正」「セクション配置変更」「表示/非表示切替」を
 * コードの深層を触らずにこのファイル1つで即座に変更・反映できるように設計されています。
 */

export interface SectionConfigItem {
  id: 'hero' | 'projects' | 'vision' | 'town_map' | 'recruitment' | 'submit_idea' | 'citizen_dashboard' | 'about';
  name: string;
  enabled: boolean;
}

export const SITE_CONFIG = {
  // 基本メタデータ・タイトル
  meta: {
    siteTitle: '柳井市まちなか共創プラットフォーム',
    subtitle: '柳井市中心市街地活性化基本計画（令和8年度策定） 市民参画ポータル',
    organizationName: '柳井市 まちなか未来共創準備会 / 柳井市役所 都市計画課',
    contactEmail: 'toshikeikaku@city-yanai.jp',
    copyright: '© 2026 柳井市中心市街地活性化協議会 / 柳井市'
  },

  // ヒーローヘッダー文言
  hero: {
    badgeText: '柳井市中心市街地活性化 令和8年度基本計画策定プロジェクト',
    mainHeading: '白壁の町並みと駅前をつなぐ、\n次世代の柳井をともに創る。',
    description: '市民の小さな「あったらいいな」から、高校生の探究アイデア、実証実験（PoC）の参加まで。柳井のまちなかの未来をみんなでカタチにする共創プラットフォームです。',
    stats: {
      targetYear: '令和8年度 (2026)',
      planName: '中心市街地活性化基本計画',
      communityCount: '市民主導型 5WG始動中'
    }
  },

  // トップページ（ホーム画面）のセクション表示順序と表示/非表示
  // ※ 配列の順番を入れ替えるだけで、トップページのセクション並び順が即時変更されます
  homeSectionOrder: [
    { id: 'hero', name: 'ヒーローヘッダー', enabled: true },
    { id: 'projects', name: '実証実験（PoC）プロジェクト', enabled: true },
    { id: 'vision', name: 'まちの未来ビジョン投票', enabled: true },
    { id: 'town_map', name: 'まちなか共創マップ', enabled: true },
    { id: 'recruitment', name: '共創サポーター・要員募集', enabled: true },
    { id: 'submit_idea', name: 'アイデア・ご意見投稿', enabled: true },
    { id: 'citizen_dashboard', name: '市民投稿オープンデータ分析', enabled: true }
  ] as SectionConfigItem[],

  // ナビゲーションメニュー定義（ヘッダータブ）
  navigationTabs: [
    { key: 'home', label: 'トップ' },
    { key: 'about', label: '基本計画とは' },
    { key: 'projects', label: '実証プロジェクト' },
    { key: 'vision', label: 'ビジョン投票' },
    { key: 'recruitment', label: 'サポーター募集' },
    { key: 'submit_idea', label: 'アイデア投稿' },
    { key: 'citizen_dashboard', label: 'データ分析' },
    { key: 'workspace', label: '推進WGカンバン', restricted: 'wg' } // 準備会・行政向け
  ],

  // 外部サービス・無料連携設定
  integrations: {
    // Google Apps Script (GAS) Web APIのURL（環境変数 VITE_GAS_API_URL または直書き）
    gasApiEndpoint: ((import.meta as any).env?.VITE_GAS_API_URL as string) || '',
    
    // 自治体公式ページへのリンク
    officialCityUrl: 'https://www.city-yanai.jp/',
    
    // スプレッドシート直リンク（準備会内部用）
    adminSpreadsheetUrl: 'https://docs.google.com/spreadsheets/d/your-spreadsheet-id/edit',
  }
};
