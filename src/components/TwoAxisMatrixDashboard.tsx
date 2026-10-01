import React, { useState } from 'react';
import { IdeaSubmission, AgeGroup, ResidencyArea, CategoryType } from '../types';
import { 
  BarChart3, 
  Sparkles, 
  Filter, 
  Layers, 
  ArrowUpRight, 
  HelpCircle, 
  Download, 
  TrendingUp, 
  School, 
  Baby, 
  Briefcase, 
  Coffee, 
  SlidersHorizontal,
  CheckCircle2,
  FileText,
  Clock,
  Compass
} from 'lucide-react';

interface TwoAxisMatrixDashboardProps {
  submissions: IdeaSubmission[];
  onSelectSubmission: (submission: IdeaSubmission) => void;
  onOpenExportModal: () => void;
  lastAnalysisTime: string;
  reflectionMode: 'manual' | 'auto';
  onTriggerInstantBatch: () => void;
  isAnalyzing: boolean;
}

export const TwoAxisMatrixDashboard: React.FC<TwoAxisMatrixDashboardProps> = ({
  submissions,
  onSelectSubmission,
  onOpenExportModal,
  lastAnalysisTime,
  reflectionMode,
  onTriggerInstantBatch,
  isAnalyzing
}) => {
  // Deep Attribute Filter States
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedResidency, setSelectedResidency] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>('all');
  const [hoveredItem, setHoveredItem] = useState<IdeaSubmission | null>(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState<IdeaSubmission | null>(submissions[0] || null);

  // Filter Submissions
  const filteredSubmissions = submissions.filter(sub => {
    if (selectedAge !== 'all' && sub.ageGroup !== selectedAge) return false;
    if (selectedResidency !== 'all' && sub.residency !== selectedResidency) return false;
    if (selectedCategory !== 'all' && sub.category !== selectedCategory) return false;
    
    // Quadrant logic
    const isHighExpect = sub.expectationScore >= 75;
    const isHighFeas = sub.feasibilityScore >= 70;
    
    if (selectedQuadrant === 'quick_win' && !(isHighExpect && isHighFeas)) return false;
    if (selectedQuadrant === 'strategic' && !(isHighExpect && !isHighFeas)) return false;
    if (selectedQuadrant === 'low_hanging' && !(!isHighExpect && isHighFeas)) return false;
    if (selectedQuadrant === 'long_term' && !(!isHighExpect && !isHighFeas)) return false;

    return true;
  });

  // Calculate Quadrant Counts
  const quickWins = submissions.filter(s => s.expectationScore >= 75 && s.feasibilityScore >= 70);
  const strategic = submissions.filter(s => s.expectationScore >= 75 && s.feasibilityScore < 70);
  const lowHanging = submissions.filter(s => s.expectationScore < 75 && s.feasibilityScore >= 70);
  const longTerm = submissions.filter(s => s.expectationScore < 75 && s.feasibilityScore < 70);

  const getBubbleColor = (sub: IdeaSubmission) => {
    const isHighExpect = sub.expectationScore >= 75;
    const isHighFeas = sub.feasibilityScore >= 70;

    if (isHighExpect && isHighFeas) return 'bg-emerald-500 hover:bg-emerald-600 border-emerald-200 text-white shadow-emerald-500/30';
    if (isHighExpect && !isHighFeas) return 'bg-amber-500 hover:bg-amber-600 border-amber-200 text-slate-950 shadow-amber-500/30';
    if (!isHighExpect && isHighFeas) return 'bg-blue-500 hover:bg-blue-600 border-blue-200 text-white shadow-blue-500/30';
    return 'bg-slate-500 hover:bg-slate-600 border-slate-200 text-white shadow-slate-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Header & Status Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 shadow-md border border-indigo-900/60">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                意思決定支援・政策評価AIエンジン
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                GAS自動集計稼働中
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              2軸マトリックス分析（実現可能性 × 住民期待度）
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              市民から寄せられたアイデアを「実現のしやすさ」と「市民の熱量・共感度」で自動スコアリング。行政・策定委員会が客観的エビデンスに基づき優先順位を判断できます。
            </p>
          </div>

          {/* Quick Actions & Nightly Sync Status */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-slate-800/90 rounded-xl p-2.5 border border-slate-700 text-[11px] space-y-0.5">
              <div className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                <span>前回バッチ集計: <strong className="text-slate-200">{lastAnalysisTime}</strong></span>
              </div>
              <div className="text-slate-400 flex items-center gap-1">
                <span>反映モード: </span>
                <strong className={`font-semibold ${reflectionMode === 'manual' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {reflectionMode === 'manual' ? 'マニュアル確認反映' : 'リアルタイム自動反映'}
                </strong>
              </div>
            </div>

            <button
              onClick={onTriggerInstantBatch}
              disabled={isAnalyzing}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? '分析中...' : '即時再集計を実行'}</span>
            </button>

            <button
              onClick={onOpenExportModal}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>会議用PDF(A3)生成</span>
            </button>
          </div>
        </div>

        {/* 4 Quadrants Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-indigo-900/60">
          <button
            onClick={() => setSelectedQuadrant(selectedQuadrant === 'quick_win' ? 'all' : 'quick_win')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedQuadrant === 'quick_win'
                ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/40'
                : 'bg-slate-900/60 border-emerald-900/60 hover:bg-slate-900'
            }`}
          >
            <div className="text-[10px] font-semibold text-emerald-400">① 即時実行・クイックウィン</div>
            <div className="text-lg font-bold text-white mt-0.5">{quickWins.length} <span className="text-xs text-slate-400">件</span></div>
            <div className="text-[10px] text-slate-400">高期待 × 高実現性（実証実験へ）</div>
          </button>

          <button
            onClick={() => setSelectedQuadrant(selectedQuadrant === 'strategic' ? 'all' : 'strategic')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedQuadrant === 'strategic'
                ? 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-400/40'
                : 'bg-slate-900/60 border-amber-900/60 hover:bg-slate-900'
            }`}
          >
            <div className="text-[10px] font-semibold text-amber-400">② 戦略的重点検討</div>
            <div className="text-lg font-bold text-white mt-0.5">{strategic.length} <span className="text-xs text-slate-400">件</span></div>
            <div className="text-[10px] text-slate-400">高期待 × 中長期（財源・協定調整）</div>
          </button>

          <button
            onClick={() => setSelectedQuadrant(selectedQuadrant === 'low_hanging' ? 'all' : 'low_hanging')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedQuadrant === 'low_hanging'
                ? 'bg-blue-950/80 border-blue-400 ring-2 ring-blue-400/40'
                : 'bg-slate-900/60 border-blue-900/60 hover:bg-slate-900'
            }`}
          >
            <div className="text-[10px] font-semibold text-blue-400">③ 低コスト随時改善</div>
            <div className="text-lg font-bold text-white mt-0.5">{lowHanging.length} <span className="text-xs text-slate-400">件</span></div>
            <div className="text-[10px] text-slate-400">中期待 × 高実現性（小規模修繕等）</div>
          </button>

          <button
            onClick={() => setSelectedQuadrant(selectedQuadrant === 'long_term' ? 'all' : 'long_term')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedQuadrant === 'long_term'
                ? 'bg-slate-950 border-slate-400 ring-2 ring-slate-400/40'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
            }`}
          >
            <div className="text-[10px] font-semibold text-slate-400">④ 長期構想・見直し</div>
            <div className="text-lg font-bold text-white mt-0.5">{longTerm.length} <span className="text-xs text-slate-400">件</span></div>
            <div className="text-[10px] text-slate-400">要条件整備・他施策と統合検討</div>
          </button>
        </div>
      </div>

      {/* Deep Demographic Attribute Filters Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>属性別ディープフィルタリング（特定の声のみを抽出）</span>
          </div>
          {(selectedAge !== 'all' || selectedResidency !== 'all' || selectedCategory !== 'all' || selectedQuadrant !== 'all') && (
            <button
              onClick={() => {
                setSelectedAge('all');
                setSelectedResidency('all');
                setSelectedCategory('all');
                setSelectedQuadrant('all');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
            >
              フィルターを全解除
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Age Demographics */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              年代・属性（高校生・子育て等）
            </label>
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="all">全年代（全体表示）</option>
              <option value="teens">🎓 10代（高校生・柳井学園・柳井高）</option>
              <option value="twenties_thirties">👶 20〜30代（若手・子育て世代）</option>
              <option value="forties_fifties">💼 40〜50代（現役世代・事業者）</option>
              <option value="sixties_plus">🍵 60代以上（シニア・地域役員）</option>
            </select>
          </div>

          {/* Residency / Region */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              居住エリア・所属
            </label>
            <select
              value={selectedResidency}
              onChange={(e) => setSelectedResidency(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="all">全エリア（市内・市外）</option>
              <option value="downtown_station">🚉 柳井駅前・中心市街地</option>
              <option value="shirakabe_area">🏮 白壁の町並み周辺</option>
              <option value="suburban_yanai">🏡 市内郊外（伊陸・日積・大畠等）</option>
              <option value="school_commute">🏫 柳井学園・柳井高（通学）</option>
              <option value="tourism_relation">⛵ 観光・関係人口・ファン</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              提案分類
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="all">全カテゴリ</option>
              <option value="youth_student">🏫 若者・高校生提案</option>
              <option value="value_creation">✨ 価値創造</option>
              <option value="improvement">🛠 改善点・課題</option>
              <option value="traffic_walk">🚲 交通・ウォーカブル</option>
              <option value="downtown_buzz">🏮 まちなか賑わい</option>
            </select>
          </div>
        </div>

        {/* Selected Filter Tags Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400">現在抽出中:</span>
          {selectedAge === 'teens' && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">
              🎓 高校生の意見のみ
            </span>
          )}
          {selectedAge === 'twenties_thirties' && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-300">
              👶 子育て・若手世代
            </span>
          )}
          {selectedQuadrant !== 'all' && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold border border-amber-300">
              🎯 ゾーン指定: {selectedQuadrant}
            </span>
          )}
          <span className="text-[11px] text-slate-500 font-medium ml-auto">
            該当アイデア: <strong className="text-slate-900">{filteredSubmissions.length}</strong> 件
          </span>
        </div>
      </div>

      {/* 2-Axis Interactive Matrix Stage & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scatter Matrix Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>2軸マトリックス散布図</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                円の大きさ = 市民共感票数 / 円をクリックして右パネルで精査
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 即効
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ml-1"></span> 戦略
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ml-1"></span> 随時
            </div>
          </div>

          {/* Matrix Chart Canvas (CSS Coordinate Grid) */}
          <div className="relative w-full aspect-[16/11] bg-slate-50 rounded-xl border border-slate-300 overflow-hidden select-none p-6">
            {/* Quadrant Background Colors */}
            {/* Top-Right: Quick Wins (Green tint) */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-500/10 border-l border-b border-dashed border-slate-300 pointer-events-none flex items-start justify-end p-2">
              <span className="text-[11px] font-bold text-emerald-800 bg-white/80 px-2 py-0.5 rounded shadow-2xs">
                ① 即時実行ゾーン (Quick Wins)
              </span>
            </div>

            {/* Top-Left: Strategic Focus (Amber tint) */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-amber-500/10 border-r border-b border-dashed border-slate-300 pointer-events-none flex items-start justify-start p-2">
              <span className="text-[11px] font-bold text-amber-800 bg-white/80 px-2 py-0.5 rounded shadow-2xs">
                ② 戦略的重点検討 (Strategic)
              </span>
            </div>

            {/* Bottom-Right: Low-Hanging Fruit (Blue tint) */}
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/10 border-l border-t border-dashed border-slate-300 pointer-events-none flex items-end justify-end p-2">
              <span className="text-[11px] font-bold text-blue-800 bg-white/80 px-2 py-0.5 rounded shadow-2xs">
                ③ 低コスト随時改善 (Low-Hanging)
              </span>
            </div>

            {/* Bottom-Left: Long-Term (Gray tint) */}
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-slate-500/10 border-r border-t border-dashed border-slate-300 pointer-events-none flex items-end justify-start p-2">
              <span className="text-[11px] font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded shadow-2xs">
                ④ 長期構想・見直し (Long-term)
              </span>
            </div>

            {/* Axis Labels */}
            {/* Y-Axis Label (Expectation) */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 origin-center text-xs font-bold text-indigo-900 tracking-wider flex items-center gap-1 pointer-events-none">
              <span>住民期待度 (熱量・共感度) ↑</span>
            </div>

            {/* X-Axis Label (Feasibility) */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-indigo-900 tracking-wider flex items-center gap-1 pointer-events-none">
              <span>実現可能性 (コスト・法規制・即時性) →</span>
            </div>

            {/* Center Axes Lines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-px bg-slate-400"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-full w-px bg-slate-400"></div>
            </div>

            {/* Render Data Points (Bubbles) */}
            {filteredSubmissions.map(sub => {
              // Map score 0-100 to percentage 10% - 90% to stay inside bounds
              const leftPct = 10 + (sub.feasibilityScore / 100) * 80;
              const bottomPct = 10 + (sub.expectationScore / 100) * 80;
              const isSelected = selectedDetailItem?.id === sub.id;
              const isHovered = hoveredItem?.id === sub.id;

              // Size based on upvotes
              const sizePx = Math.min(48, Math.max(28, 24 + sub.upvotes / 8));

              return (
                <div
                  key={sub.id}
                  style={{
                    left: `${leftPct}%`,
                    bottom: `${bottomPct}%`,
                    width: `${sizePx}px`,
                    height: `${sizePx}px`
                  }}
                  onMouseEnter={() => setHoveredItem(sub)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setSelectedDetailItem(sub)}
                  className={`absolute transform -translate-x-1/2 translate-y-1/2 rounded-full flex items-center justify-center border-2 cursor-pointer transition-all duration-150 z-20 ${getBubbleColor(sub)} ${
                    isSelected ? 'ring-4 ring-indigo-500 scale-125 z-30' : ''
                  } ${isHovered ? 'scale-115 z-30' : ''}`}
                >
                  <span className="text-[10px] font-bold tracking-tighter truncate px-1">
                    {sub.upvotes}
                  </span>

                  {/* Hover Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 bg-slate-900/95 text-white text-[11px] p-2.5 rounded-lg shadow-xl pointer-events-none z-50 border border-slate-700">
                      <div className="font-bold text-amber-300 line-clamp-1">{sub.title}</div>
                      <div className="text-slate-300 text-[10px] mt-1 flex justify-between">
                        <span>期待度: {sub.expectationScore}点</span>
                        <span>実現性: {sub.feasibilityScore}点</span>
                      </div>
                      <div className="text-[10px] text-emerald-300 mt-0.5">
                        {sub.authorName} ({sub.organization || '市民'})
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Idea Detailed Inspector */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>選択アイデア詳細精査</span>
              </span>
              {selectedDetailItem && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  ID: {selectedDetailItem.id}
                </span>
              )}
            </div>

            {selectedDetailItem ? (
              <div className="space-y-3.5">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {selectedDetailItem.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>投稿者: <strong className="text-slate-800">{selectedDetailItem.authorName}</strong></span>
                    <span>({selectedDetailItem.organization || '市民有志'})</span>
                  </div>
                </div>

                {/* Score Breakdown Bars */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-indigo-900">住民期待度スコア</span>
                      <span className="text-indigo-700 font-bold">{selectedDetailItem.expectationScore} / 100</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                        style={{ width: `${selectedDetailItem.expectationScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-emerald-900">実現可能性スコア</span>
                      <span className="text-emerald-700 font-bold">{selectedDetailItem.feasibilityScore} / 100</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                        style={{ width: `${selectedDetailItem.feasibilityScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">提案詳細</label>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {selectedDetailItem.description}
                  </p>
                </div>

                {/* Committee Comments */}
                {selectedDetailItem.committeeComments && (
                  <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200 text-xs">
                    <div className="font-bold text-amber-900 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      策定委員会レビュー・推進メモ:
                    </div>
                    <p className="text-amber-950 leading-relaxed text-[11px]">
                      {selectedDetailItem.committeeComments}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                マトリックス上の円をクリックすると、ここに詳細が表示されます。
              </div>
            )}
          </div>

          {selectedDetailItem && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => onSelectSubmission(selectedDetailItem)}
                className="w-full py-2 text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-950 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>意見詳細・対話スレッドを開く</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
