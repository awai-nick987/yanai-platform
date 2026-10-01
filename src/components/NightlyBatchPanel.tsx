import React, { useState } from 'react';
import { 
  Clock, 
  RefreshCw, 
  FileSpreadsheet, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  TrendingUp, 
  Send,
  Database,
  ArrowRight
} from 'lucide-react';
import { FREQUENT_KEYWORDS } from '../data/mockData';

interface NightlyBatchPanelProps {
  lastAnalysisTime: string;
  reflectionMode: 'manual' | 'auto';
  onToggleReflectionMode: (mode: 'manual' | 'auto') => void;
  onTriggerInstantBatch: () => void;
  isAnalyzing: boolean;
  spreadSheetId: string;
}

export const NightlyBatchPanel: React.FC<NightlyBatchPanelProps> = ({
  lastAnalysisTime,
  reflectionMode,
  onToggleReflectionMode,
  onTriggerInstantBatch,
  isAnalyzing,
  spreadSheetId
}) => {
  const [selectedWordFilter, setSelectedWordFilter] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-100 text-xs font-semibold mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            毎晩午前3時 自動データ分析・GAS集計エンジン
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            低コスト自律運用ステータス ＆ トレンド分析
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Google Apps Script（GAS）が毎晩午前3:00に全投稿を集計し、自然言語処理と2軸評価を自動実行します。
          </p>
        </div>

        <button
          onClick={onTriggerInstantBatch}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-950 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? '集計実行中...' : '夜間バッチを今すぐ疑似実行'}</span>
        </button>
      </div>

      {/* Grid: Batch Setting Switcher & GAS Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reflection Mode Switcher Card */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-600" />
              反映モード設定
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
              reflectionMode === 'manual'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              {reflectionMode === 'manual' ? 'マニュアル反映（推奨）' : '自動反映モード'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            {reflectionMode === 'manual'
              ? '毎晩3時の分析完了後、管理者が内容を確認して「公開」を押すことでダッシュボードへ反映されます。'
              : '毎晩3時の分析完了後、ダッシュボードの数値とマトリックスが即座に自動公開されます。'}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleReflectionMode('manual')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                reflectionMode === 'manual'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              マニュアル反映
            </button>
            <button
              onClick={() => onToggleReflectionMode('auto')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                reflectionMode === 'auto'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              自動反映
            </button>
          </div>
        </div>

        {/* Google Ecosystem & GAS Health Card */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Googleスプレッドシート連携
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                同期完了
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div>シートID: <code className="text-[11px] font-mono text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">{spreadSheetId}</code></div>
              <div>次回定時トリガー: <strong className="text-slate-800">翌日 午前03:00 (JST)</strong></div>
              <div>API実行コスト: <span className="text-emerald-700 font-semibold">¥0 (Googleエコシステム内完結)</span></div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>独立運用モデル: 正常稼働</span>
            <span className="text-indigo-600 font-medium cursor-pointer hover:underline">接続テスト済</span>
          </div>
        </div>
      </div>

      {/* Word Cloud & Trending Keywords */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              市民意見 頻出キーワード＆トレンド解析（ワードクラウド）
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">形態素解析・出現頻度順</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
          {FREQUENT_KEYWORDS.map((item, idx) => {
            const isSelected = selectedWordFilter === item.text;
            // Dynamic text size and colors based on weight
            const sizeClass = 
              item.weight >= 0.85 ? 'text-base font-bold bg-indigo-900 text-white shadow-xs' :
              item.weight >= 0.7 ? 'text-sm font-semibold bg-blue-100 text-blue-900 border border-blue-200' :
              item.weight >= 0.5 ? 'text-xs font-medium bg-white text-slate-800 border border-slate-300' :
              'text-[11px] bg-slate-100 text-slate-600';

            return (
              <button
                key={idx}
                onClick={() => setSelectedWordFilter(isSelected ? null : item.text)}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${sizeClass} ${
                  isSelected ? 'ring-2 ring-amber-400 scale-105' : 'hover:scale-105'
                }`}
              >
                <span>{item.text}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  item.weight >= 0.85 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
