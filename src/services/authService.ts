import { UserRole, TeamMember } from '../types';

export interface AuthSession {
  role: UserRole;
  email: string;
  name: string;
  organization: string;
  loggedInAt: string;
}

const STORAGE_KEY = 'yanai_auth_session';

// ==========================================
// デフォルトパスコード・アカウント設定
// ==========================================
export const DEFAULT_PASSCODES = {
  admin: 'yanai2026',           // 管理者用パスコード
  workspace: 'yanai-member',    // ワークスペース推進メンバー用パスコード
  recruiter: 'yanai-recruiter'  // 募集投稿担当用パスコード
};

// 招待トークン定義
export const DEFAULT_INVITATION_TOKENS: Record<string, { role: UserRole; name: string; org: string }> = {
  'YNA-9981': { role: 'workspace', name: '推進メンバー', org: '白壁賑わい創出部会' },
  'YNA-2026': { role: 'admin', name: '行政管理者', org: '柳井市役所 都市計画課' },
  'YNA-7700': { role: 'recruiter', name: '募集担当', org: '柳井観光コンベンション協会' }
};

/**
 * 現在保存されている認証セッションを取得
 */
export const getStoredAuthSession = (): AuthSession | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse auth session', e);
    return null;
  }
};

/**
 * 認証セッションを保存
 */
export const saveAuthSession = (session: AuthSession): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save auth session', e);
  }
};

/**
 * ログアウト（セッション破棄）
 */
export const clearAuthSession = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear auth session', e);
  }
};

/**
 * メールアドレスとパスワードによる認証照合
 */
export const verifyCredentials = (
  email: string,
  passcode: string,
  members: TeamMember[]
): { success: boolean; session?: AuthSession; error?: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = passcode.trim();

  if (!cleanPass) {
    return { success: false, error: 'パスワードを入力してください' };
  }

  // 1. 管理者チェック (admin email または admin パスコード)
  if (cleanPass === DEFAULT_PASSCODES.admin || (cleanEmail === 'admin@city-yanai.jp' && cleanPass === DEFAULT_PASSCODES.admin)) {
    return {
      success: true,
      session: {
        role: 'admin',
        email: cleanEmail || 'admin@city-yanai.jp',
        name: 'システム管理者 (Admin)',
        organization: '柳井市役所 都市計画課',
        loggedInAt: new Date().toLocaleString('ja-JP')
      }
    };
  }

  // 2. ワークスペース推進メンバー パスコードチェック
  if (cleanPass === DEFAULT_PASSCODES.workspace) {
    // 登録メンバーにメールが存在すればその名前を使用
    const member = members.find(m => m.email.toLowerCase() === cleanEmail);
    return {
      success: true,
      session: {
        role: 'workspace',
        email: cleanEmail || 'member@yanai.example.com',
        name: member?.name || '推進メンバー',
        organization: member?.organization || 'まちなか共創ワーキンググループ',
        loggedInAt: new Date().toLocaleString('ja-JP')
      }
    };
  }

  // 3. 募集担当 パスコードチェック
  if (cleanPass === DEFAULT_PASSCODES.recruiter) {
    const member = members.find(m => m.email.toLowerCase() === cleanEmail);
    return {
      success: true,
      session: {
        role: 'recruiter',
        email: cleanEmail || 'recruiter@yanai.example.com',
        name: member?.name || '要員募集担当',
        organization: member?.organization || '観光振興部会',
        loggedInAt: new Date().toLocaleString('ja-JP')
      }
    };
  }

  // 4. 登録メンバーリストとの照合
  if (cleanEmail) {
    const member = members.find(m => m.email.toLowerCase() === cleanEmail);
    if (member) {
      // 登録メンバーの場合、メンバー用パスコードまたは共通パスコードで合致
      if (cleanPass === DEFAULT_PASSCODES.workspace || cleanPass === '1234' || cleanPass === 'yanai') {
        return {
          success: true,
          session: {
            role: member.userRole || 'workspace',
            email: member.email,
            name: member.name,
            organization: member.organization,
            loggedInAt: new Date().toLocaleString('ja-JP')
          }
        };
      }
    }
  }

  return {
    success: false,
    error: 'メールアドレスまたはパスワードが正しくありません。'
  };
};

/**
 * 招待トークンによる認証照合
 */
export const verifyInvitationToken = (
  token: string
): { success: boolean; session?: AuthSession; error?: string } => {
  const cleanToken = token.trim().toUpperCase();
  const tokenData = DEFAULT_INVITATION_TOKENS[cleanToken];

  if (!tokenData) {
    return {
      success: false,
      error: '無効または有効期限切れの招待コードです。正確に入力してください。'
    };
  }

  return {
    success: true,
    session: {
      role: tokenData.role,
      email: `${cleanToken.toLowerCase()}@invite.yanai-city.jp`,
      name: tokenData.name,
      organization: tokenData.org,
      loggedInAt: new Date().toLocaleString('ja-JP')
    }
  };
};
