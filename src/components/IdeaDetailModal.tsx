import React, { useState } from 'react';
import { IdeaSubmission } from '../types';
import { 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  MapPin, 
  Tag, 
  Calendar, 
  User, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  Send,
  Building,
  School,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface IdeaDetailModalProps {
  submission: IdeaSubmission | null;
  onClose: () => void;
  onVote: (id: string, type: 'up' | 'down') => void;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  submission,
  onClose,
  onVote
}) => {
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<{ author: string; text: string; time: string }[]>([
    { author: '柳井学園高校 生徒会', text: '放課後に使える自習＆カフェスペースの設置、大賛成です！', time: '1日前' },
    { author: '白壁まちなか商業会', text: '夜間の行灯照明とタイアップして、秋のイベント期間中にテスト導入できそうですね。', time: '2日前' }
  ]);

  if (!submission) return null;

  const handleVoteClick = (type: 'up' | 'down') => {
    onVote(submission.id, type);
    if (type === 'up') {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLocalComments([
      ...localComments,
      {
        author: '参加市民',
        text: commentText.trim(),
        time: 'たった今'
      }
    ]);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
              {submission.category === 'youth_student' ? '🏫 若者・高校生提案' :
               submission.category === 'value_creation' ? '✨ 価値創造' :
               submission.category === 'improvement' ? '🛠 改善点・課題' : '💡 まちづくり提案'}
            </span>
            {submission.status === 'reflected' && (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                夢プラン反映確定
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 flex-1">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {submission.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <strong className="text-slate-800">{submission.authorName}</strong>
                {submission.organization && <span>({submission.organization})</span>}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {submission.locationName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {submission.createdAt}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {submission.description}
          </div>

          {/* Expectation & Feasibility 2-Axis Score Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100">
              <div className="flex justify-between items-center text-xs font-semibold text-indigo-900 mb-1">
                <span>住民期待度（熱量スコア）</span>
                <span className="text-indigo-700 font-bold text-sm">{submission.expectationScore}点</span>
              </div>
              <div className="w-full h-2 bg-indigo-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${submission.expectationScore}%` }}></div>
              </div>
            </div>

            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
              <div className="flex justify-between items-center text-xs font-semibold text-emerald-900 mb-1">
                <span>実現可能性スコア</span>
                <span className="text-emerald-700 font-bold text-sm">{submission.feasibilityScore}点</span>
              </div>
              <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${submission.feasibilityScore}%` }}></div>
              </div>
            </div>
          </div>

          {/* Committee Notes if any */}
          {submission.committeeComments && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                まちなか夢プラン策定委員会 メモ・方針
              </div>
              <p className="text-amber-950 leading-relaxed">
                {submission.committeeComments}
              </p>
            </div>
          )}

          {/* Voting CTAs */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-600 font-medium">
              このアイデアに共感しますか？
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVoteClick('up')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>共感・賛成 ({submission.upvotes})</span>
              </button>
              <button
                onClick={() => handleVoteClick('down')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ThumbsDown className="w-3.5 h-3.5 text-slate-400" />
                <span>要検討 ({submission.downvotes})</span>
              </button>
            </div>
          </div>

          {/* Discussion Thread */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span>市民対話スレッド ({localComments.length}件)</span>
            </h4>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="この提案についての応援や建設的なコメントを入力..."
                className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-950 rounded-lg shadow-2xs transition-colors"
              >
                送信
              </button>
            </form>

            <div className="space-y-2">
              {localComments.map((c, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <div className="flex justify-between text-slate-400 text-[10px] mb-0.5">
                    <span className="font-bold text-slate-800">{c.author}</span>
                    <span>{c.time}</span>
                  </div>
                  <p className="text-slate-700">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
