import re

with open('src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace the single "関係者・運営ポータル" button with the specific buttons based on currentRole.
desktop_buttons = """            {currentRole === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`ml-1 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-slate-900 text-amber-300 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 hover:border-amber-400 shadow-xs'
                }`}
                title="全体管理・データ分析・A3出力用"
              >
                <span>👑 管理画面へ直接移動</span>
              </button>
            )}
            
            {(currentRole === 'admin' || currentRole === 'workspace') && (
              <button
                onClick={() => handleNavClick('workspace')}
                className={`ml-1 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'workspace'
                    ? 'bg-slate-900 text-emerald-300 shadow-md ring-2 ring-emerald-400/50'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 shadow-xs'
                }`}
                title="タスク・ドキュメント管理専用"
              >
                <span>🤝 ワークスペースへ直接移動</span>
              </button>
            )}
            
            {(currentRole === 'admin' || currentRole === 'recruiter') && (
              <button
                onClick={() => handleNavClick('recruitment')}
                className={`ml-1 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'recruitment'
                    ? 'bg-slate-900 text-purple-300 shadow-md ring-2 ring-purple-400/50'
                    : 'bg-purple-50 text-purple-900 border border-purple-300 hover:bg-purple-100 hover:border-purple-400 shadow-xs'
                }`}
                title="実証実験の要員募集・応募者管理専用"
              >
                <span>📢 募集投稿画面へ直接移動</span>
              </button>
            )}"""

# Replace the desktop button logic
content = re.sub(
    r'\{/\* 7\. 関係者・運営ポータル \(関係者ログイン中のみグローバルメニュー末尾に表示\) \*/\}.*?<\/button>\s*\}',
    desktop_buttons,
    content,
    flags=re.DOTALL
)

with open('src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
