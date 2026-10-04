import re

with open('src/types.ts', 'r', encoding='utf-8') as f:
    content = f.read()

repl = """  frontendSectionToggles: {
    about: boolean;             // 柳井市まちなかまちづくりプロジェクトとは
    projects: boolean;          // プロジェクト
    vision: boolean;            // ビジョン投票
    recruitment: boolean;       // 要員募集
    submit_idea: boolean;       // 意見投稿
    citizen_dashboard: boolean; // ダッシュボード
    heroFloatingStats: boolean; // ヒーローエリアのフローティング統計
  };
  heroCustomTexts: {
    floatingSubTitle: string;
    floatingMainTitle: string;
  };"""

content = re.sub(r'  frontendSectionToggles: \{[\s\S]*?citizen_dashboard: boolean; // ダッシュボード\n  \};', repl, content)

with open('src/types.ts', 'w', encoding='utf-8') as f:
    f.write(content)
