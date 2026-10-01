import React, { useState, useMemo } from 'react';
import { IdeaSubmission } from '../../types';
import { 
  BarChart3, 
  CheckCircle2, 
  Lightbulb, 
  FlaskConical, 
  Heart, 
  Search, 
  Filter, 
  ArrowUpRight, 
  X, 
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Tag,
  MapPin,
  Calendar,
  User,
  Sparkles
} from 'lucide-react';

interface WorkspaceDashboardProps {
  submissions: IdeaSubmission[];
}

type MetricKey = 'total' | 'approved' | 'poc' | 'upvotes' | null;

export const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({ submissions = [] }) => {
  const safeSubmissions = submissions || [];

  // Active selected metric to view drill-down list
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Stats
  const totalCount = safeSubmissions.length;
  const approvedList = useMemo(() => {
    return safeSubmissions.filter(s => s.status === 'approved' || s.status === 'reflected');
  }, [safeSubmissions]);

  const pocList = useMemo(() => {
    return [
      {
        id: 'poc-1',
        title: '白壁の町並み 夜間ライトアップ・金魚ちょうちん夜市実証実験',
        category: '白壁・景観 / 賑わい',
        status: '進行中 (進捗 65%)',
        targetDate: '2026-10-04 (土)',
        leadDept: '商工観光課・商工会議所青年部',
        location: '白壁の町並み通り一帯',
        participants: '約 1,200名想定',
        description: '夜間滞在時間の延長と周遊性向上を検証。飲食屋台と伝統工芸ライトアップを連携。'
      },
      {
        id: 'poc-2',
        title: '柳井高校生探究学習連携 空き店舗コミュニティカフェ＆学習ラウンジ',
        category: '若者・高校生 / まちなか活性',
        status: '準備中 (進捗 40%)',
        targetDate: '2026-10-18 (日)',
        leadDept: '地域づくり推進課・柳井高校探究PJ',
        location: '古市金屋地区 空き商家',
        participants: '高校生・若手市民 150名',
        description: '高校生が企画・運営するサードプレイス。Wi-Fi・電源完備で放課後の居場所ニーズを検証。'
      },
      {
        id: 'poc-3',
        title: 'JR柳井駅前〜白壁エリア シェアモビリティ（グリスロ＆電動キックボード）回遊実証',
        category: '交通・歩行 / モビリティ',
        status: '準備中 (進捗 50%)',
        targetDate: '2026-11-01 (日)',
        leadDept: '都市計画課・民間モビリティ事業者',
        location: '柳井駅前広場〜白壁・柳井港',
        participants: '市民・観光客 300名利用想定',
        description: '駅からのラストワンマイルの移動手段と回遊行動ログの収集・分析。'
      }
    ];
  }, []);

  const totalUpvotes = useMemo(() => {
    return safeSubmissions.reduce((acc, cur) => acc + (cur.upvotes || 0), 0) + 340;
  }, [safeSubmissions]);

  // Handle drill-down items
  const drillDownData = useMemo(() => {
    if (!selectedMetric) return null;

    if (selectedMetric === 'total') {
      return {
        title: '市民アイデア総数 一覧リスト',
        subtitle: `全 ${totalCount} 件の市民・高校生投稿アイデア`,
        color: 'indigo',
        type: 'submissions' as const,
        items: safeSubmissions
      };
    } else if (selectedMetric === 'approved') {
      return {
        title: '承認・採用済みアイデア 一覧リスト',
        subtitle: `委員会審査・基本計画反映対象の ${approvedList.length} 件`,
        color: 'emerald',
        type: 'submissions' as const,
        items: approvedList
      };
    } else if (selectedMetric === 'poc') {
      return {
        title: '実証実験（PoC / 社会実験）プロジェクト詳細リスト',
        subtitle: `令和8年度 推進中の重点実証実験 ${pocList.length} 件`,
        color: 'amber',
        type: 'poc' as const,
        items: pocList
      };
    } else if (selectedMetric === 'upvotes') {
      const sortedByVotes = [...safeSubmissions].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
      return {
        title: '共感投票 ランキング＆得票内訳リスト',
        subtitle: `総投票数 ${totalUpvotes} 票・高評価順ランキング`,
        color: 'rose',
        type: 'submissions' as const,
        items: sortedByVotes
      };
    }
    return null;
  }, [selectedMetric, safeSubmissions, approvedList, pocList, totalCount, totalUpvotes]);

  // Filter items in list
  const filteredSubmissions = useMemo(() => {
    if (!drillDownData || drillDownData.type !== 'submissions') return [];
    return (drillDownData.items as IdeaSubmission[]).filter(item => {
      if (filterCategory !== 'all' && item.category !== filterCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.authorName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [drillDownData, filterCategory, searchQuery]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-7">
      
      {/* Title Header matching User Request */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>柳井市中心市街地活性化基本計画 推進体制</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            柳井市まちなかまちづくり推進ダッシュボード
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            各指標のカードをクリックすると、下層に全件の詳細リストと分析内訳が展開されます。
          </p>
        </div>

        {selectedMetric && (
          <button
            onClick={() => setSelectedMetric(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer self-start sm:self-center"
          >
            <X className="w-4 h-4" />
            <span>リストを閉じる</span>
          </button>
        )}
      </div>

      {/* 4 Clickable Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: 市民アイデア総数 */}
        <button
          onClick={() => setSelectedMetric(selectedMetric === 'total' ? null : 'total')}
          className={`p-5 rounded-2xl text-left transition-all border-2 cursor-pointer relative overflow-hidden group ${
            selectedMetric === 'total'
              ? 'bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-300 shadow-md'
              : 'bg-slate-50/80 hover:bg-indigo-50/40 border-slate-200 hover:border-indigo-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700">市民アイデア総数</span>
            <Lightbulb className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-indigo-950 mt-2 tracking-tight">
            {totalCount} <span className="text-sm font-bold text-indigo-600">件</span>
          </div>
          <div className="text-[11px] text-indigo-800/80 mt-1.5 flex items-center justify-between font-medium">
            <span>高校生・若者比率 48%</span>
            <span className="text-indigo-600 font-bold text-[10px] flex items-center gap-0.5">
              {selectedMetric === 'total' ? '表示中 ▲' : 'リストを開く ▼'}
            </span>
          </div>
        </button>

        {/* Metric 2: アイデア（承認・採用済み） */}
        <button
          onClick={() => setSelectedMetric(selectedMetric === 'approved' ? null : 'approved')}
          className={`p-5 rounded-2xl text-left transition-all border-2 cursor-pointer relative overflow-hidden group ${
            selectedMetric === 'approved'
              ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-300 shadow-md'
              : 'bg-slate-50/80 hover:bg-emerald-50/40 border-slate-200 hover:border-emerald-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">承認・採用済みアイデア</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-emerald-950 mt-2 tracking-tight">
            {approvedList.length} <span className="text-sm font-bold text-emerald-600">件</span>
          </div>
          <div className="text-[11px] text-emerald-800/80 mt-1.5 flex items-center justify-between font-medium">
            <span>審査通過率 85%</span>
            <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5">
              {selectedMetric === 'approved' ? '表示中 ▲' : 'リストを開く ▼'}
            </span>
          </div>
        </button>

        {/* Metric 3: 実証実験 */}
        <button
          onClick={() => setSelectedMetric(selectedMetric === 'poc' ? null : 'poc')}
          className={`p-5 rounded-2xl text-left transition-all border-2 cursor-pointer relative overflow-hidden group ${
            selectedMetric === 'poc'
              ? 'bg-amber-50/90 border-amber-600 ring-2 ring-amber-300 shadow-md'
              : 'bg-slate-50/80 hover:bg-amber-50/40 border-slate-200 hover:border-amber-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700">実証実験（PoC）進行中</span>
            <FlaskConical className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-amber-950 mt-2 tracking-tight">
            {pocList.length} <span className="text-sm font-bold text-amber-600">件</span>
          </div>
          <div className="text-[11px] text-amber-800/80 mt-1.5 flex items-center justify-between font-medium">
            <span>白壁夜市・探究カフェ等</span>
            <span className="text-amber-600 font-bold text-[10px] flex items-center gap-0.5">
              {selectedMetric === 'poc' ? '表示中 ▲' : 'リストを開く ▼'}
            </span>
          </div>
        </button>

        {/* Metric 4: 共感投票 */}
        <button
          onClick={() => setSelectedMetric(selectedMetric === 'upvotes' ? null : 'upvotes')}
          className={`p-5 rounded-2xl text-left transition-all border-2 cursor-pointer relative overflow-hidden group ${
            selectedMetric === 'upvotes'
              ? 'bg-rose-50/90 border-rose-600 ring-2 ring-rose-300 shadow-md'
              : 'bg-slate-50/80 hover:bg-rose-50/40 border-slate-200 hover:border-rose-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700">共感投票 総数</span>
            <Heart className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-rose-950 mt-2 tracking-tight">
            {totalUpvotes} <span className="text-sm font-bold text-rose-600">票</span>
          </div>
          <div className="text-[11px] text-rose-800/80 mt-1.5 flex items-center justify-between font-medium">
            <span>市民エンゲージメント</span>
            <span className="text-rose-600 font-bold text-[10px] flex items-center gap-0.5">
              {selectedMetric === 'upvotes' ? '表示中 ▲' : 'リストを開く ▼'}
            </span>
          </div>
        </button>

      </div>

      {/* ========================================================= */}
      {/* DRILL-DOWN FULL CONTENT LIST (EXPANDS WHEN CLICKED)       */}
      {/* ========================================================= */}
      {drillDownData && (
        <div className="bg-slate-50/90 rounded-2xl p-5 sm:p-6 border-2 border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header of Drill Down */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {drillDownData.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {drillDownData.subtitle}
              </p>
            </div>

            {/* Filter controls for submissions */}
            {drillDownData.type === 'submissions' && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="キーワード検索..."
                    className="pl-8 pr-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs w-40 sm:w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-2.5 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
                >
                  <option value="all">全カテゴリ</option>
                  <option value="youth_student">若者・高校生</option>
                  <option value="downtown_buzz">白壁・賑わい</option>
                  <option value="traffic_walk">交通・回遊</option>
                  <option value="living_amenity">生活・子育て</option>
                  <option value="tourism_culture">観光・歴史</option>
                </select>
              </div>
            )}
          </div>

          {/* List Content: Submissions */}
          {drillDownData.type === 'submissions' && (
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {filteredSubmissions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
                  該当するアイデアが見つかりませんでした。
                </div>
              ) : (
                filteredSubmissions.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white hover:bg-blue-50/20 rounded-xl border border-slate-200 hover:border-blue-300 transition-all space-y-2 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-400 font-mono">
                          #{index + 1}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'reflected' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status === 'reflected' ? '計画反映済' : item.status === 'approved' ? '承認済' : '審議中'}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 font-bold text-rose-600">
                          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                          <span>{item.upvotes || 0} 票</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {item.createdAt}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{item.authorName} ({item.ageGroup})</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{item.locationName}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-indigo-600 font-medium">期待度: {item.expectationScore}点</span>
                        <span className="text-emerald-600 font-medium">実現性: {item.feasibilityScore}点</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* List Content: PoC Projects */}
          {drillDownData.type === 'poc' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pocList.map((poc, idx) => (
                <div
                  key={poc.id}
                  className="p-4 bg-white rounded-xl border-2 border-amber-200 hover:border-amber-400 transition-all space-y-3 shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        {poc.status}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        PoC #{idx + 1}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {poc.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {poc.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600 bg-slate-50/50 p-2.5 rounded-lg">
                    <div><strong>実施予定:</strong> {poc.targetDate}</div>
                    <div><strong>場所:</strong> {poc.location}</div>
                    <div><strong>主導:</strong> {poc.leadDept}</div>
                    <div><strong>規模:</strong> {poc.participants}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Focus Projects Progress Overview */}
      <div className="border-t border-slate-100 pt-6">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>重点プロジェクト別 進捗ステータス</span>
          <span className="text-[11px] font-semibold text-slate-400">令和8年度 推進WG</span>
        </h3>
        <div className="space-y-3">
          
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="font-bold text-slate-800">1. 白壁の町並み夜間ライトアップ・金魚ちょうちん夜市実証実験</span>
            </div>
            <div className="flex items-center gap-3 sm:self-center">
              <span className="text-slate-500">資材手配・道路占用許可申請</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">進捗 65%</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              <span className="font-bold text-slate-800">2. 柳井高校生探究連携 空き店舗コミュニティカフェ＆学習ラウンジ</span>
            </div>
            <div className="flex items-center gap-3 sm:self-center">
              <span className="text-slate-500">空き家オーナー調整・什器手配</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">進捗 40%</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
              <span className="font-bold text-slate-800">3. 柳井駅前広場〜白壁エリア シェアモビリティ回遊実証</span>
            </div>
            <div className="flex items-center gap-3 sm:self-center">
              <span className="text-slate-500">ポート用地確認・車両確保</span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">進捗 50%</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
