import os

component = """import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

interface DataSource {
  id: string;
  name: string;
  type: 'survey' | 'workshop' | 'stats' | 'platform';
  count: number;
  date: string;
  description: string;
}

const AVAILABLE_SOURCES: DataSource[] = [
  { id: 'survey_2026', name: 'まちなか住民アンケート (2026)', type: 'survey', count: 184, date: '2026-10-01', description: '市民の日常的な行動と課題に関する調査' },
  { id: 'jh_survey', name: '柳井中学校 生徒アンケート', type: 'survey', count: 320, date: '2026-09-15', description: '中学生の放課後の過ごし方と希望する施設' },
  { id: 'workshop_all', name: 'まちなか井戸端会議 (全6回まとめ)', type: 'workshop', count: 6, date: '2026-08', description: '市民ワークショップでのKJ法による課題抽出とアイデア' },
  { id: 'platform_ideas', name: 'プラットフォーム投稿意見 (デジタルマップ)', type: 'platform', count: 42, date: '2026-10', description: 'このプラットフォーム上で市民から投稿されたマップ上の意見' },
  { id: 'stats_demo', name: '柳井市人口動態・人流統計データ', type: 'stats', count: 1, date: '2026-04', description: '国勢調査および携帯電話位置情報による人流データ' }
];

export const IntegratedAnalysis: React.FC = () => {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const toggleSource = (id: string) => {
    setSelectedSources(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleAnalyze = async () => {
    if (selectedSources.length < 2) {
      alert("統合分析を行うには、最低2つ以上のデータソースを選択してください。");
      return;
    }
    
    setIsAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      setAnalysisResult(`
### 📊 統合AI分析レポート：コンセプトブック向け基礎分析

**【分析対象データ】**
${selectedSources.map(id => '- ' + AVAILABLE_SOURCES.find(s => s.id === id)?.name).join('\\n')}

#### 1. データ間の共通点と強いニーズ
選択されたデータソースを横断して分析した結果、**「屋内で若者・学生が無料で滞在できるサードプレイスの不足」** がすべての年代層・データで共通する最も強い課題として浮き彫りになっています。
特に、中学生アンケートにおける「放課後過ごす場所がない」という意見と、住民アンケートにおける「休日の滞在施設の不足」が強く相関しています。

#### 2. データ間の差分と時期による考え方の変化
* **ワークショップ（8月） vs プラットフォーム投稿（10月）**
  初期のワークショップでは「大型商業施設の誘致」などハード面の要望が目立ちましたが、最新のプラットフォーム上の意見投稿では「既存の空き家を活用した小さな居場所づくり」など、より現実的でソフト面を重視する意見へのシフトが見られます。
* **大人世代 vs 中学生**
  大人は「駐車場や車でのアクセスの良さ」を重視する傾向（統計・アンケート）がある一方、中学生は「自転車や徒歩で行ける安全なエリアの拡充」を求めており、モビリティの観点でニーズの不一致が起きています。

#### 3. ビジョン策定に向けた提言（コンセプト案）
上記の統合データから、まちなか再生の基本コンセプトとして以下を提案します。
**『歩いて楽しい、多世代が混ざり合うスキマ空間の創出』**
大規模開発ではなく、駅北から白壁の町並みに至る導線上の「空き家・空き店舗」を点在型のサードプレイスとして改修し、学生と大人が自然に交差する空間を目指す方針が、現在のデータ群から最も高い納得感を得られると考えられます。
      `);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">コンセプトブック AI統合分析（ビジョン策定）</h2>
      <p className="text-gray-600 mb-6">
        各種アンケート、ワークショップのアウトプット、プラットフォーム上の意見などを横断的に掛け合わせ、時期による差分や共通点を見つけ出します。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">📂 分析対象データの選択</h3>
          <div className="space-y-3">
            {AVAILABLE_SOURCES.map(source => (
              <label key={source.id} className={`flex items-start p-3 rounded-md cursor-pointer transition-colors ${selectedSources.includes(source.id) ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>
                <input 
                  type="checkbox" 
                  className="mt-1 mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  checked={selectedSources.includes(source.id)}
                  onChange={() => toggleSource(source.id)}
                />
                <div>
                  <div className="font-bold text-gray-800 text-sm">{source.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{source.description}</div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">{source.date}</span>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">データ数: {source.count}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex-1 flex flex-col justify-center items-center text-center">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="font-bold text-blue-800 mb-2">AIクロス統合分析エンジン</h3>
            <p className="text-sm text-blue-600 mb-6">
              選択した {selectedSources.length} 件のデータソースをAIが読み込み、潜在的な共通課題や時期・対象者による意見の差分を時系列で比較分析します。
            </p>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || selectedSources.length === 0}
              className={`px-8 py-3 rounded-full font-bold shadow-sm transition-all ${
                isAnalyzing ? 'bg-gray-400 text-white cursor-not-allowed' : 
                selectedSources.length > 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md hover:scale-105' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  AIが統合分析中...
                </span>
              ) : '選択したデータを統合分析する'}
            </button>
          </div>
        </div>
      </div>

      {analysisResult && (
        <div className="mt-8 animate-fade-in-up">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-blue-600">✨</span> 統合分析レポート（コンセプトブック原案）
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 lg:p-8 prose prose-blue max-w-none">
            {analysisResult.split('\\n').map((line, i) => {
              if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-gray-800 mt-6 mb-3">{line.replace('### ', '')}</h3>;
              if (line.startsWith('#### ')) return <h4 key={i} className="text-base font-bold text-blue-700 mt-5 mb-2">{line.replace('#### ', '')}</h4>;
              if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-gray-800 my-2">{line.replace(/\\*\\*/g, '')}</p>;
              if (line.startsWith('* **')) {
                const parts = line.replace('* **', '').split('**');
                return <div key={i} className="mt-3 mb-1"><span className="font-bold text-gray-800 border-l-4 border-blue-500 pl-2">{parts[0]}</span>{parts[1]}</div>;
              }
              if (line.startsWith('- ')) return <li key={i} className="ml-4 text-gray-700">{line.replace('- ', '')}</li>;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i} className="text-gray-700 my-1">{line}</p>;
            })}
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 font-medium text-sm flex items-center gap-2">
              <span>📥</span> PDFで出力
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm flex items-center gap-2">
              <span>📝</span> コンセプトブックに保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
"""

with open('src/components/workspace/IntegratedAnalysis.tsx', 'w', encoding='utf-8') as f:
    f.write(component)

print("IntegratedAnalysis.tsx created.")
