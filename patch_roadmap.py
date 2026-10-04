import re

with open('src/components/workspace/WorkspaceRoadmap.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add handleDeletePhase
handle_delete_str = """
  const handleDeletePhase = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!editingPhase) return;
    if (window.confirm(`${editingPhase.title} を削除してもよろしいですか？`)) {
      setPhases(phases.filter(p => p.id !== editingPhase.id));
      setIsEditModalOpen(false);
    }
  };

  const handleSavePhase = (e: React.FormEvent) => {
"""

content = content.replace("  const handleSavePhase = (e: React.FormEvent) => {", handle_delete_str)


# Add Delete button to form footer
footer_before = """
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  保存する
                </button>
              </div>
"""

footer_after = """
              <div className="flex justify-between items-center gap-2 pt-3 border-t border-slate-100">
                {editingPhase ? (
                  <button
                    type="button"
                    onClick={handleDeletePhase}
                    className="px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold"
                  >
                    削除
                  </button>
                ) : (
                  <div />
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    保存する
                  </button>
                </div>
              </div>
"""

content = content.replace(footer_before, footer_after)

# also fix lucide-react import if Sparkles isn't there in workspace kanban.. it's fine.

with open('src/components/workspace/WorkspaceRoadmap.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("patched WorkspaceRoadmap")
