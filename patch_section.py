import re

with open('src/components/IdeaSubmissionSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update handleSubmit Age Mapping
new_handle_submit = """
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opinion.trim()) return;

    onAddNewIdea({
      title: `${targetProject || 'まちなか'}に関する提案`,
      category: targetProject as CategoryType || 'other_concept',
      description: opinion.trim(),
      authorName: gender ? `市民有志 (${gender === 'male' ? '男性' : gender === 'female' ? '女性' : '無回答'}・${age || '年代未選択'})` : '市民有志',
      ageGroup: (age as AgeGroup) || '30s',
      residency: (residency as ResidencyArea) || 'downtown_resident',
      locationName: locationName || '',
      lat: 33.9678,
      lng: 132.1075,
      expectationScore: 85,
      feasibilityScore: 75,
      tags: ['市民投稿']
    });

    setSubmitted(true);
    setOpinion('');
    setTimeout(() => setSubmitted(false), 4000);
  };
"""
# Replace handle submit body, but wait, need to add `residency` and `locationName` to state!
# Also `targetProject` is now the CategoryType!
