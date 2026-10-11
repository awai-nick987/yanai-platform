import { UserRole, TeamMember, InvitationRecord, RoleApplicationRequest } from '../types';
import { 
  saveInvitationToDb, 
  saveRoleApplicationToDb, 
  updateRoleApplicationInDb 
} from './firebaseService';

export interface AuthSession {
  role: UserRole;
  email: string;
  name: string;
  organization: string;
  loggedInAt: string;
}

const STORAGE_KEY = 'yanai_auth_session';
const INVITATIONS_STORAGE_KEY = 'yanai_issued_invitations';
const APPLICATIONS_STORAGE_KEY = 'yanai_role_applications';

// ==========================================
// デフォルトパスコード・アカウント設定
// ==========================================
export const DEFAULT_PASSCODES = {
  admin: 'yanai2026',           // 管理者用パスコード
  workspace: 'yanai-member',    // ワークスペース推進メンバー用パスコード
  recruiter: 'yanai-recruiter'  // 募集投稿担当用パスコード
};

// 組み込み初期招待トークン定義
export const DEFAULT_INVITATION_TOKENS: Record<string, { role: UserRole; name: string; org: string }> = {
  'YNA-9981': { role: 'workspace', name: '推進メンバー', org: '白壁賑わい創出部会' },
  'YNA-2026': { role: 'admin', name: '行政管理者', org: '柳井市役所 都市計画課' },
  'YNA-7700': { role: 'recruiter', name: '募集担当', org: '柳井観光コンベンション協会' }
};

// ==========================================
// 認証セッション管理
// ==========================================
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

export const saveAuthSession = (session: AuthSession): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save auth session', e);
  }
};

export const clearAuthSession = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear auth session', e);
  }
};

// ==========================================
// 招待トークン永続化 & メール送信連携
// ==========================================
export const getStoredInvitations = (): InvitationRecord[] => {
  try {
    const raw = localStorage.getItem(INVITATIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveInvitations = (invitations: InvitationRecord[]): void => {
  try {
    localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(invitations));
  } catch (e) {
    console.error('Failed to save invitations', e);
  }
};

/**
 * 招待トークンを発行し、実メールを自動送信
 */
export const issueInvitationWithEmail = async (
  email: string,
  role: UserRole,
  invitedByName: string = '行政管理者'
): Promise<{ success: boolean; invitation: InvitationRecord; mailResult?: any; error?: string }> => {
  const token = `YNA-${Math.floor(1000 + Math.random() * 9000)}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString('ja-JP');

  const invitation: InvitationRecord = {
    id: `inv-${Date.now()}`,
    email: email.trim(),
    role,
    token,
    invitedByName,
    issuedAt: new Date().toLocaleString('ja-JP'),
    expiresAt,
    status: 'pending'
  };

  // 1. ローカルおよびFirestoreに保存
  const existing = getStoredInvitations();
  saveInvitations([invitation, ...existing]);
  await saveInvitationToDb(invitation);

  // 2. 実メール自動送信（/api/send-email 経由）
  const roleNameMap: Record<UserRole, string> = {
    admin: '行政・統括管理者 (Admin)',
    workspace: '推進メンバー (Member)',
    recruiter: '要員募集担当 (Recruiter)',
    citizen: '一般市民 (Citizen)'
  };

  const inviteLink = `${window.location.origin}/?token=${token}&role=${role}`;

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="background-color: #0f172a; padding: 16px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0; font-size: 18px;">柳井市まちなか共創プラットフォーム</h2>
        <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">関係者・運営メンバー招待のご案内</p>
      </div>

      <p style="font-size: 14px; color: #334155; line-height: 1.6;">
        柳井市まちなか共創プラットフォームの管理者より、関係者アカウントへの招待が届きました。
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; margin: 20px 0;">
        <table style="width: 100%; font-size: 13px; color: #475569;">
          <tr>
            <td style="font-weight: bold; width: 100px; padding: 4px 0;">付与ロール:</td>
            <td style="color: #1e293b; font-weight: bold;">${roleNameMap[role]}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 4px 0;">招待コード:</td>
            <td style="font-family: monospace; font-size: 16px; font-weight: bold; color: #2563eb;">${token}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 4px 0;">有効期限:</td>
            <td>${expiresAt}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${inviteLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px;">
          招待を承諾してログインする
        </a>
      </div>

      <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
        ※ ボタンがクリックできない場合は、以下のURLをブラウザに貼り付けてアクセスしてください：<br />
        <a href="${inviteLink}" style="color: #2563eb;">${inviteLink}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
        発信元：柳井市役所 地域づくり推進課 / 都市計画課<br />
        本メールにお心当たりがない場合は破棄してください。
      </p>
    </div>
  `;

  let mailResult = null;
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email.trim(),
        subject: `【柳井市まちなか共創PF】${roleNameMap[role]}への招待が届きました`,
        html: emailHtml,
        type: 'invitation'
      })
    });
    mailResult = await res.json();
  } catch (err: any) {
    console.warn('Email API call warning:', err);
  }

  return { success: true, invitation, mailResult };
};

// ==========================================
// ロール申請・本人確認・承認フロー（本番仕様）
// ==========================================
export const getStoredApplications = (): RoleApplicationRequest[] => {
  try {
    const raw = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveApplications = (apps: RoleApplicationRequest[]): void => {
  try {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(apps));
  } catch (e) {
    console.error('Failed to save role applications', e);
  }
};

/**
 * 本人からの権限申請（セルフ申請）＆本人確認メール送信
 */
export const submitRoleApplicationWithVerification = async (params: {
  name: string;
  email: string;
  organization?: string;
  roleTitle?: string;
  requestedRole: UserRole;
  reason: string;
}): Promise<{ success: boolean; application: RoleApplicationRequest; mailResult?: any; error?: string }> => {
  const token = `VRF-${Math.floor(100000 + Math.random() * 900000)}`;

  const application: RoleApplicationRequest = {
    id: `req-${Date.now()}`,
    name: params.name.trim(),
    email: params.email.trim(),
    organization: (params.organization || '個人・未所属').trim(),
    roleTitle: (params.roleTitle || '新規参加申請').trim(),
    requestedRole: params.requestedRole,
    reason: params.reason.trim(),
    verificationToken: token,
    isEmailVerified: false,
    emailVerified: false,
    status: 'pending',
    appliedAt: new Date().toLocaleString('ja-JP')
  };

  const existing = getStoredApplications();
  saveApplications([application, ...existing]);
  await saveRoleApplicationToDb(application);

  const verifyLink = `${window.location.origin}/?verify_token=${token}&app_id=${application.id}`;

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="background-color: #0f172a; padding: 16px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin: 0; font-size: 18px;">柳井市まちなか共創プラットフォーム</h2>
        <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">メールアドレスの本人確認（権限申請）</p>
      </div>

      <p style="font-size: 14px; color: #334155; line-height: 1.6;">
        ${params.name} 様<br /><br />
        柳井市まちなか共創プラットフォームへの権限申請を受け付けました。<br />
        下記の「メールアドレスを確認する」ボタンをクリックして、申請手続きを完了させてください。
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; margin: 20px 0;">
        <table style="width: 100%; font-size: 13px; color: #475569;">
          <tr>
            <td style="font-weight: bold; width: 100px; padding: 4px 0;">お名前:</td>
            <td style="color: #1e293b;">${params.name}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 4px 0;">ご所属:</td>
            <td>${params.organization || '個人・未所属'}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 4px 0;">希望権限:</td>
            <td style="font-weight: bold; color: #2563eb;">${params.requestedRole}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${verifyLink}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px;">
          メールアドレスを確認して申請を完了する
        </a>
      </div>

      <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
        ※ メール確認後、行政統括管理者による承認審査が行われます。承認が完了次第、ログインが可能になります。
      </p>
    </div>
  `;

  let mailResult: any = null;
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: params.email.trim(),
        subject: '【柳井市まちなか共創PF】メールアドレスの本人確認のお願い',
        html: emailHtml,
        type: 'verification'
      })
    });
    mailResult = await res.json().catch(() => null);
  } catch (e) {
    console.warn('Verification email dispatch failed:', e);
  }

  return { success: true, application, mailResult };
};

/**
 * メール内リンクからの本人確認完了処理
 */
export const verifyEmailToken = async (
  token: string,
  appId: string
): Promise<{ success: boolean; application?: RoleApplicationRequest; message: string; error?: string }> => {
  const apps = getStoredApplications();
  const target = apps.find(a => a.id === appId && a.verificationToken === token);

  if (!target) {
    return { success: false, message: '無効または期限切れの確認リンクです。', error: '無効または期限切れの確認リンクです。' };
  }

  target.isEmailVerified = true;
  target.emailVerified = true;
  target.status = 'pending_approval';
  target.verifiedAt = new Date().toLocaleString('ja-JP');

  saveApplications(apps);
  await updateRoleApplicationInDb(appId, {
    isEmailVerified: true,
    emailVerified: true,
    status: 'pending_approval',
    verifiedAt: target.verifiedAt
  });

  return { 
    success: true, 
    application: target,
    message: 'メールアドレスの本人確認が完了しました！管理者の承認をお待ちください。' 
  };
};

/**
 * 管理者による申請承認
 */
export const approveRoleApplication = async (
  appId: string,
  reviewerName: string = '行政管理者'
): Promise<{ success: boolean; application?: RoleApplicationRequest; error?: string }> => {
  const apps = getStoredApplications();
  const target = apps.find(a => a.id === appId);

  if (!target) return { success: false, error: '申請データが見つかりません' };

  target.status = 'approved';
  target.reviewedAt = new Date().toLocaleString('ja-JP');
  target.reviewedBy = reviewerName;

  saveApplications(apps);
  await updateRoleApplicationInDb(appId, {
    status: 'approved',
    reviewedAt: target.reviewedAt,
    reviewedBy: reviewerName
  });

  // 承認完了通知メールの送信
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-top: 0;">権限申請が承認されました</h2>
      <p style="font-size: 14px; color: #334155;">
        ${target.name} 様<br /><br />
        柳井市まちなか共創プラットフォームへの「${target.requestedRole}」権限申請が承認されました。<br />
        下記よりログインしてワークスペースをご利用いただけます。
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${window.location.origin}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          プラットフォームへアクセス
        </a>
      </div>
    </div>
  `;

  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: target.email,
        subject: '【柳井市まちなか共創PF】権限申請が承認されました',
        html: emailHtml,
        type: 'approval_notification'
      })
    });
  } catch (e) {
    console.warn('Approval email notification failed:', e);
  }

  return { success: true, application: target };
};

/**
 * 管理者による申請却下
 */
export const rejectRoleApplication = async (
  appId: string,
  reviewerName: string = '行政管理者'
): Promise<{ success: boolean; error?: string }> => {
  const apps = getStoredApplications();
  const target = apps.find(a => a.id === appId);
  if (!target) return { success: false, error: '申請データが見つかりません' };

  target.status = 'rejected';
  target.reviewedAt = new Date().toLocaleString('ja-JP');
  target.reviewedBy = reviewerName;

  saveApplications(apps);
  await updateRoleApplicationInDb(appId, {
    status: 'rejected',
    reviewedAt: target.reviewedAt,
    reviewedBy: reviewerName
  });

  return { success: true };
};

// ==========================================
// 照合・ログイン認証
// ==========================================
export const verifyCredentials = (
  email: string,
  passcode: string,
  members: TeamMember[] = []
): { success: boolean; session?: AuthSession; error?: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPasscode = passcode.trim();

  // 1. 管理者マスター
  if (cleanEmail === 'admin@city-yanai.jp' && cleanPasscode === DEFAULT_PASSCODES.admin) {
    return {
      success: true,
      session: {
        role: 'admin',
        email: cleanEmail,
        name: '統括管理者（柳井市役所）',
        organization: '柳井市役所 地域づくり推進課',
        loggedInAt: new Date().toLocaleString('ja-JP')
      }
    };
  }

  // 2. 承認済み申請ユーザーの照合
  const approvedApps = getStoredApplications().filter(a => a.status === 'approved');
  const matchedApp = approvedApps.find(a => a.email.toLowerCase() === cleanEmail);
  if (matchedApp) {
    const expectedPasscode = DEFAULT_PASSCODES[matchedApp.requestedRole as keyof typeof DEFAULT_PASSCODES] || 'yanai2026';
    if (cleanPasscode === expectedPasscode || cleanPasscode === 'yanai2026') {
      return {
        success: true,
        session: {
          role: matchedApp.requestedRole,
          email: matchedApp.email,
          name: matchedApp.name,
          organization: matchedApp.organization,
          loggedInAt: new Date().toLocaleString('ja-JP')
        }
      };
    }
  }

  // 3. メンバー名簿照合
  const matchedMember = members.find(m => m.email.toLowerCase() === cleanEmail);
  if (matchedMember) {
    const targetRole = matchedMember.userRole || 'workspace';
    const expectedPasscode = DEFAULT_PASSCODES[targetRole as keyof typeof DEFAULT_PASSCODES];

    if (cleanPasscode === expectedPasscode || cleanPasscode === 'yanai2026') {
      return {
        success: true,
        session: {
          role: targetRole,
          email: matchedMember.email,
          name: matchedMember.name,
          organization: matchedMember.organization,
          loggedInAt: new Date().toLocaleString('ja-JP')
        }
      };
    }
  }

  return {
    success: false,
    error: 'メールアドレスまたはパスワードが正しくありません。承認が完了しているかもご確認ください。'
  };
};

export const verifyInvitationToken = (
  token: string
): { success: boolean; session?: AuthSession; error?: string } => {
  const cleanToken = token.trim().toUpperCase();

  // 1. 動的発行済みトークンから照合
  const issued = getStoredInvitations();
  const matchedIssued = issued.find(inv => inv.token.toUpperCase() === cleanToken && inv.status !== 'expired');
  if (matchedIssued) {
    return {
      success: true,
      session: {
        role: matchedIssued.role,
        email: matchedIssued.email,
        name: `${matchedIssued.email.split('@')[0]} (招待参加者)`,
        organization: '柳井市まちなか共創推進組織',
        loggedInAt: new Date().toLocaleString('ja-JP')
      }
    };
  }

  // 2. 組み込み初期招待トークンから照合
  const tokenData = DEFAULT_INVITATION_TOKENS[cleanToken];
  if (tokenData) {
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
  }

  return {
    success: false,
    error: '無効または有効期限切れの招待コードです。正確に入力してください。'
  };
};
