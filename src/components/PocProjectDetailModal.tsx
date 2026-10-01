import React, { useState } from 'react';
import { PocProject, PocReport } from '../types';
import { PocKpiProgressSection } from './PocKpiProgressBar';
import { 
  X, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Target, 
  HelpCircle, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Heart, 
  Share2, 
  Bookmark, 
  Building, 
  Layers, 
  ChevronRight,
  UserPlus,
  Send,
  Flag,
  FileText,
  Printer,
  Copy,
  Award,
  AlertTriangle,
  Clock,
  PlusCircle,
  CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PocProjectDetailModalProps {
  project: PocProject | null;
  isOpen: boolean;
  onClose: () => void;
  onLikeProject?: (id: string) => void;
  onApplyRecruitment?: (projectId: string, role: string) => void;
  onEditProject?: (project: PocProject) => void;
  onOpenReportWizard?: (project: PocProject) => void;
  isLeader?: boolean;
}

export const PocProjectDetailModal: React.FC<PocProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onLikeProject,
  onApplyRecruitment,
  onEditProject,
  onOpenReportWizard,
  isLeader
}) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [showApplyBox, setShowApplyBox] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [copiedReportMd, setCopiedReportMd] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'report'>('details');

  if (!isOpen || !project) return null;

  const handleLike = () => {
    if (!hasLiked && onLikeProject) {
      onLikeProject(project.id);
      setHasLiked(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) return;
    if (onApplyRecruitment) {
      onApplyRecruitment(project.id, selectedRole || project.recruitment.targetRoles[0] || 'サポーター');
    }
    setAppliedSuccess(true);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCopyReport = () => {
    if (!project.report) return;
    const r = project.report;
    const md = `
# 【実証実験 成果報告書】${r.projectTitle}
- 提出日: ${r.submittedAt}
- 報告者: ${r.authorName} (${r.authorOrg} ${r.authorRole})
- 総合自己評価: ${r.summary.overallRating}
- 総来訪・参加人数: ${r.summary.participantCount} 名

## 総括サマリー
${r.summary.oneLineSummary}
- 実施期間: ${r.summary.actualPeriod}
- 実施場所: ${r.summary.actualLocation}
- 事業費内訳: ${r.summary.budgetUsed}

## 仮説検証結果（判定: ${r.hypothesisResult.isVerified}）
- 検証仮説: ${r.hypothesisResult.originalHypothesis}
- データ分析: ${r.hypothesisResult.analysisDetails}
- 主要インサイト:
${r.hypothesisResult.keyFindings.map(k => `  * ${k}`).join('\n')}

## KPI達成実績
${r.kpiResults.map(k => `- ${k.metricName}: 目標 ${k.target} -> 実績 ${k.actual} (達成率: ${k.achievementRate}%) / ${k.evaluationComment}`).join('\n')}

## 市民・参加者の反響（満足度: ${r.feedback.satisfactionScore}%)
### 肯定的な声:
${r.feedback.positiveQuotes.map(q => `- ${q}`).join('\n')}
### 改善要望:
${r.feedback.improvementPoints.map(q => `- ${q}`).join('\n')}

## 本格実装への提言
- 支援要望: ${r.nextRecommendations.requiredSupport}
- 次期アクションプラン: ${r.nextRecommendations.nextActionPlan}
`;
    navigator.clipboard.writeText(md);
    setCopiedReportMd(true);
    setTimeout(() => setCopiedReportMd(false), 3000);
  };

  const getStatusBadge = (status: PocProject['status']) => {
    switch (status) {
      case 'in_progress':
        return { label: '実証実験 進行中', bg: 'bg-emerald-600 text-white', dot: 'bg-emerald-300' };
      case 'recruiting':
        return { label: 'メンバー募集中', bg: 'bg-amber-600 text-white', dot: 'bg-amber-200' };
      case 'planning':
        return { label: '企画・計画策定中', bg: 'bg-blue-600 text-white', dot: 'bg-blue-200' };
      case 'analyzing':
        return { label: 'データ検証・分析中', bg: 'bg-purple-600 text-white', dot: 'bg-purple-200' };
      case 'completed':
        return { label: '実証完了・施策化へ', bg: 'bg-slate-700 text-white', dot: 'bg-slate-300' };
      default:
        return { label: '実証実験', bg: 'bg-slate-800 text-white', dot: 'bg-slate-400' };
    }
  };

  const statusBadge = getStatusBadge(project.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Sticky Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 shrink-0">
              {project.workingGroupName}
            </span>
            <span className="text-xs text-slate-300 truncate hidden sm:inline">
              実証実験（PoC）推進プロジェクト詳細
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Report Wizard Button for Leaders */}
            {isLeader && onOpenReportWizard && (
              <button
                onClick={() => onOpenReportWizard(project)}
                className="px-3 py-1 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{project.report ? '報告書を編集' : '成果報告書を作成'}</span>
              </button>
            )}

            {isLeader && onEditProject && (
              <button
                onClick={() => onEditProject(project)}
                className="px-3 py-1 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors cursor-pointer"
              >
                プロジェクト編集
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher if Report Exists */}
        {project.report && (
          <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'details'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              実証計画・ストーリー（Why/What/How）
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'report'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>成果完了報告書（提出済み）</span>
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-8 bg-slate-50">
          
          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <>
              {/* Eyecatch Image & Hero Header */}
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-900 group">
                <div className="h-64 sm:h-80 w-full relative">
                  <img
                    src={project.eyecatchImage}
                    alt={project.title}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 ${statusBadge.bg}`}>
                    <span className={`w-2 h-2 rounded-full ${statusBadge.dot} animate-pulse`} />
                    {statusBadge.label}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-900 backdrop-blur-md shadow-xs">
                    {project.category}
                  </span>
                  {project.report && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-md flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>完了報告書 公開中</span>
                    </span>
                  )}
                </div>

                {/* Floating Top Actions */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={handleLike}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
                      hasLiked
                        ? 'bg-rose-500 text-white'
                        : 'bg-black/60 text-white hover:bg-black/80'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                    <span>{project.likesCount + (hasLiked ? 1 : 0)} 応援</span>
                  </button>
                </div>

                {/* Hero Bottom Content */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 space-y-2 text-white">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-xs font-medium text-slate-100">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-white">
                    {project.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-3xl line-clamp-2 sm:line-clamp-none">
                    {project.subtitle}
                  </p>
                </div>
              </div>

              {/* Report Banner if available */}
              {project.report && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white border border-emerald-500/40 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-400 text-slate-950">
                        成果報告書 公開中
                      </span>
                      <span className="text-xs font-bold text-emerald-300">
                        総合自己評価: {project.report.summary.overallRating === 'great_success' ? '★★★★ 大成功' : '★★★ 概ね成功'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200">
                      "{project.report.summary.oneLineSummary}"
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('report')}
                    className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>報告書全文を見る</span>
                  </button>
                </div>
              )}

              {/* =========================================================================
                  01. ビジョンと背景（Why）
                  ========================================================================= */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-black text-sm">
                    01
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>ビジョンと背景</span>
                      <span className="text-xs text-indigo-600 font-mono font-bold tracking-wider">(Why)</span>
                    </h3>
                    <p className="text-xs text-slate-500">なぜこの実証実験を行うのか・目指す未来の姿と地域課題</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                      <Target className="w-4 h-4 text-indigo-600" />
                      <span>目指す未来の姿（ビジョン）</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {project.why.vision}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                      <span>現在抱えている地域課題</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {project.why.backgroundChallenges}
                    </p>
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  02. 実証実験の概要（What）
                  ========================================================================= */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">
                    02
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>実証実験の概要</span>
                      <span className="text-xs text-blue-600 font-mono font-bold tracking-wider">(What)</span>
                    </h3>
                    <p className="text-xs text-slate-500">何をテストするのか・実施期間・実施場所の確定情報</p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">企画内容（何をテストするか）</span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      {project.what.planDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-bold text-blue-950 block">実施期間</span>
                        <span className="text-xs font-medium text-slate-800">{project.what.period}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-bold text-emerald-950 block">実施場所</span>
                        <span className="text-xs font-medium text-slate-800">{project.what.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  03. 検証内容と仮説（How）
                  ========================================================================= */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
                    03
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>検証内容と仮説</span>
                      <span className="text-xs text-amber-700 font-mono font-bold tracking-wider">(How)</span>
                    </h3>
                    <p className="text-xs text-slate-500">「〇〇という手法を用いれば、△△という変化が起きる」仮説の明文化</p>
                  </div>
                </div>

                {/* Key Hypothesis Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-300/80 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-wide">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>実証実験で立証するコア仮説</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed pl-1 border-l-4 border-amber-500">
                    "{project.how.hypothesis}"
                  </p>
                </div>

                {/* Test Methods */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700">具体的な検証手法・測定アプローチ:</span>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    {project.how.testMethods.map((method, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-slate-800 leading-relaxed font-medium">{method}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* =========================================================================
                  04. 評価指標（KPI / 定量・定性）進捗バー可視化セクション
                  ========================================================================= */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                    04
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>評価指標（KPI）と達成度進捗バー</span>
                      <span className="text-xs text-emerald-700 font-mono font-bold tracking-wider">(定量・定性)</span>
                    </h3>
                    <p className="text-xs text-slate-500">各指標の目標値に対する現在達成度と現場の手応え</p>
                  </div>
                </div>

                {/* Visual Progress Bars Component */}
                <PocKpiProgressSection
                  quantitativeList={project.kpi.quantitative}
                  qualitativeList={project.kpi.qualitative}
                  quantitativeMetrics={project.kpi.quantitativeMetrics}
                  qualitativeMetrics={project.kpi.qualitativeMetrics}
                />
              </div>

              {/* =========================================================================
                  05. 体制・メンバー（Who）
                  ========================================================================= */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-black text-sm">
                    05
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>推進体制・メンバー</span>
                      <span className="text-xs text-teal-700 font-mono font-bold tracking-wider">(Who)</span>
                    </h3>
                    <p className="text-xs text-slate-500">プロジェクトリーダー・地元ステークホルダー・協力団体</p>
                  </div>
                </div>

                {/* Leader Highlight Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
                  <img
                    src={project.who.leader.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={project.who.leader.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                        プロジェクトリーダー
                      </span>
                      <span className="text-xs text-indigo-300 font-medium">
                        {project.who.leader.organization}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-lg font-extrabold text-white">
                        {project.who.leader.name}
                      </h4>
                      <span className="text-xs text-slate-300">{project.who.leader.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 italic">
                      "{project.who.leader.comment}"
                    </p>
                  </div>
                </div>

                {/* Stakeholders and Partners */}
                <div className="space-y-3 pt-1">
                  <span className="text-xs font-bold text-slate-700">主な参画ステークホルダー:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.who.stakeholders.map((s, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block">{s.name}</span>
                          <span className="text-slate-500 text-[11px]">{s.organization}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 text-[10px] font-bold border border-indigo-200">
                          {s.role}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">連携・後援団体:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.who.partnerOrganizations.map((p, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  06. 今後の展開（Next Step）
                  ========================================================================= */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-black text-sm">
                    06
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>今後の展開とロードマップ</span>
                      <span className="text-xs text-rose-700 font-mono font-bold tracking-wider">(Next Step)</span>
                    </h3>
                    <p className="text-xs text-slate-500">実験結果を受けた次フェーズ展望と、本格実装への工程表</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1.5">
                  <span className="text-xs font-bold text-rose-950 uppercase tracking-wider block">
                    次に見据えているフェーズ展望
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                    {project.nextStep.nextPhase}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700">本格実装へのタイムライン:</span>
                  <div className="space-y-2">
                    {project.nextStep.roadmap.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono text-[11px] font-bold shrink-0">
                          STEP {idx + 1}
                        </span>
                        <span className="text-slate-800 font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Member Recruitment Box */}
              {project.recruitment.isRecruiting && (
                <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 rounded-2xl p-6 border-2 border-amber-400 shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-extrabold mb-1">
                        <UserPlus className="w-3.5 h-3.5" />
                        ワーキンググループメンバー募集中
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        この実証実験を一緒に動かすメンバーを募集しています
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        募集枠: {project.recruitment.capacity}名中 {project.recruitment.currentApplicants}名応募済み（残り{Math.max(0, project.recruitment.capacity - project.recruitment.currentApplicants)}枠）
                      </p>
                    </div>

                    {!showApplyBox && !appliedSuccess && (
                      <button
                        onClick={() => setShowApplyBox(true)}
                        className="px-5 py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <UserPlus className="w-4 h-4 text-amber-300" />
                        <span>メンバーに応募する</span>
                      </button>
                    )}
                  </div>

                  {/* Roles Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-bold text-slate-700">募集中の役割:</span>
                    {project.recruitment.targetRoles.map((role, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
                        {role}
                      </span>
                    ))}
                  </div>

                  {/* Apply Form Dropdown */}
                  {showApplyBox && !appliedSuccess && (
                    <form onSubmit={handleApply} className="p-4 rounded-xl bg-white border border-slate-300 shadow-sm space-y-3 animate-in fade-in">
                      <h5 className="text-xs font-bold text-slate-900">参加エントリー入力</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold mb-0.5">希望の役割</label>
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-slate-50"
                          >
                            {project.recruitment.targetRoles.map((r, i) => (
                              <option key={i} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold mb-0.5">お名前 / ニックネーム *</label>
                          <input
                            type="text"
                            required
                            placeholder="例：柳井 太郎"
                            value={applicantName}
                            onChange={(e) => setApplicantName(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold mb-0.5">連絡先（メールアドレス等）</label>
                          <input
                            type="email"
                            placeholder="example@yanai-city.jp"
                            value={applicantEmail}
                            onChange={(e) => setApplicantEmail(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowApplyBox(false)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600 hover:bg-slate-100"
                        >
                          キャンセル
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-indigo-900 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-300" />
                          <span>エントリーを送信</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {appliedSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>実証実験メンバーへのエントリーを受付ました！リーダーより追ってご連絡いたします。</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* TAB 2: OFFICIAL REPORT VIEW */}
          {activeTab === 'report' && project.report && (
            <div className="space-y-6 animate-in fade-in">
              {/* Report Actions Header */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      実証実験 成果完了報告書（公式アーカイブ）
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      提出日: {project.report.submittedAt} • 報告者: {project.report.authorName} ({project.report.authorOrg})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReport}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{copiedReportMd ? 'コピー済' : 'Markdownコピー'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>印刷</span>
                  </button>

                  {isLeader && onOpenReportWizard && (
                    <button
                      onClick={() => onOpenReportWizard(project)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>報告書を再編集</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Official Report Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-300 shadow-md space-y-6">
                {/* Executive Summary */}
                <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      EXECUTIVE SUMMARY（総括・自己評価）
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {project.report.summary.overallRating === 'great_success' ? '★★★★ 大成功（目標大幅達成）' : '★★★ 概ね成功'}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-bold leading-relaxed text-slate-100">
                    "{project.report.summary.oneLineSummary}"
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs border-t border-slate-800 text-slate-300">
                    <div><span className="text-slate-400 block text-[10px]">実施期間</span>{project.report.summary.actualPeriod}</div>
                    <div><span className="text-slate-400 block text-[10px]">実施場所</span>{project.report.summary.actualLocation}</div>
                    <div><span className="text-slate-400 block text-[10px]">総参加規模</span><span className="font-black text-amber-300 text-sm">{project.report.summary.participantCount.toLocaleString()} 名</span></div>
                    <div><span className="text-slate-400 block text-[10px]">満足度スコア</span><span className="font-black text-emerald-300 text-sm">{project.report.feedback.satisfactionScore}%</span></div>
                  </div>
                </div>

                {/* 1. Hypothesis */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 border-l-4 border-amber-500 pl-2">
                    1. 仮説検証結果（判定: {project.report.hypothesisResult.isVerified === 'verified' ? '立証成功' : '一部立証'}）
                  </h3>
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-2">
                    <p className="font-bold text-amber-950">
                      【検証仮説】: "{project.report.hypothesisResult.originalHypothesis}"
                    </p>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      【データ分析】: {project.report.hypothesisResult.analysisDetails}
                    </p>
                  </div>
                  <div className="space-y-1 pt-1 text-xs">
                    <span className="font-bold text-slate-700">主な発見・インサイト:</span>
                    <ul className="space-y-1 text-slate-800 pl-2">
                      {project.report.hypothesisResult.keyFindings.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 2. KPI Table */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 border-l-4 border-emerald-500 pl-2">
                    2. KPI達成度と数値実績
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">評価項目</th>
                          <th className="p-2.5">目標値</th>
                          <th className="p-2.5">最終実績値</th>
                          <th className="p-2.5 text-center">達成率</th>
                          <th className="p-2.5">評価コメント</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {project.report.kpiResults.map((k, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-900">{k.metricName}</td>
                            <td className="p-2.5 text-slate-600">{k.target}</td>
                            <td className="p-2.5 font-bold text-indigo-900">{k.actual}</td>
                            <td className="p-2.5 text-center font-black text-emerald-700 font-mono">{k.achievementRate}%</td>
                            <td className="p-2.5 text-slate-600">{k.evaluationComment}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Feedback */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 border-l-4 border-purple-500 pl-2">
                    3. 市民・参加者の声（満足度: {project.report.feedback.satisfactionScore}%）
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                      <span className="font-bold text-emerald-950 block">肯定的な声:</span>
                      <ul className="space-y-1 text-slate-700">
                        {project.report.feedback.positiveQuotes.map((q, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span>💬</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                      <span className="font-bold text-amber-950 block">改善要望:</span>
                      <ul className="space-y-1 text-slate-700">
                        {project.report.feedback.improvementPoints.map((p, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span>⚠️</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 4. Recommendations */}
                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <h3 className="text-sm font-bold text-slate-900 border-l-4 border-teal-500 pl-2">
                    4. 本格実装・施策化への提言（実現可能性: {project.report.nextRecommendations.commercializationFeasibility === 'high' ? '高' : '中'}）
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-800">
                    <p>
                      <span className="font-bold text-slate-900">【行政・関係機関への要望】:</span> {project.report.nextRecommendations.requiredSupport}
                    </p>
                    <p>
                      <span className="font-bold text-slate-900">【次期アクションプラン】:</span> {project.report.nextRecommendations.nextActionPlan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="bg-white border-t border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span>最終更新: {project.updatedAt}</span>
            <span>•</span>
            <span>柳井市まちなか夢プラン実証部会</span>
          </div>

          <div className="flex items-center gap-2">
            {isLeader && onOpenReportWizard && (
              <button
                onClick={() => onOpenReportWizard(project)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>{project.report ? '成果報告書を再編集' : 'PoC終了後レポートを作成'}</span>
              </button>
            )}

            <button
              onClick={handleLike}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                hasLiked
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current text-rose-500' : 'text-slate-400'}`} />
              <span>{hasLiked ? '応援中' : 'この実証実験を応援'}</span>
            </button>
            
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              閉じる
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
