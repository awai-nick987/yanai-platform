import re

with open('src/components/AdminModeration.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

btn_before = """                  <button
                    onClick={() => onUpdateStatus(sub.id, 'rejected')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-800 transition-all cursor-pointer"
                  >
                    却下
                  </button>
                </div>"""

btn_after = """                  <button
                    onClick={() => onUpdateStatus(sub.id, 'rejected')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-100 hover:bg-orange-200 text-orange-800 transition-all cursor-pointer"
                  >
                    却下
                  </button>
                  {onDeleteSubmission && (
                    <button
                      onClick={() => {
                        if (window.confirm('このアイデアを完全に削除しますか？')) {
                          onDeleteSubmission(sub.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer flex items-center gap-1"
                      title="削除"
                    >
                      <Trash2 className="w-3 h-3" />
                      削除
                    </button>
                  )}
                </div>"""
content = content.replace(btn_before, btn_after)

with open('src/components/AdminModeration.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
