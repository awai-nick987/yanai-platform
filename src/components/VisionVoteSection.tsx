import React, { useState } from 'react';
import { VisionOption } from '../types';
import { Vote, Check, Sparkles, TrendingUp, Users, MessageSquare, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VisionVoteSectionProps {
  visionOptions: VisionOption[];
  onVoteVision: (id: string) => void;
}

export const VisionVoteSection: React.FC<VisionVoteSectionProps> = ({
  visionOptions,
  onVoteVision
}) => {
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});
  const [ageSelectMap, setAgeSelectMap] = useState<Record<string, string>>({
    'vis-001': '10代',
    'vis-002': '10代',
    'vis-003': '10代'
  });
  const [commentMap, setCommentMap] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<{ id: string; visionTitle: string; age: string; comment: string; time: string }[]>([
    { id: 'f-1', visionTitle: 'ビジョン案A：回遊と滞在のまち', age: '10代', comment: '放課後に立ち寄れる白壁カフェやベンチが欲しいです！', time: '10分前' },
    { id: 'f-2', visionTitle: 'ビジョン案B：子育て起点のまち', age: '30代', comment: '柳井川沿いのベビーカー散歩道と親子の休憩拠点を強く支持します。', time: '1時間前' },
    { id: 'f-3', visionTitle: 'ビジョン案C：移動を軸にしたまち', age: '60代', comment: '小型の電動バスで白壁と柳井港がつながると大変助かります。', time: '3時間前' }
  ]);

  const totalVotes = visionOptions.reduce((acc, opt) => acc + opt.votes, 0);

  const handleVoteClick = (opt: VisionOption) => {
    onVoteVision(opt.id);
    setVotedMap(prev => ({ ...prev, [opt.id]: true }));

    const currentComment = commentMap[opt.id];
    const currentAge = ageSelectMap[opt.id] || '年代未選択';

    if (currentComment && currentComment.trim()) {
      setFeedbacks(prev => [
        {
          id: `fb-${Date.now()}`,
          visionTitle: opt.title,
          age: currentAge,
          comment: currentComment.trim(),
          time: 'たった今'
        },
        ...prev
      ]);
      setCommentMap(prev => ({ ...prev, [opt.id]: '' }));
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  return (
    <section id="vision-vote-section" className="space-y-6">
      
      {/* Title Header matching Screenshot */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ビジョン策定：複数案投票
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          複数案を投稿として公開し、市民投票で方向性を絞る実証プロトタイプです。
        </p>
      </div>

      {/* 3 Vision Cards matching Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visionOptions.map((opt, idx) => {
          const isVoted = !!votedMap[opt.id];
          const selectedAge = ageSelectMap[opt.id] || '10代';
          const commentText = commentMap[opt.id] || '';

          return (
            <div
              key={opt.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between space-y-5 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {opt.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {opt.subtitle || opt.description}
                </p>

                <div className="text-[11px] text-slate-400 font-medium">
                  提案元: admin / 投票数: <span className="font-bold text-blue-700">{opt.votes}</span>
                </div>
              </div>

              {/* Vote Inputs Form inside Card matching screenshot */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 gap-3">
                  
                  {/* 年代 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      年代
                    </label>
                    <select
                      value={selectedAge}
                      onChange={(e) => setAgeSelectMap({ ...ageSelectMap, [opt.id]: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="10代">10代 (高校生・学生)</option>
                      <option value="20代">20代</option>
                      <option value="30代">30代 (子育て世代)</option>
                      <option value="40代">40代</option>
                      <option value="50代">50代</option>
                      <option value="60代">60代以上 (シニア)</option>
                    </select>
                  </div>

                  {/* 一言（任意） */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      一言（任意）
                    </label>
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentMap({ ...commentMap, [opt.id]: e.target.value })}
                      placeholder="共感ポイントや要望を一言..."
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                </div>

                {/* Vote Button matching screenshot */}
                <button
                  type="button"
                  onClick={() => handleVoteClick(opt)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    isVoted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white active:scale-98'
                  }`}
                >
                  {isVoted ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>投票済み (+1)</span>
                    </>
                  ) : (
                    <span>この案に投票</span>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Citizen Feedback Ticker */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
        <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          <span>最新の投票・市民の声</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {feedbacks.slice(0, 3).map((fb) => (
            <div key={fb.id} className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold text-blue-700">{fb.age}</span>
                <span>{fb.time}</span>
              </div>
              <p className="text-slate-700 font-medium">{fb.comment}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
