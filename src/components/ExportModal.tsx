import React, { useState } from 'react';
import { IdeaSubmission, VisionOption } from '../types';
import { SPECIFICATION_MARKDOWN } from '../data/specificationText';
import { 
  X, 
  Download, 
  FileText, 
  Map, 
  FileSpreadsheet, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  Copy,
  ExternalLink,
  BookOpen,
  Table,
  Layers,
  HelpCircle,
  FileCode
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: IdeaSubmission[];
  visionOptions: VisionOption[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  submissions,
  visionOptions
}) => {
  const [activeTab, setActiveTab] = useState<'gsheets_sync' | 'specification' | 'gdoc_manual' | 'pdf_a3' | 'geojson' | 'csv' | 'gas_spec'>('gsheets_sync');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  // Show Toast
  const notifySuccess = (msg: string) => {
    setDownloadSuccess(msg);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  // Generate GeoJSON payload
  const generateGeoJson = () => {
    const featureCollection = {
      type: 'FeatureCollection',
      name: 'Yanai_City_Downtown_CoCreation_Ideas_2026',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' }
      },
      features: submissions.map(sub => ({
        type: 'Feature',
        properties: {
          id: sub.id,
          title: sub.title,
          category: sub.category,
          expectationScore: sub.expectationScore,
          feasibilityScore: sub.feasibilityScore,
          upvotes: sub.upvotes,
          ageGroup: sub.ageGroup,
          residency: sub.residency,
          status: sub.status,
          locationName: sub.locationName,
          authorName: sub.authorName
        },
        geometry: {
          type: 'Point',
          coordinates: [sub.lng, sub.lat]
        }
      }))
    };
    return JSON.stringify(featureCollection, null, 2);
  };

  // Generate CSV data (with UTF-8 BOM compatibility)
  const generateCsv = () => {
    const headers = [
      'ID', '提案タイトル', 'カテゴリ', '説明・背景', '提案者', '年代属性',
      '居住地域', '提案場所', '緯度', '経度', '住民期待度(0-100)', '実現可能性(0-100)',
      '共感数', '要検討数', 'ステータス', '投稿日時', 'タグ', '2軸優先ゾーン'
    ];
    const rows = submissions.map(s => [
      s.id,
      `"${(s.title || '').replace(/"/g, '""')}"`,
      s.category === 'value_creation' ? '価値創造・賑わい' : s.category === 'improvement' ? '課題改善・利便性' : 'インフラ・空間再生',
      `"${(s.description || '').replace(/"/g, '""')}"`,
      `"${(s.authorName || '').replace(/"/g, '""')}"`,
      s.ageGroup,
      s.residency,
      `"${(s.locationName || '').replace(/"/g, '""')}"`,
      s.lat,
      s.lng,
      s.expectationScore,
      s.feasibilityScore,
      s.upvotes,
      s.downvotes,
      s.status,
      s.createdAt,
      `"${(s.tags || []).join(';')}"`,
      s.adminAssignedPhase === 'quick_win' ? 'クイックウィン（即時実行）' :
      s.adminAssignedPhase === 'strategic' ? '戦略的重点検討' :
      s.adminAssignedPhase === 'low_hanging' ? '低コスト随時改善' : '中長期構想'
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  // Generate TSV data for direct 1-click clipboard paste into Google Sheets
  const generateTsv = () => {
    const headers = [
      'ID', '提案タイトル', 'カテゴリ', '説明・背景', '提案者', '年代属性',
      '居住地域', '提案場所', '緯度', '経度', '住民期待度', '実現可能性',
      '共感数', '要検討数', 'ステータス', '投稿日時', 'タグ', '2軸優先ゾーン'
    ];
    const rows = submissions.map(s => [
      s.id,
      (s.title || '').replace(/\t|\n/g, ' '),
      s.category === 'value_creation' ? '価値創造・賑わい' : s.category === 'improvement' ? '課題改善・利便性' : 'インフラ・空間再生',
      (s.description || '').replace(/\t|\n/g, ' '),
      (s.authorName || '').replace(/\t|\n/g, ' '),
      s.ageGroup,
      s.residency,
      (s.locationName || '').replace(/\t|\n/g, ' '),
      s.lat,
      s.lng,
      s.expectationScore,
      s.feasibilityScore,
      s.upvotes,
      s.downvotes,
      s.status,
      s.createdAt,
      (s.tags || []).join(';'),
      s.adminAssignedPhase === 'quick_win' ? 'クイックウィン（即時実行）' :
      s.adminAssignedPhase === 'strategic' ? '戦略的重点検討' :
      s.adminAssignedPhase === 'low_hanging' ? '低コスト随時改善' : '中長期構想'
    ]);
    return [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
  };

  // Copy TSV for Google Sheets Paste
  const handleCopyTsvForSheets = async () => {
    try {
      const tsv = generateTsv();
      await navigator.clipboard.writeText(tsv);
      setCopiedType('sheets_tsv');
      notifySuccess('Google スプレッドシート用データをクリップボードにコピーしました！セルA1で貼り付け(Ctrl+V / Cmd+V)できます。');
      setTimeout(() => setCopiedType(null), 3000);
    } catch (err) {
      console.error(err);
      notifySuccess('クリップボードへのコピーに失敗しました。CSVダウンロードをご利用ください。');
    }
  };

  // Download CSV
  const handleDownloadCsv = () => {
    setIsExporting(true);
    setTimeout(() => {
      const blob = new Blob(['\uFEFF' + generateCsv()], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `yanai_opinions_dataset_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
      notifySuccess('CSV データセット（UTF-8 BOM付き / Google Sheets & Excel対応）を出力しました！');
    }, 400);
  };

  // Download GeoJSON
  const handleDownloadGeoJson = () => {
    setIsExporting(true);
    setTimeout(() => {
      const blob = new Blob([generateGeoJson()], { type: 'application/geo+json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `yanai_dream_plan_gis_${new Date().toISOString().slice(0, 10)}.geojson`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
      notifySuccess('GeoJSON GISデータを出力しました！');
    }, 400);
  };

  // Download Manual Text / Markdown
  const handleDownloadManual = () => {
    setIsExporting(true);
    setTimeout(() => {
      const content = document.getElementById('manual-preview-text')?.innerText || '';
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `柳井市まちなか夢プラン_完全運用マニュアル_${new Date().toISOString().slice(0, 10)}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
      notifySuccess('運用マニュアル（テキスト版）を保存しました！');
    }, 400);
  };

  // Copy Manual Text
  const handleCopyManual = async () => {
    try {
      const content = document.getElementById('manual-preview-text')?.innerText || '';
      await navigator.clipboard.writeText(content);
      setCopiedType('manual');
      notifySuccess('運用マニュアルの全文をクリップボードにコピーしました！Google Docsやテキストエディタに貼り付けられます。');
      setTimeout(() => setCopiedType(null), 3000);
    } catch (err) {
      console.error(err);
      notifySuccess('コピーに失敗しました。ダウンロードをご利用ください。');
    }
  };

  // Download Specification Markdown
  const handleDownloadSpecification = () => {
    setIsExporting(true);
    setTimeout(() => {
      const blob = new Blob([SPECIFICATION_MARKDOWN], { type: 'text/markdown;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `柳井市民参加型共創プラットフォーム_統一システム仕様書_v1.0.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
      notifySuccess('統一システム仕様書 (仕様書.md / SPECIFICATION.md) をダウンロードしました！');
    }, 300);
  };

  // Copy Specification Markdown
  const handleCopySpecification = async () => {
    try {
      await navigator.clipboard.writeText(SPECIFICATION_MARKDOWN);
      setCopiedType('specification');
      notifySuccess('統一システム仕様書 全文をクリップボードにコピーしました！');
      setTimeout(() => setCopiedType(null), 3000);
    } catch (err) {
      console.error(err);
      notifySuccess('コピーに失敗しました。ダウンロードをご利用ください。');
    }
  };

  // Print A3
  const handlePrintA3 = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      window.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-amber-300">
                会議資料・オープンデータ・スプレッドシート連携ハブ
              </div>
              <h3 className="text-base sm:text-lg font-bold">
                データエクスポート＆会議用A3出力センター
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('gsheets_sync')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'gsheets_sync'
                ? 'border-emerald-600 text-emerald-950 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-extrabold text-emerald-950">Google スプレッドシート連携 / CSV</span>
            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded-full">確実出力</span>
          </button>

          <button
            onClick={() => setActiveTab('specification')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'specification'
                ? 'border-purple-600 text-purple-950 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-purple-600" />
            <span className="font-bold text-purple-950">統一システム仕様書 v1.0 (仕様書.md)</span>
            <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 text-[10px] rounded-full font-bold">公式定義</span>
          </button>

          <button
            onClick={() => setActiveTab('gdoc_manual')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'gdoc_manual'
                ? 'border-indigo-600 text-indigo-900 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-bold text-blue-950">Vercel & GAS 運用マニュアル (Docs)</span>
          </button>

          <button
            onClick={() => setActiveTab('pdf_a3')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'pdf_a3'
                ? 'border-indigo-600 text-indigo-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>会議用資料PDF (A3) 印刷プレビュー</span>
          </button>

          <button
            onClick={() => setActiveTab('geojson')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'geojson'
                ? 'border-indigo-600 text-indigo-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>GISデータ (GeoJSON)</span>
          </button>

          <button
            onClick={() => setActiveTab('csv')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'csv'
                ? 'border-indigo-600 text-indigo-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>全項目CSVデータセット</span>
          </button>

          <button
            onClick={() => setActiveTab('gas_spec')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'gas_spec'
                ? 'border-indigo-600 text-indigo-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>GAS・独立運用仕様</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {downloadSuccess && (
            <div className="bg-emerald-50 text-emerald-900 text-xs p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between font-bold animate-in fade-in shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{downloadSuccess}</span>
              </div>
            </div>
          )}

          {/* Tab 1: Google Sheets Direct Integration / CSV */}
          {activeTab === 'gsheets_sync' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-xs text-emerald-950 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-emerald-900">
                        Google スプレッドシート ＆ Excel エクスポートハブ
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                        全 {submissions.length} 件
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      市民から投稿された全 {submissions.length} 件のアイデア、共感数、属性、および2軸スコア（全18項目）を即座に出力します。
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* CSV Download Button */}
                    <button
                      onClick={handleDownloadCsv}
                      disabled={isExporting}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.02]"
                    >
                      <Download className="w-4 h-4 text-emerald-200" />
                      <span>CSVをダウンロード</span>
                    </button>

                    {/* Copy TSV for Sheets Paste */}
                    <button
                      onClick={handleCopyTsvForSheets}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      {copiedType === 'sheets_tsv' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">コピー完了！</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-500" />
                          <span>スプレッドシート貼付用コピー</span>
                        </>
                      )}
                    </button>

                    {/* Open sheets.new in new tab */}
                    <a
                      href="https://sheets.new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Google スプレッドシートを新規作成"
                    >
                      <span>新規シートを開く</span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Instructions on how to use in Google Sheets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] flex items-center justify-center font-black">1</span>
                    <span>「スプレッドシート貼付用コピー」を使う場合</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    上の「貼付用コピー」ボタンをクリック後、Googleスプレッドシートの <strong>セル A1</strong> を選択して <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">Ctrl+V</code> (Mac: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">Cmd+V</code>) を押すだけで、全カラムが整形されて瞬時に展開されます。
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[11px] flex items-center justify-center font-black">2</span>
                    <span>「CSVをダウンロード」を使う場合</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    ダウンロードしたCSVファイルは、Excelでダブルクリックして直接開くか、Googleスプレッドシートの「ファイル」&gt;「インポート」からアップロードしてそのまま台帳として活用できます（UTF-8 BOM付きで文字化けゼロ）。
                  </p>
                </div>
              </div>

              {/* Data Table Schema Preview */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    出力されるデータ項目（18カラム構成）
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">18カラム × {submissions.length}レコード</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  {[
                    'ID (sub-001等)', '提案タイトル', '大カテゴリ', '詳細説明・背景',
                    '提案者名 / 属性', '年代属性', '居住地域属性', '提案場所名',
                    '緯度 (Lat)', '経度 (Lng)', '住民期待度スコア (0-100)', '実現可能性スコア (0-100)',
                    '共感リアクション数', '要検討フィードバック数', 'ステータス (approved等)', '投稿日時',
                    '分類タグ', '2軸優先ゾーン (クイックウィン等)'
                  ].map((col, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-150 font-mono text-slate-700 flex items-center gap-1.5">
                      <span className="text-[9px] text-slate-400 w-4 text-right">{idx + 1}.</span>
                      <span className="truncate">{col}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] font-mono flex items-center justify-between">
                  <span className="text-amber-400 font-bold">💡 庁内運用ワンポイント:</span>
                  <span className="text-slate-300">
                    スプレッドシートの「ステータス」列を職員が編集するだけで、Web上の公開/非表示を即座に制御可能。
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Unified System Specification (SPECIFICATION.md / 仕様書.md) */}
          {activeTab === 'specification' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-50 rounded-xl border border-purple-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-xs text-purple-950 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-purple-900">
                        柳井市民参加型共創プラットフォーム 統一システム仕様書 v1.0
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold border border-purple-300">
                        確定仕様書
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      プロジェクト直下の <code className="bg-purple-100 px-1 py-0.5 rounded font-mono text-purple-900 font-bold">/仕様書.md</code> または <code className="bg-purple-100 px-1 py-0.5 rounded font-mono text-purple-900 font-bold">/SPECIFICATION.md</code> に原本が保存されています。
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={handleDownloadSpecification}
                      disabled={isExporting}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-900 hover:bg-purple-950 text-white shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.02]"
                    >
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>仕様書 (.md) をダウンロード</span>
                    </button>

                    <button
                      onClick={handleCopySpecification}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      {copiedType === 'specification' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">コピー完了！</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-500" />
                          <span>仕様書全文をコピー</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-2xs space-y-1">
                    <div className="font-bold text-purple-900 flex items-center gap-1">
                      <span>📁 1. ファイル保存場所</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      プロジェクト最上位（ルート）に <code className="font-mono text-purple-800 font-bold">仕様書.md</code> として配置済み。
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-2xs space-y-1">
                    <div className="font-bold text-purple-900 flex items-center gap-1">
                      <span>🌐 2. 画面から閲覧・保存</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      この画面で全文プレビュー確認、ダウンロード、コピーが1クリックで可能です。
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-2xs space-y-1">
                    <div className="font-bold text-purple-900 flex items-center gap-1">
                      <span>🔄 3. スプレッドシート同期</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      GAS・API連携仕様・データ型定義（TypeScript）も完全網羅。
                    </p>
                  </div>
                </div>
              </div>

              {/* Specification Markdown Viewer */}
              <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 text-xs font-mono max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                {SPECIFICATION_MARKDOWN}
              </div>
            </div>
          )}

          {/* Tab 2: Google Docs Manual Export */}
          {activeTab === 'gdoc_manual' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/80 rounded-xl border border-blue-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-xs text-blue-950 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#002B5B]">
                        Vercel ＆ GAS 独立運用完全マニュアル
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                        ランニングコスト ¥0 (永年無料)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      外部サーバー代・Gemini AI費用が一切かからない自律運用の全手順をテキストまたはGoogle Docs形式で書き出せます。
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={handleDownloadManual}
                      disabled={isExporting}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#002B5B] hover:bg-[#001D3D] text-white shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.02]"
                    >
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>マニュアルをダウンロード</span>
                    </button>

                    <button
                      onClick={handleCopyManual}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      {copiedType === 'manual' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">コピー完了！</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-500" />
                          <span>マニュアル全文をコピー</span>
                        </>
                      )}
                    </button>

                    <a
                      href="https://docs.new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-100 hover:bg-blue-200 text-blue-950 border border-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Google ドキュメントを新規作成"
                    >
                      <span>新規ドキュメントを開く</span>
                      <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Rich Manual Preview */}
              <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>マニュアル収録内容プレビュー</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Markdown / Plain Text Format
                  </span>
                </div>

                <div id="manual-preview-text" className="space-y-4 max-h-96 overflow-y-auto pr-2 text-slate-300 text-[11px] leading-relaxed select-text">
                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                    <div className="text-white font-bold text-xs mb-1">■ 1. アーキテクチャ概要（完全無料・永年¥0 運用）</div>
                    <p className="text-slate-400 text-[11px]">
                      ・フロントエンド: Vercel または Netlify (無料枠: ¥0)<br/>
                      ・データベース: Google スプレッドシート (無料: ¥0)<br/>
                      ・バックエンドAPI: Google Apps Script [GAS] (無料: ¥0)<br/>
                      ・AI依存度: 0%（ルールベース判定＆統計集計によりAI API課金を完全回避）
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                    <div className="text-white font-bold text-xs mb-1">■ 2. Google Apps Script (GAS) 設定手順（約3分）</div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                      <li>Googleドライブでスプレッドシート「柳井市まちなか夢プラン_管理台帳」を新規作成</li>
                      <li>「拡張機能」&gt;「Apps Script」を開き、プロジェクト内 <code className="text-cyan-300">/gas/Code.gs</code> を貼り付け</li>
                      <li>「デプロイ」&gt;「新しいデプロイ」&gt; 種類: ウェブアプリ（アクセス: 全員）として公開し、URLをコピー</li>
                      <li>左メニュー「トリガー」より、関数 <code className="text-cyan-300">nightlyBatchAnalysisTrigger</code> を毎晩午前3時にタイマー設定</li>
                    </ol>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                    <div className="text-white font-bold text-xs mb-1">■ 3. Vercel へのワンクリック公開手順（約2分）</div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                      <li>Vercel (https://vercel.com) にてプロジェクトをインポート</li>
                      <li>Environment Variables（環境変数）に <code className="text-amber-300">VITE_GAS_API_URL</code> = [GASのウェブアプリURL] を設定</li>
                      <li>「Deploy」を実行し、即座にSSL付き公開URLを発行</li>
                    </ol>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                    <div className="text-white font-bold text-xs mb-1">■ 4. 日常の庁内運用 ＆ モデレーション方法</div>
                    <p className="text-slate-400 text-[11px]">
                      ・スプレッドシートの「ideas」シートでステータス（approved / rejected / reflected）を変更するだけでWeb表示を制御。<br/>
                      ・職員が使い慣れたExcel/スプレッドシート形式でバックアップ・集計・マトリックス座標調整が可能。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: A3 Meeting Document Preview */}
          {activeTab === 'pdf_a3' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 bg-blue-50/80 rounded-xl border border-blue-200">
                <div className="text-xs text-blue-950">
                  <span className="font-bold block">策定委員会・議会配布用 A3横レイアウト</span>
                  <span className="text-[11px] text-blue-700">
                    2軸マトリックス散布図、上位優先施策、属性別投票分布を1枚に凝縮した印刷用フォーマットです。
                  </span>
                </div>

                <button
                  onClick={handlePrintA3}
                  disabled={isExporting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-900 hover:bg-indigo-950 text-white shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>A3 PDF出力 / 印刷</span>
                </button>
              </div>

              {/* High-Fidelity A3 Document Render Box */}
              <div className="border border-slate-300 rounded-xl p-6 bg-white shadow-inner space-y-4 text-slate-800 font-sans">
                {/* Gov Header */}
                <div className="flex items-center justify-between border-b-2 border-indigo-900 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-900">
                      柳井市 まちなか夢プラン策定委員会 審議資料 第2号
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      中心市街地活性化基本計画 住民参加型アイデア・合意形成分析レポート
                    </h2>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    <div>作成日: {new Date().toLocaleDateString('ja-JP')}</div>
                    <div>柳井市 地域づくり推進課 / 都市計画課</div>
                  </div>
                </div>

                {/* KPI Summary Strip */}
                <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                  <div>
                    <div className="text-[10px] text-slate-500">投稿アイデア総数</div>
                    <div className="text-base font-bold text-slate-900">{submissions.length} 件</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">総共感・投票数</div>
                    <div className="text-base font-bold text-blue-700">1,248 票</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">クイックウィン選定</div>
                    <div className="text-base font-bold text-emerald-700">4 件 (実証実験へ)</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">高校生・若者参加率</div>
                    <div className="text-base font-bold text-amber-700">42.5%</div>
                  </div>
                </div>

                {/* 2 Column Body Layout for A3 */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {/* Left: Top Quick Wins */}
                  <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50/50">
                    <div className="font-bold text-indigo-900 flex items-center gap-1 border-b border-slate-200 pb-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>① 即時実行候補（クイックウィン）上位案件</span>
                    </div>
                    <ul className="space-y-2 text-[11px]">
                      {submissions.slice(0, 3).map((s, i) => (
                        <li key={i} className="bg-white p-2 rounded border border-slate-200 space-y-0.5">
                          <div className="font-bold text-slate-900">{i + 1}. {s.title}</div>
                          <div className="text-slate-500 text-[10px]">
                            期待度: {s.expectationScore}点 | 実現性: {s.feasibilityScore}点 | 発意: {s.authorName}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Vision Scenario Consensus */}
                  <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50/50">
                    <div className="font-bold text-indigo-900 flex items-center gap-1 border-b border-slate-200 pb-1">
                      <span>② ビジョン別 市民支持率</span>
                    </div>
                    <div className="space-y-2 text-[11px]">
                      {visionOptions.map(v => (
                        <div key={v.id} className="bg-white p-2 rounded border border-slate-200">
                          <div className="flex justify-between font-bold text-slate-900 mb-1">
                            <span className="truncate">{v.title}</span>
                            <span className="text-indigo-700">{v.votes}票</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(v.votes / 1000) * 100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: GeoJSON Export */}
          {activeTab === 'geojson' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">GIS（地理情報システム）連携用 GeoJSON</span>
                  <span className="text-slate-500">
                    QGISやArcGIS、国土数値情報、Google Earth等に直接インポート可能な空間データです。
                  </span>
                </div>
                <button
                  onClick={handleDownloadGeoJson}
                  disabled={isExporting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-900 hover:bg-indigo-950 text-white shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>GeoJSONファイルをダウンロード</span>
                </button>
              </div>

              <div className="bg-slate-950 text-slate-200 font-mono text-[11px] p-4 rounded-xl max-h-64 overflow-y-auto">
                <pre>{generateGeoJson()}</pre>
              </div>
            </div>
          )}

          {/* Tab 5: CSV Dataset Export */}
          {activeTab === 'csv' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">全アイデア・投票属性 CSVデータセット</span>
                  <span className="text-slate-500">
                    Excelや統計ソフトウェア（R, Python, SPSS）で高度なクロス集計を行うためのUTF-8(BOM付き)CSVです。
                  </span>
                </div>
                <button
                  onClick={handleDownloadCsv}
                  disabled={isExporting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-900 hover:bg-indigo-950 text-white shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSVファイルをダウンロード</span>
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 max-h-64 overflow-y-auto whitespace-pre">
                {generateCsv()}
              </div>
            </div>
          )}

          {/* Tab 6: GAS & Independent Operation Architecture */}
          {activeTab === 'gas_spec' && (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
                <div>
                  <span className="font-bold text-sm text-slate-900 block">
                    Google Apps Script (GAS) 独立運用アーキテクチャ仕様
                  </span>
                  <span className="text-[11px] text-slate-500">
                    有償AI API・外部サーバー不要 / Googleスプレッドシート連携
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold self-start sm:self-auto flex items-center gap-1 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  ランニングコスト ¥0 (完全無料)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-[#002B5B]">① 完全0円サーバーレス</div>
                  <p className="text-[11px] text-slate-600">
                    Vercel/Netlify（フロント）＋ GAS/スプレッドシート（DB）の組み合わせにより、月額インフラ費用0円を実現。
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-[#002B5B]">② 毎晩3時の自動集計</div>
                  <p className="text-[11px] text-slate-600">
                    時間主導型トリガーにより、2軸マトリックス・優先ゾーン・頻出キーワードをGASが自動集計。
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-[#002B5B]">③ 職員がExcel感覚で管理</div>
                  <p className="text-[11px] text-slate-600">
                    市民データは自治体のGoogleスプレッドシート内に保管。職員が直接編集・バックアップ可能。
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl text-[11px] font-mono space-y-1.5 border border-slate-800">
                <div className="text-amber-400 font-bold flex items-center justify-between">
                  <span>📄 プロジェクト内のGASスクリプト配置:</span>
                  <span className="text-[10px] text-slate-400">/gas/Code.gs</span>
                </div>
                <p className="text-slate-300 text-[10px]">
                  Googleスプレッドシートの「拡張機能」&gt;「Apps Script」に <code className="text-blue-300 font-bold">/gas/Code.gs</code> を貼り付け、ウェブアプリとしてデプロイするだけで即時稼働します。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

