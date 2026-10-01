import React, { useState } from 'react';
import { RecruitmentPost } from '../types';
import { Users, PlusCircle, Calendar, MapPin, CheckCircle, Trash2, Edit3, UserCheck, ShieldCheck } from 'lucide-react';

interface RecruitmentAdminProps {
  posts: RecruitmentPost[];
  onCreatePost: (newPost: Partial<RecruitmentPost>) => void;
  onUpdatePostStatus?: (id: string, status: RecruitmentPost['status']) => void;
}

export const RecruitmentAdmin: React.FC<RecruitmentAdminProps> = ({
  posts,
  onCreatePost
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState(10);
  const [date, setDate] = useState('2026-08-31');
  const [category, setCategory] = useState<RecruitmentPost['category']>('support_crew');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onCreatePost({
      title: title.trim(),
      description: description.trim(),
      capacity: Number(capacity),
      currentApplicants: 0,
      status: 'recruiting',
      category: category,
      date: date,
      targetAudience: ['高校生', '市民ボランティア', '一般参加者'],
      benefits: ['活動証明書発行', '金魚ちょうちんオリジナルグッズ'],
      location: '柳井駅前・白壁エリア'
    });

    setTitle('');
    setDescription('');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold mb-2 border border-amber-200">
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>要員募集 運用担当ポータル</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            募集投稿・応募者管理
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            実証実験やワークショップの募集案件を作成・公開・進捗管理します。
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isFormOpen ? 'フォームを閉じる' : '新規募集案件を作成'}</span>
        </button>
      </div>

      {/* Create Form */}
      {isFormOpen && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs animate-in fade-in space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            新規募集案件の作成
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">募集タイトル *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="例: 白壁ライトアップ 実験ボランティア募集"
                  className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">募集区分</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RecruitmentPost['category'])}
                  className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none"
                >
                  <option value="support_crew">実証実験サポーター</option>
                  <option value="high_school_project">高校生探究プロジェクト</option>
                  <option value="workshop_facilitator">WSファシリテーター</option>
                  <option value="diy_renovation">古民家DIYクルー</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">定員 (名)</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">募集締切日</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">募集内容・業務概要 *</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="活動内容、当日の持ち物、集合場所などを詳しく記入してください。"
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer"
            >
              募集を公開する
            </button>
          </form>
        </div>
      )}

      {/* Posts List matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {post.status === 'recruiting' ? '受付中' : '募集締切'}
              </span>
              <span className="text-xs text-slate-400">応募: {post.currentApplicants} / {post.capacity} 名</span>
            </div>

            <h3 className="text-base font-bold text-slate-900">{post.title}</h3>
            <p className="text-xs text-slate-600">{post.description}</p>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>締切: {post.date || '2026-08-31'}</span>
              <span className="text-blue-600 font-semibold">{post.location}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
