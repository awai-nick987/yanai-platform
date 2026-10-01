import React from 'react';
import { Smartphone, Tablet, Monitor, RefreshCw, Layers } from 'lucide-react';
import { DevicePreviewMode } from '../types';

interface DevicePreviewBarProps {
  previewMode: DevicePreviewMode;
  setPreviewMode: (mode: DevicePreviewMode) => void;
  currentRole: string;
  onOpenLoginModal: () => void;
}

export const DevicePreviewBar: React.FC<DevicePreviewBarProps> = ({
  previewMode,
  setPreviewMode,
  currentRole,
  onOpenLoginModal
}) => {
  return (
    <div className="bg-slate-950 text-slate-300 text-xs px-3 sm:px-4 py-1.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-50 sticky top-0">
      {/* Device Mode Switcher */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline-flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>画面プレビュー切替:</span>
        </span>

        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setPreviewMode('auto')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              previewMode === 'auto'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="画面幅に自動追従"
          >
            <RefreshCw className="w-3 h-3" />
            <span>自動 (Auto)</span>
          </button>

          <button
            onClick={() => setPreviewMode('mobile')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              previewMode === 'mobile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="スマートフォン表示 (390px)"
          >
            <Smartphone className="w-3 h-3" />
            <span>スマホ (390px)</span>
          </button>

          <button
            onClick={() => setPreviewMode('tablet')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              previewMode === 'tablet'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="タブレット表示 (768px)"
          >
            <Tablet className="w-3 h-3" />
            <span>タブレット (768px)</span>
          </button>

          <button
            onClick={() => setPreviewMode('desktop')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              previewMode === 'desktop'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="PCデスクトップ表示 (フル)"
          >
            <Monitor className="w-3 h-3" />
            <span>PC (100%)</span>
          </button>
        </div>
      </div>

      {/* Right side info & Login Indicator */}
      <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
        <div className="hidden md:flex items-center gap-1.5 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>柳井市まちなか共創ポータル v1.0</span>
        </div>

        {currentRole === 'citizen' ? (
          <button
            onClick={onOpenLoginModal}
            className="px-2.5 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>関係者ログイン</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-slate-800/90 px-2 py-0.5 rounded-md border border-slate-700">
            <span className="text-slate-400">ログイン中:</span>
            <span className="text-amber-300 font-bold uppercase">
              {currentRole === 'admin' ? '管理者 (Admin)' : currentRole === 'workspace' ? 'メンバー (Member)' : '募集担当 (Recruiter)'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
