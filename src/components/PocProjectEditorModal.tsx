import React, { useState } from 'react';
import { PocProject, PocQuantitativeKpi, PocQualitativeKpi } from '../types';
import { 
  X, 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  Image, 
  HelpCircle, 
  Target, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Calendar,
  MapPin,
  Building,
  BarChart3
} from 'lucide-react';

interface PocProjectEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProject: (project: PocProject) => void;
  initialProject?: PocProject | null;
}

const DEFAULT_IMAGE_PRESETS = [
  { label: '白壁の町並み・夜景', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80' },
  { label: '駅前・モビリティ', url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1000&auto=format&fit=crop&q=80' },
  { label: '古民家・DIY空間', url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=1000&auto=format&fit=crop&q=80' },
  { label: '水辺・マルシェ', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80' }
];

export const PocProjectEditorModal: React.FC<PocProjectEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveProject,
  initialProject
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  // Form State
  const [title, setTitle] = useState(initialProject?.title || '');
  const [subtitle, setSubtitle] = useState(initialProject?.subtitle || '');
  const [category, setCategory] = useState(initialProject?.category || 'ナイトタイム・賑わい創出');
  const [status, setStatus] = useState<PocProject['status']>(initialProject?.status || 'in_progress');
  const [workingGroupName, setWorkingGroupName] = useState(initialProject?.workingGroupName || '白壁まちなか賑わい創出部会 (WG-1)');
  const [eyecatchImage, setEyecatchImage] = useState(initialProject?.eyecatchImage || DEFAULT_IMAGE_PRESETS[0].url);
  const [tagsString, setTagsString] = useState(initialProject?.tags.join(', ') || '実証実験, 柳井市, まちなか夢プラン');

  // 01. Why
  const [vision, setVision] = useState(initialProject?.why.vision || '');
  const [backgroundChallenges, setBackgroundChallenges] = useState(initialProject?.why.backgroundChallenges || '');

  // 02. What
  const [planDescription, setPlanDescription] = useState(initialProject?.what.planDescription || '');
  const [period, setPeriod] = useState(initialProject?.what.period || '2026年10月1日 〜 2026年10月31日');
  const [location, setLocation] = useState(initialProject?.what.location || '柳井市白壁の町並み やない西蔵周辺');

  // 03. How
  const [hypothesis, setHypothesis] = useState(initialProject?.how.hypothesis || '');
  const [testMethods, setTestMethods] = useState<string[]>(
    initialProject?.how.testMethods || [
      'パッカーセンサーと定点カメラによる時間帯別・属性別歩行者数の計測',
      '参加者二次元コードアンケートによる滞在時間と満足度調査'
    ]
  );

  // 04. KPI (Structured Metrics)
  const [quantMetrics, setQuantMetrics] = useState<PocQuantitativeKpi[]>(
    initialProject?.kpi.quantitativeMetrics || [
      {
        id: 'q-1',
        name: '実証期間中の延べ来訪者数',
        targetValue: 1500,
        currentValue: 1280,
        unit: '名',
        note: '金・土・日の中間集計。若年層比率は43.8%を記録'
      },
      {
        id: 'q-2',
        name: '来訪者の平均滞在時間',
        targetValue: 60,
        currentValue: 64,
        unit: '分',
        note: '通常夜間（18分）の約3.5倍に延伸'
      }
    ]
  );

  const [qualMetrics, setQualMetrics] = useState<PocQualitativeKpi[]>(
    initialProject?.kpi.qualitativeMetrics || [
      {
        id: 'ql-1',
        name: '高校生と地元商店街店主の協働関係の構築',
        targetState: '企画から販売までを共同運営し、次回以降も自走できる協力関係の確立',
        currentStatus: 'achieved',
        progressPercent: 95,
        observation: '商品開発ミーティングを重ね、店主側からの提案も多数発生。'
      },
      {
        id: 'ql-2',
        name: '地域住民の夜間歩行に対する安心感・受容性の醸成',
        targetState: '夜間の騒音や景観破壊の懸念が払拭され、好意的な支持が多数を占める状態',
        currentStatus: 'in_progress',
        progressPercent: 80,
        observation: '近隣自治会からの激励と、夜間パトロール協力の申し出あり。'
      }
    ]
  );

  // 05. Who
  const [leaderName, setLeaderName] = useState(initialProject?.who.leader.name || '藤井 達也');
  const [leaderTitle, setLeaderTitle] = useState(initialProject?.who.leader.title || 'WGリーダー');
  const [leaderOrg, setLeaderOrg] = useState(initialProject?.who.leader.organization || '柳井商業協同組合 青年部');
  const [leaderComment, setLeaderComment] = useState(initialProject?.who.leader.comment || '高校生と地域がワンチームとなり、柳井の新しい日常を作ります！');
  const [leaderAvatar, setLeaderAvatar] = useState(initialProject?.who.leader.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  const [stakeholders, setStakeholders] = useState<{ name: string; role: string; organization: string }[]>(
    initialProject?.who.stakeholders || [
      { name: '柳井高校・柳井学園 有志生徒', role: '企画・運営', organization: '高校生チーム' },
      { name: '柳井市役所 地域づくり推進課', role: '行政支援・道路占用', organization: '行政チーム' }
    ]
  );
  const [partnersString, setPartnersString] = useState(initialProject?.who.partnerOrganizations.join(', ') || '柳井商工会議所, 柳井観光コンベンション協会');

  // 06. Next Step
  const [nextPhase, setNextPhase] = useState(initialProject?.nextStep.nextPhase || '令和9年度中心市街地活性化基本計画への正式事業採択');
  const [roadmapSteps, setRoadmapSteps] = useState<string[]>(
    initialProject?.nextStep.roadmap || [
      '2026年11月: 実証実験データ分析と住民報告会',
      '2026年12月: 活性化協議会での予算化・制度化審議'
    ]
  );

  // Recruitment
  const [isRecruiting, setIsRecruiting] = useState(initialProject?.recruitment.isRecruiting ?? true);
  const [targetRolesString, setTargetRolesString] = useState(initialProject?.recruitment.targetRoles.join(', ') || 'カフェ運営サポーター, アンケート調査員, SNS広報');
  const [capacity, setCapacity] = useState(initialProject?.recruitment.capacity || 15);

  if (!isOpen) return null;

  // Handlers
  const handleAddTestMethod = () => setTestMethods([...testMethods, '']);
  const handleUpdateTestMethod = (idx: number, val: string) => {
    const updated = [...testMethods];
    updated[idx] = val;
    setTestMethods(updated);
  };
  const handleRemoveTestMethod = (idx: number) => {
    setTestMethods(testMethods.filter((_, i) => i !== idx));
  };

  // Quant KPI
  const handleAddQuantMetric = () => {
    setQuantMetrics([
      ...quantMetrics,
      {
        id: `q-${Date.now().toString().slice(-4)}`,
        name: '新規定量指標',
        targetValue: 100,
        currentValue: 0,
        unit: '件',
        note: ''
      }
    ]);
  };
  const handleUpdateQuantMetric = (idx: number, field: keyof PocQuantitativeKpi, val: any) => {
    const updated = [...quantMetrics];
    updated[idx] = { ...updated[idx], [field]: val };
    setQuantMetrics(updated);
  };
  const handleRemoveQuantMetric = (idx: number) => {
    setQuantMetrics(quantMetrics.filter((_, i) => i !== idx));
  };

  // Qual KPI
  const handleAddQualMetric = () => {
    setQualMetrics([
      ...qualMetrics,
      {
        id: `ql-${Date.now().toString().slice(-4)}`,
        name: '新規定性指標',
        targetState: '目指す状態',
        currentStatus: 'in_progress',
        progressPercent: 50,
        observation: ''
      }
    ]);
  };
  const handleUpdateQualMetric = (idx: number, field: keyof PocQualitativeKpi, val: any) => {
    const updated = [...qualMetrics];
    updated[idx] = { ...updated[idx], [field]: val };
    setQualMetrics(updated);
  };
  const handleRemoveQualMetric = (idx: number) => {
    setQualMetrics(qualMetrics.filter((_, i) => i !== idx));
  };

  const handleAddStakeholder = () => setStakeholders([...stakeholders, { name: '', role: '', organization: '' }]);
  const handleUpdateStakeholder = (idx: number, field: 'name' | 'role' | 'organization', val: string) => {
    const updated = [...stakeholders];
    updated[idx][field] = val;
    setStakeholders(updated);
  };
  const handleRemoveStakeholder = (idx: number) => {
    setStakeholders(stakeholders.filter((_, i) => i !== idx));
  };

  const handleAddRoadmap = () => setRoadmapSteps([...roadmapSteps, '']);
  const handleUpdateRoadmap = (idx: number, val: string) => {
    const updated = [...roadmapSteps];
    updated[idx] = val;
    setRoadmapSteps(updated);
  };
  const handleRemoveRoadmap = (idx: number) => {
    setRoadmapSteps(roadmapSteps.filter((_, i) => i !== idx));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const fullProject: PocProject = {
      id: initialProject?.id || `poc-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      subtitle: subtitle.trim() || '柳井市まちなか夢プラン 実証実験ワーキンググループ推進事業',
      eyecatchImage: eyecatchImage.trim(),
      category: category.trim(),
      status: status,
      workingGroupName: workingGroupName.trim(),
      why: {
        vision: vision.trim() || 'まちなかの活性化と市民・若者の居場所づくり',
        backgroundChallenges: backgroundChallenges.trim() || '中心市街地における滞在時間と若年層利用の不足'
      },
      what: {
        planDescription: planDescription.trim() || '実証テスト計画',
        period: period.trim(),
        location: location.trim()
      },
      how: {
        hypothesis: hypothesis.trim() || '新しい取り組みにより市民の行動変容と回遊が促進される',
        testMethods: testMethods.filter(m => m.trim().length > 0)
      },
      kpi: {
        quantitative: quantMetrics.map(q => `${q.name}: 目標 ${q.targetValue} ${q.unit}`),
        qualitative: qualMetrics.map(ql => `${ql.name} (${ql.targetState})`),
        quantitativeMetrics: quantMetrics,
        qualitativeMetrics: qualMetrics
      },
      who: {
        leader: {
          name: leaderName.trim() || 'ワーキンググループリーダー',
          title: leaderTitle.trim(),
          organization: leaderOrg.trim(),
          avatarUrl: leaderAvatar.trim(),
          comment: leaderComment.trim()
        },
        stakeholders: stakeholders.filter(s => s.name.trim().length > 0),
        partnerOrganizations: partnersString.split(',').map(p => p.trim()).filter(p => p.length > 0)
      },
      nextStep: {
        nextPhase: nextPhase.trim() || '次期活性化基本計画への事業化',
        roadmap: roadmapSteps.filter(r => r.trim().length > 0)
      },
      recruitment: {
        isRecruiting: isRecruiting,
        targetRoles: targetRolesString.split(',').map(r => r.trim()).filter(r => r.length > 0),
        capacity: Number(capacity) || 10,
        currentApplicants: initialProject?.recruitment.currentApplicants || 0
      },
      likesCount: initialProject?.likesCount || 1,
      updatedAt: new Date().toISOString().slice(0, 10),
      tags: tagsString.split(',').map(t => t.trim()).filter(t => t.length > 0),
      report: initialProject?.report
    };

    onSaveProject(fullProject);
    onClose();
  };

  const steps = [
    { title: '基本情報・画像', desc: 'タイトル・部会名・アイキャッチ' },
    { title: '01. Why (背景)', desc: 'ビジョンと解決課題' },
    { title: '02. What (概要)', desc: '企画内容・期間・場所' },
    { title: '03. How (仮説)', desc: 'コア仮説と検証手法' },
    { title: '04. KPI (指標・進捗)', desc: '定量・定性目標と達成度' },
    { title: '05. Who (体制)', desc: 'リーダー・ステークホルダー' },
    { title: '06. Next & 募集', desc: 'ロードマップ・メンバー募集' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase">
                WG リーダー入力フォーム
              </span>
              <span className="text-xs text-indigo-300">実証実験（PoC）標準フォーマット</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              {initialProject ? `実証実験を編集: ${initialProject.title}` : '新規 実証実験プロジェクトの登録'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-2 min-w-max">
            {steps.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeStep === idx
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  activeStep === idx ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-700'
                }`}>
                  {idx + 1}
                </span>
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50 space-y-6">
          
          {/* STEP 0: Basic Info */}
          {activeStep === 0 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-6 h-6 rounded-md bg-slate-800 text-white font-black text-xs flex items-center justify-center">
                  00
                </span>
                <h4 className="text-sm font-bold text-slate-900">基本情報とアイキャッチ</h4>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  実証実験 プロジェクト名 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例：白壁ナイトテラス＆歴史的景観ライトアップ実証実験"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  サブタイトル・キャッチコピー
                </label>
                <input
                  type="text"
                  placeholder="例：18時で静まり返る白壁の町並みに、高校生企画のカフェと温かな灯りで夜の回遊を創出"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">部会名 (ワーキンググループ) *</label>
                  <input
                    type="text"
                    required
                    value={workingGroupName}
                    onChange={(e) => setWorkingGroupName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">カテゴリ *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="ナイトタイム・賑わい創出">ナイトタイム・賑わい創出</option>
                    <option value="スマートモビリティ・交通">スマートモビリティ・交通</option>
                    <option value="古民家リノベ・若者共創空間">古民家リノベ・若者共創空間</option>
                    <option value="水辺・柳井川オープンカフェ">水辺・柳井川オープンカフェ</option>
                    <option value="特産品・スイーツ開発">特産品・スイーツ開発</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">進行状況ステータス *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                  >
                    <option value="planning">企画・計画策定中</option>
                    <option value="recruiting">メンバー募集中</option>
                    <option value="in_progress">実証実験 進行中</option>
                    <option value="analyzing">データ検証・分析中</option>
                    <option value="completed">実証完了・施策化へ</option>
                  </select>
                </div>
              </div>

              {/* Eyecatch image selection */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-800">
                  アイキャッチ画像URL
                </label>
                <input
                  type="url"
                  value={eyecatchImage}
                  onChange={(e) => setEyecatchImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
                
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-500 font-bold">推奨プリセット:</span>
                  {DEFAULT_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEyecatchImage(preset.url)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] hover:bg-slate-100 text-slate-700 font-medium"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  タグ（カンマ区切り）
                </label>
                <input
                  type="text"
                  value={tagsString}
                  onChange={(e) => setTagsString(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>
          )}

          {/* STEP 1: 01. Why */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-6 h-6 rounded-md bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                  01
                </span>
                <h4 className="text-sm font-bold text-slate-900">ビジョンと背景（Why）</h4>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  目指す未来の姿（ビジョン） *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="例：歴史ある白壁の町並みが、昼だけでなく夜も市民や若者が自然と集い、語り合える温かな居場所になっている未来。"
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white font-medium leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  現在抱えている地域課題・背景 *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="例：18時以降は観光施設や商店が閉まり、通りが暗く人通りが途絶える。高校生や若者が夜間に安心して過ごせるサードプレイスがまちなかに存在しない。"
                  value={backgroundChallenges}
                  onChange={(e) => setBackgroundChallenges(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white font-medium leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* STEP 2: 02. What */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  02
                </span>
                <h4 className="text-sm font-bold text-slate-900">実証実験の概要（What）</h4>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  企画内容（何をテスト・検証するのか） *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="例：白壁通りの一部を歩行者空間化し、やない西蔵前の広場にLED行灯と屋外テラス席を設置。地元高校生がバリスタを務めるナイトカフェを期間限定でオープン。"
                  value={planDescription}
                  onChange={(e) => setPlanDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white font-medium leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">実施期間 *</label>
                  <input
                    type="text"
                    required
                    placeholder="2026年10月1日 〜 2026年10月31日"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">実施場所 *</label>
                  <input
                    type="text"
                    required
                    placeholder="柳井市白壁の町並み やない西蔵周辺"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: 03. How */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-6 h-6 rounded-md bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                  03
                </span>
                <h4 className="text-sm font-bold text-slate-900">検証内容と仮説（How）</h4>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  コア仮説（「〇〇という手法を用いれば、△△という変化が起きる」） *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="例：歴史的景観に溶け込む夜間演出と高校生企画のカフェを提供すれば、10〜30代の平均滞在時間が20分から60分へ3倍に伸長し、周辺飲食店への回遊率が25%向上する。"
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  className="w-full p-3 rounded-xl border border-amber-300 text-xs bg-white font-medium leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">具体的な検証手法・測定アプローチ</label>
                  <button
                    type="button"
                    onClick={handleAddTestMethod}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>手法を追加</span>
                  </button>
                </div>

                {testMethods.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 w-4">{idx + 1}.</span>
                    <input
                      type="text"
                      value={m}
                      onChange={(e) => handleUpdateTestMethod(idx, e.target.value)}
                      placeholder="例：AIカメラによる歩行者数の定点計測"
                      className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                    {testMethods.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTestMethod(idx)}
                        className="p-2 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: 04. KPI */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  04
                </span>
                <h4 className="text-sm font-bold text-slate-900">評価指標（KPI）とリアルタイム進捗管理</h4>
              </div>

              {/* Quantitative Metrics */}
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    <span>定量KPI（目標数値と現在実績値の進捗バー管理）</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddQuantMetric}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>定量指標を追加</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {quantMetrics.map((kpi, idx) => (
                    <div key={kpi.id || idx} className="p-3 bg-white rounded-xl border border-emerald-200 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800">定量指標 #{idx + 1}</span>
                        {quantMetrics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuantMetric(idx)}
                            className="text-rose-500 hover:text-rose-700 text-xs"
                          >
                            削除
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500">指標名</label>
                          <input
                            type="text"
                            value={kpi.name}
                            onChange={(e) => handleUpdateQuantMetric(idx, 'name', e.target.value)}
                            placeholder="例：実証期間中の延べ来訪者数"
                            className="w-full p-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500">目標値 / 単位</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={kpi.targetValue}
                              onChange={(e) => handleUpdateQuantMetric(idx, 'targetValue', Number(e.target.value))}
                              className="w-full p-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={kpi.unit}
                              onChange={(e) => handleUpdateQuantMetric(idx, 'unit', e.target.value)}
                              placeholder="名"
                              className="w-12 p-1.5 rounded-lg border border-slate-300 text-xs text-center font-bold"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500">現在実績値</label>
                          <input
                            type="number"
                            value={kpi.currentValue}
                            onChange={(e) => handleUpdateQuantMetric(idx, 'currentValue', Number(e.target.value))}
                            className="w-full p-1.5 rounded-lg border border-emerald-300 text-xs font-bold text-emerald-800 bg-emerald-50/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">補足メモ・中間所見</label>
                        <input
                          type="text"
                          value={kpi.note || ''}
                          onChange={(e) => handleUpdateQuantMetric(idx, 'note', e.target.value)}
                          placeholder="例：金・土・日の中間集計。若年層比率は43.8%を記録"
                          className="w-full p-1.5 rounded-lg border border-slate-200 text-xs text-slate-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualitative Metrics */}
              <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                    <span>定性KPI（行動変容・コミュニティ醸成の進捗管理）</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddQualMetric}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>定性指標を追加</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {qualMetrics.map((kpi, idx) => (
                    <div key={kpi.id || idx} className="p-3 bg-white rounded-xl border border-purple-200 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800">定性指標 #{idx + 1}</span>
                        {qualMetrics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQualMetric(idx)}
                            className="text-rose-500 hover:text-rose-700 text-xs"
                          >
                            削除
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500">指標名</label>
                          <input
                            type="text"
                            value={kpi.name}
                            onChange={(e) => handleUpdateQualMetric(idx, 'name', e.target.value)}
                            placeholder="例：高校生と地元商店街店主の協働関係の構築"
                            className="w-full p-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500">進捗度 (%)</label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={kpi.progressPercent}
                            onChange={(e) => handleUpdateQualMetric(idx, 'progressPercent', Number(e.target.value))}
                            className="w-full p-1.5 rounded-lg border border-purple-300 text-xs font-bold text-purple-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">目指す状態</label>
                        <input
                          type="text"
                          value={kpi.targetState}
                          onChange={(e) => handleUpdateQualMetric(idx, 'targetState', e.target.value)}
                          placeholder="例：企画から販売までを共同運営し、次回以降も自走できる協力関係の確立"
                          className="w-full p-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">現場観測・気づき</label>
                        <input
                          type="text"
                          value={kpi.observation || ''}
                          onChange={(e) => handleUpdateQualMetric(idx, 'observation', e.target.value)}
                          placeholder="例：商品開発ミーティングを重ね、店主側からの提案も多数発生。"
                          className="w-full p-1.5 rounded-lg border border-slate-200 text-xs text-slate-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: 05. Who */}
          {activeStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-6 h-6 rounded-md bg-teal-600 text-white font-black text-xs flex items-center justify-center">
                  05
                </span>
                <h4 className="text-sm font-bold text-slate-900">推進体制・メンバー（Who）</h4>
              </div>

              <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 space-y-3">
                <span className="text-xs font-bold text-teal-950 block">プロジェクトリーダー情報</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">氏名 *</label>
                    <input
                      type="text"
                      required
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">役職・役割</label>
                    <input
                      type="text"
                      value={leaderTitle}
                      onChange={(e) => setLeaderTitle(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">所属組織</label>
                    <input
                      type="text"
                      value={leaderOrg}
                      onChange={(e) => setLeaderOrg(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">リーダーからの意気込みコメント</label>
                  <input
                    type="text"
                    value={leaderComment}
                    onChange={(e) => setLeaderComment(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Stakeholders */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">参画ステークホルダー</label>
                  <button
                    type="button"
                    onClick={handleAddStakeholder}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>メンバー追加</span>
                  </button>
                </div>

                {stakeholders.map((s, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2 p-2 bg-slate-100 rounded-xl">
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) => handleUpdateStakeholder(idx, 'name', e.target.value)}
                      placeholder="氏名/団体名"
                      className="p-2 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                    <input
                      type="text"
                      value={s.role}
                      onChange={(e) => handleUpdateStakeholder(idx, 'role', e.target.value)}
                      placeholder="役割"
                      className="p-2 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={s.organization}
                        onChange={(e) => handleUpdateStakeholder(idx, 'organization', e.target.value)}
                        placeholder="所属"
                        className="flex-1 p-2 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                      {stakeholders.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStakeholder(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  連携・後援団体（カンマ区切り）
                </label>
                <input
                  type="text"
                  value={partnersString}
                  onChange={(e) => setPartnersString(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>
          )}

          {/* STEP 6: 06. Next & Recruitment */}
          {activeStep === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-6 h-6 rounded-md bg-rose-600 text-white font-black text-xs flex items-center justify-center">
                  06
                </span>
                <h4 className="text-sm font-bold text-slate-900">今後の展開とメンバー募集設定</h4>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  次に見据えているフェーズ展望（Next Step） *
                </label>
                <textarea
                  rows={2}
                  value={nextPhase}
                  onChange={(e) => setNextPhase(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">本格実装へのタイムライン・工程表</label>
                  <button
                    type="button"
                    onClick={handleAddRoadmap}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ステップ追加</span>
                  </button>
                </div>

                {roadmapSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">STEP {idx + 1}:</span>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => handleUpdateRoadmap(idx, e.target.value)}
                      className="flex-1 p-2 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                    {roadmapSteps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRoadmap(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Recruitment settings */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">ワーキンググループ メンバー募集の受付</span>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRecruiting}
                      onChange={(e) => setIsRecruiting(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span>現在募集中にする</span>
                  </label>
                </div>

                {isRecruiting && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-amber-200">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">募集する役割（カンマ区切り）</label>
                      <input
                        type="text"
                        value={targetRolesString}
                        onChange={(e) => setTargetRolesString(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">募集定員（名）</label>
                      <input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                activeStep === 0 ? 'opacity-40 cursor-not-allowed border-slate-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer'
              }`}
            >
              前へ
            </button>

            <div className="flex items-center gap-2">
              {activeStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-900 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <span>次へ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-[1.02]"
                >
                  <Save className="w-4 h-4" />
                  <span>実証実験プロジェクトを保存して公開</span>
                </button>
              )}
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
