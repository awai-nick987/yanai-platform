import re

with open('src/components/WorkspaceKanban.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("bg-[#1b3d63] text-white font-bold", "bg-[#1b3d63] text-white font-bold shadow-xs")
content = content.replace("text-slate-300 hover:bg-[#152e4d] hover:text-white", "text-slate-700 hover:bg-slate-200 hover:text-slate-900")

with open('src/components/WorkspaceKanban.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
