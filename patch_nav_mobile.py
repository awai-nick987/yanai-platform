import re

with open('src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

mobile_buttons = """            {/* Direct Admin Buttons in Drawer */}
            {currentRole === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                  activeTab === 'admin' 
                    ? 'bg-slate-900 text-amber-300 border-slate-800' 
                    : 'bg-amber-50/90 text-amber-950 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>👑 管理画面へ直接移動</span>
                <ChevronRight className="w-4 h-4 text-amber-600" />
              </button>
            )}
            
            {(currentRole === 'admin' || currentRole === 'workspace') && (
              <button
                onClick={() => handleNavClick('workspace')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                  activeTab === 'workspace' 
                    ? 'bg-slate-900 text-emerald-300 border-slate-800' 
                    : 'bg-emerald-50/90 text-emerald-950 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span>🤝 ワークスペースへ直接移動</span>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </button>
            )}

            {(currentRole === 'admin' || currentRole === 'recruiter') && (
              <button
                onClick={() => handleNavClick('recruitment')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                  activeTab === 'recruitment' 
                    ? 'bg-slate-900 text-purple-300 border-slate-800' 
                    : 'bg-purple-50/90 text-purple-950 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <span>📢 募集投稿画面へ直接移動</span>
                <ChevronRight className="w-4 h-4 text-purple-600" />
              </button>
            )}"""

content = re.sub(
    r'\{/\* Relationship Portal Item in Drawer list if logged in \*/\}.*?<\/button>\s*\}',
    mobile_buttons,
    content,
    flags=re.DOTALL
)

with open('src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
