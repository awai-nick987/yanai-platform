import React from 'react';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';

interface AccessDeniedViewProps {
  requiredRole: 'admin' | 'workspace' | 'recruiter';
  title?: string;
  description?: string;
  onOpenLoginModal: () => void;
  onBackToHome: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  requiredRole,
  title,
  description,
  onOpenLoginModal,
  onBackToHome
}) => {
  const getRoleBadge = () => {
    switch (requiredRole) {
      case 'admin':
        return {
          name: '行政・統括管理者',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          desc: 'この画面は柳井市役所および統括管理者の認証が必要です。'
        };
      case 'workspace':
        return {
          name: '推進メンバー / ワーキンググループ',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          desc: 'この画面は官民共創推進メンバーの専用認証が必要です。'
        };
      case 'recruiter':
        return {
          name: '募集・広報担当者',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          desc: 'この画面は要員・イベント募集担当者の専用認証が必要です。'
        };
    }
  };

  const badge = getRoleBadge();

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider mb-1">
            <span className={badge.bg}>{badge.name} 権限が必要</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {title || 'アクセス制限されたエリアです'}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {description || badge.desc}
            <br />
            閲覧および操作を行うには関係者アカウントでログインしてください。
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <span>🔐 認証について</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            未ログインの一般閲覧者（市民プレビュー）による誤操作や不正アクセスを防ぐため、セキュリティガードが有効になっています。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onBackToHome}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>トップへ戻る</span>
          </button>
          <button
            onClick={onOpenLoginModal}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-lg active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>ログインする</span>
          </button>
        </div>
      </div>
    </div>
  );
};
