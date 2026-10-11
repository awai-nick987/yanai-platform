export type UserRole = 'citizen' | 'recruiter' | 'workspace' | 'admin';

export type CategoryType = string | 'living_infrastructure' 
  | 'living_environment'    
  | 'living_community'      
  | 'bustle_landscape'      
  | 'bustle_tourism'        
  | 'other_concept'
  | 'value_creation'
  | 'improvement'
  | 'traffic_walk'
  | 'culture_event'
  | 'youth_student'
  | 'downtown_buzz';        

export type AgeGroup = string | 'under_10s'
  | '10s'
  | '20s'
  | '30s'
  | '40s'
  | '50s'
  | '60s'
  | '70s'
  | '80s_plus'
  | 'teens'
  | 'twenties_thirties'
  | 'forties_fifties'
  | 'sixties_plus';

export type ResidencyArea = string | 'yanai_student'     
  | 'commuter'          
  | 'downtown_resident' 
  | 'suburban_resident' 
  | 'tourist_fan'
  | 'downtown_station'
  | 'shirakabe_area'
  | 'school_commute'
  | 'suburban_yanai'
  | 'tourism_relation';      

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
  isHidden?: boolean;
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
  | 'hero'              // ヒーローヘッダー
  | 'about'             // 柳井市まちなかまちづくりプロジェクトとは
  | 'projects'          // プロジェクト
  | 'vision'            // ビジョン投票
  | 'town_map'          // まちなか共創マップ
  | 'idobata'           // まちなか井戸端会議
  | 'recruitment'       // 要員募集
  | 'submit_idea'       // 意見投稿
  | 'citizen_dashboard';// ダッシュボード

export interface SectionTextContent {
  badge?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText1?: string;
  ctaText2?: string;
  [key: string]: string | undefined;
}

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
    hero: boolean;              // ヒーローヘッダー
    about: boolean;             // 柳井市まちなかまちづくりプロジェクトとは
    projects: boolean;          // プロジェクト
    vision: boolean;            // ビジョン投票
    town_map?: boolean;         // まちなか共創マップ
    idobata: boolean;           // まちなか井戸端会議（移管ページ）
    recruitment: boolean;       // 要員募集
    submit_idea: boolean;       // 意見投稿
    citizen_dashboard: boolean; // ダッシュボード
    heroFloatingStats: boolean; // ヒーローエリアのフローティング統計
  };
  heroCustomTexts: {
    floatingSubTitle: string;
    floatingMainTitle: string;
  };
  customSectionTexts?: Record<string, SectionTextContent>;
}

export interface DemographicFilter {
  ageGroups: AgeGroup[];
  residencies: ResidencyArea[];
  categories: CategoryType[];
  statusList: SubmissionStatus[];
  searchQuery: string;
}

// ==========================================
// 権限管理・招待・本人確認申請の型定義（本番仕様）
// ==========================================
export interface InvitationRecord {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  invitedByName: string;
  issuedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired';
  used?: boolean;
}

export interface RoleApplicationRequest {
  id: string;
  name: string;
  email: string;
  organization: string;
  roleTitle?: string;
  requestedRole: UserRole;
  reason: string;
  verificationToken: string;
  isEmailVerified: boolean;
  emailVerified?: boolean;
  status: 'pending_verification' | 'pending_approval' | 'approved' | 'rejected' | 'pending';
  appliedAt: string;
  verifiedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

