import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Link2, Table, BarChart3, ChevronRight, FileText, Download } from 'lucide-react';

export const IntegratedAnalysisApp: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">コンセプトブック統合AI</h1>
          </div>
          <p className="text-xs text-slate-500">アンケート分析の3つの視点（相関分析・クロス集計・基本グラフ）から自動でコンセプトブックの原案を生成します</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <BrainCircuit className="w-5 h-5 animate-pulse" />
              <span>AI分析中...</span>
            </>
          ) : (
            <>
              <BrainCircuit className="w-5 h-5" />
              <span>コンセプト原案を生成</span>
            </>
          )}
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!isGenerated && !isGenerating && (
          <div className="max-w-4xl mx-auto mt-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BrainCircuit className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">AIによるコンセプトブック自動生成</h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              アンケートダッシュボードの以下の3つの分析データソースを統合・解釈し、柳井市のまちなか共創に向けたコンセプトブックのドラフトを作成します。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <Link2 className="w-6 h-6 text-indigo-600 mb-3" />
                <h3 className="font-bold text-slate-800 mb-2">相関分析（深掘り）</h3>
                <p className="text-xs text-slate-500">「強み×課題×期待」の同一回答から、特定のターゲットが抱える潜在的なインサイトを抽出します。</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <Table className="w-6 h-6 text-emerald-600 mb-3" />
                <h3 className="font-bold text-slate-800 mb-2">クロス集計（自由分析）</h3>
                <p className="text-xs text-slate-500">年代や居住地など、多様な属性と回答をクロスさせ、ターゲットごとのニーズの違いを浮き彫りにします。</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <BarChart3 className="w-6 h-6 text-amber-600 mb-3" />
                <h3 className="font-bold text-slate-800 mb-2">基本グラフ（全体傾向）</h3>
                <p className="text-xs text-slate-500">全回答の分布から、まち全体として最も強く求められている大局的な方向性を導き出します。</p>
              </div>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-lg font-bold text-slate-600 animate-pulse">3つの分析データを統合中...</p>
          </div>
        )}

        {isGenerated && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI 生成完了
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">柳井市まちなか共創 コンセプトブック原案</h2>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer">
                  <Download className="w-4 h-4" />
                  PDF書き出し
                </button>
              </div>

              <div className="space-y-8">
                {/* 1. 基本グラフからのインサイト */}
                <section>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                    <BarChart3 className="w-5 h-5 text-amber-500" />
                    1. 全体傾向からのベースコンセプト
                  </h3>
                  <div className="bg-slate-50 p-5 rounded-2xl border-l-4 border-amber-400">
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      基本グラフの回答分布から、「医療・福祉」への高い関心と、「買い物・日常の利便性」を強みと感じている層が多いことが明確になりました。この結果から、まちのベースコンセプトは**「多世代が安心して日々の暮らしを営める、歩行圏の充実したコンパクトタウン」**であることが推奨されます。
                    </p>
                  </div>
                </section>

                {/* 2. クロス集計からのインサイト */}
                <section>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                    <Table className="w-5 h-5 text-emerald-500" />
                    2. ターゲット層別のコアニーズ（属性クロス分析）
                  </h3>
                  <div className="bg-slate-50 p-5 rounded-2xl border-l-4 border-emerald-400">
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>若年層（10〜20代）：</strong>「遊ぶ場所・カフェの不足」を強く懸念しており、期待する未来として「若者が集まれるサードプレイスの創出」が顕著に表れています。</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>シニア層（60代以上）：</strong>「公共交通機関の利便性低下」への不安が最も高く、「通院・買い物のモビリティ確保」が必須課題として抽出されました。</span>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* 3. 相関分析からのインサイト */}
                <section>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                    <Link2 className="w-5 h-5 text-indigo-500" />
                    3. 強み×課題×期待 の深掘り戦略シナリオ
                  </h3>
                  <div className="bg-slate-50 p-5 rounded-2xl border-l-4 border-indigo-400">
                    <p className="text-sm text-slate-700 leading-relaxed font-medium mb-3">
                      相関分析の結果、「白壁の町並み（強み）」を誇りに思いつつ、「空き家・空き店舗の増加（課題）」を懸念する層は、高い確率で「新しい働き方・起業支援（期待）」を選択しています。
                    </p>
                    <div className="bg-indigo-900 text-indigo-50 p-4 rounded-xl">
                      <h4 className="font-bold text-indigo-300 text-xs mb-2 uppercase tracking-wider">導出された重点プロジェクト案</h4>
                      <p className="text-sm font-bold">「白壁ヘリテージ・インキュベーション拠点化構想」</p>
                      <p className="text-xs mt-1 text-indigo-200">
                        空き家を改修し、若者やクリエイター向けのお試しオフィス・カフェ複合施設を整備。歴史的景観の保存と若者の居場所創出を同時解決する。
                      </p>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
