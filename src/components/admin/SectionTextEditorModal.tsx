import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Edit3, Sparkles } from 'lucide-react';
import { SectionTextContent } from '../../types';

interface SectionTextEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionKey: string;
  sectionTitle: string;
  initialTexts?: SectionTextContent;
  defaultTexts?: SectionTextContent;
  onSave: (sectionKey: string, updatedTexts: SectionTextContent) => void;
}

export const SectionTextEditorModal: React.FC<SectionTextEditorModalProps> = ({
  isOpen,
  onClose,
  sectionKey,
  sectionTitle,
  initialTexts,
  defaultTexts,
  onSave
}) => {
  const safeInitial: SectionTextContent = initialTexts || {};
  const safeDefault: SectionTextContent = defaultTexts || {};

  const [formData, setFormData] = useState<SectionTextContent>({
    badge: '',
    title: '',
    subtitle: '',
    description: '',
    ctaText1: '',
    ctaText2: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        badge: safeInitial.badge ?? safeDefault.badge ?? '',
        title: safeInitial.title ?? safeDefault.title ?? '',
        subtitle: safeInitial.subtitle ?? safeDefault.subtitle ?? '',
        description: safeInitial.description ?? safeDefault.description ?? '',
        ctaText1: safeInitial.ctaText1 ?? safeDefault.ctaText1 ?? '',
        ctaText2: safeInitial.ctaText2 ?? safeDefault.ctaText2 ?? ''
      });
    }
  }, [isOpen, initialTexts, defaultTexts]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(sectionKey, formData);
    onClose();
  };

  const handleResetToDefault = () => {
    if (window.confirm(`「${sectionTitle}」のテキストを初期値に戻しますか？`)) {
      setFormData({
        badge: safeDefault.badge ?? '',
        title: safeDefault.title ?? '',
        subtitle: safeDefault.subtitle ?? '',
        description: safeDefault.description ?? '',
        ctaText1: safeDefault.ctaText1 ?? '',
        ctaText2: safeDefault.ctaText2 ?? ''
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-600/50 text-blue-200 uppercase tracking-wider">
                  管理者専用
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {sectionKey}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {sectionTitle} のテキスト編集
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            ここで編集したテキストは、トップ画面上の該当セクションに即時反映され、一般市民（未ログイン時）の画面にも表示されます。
          </p>

          {/* Badge / Eyebrow */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              バッジ・小見出しテキスト（英語または日本語）
            </label>
            <input
              type="text"
              value={formData.badge || ''}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="例: PROJECT PURPOSE / 柳井市まちなかまちづくりプロジェクト"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Main Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              メインタイトル（見出し） <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="例: 白壁の町並みと駅前をつなぐ、次世代の柳井をともに創る。"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              サブタイトル・キャッチフレーズ
            </label>
            <input
              type="text"
              value={formData.subtitle || ''}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="例: まちの未来がひらく、共創の瞬間。声が集まり、希望が形になる。"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              詳細説明文（本文）
            </label>
            <textarea
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="セクションの背景や詳細な説明文を入力してください。"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Hero only CTA buttons */}
          {sectionKey === 'hero' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  第1ボタン文言
                </label>
                <input
                  type="text"
                  value={formData.ctaText1 || ''}
                  onChange={(e) => setFormData({ ...formData, ctaText1: e.target.value })}
                  placeholder="意見を投稿する"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  第2ボタン文言
                </label>
                <input
                  type="text"
                  value={formData.ctaText2 || ''}
                  onChange={(e) => setFormData({ ...formData, ctaText2: e.target.value })}
                  placeholder="プロジェクトを見る"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>初期設定に戻す</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>変更を保存して反映</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
