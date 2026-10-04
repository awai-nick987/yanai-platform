import re

with open('src/data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

repl = """    submit_idea: true,       // 意見投稿
    citizen_dashboard: true, // ダッシュボード
    heroFloatingStats: true, // ヒーローエリアのフローティング統計
  },
  heroCustomTexts: {
    floatingSubTitle: "まちなか共創・進捗リアルタイム",
    floatingMainTitle: "柳井市 夢プラン策定状況"
  }"""

content = re.sub(
    r'submit_idea: true,       // 意見投稿\n    citizen_dashboard: true, // ダッシュボード\n  \}',
    repl,
    content
)

with open('src/data/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(content)
