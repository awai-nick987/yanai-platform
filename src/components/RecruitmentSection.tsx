import React, { useState } from 'react';
import { RecruitmentPost } from '../types';
import { Users, Calendar, MapPin, CheckCircle, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RecruitmentSectionProps {
  posts: RecruitmentPost[];
  onApply: (postId: string) => void;
  onOpenCreateModal?: () => void;
  isRecruiter?: boolean;
}

export const RecruitmentSection: React.FC<RecruitmentSectionProps> = ({
  posts,
  onApply
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(posts[0]?.id || '');
  const [applicantName, setApplicantName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [desiredRole, setDesiredRole] = useState('');
  const [notes, setNotes] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !contactInfo.trim()) return;

    if (selectedProjectId) {
      onApply(selectedProjectId);
    }

    setAppliedSuccess(true);
    setApplicantName('');
    setContactInfo('');
    setDesiredRole('');
    setNotes('');

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => setAppliedSuccess(false), 5000);
  };

  return (
    <section id="recruitment-section" className="space-y-8">
      
      {/* Title Header matching Screenshot */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          実証実験 要員募集
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          現在募集中の実証実験プロトタイプを一覧で確認し、応募できます。
        </p>
      </div>

      {/* Recruitment Cards matching Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, idx) => {
          const isReceptionOpen = post.status === 'recruiting';

          return (
            <div
              key={post.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isReceptionOpen ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {isReceptionOpen ? '受付中' : '近日開催'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {post.description}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 font-medium pt-3 border-t border-slate-100">
                募集人数: <span className="font-bold text-slate-700">{post.capacity}</span> / 締切: {post.date || '2026-08-31'}
              </div>
            </div>
          );
        })}
      </div>

      {/* 応募フォーム (サンプル) matching Screenshot */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">
          応募フォーム（サンプル）
        </h3>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-4xl">
          
          {appliedSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-xs sm:text-sm font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>実証実験への参加応募を受け付けました！担当者よりご連絡いたします。</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Row 1: 募集案件 & お名前 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 募集案件 * */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  募集案件 *
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">選択してください</option>
                  {posts.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              {/* お名前 * */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  お名前 *
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  required
                  placeholder="山田 太郎"
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

            </div>

            {/* Row 2: 連絡先 & 希望役割 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 連絡先 * */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  連絡先 *
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  required
                  placeholder="email@example.com または 電話番号"
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* 希望役割 */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  希望役割
                </label>
                <input
                  type="text"
                  value={desiredRole}
                  onChange={(e) => setDesiredRole(e.target.value)}
                  placeholder="記録補助 / 司会補助 など"
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

            </div>

            {/* Row 3: メモ */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                メモ
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="参加可能日時や意気込みなどをご自由にご記入ください。"
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>

            {/* Submit Button matching Screenshot */}
            <div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <span>応募する</span>
              </button>
            </div>

          </form>
        </div>
      </div>

    </section>
  );
};
