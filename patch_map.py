import re

with open('src/components/InteractiveTownMap.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Props
props_before = """interface InteractiveTownMapProps {
  submissions?: IdeaSubmission[];
  onVote?: (id: string, type: 'up' | 'down') => void;
  onSelectSubmissionForDetails?: (submission: IdeaSubmission) => void;
  onSelectSubmission?: (submission: IdeaSubmission) => void;
  onOpenSubmitWithCoords?: (lat: number, lng: number, locationName: string) => void;
  onAddNewLocationIdea?: () => void;
}"""

props_after = """import { UserRole } from '../types';

interface InteractiveTownMapProps {
  submissions?: IdeaSubmission[];
  onVote?: (id: string, type: 'up' | 'down') => void;
  onSelectSubmissionForDetails?: (submission: IdeaSubmission) => void;
  onSelectSubmission?: (submission: IdeaSubmission) => void;
  onOpenSubmitWithCoords?: (lat: number, lng: number, locationName: string) => void;
  onAddNewLocationIdea?: () => void;
  currentRole?: UserRole;
  onDeleteSubmission?: (id: string) => void;
}"""
content = content.replace(props_before, props_after)

# Update function signature
func_before = """export const InteractiveTownMap: React.FC<InteractiveTownMapProps> = ({ 
  submissions = [], 
  onVote, 
  onSelectSubmissionForDetails,
  onSelectSubmission,
  onOpenSubmitWithCoords,
  onAddNewLocationIdea
}) => {"""

func_after = """export const InteractiveTownMap: React.FC<InteractiveTownMapProps> = ({ 
  submissions = [], 
  onVote, 
  onSelectSubmissionForDetails,
  onSelectSubmission,
  onOpenSubmitWithCoords,
  onAddNewLocationIdea,
  currentRole,
  onDeleteSubmission
}) => {"""
content = content.replace(func_before, func_after)

# Add Trash2 import if not present
if "Trash2" not in content:
    content = content.replace("MapPin, Map as MapIcon, ArrowRight", "MapPin, Map as MapIcon, ArrowRight, Trash2")
    content = content.replace("MapPin, Map, ArrowRight, Heart", "MapPin, Map as MapIcon, ArrowRight, Heart, Trash2")

# Update popup rendering to add delete button for admins
popup_before = """                      </div>
                      
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">"""
popup_after = """                      </div>
                      
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        {currentRole === 'admin' && onDeleteSubmission && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('このアイデアを削除しますか？')) {
                                onDeleteSubmission(sub.id);
                              }
                            }}
                            className="flex items-center justify-center p-1.5 bg-rose-100 text-rose-700 rounded hover:bg-rose-200 transition-colors mr-2 cursor-pointer"
                            title="アイデアを削除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}"""
content = content.replace(popup_before, popup_after)

with open('src/components/InteractiveTownMap.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Now patch App.tsx
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app_content = f.read()

app_before = """<InteractiveTownMap
                          submissions={submissions}
                          onVote={handleVoteSubmission}
                          onSelectSubmissionForDetails={setSelectedDetailSubmission}
                          onOpenSubmitWithCoords={(lat, lng, locationName) => {
                            setSubmitCoords({ lat, lng, locationName });
                            setIsSubmitModalOpen(true);
                          }}
                          onAddNewLocationIdea={() => setIsSubmitModalOpen(true)}
                        />"""
app_after = """<InteractiveTownMap
                          submissions={submissions}
                          onVote={handleVoteSubmission}
                          onSelectSubmissionForDetails={setSelectedDetailSubmission}
                          onOpenSubmitWithCoords={(lat, lng, locationName) => {
                            setSubmitCoords({ lat, lng, locationName });
                            setIsSubmitModalOpen(true);
                          }}
                          onAddNewLocationIdea={() => setIsSubmitModalOpen(true)}
                          currentRole={currentRole}
                          onDeleteSubmission={handleDeleteSubmission}
                        />"""
app_content = app_content.replace(app_before, app_after)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_content)
