import re

with open('src/components/HeroSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
if 'SystemSettings' not in content:
    content = content.replace("import { Sparkles", "import { SystemSettings, UserRole } from '../types';\nimport { Sparkles")
if 'EyeOff' not in content:
    content = content.replace("import { Sparkles", "import { EyeOff, Eye, Edit3 } from 'lucide-react';\nimport { Sparkles")

# Add props
props_before = """interface HeroSectionProps {
  onNavigateToProjects: () => void;
  onNavigateToIdeas: () => void;
  onNavigateToRecruitment: () => void;
  activePocCount: number;
  approvedSubmissionsCount: number;
}"""

props_after = """interface HeroSectionProps {
  onNavigateToProjects: () => void;
  onNavigateToIdeas: () => void;
  onNavigateToRecruitment: () => void;
  activePocCount: number;
  approvedSubmissionsCount: number;
  systemSettings?: SystemSettings;
  currentRole?: UserRole;
  onUpdateSettings?: (settings: SystemSettings) => void;
}"""
content = content.replace(props_before, props_after)

content = content.replace(
    "export const HeroSection: React.FC<HeroSectionProps> = ({",
    "export const HeroSection: React.FC<HeroSectionProps> = ({\n  systemSettings,\n  currentRole,\n  onUpdateSettings,"
)
content = content.replace(
    "approvedSubmissionsCount\n}) => {",
    "approvedSubmissionsCount,\n  systemSettings,\n  currentRole,\n  onUpdateSettings\n}) => {"
)

# Insert the logic for the floating frame
# Right Column: Floating Stats Card
floating_before = """          {/* Right Column: Floating Stats Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end mt-2 lg:mt-0">
            <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-slate-900 border border-slate-100 relative overflow-hidden backdrop-blur-xl">"""

floating_after = """          {/* Right Column: Floating Stats Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end mt-2 lg:mt-0 relative">
            {(!systemSettings?.frontendSectionToggles?.heroFloatingStats && currentRole !== 'admin') ? null : (
              <div className={`w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-slate-900 border border-slate-100 relative overflow-hidden backdrop-blur-xl ${!systemSettings?.frontendSectionToggles?.heroFloatingStats ? 'opacity-50' : ''}`}>
                {currentRole === 'admin' && systemSettings && onUpdateSettings && (
                  <div className="absolute top-2 right-2 z-50 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateSettings({
                          ...systemSettings,
                          frontendSectionToggles: {
                            ...systemSettings.frontendSectionToggles,
                            heroFloatingStats: !systemSettings.frontendSectionToggles.heroFloatingStats
                          }
                        });
                      }}
                      className="p-1.5 bg-slate-900 text-white rounded-full shadow hover:bg-slate-800"
                      title="表示/非表示"
                    >
                      {systemSettings.frontendSectionToggles.heroFloatingStats ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-amber-300" />}
                    </button>
                  </div>
                )}
"""
content = content.replace(floating_before, floating_after)

# Header Visual Bar
header_before = """                <div className="relative z-10 text-white">
                  <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                    まちなか共創・進捗リアルタイム
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                    柳井市 夢プラン策定状況
                  </div>
                </div>"""

header_after = """                <div className="relative z-10 text-white w-full">
                  {currentRole === 'admin' && systemSettings && onUpdateSettings ? (
                    <div className="space-y-1 w-full pr-8">
                      <input
                        type="text"
                        value={systemSettings.heroCustomTexts?.floatingSubTitle || ''}
                        onChange={(e) => onUpdateSettings({
                          ...systemSettings,
                          heroCustomTexts: {
                            ...systemSettings.heroCustomTexts,
                            floatingSubTitle: e.target.value
                          }
                        })}
                        className="bg-black/20 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-100 px-2 py-1 rounded w-full border border-white/20 outline-none"
                      />
                      <input
                        type="text"
                        value={systemSettings.heroCustomTexts?.floatingMainTitle || ''}
                        onChange={(e) => onUpdateSettings({
                          ...systemSettings,
                          heroCustomTexts: {
                            ...systemSettings.heroCustomTexts,
                            floatingMainTitle: e.target.value
                          }
                        })}
                        className="bg-black/20 text-sm sm:text-base font-bold text-white px-2 py-1 rounded w-full border border-white/20 outline-none mt-1"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                        {systemSettings?.heroCustomTexts?.floatingSubTitle || "まちなか共創・進捗リアルタイム"}
                      </div>
                      <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                        {systemSettings?.heroCustomTexts?.floatingMainTitle || "柳井市 夢プラン策定状況"}
                      </div>
                    </>
                  )}
                </div>"""
content = content.replace(header_before, header_after)

# close the null check block at the end of the floating card
content = content.replace(
    "                </button>\n              </div>\n            </div>\n          </div>",
    "                </button>\n              </div>\n            </div>\n            )}\n          </div>"
)

with open('src/components/HeroSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
