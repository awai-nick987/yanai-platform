import re

# 1. Update src/types.ts
with open('src/types.ts', 'r', encoding='utf-8') as f:
    types = f.read()
types = re.sub(r'tags: string\[\];\n\}', 'tags: string[];\n  isHidden?: boolean;\n}', types)
with open('src/types.ts', 'w', encoding='utf-8') as f:
    f.write(types)

# 2. Update App.tsx
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

app_handlers = """
  const handleToggleProjectVisibility = (id: string) => {
    setPocProjects(prev => prev.map(p => p.id === id ? { ...p, isHidden: !p.isHidden } : p));
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("このプロジェクトを削除しますか？この操作は取り消せません。")) {
      setPocProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleUpdateRole = (role: UserRole) => {
"""
app = app.replace("  const handleUpdateRole = (role: UserRole) => {", app_handlers)

app = re.sub(
    r'<PocProjectSection\s*projects=\{pocProjects\}\s*currentRole=\{currentRole\}\s*onSelectProject=\{setSelectedProject\}\s*onOpenCreateProjectModal=\{\(\) => setIsCreateProjectModalOpen\(true\)\}\s*onLikeProject=\{handleLikeProject\}\s*/>',
    r'<PocProjectSection\n        projects={pocProjects}\n        currentRole={currentRole}\n        onSelectProject={setSelectedProject}\n        onOpenCreateProjectModal={() => setIsCreateProjectModalOpen(true)}\n        onLikeProject={handleLikeProject}\n        onToggleVisibility={handleToggleProjectVisibility}\n        onDeleteProject={handleDeleteProject}\n      />',
    app
)
with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)

# 3. Update PocProjectSection.tsx
with open('src/components/PocProjectSection.tsx', 'r', encoding='utf-8') as f:
    section = f.read()

# Add imports for new icons (Eye, EyeOff, Trash2)
if 'EyeOff' not in section:
    section = re.sub(r'import \{([\s\S]*?)\} from \'lucide-react\';', r'import {\1, Eye, EyeOff, Trash2} from \'lucide-react\';', section)

section = re.sub(
    r'interface PocProjectSectionProps \{([\s\S]*?)\}',
    r'interface PocProjectSectionProps {\1  onToggleVisibility?: (id: string) => void;\n  onDeleteProject?: (id: string) => void;\n}',
    section
)

section = re.sub(
    r'onLikeProject\n\}\) => \{',
    r'onLikeProject,\n  onToggleVisibility,\n  onDeleteProject\n}) => {',
    section
)

# Filter projects for non-admins
section = section.replace(
    'const inProgressProjects = projects.filter',
    'const visibleProjects = currentRole === "admin" ? projects : projects.filter(p => !p.isHidden);\n  const inProgressProjects = visibleProjects.filter'
)
section = section.replace('projects.filter(', 'visibleProjects.filter(')

# Add admin buttons inside the project card mapping. The map is over `inProgressProjects.map((project) => ...)` and `upcomingProjects.map((project) => ...)`
# Let's find the card rendering part:
admin_buttons_str = """
              {currentRole === 'admin' && (
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleVisibility?.(project.id); }}
                    className={`p-2 rounded-full shadow-sm backdrop-blur-md transition-colors ${project.isHidden ? 'bg-amber-100/90 text-amber-700 hover:bg-amber-200' : 'bg-white/90 text-slate-600 hover:bg-white'}`}
                    title={project.isHidden ? "現在非表示（クリックで表示）" : "現在表示中（クリックで非表示）"}
                  >
                    {project.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteProject?.(project.id); }}
                    className="p-2 bg-white/90 text-rose-600 hover:bg-rose-50 rounded-full shadow-sm backdrop-blur-md transition-colors"
                    title="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
"""

# There are two places where cards are mapped: inProgressProjects and upcomingProjects
# `<div className="relative h-48 sm:h-56 overflow-hidden">`
section = section.replace(
    '<div className="relative h-48 sm:h-56 overflow-hidden">',
    '<div className="relative h-48 sm:h-56 overflow-hidden">\n' + admin_buttons_str
)

with open('src/components/PocProjectSection.tsx', 'w', encoding='utf-8') as f:
    f.write(section)

print("patched PocProject")
