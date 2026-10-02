import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  LogIn, 
  X, 
  Mail, 
  Lock, 
  ArrowRight, 
  FileSpreadsheet, 
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Navigation2,
  HelpCircle
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onNavigateToTab: (tab: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  onNavigateToTab
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoleType, setSelectedRoleType] = useState<UserRole>('admin');

  if (!isOpen) return null;

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectRole(selectedRoleType);
    if (selectedRoleType === 'admin') {
      onNavigateToTab('admin');
    } else if (selectedRoleType === 'workspace') {
      onNavigateToTab('workspace');
    } else if (selectedRoleType === 'recruiter') {
      onNavigateToTab('recruiter_admin');
    }
    onClose();
  };

  const handleGoogleLogin = () => {
    onSelectRole(selectedRoleType);
    if (selectedRoleType === 'admin') {
      onNavigateToTab('admin');
    } else if (selectedRoleType === 'workspace') {
      onNavigateToTab('workspace');
    } else if (selectedRoleType === 'recruiter') {
      onNavigateToTab('recruiter_admin');
    }
    onClose();
  };

  const handleDirectRoleSelect = (role: UserRole, targetTab?: string) => {
    onSelectRole(role);
    if (targetTab) {
      onNavigateToTab(targetTab);
    } else {
      if (role === 'admin') onNavigateToTab('admin');
      else if (role === 'workspace') onNavigateToTab('workspace');
      else if (role === 'recruiter') onNavigateToTab('recruiter_admin');
      else onNavigateToTab('home');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                関係者ログイン / 権限切り替えポータル
              </h2>
              <p className="text-xs text-slate-400">
                住民向け画面と、管理者・推進メンバー・募集担当画面を分離するための入口です。
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Main 2-Column Section matching Screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Card: ログイン / ロール選択 */}
            <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  関係者専用ログイン
                </h3>
                <div className="mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-800 text-[11px] leading-relaxed">
                  <strong className="block mb-0.5">※事前登録されていない方はログインできません。</strong>
                  一般の市民向け画面（閲覧・アイデア投稿など）は、<strong className="underline cursor-pointer" onClick={() => handleDirectRoleSelect('citizen', 'home')}>ログイン不要（こちら）</strong>でそのままご利用いただけます。
                </div>
                <p className="text-xs text-slate-600 mt-3 font-medium">
                  ご自身に付与された「担当ロール」を選択してください。
                </p>
              </div>

              {/* Quick Role Select Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRoleType('admin')}
                  className={`p-3 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer ${
                    selectedRoleType === 'admin'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  管理者としてログイン
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRoleType('workspace')}
                  className={`p-3 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer ${
                    selectedRoleType === 'workspace'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  ワークスペースメンバー
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRoleType('recruiter')}
                  className={`p-3 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer ${
                    selectedRoleType === 'recruiter'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  募集投稿担当でログイン
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectRoleSelect('citizen', 'home')}
                  className="p-3 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all text-left cursor-pointer"
                >
                  市民モード（一般）
                </button>
              </div>

              <div className="text-[11px] text-slate-500 font-medium">
                現在の選択ロール: <span className="font-bold text-slate-900 uppercase">{selectedRoleType}</span>
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleFormLogin} className="space-y-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    メールアドレス
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@yanai-city.jp"
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    パスワード
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>メールアドレスでログイン</span>
                </button>
              </form>

              {/* Google OAuth Login Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Googleアカウントでログイン</span>
                </button>
              </div>

            </div>

            {/* Right Card: ログイン後の導線ガイド matching Screenshot */}
            <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Navigation2 className="w-4 h-4 text-blue-600" />
                  担当画面へのダイレクト移動
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  ログインと同時に、ご自身の担当機能の画面へ直接ジャンプします。<br/>
                  <span className="text-rose-600 font-medium text-[11px]">※付与された権限以外の画面は操作できません。初めての方でも迷わずご自身の担当業務に専念できます。</span>
                </p>

                <div className="space-y-2 mt-4 relative z-10">
                  <button
                    type="button"
                    onClick={() => handleDirectRoleSelect('admin', 'admin')}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex flex-col items-start">
                      <span>👑 管理画面へ直接移動</span>
                      <span className="text-[10px] font-normal text-blue-200 mt-0.5">全体管理・データ分析・A3出力用</span>
                    </div>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectRoleSelect('workspace', 'workspace')}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex flex-col items-start">
                      <span>🤝 ワークスペースへ直接移動</span>
                      <span className="text-[10px] font-normal text-indigo-200 mt-0.5">タスク・ドキュメント管理専用</span>
                    </div>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectRoleSelect('recruiter', 'recruiter_admin')}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex flex-col items-start">
                      <span>📢 募集投稿画面へ直接移動</span>
                      <span className="text-[10px] font-normal text-amber-200 mt-0.5">実証実験の要員募集・応募者管理専用</span>
                    </div>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="mt-2 p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-[11px] leading-relaxed flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  初めての方は、ご自身の担当業務のボタンをクリックしてログインしてください。担当外の他画面に迷い込むことなくスムーズに作業を開始できます。
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 text-center text-xs text-slate-500">
          © 2026 柳井市まちなか共創プラットフォーム (独立運用モデル)
        </div>

      </div>
    </div>
  );
};
