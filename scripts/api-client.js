// API Base URL（開発環境と本番環境で切り替え）
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : `/api`;

// プロジェクト一覧を取得
async function fetchProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Fetched projects:', result);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// 投稿を取得（プロジェクト ID でフィルター可能）
async function fetchSubmissions(projectId = null) {
  try {
    let url = `${API_BASE_URL}/submissions`;
    if (projectId) {
      url += `?project_id=${projectId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Fetched submissions:', result);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
}

// 新規投稿を作成
async function createSubmission(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Created submission:', result);
    return result;
  } catch (error) {
    console.error('Error creating submission:', error);
    throw error;
  }
}

// ダッシュボード統計を取得
async function fetchDashboardStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Fetched dashboard stats:', result);
    return result.data || {};
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalVoices: 0,
      sentiment: { positive: 0, suggestion: 0, neutral: 0, concern: 0 },
      keywords: [],
      workshops: 0,
      onlineProjects: 0,
      archives: 0,
      sparklineData: []
    };
  }
}

// ワークスペースタスクを取得
async function fetchWorkspaceTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/workspace-tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Fetched workspace tasks:', result);
    return result.data || {};
  } catch (error) {
    console.error('Error fetching workspace tasks:', error);
    return {
      allTasks: [],
      byStatus: {
        backlog: [],
        'in-progress': [],
        'under-review': [],
        done: []
      },
      byMember: {},
      totalTasks: 0,
      completedTasks: 0
    };
  }
}

// API 状態確認（接続テスト用）
async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET'
    });
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}
