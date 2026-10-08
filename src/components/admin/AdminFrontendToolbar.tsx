import React from 'react';
import { 
  Eye, 
  EyeOff, 
  Edit3, 
  Save, 
  SlidersHorizontal, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Layout
} from 'lucide-react';
import { SystemSettings, FrontendSectionKey } from '../../types';

interface SectionInfo {
  id: FrontendSectionKey;
  label: string;
}

const SECTIONS: SectionInfo[] = [
  { id: 'hero', label: 'トップ（Hero）' },
  { id: 'projects', label: '実証プロジェクト' },
  { id: 'vision', label: 'ビジョン投票' },
  { id: 'town_map', label: 'まちなか共創マップ' },
  { id: 'idobata', label: 'まちなか井戸端会議' },
  { id: 'recruitment', label: 'サポーター募集' },
  { id: 'submit_idea', label: 'アイデア投稿' },
  { id: 'citizen_dashboard', label: 'データ分析' },
  { id: 'about', label: '基本計画とは' }
];

interface AdminFrontendToolbarProps {
  systemSettings: SystemSettings;
  onToggleSection: (key: FrontendSectionKey) => void;
  isInlineEditMode: boolean;
  onToggleInlineEditMode: () => void;
  hasUnsavedChanges: boolean;
  onSaveInlineChanges: () => void;
  onResetInlineChanges: () => void;
  onOpenSectionTextEditor: (sectionKey: string, sectionTitle: string) => void;
}

export const AdminFrontendToolbar: React.FC<AdminFrontendToolbarProps> = ({
  systemSettings,
  onToggleSection,
  isInlineEditMode,
  onToggleInlineEditMode,
  hasUnsavedChanges,
  onSaveInlineChanges,
  onResetInlineChanges,
  onOpenSectionTextEditor
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const toggles = systemSettings.frontendSectionToggles || {
    hero: true,
    about: true,
    projects: true,
    vision: true,
    recruitment: true,
    submit_idea: true,
    citizen_dashboard: true,
    heroFloatingStats: true
  };

  return (
    <div className="bg-slate-900 text-white border-b-2 border-amber-500 shadow-xl sticky top-14 sm:top-16 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        
        {/* Main Toolbar Line */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Admin Mode Badge & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[11px] tracking-wide shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>管理者専用コントロール</span>
            </div>
            
            <span className="text-xs text-slate-300 font-medium hidden md:inline">
              フロントエンド画面のセクション表示切替＆テキスト編集
            </span>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Toggle Section Detail Panel */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                isExpanded 
                  ? 'bg-blue-600 text-white border-blue-500 shadow-xs' 
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>セクション表示切替 ({SECTIONS.filter(s => toggles[s.id as keyof typeof toggles] ?? true).length}/{SECTIONS.length})</span>
            </button>

            {/* Inline Text Editing Switch */}
            <button
              type="button"
              onClick={onToggleInlineEditMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                isInlineEditMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md animate-pulse'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isInlineEditMode ? '✏️ テキスト編集モードON' : 'テキスト直接編集'}</span>
            </button>

            {/* Save Inline Changes Button */}
            {hasUnsavedChanges && (
              <div className="flex items-center gap-1.5 animate-in fade-in">
                <button
                  type="button"
                  onClick={onSaveInlineChanges}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>変更を保存</span>
                </button>
                <button
                  type="button"
                  onClick={onResetInlineChanges}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-rose-900/50 text-slate-300 hover:text-rose-200 border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                  title="未保存の変更を破棄"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Inline Edit Notice Banner when Active */}
        {isInlineEditMode && (
          <div className="mt-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>画面上のテキスト（見出しや説明文）をクリックすると直接書き換えられます。編集後は右上の「変更を保存」を押してください。</span>
            </span>
            <span className="text-[10px] text-amber-200 font-mono bg-amber-500/20 px-2 py-0.5 rounded">
              {hasUnsavedChanges ? '⚠️ 未保存の変更あり' : '✓ 最新状態'}
            </span>
          </div>
        )}

        {/* Expandable Section Toggles Tray */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>各セクションの公開 / 非公開（市民画面からの表示切替）：</span>
              <span className="text-[11px] text-slate-500">※ 非公開にしたセクションは、管理者ログイン中のみ確認できます</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {SECTIONS.map((sec) => {
                const isVisible = toggles[sec.id as keyof typeof toggles] ?? true;
                return (
                  <div 
                    key={sec.id}
                    className={`p-2 rounded-xl border flex flex-col justify-between transition-all ${
                      isVisible 
                        ? 'bg-slate-800/90 border-slate-700 text-slate-100' 
                        : 'bg-slate-950/60 border-rose-900/40 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate mb-1.5" title={sec.label}>
                      {sec.label}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Toggle Visibility */}
                      <button
                        type="button"
                        onClick={() => onToggleSection(sec.id)}
                        className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                          isVisible
                            ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                        }`}
                      >
                        {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{isVisible ? '公開中' : '非公開'}</span>
                      </button>

                      {/* Edit Text */}
                      <button
                        type="button"
                        onClick={() => onOpenSectionTextEditor(sec.id, sec.label)}
                        className="p-1 rounded-lg bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="テキストを編集"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
