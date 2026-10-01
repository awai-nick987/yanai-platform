import React, { useState } from 'react';
import { PocProject, PocReport, PocReportKpiResult } from '../types';
import { 
  X, 
  FileText, 
  Sparkles, 
  Save, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  Users, 
  Lightbulb, 
  AlertTriangle, 
  HelpCircle, 
  Download, 
  Printer, 
  Copy, 
  Plus, 
  Trash2,
  Calendar,
  MapPin,
  Send,
  Eye,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PocReportWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PocProject | null;
  onSaveReport: (report: PocReport) => void;
  existingReport?: PocReport | null;
}

const WIZARD_STEPS = [
  { id: 'summary', title: '1. 総括・基本実績', desc: '総合評価と実施規模' },
  { id: 'hypothesis', title: '2. 仮説検証結果', desc: 'コア仮説の検証と新発見' },
  { id: 'kpi', title: '3. KPI達成度分析', desc: '定量・定性指標の最終実績' },
  { id: 'feedback', title: '4. 市民・参加者の声', desc: '満足度とアンケート反響' },
  { id: 'challenges', title: '5. 課題と教訓', desc: '運営・制度上の学び' },
  { id: 'recommendations', title: '6. 施策化への提言', desc: '本格導入と要望事項' },
  { id: 'preview', title: '7. 報告書確認・提出', desc: 'プレビューと公的出力' }
];

export const PocReportWizardModal: React.FC<PocReportWizardModalProps> = ({
  isOpen,
  onClose,
  project,
  onSaveReport,
  existingReport
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Initialize Form States from project or existing report
  const initialAuthorName = existingReport?.authorName || project?.who.leader.name || '藤井 達也';
  const initialAuthorRole = existingReport?.authorRole || project?.who.leader.title || 'WGリーダー';
  const initialAuthorOrg = existingReport?.authorOrg || project?.workingGroupName || '白壁まちなか賑わい創出部会';

  // Step 1: Summary
  const [overallRating, setOverallRating] = useState<PocReport['summary']['overallRating']>(
    existingReport?.summary.overallRating || 'great_success'
  );
  const [oneLineSummary, setOneLineSummary] = useState<string>(
    existingReport?.summary.oneLineSummary ||
      '高校生カフェと歴史的行灯ライトアップの融合により、夜間滞在時間が3.2倍に伸長し周辺店舗への回遊売上も26%向上を達成。'
  );
  const [actualPeriod, setActualPeriod] = useState<string>(
    existingReport?.summary.actualPeriod || project?.what.period || '2026年10月2日〜10月18日 計9日間'
  );
  const [actualLocation, setActualLocation] = useState<string>(
    existingReport?.summary.actualLocation || project?.what.location || '柳井市古市金屋 伝統的建造物群保存地区'
  );
  const [participantCount, setParticipantCount] = useState<number>(
    existingReport?.summary.participantCount || 1280
  );
  const [budgetUsed, setBudgetUsed] = useState<string>(
    existingReport?.summary.budgetUsed || '約480,000円（LED行灯リース・テラス什器・保険・アンケートシステム費）'
  );

  // Step 2: Hypothesis
  const [originalHypothesis, setOriginalHypothesis] = useState<string>(
    existingReport?.hypothesisResult.originalHypothesis || project?.how.hypothesis || ''
  );
  const [isVerified, setIsVerified] = useState<PocReport['hypothesisResult']['isVerified']>(
    existingReport?.hypothesisResult.isVerified || 'verified'
  );
  const [analysisDetails, setAnalysisDetails] = useState<string>(
    existingReport?.hypothesisResult.analysisDetails ||
      'AIカメラによる測位データ分析の結果、平均滞在時間は通常夜間の18分から64分（約3.5倍）に延伸。若年層比率は43.8%に達し、仮説どおり夜間滞在と回遊消費の喚起が強く実証された。'
  );
  const [keyFindings, setKeyFindings] = useState<string[]>(
    existingReport?.hypothesisResult.keyFindings || [
      '金魚ちょうちんの温白色ライトアップがSNSでの写真拡散を誘発し、市外（広島・岩国・周南）からの若者流入が急増した。',
      '高校生が地元老舗醤油蔵と共同開発した限定スイーツが毎晩完売し、多世代交流の触媒となった。',
      '20時以降の周辺居酒屋・洋食店への送客効果が確認され、商店街側の夜間営業延長意欲が向上した。'
    ]
  );
  const [unexpectedOutcomes, setUnexpectedOutcomes] = useState<string>(
    existingReport?.hypothesisResult.unexpectedOutcomes ||
      '金曜日の雨天時にテラス利用が落ち込んだものの、急遽やない西蔵の土間を屋内テラスとして開放したところ「雨の白壁が情緒的」と好評を博した。'
  );

  // Step 3: KPI Results
  const defaultKpiResults: PocReportKpiResult[] = existingReport?.kpiResults || (
    project?.kpi.quantitativeMetrics && project.kpi.quantitativeMetrics.length > 0
      ? project.kpi.quantitativeMetrics.map(q => ({
          metricName: q.name,
          target: `${q.targetValue.toLocaleString()} ${q.unit}`,
          actual: `${q.currentValue.toLocaleString()} ${q.unit}（達成率 ${Math.round((q.currentValue / (q.targetValue || 1)) * 100)}%）`,
          achievementRate: Math.round((q.currentValue / (q.targetValue || 1)) * 100),
          evaluationComment: q.note || '目標達成に向けて順調な数値推移を記録。'
        }))
      : [
          {
            metricName: '実証期間中の延べ来訪者数',
            target: '1,500名以上',
            actual: '1,280名（達成率 85.3%）',
            achievementRate: 85.3,
            evaluationComment: '台風接近に伴う1日中止があったものの、開催日は連日目標を上回る盛況となった。'
          },
          {
            metricName: '来訪者満足度（また夜に来たい割合）',
            target: '85.0%以上',
            actual: '92.4%（達成率 108.7%）',
            achievementRate: 108.7,
            evaluationComment: '景観ライトアップの雰囲気とスタッフの温かい接客が高く評価された。'
          }
        ]
  );
  const [kpiResults, setKpiResults] = useState<PocReportKpiResult[]>(defaultKpiResults);

  // Step 4: Feedback
  const [satisfactionScore, setSatisfactionScore] = useState<number>(
    existingReport?.feedback.satisfactionScore || 92
  );
  const [positiveQuotes, setPositiveQuotes] = useState<string[]>(
    existingReport?.feedback.positiveQuotes || [
      '高校生たちが生き生きとおもてなししてくれて、夜の柳井にこんな活気が戻るとは感動した。（50代・市内在住女性）',
      '金魚ちょうちんの灯りがエモくて写真映え最高。週末はいつもやってほしい！（高校2年生・市外通学）',
      '普段は18時に閉めるが、実証期間中は21時まで開けて売上が3割伸びた。常設化を望む。（商店街店主）'
    ]
  );
  const [improvementPoints, setImprovementPoints] = useState<string[]>(
    existingReport?.feedback.improvementPoints || [
      '週末ピーク時にベンチの数が足りず、座れない来場者がいたため増設が必要。',
      '夜間の近隣駐車場への誘導サインが暗くて分かりにくかった。'
    ]
  );

  // Step 5: Challenges & Lessons
  const [operationalIssues, setOperationalIssues] = useState<string>(
    existingReport?.challengesAndLessons.operationalIssues ||
      'ボランティア高校生のシフト管理と、夜間の安全な帰宅手段（親の送迎やバス接続）の確保が運営上の重要事項となった。'
  );
  const [institutionalBarriers, setInstitutionalBarriers] = useState<string>(
    existingReport?.challengesAndLessons.institutionalBarriers ||
      '道路占用許可（歩行者天国化）の申請手続きに約2ヶ月を要したため、年間の定期開催に向けた包括的特区申請が急務。'
  );
  const [lessonsLearned, setLessonsLearned] = useState<string[]>(
    existingReport?.challengesAndLessons.lessonsLearned || [
      '若者自身が企画から関わることで当事者意識が芽生え、自走的な広報力が発揮される。',
      '静寂な景観保全と適度な賑わいの音響バランス（BGM音量や営業時間）の事前合意が成功の鍵。'
    ]
  );

  // Step 6: Recommendations
  const [commercializationFeasibility, setCommercializationFeasibility] = useState<PocReport['nextRecommendations']['commercializationFeasibility']>(
    existingReport?.nextRecommendations.commercializationFeasibility || 'high'
  );
  const [requiredSupport, setRequiredSupport] = useState<string>(
    existingReport?.nextRecommendations.requiredSupport ||
      '道路占用特区（歩行者利便増進道路・ほこみち等）の指定推進と、まちなか運営会社（まちづくり柳井）への什器・照明設備補助。'
  );
  const [nextActionPlan, setNextActionPlan] = useState<string>(
    existingReport?.nextRecommendations.nextActionPlan ||
      '令和9年4月からの「週末ナイトマルシェ＆テラス」の定期開催化（毎月第2・第4土曜）に向け、商店街振興組合および市都市計画課との実務協議を開始する。'
  );

  if (!isOpen || !project) return null;

  // Handlers for dynamic list edits
  const handleAddFinding = () => setKeyFindings([...keyFindings, '']);
  const handleUpdateFinding = (idx: number, val: string) => {
    const arr = [...keyFindings];
    arr[idx] = val;
    setKeyFindings(arr);
  };
  const handleRemoveFinding = (idx: number) => setKeyFindings(keyFindings.filter((_, i) => i !== idx));

  const handleAddPositiveQuote = () => setPositiveQuotes([...positiveQuotes, '']);
  const handleUpdatePositiveQuote = (idx: number, val: string) => {
    const arr = [...positiveQuotes];
    arr[idx] = val;
    setPositiveQuotes(arr);
  };
  const handleRemovePositiveQuote = (idx: number) => setPositiveQuotes(positiveQuotes.filter((_, i) => i !== idx));

  const handleAddImprovementPoint = () => setImprovementPoints([...improvementPoints, '']);
  const handleUpdateImprovementPoint = (idx: number, val: string) => {
    const arr = [...improvementPoints];
    arr[idx] = val;
    setImprovementPoints(arr);
  };
  const handleRemoveImprovementPoint = (idx: number) => setImprovementPoints(improvementPoints.filter((_, i) => i !== idx));

  const handleAddLesson = () => setLessonsLearned([...lessonsLearned, '']);
  const handleUpdateLesson = (idx: number, val: string) => {
    const arr = [...lessonsLearned];
    arr[idx] = val;
    setLessonsLearned(arr);
  };
  const handleRemoveLesson = (idx: number) => setLessonsLearned(lessonsLearned.filter((_, i) => i !== idx));

  // KPI edits
  const handleAddKpiResult = () => {
    setKpiResults([
      ...kpiResults,
      {
        metricName: '新規評価項目',
        target: '目標値',
        actual: '実績値',
        achievementRate: 100,
        evaluationComment: '評価コメント'
      }
    ]);
  };
  const handleUpdateKpiResult = (idx: number, field: keyof PocReportKpiResult, val: any) => {
    const arr = [...kpiResults];
    arr[idx] = { ...arr[idx], [field]: val };
    setKpiResults(arr);
  };
  const handleRemoveKpiResult = (idx: number) => setKpiResults(kpiResults.filter((_, i) => i !== idx));

  // Build report object
  const buildReportObject = (): PocReport => ({
    id: existingReport?.id || `report-${project.id}-${Date.now().toString().slice(-4)}`,
    projectId: project.id,
    projectTitle: project.title,
    submittedAt: new Date().toISOString().split('T')[0],
    authorName: initialAuthorName,
    authorRole: initialAuthorRole,
    authorOrg: initialAuthorOrg,
    summary: {
      overallRating,
      oneLineSummary,
      actualPeriod,
      actualLocation,
      participantCount,
      budgetUsed
    },
    hypothesisResult: {
      originalHypothesis,
      isVerified,
      analysisDetails,
      keyFindings: keyFindings.filter(f => f.trim().length > 0),
      unexpectedOutcomes
    },
    kpiResults: kpiResults.filter(k => k.metricName.trim().length > 0),
    feedback: {
      satisfactionScore,
      positiveQuotes: positiveQuotes.filter(q => q.trim().length > 0),
      improvementPoints: improvementPoints.filter(p => p.trim().length > 0)
    },
    challengesAndLessons: {
      operationalIssues,
      institutionalBarriers,
      lessonsLearned: lessonsLearned.filter(l => l.trim().length > 0)
    },
    nextRecommendations: {
      commercializationFeasibility,
      requiredSupport,
      nextActionPlan
    },
    status: 'submitted'
  });

  const handleSubmit = () => {
    const report = buildReportObject();
    onSaveReport(report);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    onClose();
  };

  const handleCopyReportMarkdown = () => {
    const r = buildReportObject();
    const md = `
# 【実証実験 完了報告書】${r.projectTitle}
- 提出日: ${r.submittedAt}
- 報告者: ${r.authorName} (${r.authorOrg} ${r.authorRole})
- 総合評価: ${r.summary.overallRating}
- 参加・来訪規模: 延べ ${r.summary.participantCount.toLocaleString()} 名

## 1. 総括サマリー
${r.summary.oneLineSummary}
- 実施期間: ${r.summary.actualPeriod}
- 実施場所: ${r.summary.actualLocation}
- 投入予算: ${r.summary.budgetUsed}

## 2. 仮説検証結果（判定: ${r.hypothesisResult.isVerified}）
- 検証仮説: ${r.hypothesisResult.originalHypothesis}
- 検証分析: ${r.hypothesisResult.analysisDetails}
- 主な発見:
${r.hypothesisResult.keyFindings.map(k => `  * ${k}`).join('\n')}

## 3. KPI達成度
${r.kpiResults.map(k => `- ${k.metricName}: 目標 ${k.target} -> 実績 ${k.actual} (達成率: ${k.achievementRate}%) / ${k.evaluationComment}`).join('\n')}

## 4. 市民・参加者の声 (満足度: ${r.feedback.satisfactionScore}%)
### 肯定的な声:
${r.feedback.positiveQuotes.map(q => `- ${q}`).join('\n')}
### 改善点・要望:
${r.feedback.improvementPoints.map(q => `- ${q}`).join('\n')}

## 5. 課題と教訓
- 運営上の課題: ${r.challengesAndLessons.operationalIssues}
- 制度上の課題: ${r.challengesAndLessons.institutionalBarriers}
- 得られた教訓:
${r.challengesAndLessons.lessonsLearned.map(l => `  * ${l}`).join('\n')}

## 6. 本格実装・施策化への提言（実現可能性: ${r.nextRecommendations.commercializationFeasibility}）
- 行政・関係団体への支援要望: ${r.nextRecommendations.requiredSupport}
- 次期アクションプラン: ${r.nextRecommendations.nextActionPlan}
`;
    navigator.clipboard.writeText(md);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const getRatingBadge = (rating: PocReport['summary']['overallRating']) => {
    switch (rating) {
      case 'great_success':
        return { label: '★★★★ 大成功（目標大幅達成・高い波及効果）', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'success':
        return { label: '★★★ 概ね成功（目標到達・本格化推奨）', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'partial_success':
        return { label: '★★ 一部課題あり（追加検証・改善要）', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'needs_improvement':
        return { label: '★ 見直し必要（仮説不成立・再設計要）', bg: 'bg-rose-100 text-rose-900 border-rose-300' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Sticky Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  PoC終了後 成果報告書ウィザード
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Step {currentStep + 1} of {WIZARD_STEPS.length}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-xl">
                {project.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-2 min-w-max">
            {WIZARD_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentStep === idx
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : currentStep > idx
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === idx
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : currentStep > idx
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {currentStep > idx ? '✓' : idx + 1}
                </span>
                <span>{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Wizard Scrollable Form Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 bg-slate-50 space-y-6">
          
          {/* STEP 0: Executive Summary */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-700" />
                  <span>実証実験のエグゼクティブサマリー（総括・実施規模）</span>
                </h4>
                <p className="text-xs text-indigo-900/80">
                  策定委員会や市民・行政幹部がひと目で成果を把握できる総合自己評価と概要をまとめます。
                </p>
              </div>

              <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    総合自己評価（レーティング）*
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { value: 'great_success', label: '★★★★ 大成功（目標大幅達成・高い波及効果）', border: 'hover:border-emerald-400' },
                      { value: 'success', label: '★★★ 概ね成功（目標到達・本格導入推奨）', border: 'hover:border-blue-400' },
                      { value: 'partial_success', label: '★★ 一部課題あり（追加検証・改善要）', border: 'hover:border-amber-400' },
                      { value: 'needs_improvement', label: '★ 見直し必要（仮説不成立・再設計要）', border: 'hover:border-rose-400' }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setOverallRating(opt.value as any)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                          overallRating === opt.value
                            ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm'
                            : `bg-slate-50 text-slate-800 border-slate-200 ${opt.border}`
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    1行総括サマリー（ワンライン・エレベーターピッチ）*
                  </label>
                  <textarea
                    rows={2}
                    value={oneLineSummary}
                    onChange={(e) => setOneLineSummary(e.target.value)}
                    placeholder="例：高校生カフェと歴史的行灯ライトアップの融合により、夜間滞在時間が3.2倍に伸長し周辺店舗への回遊売上も26%向上を達成。"
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      実証期間（実績）
                    </label>
                    <input
                      type="text"
                      value={actualPeriod}
                      onChange={(e) => setActualPeriod(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      実施場所（実績）
                    </label>
                    <input
                      type="text"
                      value={actualLocation}
                      onChange={(e) => setActualLocation(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      総参加・来訪者数（名）*
                    </label>
                    <input
                      type="number"
                      value={participantCount}
                      onChange={(e) => setParticipantCount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-indigo-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    投入予算・概算事業費の内訳
                  </label>
                  <input
                    type="text"
                    value={budgetUsed}
                    onChange={(e) => setBudgetUsed(e.target.value)}
                    placeholder="例：約480,000円（LED行灯リース・什器・保険・アンケートシステム費）"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Hypothesis Verification */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-700" />
                  <span>仮説検証結果（Hypothesis Verification）</span>
                </h4>
                <p className="text-xs text-amber-900/80">
                  事前に設定した「コア仮説」が現場で立証されたか、どのような因果関係や発見があったかを記載します。
                </p>
              </div>

              <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    検証対象のコア仮説
                  </label>
                  <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-bold text-amber-950">
                    "{originalHypothesis}"
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    仮説検証の判定結果 *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'verified', label: '✅ 仮説が実証された', bg: 'bg-emerald-50 text-emerald-900 border-emerald-300' },
                      { value: 'partial', label: '⚠️ 一部実証された', bg: 'bg-amber-50 text-amber-900 border-amber-300' },
                      { value: 'unverified', label: '❌ 実証されなかった', bg: 'bg-rose-50 text-rose-900 border-rose-300' }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setIsVerified(opt.value as any)}
                        className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isVerified === opt.value
                            ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    検証データの詳細分析（因果関係・エビデンス）*
                  </label>
                  <textarea
                    rows={3}
                    value={analysisDetails}
                    onChange={(e) => setAnalysisDetails(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      実証実験で得られた主要な発見・インサイト（Key Findings）:
                    </label>
                    <button
                      type="button"
                      onClick={handleAddFinding}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>発見を追加</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {keyFindings.map((finding, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={finding}
                          onChange={(e) => handleUpdateFinding(idx, e.target.value)}
                          className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                        {keyFindings.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFinding(idx)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    予期せぬ副次成果・想定外の課題
                  </label>
                  <textarea
                    rows={2}
                    value={unexpectedOutcomes}
                    onChange={(e) => setUnexpectedOutcomes(e.target.value)}
                    placeholder="雨天時の対応や、他世代からの意外な反響など"
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: KPI Results */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>KPI達成度分析（Quantitative & Qualitative Analytics）</span>
                </h4>
                <p className="text-xs text-emerald-900/80">
                  設定した各指標の最終実績値、達成率、およびその要因分析をまとめます。
                </p>
              </div>

              <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">評価指標一覧（{kpiResults.length}項目）</span>
                  <button
                    type="button"
                    onClick={handleAddKpiResult}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>指標を追加</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {kpiResults.map((kpi, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">指標 #{idx + 1}</span>
                        {kpiResults.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveKpiResult(idx)}
                            className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>削除</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">指標名</label>
                          <input
                            type="text"
                            value={kpi.metricName}
                            onChange={(e) => handleUpdateKpiResult(idx, 'metricName', e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">目標値</label>
                          <input
                            type="text"
                            value={kpi.target}
                            onChange={(e) => handleUpdateKpiResult(idx, 'target', e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">最終実績値 (達成率%)</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={kpi.actual}
                              onChange={(e) => handleUpdateKpiResult(idx, 'actual', e.target.value)}
                              className="w-full p-2 rounded-lg border border-slate-300 text-xs font-bold"
                            />
                            <input
                              type="number"
                              placeholder="%"
                              value={kpi.achievementRate}
                              onChange={(e) => handleUpdateKpiResult(idx, 'achievementRate', Number(e.target.value))}
                              className="w-16 p-2 rounded-lg border border-slate-300 text-xs font-bold text-emerald-800"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">要因分析・評価コメント</label>
                        <input
                          type="text"
                          value={kpi.evaluationComment}
                          onChange={(e) => handleUpdateKpiResult(idx, 'evaluationComment', e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-300 text-xs text-slate-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Feedback & Survey */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1">
                <h4 className="text-sm font-bold text-purple-950 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-700" />
                  <span>市民・参加者の声・アンケート分析（Feedback & Voices）</span>
                </h4>
                <p className="text-xs text-purple-900/80">
                  来訪者、高校生、商店街店主、近隣住民から得られた生のアンケート反響を記録します。
                </p>
              </div>

              <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    総合満足度スコア (100%満点) *
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={satisfactionScore}
                      onChange={(e) => setSatisfactionScore(Number(e.target.value))}
                      className="flex-1 accent-purple-600"
                    />
                    <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-950 font-black text-lg font-mono border border-purple-300">
                      {satisfactionScore}%
                    </span>
                  </div>
                </div>

                {/* Positive Quotes */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>肯定的な声・喜びのエピソード（Positive Voices）:</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddPositiveQuote}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>声を追加</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {positiveQuotes.map((quote, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={quote}
                          onChange={(e) => handleUpdatePositiveQuote(idx, e.target.value)}
                          className="flex-1 p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/30 text-xs font-medium text-slate-800"
                        />
                        {positiveQuotes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePositiveQuote(idx)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Improvement Points */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>改善要望・課題の指摘（Improvement Needs）:</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddImprovementPoint}
                      className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>要望を追加</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {improvementPoints.map((imp, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={imp}
                          onChange={(e) => handleUpdateImprovementPoint(idx, e.target.value)}
                          className="flex-1 p-2.5 rounded-xl border border-amber-200 bg-amber-50/30 text-xs font-medium text-slate-800"
                        />
                        {improvementPoints.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImprovementPoint(idx)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Challenges & Lessons */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
                <h4 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  <span>課題と教訓（Challenges & Learned Lessons）</span>
                </h4>
                <p className="text-xs text-rose-900/80">
                  現場運営で直面した困難や、制度上の壁、今後に活かす教訓を率直にまとめます。
                </p>
              </div>

              <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    現場・運営上の課題（天候・人員・機材・シフト管理等）
                  </label>
                  <textarea
                    rows={2}
                    value={operationalIssues}
                    onChange={(e) => setOperationalIssues(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    制度・規制・合意形成上の壁（道路占用、景観基準、騒音配慮等）
                  </label>
                  <textarea
                    rows={2}
                    value={institutionalBarriers}
                    onChange={(e) => setInstitutionalBarriers(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      今後に活かす教訓・成功要因（Lessons Learned）:
                    </label>
                    <button
                      type="button"
                      onClick={handleAddLesson}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>教訓を追加</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {lessonsLearned.map((lesson, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={lesson}
                          onChange={(e) => handleUpdateLesson(idx, e.target.value)}
                          className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                        {lessonsLearned.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLesson(idx)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Recommendations */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-1">
                <h4 className="text-sm font-bold text-teal-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  <span>本格実装・施策化への提言（Recommendations & Action Plan）</span>
                </h4>
                <p className="text-xs text-teal-900/80">
                  基本計画への採択や、常設事業化に向けた行政・関係団体への支援要望と次期工程を記載します。
                </p>
              </div>

              <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    本格事業化・制度化の実現可能性判定 *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'high', label: '高（令和9年度早期事業化推奨）' },
                      { value: 'medium', label: '中（制度調整・一部追加検証後）' },
                      { value: 'low', label: '低（大幅なスキーム再構築要）' }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setCommercializationFeasibility(opt.value as any)}
                        className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          commercializationFeasibility === opt.value
                            ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    市役所・関係機関への支援・予算・制度要望 *
                  </label>
                  <textarea
                    rows={3}
                    value={requiredSupport}
                    onChange={(e) => setRequiredSupport(e.target.value)}
                    placeholder="道路占用特区の指定や、運営補助金、備品保管場所の提供など"
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    次のアクション計画・推進ロードマップ *
                  </label>
                  <textarea
                    rows={3}
                    value={nextActionPlan}
                    onChange={(e) => setNextActionPlan(e.target.value)}
                    placeholder="令和9年4月からの定期マルシェ化に向けた協議日程など"
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Preview & Export/Submit */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    報告書プレビュー（公的成果報告書フォーマット）
                  </h4>
                  <p className="text-xs text-slate-500">
                    内容を確認し、問題がなければ「成果報告書を提出・公開」を押下してください。
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyReportMarkdown}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{copiedNotification ? 'コピー完了！' : 'Markdownコピー'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>印刷</span>
                  </button>
                </div>
              </div>

              {/* Official Report Document Style Box */}
              <div className="bg-white p-6 sm:p-10 rounded-2xl border-2 border-slate-300 shadow-md space-y-8 print:p-0 print:border-none">
                {/* Header */}
                <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-widest text-slate-500 font-black uppercase">
                      YANAI CITY SMART URBAN POC REPORT
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                      実証実験 完了報告書・分析サマリー
                    </h2>
                    <p className="text-sm font-bold text-indigo-900">
                      {project.title}
                    </p>
                  </div>

                  <div className="text-right text-xs text-slate-600 font-medium space-y-0.5">
                    <div><span className="font-bold">報告日:</span> {new Date().toISOString().split('T')[0]}</div>
                    <div><span className="font-bold">提出部会:</span> {initialAuthorOrg}</div>
                    <div><span className="font-bold">報告責任者:</span> {initialAuthorName} ({initialAuthorRole})</div>
                  </div>
                </div>

                {/* Executive Summary Callout */}
                <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      EXECUTIVE SUMMARY（総括）
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${getRatingBadge(overallRating).bg}`}>
                      {getRatingBadge(overallRating).label}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-bold leading-relaxed text-slate-100">
                    "{oneLineSummary}"
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs border-t border-slate-800 text-slate-300">
                    <div><span className="text-slate-400 block text-[10px]">実施期間</span>{actualPeriod}</div>
                    <div><span className="text-slate-400 block text-[10px]">実施場所</span>{actualLocation}</div>
                    <div><span className="text-slate-400 block text-[10px]">総参加者数</span><span className="font-black text-amber-300 text-sm">{participantCount.toLocaleString()} 名</span></div>
                    <div><span className="text-slate-400 block text-[10px]">事業満足度</span><span className="font-black text-emerald-300 text-sm">{satisfactionScore}%</span></div>
                  </div>
                </div>

                {/* Section 1: Hypothesis Analysis */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-900 border-l-4 border-amber-500 pl-2.5 uppercase tracking-wide">
                    1. 仮説検証結果（判定: {isVerified === 'verified' ? '立証成功' : isVerified === 'partial' ? '一部立証' : '未達'}）
                  </h3>
                  <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 text-xs space-y-2">
                    <p className="font-bold text-amber-950">
                      【検証仮説】: "{originalHypothesis}"
                    </p>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      【データ分析】: {analysisDetails}
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-bold text-slate-700">得られた主要インサイト:</span>
                    <ul className="space-y-1 text-xs text-slate-800">
                      {keyFindings.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Section 2: KPI Table */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-900 border-l-4 border-emerald-500 pl-2.5 uppercase tracking-wide">
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
                        {kpiResults.map((k, i) => (
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

                {/* Section 3: Feedback */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-900 border-l-4 border-purple-500 pl-2.5 uppercase tracking-wide">
                    3. 市民・参加者の反響（満足度: {satisfactionScore}%）
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                      <span className="font-bold text-emerald-950 block">肯定的な声:</span>
                      <ul className="space-y-1.5 text-slate-700">
                        {positiveQuotes.map((q, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span>💬</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                      <span className="font-bold text-amber-950 block">改善要望・指摘:</span>
                      <ul className="space-y-1.5 text-slate-700">
                        {improvementPoints.map((p, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span>⚠️</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section 4: Recommendations */}
                <div className="space-y-3 border-t border-slate-200 pt-4">
                  <h3 className="text-sm font-black text-slate-900 border-l-4 border-teal-500 pl-2.5 uppercase tracking-wide">
                    4. 本格実装・施策化への提言（実現可能性: {commercializationFeasibility === 'high' ? '高' : commercializationFeasibility === 'medium' ? '中' : '低'}）
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-800">
                    <p>
                      <span className="font-bold text-slate-900">【行政・関係団体への支援要望】:</span> {requiredSupport}
                    </p>
                    <p>
                      <span className="font-bold text-slate-900">【次期アクションプラン】:</span> {nextActionPlan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Navigation */}
        <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>前へ</span>
          </button>

          <div className="flex items-center gap-3">
            {currentStep < WIZARD_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>次へ進む</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" />
                <span>実証実験 完了報告書を提出・公開する</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
