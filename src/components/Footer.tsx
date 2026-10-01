import React from 'react';
import { UserRole } from '../types';
import { ShieldCheck, LogIn, Heart, ExternalLink, Sparkles, Building2 } from 'lucide-react';

interface FooterProps {
  onOpenLoginModal: () => void;
  currentRole: UserRole;
  setActiveTab: (tab: string) => void;
  onOpenSubmitModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLoginModal,
  currentRole,
  setActiveTab,
  onOpenSubmitModal
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs mt-16">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-full border border-emerald-500 flex items-center justify-center text-emerald-400">
                <Building2 className="w-4 h-4" />
              </div>
              <span>柳井市まちなか共創プラットフォーム</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              白壁の町並みと柳井駅前・柳井川をつなぐ、市民・高校生・行政・事業者の共創型まちづくりポータル。いただいた声はデータ分析され、実際の社会実験や「まちなか夢プラン」に反映されます。
            </p>

            <div className="text-[11px] text-slate-500 pt-1">
              運営：柳井市役所 地域づくり推進課 / 都市計画課 / 商工観光課
            </div>
          </div>

          {/* Quick Links Col */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              メニュー
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-slate-200 transition-colors cursor-pointer"
                >
                  プロジェクトについて
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="hover:text-slate-200 transition-colors cursor-pointer"
                >
                  実証プロジェクト一覧
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('vision')}
                  className="hover:text-slate-200 transition-colors cursor-pointer"
                >
                  ビジョン投票
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('recruitment')}
                  className="hover:text-slate-200 transition-colors cursor-pointer"
                >
                  要員・サポーター募集
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('citizen_dashboard')}
                  className="hover:text-slate-200 transition-colors cursor-pointer"
                >
                  市民データダッシュボード
                </button>
              </li>
            </ul>
          </div>

          {/* Login & Portal Access Col (User Requested in Footer) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              関係者・運営ポータル
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              行政担当者・推進メンバー・募集担当の方は、こちらからログインして管理機能へアクセスしてください。
            </p>

            {/* Login Button in Footer */}
            <button
              id="footer-login-btn"
              onClick={onOpenLoginModal}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-850 text-white border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
            >
              <LogIn className="w-3.5 h-3.5 text-blue-400" />
              <span>関係者ログイン（管理者・メンバー）</span>
            </button>

            <div className="text-[10px] text-slate-500">
              ※ Google アカウントまたは職員アカウントでサインインできます
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Yanai City Machinaka Co-Creation Platform. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors">プライバシーポリシー（匿名属性のみ収集）</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors">オープンデータ方針</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
