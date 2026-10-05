import React, { useState } from 'react';
import { CategoryType, AgeGroup, ResidencyArea, IdeaSubmission } from '../types';
import { MessageSquarePlus, Send, MapPin, CheckCircle2 } from 'lucide-react';

interface IdeaSubmissionSectionProps {
  onAddNewIdea: (idea: Partial<IdeaSubmission>) => void;
  submissionsCount: number;
}

export const IdeaSubmissionSection: React.FC<IdeaSubmissionSectionProps> = ({
  onAddNewIdea,
  submissionsCount
}) => {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [residency, setResidency] = useState<string>('');
  const [locationName, setLocationName] = useState('');
  const [opinion, setOpinion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opinion.trim() || !category || !age || !residency) return;

    onAddNewIdea({
      title: `まちなかに関する提案`,
      category: category as CategoryType,
      description: opinion.trim(),
      authorName: `市民有志 (${gender === 'male' ? '男性' : gender === 'female' ? '女性' : '無回答'}・${age})`,
      ageGroup: age as AgeGroup,
      residency: residency as ResidencyArea,
      locationName: locationName || '',
      lat: 33.9678,
      lng: 132.1075,
      expectationScore: 0,
      feasibilityScore: 0,
      tags: ['市民投稿']
    });

    setSubmitted(true);
    setOpinion('');
    setLocationName('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="submit_idea" className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight flex items-center justify-center gap-3">
            <MessageSquarePlus className="w-8 h-8 text-blue-600" />
            まちなかアイデア・意見投稿
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            柳井市中心市街地・白壁エリアに関するあなたの「あったらいいな」や「ここを改善してほしい」を投稿してください。
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm max-w-3xl mx-auto">
          {submitted ? (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">投稿ありがとうございました！</h3>
              <p className="text-slate-600 text-sm">
                あなたのアイデアは無事に送信されました。まちなか共創の参考データとして活用させていただきます。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">性別 <span className="text-slate-500 font-normal ml-1">【任意】</span></label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">選択してください</option>
                    <option value="male">男性</option>
                    <option value="female">女性</option>
                    <option value="other">その他・回答しない</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">年代 <span className="text-rose-500 font-bold ml-1">【必須】</span></label>
                  <select
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">選択してください</option>
                    <option value="under_10s">10代未満</option>
                    <option value="10s">10代</option>
                    <option value="20s">20代</option>
                    <option value="30s">30代</option>
                    <option value="40s">40代</option>
                    <option value="50s">50代</option>
                    <option value="60s">60代</option>
                    <option value="70s">70代</option>
                    <option value="80s_plus">80代以上</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-800 mb-2">居住地域・関わり <span className="text-rose-500 font-bold ml-1">【必須】</span></label>
                  <select
                    value={residency}
                    onChange={(e) => setResidency(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">選択してください</option>
                    <option value="yanai_student">柳井高校・柳井学園在校生（通学）</option>
                    <option value="commuter">通勤者</option>
                    <option value="downtown_resident">まちなか在住</option>
                    <option value="suburban_resident">市内郊外在住</option>
                    <option value="tourist_fan">観光客・関係人口・ファン</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">提案の視点・分類 <span className="text-rose-500 font-bold ml-1">【必須】</span></label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">選択してください</option>
                  <option value="value_creation">新しい価値の創造（イベント、お店、交流拠点など）</option>
                  <option value="improvement">既存の課題解決（交通、景観、安全、空き家など）</option>
                  <option value="traffic_walk">回遊性・アクセス向上（歩行者空間、自転車、駐車場など）</option>
                  <option value="culture_event">歴史・文化の活用（白壁の町並み、伝統行事など）</option>
                  <option value="youth_student">若者・学生の活躍（学生プロジェクト、遊び場など）</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">対象の場所・エリア <span className="text-slate-500 font-normal ml-1">【任意】</span></label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="例: 白壁通り、駅前広場など"
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">※ まちなかの構想的なアイデアなど特定できない場合は空欄で構いません。概ねのエリア指定としてご入力ください。</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">ご意見・アイデア詳細 <span className="text-rose-500 font-bold ml-1">【必須】</span></label>
                <textarea
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                  required
                  rows={4}
                  placeholder="具体的な困りごとや、「こんな場所があったらいいな」というアイデアを自由にお書きください。"
                  className="w-full px-3.5 py-3 bg-white rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  <Send className="w-4 h-4" />
                  <span>この内容で送信する</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
