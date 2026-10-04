import re

with open('src/components/WorkspaceKanban.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if "import { IntegratedAnalysis }" not in content:
    content = content.replace("import { SurveyApp } from './survey/SurveyApp';", "import { SurveyApp } from './survey/SurveyApp';\nimport { IntegratedAnalysis } from './workspace/IntegratedAnalysis';")

# Add key
content = content.replace("| 'survey'", "| 'survey'\n  | 'integrated_analysis'")

# Add to menu array
menu_item = """  { key: 'survey', icon: BarChart2, label: 'アンケート分析' },
  { key: 'integrated_analysis', icon: Layers, label: 'コンセプトブック統合AI' },"""
content = content.replace("  { key: 'survey', icon: BarChart2, label: 'アンケート分析' },", menu_item)

# Add to switch statement
render_content = """      case 'survey':
        return <SurveyApp />;
      case 'integrated_analysis':
        return <IntegratedAnalysis />;"""
content = content.replace("      case 'survey':\n        return <SurveyApp />;", render_content)

with open('src/components/WorkspaceKanban.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched WorkspaceKanban.tsx")
