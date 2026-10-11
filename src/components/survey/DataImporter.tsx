import React, { useState } from "react";
import {
  FileSpreadsheet,
  UploadCloud,
  ClipboardPaste,
  Sparkles,
  Link2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileText,
  Info,
  X,
} from "lucide-react";
import { parseExcelBuffer, parseRawText } from "../../utils/parser";
import { SAMPLE_TSV_DATA } from "../../utils/sampleData";
import { normalizeSheetUrls, parseGoogleSheetHtml, detectGoogleServiceType, resolveGoogleFormEmbedUrl } from "../../utils/sheetResolver";
import { getSurveyConfig, saveSurveyConfig } from "../../services/surveySyncService";

interface DataImporterProps {
  onDataLoaded: (
    headers: string[],
    rows: string[][],
    sourceName: string
  ) => void;
  onClose?: () => void;
  isModal?: boolean;
  initialSheetUrl?: string;
  initialFormUrl?: string;
}

export const DataImporter: React.FC<DataImporterProps> = ({ 
  onDataLoaded, 
  onClose, 
  isModal = false,
  initialSheetUrl,
  initialFormUrl
}) => {
  const currentConfig = getSurveyConfig();
  const [activeTab, setActiveTab] = useState<"sheet" | "file" | "paste" | "sample">("sheet");
  const [sheetUrl, setSheetUrl] = useState(initialSheetUrl ?? currentConfig.sheetUrl ?? "");
  const [formUrl, setFormUrl] = useState(initialFormUrl ?? currentConfig.formUrl ?? "");
  const [pasteContent, setPasteContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Clear notifications
  const clearNotice = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Google Sheets Fetch handler
  const handleFetchSheet = async () => {
    clearNotice();
    if (!sheetUrl.trim()) {
      setErrorMessage("Googleスプレッドシートの公開URLまたは共有URLを入力してください。");
      return;
    }

    setIsLoading(true);
    try {
      // 入力されたURLの種別を判定
      let targetSheetUrl = sheetUrl.trim();
      let targetFormUrl = formUrl.trim();

      if (detectGoogleServiceType(targetSheetUrl) === 'form') {
        // スプレッドシート欄にフォームURLが入力された場合はformUrlに移動
        targetFormUrl = targetSheetUrl;
        setFormUrl(targetFormUrl);
        targetSheetUrl = '';
        setSheetUrl('');
        saveSurveyConfig(targetSheetUrl, targetFormUrl, true, 60);
        setErrorMessage("Googleフォームの回答URLが入力されました。このフォームに紐づく「回答スプレッドシート」のURLも入力してください（Googleフォームの『回答』タブ ➔ 『スプレッドシートにリンク』で作成されたURL）。");
        setIsLoading(false);
        return;
      }

      let rawText = "";

      // Step 1: Try server-side proxy
      try {
        const endpoint = `/api/fetch-sheet?url=${encodeURIComponent(targetSheetUrl)}`;
        const res = await fetch(endpoint);
        if (res.ok) {
          rawText = await res.text();
        } else {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.error || `サーバー通信エラー: ${res.status}`);
        }
      } catch (proxyErr: any) {
        // Step 2: Fallback to client-side direct fetch
        const candidateUrls = normalizeSheetUrls(targetSheetUrl);
        let clientFetched = false;
        for (const url of candidateUrls) {
          try {
            const res = await fetch(url);
            if (res.ok) {
              const text = await res.text();
              if (text.includes("<table") || text.includes("<tr")) {
                const parsed = parseGoogleSheetHtml(text);
                if (parsed.trim().length > 0) {
                  rawText = parsed;
                  clientFetched = true;
                  break;
                }
              } else if (!text.includes("<!DOCTYPE html>")) {
                rawText = text;
                clientFetched = true;
                break;
              }
            }
          } catch {
            // continue next candidate
          }
        }
        if (!clientFetched) {
          throw proxyErr;
        }
      }

      if (!rawText.trim()) {
        throw new Error("スプレッドシートからデータを取得できませんでした。アクセス権限やURLをご確認ください。");
      }

      const { headers, rows } = parseRawText(rawText);

      if (rows.length === 0) {
        throw new Error("データ行が見つかりませんでした。ヘッダー行と回答データが含まれているかご確認ください。");
      }

      // 設定を永続保持（一度入力したら次回以降も自動更新）
      saveSurveyConfig(targetSheetUrl, targetFormUrl, true, 60);

      setSuccessMessage(`Googleスプレッドシートから ${rows.length} 件の回答データを正常に読み込みました。今後は自動で最新データが同期されます。`);
      onDataLoaded(headers, rows, "Googleスプレッドシート連携");
    } catch (err: any) {
      setErrorMessage(err?.message || "Googleスプレッドシートの取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  // File Upload handler
  const handleFileUpload = async (file: File) => {
    clearNotice();
    setIsLoading(true);

    try {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        const buffer = await file.arrayBuffer();
        const { headers, rows } = parseExcelBuffer(buffer);
        if (rows.length === 0) throw new Error("エクセル内に回答データが見つかりませんでした。");
        setSuccessMessage(`エクセルファイル「${file.name}」から ${rows.length} 件の回答データを読み込みました。`);
        onDataLoaded(headers, rows, file.name);
      } else {
        // CSV or TSV or plain text
        const text = await file.text();
        const { headers, rows } = parseRawText(text);
        if (rows.length === 0) throw new Error("ファイル内に有効な回答データが見つかりませんでした。");
        setSuccessMessage(`CSVファイル「${file.name}」から ${rows.length} 件の回答データを読み込みました。`);
        onDataLoaded(headers, rows, file.name);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "ファイルの読み込みに失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  // Paste Text handler
  const handlePasteSubmit = () => {
    clearNotice();
    if (!pasteContent.trim()) {
      setErrorMessage("貼り付けテキストが空です。スプレッドシートまたはCSVのデータを貼り付けてください。");
      return;
    }

    try {
      const { headers, rows } = parseRawText(pasteContent);
      if (rows.length === 0) {
        throw new Error("有効なデータ行が見つかりませんでした。ヘッダー行を含めて貼り付けてください。");
      }
      setSuccessMessage(`貼り付けテキストから ${rows.length} 件の回答データを読み込みました。`);
      onDataLoaded(headers, rows, "テキスト貼り付け");
    } catch (err: any) {
      setErrorMessage(err?.message || "テキストの解析に失敗しました。");
    }
  };

  // Sample Data loader
  const handleLoadSample = () => {
    clearNotice();
    const { headers, rows } = parseRawText(SAMPLE_TSV_DATA);
    setSuccessMessage(`柳井市まちなかアンケートのサンプルデータ（全 ${rows.length} 件）を読み込みました。`);
    onDataLoaded(headers, rows, "柳井市まちなかアンケート実証サンプル");
  };

  return (
    <div id="data-importer-card" className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Importer Navigation Tabs */}
      <div className="border-b border-slate-100 bg-slate-50/50 p-2 sm:p-3 flex flex-wrap gap-1.5 items-center">
        <button
          id="tab-sheet"
          type="button"
          onClick={() => { setActiveTab("sheet"); clearNotice(); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "sheet"
              ? "bg-white text-blue-700 shadow-xs border border-blue-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-blue-600" />
          <span>Googleスプレッドシート（URL貼り付け）</span>
          <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">推奨</span>
        </button>

        <button
          id="tab-file"
          type="button"
          onClick={() => { setActiveTab("file"); clearNotice(); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "file"
              ? "bg-white text-blue-700 shadow-xs border border-blue-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <UploadCloud className="w-4 h-4 text-emerald-600" />
          <span>エクセル / CSV アップロード</span>
        </button>

        <button
          id="tab-paste"
          type="button"
          onClick={() => { setActiveTab("paste"); clearNotice(); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "paste"
              ? "bg-white text-blue-700 shadow-xs border border-blue-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <ClipboardPaste className="w-4 h-4 text-amber-600" />
          <span>データ直接貼り付け</span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            id="btn-quick-sample"
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-lg text-xs font-semibold transition shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>柳井市サンプルデータを試す</span>
          </button>
          {onClose && !isModal && (
            <button
              id="btn-close-importer"
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition text-xs font-semibold"
              title="取り込み画面を閉じる"
            >
              <X className="w-4 h-4" />
              <span>閉じる</span>
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-6">
        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-800 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">読み込みエラー</p>
              <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs font-medium">{successMessage}</p>
          </div>
        )}

        {/* Tab 1: Google Spreadsheet & Google Form (Direct URL, Embed, Auto-Sync) */}
        {activeTab === "sheet" && (
          <div className="space-y-4">
            {/* Field A: Google Form URL (Embed & Direct link) */}
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="form-url-input" className="block text-xs font-bold text-blue-900">
                  ① GoogleフォームのURL（回答フォーム / 埋め込み用 embedUrl）
                </label>
                <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-bold">
                  一度入力すると保持されます
                </span>
              </div>
              <div className="relative">
                <input
                  id="form-url-input"
                  type="url"
                  value={formUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormUrl(val);
                    if (detectGoogleServiceType(val) === 'sheet' && !sheetUrl) {
                      setSheetUrl(val);
                    }
                  }}
                  placeholder="https://docs.google.com/forms/d/e/.../viewform または https://forms.gle/..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-blue-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <Link2 className="w-4 h-4 text-blue-400 absolute left-3 top-2.5" />
              </div>
              <div className="text-[11px] text-blue-800 flex items-center justify-between gap-2">
                <span>※ 入力されたURLは自動的に <code>?embedded=true</code>（埋め込み用）に正規化され、サイト内で直接回答できます。</span>
                {formUrl && (
                  <span className="text-emerald-700 font-bold shrink-0">
                    ✓ 埋め込みURL準備完了
                  </span>
                )}
              </div>
            </div>

            {/* Field B: Google Spreadsheet URL (Answers & Raw data) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="sheet-url-input" className="block text-xs sm:text-sm font-semibold text-slate-800">
                  ② GoogleスプレッドシートのURL（回答データ集計用） <span className="text-rose-500 font-bold">*</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  （「リンクを知っている全員が閲覧可」に設定）
                </span>
              </div>
              <div className="relative">
                <input
                  id="sheet-url-input"
                  type="url"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit または .../pubhtml"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  disabled={isLoading}
                />
                <FileSpreadsheet className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <div className="text-xs text-slate-500 flex items-start gap-1.5 max-w-xl">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  <strong>自動同期仕様:</strong> 一度URLを入力して「ダッシュボード生成・同期開始」を押すと、設定はブラウザに保持され、Googleフォームに新しい回答が送信されるたびに<strong>自動で最新データがダッシュボードへ同期・反映</strong>されます。
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSheetUrl("https://docs.google.com/spreadsheets/d/e/2PACX-1vYanaiSampleSpreadsheet/pubhtml");
                    setFormUrl("https://docs.google.com/forms/d/e/1FAIpQLScSampleYanaiDreamPlan/viewform");
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2"
                >
                  URL例を入力
                </button>
                <button
                  id="btn-load-sheet"
                  type="button"
                  onClick={handleFetchSheet}
                  disabled={isLoading || !sheetUrl.trim()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium text-sm rounded-lg shadow-xs transition cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>同期接続中...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>設定保存 & ダッシュボード同期開始</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Excel / CSV File Upload */}
        {activeTab === "file" && (
          <div className="space-y-4">
            <div
              id="file-dropzone"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                isDragOver
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/30"
              }`}
              onClick={() => document.getElementById("file-input-element")?.click()}
            >
              <input
                id="file-input-element"
                type="file"
                accept=".xlsx,.xls,.csv,.tsv,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  エクセル (.xlsx / .xls) または CSVファイルをここにドラッグ＆ドロップ
                </p>
                <p className="text-xs text-slate-500 mt-1">またはクリックしてパソコンからファイルを選択</p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 bg-slate-100 rounded">Googleフォーム回答CSV</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded">Excel (.xlsx)</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded">タブ区切り (.tsv)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Text Paste */}
        {activeTab === "paste" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="dataInput" className="block text-sm font-semibold text-slate-800">
                スプレッドシートやエクセルの回答データを貼り付け（ヘッダー行を含む）
              </label>
              <button
                type="button"
                onClick={() => setPasteContent("")}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                クリア
              </button>
            </div>
            <textarea
              id="dataInput"
              rows={6}
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              placeholder={`タイムスタンプ\t問1: 所属の自治会\t問2: 性別\t問3: 年代\t問4: 世帯構成\t問5: 柳井の自慢できるもの\t問6: よく利用する施設\t問7: 不安・困りごと\t問8: あったらいいな\n2026/08/10 10:15\t白壁・柳井津\t女性\t30代\t子育て世帯\t白壁の町並み,金魚ちょうちん\tやない西蔵\t子どもの遊び場不足\t屋内コミュニティ広場`}
              className="w-full p-3 bg-slate-50/50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            />
            <div className="flex justify-end">
              <button
                id="btn-generate-paste"
                type="button"
                onClick={handlePasteSubmit}
                disabled={!pasteContent.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium text-sm rounded-lg shadow-xs transition"
              >
                <ClipboardPaste className="w-4 h-4" />
                <span>貼り付けデータからダッシュボードを生成</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
