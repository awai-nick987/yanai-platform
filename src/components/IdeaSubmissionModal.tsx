import React, { useState, useEffect } from 'react';
import { IdeaSubmission, CategoryType, AgeGroup, ResidencyArea } from '../types';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Tag, 
  CheckCircle2, 
  Send, 
  Lightbulb, 
  HelpCircle, 
  Sliders, 
  School,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface IdeaSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitIdea: (newIdea: Partial<IdeaSubmission>) => void;
  defaultLocationName?: string;
  defaultLat?: number;
  defaultLng?: number;
}

export const IdeaSubmissionModal: React.FC<IdeaSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmitIdea,
  defaultLocationName = '白壁の町並み・やない西蔵周辺',
  defaultLat = 33.9678,
  defaultLng = 132.1075
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('youth_student');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [organization, setOrganization] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('teens');
  const [residency, setResidency] = useState<ResidencyArea>('school_commute');
  const [locationName, setLocationName] = useState(defaultLocationName);
  const [tagsInput, setTagsInput] = useState('高校生提案, まちなか賑わい, 白壁景観');
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    expectationScore: number;
    feasibilityScore: number;
    suggestedPhase: string;
    aiFeedback: string;
    extractedTags: string[];
  } | null>(null);

  const PLACEHOLDERS = [
    "【高校生目線】どんな場所で、誰と、何を実現したい？\n例：柳井学園の生徒や地元商店街と連携して、放課後や週末に金魚ちょうちんの下で地元スイーツを楽しめる空間を作りたいです。",
    "【子育て世代目線】どんな場所で、誰と、何を実現したい？\n例：白壁通り沿いの空きスペースを活用して、ベビーカーでも入りやすい屋根付きの休憩所を作ってほしいです。",
    "【現役世代目線】どんな場所で、誰と、何を実現したい？\n例：駅前のロータリー付近に、仕事帰りでもふらっと立ち寄れるオープンカフェ風のスペースがあると、もっと人が滞留すると思います。",
    "【シニア世代目線】どんな場所で、誰と、何を実現したい？\n例：旧商家通りの歴史を感じながら、お年寄りが座って休めるベンチと、若者と交流できるような案内板を設置してほしいです。"
  ];

  useEffect(() => {
    if (isOpen) {
      setLocationName(defaultLocationName);
      setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
    }
  }, [isOpen, defaultLocationName]);

  if (!isOpen) return null;

  const handleRunAiEvaluation = async () => {
    if (!title.trim() || !description.trim()) return;
    setIsAiEvaluating(true);

    try {
      const res = await fetch('/api/ai/analyze-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          ageGroup,
          residency
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnalysisResult(data);
        if (data.extractedTags && data.extractedTags.length > 0) {
          setTagsInput(data.extractedTags.join(', '));
        }
      }
    } catch (err) {
      console.error('AI check failed:', err);
    } finally {
      setIsAiEvaluating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const tags = tagsInput
      .split(/[,、\s]+/)
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newIdea: Partial<IdeaSubmission> = {
      title,
      category,
      description,
      authorName: (isAnonymous ? '市民有志（匿名）' : authorName.trim()) || '市民有志',
      organization: organization.trim() || undefined,
      ageGroup,
      residency,
      locationName,
      lat: defaultLat,
      lng: defaultLng,
      tags: tags.length > 0 ? tags : ['まちなか共創', '柳井夢プラン'],
      expectationScore: aiAnalysisResult ? aiAnalysisResult.expectationScore : 85,
      feasibilityScore: aiAnalysisResult ? aiAnalysisResult.feasibilityScore : 78,
      upvotes: 1,
      downvotes: 0,
      status: 'approved',
      createdAt: new Date().toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }) + ' ' + new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      adminAssignedPhase: (aiAnalysisResult?.suggestedPhase as any) || 'quick_win',
      committeeComments: aiAnalysisResult?.aiFeedback
    };

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    onSubmitIdea(newIdea);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 flex items-center justify-between z-10">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full mb-1">
              <Lightbulb className="w-3 h-3" />
              市民参加・合意形成フロント
            </div>
            <h3 className="text-lg font-bold">
              あなたの「まちなか夢アイデア」を投稿する
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              提案の視点・分類 <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategory('youth_student')}
                className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                  category === 'youth_student'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                🏫 若者・高校生提案
              </button>
              <button
                type="button"
                onClick={() => setCategory('value_creation')}
                className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                  category === 'value_creation'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/30'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                ✨ 価値創造アイデア
              </button>
              <button
                type="button"
                onClick={() => setCategory('improvement')}
                className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                  category === 'improvement'
                    ? 'bg-amber-50 border-amber-600 text-amber-900 ring-2 ring-amber-500/30'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                🛠 改善点・身近な課題
              </button>
              <button
                type="button"
                onClick={() => setCategory('traffic_walk')}
                className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                  category === 'traffic_walk'
                    ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-500/30'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                🚲 交通・ウォーカブル
              </button>
              <button
                type="button"
                onClick={() => setCategory('downtown_buzz')}
                className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                  category === 'downtown_buzz'
                    ? 'bg-rose-50 border-rose-600 text-rose-900 ring-2 ring-rose-500/30'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                🏮 まちなか賑わい
              </button>
              <button
                type="button"
                onClick={() => setCategory('shirakabe_view')}
                className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                  category === 'shirakabe_view'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/30'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                🏯 白壁景観・文化保全
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              アイデアのタイトル <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 白壁通りに高校生が放課後集えるカフェテラスを作りたい！"
              className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              提案の具体的内容・背景・期待する効果 <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="どんな場所で、誰と一緒に、何を実現したいかを教えてください（例: 柳井学園の生徒や地元商店街と連携して、放課後や週末に金魚ちょうちんの下で地元スイーツを楽しめる空間を作りたいです...）"
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* AI Pre-evaluation Button */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/80 border border-indigo-100">
            <div className="text-xs text-indigo-950">
              <span className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                AIによる即時スコアリング＆講評
              </span>
              <span className="text-[11px] text-indigo-700">投稿前に期待度・実現可能性の目安を判定します</span>
            </div>
            <button
              type="button"
              onClick={handleRunAiEvaluation}
              disabled={isAiEvaluating || !title.trim() || !description.trim()}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-900 hover:bg-indigo-950 text-white shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isAiEvaluating ? '分析中...' : 'AIで事前診断'}
            </button>
          </div>

          {/* AI Feedback Preview Card if available */}
          {aiAnalysisResult && (
            <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  AI診断結果
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  推奨: {aiAnalysisResult.suggestedPhase === 'quick_win' ? '① 即時実行' : '② 戦略的重点'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                <div className="bg-white p-2 rounded border border-emerald-200">
                  住民期待度目安: <strong className="text-indigo-700 font-bold">{aiAnalysisResult.expectationScore}点</strong>
                </div>
                <div className="bg-white p-2 rounded border border-emerald-200">
                  実現可能性目安: <strong className="text-emerald-700 font-bold">{aiAnalysisResult.feasibilityScore}点</strong>
                </div>
              </div>
              <p className="text-[11px] text-emerald-950 leading-relaxed">
                {aiAnalysisResult.aiFeedback}
              </p>
            </div>
          )}

          {/* Location and Demographic Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                対象の場所・エリア <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="具体的な場所（例: 白壁通り、駅前広場など）"
                  className="w-full sm:flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <div className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap border border-slate-200">
                  📍 座標: {defaultLat.toFixed(5)}, {defaultLng.toFixed(5)}
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">※ マップから指定した場合、その位置情報が自動で記録されます。場所の名称はわかりやすいように自由に変更可能です。</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                年代・属性（集計用） <span className="text-rose-500">*</span>
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="teens">🎓 10代（高校生・柳井学園・柳井高等）</option>
                <option value="twenties_thirties">👶 20〜30代（若手・子育て世代）</option>
                <option value="forties_fifties">💼 40〜50代（現役世代・事業者）</option>
                <option value="sixties_plus">🍵 60代以上（シニア・地域役員）</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                居住地域・関わり <span className="text-rose-500">*</span>
              </label>
              <select
                value={residency}
                onChange={(e) => setResidency(e.target.value as ResidencyArea)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="school_commute">🏫 柳井学園・柳井高校在校生（通学）</option>
                <option value="downtown_station">🚉 柳井駅前・中心市街地在住</option>
                <option value="shirakabe_area">🏮 白壁の町並み周辺在住</option>
                <option value="suburban_yanai">🏡 市内郊外（伊陸・日積・大畠等）</option>
                <option value="tourism_relation">⛵ 観光客・関係人口・ファン</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                お名前 / ニックネーム（公開用）
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="例: 柳井高校 探究グループ"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              関連タグ（カンマ区切り）
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="高校生提案, ナイトマルシェ, 白壁景観"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 hover:from-blue-800 hover:to-indigo-950 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-amber-300" />
              <span>アイデアを送信してマップに登録</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
