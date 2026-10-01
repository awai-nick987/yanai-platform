import React from 'react';
import { Lightbulb, MessageSquareQuote, CheckCircle2, ArrowRight, Sparkles, TrendingUp, Users2, MapPin } from 'lucide-react';

interface ProcessBannerProps {
  onOpenSubmitModal: () => void;
  stats: {
    totalSubmissions: number;
    totalVotes: number;
    reflectedCount: number;
    activeUsers: number;
  };
}

export const ProcessBanner: React.FC<ProcessBannerProps> = ({ onOpenSubmitModal, stats }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-indigo-900/60 relative">
      {/* Decorative Traditional Shirakabe / Water Pattern Background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative p-6 sm:p-8 lg:p-10">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-indigo-900/80">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              柳井市中心市街地活性化基本計画（まちなか夢プラン）共創事業
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              「投稿して終わり」にしない。<br className="hidden sm:inline" />
              住民のアイデアから、未来計画への反映までを可視化。
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              白壁の町並みや柳井駅前、柳井川の水辺空間をより豊かにする市民の「声」を集め、策定委員会での対話・実証実験を経て、具体的な行政施策や民間事業へと結びつけます。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenSubmitModal}
              className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-slate-950" />
              <span>あなたのアイデアを投稿する</span>
            </button>
          </div>
        </div>

        {/* 3-Step Process Cards */}
        <div className="mt-6">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3 flex items-center gap-2">
            <span>合意形成と計画策定の3ステップ</span>
            <span className="h-px flex-1 bg-slate-800"></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-900/90 rounded-xl p-4 border border-indigo-800/40 relative group hover:border-blue-500/60 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">意見・アイデア投稿</h3>
                  <p className="text-[11px] text-blue-300">マップ連動＆属性選択</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                「改善点」「価値創造」の視点で街の気づきや願望をマップ上にプロット。高校生からシニアまで幅広く収集。
              </p>
              <div className="mt-3 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>現在 {stats.totalSubmissions} 件の声を収集中</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/90 rounded-xl p-4 border border-indigo-800/40 relative group hover:border-amber-500/60 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center shadow-xs">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">策定委員会にて対話・検討</h3>
                  <p className="text-[11px] text-amber-300">2軸マトリックス分析</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                毎晩午前3時の自動集計と2軸分析（実現可能性×期待度）により、優先度の高い施策を客観的に選定。
              </p>
              <div className="mt-3 text-[11px] text-amber-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>毎晩03:00 GAS自動分析・連携中</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/90 rounded-xl p-4 border border-indigo-800/40 relative group hover:border-emerald-500/60 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm flex items-center justify-center shadow-xs">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">ビジョン・未来計画に反映</h3>
                  <p className="text-[11px] text-emerald-300">社会実験＆実事業化</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                選定された施策を「まちなか夢プラン」に正式登載し、実証実験・ワークショップを通じて市民と共に実装。
              </p>
              <div className="mt-3 text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{stats.reflectedCount} 件のアイデアが計画に反映完了</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live KPI Quick Bar */}
        <div className="mt-6 pt-5 border-t border-indigo-900/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-950/50 rounded-lg p-2.5 border border-indigo-900/40">
            <div className="text-[11px] text-slate-400">集まったアイデア総数</div>
            <div className="text-xl font-bold text-amber-400">{stats.totalSubmissions} <span className="text-xs font-normal text-slate-400">件</span></div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-2.5 border border-indigo-900/40">
            <div className="text-[11px] text-slate-400">市民投票・共感リアクション</div>
            <div className="text-xl font-bold text-blue-400">{stats.totalVotes} <span className="text-xs font-normal text-slate-400">票</span></div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-2.5 border border-indigo-900/40">
            <div className="text-[11px] text-slate-400">施策化・計画反映済み</div>
            <div className="text-xl font-bold text-emerald-400">{stats.reflectedCount} <span className="text-xs font-normal text-slate-400">件</span></div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-2.5 border border-indigo-900/40">
            <div className="text-[11px] text-slate-400">参加ユーザー・高校生数</div>
            <div className="text-xl font-bold text-purple-400">{stats.activeUsers} <span className="text-xs font-normal text-slate-400">名</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
