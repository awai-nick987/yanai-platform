import re

with open('src/data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

settings_obj = """export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  batchExecutionTime: '03:00',
  reflectionMode: 'manual',
  lastAnalysisTimestamp: '2026-08-21 03:00:12',
  independentMode: true,
  spreadSheetSynced: true,
  spreadSheetId: '1YnAI-MachiNaka-DreamPlan-2026-DataStore',
  sectionVisibility: {
    workshopPopup: true,
    mapSection: true,
    visionVoteSection: true,
    recruitmentSection: true,
    matrixAnalyticsSection: true,
    progressTimeline: true
  },
  frontendSectionToggles: {
    about: true,
    projects: true,
    vision: true,
    recruitment: true,
    submit_idea: true,
    citizen_dashboard: true,
    heroFloatingStats: true
  },
  heroCustomTexts: {
    floatingSubTitle: "まちなか共創・進捗リアルタイム",
    floatingMainTitle: "柳井市 夢プラン策定状況"
  }
};"""

content = re.sub(r'export const INITIAL_SYSTEM_SETTINGS: SystemSettings = \{[\s\S]*?\n\};\n', settings_obj + "\n\n", content)

with open('src/data/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(content)
