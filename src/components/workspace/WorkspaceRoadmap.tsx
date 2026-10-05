import React, { useState } from 'react';
import { 
  Pin, 
  Plus, 
  Edit3, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  X, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Target,
  FileText,
  Users
} from 'lucide-react';

interface PhaseItem {
  id: string;
  phaseNumber: number;
  title: string;
  fiscalYear: '2025' | '2026' | '2027';
  periodText: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  progress: number;
  badgeLabel: string;
  badgeColor: string;
  goal: string;
  kpi: string;
  leadDept: string;
  keyActivities: string[];
  deliverables: string[];
}

const INITIAL_PHASES: PhaseItem[] = [
  {
    id: 'phase-1',
    phaseNumber: 1,
    title: 'フェーズ1: 市民意見収集・基本構想策定',
    fiscalYear: '2025',
    periodText: '2025年4月 〜 2026年3月 (令和7年度)',
    status: 'completed',
    progress: 100,
    badgeLabel: '策定・収集完了',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    goal: '市民・高校生の想いを可視化し、まちなか未来ビジョンの土台を構築する。',
    kpi: '市民アイデア投稿数 300件以上達成（実績 340件）、高校生WS 4回開催',
    leadDept: '地域づくり推進課・都市計画課',
    keyActivities: [
      'オンラインアイデア投稿プラットフォームの稼働開始',
      '高校生探究学習連携まちづくりワークショップの実施',
      '中心市街地現況調査及び歩行量・空き店舗調査の実施'
    ],
    deliverables: [
      '柳井市中心市街地活性化 基本構想書',
      '市民・若者アイデア分類マップ原本'
    ]
  },
  {
    id: 'phase-2',
    phaseNumber: 2,
    title: 'フェーズ2: 策定委員会対話・実証実験（PoC推進）',
    fiscalYear: '2026',
    periodText: '2026年4月 〜 2027年3月 (令和8年度 当年度)',
    status: 'in_progress',
    progress: 65,
    badgeLabel: '現在推進中 (重点PoC)',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 ring-2 ring-blue-200',
    goal: '優先施策の社会実験（PoC）を通じて効果を実証し、基本計画を確定させる。',
    kpi: '重点実証実験 3件実施、活性化協議会 5回開催、市民共感数 1,000票達成',
    leadDept: '都市計画課・商工観光課・推進WG',
    keyActivities: [
      '白壁の町並み夜間ライトアップ・金魚ちょうちん夜市実証実験（10月）',
      '高校生探究連携 空き店舗コミュニティカフェのプレオープン（10月）',
      'JR柳井駅前〜白壁エリア シェアモビリティ回遊実証実験（11月）',
      '活性化協議会での基本計画骨子案の審議・議決'
    ],
    deliverables: [
      '社会実験効果検証レポート（人流データ・消費動向）',
      '柳井市中心市街地活性化基本計画（案）'
    ]
  },
  {
    id: 'phase-3',
    phaseNumber: 3,
    title: 'フェーズ3: 未来計画反映・国認定申請・事業化移行',
    fiscalYear: '2027',
    periodText: '2027年4月 〜 2028年3月 (令和9年度)',
    status: 'upcoming',
    progress: 0,
    badgeLabel: '準備中・予定',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    goal: '国の中心市街地活性化基本計画認定を受け、民間・行政共同の本格事業化へ移行する。',
    kpi: '内閣府・国認定の取得、まちなか民間投資額 1.5億円誘致、年間歩行者通行量 15%増',
    leadDept: '都市計画課・まちづくり推進機構（設立予定）',
    keyActivities: [
      '国（内閣府・経産省・国交省）への基本計画認定申請書の提出',
      'まちなかまちづくり会社（タウンマネジメント組織）の法人化推進',
      '空き店舗リノベーション補助制度の本格運用開始'
    ],
    deliverables: [
      '内閣総理大臣認定 柳井市中心市街地活性化基本計画',
      '官民連携タウンマネジメント事業推進計画書'
    ]
  }
];

export const WorkspaceRoadmap: React.FC = () => {
  // Selected fiscal year for the detailed 1-year close-up view (Default to current: 2026)
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<'2025' | '2026' | '2027'>('2026');
  
  // Phases list state
  const [phases, setPhases] = useState<PhaseItem[]>(() => {
    const saved = localStorage.getItem('yanai_workspace_roadmap_phases');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

    let parsed = null; try { parsed = saved ? JSON.parse(saved) : null; } catch(e) { parsed = null; }
    return parsed || INITIAL_PHASES;
  });

  React.useEffect(() => {
    localStorage.setItem('yanai_workspace_roadmap_phases', JSON.stringify(phases));
  }, [phases]);

  // Selected phase for detail modal
  const [selectedPhaseDetail, setSelectedPhaseDetail] = useState<PhaseItem | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Add / Edit Phase Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<PhaseItem | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalFy, setModalFy] = useState<'2025' | '2026' | '2027'>('2026');
  const [modalPeriod, setModalPeriod] = useState('');
  const [modalGoal, setModalGoal] = useState('');
  const [modalKpi, setModalKpi] = useState('');
  const [modalProgress, setModalProgress] = useState(50);
  const [modalLead, setModalLead] = useState('都市計画課');

  const handleOpenAdd = () => {
    setEditingPhase(null);
    setModalTitle('');
    setModalFy('2026');
    setModalPeriod('2026年10月 〜 2027年3月');
    setModalGoal('');
    setModalKpi('');
    setModalProgress(0);
    setModalLead('都市計画課');
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (phase: PhaseItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPhase(phase);
    setModalTitle(phase.title);
    setModalFy(phase.fiscalYear);
    setModalPeriod(phase.periodText);
    setModalGoal(phase.goal);
    setModalKpi(phase.kpi);
    setModalProgress(phase.progress);
    setModalLead(phase.leadDept);
    setIsEditModalOpen(true);
  };


  const handleDeletePhase = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!editingPhase) return;
    if (window.confirm(`${editingPhase.title} を削除してもよろしいですか？`)) {
      setPhases(phases.filter(p => p.id !== editingPhase.id));
      setIsEditModalOpen(false);
    }
  };

  const handleSavePhase = (e: React.FormEvent) => {

    e.preventDefault();
    if (!modalTitle.trim()) return;

    if (editingPhase) {
      // Update existing
      setPhases(phases.map(p => p.id === editingPhase.id ? {
        ...p,
        title: modalTitle,
        fiscalYear: modalFy,
        periodText: modalPeriod,
        goal: modalGoal,
        kpi: modalKpi,
        progress: modalProgress,
        leadDept: modalLead,
        status: modalProgress === 100 ? 'completed' : modalProgress > 0 ? 'in_progress' : 'upcoming'
      } : p));
    } else {
      // Add new phase
      const newPhase: PhaseItem = {
        id: `phase-${Date.now()}`,
        phaseNumber: phases.length + 1,
        title: modalTitle,
        fiscalYear: modalFy,
        periodText: modalPeriod,
        status: modalProgress === 100 ? 'completed' : modalProgress > 0 ? 'in_progress' : 'upcoming',
        progress: modalProgress,
        badgeLabel: modalProgress === 100 ? '完了' : modalProgress > 0 ? '進行中' : '予定',
        badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        goal: modalGoal,
        kpi: modalKpi,
        leadDept: modalLead,
        keyActivities: ['新規活動計画を策定中'],
        deliverables: ['成果物資料ドラフト']
      };
      setPhases([...phases, newPhase]);
    }

    setIsEditModalOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Pin className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              柳井市まちなか未来計画 推進ロードマップ
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ３カ年タイムライン（4月〜翌3月）および年度別ガントチャート詳細。フェーズをクリックするとポップアップで目標・KPI詳細を確認できます。
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>フェーズを追加</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP SECTION: 3-YEAR MASTER TIMELINE (4月〜翌年3月)                      */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 space-y-5 shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              3カ年 全体推進タイムライン (令和7年度〜令和9年度 / 4月〜翌年3月)
            </h3>
          </div>
          <div className="text-xs text-slate-400">
            年度をクリックすると下の1年間詳細ガントチャートが切り替わります
          </div>
        </div>

        {/* 3 Years Navigation Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Year 1: 2025年度 */}
          <button
            onClick={() => setSelectedFiscalYear('2025')}
            className={`p-4 rounded-2xl text-left transition-all border-2 cursor-pointer relative ${
              selectedFiscalYear === '2025'
                ? 'bg-slate-800 border-emerald-400 ring-2 ring-emerald-400/30'
                : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400">2025年度 (令和7年度)</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                完了 100%
              </span>
            </div>
            <div className="text-sm font-bold text-slate-100 mt-2">
              基本構想・市民意見収集
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              2025年4月 〜 2026年3月
            </div>
            {selectedFiscalYear === '2025' && (
              <div className="absolute bottom-1 right-3 text-[10px] text-emerald-400 font-bold">
                ● 選択中
              </div>
            )}
          </button>

          {/* Year 2: 2026年度 (当年度) */}
          <button
            onClick={() => setSelectedFiscalYear('2026')}
            className={`p-4 rounded-2xl text-left transition-all border-2 cursor-pointer relative ${
              selectedFiscalYear === '2026'
                ? 'bg-slate-800 border-blue-400 ring-2 ring-blue-400/40 shadow-md'
                : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-blue-400 flex items-center gap-1">
                <span>2026年度 (令和8年度)</span>
                <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[9px] rounded font-black">当年度</span>
              </span>
              <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800">
                進行中 65%
              </span>
            </div>
            <div className="text-sm font-bold text-slate-100 mt-2">
              策定委員会対話・実証実験(PoC)
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              2026年4月 〜 2027年3月
            </div>
            {selectedFiscalYear === '2026' && (
              <div className="absolute bottom-1 right-3 text-[10px] text-blue-400 font-bold">
                ● 選択中 (詳細表示中)
              </div>
            )}
          </button>

          {/* Year 3: 2027年度 */}
          <button
            onClick={() => setSelectedFiscalYear('2027')}
            className={`p-4 rounded-2xl text-left transition-all border-2 cursor-pointer relative ${
              selectedFiscalYear === '2027'
                ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400">2027年度 (令和9年度)</span>
              <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                準備中 0%
              </span>
            </div>
            <div className="text-sm font-bold text-slate-100 mt-2">
              国認定申請・本格事業化移行
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              2027年4月 〜 2028年3月
            </div>
            {selectedFiscalYear === '2027' && (
              <div className="absolute bottom-1 right-3 text-[10px] text-amber-400 font-bold">
                ● 選択中
              </div>
            )}
          </button>

        </div>

        {/* ------------------------------------------------------------------- */}
        {/* CLOSE-UP 1-YEAR GANTT CHART (UPPER SECTION AS REQUESTED)            */}
        {/* ------------------------------------------------------------------- */}
        <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{selectedFiscalYear}年度 4半期・月別 ガントチャート詳細</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              期間: {selectedFiscalYear}年4月 〜 {Number(selectedFiscalYear) + 1}年3月
            </span>
          </div>

          {/* Gantt Header (4 Quarters / 12 Months) */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
              <div className="text-blue-300">Q1 (4月〜6月)</div>
              <div className="text-[10px] text-slate-400 font-normal mt-0.5">キックオフ・計画骨子</div>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
              <div className="text-blue-300">Q2 (7月〜9月)</div>
              <div className="text-[10px] text-slate-400 font-normal mt-0.5">WS・PoC準備</div>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
              <div className="text-amber-300">Q3 (10月〜12月) ★</div>
              <div className="text-[10px] text-slate-400 font-normal mt-0.5">社会実験本番・効果検証</div>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
              <div className="text-emerald-300">Q4 (1月〜3月)</div>
              <div className="text-[10px] text-slate-400 font-normal mt-0.5">協議会確定・年度報告</div>
            </div>
          </div>

          {/* Gantt Task Bars based on Selected Year */}
          <div className="space-y-2.5 pt-2">
            {selectedFiscalYear === '2026' ? (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>1. 白壁夜市・ライトアップ実証実験推進</span>
                    <span className="text-blue-400 font-mono text-[11px]">8月〜11月 (Q2-Q3)</span>
                  </div>
                  <div className="h-3.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="w-[30%] bg-transparent"></div>
                    <div className="w-[45%] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>2. 高校生探究連携 空き店舗カフェ実証</span>
                    <span className="text-emerald-400 font-mono text-[11px]">9月〜12月 (Q2-Q3)</span>
                  </div>
                  <div className="h-3.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="w-[40%] bg-transparent"></div>
                    <div className="w-[35%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>3. 基本計画策定委員会 審議・議決</span>
                    <span className="text-amber-400 font-mono text-[11px]">4月〜翌3月 (通年)</span>
                  </div>
                  <div className="h-3.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 rounded-full"></div>
                  </div>
                </div>
              </>
            ) : selectedFiscalYear === '2025' ? (
              <div className="p-4 bg-slate-800/40 rounded-xl text-center text-xs text-slate-400">
                2025年度（令和7年度）の計画構想策定・意見収集フェーズは全工程完了済みです。
              </div>
            ) : (
              <div className="p-4 bg-slate-800/40 rounded-xl text-center text-xs text-slate-400">
                2027年度（令和9年度）は国認定申請およびまちづくり推進機構の事業化移行を予定しています。
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. BOTTOM SECTION: MILESTONES & PHASES LIST (CLICKABLE FOR POPUP MODAL)    */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              フェーズ・マイルストーン一覧（クリックで詳細ポップアップ）
            </h3>
          </div>
          <span className="text-xs text-slate-500">全 {phases.length} フェーズ</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {phases.map((phase) => (
            <div
              key={phase.id}
              onClick={() => setSelectedPhaseDetail(phase)}
              className="bg-slate-50/90 hover:bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 shadow-2xs hover:shadow-md transition-all space-y-3 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${phase.badgeColor}`}>
                    {phase.badgeLabel}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleOpenEdit(phase, e)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="フェーズ情報を編集"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {phase.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {phase.goal}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-200/80">
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700">
                    <span>進捗率</span>
                    <span>{phase.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-indigo-700 font-bold pt-1">
                  <span>詳細・KPIを見る</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POPUP MODAL: PHASE DETAIL VIEW                                            */}
      {/* ========================================================================= */}
      {selectedPhaseDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border mb-2 ${selectedPhaseDetail.badgeColor}`}>
                  {selectedPhaseDetail.badgeLabel}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {selectedPhaseDetail.title}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  期間: {selectedPhaseDetail.periodText} | 担当部署: {selectedPhaseDetail.leadDept}
                </div>
              </div>

              <button
                onClick={() => setSelectedPhaseDetail(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Goal & KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-1.5">
                <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>フェーズ達成目標</span>
                </div>
                <p className="text-xs text-blue-950 leading-relaxed">
                  {selectedPhaseDetail.goal}
                </p>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-1.5">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>重要業績評価指標 (KPI)</span>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  {selectedPhaseDetail.kpi}
                </p>
              </div>
            </div>

            {/* Key Activities */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>主な推進活動・スケジュール項目</span>
              </h4>
              <ul className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {selectedPhaseDetail.keyActivities.map((act, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">・</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deliverables */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>想定成果物・提出資料</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedPhaseDetail.deliverables.map((deliv, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-1.5"
                  >
                    <span>📄 {deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedPhaseDetail(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                閉じる
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT / ADD PHASE MODAL                                                    */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingPhase ? 'フェーズ情報の変更' : '新規フェーズの追加'}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePhase} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">フェーズ名・タイトル</label>
                <input
                  type="text"
                  required
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="例: フェーズ4: まちなかエリアマネジメント自走化"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">対象年度</label>
                  <select
                    value={modalFy}
                    onChange={(e: any) => setModalFy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="2025">2025年度 (令和7年度)</option>
                    <option value="2026">2026年度 (令和8年度)</option>
                    <option value="2027">2027年度 (令和9年度)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">期間表記</label>
                  <input
                    type="text"
                    value={modalPeriod}
                    onChange={(e) => setModalPeriod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">達成目標</label>
                <textarea
                  rows={2}
                  value={modalGoal}
                  onChange={(e) => setModalGoal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">主要KPI</label>
                <input
                  type="text"
                  value={modalKpi}
                  onChange={(e) => setModalKpi(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">進捗率 ({modalProgress}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={modalProgress}
                    onChange={(e) => setModalProgress(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">主導部署</label>
                  <input
                    type="text"
                    value={modalLead}
                    onChange={(e) => setModalLead(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 pt-3 border-t border-slate-100">
                {editingPhase ? (
                  <button
                    type="button"
                    onClick={handleDeletePhase}
                    className="px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold"
                  >
                    削除
                  </button>
                ) : (
                  <div />
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    保存する
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* AI Extraction Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  議事録・まとめから候補タスクを自動抽出
                </h3>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              会議の議事録や、ワークショップのまとめテキストを貼り付けてください。AIが次のアクションアイテム（タスク候補）を抽出し、ロードマップのプロセスカンバンに自動反映します。
            </p>

            <div className="space-y-3">
              <textarea
                rows={6}
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                placeholder="（例）今日のワークショップでは、高校生から「空き店舗でカフェをやりたい」という意見が多かった。次回までに保健所の許可条件を確認する。また、来月には商店街の店主たちと顔合わせの場を設ける必要がある。"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              />
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!aiInputText.trim()) return;
                    setIsAiProcessing(true);
                    setTimeout(() => {
                      setIsAiProcessing(false);
                      setIsAiModalOpen(false);
                      setAiInputText('');
                      // Mock add to phase
                      const newPhases = [...phases];
                      newPhases[0].items.push({
                        id: 'ai-gen-1',
                        title: '保健所の許可条件の事前確認',
                        status: 'not_started',
                        dueDate: '2026-10-10'
                      });
                      newPhases[0].items.push({
                        id: 'ai-gen-2',
                        title: '商店街店主との顔合わせ企画',
                        status: 'not_started',
                        dueDate: '2026-10-25'
                      });
                      setPhases(newPhases);
                      alert('AIが2件のアクションアイテムを抽出し、現在のフェーズに追加しました。');
                    }, 1500);
                  }}
                  disabled={isAiProcessing || !aiInputText.trim()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  {isAiProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>抽出中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI抽出を実行</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
