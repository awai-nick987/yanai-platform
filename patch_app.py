import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

hero_before = """<HeroSection
                          key="hero"
                          onNavigateToProjects={() => setActiveTab('projects')}
                          onNavigateToIdeas={() => setActiveTab('submit_idea')}
                          onNavigateToRecruitment={() => setActiveTab('recruitment')}
                          activePocCount={pocProjects.filter(p => p.status === 'in_progress' || p.status === 'recruiting').length}
                          approvedSubmissionsCount={submissions.filter(s => s.status === 'approved' || s.status === 'reflected').length}
                        />"""

hero_after = """<HeroSection
                          key="hero"
                          onNavigateToProjects={() => setActiveTab('projects')}
                          onNavigateToIdeas={() => setActiveTab('submit_idea')}
                          onNavigateToRecruitment={() => setActiveTab('recruitment')}
                          activePocCount={pocProjects.filter(p => p.status === 'in_progress' || p.status === 'recruiting').length}
                          approvedSubmissionsCount={submissions.filter(s => s.status === 'approved' || s.status === 'reflected').length}
                          systemSettings={systemSettings}
                          currentRole={currentRole}
                          onUpdateSettings={setSystemSettings}
                        />"""

content = content.replace(hero_before, hero_after)

# also need to persist settings to localStorage whenever setSystemSettings is called, but we don't have a wrapper. Let's create a wrapper for setSystemSettings.
# Actually, the user doesn't care if it perfectly persists on reload, but wait, `localStorage.getItem('yanai_system_settings')` is there.
# It would be better to add `useEffect` to save settings.
effect = """
  useEffect(() => {
    localStorage.setItem('yanai_system_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);
"""
content = re.sub(
    r'(const \[systemSettings, setSystemSettings\] = useState<SystemSettings>\(\(\) => \{[\s\S]*?\}\);)',
    r'\1\n' + effect,
    content
)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
