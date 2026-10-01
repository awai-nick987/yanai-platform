import React, { useState } from 'react';
import { CategoryType, AgeGroup, ResidencyArea, IdeaSubmission } from '../types';
import { MessageSquarePlus, Send, MapPin, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

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
  const [targetProject, setTargetProject] = useState('');
  const [opinion, setOpinion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opinion.trim()) return;

    let ageGroup: AgeGroup = 'twenties_thirties';
    if (age === '10s') ageGroup = 'teens';
    else if (age === '20s' || age === '30s') ageGroup = 'twenties_thirties';
    else if (age === '40s' || age === '50s') ageGroup = 'forties_fifties';
    else if (age === '60s' || age === '70s' || age === '80s') ageGroup = 'sixties_plus';

    onAddNewIdea({
      title: `${targetProject || '中心市街地'}への市民提案`,
      category: targetProject.includes('子育て') ? 'value_creation' : targetProject.includes('移動') ? 'traffic_walk' : 'downtown_buzz',
      description: opinion.trim(),
      authorName: gender ? `市民有志 (${gender === 'male' ? '男性' : gender === 'female' ? '女性' : '無回答'}・${age || '年代未選択'})` : '市民有志',
      ageGroup: ageGroup,
      residency: 'downtown_station',
      locationName: '柳井市中心市街地・駅前エリア',
      lat: 33.9678,
      lng: 132.1075,
      expectationScore: 85,
      feasibilityScore: 75,
      tags: ['市民投稿', targetProject || 'まちなか共創']
    });

    setSubmitted(true);
    setOpinion('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="idea-submission-section" className="space-y-6">
      
      {/* Title Header matching Screenshot */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          意見投稿フォーム
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          個人情報に配慮し、投稿属性は「性別・年代」のみ収集します。投稿は夜間バッチで整理されます（現在はシミュレーション）。
        </p>
      </div>

      {/* Form Card matching Screenshot */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-4xl">
        
        {submitted && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-xs sm:text-sm font-bold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>貴重なご意見ありがとうございます！データ集計・モデレーションキューに送信されました。</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Row 1: 性別 & 年代 matching screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 性別 * */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                性別 *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">選択してください</option>
                <option value="male">男性 (male)</option>
                <option value="female">女性 (female)</option>
                <option value="other">その他・回答しない</option>
              </select>
            </div>

            {/* 年代 * */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                年代 *
              </label>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">選択してください</option>
                <option value="10s">10代 (高校生・学生)</option>
                <option value="20s">20代</option>
                <option value="30s">30代 (子育て世代)</option>
                <option value="40s">40代</option>
                <option value="50s">50代</option>
                <option value="60s">60代 (シニア)</option>
                <option value="70s">70代</option>
                <option value="80s">80代以上</option>
              </select>
            </div>

          </div>

          {/* Row 2: 対象プロジェクト * matching screenshot */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
              対象プロジェクト *
            </label>
            <select
              value={targetProject}
              onChange={(e) => setTargetProject(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">選択してください</option>
              <option value="まちなか回遊改善">サンプル：まちなか回遊改善</option>
              <option value="子育て支援アイデア募集">サンプル：子育て支援アイデア募集</option>
              <option value="移動手段再編計画">サンプル：移動手段再編計画</option>
              <option value="白壁景観・金魚ちょうちん保全">白壁景観・金魚ちょうちん保全</option>
              <option value="その他・全体のまちづくり">その他・全体のまちづくり全般</option>
            </select>
          </div>

          {/* Row 3: ご意見 * matching screenshot */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
              ご意見 *
            </label>
            <textarea
              rows={4}
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
              required
              placeholder="サンプル：駅前広場の使い方について提案します。ベンチや日陰スペースを増やして、高校生やお年寄りが安心して休憩できるようにしてほしいです。"
              className="w-full px-3.5 py-3 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none leading-relaxed"
            ></textarea>
          </div>

          {/* Submit Button matching screenshot */}
          <div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>投稿する</span>
            </button>
          </div>

        </form>
      </div>

    </section>
  );
};
