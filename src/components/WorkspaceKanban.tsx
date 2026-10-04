import React, { useState } from 'react';
import { IdeaSubmission, SystemSettings, CMSArticle, TeamMember, UserRole, WorkspaceTask, RecruitmentPost } from '../types';
import { 
  BarChart3, Layers, 
  ClipboardList, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  Pin, 
  FolderGit2, 
  Settings, 
  Globe, 
  ShieldCheck, 
  KeyRound, 
  User, 
  PlusCircle, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink,
  Send,
  Download,
  AlertCircle,
  FileSpreadsheet,
  Users,
  Briefcase,
  Layers,
  UserCheck,
  UploadCloud,
  ArrowLeft
} from 'lucide-react';
import { AdminModeration } from './AdminModeration';
import { UserRoleManagement } from './UserRoleManagement';
import { RecruitmentAdmin } from './RecruitmentAdmin';
import { SurveyApp } from './survey/SurveyApp';
import { IntegratedAnalysis } from './workspace/IntegratedAnalysis';
import { WorkshopDataImporter } from './WorkshopDataImporter';
import { WorkspaceDashboard } from './workspace/WorkspaceDashboard';
import { WorkspaceTasks } from './workspace/WorkspaceTasks';
import { WorkspaceCalendar } from './workspace/WorkspaceCalendar';
import { WorkspaceChat } from './workspace/WorkspaceChat';
import { WorkspaceRoadmap } from './workspace/WorkspaceRoadmap';
import { WorkspaceDrive } from './workspace/WorkspaceDrive';

interface WorkspaceKanbanProps {
  tasks?: WorkspaceTask[];
  submissions?: IdeaSubmission[];
  currentRole?: UserRole;
  onUpdateTaskStage?: (taskId: string, newStage: WorkspaceTask['stage']) => void;
  onUpdateTaskStatus?: (taskId: string, newStage: any) => void;
  onAddTask?: (newTask: Partial<WorkspaceTask>) => void;
  onNavigateTab?: (tab: string) => void;
  onSwitchRole?: (role: UserRole) => void;
  // Admin integration props
  systemSettings?: SystemSettings;
  onUpdateSettings?: (newSettings: SystemSettings) => void;
  cmsArticles?: CMSArticle[];
  onCreateArticle?: (newArticle: Partial<CMSArticle>) => void;
  onOpenExportModal?: () => void;
  members?: TeamMember[];
  onUpdateMemberRole?: (memberId: string, newRole: UserRole) => void;
  onAddMember?: (newMember: Partial<TeamMember>) => void;
  onDeleteMember?: (memberId: string) => void;
  onUpdateSubmissionStatus?: (id: string, newStatus: IdeaSubmission['status']) => void;
  recruitmentPosts?: RecruitmentPost[];
  onCreateRecruitmentPost?: (newPost: Partial<RecruitmentPost>) => void;
  onImportSubmissions?: (newSubmissions: IdeaSubmission[]) => void;
  onImportTasks?: (newTasks: WorkspaceTask[]) => void;
}

type WorkspaceMenuKey = 
  | 'dashboard'
  | 'tasks'
  | 'calendar'
  | 'chat'
  | 'roadmap'
  | 'drive'
  | 'survey'
  | 'integrated_analysis'
  | 'ws_import'
  | 'admin_portal'
  | 'user_roles'
  | 'recruitment_mgmt'
  | 'settings'
  | 'google_sites'
  | 'login_switch';

export const WorkspaceKanban: React.FC<WorkspaceKanbanProps> = ({
  tasks = [],
  submissions = [],
  currentRole = 'admin',
  onUpdateTaskStage,
  onUpdateTaskStatus,
  onAddTask,
  onNavigateTab,
  onSwitchRole,
  systemSettings,
  onUpdateSettings,
  cmsArticles = [],
  onCreateArticle,
  onOpenExportModal,
  members = [],
  onUpdateMemberRole,
  onAddMember,
  onDeleteMember,
  onUpdateSubmissionStatus,
  onDeleteSubmission,
  recruitmentPosts = [],
  onCreateRecruitmentPost,
  onImportSubmissions,
  onImportTasks
}) => {
  const safeTasks = tasks || [];
  const safeSubmissions = submissions || [];

  // Active Menu in the Sidebar (Default to 'roadmap' as user requested, or easily navigate)
  const [activeMenu, setActiveMenu] = useState<WorkspaceMenuKey>('roadmap');

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#0d2137]">
      
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR (Desktop only - Dark Navy Background #0d2137)   */}
      {/* ------------------------------------------------------------- */}
      <aside className="hidden lg:flex w-64 bg-[#0d2137] text-slate-200 flex-col shrink-0 border-r border-[#1a3556] select-none">
        
        {/* Workspace Brand Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-[#1a3556]">
          <div className="w-6 h-6 rounded-full border-2 border-emerald-400 flex items-center justify-center shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          </div>
          <span className="font-bold text-white text-sm tracking-tight leading-tight">
            柳井市まちなか共創<br />プラットフォーム
          </span>
        </div>

        {/* Navigation List */}
        <div className="flex-1 py-4 px-2 space-y-6 overflow-y-auto">
          
          {/* Section 1: メイン */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              メイン
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveMenu('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeMenu === 'dashboard'
                    ? 'bg-[#1b3d63] text-white font-bold'
                    : 'text-slate-300 hover:bg-[#152e4d] hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>ダッシュボード</span>
              </button>

              <button
                onClick={() => setActiveMenu('tasks')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeMenu === 'tasks'
                    ? 'bg-[#1b3d63] text-white font-bold'
                    : 'text-slate-300 hover:bg-[#152e4d] hover:text-white'
                }`}
              >
                <ClipboardList className="w-4 h-4 text-amber-400" />
                <span>タスク管理</span>
              </button>

              <button
                onClick={() => setActiveMenu('calendar')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeMenu === 'calendar'
                    ? 'bg-[#1b3d63] text-white font-bold'
                    : 'text-slate-300 hover:bg-[#152e4d] hover:text-white'
                }`}
              >
                <CalendarIcon className="w-4 h-4 text-rose-400" />
                <span>カレンダー</span>
              </button>
            </div>
          </div>

          {/* Section 2: コラボレーション */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              コラボレーション
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveMenu('chat')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeMenu === 'chat'
                    ? 'bg-[#1b3d63] text-white font-bold'
                    : 'text-slate-300 hover:bg-[#152e4d] hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>プロジェクト協働チャット</span>
              </button>

              <button
                onClick={() => setActiveMenu('roadmap')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeMenu === 'roadmap'
                    ? 'bg-[#1b3d63] text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-[#152e4d] hover:text-white'
                }`}
              >
                <Pin className="w-4 h-4 text-rose-500" />
                <span>ロードマップ</span>
              </button>

              <button
                onClick={() => setActiveMenu('drive')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeMenu === 'drive'
                    ? 'bg-[#1b3d63] text-white font-bold'
                    : 'text-slate-300 hover:bg-[#152e4d] hover:text-white'
                }`}
              >
                <FolderGit2 className="w-4 h-4 text-indigo-400" />
                <span>共有ドライブ</span>
              </button>

              <button
                onClick={() => setActiveMenu('survey')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeMenu === 'survey'
                    ? 'bg-[#1b3d63] text-white font-bold'
                    : 'text-slate-300 hover:bg-[#152e4d] hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>アンケート分析</span>
              </button>

              <button
                onClick={() => setActiveMenu('ws_import')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeMenu === 'ws_import'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-[#152e4d] hover:text-white'
                }`}
              >
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span className="flex-1 text-left">WS資料・付箋取り込み</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-300 text-[9px] font-bold">
                  AI
                </span>
              </button>
            </div>
          </div>

          {/* Section: 管理者・特権メニュー */}
          {(currentRole === 'admin' || currentRole === 'recruiter') && (
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span>{currentRole === 'admin' ? '管理者・統括' : '運用管理'}</span>
                <span className="text-[10px] bg-amber-950/80 text-amber-300 px-1.5 py-0.2 rounded border border-amber-800/60 font-mono">
                  {currentRole}
                </span>
              </div>
              <div className="space-y-0.5">
                
                {/* Admin Portal */}
                {currentRole === 'admin' && (
                  <button
                    onClick={() => setActiveMenu('admin_portal')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeMenu === 'admin_portal'
                        ? 'bg-rose-950/70 text-rose-100 border border-rose-800/80 font-bold'
                        : 'text-slate-300 hover:bg-[#152e4d] hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>管理者ポータル (公開制御)</span>
                  </button>
                )}

                {/* User Role Management */}
                {currentRole === 'admin' && (
                  <button
                    onClick={() => setActiveMenu('user_roles')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeMenu === 'user_roles'
                        ? 'bg-indigo-950/70 text-indigo-100 border border-indigo-800/80 font-bold'
                        : 'text-slate-300 hover:bg-[#152e4d] hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="flex-1 text-left">メンバー権限管理</span>
                    {members.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-indigo-900 text-indigo-200 text-[10px] font-bold">
                        {members.length}
                      </span>
                    )}
                  </button>
                )}

                {/* Recruitment Management */}
                {(currentRole === 'admin' || currentRole === 'recruiter') && (
                  <button
                    onClick={() => setActiveMenu('recruitment_mgmt')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeMenu === 'recruitment_mgmt'
                        ? 'bg-emerald-950/70 text-emerald-100 border border-emerald-800/80 font-bold'
                        : 'text-slate-300 hover:bg-[#152e4d] hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>要員募集・応募者管理</span>
                  </button>
                )}

              </div>
            </div>
          )}

          {/* Section 3: 設定 */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              設定
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveMenu('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeMenu === 'settings'
                    ? 'bg-[#1b3d63] text-white font-bold'
                    : 'text-slate-300 hover:bg-[#152e4d] hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>ワークスペース設定</span>
              </button>

              <button
                onClick={() => setActiveMenu('google_sites')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeMenu === 'google_sites'
                    ? 'bg-[#1b3d63] text-white font-bold'
                    : 'text-slate-300 hover:bg-[#152e4d] hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4 text-teal-400" />
                <span>Google Sites代替版</span>
              </button>

              <button
                onClick={() => {
                  const roles: UserRole[] = ['citizen', 'recruiter', 'workspace', 'admin'];
                  const currentIndex = roles.indexOf(currentRole as UserRole);
                  const nextRole: UserRole = roles[(currentIndex >= 0 ? currentIndex + 1 : 0) % roles.length];
                  if (onSwitchRole) {
                    onSwitchRole(nextRole);
                  }
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-[#152e4d] hover:text-white transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-yellow-400" />
                <div className="flex items-center justify-between flex-1">
                  <span>権限切替</span>
                  <span className="text-[10px] text-amber-300 font-bold bg-[#1a3556] px-1.5 py-0.5 rounded">
                    {currentRole}
                  </span>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* User Info Footer in Sidebar */}
        <div className="p-3 border-t border-[#1a3556] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-bold text-white truncate text-[11px]">
                {currentRole === 'admin' ? '柳井市都市計画課' : '推進メンバー'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {currentRole}
              </div>
            </div>
          </div>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('portal')}
              className="p-1.5 rounded-lg bg-[#1b3d63] hover:bg-[#254f7e] text-slate-200 transition-colors"
              title="ポータル総合トップに戻る"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>

      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA                                             */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 overflow-y-auto bg-slate-100 flex flex-col">
        
        {/* Mobile / Tablet Horizontal Navigation Tabs */}
        <div className="lg:hidden bg-[#0d2137] text-white p-2.5 flex items-center gap-2 overflow-x-auto border-b border-[#1a3556] shrink-0">
          {[
            { key: 'dashboard', label: 'ダッシュボード', icon: BarChart3 },
            { key: 'tasks', label: 'タスク管理', icon: ClipboardList },
            { key: 'calendar', label: 'カレンダー', icon: CalendarIcon },
            { key: 'chat', label: '協働チャット', icon: MessageSquare },
            { key: 'roadmap', label: 'ロードマップ', icon: Pin },
            { key: 'drive', label: '共有ドライブ', icon: FolderGit2 },
            { key: 'survey', label: 'アンケート分析', icon: BarChart3 },
            { key: 'ws_import', label: 'WS取り込み', icon: UploadCloud }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveMenu(tab.key as WorkspaceMenuKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  activeMenu === tab.key
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          
          {/* 1. DASHBOARD */}
          {activeMenu === 'dashboard' && (
            <WorkspaceDashboard submissions={safeSubmissions} />
          )}

          {/* 2. TASKS KANBAN */}
          {activeMenu === 'tasks' && (
            <WorkspaceTasks
              tasks={safeTasks}
              submissions={safeSubmissions}
              currentRole={currentRole}
              onUpdateTaskStage={onUpdateTaskStage || onUpdateTaskStatus}
              onAddTask={onAddTask}
            />
          )}

          {/* 3. CALENDAR */}
          {activeMenu === 'calendar' && (
            <WorkspaceCalendar />
          )}

          {/* 4. CHAT */}
          {activeMenu === 'chat' && (
            <WorkspaceChat currentRole={currentRole} />
          )}

          {/* 5. ROADMAP */}
          {activeMenu === 'roadmap' && (
            <WorkspaceRoadmap />
          )}

          {/* 6. DRIVE */}
          {activeMenu === 'drive' && (
            <WorkspaceDrive currentRole={currentRole} />
          )}

          {/* 7. SURVEY */}
          {activeMenu === 'survey' && (
            <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <SurveyApp />
            </div>
          )}

          {/* 8. WS DATA IMPORTER */}
          {activeMenu === 'ws_import' && (
            <WorkshopDataImporter
              onImportSubmissions={onImportSubmissions}
              onImportTasks={onImportTasks}
            />
          )}

          {/* 8. ADMIN PORTAL */}
          {activeMenu === 'admin_portal' && (
            <div className="space-y-6">
              <AdminModeration
                submissions={safeSubmissions}
                onUpdateStatus={onUpdateSubmissionStatus || (() => {})}
                cmsArticles={cmsArticles}
                onCreateArticle={onCreateArticle}
                onOpenExportModal={onOpenExportModal}
              />
            </div>
          )}

          {/* 9. USER ROLE MANAGEMENT */}
          {activeMenu === 'user_roles' && (
            <UserRoleManagement
              members={members}
              onUpdateRole={onUpdateMemberRole || (() => {})}
              onAddMember={onAddMember}
              onDeleteMember={onDeleteMember}
            />
          )}

          {/* 10. RECRUITMENT MANAGEMENT */}
          {activeMenu === 'recruitment_mgmt' && (
            <RecruitmentAdmin
              posts={recruitmentPosts}
              onCreatePost={onCreateRecruitmentPost}
            />
          )}

          {/* 11. WORKSPACE SETTINGS */}
          {activeMenu === 'settings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">ワークスペース環境設定</h2>
                <p className="text-xs text-slate-500 mt-1">Google Apps Script連携・APIキー・バックアップ設定</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-800">GAS スプレッドシート連携URL</div>
                  <div className="text-xs text-slate-500">
                    環境変数 <code>VITE_GAS_API_URL</code> に設定されたエンドポイント
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={import.meta.env.VITE_GAS_API_URL || 'https://script.google.com/macros/s/.../exec'}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-600"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-800">運用コスト試算</div>
                  <div className="text-xs text-slate-500">Google Workspace無料枠およびGAS運用</div>
                  <div className="text-xl font-black text-emerald-600">¥0 / 月 (完全無料)</div>
                </div>
              </div>
            </div>
          )}

          {/* 12. GOOGLE SITES ALTERNATIVE */}
          {activeMenu === 'google_sites' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Google Sites 連携・埋め込み</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    庁内ポータルや外部向けGoogleサイトにiframe埋め込み可能なURL
                  </p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800">埋め込みコード</div>
                <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
                  {`<iframe src="${window.location.origin}" width="100%" height="800px" frameborder="0"></iframe>`}
                </pre>
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
};
