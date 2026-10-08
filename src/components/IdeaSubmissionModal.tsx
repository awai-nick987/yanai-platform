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
  hasCoords?: boolean;
}

export const IdeaSubmissionModal: React.FC<IdeaSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmitIdea,
  defaultLocationName = '',
  defaultLat,
  defaultLng,
  hasCoords = false
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
  const [locationName, setLocationName] = useState('');
  const [tagsInput, setTagsInput] = useState('高校生提案, まちなか賑わい, 白壁景観');

  const PLACEHOLDERS = [
    "【高校生目線】どんな場所で、誰と、何を実現したい？\n例：柳井学園の生徒や地元商店街と連携して、放課後や週末に金魚ちょうちんの下で地元スイーツを楽しめる空間を作りたいです。",
    "【子育て世代目線】どんな場所で、誰と、何を実現したい？\n例：白壁通り沿いの空きスペースを活用して、ベビーカーでも入りやすい屋根付きの休憩所を作ってほしいです。",
    "【現役世代目線】どんな場所で、誰と、何を実現したい？\n例：駅前のロータリー付近に、仕事帰りでもふらっと立ち寄れるオープンカフェ風のスペースがあると、もっと人が滞留すると思います。",
    "【シニア世代目線】どんな場所で、誰と、何を実現したい？\n例：旧商家通りの歴史を感じながら、お年寄りが座って休めるベンチと、若者と交流できるような案内板を設置してほしいです。"
  ];

  useEffect(() => {
    if (isOpen) {
      // ピン指定がある場合は渡された地点名（または空欄）をセット、ピンなしの場合は完全に空白
      setLocationName(hasCoords && defaultLocationName ? defaultLocationName : '');
      setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
    }
  }, [isOpen, defaultLocationName, hasCoords]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const tags = tagsInput
      .split(/[,、\s]+/)
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    // 投稿時の地点名と座標の決定（ピン指定があればピン座標を絶対優先）
    const finalLat = (hasCoords && defaultLat) ? defaultLat : 33.9678;
    const finalLng = (hasCoords && defaultLng) ? defaultLng : 132.1075;
    const finalLocationName = (hasCoords && defaultLocationName)
      ? defaultLocationName
      : (locationName.trim() || '柳井市中心市街地');

    const newIdea: Partial<IdeaSubmission> = {
      title,
      category,
      description,
      authorName: (isAnonymous ? '市民有志（匿名）' : authorName.trim()) || '市民有志',
      organization: organization.trim() || undefined,
      ageGroup,
      residency,
      locationName: finalLocationName,
      lat: finalLat,
      lng: finalLng,
      tags: tags.length > 0 ? tags : ['まちなか共創', '柳井夢プラン'],
      expectationScore: 85,
      feasibilityScore: 78,
      upvotes: 1,
      downvotes: 0,
      status: 'approved',
      createdAt: new Date().toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }) + ' ' + new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      adminAssignedPhase: 'quick_win',
      committeeComments: ""
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
              提案の視点・分類 <span className="text-rose-500 font-bold ml-1">【必須】</span>
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
              アイデアのタイトル <span className="text-rose-500 font-bold ml-1">【必須】</span>
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
              提案の具体的内容・背景・期待する効果 <span className="text-rose-500 font-bold ml-1">【必須】</span>
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

          {/* Location and Demographic Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {hasCoords && defaultLat && defaultLng ? (
              <div className="col-span-1 sm:col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
                    <span className="w-5 h-5 rounded-md bg-rose-500 text-white flex items-center justify-center text-xs shadow-xs">
                      📍
                    </span>
                    <span>マップ指定ピン位置（最優先連動中）</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    ピン座標優先
                  </span>
                </div>
                <div className="text-xs text-slate-800 font-bold mt-1">
                  {locationName || '柳井市中心市街地 指定地点'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  緯度: {defaultLat.toFixed(5)} / 経度: {defaultLng.toFixed(5)}（地図上の刺したピン位置にそのまま保存・プロットされます）
                </div>
              </div>
            ) : (
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  対象の場所・エリア <span className="text-slate-500 font-normal ml-1">【任意】</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="具体的な場所（例: 白壁通り、駅前広場など）※空欄でも投稿可能"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  ※ 地図上でピンを刺していない場合のみ入力可能です（任意項目です。空白のままでも投稿できます）。
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                年代・属性（集計用） <span className="text-rose-500 font-bold ml-1">【必須】</span>
              </label>
              <select
                value={residency}
                onChange={(e) => setResidency(e.target.value as ResidencyArea)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="yanai_student">柳井高校・柳井学園在校生（通学）</option>
                <option value="commuter">通勤者</option>
                <option value="downtown_resident">まちなか在住</option>
                <option value="suburban_resident">市内郊外在住</option>
                <option value="tourist_fan">観光客・関係人口・ファン</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                お名前 / ニックネーム（公開用） <span className="text-slate-500 font-normal ml-1">【任意】</span>
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
