import re

with open('src/components/HeroSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix double bindings
content = re.sub(r'  systemSettings,\n  currentRole,\n  onUpdateSettings,\n  onNavigateToProjects', '  onNavigateToProjects', content)

with open('src/components/HeroSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
