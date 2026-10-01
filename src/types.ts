export type UserRole = 'citizen' | 'recruiter' | 'workspace' | 'admin';

export type CategoryType = 
  | 'value_creation' // 価値創造
  | 'improvement'    // 改善点
  | 'shirakabe_view' // 白壁・景観保全
  | 'youth_student'  // 若者・高校生
  | 'downtown_buzz'  // まちなか賑わい
  | 'traffic_walk'   // 交通・ウォーカブル
  | 'culture_event'; // 観光・イベント

export type AgeGroup = 
  | 'teens'     // 10代（高校生・柳井学園・柳井高校等）
  | 'twenties_thirties' // 20〜30代（若手社会人・子育て世代）
  | 'forties_fifties'   // 40〜50代（現役世代・事業者）
  | 'sixties_plus';     // 60代以上（シニア・地域役員）

export type ResidencyArea = 
  | 'downtown_station'  // 柳井駅前・中心市街地
  | 'shirakabe_area'    // 白壁の町並み周辺
  | 'suburban_yanai'    // 柳井市内郊外（伊陸・日積・大畠・余田等）
  | 'school_commute'    // 柳井学園・柳井高校在校生（通学）
  | 'outside_commute'   // 市外からの通勤・来訪
  | 'tourism_relation'; // 観光・関係人口

export type SubmissionStatus = 'pending' | 'approved' | 'in_review' | 'reflected' | 'rejected';

export interface IdeaSubmission {
  id: string;
  title: string;
  category: CategoryType;
  description: string;
  authorName: string;
  ageGroup: AgeGroup;
  residency: ResidencyArea;
  organization?: string;
  locationName: string;
  lat: number;
  lng: number;
  expectationScore: number; // 住民期待度 (1-100)
  feasibilityScore: number; // 実現可能性 (1-100)
  upvotes: number;
  downvotes: number;
  status: SubmissionStatus;
  createdAt: string;
  imageUrl?: string;
  tags: string[];
  moderationNotes?: string;
  adminAssignedPhase?: 'quick_win' | 'strategic' | 'low_hanging' | 'long_term';
  committeeComments?: string;
}

export interface VisionOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  votes: number;
  tags: string[];
  imageUrl: string;
  keyProjects: string[];
}

export interface RecruitmentPost {
  id: string;
  title: string;
  category: string;
  organizer: string;
  targetAudience: string;
  location: string;
  date: string;
  capacity: number;
  currentApplicants: number;
  description: string;
  tags: string[];
  status: 'recruiting' | 'closed';
  linkedPocId?: string;
}

export interface PocQuantitativeKpi {
  id: string;
  name: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  note?: string;
}

export interface PocQualitativeKpi {
  id: string;
  name: string;
  targetState: string;
  currentStatus: 'not_started' | 'in_progress' | 'achieved' | 'exceeded';
  progressPercent: number; // 0 - 100
  observation?: string;
}

export interface PocReportKpiResult {
  metricName: string;
  target: string;
  actual: string;
  achievementRate: number; // %
  evaluationComment: string;
}

export interface PocReport {
  id: string;
  projectId: string;
  projectTitle: string;
  submittedAt: string;
  authorName: string;
  authorRole: string;
  authorOrg: string;
  
  // 1. エグゼクティブサマリー（総括・実施結果）
  summary: {
    overallRating: 'great_success' | 'success' | 'partial_success' | 'needs_improvement';
    oneLineSummary: string;
    actualPeriod: string;
    actualLocation: string;
    participantCount: number;
    budgetUsed?: string;
  };

  // 2. 仮説検証結果（Hypothesis Verification）
  hypothesisResult: {
    originalHypothesis: string;
    isVerified: 'verified' | 'partial' | 'unverified';
    analysisDetails: string;
    keyFindings: string[];
    unexpectedOutcomes?: string;
  };

  // 3. KPI達成度分析（KPI Achievement & Analytics）
  kpiResults: PocReportKpiResult[];

  // 4. 市民・参加者の声・アンケート結果（Participant Voices & Feedback）
  feedback: {
    satisfactionScore: number; // % (0-100)
    positiveQuotes: string[];
    improvementPoints: string[];
  };

  // 5. 課題と教訓（Challenges & Learned Lessons）
  challengesAndLessons: {
    operationalIssues: string;
    institutionalBarriers: string;
    lessonsLearned: string[];
  };

  // 6. 今後の実装・施策化への提言（Recommendations & Next Action）
  nextRecommendations: {
    commercializationFeasibility: 'high' | 'medium' | 'low';
    requiredSupport: string;
    nextActionPlan: string;
  };

  status: 'draft' | 'submitted' | 'approved';
}

export interface PocProject {
  id: string;
  title: string;
  subtitle: string;
  eyecatchImage: string;
  category: string;
  status: 'planning' | 'recruiting' | 'in_progress' | 'analyzing' | 'completed';
  workingGroupName: string;
  // 01. ビジョンと背景（Why）
  why: {
    vision: string;
    backgroundChallenges: string;
  };
  // 02. 実証実験の概要（What）
  what: {
    planDescription: string;
    period: string;
    location: string;
  };
  // 03. 検証内容と仮説（How）
  how: {
    hypothesis: string;
    testMethods: string[];
  };
  // 04. 評価指標（KPI / 定量・定性）
  kpi: {
    quantitative: string[];
    qualitative: string[];
    quantitativeMetrics?: PocQuantitativeKpi[];
    qualitativeMetrics?: PocQualitativeKpi[];
  };
  // 05. 体制・メンバー（Who）
  who: {
    leader: {
      name: string;
      title: string;
      organization: string;
      avatarUrl?: string;
      comment: string;
    };
    stakeholders: {
      name: string;
      role: string;
      organization: string;
    }[];
    partnerOrganizations: string[];
  };
  // 06. 今後の展開（Next Step）
  nextStep: {
    nextPhase: string;
    roadmap: string[];
  };
  // メンバー募集との連携
  recruitment: {
    isRecruiting: boolean;
    targetRoles: string[];
    capacity: number;
    currentApplicants: number;
  };
  // 終了後レポート（提出済みの場合）
  report?: PocReport;
  likesCount: number;
  updatedAt: string;
  tags: string[];
}

export interface WorkspaceTask {
  id: string;
  title: string;
  category: string;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  stage: 'ideas_pool' | 'committee_review' | 'trial_experiment' | 'plan_reflected';
  notes?: string;
  linkedSubmissionId?: string;
}

// 1. ロードマップ・ガントチャート項目
export interface RoadmapItem {
  id: string;
  title: string;
  category: string;
  workingGroup: string;
  startDate: string; // e.g. '2026-04-01'
  endDate: string;   // e.g. '2026-10-31'
  quarter: '2026_Q1' | '2026_Q2' | '2026_Q3' | '2026_Q4' | '2027_Q1' | '2027_Q2';
  progress: number;  // 0 - 100
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  milestoneTitle?: string;
  assignee: string;
  description: string;
}

// 2. チームカレンダー・日程イベント
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. '18:30 - 20:00'
  type: 'regular_meeting' | 'workshop' | 'field_survey' | 'poc_experiment' | 'presentation';
  location: string;
  isOnline: boolean;
  meetingUrl?: string; // Google Meet / Jitsi Meet / Zoom
  organizer: string;
  attendeesCount: number;
  description: string;
  agendaItems: string[];
}

// 3. チームチャット＆オンライン会議
export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  isPrivate?: boolean;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorOrg: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
  attachmentUrl?: string;
  attachmentName?: string;
  meetingLink?: {
    title: string;
    url: string;
    startsAt?: string;
  };
}

// 4. 30名メンバー名簿・プロジェクト体制
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  userRole?: UserRole; // 権限: 'admin' | 'workspace' | 'recruiter' | 'citizen'
  organization: string;
  departmentCategory: 'city_gov' | 'business_chamber' | 'youth_education' | 'citizen_volunteer' | 'expert_advisor';
  email: string;
  phone?: string;
  assignedWgs: string[];
  avatarUrl?: string;
  status: 'online' | 'busy' | 'offline';
  bio?: string;
}

// 5. 共有資料・議事録ライブラリ
export interface SharedDoc {
  id: string;
  title: string;
  category: 'minutes' | 'presentation' | 'survey' | 'guideline' | 'report';
  author: string;
  updatedAt: string;
  fileType: 'pdf' | 'slides' | 'sheet' | 'doc';
  url: string;
  summary: string;
  fileSize: string;
}

export interface CMSArticle {
  id: string;
  title: string;
  category: 'news' | 'committee_report' | 'workshop_info' | 'vision_progress';
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  isPublished: boolean;
}

export type DevicePreviewMode = 'auto' | 'mobile' | 'tablet' | 'desktop';

export type FrontendSectionKey = 
  | 'about'             // 柳井市まちなかまちづくりプロジェクトとは
  | 'projects'          // プロジェクト
  | 'vision'            // ビジョン投票
  | 'recruitment'       // 要員募集
  | 'submit_idea'       // 意見投稿
  | 'citizen_dashboard';// ダッシュボード

export interface SystemSettings {
  batchExecutionTime: string; // e.g. "03:00"
  reflectionMode: 'manual' | 'auto';
  lastAnalysisTimestamp: string;
  independentMode: boolean;
  spreadSheetSynced: boolean;
  spreadSheetId: string;
  sectionVisibility: {
    workshopPopup: boolean;
    mapSection: boolean;
    visionVoteSection: boolean;
    recruitmentSection: boolean;
    matrixAnalyticsSection: boolean;
    progressTimeline: boolean;
  };
  frontendSectionToggles: {
    about: boolean;             // 柳井市まちなかまちづくりプロジェクトとは
    projects: boolean;          // プロジェクト
    vision: boolean;            // ビジョン投票
    recruitment: boolean;       // 要員募集
    submit_idea: boolean;       // 意見投稿
    citizen_dashboard: boolean; // ダッシュボード
  };
}

export interface DemographicFilter {
  ageGroups: AgeGroup[];
  residencies: ResidencyArea[];
  categories: CategoryType[];
  statusList: SubmissionStatus[];
  searchQuery: string;
}
