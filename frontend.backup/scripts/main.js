// DOM 要素
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const submitForm = document.getElementById('submit-form');
const formMessage = document.getElementById('form-message');
const postsList = document.getElementById('posts-list');

// タブ切り替え
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;
    
    // すべてのタブを非表示
    tabContents.forEach(content => content.classList.remove('active'));
    tabBtns.forEach(b => b.classList.remove('active'));
    
    // クリックされたタブを表示
    document.getElementById(tabName).classList.add('active');
    btn.classList.add('active');
    
    // 投稿一覧タブの場合、データを読み込む
    if (tabName === 'list') {
      loadPosts();
    }
    
    // ホームタブの場合、ダッシュボードを更新
    if (tabName === 'home') {
      updateDashboard();
    }
  });
});

// フォーム送信
submitForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    name: document.getElementById('name').value,
    age: document.getElementById('age').value,
    theme: document.getElementById('theme').value,
    content: document.getElementById('content').value
  };

  try {
    formMessage.textContent = '投稿中...';
    formMessage.classList.add('show', 'success');
    
    await ApiClient.createSubmission(data);
    
    formMessage.textContent = '✅ 投稿ありがとうございました！';
    formMessage.classList.add('show', 'success');
    formMessage.classList.remove('error');
    
    // フォーム初期化
    submitForm.reset();
    
    // 3秒後にメッセージを消す
    setTimeout(() => {
      formMessage.classList.remove('show');
    }, 3000);
    
  } catch (error) {
    formMessage.textContent = '❌ エラーが発生しました: ' + error.message;
    formMessage.classList.add('show', 'error');
    formMessage.classList.remove('success');
  }
});

// 投稿一覧読み込み
async function loadPosts() {
  postsList.innerHTML = '<p class="loading">読み込み中...</p>';
  
  try {
    const submissions = await ApiClient.getSubmissions();
    
    if (submissions.length === 0) {
      postsList.innerHTML = '<p class="loading">投稿がまだありません</p>';
      return;
    }
    
    postsList.innerHTML = submissions.map(post => `
      <div class="post-item">
        <div class="post-header">
          <span class="post-author">${post.author_name}</span>
          <span class="post-age">${post.author_age_group}</span>
        </div>
        <div class="post-theme">${post.theme}</div>
        <div class="post-content">${post.content}</div>
        <div class="post-time">${new Date(post.created_at).toLocaleString('ja-JP')}</div>
      </div>
    `).join('');
    
  } catch (error) {
    postsList.innerHTML = '<p class="loading">❌ 投稿の読み込みに失敗しました</p>';
  }
}

// ダッシュボード更新
async function updateDashboard() {
  try {
    const data = await ApiClient.getDashboard();
    document.getElementById('total-count').textContent = data.totalCount;
    document.getElementById('today-count').textContent = data.todayCount;
    document.getElementById('latest-time').textContent = data.latestTime;
  } catch (error) {
    console.error('Error updating dashboard:', error);
  }
}

// ページ読み込み時
document.addEventListener('DOMContentLoaded', () => {
  updateDashboard();
});
