import re

with open('src/components/UserRoleManagement.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("      </div>\n\n      {/* ADD MEMBER MODAL */}", "      </div>\n      </>\n      )}\n\n      {/* ADD MEMBER MODAL */}")

with open('src/components/UserRoleManagement.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
