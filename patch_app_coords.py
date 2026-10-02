with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add state
state_code = """  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitCoords, setSubmitCoords] = useState<{lat: number, lng: number, locationName: string} | null>(null);"""
content = content.replace("  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);\n  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);", state_code)

# Add onOpenSubmitWithCoords handler
handler_code = """  const handleOpenSubmitWithCoords = (lat: number, lng: number, locationName: string) => {
    setSubmitCoords({ lat, lng, locationName });
    setIsSubmitModalOpen(true);
  };"""
content = content.replace("  // Actions", "  // Actions\n" + handler_code)

# Update IdeaSubmissionModal props
modal_old = """      <IdeaSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitIdea={handleAddNewIdea}
      />"""
modal_new = """      <IdeaSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          setSubmitCoords(null);
        }}
        onSubmitIdea={handleAddNewIdea}
        defaultLat={submitCoords?.lat}
        defaultLng={submitCoords?.lng}
        defaultLocationName={submitCoords?.locationName}
      />"""
content = content.replace(modal_old, modal_new)

# Update InteractiveTownMap usages
# It is used in 3 places.
map_old = """                  showToast(type === 'up' ? 'アイデアに共感しました！' : 'ご意見を記録しました');
                }}
                onSelectSubmissionForDetails={(sub) => setSelectedDetailSubmission(sub)}
                onAddNewLocationIdea={() => setIsSubmitModalOpen(true)}
              />"""
map_new = """                  showToast(type === 'up' ? 'アイデアに共感しました！' : 'ご意見を記録しました');
                }}
                onSelectSubmissionForDetails={(sub) => setSelectedDetailSubmission(sub)}
                onAddNewLocationIdea={() => setIsSubmitModalOpen(true)}
                onOpenSubmitWithCoords={handleOpenSubmitWithCoords}
              />"""
content = content.replace(map_old, map_new)

map_old2 = """                              showToast(type === 'up' ? 'アイデアに共感しました！' : 'ご意見を記録しました');
                            }}
                            onSelectSubmissionForDetails={(sub) => setSelectedDetailSubmission(sub)}
                            onAddNewLocationIdea={() => setIsSubmitModalOpen(true)}
                          />"""
map_new2 = """                              showToast(type === 'up' ? 'アイデアに共感しました！' : 'ご意見を記録しました');
                            }}
                            onSelectSubmissionForDetails={(sub) => setSelectedDetailSubmission(sub)}
                            onAddNewLocationIdea={() => setIsSubmitModalOpen(true)}
                            onOpenSubmitWithCoords={handleOpenSubmitWithCoords}
                          />"""
content = content.replace(map_old2, map_new2)


with open('src/App.tsx', 'w') as f:
    f.write(content)

