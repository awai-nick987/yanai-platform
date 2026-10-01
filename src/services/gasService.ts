/* =========================================================================
 * 柳井市まちなか共創プラットフォーム
 * GAS (Google Apps Script) 独立運用データ連携クライアント
 * ========================================================================= */
import { IdeaSubmission } from '../types';

// Vercel / Netlify の環境変数（VITE_GAS_API_URL）または直接URLを指定
const GAS_API_ENDPOINT = ((import.meta as any).env?.VITE_GAS_API_URL as string) || '';

export interface GasApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  ideas?: IdeaSubmission[];
  lastNightlyBatch?: string;
}

/**
 * Googleスプレッドシート（GAS）から最新の公開アイデア一覧を取得
 */
export async function fetchIdeasFromGas(): Promise<IdeaSubmission[] | null> {
  if (!GAS_API_ENDPOINT) {
    console.info('[GAS Service] VITE_GAS_API_URL が設定されていないため、ローカル/キャッシュデータを使用します。');
    return null;
  }

  try {
    const res = await fetch(`${GAS_API_ENDPOINT}?action=get_all_data`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json: GasApiResponse<IdeaSubmission[]> = await res.json();
    if (json.status === 'success' && json.ideas) {
      return json.ideas;
    }
    return null;
  } catch (err) {
    console.warn('[GAS Service] スプレッドシートからの取得に失敗しました。ローカルデータにフォールバックします:', err);
    return null;
  }
}

/**
 * 新しいアイデアをGoogleスプレッドシート（GAS）に投稿
 */
export async function submitIdeaToGas(idea: Partial<IdeaSubmission>): Promise<{ success: boolean; id?: string }> {
  if (!GAS_API_ENDPOINT) {
    return { success: true, id: `local-${Date.now()}` };
  }

  try {
    const res = await fetch(GAS_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // GAS CORS対策
      body: JSON.stringify({
        action: 'submit_idea',
        ...idea
      })
    });
    const json = await res.json();
    return { success: json.status === 'success', id: json.id };
  } catch (err) {
    console.error('[GAS Service] 投稿送信エラー:', err);
    return { success: false };
  }
}

/**
 * アイデアへの共感（いいね）をGoogleスプレッドシートに送信
 */
export async function upvoteIdeaToGas(id: string): Promise<boolean> {
  if (!GAS_API_ENDPOINT) return true;

  try {
    await fetch(GAS_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'upvote',
        id: id
      })
    });
    return true;
  } catch (err) {
    console.error('[GAS Service] 投票送信エラー:', err);
    return false;
  }
}
