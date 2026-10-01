import React from 'react';
import { Building2, Users2, Sparkles, MapPin, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onOpenSubmitModal: () => void;
  onNavigateToProjects: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenSubmitModal,
  onNavigateToProjects
}) => {
  return (
    <section id="about-section" className="space-y-6">
      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs relative overflow-hidden">
        
        {/* Top Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>プロジェクト趣旨と基本方針</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            柳井市まちなかまちづくりプロジェクトとは
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            江戸時代の風情が息づく重要伝統的建造物群保存地区「白壁の町並み」と、JR柳井駅前、柳井川の水辺空間を有機的につなぎ、多世代が安心して集い、歩き、暮らせる持続可能な中心市街地を創出するための官民連携・市民共創プロジェクトです。
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1 */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/70 hover:border-blue-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              1. 歴史・景観保全と賑わい再生
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              金魚ちょうちんや白壁の美しい景観を未来に継承しながら、空き店舗・古民家を活用した若者向けカフェやコワーキング、ナイトタイムの賑わいを生み出します。
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/70 hover:border-amber-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Users2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              2. 多世代・住民主体の共創
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              高校生（柳井学園・柳井高校）の探究活動や、子育て世代・シニア世代の生の声を反映し、対面WSとWebの両面で誰でも気軽に参加できる仕組みを整えています。
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/70 hover:border-emerald-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              3. 「声」から「社会実験」へ
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              集まったアイデアは毎晩データ分析され、実現可能性の高い提案は「実証実験（PoC）」として迅速に形にし、実際の効果を測定して本計画に組み込みます。
            </p>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              柳井市 都市計画課・地域づくり推進課・商工観光課
            </span>
            <span className="text-slate-300">|</span>
            <span>令和8年度〜令和17年度 推進計画</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenSubmitModal}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>意見を投稿してみる</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onNavigateToProjects}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>進行中のプロジェクトを見る</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
