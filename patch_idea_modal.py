import re

with open('src/components/IdeaSubmissionModal.tsx', 'r') as f:
    content = f.read()

# Add states for anonymous and placeholder
state_old = "  const [authorName, setAuthorName] = useState('');"
state_new = """  const [authorName, setAuthorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [placeholder, setPlaceholder] = useState('');"""
content = content.replace(state_old, state_new)

# Add useEffect for placeholder
effect_old = """  useEffect(() => {
    if (isOpen) {
      setLocationName(defaultLocationName);
    }
  }, [isOpen, defaultLocationName]);"""

effect_new = """  const PLACEHOLDERS = [
    "【高校生目線】どんな場所で、誰と、何を実現したい？\n例：柳井学園の生徒や地元商店街と連携して、放課後や週末に金魚ちょうちんの下で地元スイーツを楽しめる空間を作りたいです。",
    "【子育て世代目線】どんな場所で、誰と、何を実現したい？\n例：白壁通り沿いの空きスペースを活用して、ベビーカーでも入りやすい屋根付きの休憩所を作ってほしいです。",
    "【現役世代目線】どんな場所で、誰と、何を実現したい？\n例：駅前のロータリー付近に、仕事帰りでもふらっと立ち寄れるオープンカフェ風のスペースがあると、もっと人が滞留すると思います。",
    "【シニア世代目線】どんな場所で、誰と、何を実現したい？\n例：旧商家通りの歴史を感じながら、お年寄りが座って休めるベンチと、若者と交流できるような案内板を設置してほしいです。"
  ];

  useEffect(() => {
    if (isOpen) {
      setLocationName(defaultLocationName);
      setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
    }
  }, [isOpen, defaultLocationName]);"""
content = content.replace(effect_old, effect_new)


# Update AuthorName field
author_old = """            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                お名前・ニックネーム <span className="text-slate-400 font-normal">（任意）</span>
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="柳井 太郎"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>"""

author_new = """            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">
                  お名前・ニックネーム <span className="text-slate-400 font-normal">（任意）</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => {
                      setIsAnonymous(e.target.checked);
                      if (e.target.checked) setAuthorName('');
                    }}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-[11px] font-semibold text-slate-600">匿名で投稿する（市民有志）</span>
                </label>
              </div>
              <input
                type="text"
                value={isAnonymous ? '市民有志（匿名）' : authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                disabled={isAnonymous}
                placeholder={isAnonymous ? '' : '柳井 太郎'}
                className={`w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden ${isAnonymous ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-white border-slate-300'}`}
              />
            </div>"""

content = content.replace(author_old, author_new)

# Update submit handler to respect anonymous
submit_old = "authorName: authorName.trim() || '市民有志',"
submit_new = "authorName: (isAnonymous ? '市民有志（匿名）' : authorName.trim()) || '市民有志',"
content = content.replace(submit_old, submit_new)

# Update placeholder in textarea
textarea_old = """              placeholder="どんな場所で、誰と一緒に、何を実現したいかを教えてください（例: 柳井学園の生徒や地元商店街と連携して、放課後や週末に金魚ちょうちんの下で地元スイーツを楽しめる空間を作りたいです...）" """
textarea_new = """              placeholder={placeholder} """
content = content.replace(textarea_old, textarea_new)

with open('src/components/IdeaSubmissionModal.tsx', 'w') as f:
    f.write(content)
