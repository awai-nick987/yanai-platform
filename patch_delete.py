import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

func_before = """  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm('この投稿を本当に削除してもよろしいですか？（この操作は取り消せません）')) return;
    try {
      await deleteSubmissionFromDb(id);
    } catch (e) {
      console.error(e);
      alert('削除に失敗しました');
    }
  };"""

func_after = """  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm('この投稿を本当に削除してもよろしいですか？（この操作は取り消せません）')) return;
    try {
      setSubmissions(prev => prev.filter(s => s.id !== id));
      await deleteSubmissionFromDb(id);
    } catch (e) {
      console.error(e);
      alert('削除に失敗しました');
    }
  };"""
content = content.replace(func_before, func_after)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
