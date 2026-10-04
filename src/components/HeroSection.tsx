import React from 'react';
import { SystemSettings, UserRole } from '../types';
import { EyeOff, Eye, Edit3 } from 'lucide-react';
import { Sparkles, MessageSquarePlus, BookOpen, Users, ArrowRight } from 'lucide-react';
import heroBgImage from '../assets/images/yanai_shirakabe_street_1787402231236.jpg';

interface HeroSectionProps {
  onNavigateToProjects: () => void;
  onNavigateToIdeas: () => void;
  onNavigateToRecruitment: () => void;
  activePocCount: number;
  approvedSubmissionsCount: number;
  systemSettings?: SystemSettings;
  currentRole?: UserRole;
  onUpdateSettings?: (settings: SystemSettings) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateToProjects,
  onNavigateToIdeas,
  onNavigateToRecruitment,
  activePocCount,
  approvedSubmissionsCount,
  systemSettings,
  currentRole,
  onUpdateSettings
}) => {
  return (
    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-800/80 bg-slate-950 text-white flex items-center py-6 sm:py-10 md:py-14">
      {/* Background Image: Yanai Shirakabe Townscape with Goldfish Lanterns */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.80) 50%, rgba(15, 23, 42, 0.45) 100%), url(${heroBgImage})`
        }}
      >
        {/* Atmosphere Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-900/40"></div>
      </div>

      {/* Decorative Goldfish Lantern Accent glow */}
      <div className="absolute top-10 right-1/3 w-60 h-60 sm:w-72 sm:h-72 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-60 h-60 sm:w-80 sm:h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Catchcopy & CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* Project Category Eyebrow & Logo */}
            <div className="mb-4 sm:mb-6">
              <div className="inline-block bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl border border-white/20">
                <img src="/logo_main.png" alt="柳井市まちなかまちづくりプロジェクト" className="w-56 sm:w-72 md:w-80 h-auto object-contain" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-bold border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>柳井市まちなかまちづくりプロジェクト</span>
              </div>
              <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-300 uppercase">
                YANAI Machinaka Machidukuri Project
              </p>
            </div>

            {/* Main Headline */}
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
                まちの未来を、<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-100">
                  みんなで共創しよう。
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-bold text-slate-100/90 leading-snug">
                まちの未来がひらく、共創の瞬間。声が集まり、希望が形になる。
              </p>
            </div>

            {/* Subcopy */}
            <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed max-w-2xl font-normal">
              対面ワークショップとオンライン参加の両方で、誰もが参加できるまちづくりを実現します。高校生・若者・子育て世代・シニアの皆さんの声を市政へ。
            </p>

            {/* 3 Call-To-Action Buttons */}
            <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5">
              {/* CTA 1: 意見を投稿する */}
              <button
                id="hero-cta-ideas"
                onClick={onNavigateToIdeas}
                className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm md:text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-900/40 hover:shadow-indigo-900/60 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <MessageSquarePlus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">意見を投稿する</span>
              </button>

              {/* CTA 2: プロジェクトを見る */}
              <button
                id="hero-cta-projects"
                onClick={onNavigateToProjects}
                className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm md:text-base bg-white/95 hover:bg-white text-slate-900 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-white/20"
              >
                <BookOpen className="w-4 h-4 text-indigo-700 shrink-0" />
                <span className="whitespace-nowrap">プロジェクト一覧</span>
              </button>

              {/* CTA 3: ワークショップに参加する */}
              <button
                id="hero-cta-workshop"
                onClick={onNavigateToRecruitment}
                className="w-full sm:w-auto px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm md:text-base bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Users className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="whitespace-nowrap">要員・WS募集</span>
              </button>
            </div>
          </div>

          {/* Right Column: Floating Stats Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end mt-2 lg:mt-0 relative">
            {(!systemSettings?.frontendSectionToggles?.heroFloatingStats && currentRole !== 'admin') ? null : (
              <div className={`w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-slate-900 border border-slate-100 relative overflow-hidden backdrop-blur-xl ${!systemSettings?.frontendSectionToggles?.heroFloatingStats ? 'opacity-50' : ''}`}>
                {currentRole === 'admin' && systemSettings && onUpdateSettings && (
                  <div className="absolute top-2 right-2 z-50 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateSettings({
                          ...systemSettings,
                          frontendSectionToggles: {
                            ...systemSettings.frontendSectionToggles,
                            heroFloatingStats: !systemSettings.frontendSectionToggles.heroFloatingStats
                          }
                        });
                      }}
                      className="p-1.5 bg-slate-900 text-white rounded-full shadow hover:bg-slate-800"
                      title="表示/非表示"
                    >
                      {systemSettings.frontendSectionToggles.heroFloatingStats ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-amber-300" />}
                    </button>
                  </div>
                )}

              {/* Header Visual Bar */}
              <div className="h-20 sm:h-28 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 mb-4 sm:mb-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 relative flex items-end p-4 sm:p-5 overflow-hidden">
                {/* Visual Pattern Stripes */}
                <div className="absolute inset-0 opacity-15 bg-[linear-gradient(45deg,#fff_25%,transparent_25%,transparent_50%,#fff_50%,#fff_75%,transparent_75%,transparent)] [background-size:16px_16px]"></div>
                <div className="relative z-10 text-white w-full">
                  {currentRole === 'admin' && systemSettings && onUpdateSettings ? (
                    <div className="space-y-1 w-full pr-8">
                      <input
                        type="text"
                        value={systemSettings.heroCustomTexts?.floatingSubTitle || ''}
                        onChange={(e) => onUpdateSettings({
                          ...systemSettings,
                          heroCustomTexts: {
                            ...systemSettings.heroCustomTexts,
                            floatingSubTitle: e.target.value
                          }
                        })}
                        className="bg-black/20 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-100 px-2 py-1 rounded w-full border border-white/20 outline-none"
                      />
                      <input
                        type="text"
                        value={systemSettings.heroCustomTexts?.floatingMainTitle || ''}
                        onChange={(e) => onUpdateSettings({
                          ...systemSettings,
                          heroCustomTexts: {
                            ...systemSettings.heroCustomTexts,
                            floatingMainTitle: e.target.value
                          }
                        })}
                        className="bg-black/20 text-sm sm:text-base font-bold text-white px-2 py-1 rounded w-full border border-white/20 outline-none mt-1"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                        {systemSettings?.heroCustomTexts?.floatingSubTitle || "まちなか共創・進捗リアルタイム"}
                      </div>
                      <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                        {systemSettings?.heroCustomTexts?.floatingMainTitle || "柳井市 夢プラン策定状況"}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* Metric 1 */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center transition-all hover:bg-slate-100/80">
                  <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">公開中PJ</div>
                  <div className="text-lg sm:text-2xl font-black text-slate-900 mt-1">
                    {activePocCount}
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center transition-all hover:bg-slate-100/80">
                  <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">承認済み投稿</div>
                  <div className="text-lg sm:text-2xl font-black text-blue-700 mt-1">
                    {approvedSubmissionsCount}
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center transition-all hover:bg-slate-100/80">
                  <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">次回WS</div>
                  <div className="text-[11px] sm:text-xs font-bold text-emerald-700 mt-1 sm:mt-2 bg-emerald-50 px-1 py-0.5 rounded-full border border-emerald-200">
                    募集中
                  </div>
                </div>
              </div>

              {/* Quick Navigation Footer */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  最新データ連携中
                </span>
                <button
                  onClick={onNavigateToProjects}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>一覧を確認</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
