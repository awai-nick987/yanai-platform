import re

with open('src/components/WorkspaceKanban.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add to mobile tabs
mobile_tabs_before = """          {[
            { key: 'dashboard', label: 'ダッシュボード', icon: BarChart3 },"""

mobile_tabs_after = """          {[
            { key: 'dashboard', label: 'ダッシュボード', icon: BarChart3 },
            { key: 'integrated_analysis', label: '統合AI', icon: Sparkles },"""

content = content.replace(mobile_tabs_before, mobile_tabs_after)

with open('src/components/WorkspaceKanban.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("patched mobile tabs")
