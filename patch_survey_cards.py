import re

with open('src/components/survey/SurveyApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Card 1 (Total Responses) container layout to match others if needed, but it's fine.
card1_before = """              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">"""
card1_after = """              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-start justify-between h-full">"""
content = content.replace(card1_before, card1_after)

# Fix Card 2 (Top Pride)
card2_before = """              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mb-0.5">
                    <Heart className="w-3.5 h-3.5" />
                    自慢・強み No.1
                  </span>
                  <div className="text-base sm:text-lg font-bold text-slate-900 truncate" title={topPrideItem?.name}>"""
card2_after = """              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-start justify-between h-full">
                <div className="min-w-0 pr-2 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mb-1">
                      <Heart className="w-3.5 h-3.5" />
                      自慢・強み No.1
                    </span>
                    <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words" title={topPrideItem?.name}>"""
content = content.replace(card2_before, card2_after)

# For Card 2, we also need to close the extra div
card2_bottom_before = """                    得票率: <strong className="text-emerald-600 font-bold">{prideRate}%</strong> ({topPrideItem?.count || 0}票)
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">"""
card2_bottom_after = """                    得票率: <strong className="text-emerald-600 font-bold">{prideRate}%</strong> ({topPrideItem?.count || 0}票)
                  </span>
                  </div>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-1">"""
content = content.replace(card2_bottom_before, card2_bottom_after)

# Fix Card 3 (Top Worry)
card3_before = """              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-semibold text-rose-600 flex items-center gap-1 mb-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    最大の不安・課題 No.1
                  </span>
                  <div className="text-base sm:text-lg font-bold text-slate-900 truncate" title={topWorryItem?.name}>"""
card3_after = """              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-start justify-between h-full">
                <div className="min-w-0 pr-2 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-xs font-semibold text-rose-600 flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      最大の不安・課題 No.1
                    </span>
                    <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words" title={topWorryItem?.name}>"""
content = content.replace(card3_before, card3_after)

card3_bottom_before = """                    懸念率: <strong className="text-rose-600 font-bold">{worryRate}%</strong> ({topWorryItem?.count || 0}票)
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">"""
card3_bottom_after = """                    懸念率: <strong className="text-rose-600 font-bold">{worryRate}%</strong> ({topWorryItem?.count || 0}票)
                  </span>
                  </div>
                </div>
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-1">"""
content = content.replace(card3_bottom_before, card3_bottom_after)

# Fix Card 4 (Top Hope)
card4_before = """              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 mb-0.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    住民の期待・要望 No.1
                  </span>
                  <div className="text-base sm:text-lg font-bold text-slate-900 truncate" title={topHopeItem?.name}>"""
card4_after = """              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-start justify-between h-full">
                <div className="min-w-0 pr-2 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 mb-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      住民の期待・要望 No.1
                    </span>
                    <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words" title={topHopeItem?.name}>"""
content = content.replace(card4_before, card4_after)

card4_bottom_before = """                    期待率: <strong className="text-indigo-600 font-bold">{hopeRate}%</strong> ({topHopeItem?.count || 0}票)
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">"""
card4_bottom_after = """                    期待率: <strong className="text-indigo-600 font-bold">{hopeRate}%</strong> ({topHopeItem?.count || 0}票)
                  </span>
                  </div>
                </div>
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-1">"""
content = content.replace(card4_bottom_before, card4_bottom_after)


with open('src/components/survey/SurveyApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
