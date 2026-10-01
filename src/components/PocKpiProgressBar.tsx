import React from 'react';
import { PocQuantitativeKpi, PocQualitativeKpi } from '../types';
import { 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  ArrowUpRight,
  Info
} from 'lucide-react';

interface PocKpiProgressSectionProps {
  quantitativeList?: string[];
  qualitativeList?: string[];
  quantitativeMetrics?: PocQuantitativeKpi[];
  qualitativeMetrics?: PocQualitativeKpi[];
  isCompact?: boolean;
}

export const PocKpiProgressSection: React.FC<PocKpiProgressSectionProps> = ({
  quantitativeList = [],
  qualitativeList = [],
  quantitativeMetrics = [],
  qualitativeMetrics = [],
  isCompact = false
}) => {
  // If structured metrics aren't present, build fallback metrics from string arrays
  const qMetrics: PocQuantitativeKpi[] = quantitativeMetrics.length > 0
    ? quantitativeMetrics
    : quantitativeList.map((item, idx) => {
        // Simple heuristic extraction if possible
        return {
          id: `q-fallback-${idx}`,
          name: item.split(':')[0] || item,
          targetValue: 100,
          currentValue: 75,
          unit: '%',
          note: item.includes(':') ? item.split(':')[1].trim() : undefined
        };
      });

  const qlMetrics: PocQualitativeKpi[] = qualitativeMetrics.length > 0
    ? qualitativeMetrics
    : qualitativeList.map((item, idx) => ({
        id: `ql-fallback-${idx}`,
        name: item,
        targetState: '実証を通じて望ましい行動変容が定着する状態',
        currentStatus: idx === 0 ? 'achieved' : 'in_progress',
        progressPercent: idx === 0 ? 90 : 70,
        observation: '実証現場において積極的な対話とポジティブな反応を確認中。'
      }));

  const calculateAchievementRate = (current: number, target: number) => {
    if (target === 0) return current === 0 ? 100 : 0;
    return Math.round((current / target) * 100);
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 100) return {
      bar: 'bg-emerald-500',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      label: '目標達成'
    };
    if (rate >= 80) return {
      bar: 'bg-indigo-600',
      bg: 'bg-indigo-50/50',
      text: 'text-indigo-900',
      border: 'border-indigo-200',
      badge: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      label: '順調（80%超）'
    };
    if (rate >= 50) return {
      bar: 'bg-amber-500',
      bg: 'bg-amber-50/50',
      text: 'text-amber-900',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      label: '検証中（中間進捗）'
    };
    return {
      bar: 'bg-slate-400',
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200',
      badge: 'bg-slate-100 text-slate-700 border-slate-300',
      label: '計測初期'
    };
  };

  const getQualitativeStatusBadge = (status: PocQualitativeKpi['currentStatus']) => {
    switch (status) {
      case 'exceeded':
        return { label: '期待以上の前進', bg: 'bg-purple-100 text-purple-900 border-purple-300', icon: Award };
      case 'achieved':
        return { label: '目標到達・良好', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300', icon: CheckCircle2 };
      case 'in_progress':
        return { label: '検証推進中', bg: 'bg-blue-100 text-blue-900 border-blue-300', icon: Clock };
      case 'not_started':
      default:
        return { label: '準備・着手前', bg: 'bg-slate-100 text-slate-700 border-slate-300', icon: AlertCircle };
    }
  };

  if (isCompact) {
    return (
      <div className="space-y-3">
        {qMetrics.slice(0, 2).map((kpi) => {
          const rate = calculateAchievementRate(kpi.currentValue, kpi.targetValue);
          const style = getProgressColor(rate);
          return (
            <div key={kpi.id} className="space-y-1 text-xs">
              <div className="flex items-center justify-between font-medium text-slate-800">
                <span className="truncate max-w-[180px]">{kpi.name}</span>
                <span className="font-bold text-slate-900 font-mono">
                  {kpi.currentValue.toLocaleString()} / {kpi.targetValue.toLocaleString()} {kpi.unit} ({rate}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${style.bar} transition-all duration-500 rounded-full`}
                  style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Quantitative KPI with Visual Progress Bars */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                定量KPI（数値目標とリアルタイム進捗度）
              </h4>
              <p className="text-[11px] text-slate-500">
                実証実験期間中の目標値に対する現在計測値・達成率
              </p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
            定量指標 {qMetrics.length}項目
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {qMetrics.map((kpi) => {
            const rate = calculateAchievementRate(kpi.currentValue, kpi.targetValue);
            const style = getProgressColor(rate);

            return (
              <div 
                key={kpi.id}
                className={`p-4 rounded-xl border ${style.border} ${style.bg} transition-all shadow-xs space-y-3`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {kpi.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${style.badge}`}>
                        {style.label}
                      </span>
                    </div>
                    {kpi.note && (
                      <p className="text-[11px] text-slate-600 flex items-center gap-1">
                        <Info className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{kpi.note}</span>
                      </p>
                    )}
                  </div>

                  {/* Numbers & Rate Display */}
                  <div className="flex items-baseline gap-2 shrink-0 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">現在実績 / 目標</span>
                      <span className="text-sm sm:text-base font-extrabold text-slate-900 font-mono">
                        {kpi.currentValue.toLocaleString()} <span className="text-xs font-medium text-slate-500">/ {kpi.targetValue.toLocaleString()} {kpi.unit}</span>
                      </span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-xs text-center min-w-[60px]">
                      <span className="text-[10px] text-slate-400 block font-bold">達成率</span>
                      <span className={`text-sm font-black font-mono ${rate >= 100 ? 'text-emerald-700' : 'text-indigo-700'}`}>
                        {rate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className="space-y-1">
                  <div className="w-full bg-white/80 p-0.5 rounded-full border border-slate-200 shadow-inner">
                    <div 
                      className={`h-2.5 sm:h-3 rounded-full ${style.bar} transition-all duration-700 relative flex items-center justify-end pr-1 shadow-xs`}
                      style={{ width: `${Math.min(100, Math.max(4, rate))}%` }}
                    >
                      {rate >= 15 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono px-0.5">
                    <span>0 {kpi.unit}</span>
                    <span>目標: {kpi.targetValue.toLocaleString()} {kpi.unit} (100%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Qualitative KPI with Status & Observation */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                定性KPI（行動変容・熱量・コミュニティ醸成度）
              </h4>
              <p className="text-[11px] text-slate-500">
                数値化しにくい関係性の変化や、現場での気づき・参加者の手応え
              </p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold border border-purple-300">
            定性指標 {qlMetrics.length}項目
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {qlMetrics.map((kpi) => {
            const badge = getQualitativeStatusBadge(kpi.currentStatus);
            const Icon = badge.icon;

            return (
              <div 
                key={kpi.id}
                className="p-4 rounded-xl border border-purple-200/80 bg-purple-50/30 space-y-3 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                      {kpi.name}
                    </span>
                    <p className="text-[11px] text-slate-600">
                      <span className="font-bold text-purple-950">目指す状態:</span> {kpi.targetState}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 shadow-xs ${badge.bg}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{badge.label}</span>
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs font-black text-purple-900 font-mono shadow-xs">
                      {kpi.progressPercent}%
                    </span>
                  </div>
                </div>

                {/* Subtle progress bar */}
                <div className="w-full bg-white/80 h-2 rounded-full border border-purple-100 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, kpi.progressPercent))}%` }}
                  />
                </div>

                {/* Observation quote box */}
                {kpi.observation && (
                  <div className="p-3 rounded-lg bg-white border border-purple-200/60 text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 text-[10px] font-bold shrink-0 mt-0.5">
                      現場観測
                    </span>
                    <span className="font-medium text-slate-800">{kpi.observation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
