import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app_content = f.read()

if 'deleteSubmissionFromDb' not in app_content:
    app_content = app_content.replace(
        "updateSubmissionStatus", 
        "updateSubmissionStatus, deleteSubmissionFromDb"
    )

if 'handleDeleteSubmission' not in app_content:
    handle_delete_code = """
  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm('この投稿を本当に削除してもよろしいですか？（この操作は取り消せません）')) return;
    try {
      await deleteSubmissionFromDb(id);
    } catch (e) {
      console.error(e);
      alert('削除に失敗しました');
    }
  };
"""
    app_content = app_content.replace(
        "  return (\n    <div className=", 
        handle_delete_code + "\n  return (\n    <div className="
    )

    app_content = app_content.replace(
        "onUpdateSubmissionStatus={handleUpdateStatus}",
        "onUpdateSubmissionStatus={handleUpdateStatus}\n              onDeleteSubmission={handleDeleteSubmission}"
    )
    app_content = app_content.replace(
        "onUpdateStatus={handleUpdateStatus}",
        "onUpdateStatus={handleUpdateStatus}\n              onDeleteSubmission={handleDeleteSubmission}"
    )

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_content)
