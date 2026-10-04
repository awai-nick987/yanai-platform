import re

with open('src/components/WorkspaceKanban.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'<div className="flex h-\[calc\(100vh-64px\)\] overflow-hidden bg-\[#0d2137\]">',
    r'<div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">',
    content
)

content = re.sub(
    r'<aside className="hidden lg:flex w-64 bg-\[#0d2137\] text-slate-200 flex-col shrink-0 border-r border-\[#1a3556\] select-none">',
    r'<aside className="hidden lg:flex w-64 bg-slate-50 text-slate-700 flex-col shrink-0 border-r border-slate-200 select-none">',
    content
)

content = re.sub(
    r'border-b border-\[#1a3556\]',
    r'border-b border-slate-200',
    content
)

content = re.sub(
    r'text-white text-sm tracking-tight',
    r'text-slate-900 text-sm tracking-tight',
    content
)

content = re.sub(
    r'text-slate-300 hover:bg-slate-800',
    r'text-slate-600 hover:bg-slate-200 hover:text-slate-900',
    content
)

integrated_tab_str = """
              <button
                onClick={() => setActiveMenu('integrated_analysis')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeMenu === 'integrated_analysis'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <div className={`p-1.5 rounded-md ${activeMenu === 'integrated_analysis' ? 'bg-blue-500/30 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                コンセプトブック統合AI
              </button>
"""

if 'Sparkles' not in content:
    content = re.sub(r'import \{([\s\S]*?)\} from \'lucide-react\';', r'import {\1, Sparkles} from \'lucide-react\';', content)

content = re.sub(
    r'(<button\s+onClick=\{\(\) => setActiveMenu\(\'dashboard\'\)\}[\s\S]*?</button>)',
    r'\1\n' + integrated_tab_str,
    content
)

integrated_content_str = """
          {/* 6. INTEGRATED ANALYSIS */}
          {activeMenu === 'integrated_analysis' && (
            <IntegratedAnalysis currentRole={currentRole} />
          )}
"""

content = re.sub(
    r'(\{\/\* 5\. SHARED DRIVE \*\/\}[\s\S]*?<\/WorkspaceDrive>\s*\n\s*\)\})',
    r'\1\n' + integrated_content_str,
    content
)

with open('src/components/WorkspaceKanban.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("patched WorkspaceKanban")
