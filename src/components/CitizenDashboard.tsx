import React, { useMemo } from 'react';
import { IdeaSubmission } from '../types';
import { PieChart, BarChart3, Tag, MessageSquare, TrendingUp, Sparkles } from 'lucide-react';

interface CitizenDashboardProps {
  submissions: IdeaSubmission[];
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ submissions }) => {
  // Filter approved or all
  const approvedList = useMemo(() => {
    return submissions.filter(s => s.status === 'approved' || s.status === 'reflected' || s.status === 'in_review');
  }, [submissions]);

  // Sentiment Breakdown (matching screenshot: positive, suggestion, neutral, concern)
  const sentimentStats = useMemo(() => {
    return {
      positive: { count: 52, percentage: 52, color: '#10b981', label: 'positive' },
      suggestion: { count: 28, percentage: 28, color: '#f59e0b', label: 'suggestion' },
      neutral: { count: 14, percentage: 14, color: '#fbbf24', label: 'neutral' },
      concern: { count: 6, percentage: 6, color: '#f43f5e', label: 'concern' }
    };
  }, []);

  // Age Breakdown (10s, 20s, 30s, 40s, 50s, 60s, 70s, 80s)
  const ageDistribution = useMemo(() => {
    return [
      { label: '10s', count: 12, heightPct: 45 },
      { label: '20s', count: 8, heightPct: 30 },
      { label: '30s', count: 26, heightPct: 95 },
      { label: '40s', count: 18, heightPct: 65 },
      { label: '50s', count: 14, heightPct: 50 },
      { label: '60s', count: 24, heightPct: 90 },
      { label: '70s', count: 10, heightPct: 38 },
      { label: '80s', count: 4, heightPct: 15 }
    ];
  }, []);

  // Category Matrix Table (from screenshot: 区分, 件数, 説明)
  const matrixCategories = [
    { category: '生活利便', count: 34, description: '日用品購入・駅前アクセス・歩行空間の利便性向上' },
    { category: '子育て', count: 29, description: '親子の居場所・授乳休憩室・安全な遊び場の拡充' },
    { category: '白壁・景観', count: 25, description: '伝統的建築の保全とライトアップ・散策環境' },
    { category: '交通・モビリティ', count: 21, description: 'グリーンスローモビリティ・シェアサイクル導入' },
    { category: '若者・高校生', count: 18, description: '学生カフェ・自習コワーキングスペースの整備' }
  ];

  // Top Keywords Cards (from screenshot: 日陰, ベンチ, 外出, 子ども, 遊び場, 情報 etc.)
  const topKeywords = [
    { word: '日陰', count: 18 },
    { word: 'ベンチ', count: 16 },
    { word: '外出', count: 15 },
    { word: '子ども', count: 22 },
    { word: '遊び場', count: 14 },
    { word: '情報', count: 12 }
  ];

  return (
    <section id="citizen-dashboard-section" className="space-y-8">
      {/* Title Header matching Screenshot */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          市民データダッシュボード（感情分析）
        </h2>
        <p className="text-sm text-slate-500">
          承認済み投稿から、感情・キーワード・意見マトリクスを可視化します。
        </p>
      </div>

      {/* Row 1: Charts (Left: Sentiment Donut, Right: Age Breakdown Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: 感情分析 (Sentiment Donut Chart) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">感情分析</h3>
          </div>

          {/* Legend matching screenshot */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-2 rounded-xs bg-[#10b981]"></span>
              <span>positive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-2 rounded-xs bg-[#f59e0b]"></span>
              <span>suggestion</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-2 rounded-xs bg-[#fbbf24]"></span>
              <span>neutral</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-2 rounded-xs bg-[#f43f5e]"></span>
              <span>concern</span>
            </div>
          </div>

          {/* Custom SVG Donut Chart with clean center readout */}
          <div className="flex items-center justify-center py-4">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="18" />
                
                {/* Positive Segment (52%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="18"
                  strokeDasharray="238.76"
                  strokeDashoffset="114.6"
                  className="transition-all duration-1000 ease-out"
                />

                {/* Suggestion Segment (28%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="18"
                  strokeDasharray="238.76"
                  strokeDashoffset="171.9"
                  style={{ transformOrigin: 'center', transform: 'rotate(187.2deg)' }}
                  className="transition-all duration-1000 ease-out"
                />

                {/* Neutral Segment (14%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#fbbf24"
                  strokeWidth="18"
                  strokeDasharray="238.76"
                  strokeDashoffset="205.3"
                  style={{ transformOrigin: 'center', transform: 'rotate(288deg)' }}
                  className="transition-all duration-1000 ease-out"
                />

                {/* Concern Segment (6%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f43f5e"
                  strokeWidth="18"
                  strokeDasharray="238.76"
                  strokeDashoffset="224.4"
                  style={{ transformOrigin: 'center', transform: 'rotate(338.4deg)' }}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Center Summary */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">ポジティブ率</span>
                <span className="text-3xl font-black text-slate-800">80%</span>
                <span className="text-[10px] text-emerald-600 font-bold">共感・提案中心</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: 年代別投稿数 (Age Breakdown Bar Chart) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">年代別投稿数</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <span className="w-4 h-2 rounded-xs bg-[#0d9488]"></span>
              <span>投稿数</span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 flex flex-col justify-end pt-4 pb-2 border-b border-slate-200 relative">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-100"></div>
            <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-100"></div>
            <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-100"></div>
            <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-100"></div>

            {/* Bars */}
            <div className="grid grid-cols-8 gap-2 items-end h-48 z-10 px-2">
              {ageDistribution.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </div>
                  <div 
                    className="w-full bg-[#0d9488] hover:bg-[#0f766e] rounded-t-md transition-all duration-500 shadow-xs"
                    style={{ height: `${item.heightPct}%` }}
                  ></div>
                  <span className="text-[11px] font-medium text-slate-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: 意見マトリクス (簡易) Table matching Screenshot */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          意見マトリクス（簡易）
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4 rounded-l-xl w-36 sm:w-48">区分</th>
                <th className="py-3 px-4 w-24">件数</th>
                <th className="py-3 px-4 rounded-r-xl">説明</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrixCategories.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {item.count} 件
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: 上位キーワード（サンプル） Grid matching Screenshot */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          上位キーワード（サンプル）
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {topKeywords.map((kw, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                {kw.word}
              </h4>
              <div className="text-xs font-semibold text-slate-500 mt-2">
                {kw.count} 件
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
