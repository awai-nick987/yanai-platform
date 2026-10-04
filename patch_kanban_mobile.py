import re

with open('src/components/WorkspaceKanban.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'<div className="lg:hidden bg-\[#0d2137\] text-white p-2\.5 flex items-center gap-2 overflow-x-auto border-b border-slate-200 shrink-0">',
    r'<div className="lg:hidden bg-white p-2.5 flex items-center gap-2 overflow-x-auto border-b border-slate-200 shrink-0 shadow-sm">',
    content
)

with open('src/components/WorkspaceKanban.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("patched mobile Kanban")
