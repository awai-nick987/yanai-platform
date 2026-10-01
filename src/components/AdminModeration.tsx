import React, { useState } from 'react';
import { IdeaSubmission, SystemSettings, CMSArticle, FrontendSectionKey, TeamMember, UserRole, WorkspaceTask } from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  PlusCircle, 
  Sliders, 
  FileText, 
  Send,
  Flag,
  Sparkles,
  UploadCloud,
  FileSpreadsheet,
  Calendar,
  Layers,
  Clock,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Bot,
  Users,
  Globe
} from 'lucide-react';
import { UserRoleManagement } from './UserRoleManagement';
import { WorkshopDataImporter } from './WorkshopDataImporter';

interface AdminModerationProps {
  submissions: IdeaSubmission[];
  onUpdateStatus: (id: string, newStatus: IdeaSubmission['status']) => void;
  systemSettings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  cmsArticles: CMSArticle[];
  onCreateArticle: (newArticle: Partial<CMSArticle>) => void;
  onOpenExportModal: () => void;
  members?: TeamMember[];
  onUpdateMemberRole?: (memberId: string, newRole: UserRole) => void;
  onAddMember?: (newMember: Partial<TeamMember>) => void;
  onDeleteMember?: (memberId: string) => void;
  onImportSubmissions?: (newSubmissions: IdeaSubmission[]) => void;
  onImportTasks?: (newTasks: WorkspaceTask[]) => void;
  onNavigateTab?: (tab: string) => void;
}

export const AdminModeration: React.FC<AdminModerationProps> = ({
  submissions,
  onUpdateStatus,
  systemSettings,
  onUpdateSettings,
  cmsArticles,
  onCreateArticle,
  onOpenExportModal,
  members = [],
  onUpdateMemberRole,
  onAddMember,
  onDeleteMember,
  onImportSubmissions,
  onImportTasks,
  onNavigateTab
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'visibility' | 'roles' | 'moderation' | 'ws_import' | 'morning_report' | 'cms'>('visibility');
  
  // CMS state
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState<CMSArticle['category']>('committee_report');
  const [articleSummary, setArticleSummary] = useState('');
  const [articleContent, setArticleContent] = useState('');

  // WS Import state
  const [wsTargetProject, setWsTargetProject] = useState('まちなか回遊改善');
  const [wsRawNotes, setWsRawNotes] = useState('');
  const [wsImportSuccess, setWsImportSuccess] = useState(false);

  const pendingCount = submissions.filter(s => s.status === 'in_review' || s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved' || s.status === 'reflected').length;
  const reflectedCount = submissions.filter(s => s.status === 'reflected').length;

  const currentToggles = systemSettings.frontendSectionToggles || {
    about: true,
    projects: true,
    vision: true,
    recruitment: true,
    submit_idea: true,
    citizen_dashboard: true
  };

  const handleToggleFrontendSection = (key: FrontendSectionKey) => {
    onUpdateSettings({
      ...systemSettings,
      frontendSectionToggles: {
        ...currentToggles,
        [key]: !currentToggles[key]
      }
    });
  };

  const handleCreateCmsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleContent.trim()) return;

    onCreateArticle({
      title: articleTitle.trim(),
      category: articleCategory,
      summary: articleSummary.trim() || articleTitle.trim(),
      content: articleContent.trim(),
      author: '柳井市役所 地域づくり推進課',
      publishedAt: new Date().toLocaleDateString('ja-JP') + ' ' + new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      isPublished: true
    });

    setArticleTitle('');
    setArticleSummary('');
    setArticleContent('');
  };

  const handleWsImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsRawNotes.trim()) return;
    setWsImportSuccess(true);
    setTimeout(() => {
      setWsImportSuccess(false);
      setWsRawNotes('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              柳井市 行政・管理者ポータル
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('home')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                title="市民向けトップページを表示"
              >
                <Globe className="w-3 h-3 text-blue-600" />
                <span>市民画面を表示</span>
              </button>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            システム設定＆フロント公開制御
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            グローバルメニューのOn/Off設定、投稿モデレーション、WS資料取り込み、朝のレポートを確認できます。
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200 gap-1">
          <button
            onClick={() => setActiveAdminTab('visibility')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeAdminTab === 'visibility'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            メニュー公開設定
          </button>

          <button
            onClick={() => setActiveAdminTab('roles')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'roles'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>メンバー権限管理</span>
            {members.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                {members.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('moderation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'moderation'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>投稿審査</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('morning_report')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeAdminTab === 'morning_report'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            朝のレポート
          </button>

          <button
            onClick={() => setActiveAdminTab('ws_import')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeAdminTab === 'ws_import'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            WS資料取り込み
          </button>

          <button
            onClick={() => setActiveAdminTab('cms')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeAdminTab === 'cms'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            広報CMS
          </button>
        </div>
      </div>

      {/* TAB: メンバー権限管理 (User Role Management) */}
      {activeAdminTab === 'roles' && (
        <UserRoleManagement
          members={members}
          onUpdateMemberRole={onUpdateMemberRole || (() => {})}
          onAddMember={onAddMember}
          onDeleteMember={onDeleteMember}
        />
      )}

      {/* TAB 1: メニュー公開設定 (User Requested: 6 Toggles) */}
      {activeAdminTab === 'visibility' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              住民フロントエンド グローバルメニュー表示/非表示設定
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              住民向けトップページおよびナビゲーションバーの各セクションの表示状態を即座に制御できます。
            </p>
          </div>

          {/* 6 Toggles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Toggle 1: 柳井市まちなかまちづくりプロジェクトとは */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  1. プロジェクトとは
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  柳井市まちなかまちづくりプロジェクトとは
                </p>
              </div>
              <button
                onClick={() => handleToggleFrontendSection('about')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  currentToggles.about ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    currentToggles.about ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: プロジェクト */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  2. プロジェクト
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  実証実験・ワーキンググループ一覧
                </p>
              </div>
              <button
                onClick={() => handleToggleFrontendSection('projects')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  currentToggles.projects ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    currentToggles.projects ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: ビジョン投票 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  3. ビジョン投票
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  市民投票シナリオ・合意形成
                </p>
              </div>
              <button
                onClick={() => handleToggleFrontendSection('vision')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  currentToggles.vision ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    currentToggles.vision ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 4: 要員募集 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  4. 要員募集
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  実証実験・WSサポーター募集一覧
                </p>
              </div>
              <button
                onClick={() => handleToggleFrontendSection('recruitment')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  currentToggles.recruitment ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    currentToggles.recruitment ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 5: 意見投稿 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  5. 意見投稿
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  市民意見投稿フォーム・属性収集
                </p>
              </div>
              <button
                onClick={() => handleToggleFrontendSection('submit_idea')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  currentToggles.submit_idea ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    currentToggles.submit_idea ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 6: ダッシュボード */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  6. ダッシュボード
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  市民データダッシュボード（感情分析）
                </p>
              </div>
              <button
                onClick={() => handleToggleFrontendSection('citizen_dashboard')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  currentToggles.citizen_dashboard ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    currentToggles.citizen_dashboard ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>

          {/* Quick A3 Export CTA */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              現在の設定は即座にブラウザおよび運用ストレージに反映されます。
            </div>
            <button
              onClick={onOpenExportModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>A3資料出力センターを開く</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: 投稿モデレーション */}
      {activeAdminTab === 'moderation' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                市民投稿モデレーションキュー ({submissions.length} 件)
              </h3>
              <p className="text-xs text-slate-500">
                市民からの投稿を承認すると、ダッシュボードやマップ・分析対象に組み込まれます。
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">承認済: {approvedCount}</span>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">審査中: {pendingCount}</span>
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-3">
            {submissions.map(sub => (
              <div
                key={sub.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      sub.status === 'approved' ? 'bg-emerald-600 text-white' :
                      sub.status === 'reflected' ? 'bg-blue-600 text-white' :
                      sub.status === 'rejected' ? 'bg-rose-600 text-white' :
                      'bg-amber-500 text-slate-950'
                    }`}>
                      {sub.status === 'approved' ? '承認済み' : sub.status === 'reflected' ? '施策反映' : sub.status === 'rejected' ? '却下' : '審査中'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{sub.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{sub.description}</p>
                  <div className="text-[11px] text-slate-400">
                    投稿者: {sub.authorName} ({sub.ageGroup}) | 投稿日時: {sub.createdAt}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onUpdateStatus(sub.id, 'approved')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer"
                  >
                    承認
                  </button>
                  <button
                    onClick={() => onUpdateStatus(sub.id, 'rejected')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-800 transition-all cursor-pointer"
                  >
                    却下
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 朝のレポート (Screenshot inspired) */}
      {activeAdminTab === 'morning_report' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 text-xs font-bold mb-2">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>夜間バッチ定期集計レポート</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                朝のレポート（毎朝 03:00 自動生成）
              </h3>
              <p className="text-xs text-slate-500">
                前日24時までに集まった市民意見・投票動向・感情スコアを自動集計したサマリーです。
              </p>
            </div>

            <div className="text-xs text-slate-400 font-medium">
              最終バッチ実行: <span className="font-bold text-slate-700">{systemSettings.lastAnalysisTimestamp}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-bold">新規意見数 (前日比)</div>
              <div className="text-2xl font-black text-slate-900 mt-1">+18 件</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">子育て・回遊分野が増加</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-bold">総投票数</div>
              <div className="text-2xl font-black text-blue-700 mt-1">1,348 票</div>
              <div className="text-[11px] text-slate-500 font-semibold mt-1">シナリオAが 48% をリード</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-bold">ポジティブ度</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">80 %</div>
              <div className="text-[11px] text-slate-500 font-semibold mt-1">共創・期待の声が多数</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-indigo-950 text-white space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>本日のAIインサイト（地域づくり推進課 向け）</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              「柳井駅前〜白壁の町並み」間の日陰・ベンチ不足についての意見が昨日から急増しています。特に高校生と高齢者からの投稿が重なっており、クイックウィン施策として「仮設ベンチ・緑陰スポットの実験設置」が高評価を得る可能性が高いと予測されます。
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: ワークショップ資料取り込み (マルチデータ・付箋取り込み) */}
      {activeAdminTab === 'ws_import' && (
        <WorkshopDataImporter
          onImportSubmissions={onImportSubmissions}
          onImportTasks={onImportTasks}
        />
      )}

      {/* TAB 5: 広報CMS */}
      {activeAdminTab === 'cms' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              策定委員会・広報記事の新規投稿 (CMS)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              委員会での決定事項や次回ワークショップの告知記事を住民向けに発信します。
            </p>
          </div>

          <form onSubmit={handleCreateCmsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">記事タイトル</label>
              <input
                type="text"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                placeholder="例: 第3回まちなか夢プラン策定委員会の議事録を公開しました"
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">カテゴリ</label>
                <select
                  value={articleCategory}
                  onChange={(e) => setArticleCategory(e.target.value as CMSArticle['category'])}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none"
                >
                  <option value="committee_report">策定委員会レポート</option>
                  <option value="workshop_info">ワークショップ告知</option>
                  <option value="plan_draft">計画素案・パブコメ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">要約 (一覧表示用)</label>
                <input
                  type="text"
                  value={articleSummary}
                  onChange={(e) => setArticleSummary(e.target.value)}
                  placeholder="記事の短い要約..."
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">本文</label>
              <textarea
                rows={4}
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                placeholder="市民への報告内容..."
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer"
            >
              記事を発行する
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
