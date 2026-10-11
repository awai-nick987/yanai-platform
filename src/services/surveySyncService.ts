/**
 * 柳井市まちなか共創プラットフォーム
 * Googleフォーム & Googleスプレッドシート 自動同期・永続化マネージャー
 */

import { normalizeSheetUrls, parseGoogleSheetHtml, resolveGoogleFormEmbedUrl, detectGoogleServiceType } from '../utils/sheetResolver';
import { parseRawText, detectColumnMapping } from '../utils/parser';
import { ColumnMapping } from '../types/survey';

export interface SurveyConfig {
  sheetUrl: string;
  formUrl: string;
  embedUrl: string;
  autoSync: boolean;
  syncIntervalSec: number;
  lastSyncTime?: string;
}

export interface CachedSurveyData {
  headers: string[];
  rows: string[][];
  mapping: ColumnMapping;
  sourceName: string;
  lastSyncTime: string;
}

const STORAGE_KEYS = {
  SHEET_URL: 'yanai_survey_sheet_url',
  FORM_URL: 'yanai_survey_form_url',
  AUTO_SYNC: 'yanai_survey_auto_sync',
  SYNC_INTERVAL: 'yanai_survey_sync_interval',
  HEADERS: 'yanai_survey_headers',
  ROWS: 'yanai_survey_raw_rows',
  MAPPING: 'yanai_survey_mapping',
  SOURCE_NAME: 'yanai_survey_source_name',
  LAST_SYNC: 'yanai_survey_last_sync'
};

/**
 * 設定情報の取得
 */
export function getSurveyConfig(): SurveyConfig {
  const sheetUrl = localStorage.getItem(STORAGE_KEYS.SHEET_URL) || '';
  const formUrl = localStorage.getItem(STORAGE_KEYS.FORM_URL) || '';
  const autoSyncRaw = localStorage.getItem(STORAGE_KEYS.AUTO_SYNC);
  const autoSync = autoSyncRaw !== null ? autoSyncRaw === 'true' : true;
  const syncIntervalSec = Number(localStorage.getItem(STORAGE_KEYS.SYNC_INTERVAL)) || 60;
  const lastSyncTime = localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || undefined;

  return {
    sheetUrl,
    formUrl,
    embedUrl: resolveGoogleFormEmbedUrl(formUrl),
    autoSync,
    syncIntervalSec,
    lastSyncTime
  };
}

/**
 * 設定情報の保存
 */
export function saveSurveyConfig(
  sheetUrl: string, 
  formUrl: string, 
  autoSync: boolean = true, 
  syncIntervalSec: number = 60
): SurveyConfig {
  const cleanSheet = sheetUrl.trim();
  const cleanForm = formUrl.trim();

  localStorage.setItem(STORAGE_KEYS.SHEET_URL, cleanSheet);
  localStorage.setItem(STORAGE_KEYS.FORM_URL, cleanForm);
  localStorage.setItem(STORAGE_KEYS.AUTO_SYNC, String(autoSync));
  localStorage.setItem(STORAGE_KEYS.SYNC_INTERVAL, String(syncIntervalSec));

  return {
    sheetUrl: cleanSheet,
    formUrl: cleanForm,
    embedUrl: resolveGoogleFormEmbedUrl(cleanForm),
    autoSync,
    syncIntervalSec
  };
}

/**
 * キャッシュされたデータの取得
 */
export function getCachedSurveyData(): CachedSurveyData | null {
  try {
    const rawHeaders = localStorage.getItem(STORAGE_KEYS.HEADERS);
    const rawRows = localStorage.getItem(STORAGE_KEYS.ROWS);
    const rawMapping = localStorage.getItem(STORAGE_KEYS.MAPPING);
    const sourceName = localStorage.getItem(STORAGE_KEYS.SOURCE_NAME) || 'Googleフォーム連携データ';
    const lastSyncTime = localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || '';

    if (!rawHeaders || !rawRows) return null;

    const headers = JSON.parse(rawHeaders) as string[];
    const rows = JSON.parse(rawRows) as string[][];
    const mapping = rawMapping ? JSON.parse(rawMapping) : detectColumnMapping(headers);

    if (rows.length === 0) return null;

    return {
      headers,
      rows,
      mapping,
      sourceName,
      lastSyncTime
    };
  } catch (err) {
    console.error('Failed to load cached survey data:', err);
    return null;
  }
}

/**
 * データのキャッシュ保存
 */
export function saveCachedSurveyData(
  headers: string[], 
  rows: string[][], 
  mapping: ColumnMapping, 
  sourceName: string = 'Googleフォーム回答データ'
): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HEADERS, JSON.stringify(headers));
    localStorage.setItem(STORAGE_KEYS.ROWS, JSON.stringify(rows));
    localStorage.setItem(STORAGE_KEYS.MAPPING, JSON.stringify(mapping));
    localStorage.setItem(STORAGE_KEYS.SOURCE_NAME, sourceName);
    const nowStr = new Date().toLocaleString('ja-JP');
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, nowStr);
  } catch (err) {
    console.error('Failed to save cached survey data:', err);
  }
}

/**
 * Googleスプレッドシート（または公開CSV）から最新データをフェッチ
 */
export async function fetchSurveySheetData(sheetUrl: string): Promise<{
  headers: string[];
  rows: string[][];
  mapping: ColumnMapping;
  sourceName: string;
}> {
  if (!sheetUrl.trim()) {
    throw new Error('スプレッドシートのURLが入力されていません');
  }

  let rawText = '';

  // 1. サーバーサイドプロキシ (/api/fetch-sheet) を試行
  try {
    const endpoint = `/api/fetch-sheet?url=${encodeURIComponent(sheetUrl.trim())}`;
    const res = await fetch(endpoint);
    if (res.ok) {
      rawText = await res.text();
    } else {
      throw new Error(`Proxy error: ${res.status}`);
    }
  } catch {
    // 2. クライアントサイドでの直接フェッチ（フォールバック）
    const candidateUrls = normalizeSheetUrls(sheetUrl.trim());
    let clientFetched = false;
    for (const url of candidateUrls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const text = await res.text();
          if (text.includes('<table') || text.includes('<tr')) {
            const parsed = parseGoogleSheetHtml(text);
            if (parsed.trim().length > 0) {
              rawText = parsed;
              clientFetched = true;
              break;
            }
          } else if (!text.includes('<!DOCTYPE html>')) {
            rawText = text;
            clientFetched = true;
            break;
          }
        }
      } catch {
        // 次のURL候補を試行
      }
    }
    if (!clientFetched && !rawText) {
      throw new Error('Googleスプレッドシートからデータを取得できませんでした。共有設定（リンクを知っている全員が閲覧可）をご確認ください。');
    }
  }

  if (!rawText.trim()) {
    throw new Error('スプレッドシートの回答データが空でした。');
  }

  const { headers, rows } = parseRawText(rawText);
  if (rows.length === 0) {
    throw new Error('データ行が見つかりませんでした。回答データが含まれているかご確認ください。');
  }

  const mapping = detectColumnMapping(headers);
  const sourceName = 'Googleフォーム連携スプレッドシート';

  // 自動保存
  saveCachedSurveyData(headers, rows, mapping, sourceName);

  return { headers, rows, mapping, sourceName };
}
