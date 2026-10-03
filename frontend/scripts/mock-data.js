/* ════════════════════════════════════════════════════════════════
   MOCK DATA REPOSITORY
   Yanai Citizen Participation Platform - Demo Data
   ════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════
// PROJECTS DATA
// ═══════════════════════════════════════════════════════════════

const PROJECTS = [
  {
    id: 'proj_001',
    type: 'ws',
    badge: 'open',
    icon: '🌊',
    bg: 'linear-gradient(135deg,#D0F0EB,#9FE1CB)',
    category: 'ワークショップ',
    title: '柳井湾岸エリアの活用アイデアを募集',
    description: '海辺のまちづくりについてのワークショップ',
    voices: 87,
    date: '締切：3月31日',
    deadline: '2025-03-31',
    status: 'open'
  },
  {
    id: 'proj_002',
    type: 'idea',
    badge: 'open',
    icon: '🏘',
    bg: 'linear-gradient(135deg,#FFF0C2,#FAC775)',
    category: 'アイデア募集',
    title: 'まちなか空き店舗・空き地の活用方法',
    description: '市内の空き店舗をどう活用するか',
    voices: 124,
    date: '締切：4月15日',
    deadline: '2025-04-15',
    status: 'open'
  },
  {
    id: 'proj_003',
    type: 'ws',
    badge: 'soon',
    icon: '🚶',
    bg: 'linear-gradient(135deg,#E6F1FB,#85B7EB)',
    category: 'ワークショップ',
    title: '歩行者にやさしい道路・広場づくり',
    description: '歩きやすい道路環境について',
    voices: 56,
    date: '3月15日 14:00〜',
    deadline: '2025-03-15',
    status: 'soon'
  },
  {
    id: 'proj_004',
    type: 'plan',
    badge: 'done',
    icon: '🌿',
    bg: 'linear-gradient(135deg,#EAF3DE,#97C459)',
    category: '計画策定',
    title: '柳井まちなか緑地・公園基本計画',
    description: '緑地と公園のマスタープラン',
    voices: 186,
    date: '2024年12月終了',
    deadline: '2024-12-31',
    status: 'done'
  },
  {
    id: 'proj_005',
    type: 'idea',
    badge: 'open',
    icon: '🎪',
    bg: 'linear-gradient(135deg,#FAECE7,#F0997B)',
    category: 'イベント企画',
    title: 'まちなかイベント・マルシェの開催計画',
    description: 'フェスティバルやマルシェのアイデア',
    voices: 43,
    date: '締切：5月1日',
    deadline: '2025-05-01',
    status: 'open'
  },
  {
    id: 'proj_006',
    type: 'plan',
    badge: 'soon',
    icon: '🏛',
    bg: 'linear-gradient(135deg,#EEEEF6,#B4B2A9)',
    category: '歴史・文化',
    title: '白壁の町並み・歴史的景観の保全と活用',
    description: '歴史的建造物の活用について',
    voices: 0,
    date: '4月開始予定',
    deadline: '2025-04-01',
    status: 'soon'
  }
];

// ═══════════════════════════════════════════════════════════════
// SUBMISSIONS DATA
// ═══════════════════════════════════════════════════════════════

const SUBMISSIONS = [
  {
    id: 'sub_001',
    projectId: 'proj_001',
    content: '柳井湾に観光施設を作ってはどうか？地元産品の販売所があれば良い。',
    author: { ageGroup: '40代', anonymous: false, name: '柳井 花子' },
    sentiment: { label: 'suggestion', score: 0.89, confidence: 0.92 },
    keywords: ['観光', '施設', '地元産品'],
    autoFlag: null,
    createdAt: '2025-03-19 14:23',
    status: 'pending_review'
  },
  {
    id: 'sub_002',
    projectId: 'proj_002',
    content: '駅前の整備は無駄では…',
    author: { ageGroup: '30代', anonymous: true, name: null },
    sentiment: { label: 'concern', score: 0.45, confidence: 0.62 },
    keywords: ['駅前', '整備'],
    autoFlag: { reason: 'low_confidence', severity: 'warning' },
    createdAt: '2025-03-19 09:15',
    status: 'pending_review'
  },
  {
    id: 'sub_003',
    projectId: 'proj_001',
    content: '海辺はカフェがあると良いですね。若い世代の人口流出も防げるかも。',
    author: { ageGroup: '20代', anonymous: false, name: '山田 太郎' },
    sentiment: { label: 'suggestion', score: 0.76, confidence: 0.88 },
    keywords: ['カフェ', '若年層'],
    autoFlag: null,
    createdAt: '2025-03-19 11:45',
    status: 'approved'
  },
  {
    id: 'sub_004',
    projectId: 'proj_005',
    content: 'Follow @influencer for city deals!!!',
    author: { ageGroup: null, anonymous: true, name: null },
    sentiment: { label: 'spam', score: 0.95, confidence: 0.99 },
    keywords: [],
    autoFlag: { reason: 'likely_spam', severity: 'high' },
    createdAt: '2025-03-19 08:30',
    status: 'rejected'
  },
  {
    id: 'sub_005',
    projectId: 'proj_002',
    content: 'シャッター街を活性化するのは大賛成。チャレンジショップを支援してほしい。',
    author: { ageGroup: '50代', anonymous: false, name: '佐藤 次郎' },
    sentiment: { label: 'positive', score: 0.92, confidence: 0.95 },
    keywords: ['シャッター街', 'チャレンジショップ'],
    autoFlag: null,
    createdAt: '2025-03-18 16:20',
    status: 'approved'
  }
];

// ═══════════════════════════════════════════════════════════════
// DASHBOARD DATA
// ═══════════════════════════════════════════════════════════════

const DASHBOARD = {
  totalVoices: 342,
  sentiment: {
    positive: 52,
    suggestion: 28,
    neutral: 14,
    concern: 6
  },
  keywords: [
    { label: '海・水辺', count: 82 },
    { label: '空き店舗', count: 67 },
    { label: '歩道・広場', count: 54 },
    { label: '緑・公園', count: 45 },
    { label: 'イベント', count: 38 }
  ],
  sparkline: [30, 45, 38, 60, 52, 75, 65, 88, 100],
  weeklyTrend: '+18%'
};

// ═══════════════════════════════════════════════════════════════
// TEAM MEMBERS DATA
// ═══════════════════════════════════════════════════════════════

const TEAM_MEMBERS = [
  {
    id: 'member_001',
    name: '山田太郎',
    role: 'admin',
    email: 'yamada@yanai-city.jp',
    avatar: '👨',
    taskCount: 3
  },
  {
    id: 'member_002',
    name: '佐藤花子',
    role: 'moderator',
    email: 'sato@yanai-city.jp',
    avatar: '👩',
    taskCount: 4
  },
  {
    id: 'member_003',
    name: '新部美咲',
    role: 'analyst',
    email: 'shinbe@yanai-city.jp',
    avatar: '👧',
    taskCount: 2
  }
];

// ═══════════════════════════════════════════════════════════════
// TASKS DATA
// ═══════════════════════════════════════════════════════════════

const TASKS = [
  {
    id: 'task_001',
    title: 'WS準備: 3月15日版プレゼン資料作成',
    status: 'in_progress',
    assignee: '山田太郎',
    dueDate: '2025-03-14',
    priority: 'high'
  },
  {
    id: 'task_002',
    title: '議事録作成: 前回WS',
    status: 'done',
    assignee: '佐藤花子',
    dueDate: '2025-03-10',
    priority: 'medium'
  },
  {
    id: 'task_003',
    title: '次回日程の打合せ',
    status: 'backlog',
    assignee: '新部美咲',
    dueDate: '2025-03-25',
    priority: 'medium'
  },
  {
    id: 'task_004',
    title: '投稿データの月次集計',
    status: 'in_progress',
    assignee: '新部美咲',
    dueDate: '2025-03-31',
    priority: 'high'
  },
  {
    id: 'task_005',
    title: 'Google Driveへのアップロード',
    status: 'backlog',
    assignee: '山田太郎',
    dueDate: '2025-04-01',
    priority: 'low'
  }
];

// ═══════════════════════════════════════════════════════════════
// CHAT MESSAGES DATA
// ═══════════════════════════════════════════════════════════════

const CHAT_CHANNELS = {
  general: [
    { author: '山田太郎', message: 'おはようございます！', time: '09:00' },
    { author: '佐藤花子', message: '朝のレポート確認しました。投稿が増えてますね。', time: '09:05' },
    { author: '山田太郎', message: 'そうですね。3月15日のWSに向けて準備を進めています。', time: '09:10' }
  ],
  'project-sea': [
    { author: '新部美咲', message: '海・水辺エリアの投稿が87件になりました', time: '14:30' },
    { author: '佐藤花子', message: 'カフェの提案が多く出ていますね', time: '14:35' }
  ],
  'admin-alerts': [
    { author: 'System', message: '⚠️ 低信度の投稿が3件フラグされました', time: '08:00' },
    { author: '山田太郎', message: '確認しました。うち2件は承認、1件は要確認です。', time: '08:15' }
  ]
};

// ═══════════════════════════════════════════════════════════════
// GANTT CHART DATA
// ═══════════════════════════════════════════════════════════════

const GANTT_ITEMS = [
  {
    name: '【WS】柳井湾岸エリア',
    status: '完了',
    startDate: '2025-02-15',
    dueDate: '2025-03-15',
    progress: 100
  },
  {
    name: '【Online】空き店舗',
    status: '進行中',
    startDate: '2025-02-20',
    dueDate: '2025-04-15',
    progress: 65
  },
  {
    name: '【計画】基本計画策定',
    status: '予定',
    startDate: '2025-04-01',
    dueDate: '2025-05-31',
    progress: 0
  },
  {
    name: '【企画】イベント計画',
    status: '予定',
    startDate: '2025-05-01',
    dueDate: '2025-06-30',
    progress: 0
  }
];

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Filter projects by type
 */
function filterProjectsByType(type) {
  if (type === 'all') return PROJECTS;
  return PROJECTS.filter(p => p.type === type);
}

/**
 * Get submissions for a specific project
 */
function getProjectSubmissions(projectId) {
  return SUBMISSIONS.filter(s => s.projectId === projectId);
}

/**
 * Get pending submissions for moderation
 */
function getPendingSubmissions() {
  return SUBMISSIONS.filter(s => s.status === 'pending_review');
}

/**
 * Get approved submissions
 */
function getApprovedSubmissions() {
  return SUBMISSIONS.filter(s => s.status === 'approved');
}

/**
 * Update submission status
 */
function updateSubmissionStatus(submissionId, newStatus) {
  const submission = SUBMISSIONS.find(s => s.id === submissionId);
  if (submission) {
    submission.status = newStatus;
    return submission;
  }
  return null;
}

/**
 * Get tasks by status
 */
function getTasksByStatus(status) {
  if (status === 'all') return TASKS;
  return TASKS.filter(t => t.status === status);
}

/**
 * Get tasks by assignee
 */
function getTasksByAssignee(memberName) {
  return TASKS.filter(t => t.assignee === memberName);
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}月${day}日`;
}

/**
 * Get sentiment label in Japanese
 */
function getSentimentLabel(label) {
  const labels = {
    positive: '👍 ポジティブ',
    suggestion: '💡 提案・疑問',
    neutral: '⚠️ 中立',
    concern: '😟 懸念',
    spam: '🚫 スパム'
  };
  return labels[label] || label;
}

/**
 * Calculate sentiment percentage
 */
function getSentimentPercentage(label) {
  const total = Object.values(DASHBOARD.sentiment).reduce((a, b) => a + b, 0);
  return DASHBOARD.sentiment[label] ? Math.round((DASHBOARD.sentiment[label] / total) * 100) : 0;
}

/**
 * Export data for external use
 */
function exportToCSV() {
  const headers = ['ID', 'プロジェクト', '内容', '感情', '状態'];
  const rows = SUBMISSIONS.map(s => [
    s.id,
    PROJECTS.find(p => p.id === s.projectId)?.title || 'Unknown',
    s.content.substring(0, 50),
    getSentimentLabel(s.sentiment.label),
    s.status
  ]);

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  return csv;
}

// ═══════════════════════════════════════════════════════════════
// EXPORT ALL DATA
// ═══════════════════════════════════════════════════════════════

const MockData = {
  PROJECTS,
  SUBMISSIONS,
  DASHBOARD,
  TEAM_MEMBERS,
  TASKS,
  CHAT_CHANNELS,
  GANTT_ITEMS,
  // Utility functions
  filterProjectsByType,
  getProjectSubmissions,
  getPendingSubmissions,
  getApprovedSubmissions,
  updateSubmissionStatus,
  getTasksByStatus,
  getTasksByAssignee,
  formatDate,
  getSentimentLabel,
  getSentimentPercentage,
  exportToCSV
};

// Make available in global scope for HTML usage
if (typeof window !== 'undefined') {
  window.MockData = MockData;
}
