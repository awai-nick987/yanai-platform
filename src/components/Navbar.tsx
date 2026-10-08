import React, { useState } from 'react';
import { UserRole, SystemSettings } from '../types';
import { 
  Building2, 
  BarChart3, 
  FolderKanban, 
  ShieldCheck, 
  PlusCircle, 
  FileSpreadsheet, 
  Sparkles, 
  Users, 
  Vote, 
  Compass,
  MessageSquarePlus,
  LogIn,
  Layers,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  ExternalLink
} from 'lucide-react';
import { clearAuthSession } from '../services/authService';

interface NavbarProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSubmitModal: () => void;
  onOpenExportModal: () => void;
  onOpenLoginModal: () => void;
  systemSettings: SystemSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  onOpenSubmitModal,
  onOpenExportModal,
  onOpenLoginModal,
  systemSettings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggles = systemSettings.frontendSectionToggles || {
    about: true,
    projects: true,
    vision: true,
    recruitment: true,
    submit_idea: true,
    citizen_dashboard: true
  };

  const isStaffLoggedIn = currentRole === 'admin' || currentRole === 'workspace' || currentRole === 'recruiter';

  // Determine portal target tab and label based on current role
  const getStaffPortalTab = (): string => {
    if (currentRole === 'admin') return 'admin';
    if (currentRole === 'workspace') return 'workspace';
    if (currentRole === 'recruiter') return 'recruitment';
    return 'admin';
  };

  const getStaffPortalLabel = (): string => {
    if (currentRole === 'admin') return '管理者ポータル';
    if (currentRole === 'workspace') return '共創ワークスペース';
    if (currentRole === 'recruiter') return '要員募集ポータル';
    return '関係者・運営ポータル';
  };

  const isPortalActive = activeTab === 'admin' || activeTab === 'workspace' || activeTab === 'matrix';

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      
      {/* Top Banner / Staff Status Indicator (Only if logged in as staff) */}
      {isStaffLoggedIn && (
        <div className="bg-slate-900 text-slate-200 text-xs px-3.5 sm:px-6 py-2 sm:py-1.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 font-bold text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>関係者ログイン中:</span>
              <span className="uppercase text-white font-bold">
                {currentRole === 'admin' ? '行政・管理者 (Admin)' : currentRole === 'workspace' ? '推進メンバー (Member)' : '募集担当 (Recruiter)'}
              </span>
            </span>
            <span className="hidden lg:inline-block text-slate-600">|</span>
            <span className="hidden lg:inline-block text-slate-300 text-[11px]">
              分析・データ出力・管理機能が有効です
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
            {/* Staff Portal Switch Buttons */}
            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    activeTab === 'admin' 
                      ? 'bg-amber-400 text-slate-950 shadow-xs ring-1 ring-white' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30'
                  }`}
                >
                  <span>👑 管理画面</span>
                </button>
                <button
                  onClick={() => handleNavClick('workspace')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    activeTab === 'workspace' 
                      ? 'bg-amber-400 text-slate-950 shadow-xs ring-1 ring-white' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30'
                  }`}
                >
                  <span>🤝 ワークスペース</span>
                </button>
                <button
                  onClick={() => handleNavClick('recruitment')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    activeTab === 'recruitment' 
                      ? 'bg-amber-400 text-slate-950 shadow-xs ring-1 ring-white' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30'
                  }`}
                >
                  <span>📢 募集投稿画面</span>
                </button>
              </>
            )}

            {currentRole === 'workspace' && (
              <>
                <button
                  onClick={() => handleNavClick('workspace')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    activeTab === 'workspace' 
                      ? 'bg-amber-400 text-slate-950 shadow-xs ring-1 ring-white' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30'
                  }`}
                >
                  <span>🤝 ワークスペース</span>
                </button>
                <button
                  onClick={() => handleNavClick('recruitment')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    activeTab === 'recruitment' 
                      ? 'bg-amber-400 text-slate-950 shadow-xs ring-1 ring-white' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30'
                  }`}
                >
                  <span>📢 募集投稿画面</span>
                </button>
              </>
            )}

            {currentRole === 'recruiter' && (
              <button
                onClick={() => handleNavClick('recruitment')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  activeTab === 'recruitment' 
                    ? 'bg-amber-400 text-slate-950 shadow-xs ring-1 ring-white' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30'
                }`}
              >
                <span>📢 募集投稿画面</span>
              </button>
            )}

            {/* Quick staff shortcuts */}
            {(currentRole === 'admin' || currentRole === 'workspace') && (
              <>
                <button
                  onClick={() => handleNavClick('matrix')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    activeTab === 'matrix' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                  }`}
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>２軸分析</span>
                </button>

                <button
                  onClick={onOpenExportModal}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-emerald-300 hover:bg-slate-700 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <FileSpreadsheet className="w-3 h-3" />
                  <span>A3出力</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                setCurrentRole('citizen');
                setActiveTab('home');
              }}
              className="px-2 py-1 rounded-lg text-[11px] font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer whitespace-nowrap"
              title="市民画面プレビューに切り替え（ログアウト）"
            >
              ログアウト
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none shrink-0" 
            onClick={() => handleNavClick('home')}
          >
            <img src="/logo_icon.png" alt="柳井市まちなか共創ロゴ" className="w-9 h-9 sm:w-11 sm:h-11 object-contain shrink-0" />
            <div className="flex flex-col">
              <h1 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 tracking-tight leading-none whitespace-nowrap">
                柳井市まちなか共創
              </h1>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline-block leading-tight mt-0.5 whitespace-nowrap">
                プラットフォーム
              </span>
            </div>
          </div>

          {/* Desktop & Tablet Navigation Menu (Clean & No Line-Wrapping) */}
          <nav className="hidden lg:flex flex-1 items-center gap-1 xl:gap-1.5 overflow-x-auto no-scrollbar mask-edges min-w-0 pr-4">
            
            {/* 1. プロジェクト概要 */}
            {toggles.about && (
              <button
                id="nav-about-btn"
                onClick={() => handleNavClick('about')}
                className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'about'
                    ? 'text-blue-700 font-bold bg-blue-50/90 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                プロジェクト概要
              </button>
            )}

            {/* 2. プロジェクト */}
            {toggles.projects && (
              <button
                id="nav-projects-btn"
                onClick={() => handleNavClick('projects')}
                className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'text-blue-700 font-bold bg-blue-50/90 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                プロジェクト一覧
              </button>
            )}

            {/* 3. ビジョン投票 */}
            {toggles.vision && (
              <button
                id="nav-vision-btn"
                onClick={() => handleNavClick('vision')}
                className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'vision'
                    ? 'text-blue-700 font-bold bg-blue-50/90 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                ビジョン投票
              </button>
            )}

            {/* 3.5. まちなか井戸端会議（表示設定が有効な場合のみ表示） */}
            {toggles.idobata && (
              <button
                id="nav-idobata-btn"
                onClick={() => handleNavClick('idobata')}
                className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'idobata'
                    ? 'text-amber-700 font-bold bg-amber-50 shadow-xs ring-1 ring-amber-300'
                    : 'text-slate-700 hover:text-amber-800 hover:bg-amber-50/60'
                }`}
              >
                まちなか井戸端会議
              </button>
            )}

            {/* 4. 要員募集 */}
            {toggles.recruitment && (
              <button
                id="nav-recruitment-btn"
                onClick={() => handleNavClick('recruitment')}
                className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'recruitment'
                    ? 'text-blue-700 font-bold bg-blue-50/90 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                要員募集
              </button>
            )}

            {/* 5. 意見投稿 */}
            {toggles.submit_idea && (
              <button
                id="nav-submit-idea-btn"
                onClick={() => handleNavClick('submit_idea')}
                className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'submit_idea'
                    ? 'text-blue-700 font-bold bg-blue-50/90 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                意見投稿
              </button>
            )}

            {/* 6. ダッシュボード */}
            {toggles.citizen_dashboard && (
              <button
                id="nav-dashboard-btn"
                onClick={() => handleNavClick('citizen_dashboard')}
                className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'citizen_dashboard'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                ダッシュボード
              </button>
            )}

            {/* 7. 関係者・運営ポータル (関係者ログイン中のみグローバルメニュー末尾に表示) */}
            {isStaffLoggedIn && (
              <button
                id="nav-staff-portal-btn"
                onClick={() => handleNavClick(getStaffPortalTab())}
                className={`ml-1 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isPortalActive
                    ? 'bg-slate-900 text-amber-300 shadow-md ring-2 ring-amber-400/50 font-extrabold'
                    : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100/90 hover:border-amber-400 shadow-xs'
                }`}
                title="関係者・運営ポータルへ戻る"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>関係者・運営ポータル</span>
              </button>
            )}

          </nav>

          {/* Right Action: Quick Idea CTA & Mobile Toggle */}
          <div className="flex items-center gap-2">
            
            {/* If staff logged in, show quick portal icon on tablet/desktop */}
            {isStaffLoggedIn && (
              <button
                onClick={() => handleNavClick(getStaffPortalTab())}
                className="hidden md:flex lg:hidden px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-xs hover:bg-amber-400 items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="ポータルへ戻る"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ポータル</span>
              </button>
            )}

            <button
              id="navbar-submit-cta"
              onClick={onOpenSubmitModal}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>意見投稿</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="メニュー開閉"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Expandable Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 space-y-1.5 animate-in fade-in slide-in-from-top-2">
            
            {/* Highlighted Portal Button for Staff at Top of Drawer */}
            {isStaffLoggedIn && (
              <div className="p-2 mb-2 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl border border-slate-700 text-white shadow-md">
                <div className="flex items-center justify-between px-2 py-1 mb-1.5">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>関係者ログイン中</span>
                  </span>
                  <span className="text-[10px] text-slate-300 uppercase">
                    {currentRole === 'admin' ? '管理者' : currentRole === 'workspace' ? '推進メンバー' : '募集担当'}
                  </span>
                </div>
                <button
                  onClick={() => handleNavClick(getStaffPortalTab())}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isPortalActive 
                      ? 'bg-amber-400 text-slate-950 shadow-sm' 
                      : 'bg-amber-500/20 text-amber-200 border border-amber-400/40 hover:bg-amber-500/30'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{getStaffPortalLabel()}へ戻る</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {toggles.about && (
              <button
                onClick={() => handleNavClick('about')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'about' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>プロジェクト概要</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            {toggles.projects && (
              <button
                onClick={() => handleNavClick('projects')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'projects' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>プロジェクト一覧</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            {toggles.vision && (
              <button
                onClick={() => handleNavClick('vision')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'vision' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>ビジョン投票</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            {toggles.idobata && (
              <button
                onClick={() => handleNavClick('idobata')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'idobata' ? 'bg-amber-50 text-amber-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>まちなか井戸端会議</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            {toggles.recruitment && (
              <button
                onClick={() => handleNavClick('recruitment')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'recruitment' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>要員募集</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            {toggles.submit_idea && (
              <button
                onClick={() => handleNavClick('submit_idea')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'submit_idea' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>意見投稿フォーム</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            {toggles.citizen_dashboard && (
              <button
                onClick={() => handleNavClick('citizen_dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'citizen_dashboard' ? 'bg-blue-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>ダッシュボード</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Relationship Portal Item in Drawer list if logged in */}
            {isStaffLoggedIn && (
              <button
                onClick={() => handleNavClick(getStaffPortalTab())}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                  isPortalActive 
                    ? 'bg-slate-900 text-amber-300 border-slate-800' 
                    : 'bg-amber-50/90 text-amber-950 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>関係者・運営ポータル</span>
                </span>
                <ChevronRight className="w-4 h-4 text-amber-600" />
              </button>
            )}

            {/* Quick staff login / logout shortcut in mobile drawer */}
            <div className="pt-2 mt-2 border-t border-slate-100">
              {isStaffLoggedIn ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentRole('citizen');
                    setActiveTab('home');
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <span>関係者ログアウト（市民表示）</span>
                  <LogIn className="w-3.5 h-3.5 rotate-180" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLoginModal();
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  <LogIn className="w-4 h-4" />
                  <span>関係者・行政ログイン</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick mobile horizontal pill bar for instant access */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-100 text-xs no-scrollbar">
          {toggles.about && (
            <button
              onClick={() => handleNavClick('about')}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium text-xs ${
                activeTab === 'about' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 bg-slate-100'
              }`}
            >
              概要
            </button>
          )}

          {toggles.projects && (
            <button
              onClick={() => handleNavClick('projects')}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium text-xs ${
                activeTab === 'projects' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 bg-slate-100'
              }`}
            >
              プロジェクト
            </button>
          )}

          {toggles.vision && (
            <button
              onClick={() => handleNavClick('vision')}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium text-xs ${
                activeTab === 'vision' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 bg-slate-100'
              }`}
            >
              ビジョン投票
            </button>
          )}

          {toggles.idobata && (
            <button
              onClick={() => handleNavClick('idobata')}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium text-xs ${
                activeTab === 'idobata' ? 'bg-amber-600 text-white font-bold' : 'text-amber-800 bg-amber-50'
              }`}
            >
              井戸端会議
            </button>
          )}

          {toggles.recruitment && (
            <button
              onClick={() => handleNavClick('recruitment')}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium text-xs ${
                activeTab === 'recruitment' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 bg-slate-100'
              }`}
            >
              要員募集
            </button>
          )}

          {toggles.submit_idea && (
            <button
              onClick={() => handleNavClick('submit_idea')}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium text-xs ${
                activeTab === 'submit_idea' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 bg-slate-100'
              }`}
            >
              意見投稿
            </button>
          )}

          {toggles.citizen_dashboard && (
            <button
              onClick={() => handleNavClick('citizen_dashboard')}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium text-xs ${
                activeTab === 'citizen_dashboard' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 bg-slate-100'
              }`}
            >
              集計
            </button>
          )}

          {/* Staff Portal Switch Buttons on Mobile bar */}
          {currentRole === 'admin' && (
            <>
              <button
                onClick={() => handleNavClick('admin')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-bold text-xs flex items-center gap-1 shadow-2xs ${
                  activeTab === 'admin' ? 'bg-amber-400 text-slate-950' : 'bg-amber-500/20 text-amber-700 border border-amber-400/40'
                }`}
              >
                <span>👑 管理画面</span>
              </button>
              <button
                onClick={() => handleNavClick('workspace')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-bold text-xs flex items-center gap-1 shadow-2xs ${
                  activeTab === 'workspace' ? 'bg-amber-400 text-slate-950' : 'bg-amber-500/20 text-amber-700 border border-amber-400/40'
                }`}
              >
                <span>🤝 ワークスペース</span>
              </button>
              <button
                onClick={() => handleNavClick('recruitment')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-bold text-xs flex items-center gap-1 shadow-2xs ${
                  activeTab === 'recruitment' ? 'bg-amber-400 text-slate-950' : 'bg-amber-500/20 text-amber-700 border border-amber-400/40'
                }`}
              >
                <span>📢 募集投稿画面</span>
              </button>
            </>
          )}

          {currentRole === 'workspace' && (
            <>
              <button
                onClick={() => handleNavClick('workspace')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-bold text-xs flex items-center gap-1 shadow-2xs ${
                  activeTab === 'workspace' ? 'bg-amber-400 text-slate-950' : 'bg-amber-500/20 text-amber-700 border border-amber-400/40'
                }`}
              >
                <span>🤝 ワークスペース</span>
              </button>
              <button
                onClick={() => handleNavClick('recruitment')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-bold text-xs flex items-center gap-1 shadow-2xs ${
                  activeTab === 'recruitment' ? 'bg-amber-400 text-slate-950' : 'bg-amber-500/20 text-amber-700 border border-amber-400/40'
                }`}
              >
                <span>📢 募集投稿画面</span>
              </button>
            </>
          )}

          {currentRole === 'recruiter' && (
            <button
              onClick={() => handleNavClick('recruitment')}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-bold text-xs flex items-center gap-1 shadow-2xs ${
                activeTab === 'recruitment' ? 'bg-amber-400 text-slate-950' : 'bg-amber-500/20 text-amber-700 border border-amber-400/40'
              }`}
            >
              <span>📢 募集投稿画面</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
