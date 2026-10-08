import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Lightbulb, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Award,
  Layers,
  MessageSquare,
  HelpCircle,
  X,
  BookOpen
} from 'lucide-react';
import { SectionTextContent } from '../types';

interface IdobataSession {
  number: string;
  title: string;
  subtitle: string;
  question: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  themeColor: string;
  badgeBg: string;
  keyOutputs: string[];
  reportSummary: string;
}

const IDOBATA_SESSIONS: IdobataSession[] = [
  {
    number: '01',
    title: '市民活動',
    subtitle: '好き・得意が拓く可能性',
    question: '自分の「好き」や「得意」な活動が拓く、まちづくりの可能性は？',
    description: '市民一人ひとりの「好き」や「得意」を活かした活動で、まちの可能性を広げます。',
    date: '2025年11月20日',
    venue: 'みどりが丘図書館 スタジオ2',
    category: 'シビックプライド・市民参加',
    themeColor: 'from-blue-600 to-indigo-700',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    keyOutputs: [
      '「趣味の延長でまちに関わる」ハードルの低さが重要',
      '空き家・空きスペースを活用したプチ教室やポップアップ出店のアイデア',
      '高校生やシニアの特技を可視化する「市民スキルバンク」構想'
    ],
    reportSummary: '第1回目は多様な世代が集まり、「義務感ではなくワクワクから始まるまちづくり」を議論。34件のユニークなアイデアが創出されました。'
  },
  {
    number: '02',
    title: '歴史・文化',
    subtitle: '懐かしさ×新しさ',
    question: '「懐かしさ」と「新しさ」が共存するまちなかって、どんな景色だろう？',
    description: '柳井の誇る歴史と文化（白壁の町並み等）を大切にしながら、若い世代が惹かれる新しい価値を創造します。',
    date: '2025年12月5日',
    venue: 'みどりが丘図書館 スタジオ2',
    category: '景観・伝統文化・XR',
    themeColor: 'from-amber-600 to-orange-700',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
    keyOutputs: [
      '金魚ちょうちんの通年ライトアップと夜間回遊性の向上',
      '伝統的町屋の意匠を活かした夜カフェ・バーの必要性',
      '歴史的ストーリーと最新デジタル技術（XR/プロジェクション）の融合'
    ],
    reportSummary: '観光客だけでなく地元住民が誇りに思える白壁エリアの夜間活用について深掘り。現在の実証実験「白壁夜間テラス」の原点がここで生まれました。'
  },
  {
    number: '03',
    title: 'コミュニティ',
    subtitle: '新しいつながり',
    question: '世代を超えてつながるまちなかの新しいコミュニティに何が必要だろう？',
    description: '世代や立場を超えた新しいつながりを生み出し、孤独や孤立を防ぐ温かな居場所を考えます。',
    date: '2026年1月24日',
    venue: 'みどりが丘図書館 スタジオ2',
    category: '多世代交流・居場所',
    themeColor: 'from-emerald-600 to-teal-700',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    keyOutputs: [
      '高校生とシニアが日常的に言葉を交わせる「第3の居場所（サードプレイス）」',
      '子育て世代がベビーカーのまま気兼ねなく集えるコミュニティカフェ',
      '自治会活動のデジタル化と柔軟なボランティア参加の仕組み'
    ],
    reportSummary: '柳井高校生と地域住民が同じテーブルで語り合い、「世代間ギャップは対話で乗り越えられる」という確信が生まれた感動的な回となりました。'
  },
  {
    number: '04',
    title: '空間・インフラ',
    subtitle: '人がつながる居場所づくり',
    question: '居心地のよいまちなかに、どんな空間やインフラが必要だろう？',
    description: '人が自然と集まり、歩きたくなり、交流したくなる魅力的なウォーカブル空間を考えます。',
    date: '2026年2月14日',
    venue: 'みどりが丘図書館 スタジオ2',
    category: 'ウォーカブル・交通空間',
    themeColor: 'from-purple-600 to-indigo-800',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    keyOutputs: [
      '駅前〜白壁エリアをつなぐ歩行者専用ベンチや緑道プロムナード',
      '手軽に利用できるシェアモビリティ（電動自転車・キックボード）ポート',
      '雨の日や真夏でも安心できる木陰・屋根付きテラスの配置'
    ],
    reportSummary: '都市計画の専門家も交え、道路占用やパークレット（路上休憩施設）など、具体的な空間利活用のプロトタイプを議論しました。'
  },
  {
    number: '05',
    title: '暮らしと経済',
    subtitle: '地域内循環をつくる',
    question: '『「お金」と「支え合い」がぐるぐる巡るまちなかって、どんな姿をしているだろう？』',
    description: '地域の経済を活性化し、地産地消と助け合いで持続可能な豊かな暮らしを実現します。',
    date: '2026年3月14日',
    venue: 'みどりが丘図書館 スタジオ2',
    category: 'ローカル経済・起業・循環',
    themeColor: 'from-rose-600 to-pink-700',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    keyOutputs: [
      '地元店舗と連携した地域通貨・応援クーポンの発行',
      'チャレンジショップ制度による若手起業家・新規出店者の誘致',
      '農水産物と加工品が集まる定期的な週末まちなかマルシェ'
    ],
    reportSummary: '地元商店街の店主や若手起業家が熱弁を交わし、「稼げるまちなか」と「温かな暮らし」の両立モデルを描き出しました。'
  },
  {
    number: '06',
    title: 'コミュニティ（番外編）',
    subtitle: 'つながりをカタチにする',
    question: '「つながりを生む場所をどう設計する？」',
    description: '柳井商工高校生によるインターンシップ型ワークショップ。若者ならではの柔軟な視点で設計。',
    date: '2026年2月13日',
    venue: '柳井市役所 会議室',
    category: '高校生探究・インターン',
    themeColor: 'from-teal-600 to-cyan-700',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
    keyOutputs: [
      '高校生目線での「放課後に安心して溜まれるWiFi・電源完備スペース」',
      '映えるフォトスポットとSNSを活用した柳井の隠れた魅力発信',
      '大人が高校生の意見を真剣に聴く市政フィードバックの定例化'
    ],
    reportSummary: '商工生が自ら作成した模型やスライドを使って市長・職員へ提言。高校生たちの情熱が大人たちを大きく動かしました。'
  }
];

interface IdobataArchiveSectionProps {
  customTexts?: SectionTextContent;
  onNavigateToProjects?: () => void;
  onNavigateToIdeas?: () => void;
}

export const IdobataArchiveSection: React.FC<IdobataArchiveSectionProps> = ({
  customTexts,
  onNavigateToProjects,
  onNavigateToIdeas
}) => {
  const [selectedSession, setSelectedSession] = useState<IdobataSession | null>(null);

  const safeCustom: SectionTextContent = customTexts || {};
  const mainTitle = safeCustom.title || "まちなか井戸端会議 アーカイブ";
  const subtitle = safeCustom.subtitle || "柳井市「まちなか夢プラン策定プロジェクト」助走期間（全6回シリーズ完結）の対話記録と住民アイデア集";

  return (
    <section id="idobata-section" className="space-y-8 sm:space-y-12">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-amber-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl border border-amber-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>助走期間・全6回シリーズ完結アーカイブ (R7年度)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {mainTitle}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed max-w-3xl font-medium">
            {subtitle}
          </p>

          <p className="text-xs text-amber-200/90 leading-relaxed pt-1">
            令和8年度からの「柳井市中心市街地活性化基本計画」本格策定に向けて、行政と市民が対等な立場で語り合った貴重な記録です。ここで生まれた241件のアイデアと対話が、現在の実証実験プロジェクトや本プラットフォームへと引き継がれています。
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 sm:pt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15">
              <div className="text-[11px] font-bold text-amber-300">参加者累計</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">85<span className="text-sm font-bold text-slate-300 ml-1">名</span></div>
              <div className="text-[10px] text-slate-300 mt-0.5">高校生〜シニアまで</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15">
              <div className="text-[11px] font-bold text-amber-300">創出アイデア数</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">241<span className="text-sm font-bold text-slate-300 ml-1">件</span></div>
              <div className="text-[10px] text-slate-300 mt-0.5">KJ法・付箋データ集約</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15">
              <div className="text-[11px] font-bold text-amber-300">実証プロジェクト案</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">12<span className="text-sm font-bold text-slate-300 ml-1">案</span></div>
              <div className="text-[10px] text-slate-300 mt-0.5">PoCへの昇格候補</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15">
              <div className="text-[11px] font-bold text-amber-300">参加満足度</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">94<span className="text-sm font-bold text-slate-300 ml-1">%</span></div>
              <div className="text-[10px] text-slate-300 mt-0.5">「また参加したい」</div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. 4年間ロードマップでの位置づけ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 text-xs font-bold mb-2 border border-indigo-200">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>4年間ロードマップにおける位置づけ</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            助走から本格始動へ — 夢プランの実現プロセス
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            「まちなか井戸端会議」は、令和7年度の助走期間（ステップ1）として開催されました。現在はステップ2「共創プラットフォーム・実証実験」へと進化しています。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Step 1: 井戸端会議 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-400 relative">
            <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-xs">
              完結・記録
            </span>
            <div className="text-xs font-bold text-amber-800">R7年度（2025）助走期間</div>
            <h4 className="text-sm font-extrabold text-slate-900 mt-1">まちなか井戸端会議</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              全6回の対話セッションで市民85名から241件のアイデアを収集。機運醸成と仲間集めを実施。
            </p>
          </div>

          {/* Step 2: 現在のプラットフォーム */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/90 border-2 border-blue-500 shadow-md relative">
            <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs animate-pulse">
              現在進行中 (NOW)
            </span>
            <div className="text-xs font-bold text-blue-800">R8年度（2026）体制構築</div>
            <h4 className="text-sm font-extrabold text-slate-900 mt-1">共創プラットフォーム・実証実験</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              本Webプラットフォームを開設。ビジョン投票、実証実験（PoC）、アイデアのマッププロットを推進。
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500">R9年度（2027）計画策定</div>
            <h4 className="text-sm font-extrabold text-slate-900 mt-1">基本計画素案と社会実験</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              実証データを元に基本計画の素案を作成し、国や県と連携した大規模な社会実験を実施。
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500">R10年度（2028）本格始動</div>
            <h4 className="text-sm font-extrabold text-slate-900 mt-1">夢プラン完成・本格事業化</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              まちづくり会社や市民組織による持続可能な運営スキームを確立し、新しい柳井が本格始動。
            </p>
          </div>

        </div>
      </div>

      {/* 3. 全6回のテーマ別レポート一覧 */}
      <div className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold mb-2 border border-blue-200">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>全6回対話テーマ＆開催記録</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            5つの重点テーマと高校生特別編
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            各カードをクリックすると、その回で生まれた主な問い立て・議論成果・レポート詳細を確認できます。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {IDOBATA_SESSIONS.map((session) => (
            <div
              key={session.number}
              onClick={() => setSelectedSession(session)}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-3">
                
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono font-black text-xs flex items-center justify-center">
                      #{session.number}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${session.badgeBg}`}>
                      {session.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    開催済
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    第{session.number}回 {session.title}
                  </h4>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    「{session.subtitle}」
                  </p>
                </div>

                {/* Question */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed italic">
                  &ldquo;{session.question}&rdquo;
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {session.description}
                </p>
              </div>

              {/* Bottom Meta & Button */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {session.date}
                </span>

                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>詳細を見る</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className={`p-6 text-white bg-gradient-to-r ${selectedSession.themeColor} flex items-start justify-between`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-white/20">
                    第{selectedSession.number}回
                  </span>
                  <span className="text-xs font-bold text-white/90">
                    まちなか井戸端会議 開催記録
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {selectedSession.title} 〜 {selectedSession.subtitle} 〜
                </h3>
              </div>

              <button
                onClick={() => setSelectedSession(null)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Date & Venue */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>開催日: {selectedSession.date}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>会場: {selectedSession.venue}</span>
                </span>
              </div>

              {/* Central Question */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  この回の中心となった問い
                </h4>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 font-bold text-sm sm:text-base leading-relaxed">
                  &ldquo;{selectedSession.question}&rdquo;
                </div>
              </div>

              {/* Key Outputs */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  対話から生まれた主な気づき・アイデア
                </h4>
                <ul className="space-y-2">
                  {selectedSession.keyOutputs.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  セッション総括
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedSession.reportSummary}
                </p>
              </div>

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedSession(null)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  閉じる
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
