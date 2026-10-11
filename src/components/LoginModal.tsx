import React, { useState } from 'react';
import { UserRole, TeamMember } from '../types';
import { 
  ShieldCheck, 
  LogIn, 
  X, 
  Mail, 
  Lock, 
  ArrowRight, 
  KeyRound, 
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Ticket,
  UserPlus,
  Send,
  Loader2,
  Building
} from 'lucide-react';
import { 
  verifyCredentials, 
  verifyInvitationToken, 
  submitRoleApplicationWithVerification,
  saveAuthSession, 
  AuthSession,
  DEFAULT_PASSCODES 
} from '../services/authService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onNavigateToTab: (tab: string) => void;
  members?: TeamMember[];
  onLoginSuccess?: (session: AuthSession) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  onNavigateToTab,
  members = [],
  onLoginSuccess
}) => {
  const [authMode, setAuthMode] = useState<'password' | 'token' | 'apply'>('password');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tokenCode, setTokenCode] = useState('');
  const [selectedRoleType, setSelectedRoleType] = useState<UserRole>('workspace');
  
  // Apply form states
  const [applyName, setApplyName] = useState('');
  const [applyEmail, setApplyEmail] = useState('');
  const [applyOrg, setApplyOrg] = useState('');
  const [applyRoleTitle, setApplyRoleTitle] = useState('');
  const [applyRole, setApplyRole] = useState<UserRole>('workspace');
  const [applyReason, setApplyReason] = useState('');
  const [applySubmitted, setApplySubmitted] = useState(false);
  const [applyMailNotice, setApplyMailNotice] = useState<string | null>(null);

  // Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelperCodes, setShowHelperCodes] = useState(false);

  if (!isOpen) return null;

  // メール＋パスワード認証
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = verifyCredentials(email, password, members);

      if (!result.success || !result.session) {
        setErrorMessage(result.error || '認証に失敗しました。入力内容をご確認ください。');
        setIsLoading(false);
        return;
      }

      // 認証成功処理
      const session = result.session;
      saveAuthSession(session);
      onSelectRole(session.role);
      if (onLoginSuccess) onLoginSuccess(session);

      // 担当画面へ遷移
      if (session.role === 'admin') {
        onNavigateToTab('admin');
      } else if (session.role === 'workspace') {
        onNavigateToTab('workspace');
      } else if (session.role === 'recruiter') {
        onNavigateToTab('recruiter_admin');
      } else {
        onNavigateToTab('home');
      }

      setIsLoading(false);
      onClose();
    }, 300);
  };

  // 招待トークン認証
  const handleTokenLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = verifyInvitationToken(tokenCode);

      if (!result.success || !result.session) {
        setErrorMessage(result.error || '無効な招待コードです。');
        setIsLoading(false);
        return;
      }

      const session = result.session;
      saveAuthSession(session);
      onSelectRole(session.role);
      if (onLoginSuccess) onLoginSuccess(session);

      if (session.role === 'admin') {
        onNavigateToTab('admin');
      } else if (session.role === 'workspace') {
        onNavigateToTab('workspace');
      } else if (session.role === 'recruiter') {
        onNavigateToTab('recruiter_admin');
      }

      setIsLoading(false);
      onClose();
    }, 300);
  };

  // セルフ権限申請（本人確認メール送信）
  const handleApplyRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyEmail || !applyName || isLoading) return;

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await submitRoleApplicationWithVerification({
        name: applyName.trim(),
        email: applyEmail.trim(),
        organization: applyOrg.trim() || '個人・未所属',
        roleTitle: applyRoleTitle.trim() || '新規申請メンバー',
        requestedRole: applyRole,
        reason: applyReason.trim()
      });

      if (!res.success) {
        setErrorMessage(res.error || '申請処理に失敗しました。');
      } else {
        setApplySubmitted(true);
        if (res.mailResult?.simulated) {
          setApplyMailNotice(`【開発シミュレーション】${applyEmail} 宛に本人確認メールを送信しました（APIキー設定時は実送信されます）。`);
        } else {
          setApplyMailNotice(`✅ ${applyEmail} 宛に本人確認メールを送信しました！`);
        }
      }
    } catch (err) {
      setErrorMessage('申請通信中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  // サンプルアカウントのワンクリック入力（テスト支援用）
  const handleFillDemo = (targetRole: UserRole) => {
    setSelectedRoleType(targetRole);
    if (targetRole === 'admin') {
      setEmail('admin@city-yanai.jp');
      setPassword(DEFAULT_PASSCODES.admin);
    } else if (targetRole === 'workspace') {
      setEmail('shoko@yanai.example.com');
      setPassword(DEFAULT_PASSCODES.workspace);
    } else if (targetRole === 'recruiter') {
      setEmail('recruiter@tourism.example.com');
      setPassword(DEFAULT_PASSCODES.recruiter);
    }
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                  SECURE PORTAL
                </span>
                <span className="text-xs text-slate-400 font-bold">本番ログイン管理</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                関係者ログイン / 認証ポータル
              </h2>
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
        <div className="p-6 sm:p-8 space-y-5">
          
          {/* Important Notice */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>一般市民の方はログイン不要です。</strong><br />
              アイデア投稿やビジョン投票、閲覧はトップ画面のままご利用いただけます。この画面は行政・推進メンバー専用です。
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Mode Tabs: Password vs Token vs Apply */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 gap-1">
            <button
              type="button"
              onClick={() => { setAuthMode('password'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'password'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>パスワード</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('token'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'token'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>招待コード</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('apply'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'apply'
                  ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-600" />
              <span>権限を申請</span>
            </button>
          </div>

          {/* TAB 1: Password Form */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  関係者メールアドレス <span className="text-slate-400 font-normal">（またはID）</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="例: shoko@yanai.example.com または admin@city-yanai.jp"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  パスワード / 認証パスコード <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>認証確認中...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-amber-300" />
                    <span>関係者認証してログイン</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: Token Form */}
          {authMode === 'token' && (
            <form onSubmit={handleTokenLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  招待トークンコード（YNA-xxxx） <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={tokenCode}
                    onChange={(e) => setTokenCode(e.target.value)}
                    placeholder="例: YNA-9981"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  管理画面から発行された7日有効の招待トークンを入力してください。
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>コード確認中...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-amber-300" />
                    <span>招待コードで認証</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: Apply Form */}
          {authMode === 'apply' && (
            <div>
              {applySubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    権限申請を受け付けました！
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                    <strong>{applyEmail}</strong> 宛に本人確認用メールを送信しました。<br />
                    届いたメール内のリンクをクリックして<strong>メールアドレスの所有確認</strong>を完了してください。<br />
                    本人の確認完了後、行政管理者が審査・承認することで権限が付与されます。
                  </p>
                  {applyMailNotice && (
                    <div className="text-[11px] p-2.5 bg-white rounded-xl border border-emerald-200 text-emerald-800 font-medium">
                      {applyMailNotice}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setApplySubmitted(false);
                      setAuthMode('password');
                    }}
                    className="mt-2 px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    ログイン画面へ戻る
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyRole} className="space-y-3.5">
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed">
                    <strong>ディファクトスタンダード認証：</strong><br />
                    申請送信後に届くメールのリンクをクリックすることで本人確認となります。管理者の承認後にログイン可能になります。
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        氏名 <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={applyName}
                        onChange={(e) => setApplyName(e.target.value)}
                        placeholder="例: 柳井 太郎"
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        メールアドレス <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={applyEmail}
                        onChange={(e) => setApplyEmail(e.target.value)}
                        placeholder="taro.yanai@example.com"
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        所属組織・団体
                      </label>
                      <input
                        type="text"
                        value={applyOrg}
                        onChange={(e) => setApplyOrg(e.target.value)}
                        placeholder="例: 白壁通り商店街、柳井高校、一般市民等"
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        担当・役職
                      </label>
                      <input
                        type="text"
                        value={applyRoleTitle}
                        onChange={(e) => setApplyRoleTitle(e.target.value)}
                        placeholder="例: 副会長、実行委員、生徒"
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      希望する権限ロール <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={applyRole}
                      onChange={(e) => setApplyRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="workspace">🤝 ワークスペース (WG推進メンバー - タスク・資料・チャット)</option>
                      <option value="recruiter">📢 募集管理 (Recruiter - プロジェクト要員公募)</option>
                      <option value="admin">👑 行政管理者 (Admin - 全管理・公開制御)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      申請理由・参加目的 <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={applyReason}
                      onChange={(e) => setApplyReason(e.target.value)}
                      placeholder="例: 白壁通りのまちづくり部会に参加するため。ガントチャートや議事録の確認・更新権限が必要です。"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>申請・メール送信処理中...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>本人確認メールを送信して権限申請する</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Operator Helper Accordion (Collapsible for test convenience) */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowHelperCodes(!showHelperCodes)}
              className="w-full py-1.5 px-2 rounded-lg text-slate-500 hover:text-slate-800 text-[11px] font-bold flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span>運用テスト用：初期パスコード確認</span>
              </span>
              {showHelperCodes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showHelperCodes && (
              <div className="mt-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-slate-700 space-y-2 animate-in fade-in">
                <p className="text-amber-900 font-bold">
                  クリックすると入力欄に自動セットされます：
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('workspace')}
                    className="p-2 rounded-lg bg-white border border-amber-200 hover:border-amber-400 text-left cursor-pointer transition-all hover:shadow-2xs"
                  >
                    <div className="font-bold text-slate-900">🤝 推進メンバー</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">パス: yanai-member</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFillDemo('admin')}
                    className="p-2 rounded-lg bg-white border border-amber-200 hover:border-amber-400 text-left cursor-pointer transition-all hover:shadow-2xs"
                  >
                    <div className="font-bold text-slate-900">👑 行政管理者</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">パス: yanai2026</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFillDemo('recruiter')}
                    className="p-2 rounded-lg bg-white border border-amber-200 hover:border-amber-400 text-left cursor-pointer transition-all hover:shadow-2xs"
                  >
                    <div className="font-bold text-slate-900">📢 募集担当</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">パス: yanai-recruiter</div>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>柳井市まちなか未来共創プラットフォーム</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-bold underline cursor-pointer"
          >
            閉じる（市民モード）
          </button>
        </div>

      </div>
    </div>
  );
};
