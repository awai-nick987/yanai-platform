import re

with open('src/components/UserRoleManagement.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "{activeTab === 'registered' && (",
    "{activeTab === 'registered' && (\n      <div className=\"bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6\">"
)

content = content.replace(
    "        </div>\n      )}\n\n      {/* Add Member Modal */}",
    "        </div>\n      </div>\n      )}\n\n      {/* Add Member Modal */}"
)

with open('src/components/UserRoleManagement.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
