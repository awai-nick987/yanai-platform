import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Users, X, CheckCircle, Bell, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkshopPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySuccess?: () => void;
}

export const WorkshopPopupModal: React.FC<WorkshopPopupModalProps> = ({ isOpen, onClose, onApplySuccess }) => {
  const [applicantName, setApplicantName] = useState('');
  const [affiliation, setAffiliation] = useState('高校生（柳井学園・柳井高等）');
  const [email, setEmail] = useState('');
  const [interestNote, setInterestNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSubmitted(true);
    if (onApplySuccess) onApplySuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-indigo-100 overflow-hidden relative">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            参加者大募集！［先着30名］
          </div>
          <h3 className="text-lg sm:text-xl font-bold leading-tight">
            第3回 まちなか未来共創ワークショップ＆高校生アイデアソン
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            柳井市中心市街地活性化「まちなか夢プラン」策定に向けた市民共創会議
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!submitted ? (
            <div>
              {/* Event Metadata Cards */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 mb-5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-semibold text-slate-900">日時:</span>
                  <span>2026年9月12日(土) 13:30〜16:30（開場 13:00）</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-semibold text-slate-900">場所:</span>
                  <span>柳井市文化福祉会館 3階 大会議室（オンライン参加可）</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-900">対象:</span>
                  <span>柳井市在住・在学の高校生・一般市民・商工事業者・移住検討者</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    お名前 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="例: 柳井 太郎"
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ご所属・属性 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                  >
                    <option value="高校生（柳井学園・柳井高等）">高校生（柳井学園・柳井高校等）</option>
                    <option value="市内在住（20代〜30代・子育て世代）">市内在住（20代〜30代・子育て世代）</option>
                    <option value="市内在住（40代〜50代・現役世代）">市内在住（40代〜50代・現役世代）</option>
                    <option value="市内在住（60代以上・シニア）">市内在住（60代以上・シニア）</option>
                    <option value="市内商工事業者・自営業">市内商工事業者・自営業</option>
                    <option value="市外在住・通勤通学・ファン">市外在住・通勤通学・関係人口</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    連絡先メールアドレス <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    関心のあるテーマ・一言（任意）
                  </label>
                  <textarea
                    rows={2}
                    value={interestNote}
                    onChange={(e) => setInterestNote(e.target.value)}
                    placeholder="例: 白壁の夜間ライトアップや高校生の居場所づくりについて提案したいです！"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    今は閉じる
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>参加を申し込む</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-6 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                お申し込みを受け付けました！
              </h4>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                ご登録いただいたメールアドレス（{email}）宛に、当日の詳細案内および事前共有資料をお送りいたします。
              </p>
              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                >
                  閉じる
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
