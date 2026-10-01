import { 
  IdeaSubmission, 
  VisionOption, 
  RecruitmentPost, 
  WorkspaceTask, 
  CMSArticle, 
  SystemSettings, 
  PocProject,
  RoadmapItem,
  CalendarEvent,
  ChatChannel,
  ChatMessage,
  TeamMember,
  SharedDoc
} from '../types';

export const INITIAL_SUBMISSIONS: IdeaSubmission[] = [
  {
    id: 'sub-001',
    title: '白壁通り夜間ライトアップと学生カフェスタンドの開設',
    category: 'youth_student',
    description: '白壁の町並みの美しい漆喰壁を夜間に温かみのある和風行灯と金魚ちょうちんで優しく照らし、放課後や週末に高校生（柳井学園・柳井高）や観光客が集えるテイクアウト型カフェスペースを設置してほしいです。',
    authorName: '柳井学園 高校生有志',
    ageGroup: 'teens',
    residency: 'school_commute',
    organization: '柳井学園高等学校',
    locationName: '白壁の町並み・やない西蔵前',
    lat: 33.9678,
    lng: 132.1075,
    expectationScore: 92,
    feasibilityScore: 85,
    upvotes: 148,
    downvotes: 4,
    status: 'approved',
    createdAt: '2026-08-18 14:20',
    tags: ['高校生提案', 'ナイトタイムエコノミー', '金魚ちょうちん', '白壁景観'],
    adminAssignedPhase: 'quick_win',
    committeeComments: '商工会議所青年部および教育機関と連携し、令和8年度秋の実証実験候補として推進。'
  },
  {
    id: 'sub-002',
    title: '柳井駅前〜白壁エリアを繋ぐシェアサイクル＆電動キックボード回遊HUB',
    category: 'traffic_walk',
    description: '柳井駅から白壁の町並みまで徒歩約10分ですが、暑い夏や雨天時、荷物がある観光客向けに電動アシスト自転車とキックボードのポートを駅前広場と観光案内所、柳井港に整備したいです。',
    authorName: '田中 健一',
    ageGroup: 'twenties_thirties',
    residency: 'downtown_station',
    locationName: 'JR柳井駅前ロータリー広場',
    lat: 33.9625,
    lng: 132.1023,
    expectationScore: 88,
    feasibilityScore: 78,
    upvotes: 112,
    downvotes: 9,
    status: 'reflected',
    createdAt: '2026-08-15 10:15',
    tags: ['交通モビリティ', 'ウォーカブル', '観光連携', '駅前活性化'],
    adminAssignedPhase: 'quick_win',
    committeeComments: '駅前再整備基本計画および都市計画課のスマートモビリティ実証事業に採用決定。'
  },
  {
    id: 'sub-003',
    title: '古民家を活用したサテライトオフィス・親子コワーキングスペース',
    category: 'value_creation',
    description: '空き家となっている伝統的町屋をリノベーションし、子連れで利用できるキッズスペース併設のコワーキング施設をつくりたいです。市外からの移住者やリモートワーカーの定着にも繋がります。',
    authorName: '佐藤 美咲',
    ageGroup: 'twenties_thirties',
    residency: 'shirakabe_area',
    organization: '柳井子育てまちづくりネット',
    locationName: '古市金屋地区・旧商家跡',
    lat: 33.9685,
    lng: 132.1082,
    expectationScore: 94,
    feasibilityScore: 68,
    upvotes: 165,
    downvotes: 6,
    status: 'approved',
    createdAt: '2026-08-12 16:45',
    tags: ['空き家活用', '子育て支援', 'テレワーク', '移住定住'],
    adminAssignedPhase: 'strategic',
    committeeComments: '地方創生テレワーク交付金および古民家再生ファンドのスキームを調査中。'
  },
  {
    id: 'sub-004',
    title: '柳井川沿いウッドデッキテラスと水辺マルシェの定期開催',
    category: 'downtown_buzz',
    description: '柳井川沿いの遊歩道に木製ベンチとパラソルを常設し、毎月第3日曜に地元野菜や柳井銘菓（三角餅、甘露醤油スイーツ等）が並ぶ水辺サンデーマーケットを開催しましょう。',
    authorName: '村上 浩二',
    ageGroup: 'forties_fifties',
    residency: 'downtown_station',
    organization: '柳井商業協同組合',
    locationName: '柳井川水辺プロムナード',
    lat: 33.9652,
    lng: 132.1051,
    expectationScore: 84,
    feasibilityScore: 82,
    upvotes: 98,
    downvotes: 3,
    status: 'approved',
    createdAt: '2026-08-10 11:30',
    tags: ['水辺空間', 'マルシェ', '地域食文化', '賑わい創出'],
    adminAssignedPhase: 'quick_win',
    committeeComments: '河川占用許可（ミズベリング協議）の手続きと安全管理体制を検討。'
  },
  {
    id: 'sub-005',
    title: '高校生と地域職人が協働する「デジタル金魚ちょうちん」XR体験',
    category: 'youth_student',
    description: '柳井のシンボル「金魚ちょうちん」の伝統製作技術を高校生が3Dモデリング・AR化し、観光客がスマホで町並みをかざすとデジタル金魚が空中を泳ぐインタラクティブ演出を作りたいです。',
    authorName: '高校生ITクリエイターズ',
    ageGroup: 'teens',
    residency: 'school_commute',
    organization: '柳井高校・情報探究クラブ',
    locationName: 'やない西蔵・柳井市町並み資料館',
    lat: 33.9672,
    lng: 132.1068,
    expectationScore: 91,
    feasibilityScore: 72,
    upvotes: 134,
    downvotes: 5,
    status: 'in_review',
    createdAt: '2026-08-17 19:10',
    tags: ['高校生探究', 'デジタルアート', 'XR観光', '金魚ちょうちん'],
    adminAssignedPhase: 'strategic',
    committeeComments: '観光協会および山口大学デジタルアーカイブ研究室との連携可能性を打診。'
  },
  {
    id: 'sub-006',
    title: '駅前商店街アーケードの案内サイン多言語化とバリアフリー舗装改善',
    category: 'improvement',
    description: '高齢者の歩行車や車いすがつまずきやすい商店街路面の凹凸を修繕し、同時に海外からのクルーズ船客・周防大島連絡客向けの英語・多言語案内ピクトグラムを整備してください。',
    authorName: '松田 トシ子',
    ageGroup: 'sixties_plus',
    residency: 'downtown_station',
    locationName: '柳井駅前本通商店街',
    lat: 33.9638,
    lng: 132.1035,
    expectationScore: 76,
    feasibilityScore: 89,
    upvotes: 87,
    downvotes: 2,
    status: 'approved',
    createdAt: '2026-08-08 09:00',
    tags: ['バリアフリー', '歩行空間', '多言語対応', 'シニア視点'],
    adminAssignedPhase: 'low_hanging',
    committeeComments: '道路維持課の定期補修工事スケジュールに組み込み、年度内完了予定。'
  },
  {
    id: 'sub-007',
    title: '柳井港〜中心街を直結するEV自動運転グリーンスローモビリティ運行',
    category: 'traffic_walk',
    description: '四国・松山航防連絡船の柳井港フェリーターミナルと白壁の町並み、JR柳井駅を時速20km未満でゆったり巡回する電動低速バスを導入し、乗ること自体が観光になる仕組みを作りたい。',
    authorName: '中村 達也',
    ageGroup: 'forties_fifties',
    residency: 'suburban_yanai',
    locationName: '柳井港〜白壁ルート',
    lat: 33.9580,
    lng: 132.1210,
    expectationScore: 86,
    feasibilityScore: 48,
    upvotes: 120,
    downvotes: 22,
    status: 'in_review',
    createdAt: '2026-08-05 13:40',
    tags: ['グリスロ', '次世代交通', '港湾連携', '長期構想'],
    adminAssignedPhase: 'long_term',
    committeeComments: '国の自動運転実証実験補助金の公募タイミングに合わせて検討。'
  },
  {
    id: 'sub-008',
    title: '柳井甘露醤油と伝統和菓子の「食べ歩きパスポート」＆ゴミ回収スタンド',
    category: 'culture_event',
    description: '醤油蔵や老舗菓子店を巡る少額食べ歩きチケットを発行し、ポイ捨てを防ぐため町並み景観に調和した木製エコゴミステーションを要所に配置するアイデアです。',
    authorName: '山口 食文化研究サークル',
    ageGroup: 'twenties_thirties',
    residency: 'tourism_relation',
    locationName: '古市・金屋町並み一帯',
    lat: 33.9681,
    lng: 132.1079,
    expectationScore: 89,
    feasibilityScore: 91,
    upvotes: 142,
    downvotes: 4,
    status: 'approved',
    createdAt: '2026-08-16 15:30',
    tags: ['甘露醤油', '食べ歩き', 'クリーンツーリズム', '商店街連携'],
    adminAssignedPhase: 'quick_win',
    committeeComments: '柳井観光コンベンション協会と共同で秋のキャンペーン企画として実装へ。'
  }
];

export const INITIAL_VISION_OPTIONS: VisionOption[] = [
  {
    id: 'vision-01',
    title: '歴史と若者の挑戦が交差する「白壁リビング＆クリエイティブ回廊」',
    subtitle: '歴史遺産の保存×高校生・若者の挑戦拠点を融合させた歩きたくなる街',
    description: '白壁の町並みを「見るだけの観光地」から「市民が日常的に集い、学び、商うリビング」へ転換。空き町屋のオープンラボ化や夜間テラスを整備します。',
    votes: 412,
    tags: ['若者挑戦', '町屋再生', 'リビングストリート'],
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80',
    keyProjects: ['白壁空き家オープンラボ', '夜間ライトアップ夜市', '高校生カフェプロジェクト']
  },
  {
    id: 'vision-02',
    title: '水辺と駅前がシームレスにつながる「ウォーカブル・スマートタウン」',
    subtitle: '柳井川の親水プロムナードと駅前広場の快適な歩行空間ネットワーク',
    description: '車中心から人中心のまちなかへ。駅前広場から白壁、柳井川沿いを緑とベンチ、シェアモビリティで結び、健康で心地よい回遊体験を創出します。',
    votes: 368,
    tags: ['ウォーカブル', 'スマートモビリティ', '水辺空間'],
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    keyProjects: ['駅前歩行者テラス整備', '柳井川親水デッキ', '電動キックボードHUB']
  },
  {
    id: 'vision-03',
    title: '伝統工芸とデジタルが共鳴する「金魚ちょうちんDX観光・文化創造都市」',
    subtitle: '300年の手仕事×XR・データ連携による世界基準の文化発信拠点',
    description: '柳井自慢の金魚ちょうちんと甘露醤油の魅力を世界へ。職人技術の継承とXR観光、まちなかデジタルアートで一年中光と賑わいが溢れる街へ。',
    votes: 295,
    tags: ['伝統工芸DX', 'デジタルアート', '世界発信'],
    imageUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=800&auto=format&fit=crop&q=80',
    keyProjects: ['金魚ちょうちんミュージアムDX', 'AR町並み探訪', '世界柳井ファンコミュニティ']
  }
];

export const INITIAL_RECRUITMENT_POSTS: RecruitmentPost[] = [
  {
    id: 'rec-01',
    title: '第3回 まちなか未来共創ワークショップ＆高校生アイデアソン',
    category: 'ワークショップ',
    organizer: '柳井市地域づくり推進課 / まちなか夢プラン策定委員会',
    targetAudience: '柳井市在住・在学の高校生・一般市民・事業者（定員30名）',
    location: '柳井市文化福祉会館 3階 大会議室（オンライン併用）',
    date: '2026年9月12日(土) 13:30 - 16:30',
    capacity: 30,
    currentApplicants: 22,
    description: '住民の皆様から集まった100件以上の意見をもとに、実現に向けたアクションプランをチームで練り上げる共創型ワークショップです。高校生の参加大歓迎！',
    tags: ['行政共創', '高校生歓迎', 'アイデアソン', '参加証明書発行'],
    status: 'recruiting'
  },
  {
    id: 'rec-02',
    title: '白壁ナイトマルシェ「金魚あかりの夕べ」運営サポーター募集',
    category: 'ボランティア',
    organizer: '白壁まちなか賑わい創出プロジェクト',
    targetAudience: 'まちづくり・イベント企画に関心のある方（年齢不問）',
    location: '白壁の町並み（やない西蔵周辺）',
    date: '2026年10月3日(土) 16:00 - 21:00',
    capacity: 15,
    currentApplicants: 11,
    description: '金魚ちょうちんの点灯補助、地元飲食ブースの設営、来場者アンケートの実施などを手伝っていただけるサポーターを募集します。',
    tags: ['イベント運営', '地域交流', '軽食支給', 'ボランティア'],
    status: 'recruiting'
  },
  {
    id: 'rec-03',
    title: '古民家DIYリノベーション「まちのリビング作り」第1期クルー',
    category: '実証実験・DIY',
    organizer: '柳井古民家再生ラボ',
    targetAudience: 'DIY、デザイン、建築、コミュニティ運営に関心がある方',
    location: '柳井市古市町旧商家',
    date: '2026年9月26日(土)〜27日(日)',
    capacity: 10,
    currentApplicants: 8,
    description: '空き家となった町屋の床張りや漆喰塗り、木製家具の制作をプロの建築家と一緒に体験しながら、みんなのリビングスペースを作ります。',
    tags: ['古民家再生', 'DIY体験', '居場所づくり', '木工・漆喰'],
    status: 'recruiting'
  }
];

export const INITIAL_WORKSPACE_TASKS: WorkspaceTask[] = [
  {
    id: 'task-101',
    title: '白壁夜間ライトアップの実証実験計画書策定（安全基準・電力確保）',
    category: '施策化推進',
    assignee: '地域づくり推進課（山田主査）',
    dueDate: '2026-09-05',
    priority: 'high',
    stage: 'trial_experiment',
    notes: '警察署との道路使用協議および消防署への事前確認を実施中。',
    linkedSubmissionId: 'sub-001'
  },
  {
    id: 'task-102',
    title: 'JR柳井駅前シェアサイクルポート設置場所の現地測量と協定協議',
    category: '交通インフラ',
    assignee: '都市計画課（河野係長）',
    dueDate: '2026-09-18',
    priority: 'high',
    stage: 'plan_reflected',
    notes: 'JR西日本および事業者との基本覚書締結に向けた最終調整。',
    linkedSubmissionId: 'sub-002'
  },
  {
    id: 'task-103',
    title: '高校生XR金魚ちょうちんプロジェクトの技術検証ミーティング',
    category: 'DX・教育連携',
    assignee: '柳井高校・山口大連携WG',
    dueDate: '2026-09-10',
    priority: 'medium',
    stage: 'committee_review',
    notes: '柳井学園・柳井高校の代表生徒5名とオンライン事前打ち合わせ設定済み。',
    linkedSubmissionId: 'sub-005'
  },
  {
    id: 'task-104',
    title: '古民家親子コワーキングの事業採算モデル試算と補助金申請準備',
    category: '公民連携',
    assignee: '商工観光課・まちづくり会社',
    dueDate: '2026-09-30',
    priority: 'medium',
    stage: 'committee_review',
    notes: '国の地方創生拠点整備交付金の要件精査中。',
    linkedSubmissionId: 'sub-003'
  },
  {
    id: 'task-105',
    title: '柳井川親水マルシェの河川占用許可申請書作成',
    category: '水辺空間',
    assignee: '商業協同組合・建設課',
    dueDate: '2026-10-15',
    priority: 'low',
    stage: 'ideas_pool',
    notes: '山口県岩国土木建築事務所との事前相談日程を調整。',
    linkedSubmissionId: 'sub-004'
  }
];

export const INITIAL_POC_PROJECTS: PocProject[] = [
  {
    id: 'poc-01',
    title: '白壁夜間テラス＆金魚あかりの夕べ 実証実験',
    subtitle: '漆喰の町並み×和風ライトアップ×高校生カフェによるナイトタイムエコノミー検証',
    eyecatchImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
    category: 'ナイトタイム・賑わい創出',
    status: 'in_progress',
    workingGroupName: '白壁まちなか賑わい創出部会 (WG-1)',
    why: {
      vision: '白壁の町並みを「昼間に通り過ぎる観光地」から、「夜も市民と来訪者が温かな灯りの下で語らい、憩うリビング」へと進化させ、若者の定着と地域内消費の循環を生み出します。',
      backgroundChallenges: '現在の白壁エリアは17時以降に大半の店舗が閉まり、高校生の放課後の居場所や若者・観光客のナイトタイム消費の受け皿が皆無であるという課題を抱えています。'
    },
    what: {
      planDescription: '伝統的建造物群の景観に配慮した温白色LED行灯と金魚ちょうちんを点灯し、やない西蔵前広場に可動式木製テラス席と高校生・地元飲食店によるテイクアウト型カフェスタンドを期間限定で開設・実証運用します。',
      period: '2026年10月2日(金) 〜 2026年10月18日(日) 毎週金・土・日（17:00〜21:00）',
      location: '柳井市古市金屋 伝統的建造物群保存地区（やない西蔵・町並み資料館前広場）'
    },
    how: {
      hypothesis: '歴史的景観に溶け込む夜間演出と、高校生が企画した手頃なスイーツ・ドリンクメニューを提供することで、10代〜30代の平均滞在時間が従来の20分から60分以上へ3倍に伸長し、周辺飲食店への回遊率が25%以上向上する。',
      testMethods: [
        'AIカメラとWi-Fiパッカーセンサーによる時間帯別・属性別歩行者数の定点計測',
        '二次元コード経由のデジタルアンケート（滞在時間・満足度・消費額調査）',
        '近隣協力飲食店（5店舗）での連動クーポン回収数による回遊効果測定'
      ]
    },
    kpi: {
      quantitative: [
        '実証期間中の延べ来訪者数: 1,500名以上（うち若年層比率40%以上）',
        '来訪者満足度: 85%以上（「また夜に訪れたい」回答割合）',
        '周辺協力店舗への回遊売上増加率: 前年同期比 +30%'
      ],
      qualitative: [
        '高校生と地元商店街店主の自発的な協働関係・対話の醸成',
        '夜間の安全性・安心感に対する近隣住民の心理的評価の向上',
        '若者から「柳井の夜が好きになった」という誇り（シビックプライド）の実感'
      ],
      quantitativeMetrics: [
        {
          id: 'kpi-01-01',
          name: '実証期間中の延べ来訪者数',
          targetValue: 1500,
          currentValue: 1280,
          unit: '名',
          note: '金・土・日の中間集計。若年層比率は43.8%を記録'
        },
        {
          id: 'kpi-01-02',
          name: '来訪者満足度（アンケート高評価率）',
          targetValue: 85,
          currentValue: 92,
          unit: '%',
          note: '「また夜の白壁に来たい」と回答した割合'
        },
        {
          id: 'kpi-01-03',
          name: '周辺協力店舗への回遊売上増',
          targetValue: 30,
          currentValue: 26,
          unit: '%',
          note: 'クーポン利用実績ベースでの前年同期比増加率'
        }
      ],
      qualitativeMetrics: [
        {
          id: 'qkpi-01-01',
          name: '高校生と地元商店街店主の協働関係・対話の醸成',
          targetState: '週1回以上の合同企画ミーティングと店舗メニューコラボが自然発生する状態',
          currentStatus: 'achieved',
          progressPercent: 95,
          observation: '高校生発案の「甘露醤油みたらしパフェ」が商店街3店舗で共同販売されるなど連携が加速中。'
        },
        {
          id: 'qkpi-01-02',
          name: '夜間の安全性・安心感に対する近隣住民の心理的評価',
          targetState: '「夜間の照明・人通りで町並みが安心になった」との肯定的評価が過半数',
          currentStatus: 'in_progress',
          progressPercent: 78,
          observation: '行灯照明が好評。自治会からも「街灯の補完として通年のライトアップを希望」との声。'
        },
        {
          id: 'qkpi-01-03',
          name: '若者のシビックプライド（地域誇り）の実感醸成',
          targetState: '参加高校生・若者アンケートで「柳井に住み続けたい・関わりたい」スコア向上',
          currentStatus: 'exceeded',
          progressPercent: 100,
          observation: '運営クルーの高校生15名全員が「将来もまちづくりに関わりたい」と回答。'
        }
      ]
    },
    who: {
      leader: {
        name: '藤井 達也',
        title: 'WGリーダー / 柳井商業協同組合 青年部',
        organization: '白壁まちなか賑わい創出部会',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        comment: '高校生の柔軟な発想と伝統の町並みを掛け合わせ、柳井の夜の新しい定番カルチャーを共に作りましょう！'
      },
      stakeholders: [
        { name: '柳井学園・柳井高校 有志生徒', role: 'カフェメニュー企画・SNS発信', organization: '高校生クリエイティブチーム' },
        { name: '柳井市役所 地域づくり推進課', role: '道路占用許可・機材支援', organization: '行政推進チーム' },
        { name: '白壁まちなみ保存会', role: '景観保全アドバイス・歴史解説', organization: '地域住民組織' }
      ],
      partnerOrganizations: ['柳井商工会議所', '柳井観光コンベンション協会', '山口県立柳井高等学校']
    },
    nextStep: {
      nextPhase: '令和9年度春からの週末常設ナイトテラス特区への制度化・定期マルシェへの移行',
      roadmap: [
        '2026年11月: 実証実験データ分析・市民報告会の開催',
        '2026年12月: 柳井市中心市街地活性化協議会への事業化提案・予算要求',
        '2027年4月: 民間主体（まちづくり会社）による常設運営スキームの立ち上げ'
      ]
    },
    recruitment: {
      isRecruiting: true,
      targetRoles: ['カフェ運営サポーター', '夜間アンケート調査員', 'SNS動画クリエイター'],
      capacity: 15,
      currentApplicants: 11
    },
    report: {
      id: 'report-poc-01',
      projectId: 'poc-01',
      projectTitle: '白壁夜間テラス＆金魚あかりの夕べ 実証実験',
      submittedAt: '2026-10-20',
      authorName: '藤井 達也',
      authorRole: 'WGリーダー',
      authorOrg: '白壁まちなか賑わい創出部会 (WG-1)',
      summary: {
        overallRating: 'great_success',
        oneLineSummary: '高校生企画カフェと歴史的行灯ライトアップの融合により、夜間滞在時間が3.2倍に伸長し周辺店舗への回遊売上も26%向上を達成。',
        actualPeriod: '2026年10月2日(金) 〜 2026年10月18日(日) 計9日間',
        actualLocation: '柳井市古市金屋 伝統的建造物群保存地区（やない西蔵・町並み資料館前広場）',
        participantCount: 1280,
        budgetUsed: '約480,000円（LED行灯リース・テラス什器・保険・アンケートシステム費）'
      },
      hypothesisResult: {
        originalHypothesis: '歴史的景観に溶け込む夜間演出と、高校生が企画した手頃なスイーツ・ドリンクメニューを提供することで、10代〜30代の平均滞在時間が従来の20分から60分以上へ3倍に伸長し、周辺飲食店への回遊率が25%以上向上する。',
        isVerified: 'verified',
        analysisDetails: 'AIカメラによる測位データ分析の結果、平均滞在時間は通常夜間の18分から64分（約3.5倍）に延伸。若年層比率は43.8%に達し、仮説どおり夜間滞在と回遊消費の喚起が強く実証された。',
        keyFindings: [
          '金魚ちょうちんの温白色ライトアップがSNSでの写真拡散を誘発し、市外（広島・岩国・周南）からの若者流入が急増した。',
          '高校生が地元老舗醤油蔵と共同開発した限定スイーツが毎晩完売し、多世代交流の触媒となった。',
          '20時以降の周辺居酒屋・洋食店への送客効果が確認され、商店街側の夜間営業延長意欲が向上した。'
        ],
        unexpectedOutcomes: '金曜日の雨天時にテラス利用が落ち込んだものの、急遽やない西蔵の土間を屋内テラスとして開放したところ「雨の白壁が情緒的」と好評を博した。'
      },
      kpiResults: [
        {
          metricName: '実証期間中の延べ来訪者数',
          target: '1,500名以上',
          actual: '1,280名（達成率 85.3%）',
          achievementRate: 85.3,
          evaluationComment: '台風接近に伴う1日中止があったものの、開催日は連日目標を上回る盛況となった。'
        },
        {
          metricName: '来訪者満足度（また夜に来たい割合）',
          target: '85.0%以上',
          actual: '92.4%（達成率 108.7%）',
          achievementRate: 108.7,
          evaluationComment: '景観ライトアップの雰囲気とスタッフの温かい接客が高く評価された。'
        },
        {
          metricName: '周辺協力店舗への回遊売上増加率',
          target: '前年比 +30%',
          actual: '+26.0%（達成率 86.7%）',
          achievementRate: 86.7,
          evaluationComment: '回遊クーポン提示でワンドリンク等のサービスを実施した店舗で顕著な売上増を記録。'
        }
      ],
      feedback: {
        satisfactionScore: 92,
        positiveQuotes: [
          '高校生たちが生き生きとおもてなししてくれて、夜の柳井にこんな活気が戻るとは感動した。（50代・市内在住女性）',
          '金魚ちょうちんの灯りがエモくて写真映え最高。週末はいつもやってほしい！（高校2年生・市外通学）',
          '普段は18時に閉めるが、実証期間中は21時まで開けて売上が3割伸びた。常設化を望む。（商店街店主）'
        ],
        improvementPoints: [
          '週末ピーク時にベンチの数が足りず、座れない来場者がいたため増設が必要。',
          '夜間の近隣駐車場への誘導サインが暗くて分かりにくかった。'
        ]
      },
      challengesAndLessons: {
        operationalIssues: 'ボランティア高校生のシフト管理と、夜間の安全な帰宅手段（親の送迎やバス接続）の確保が運営上の重要事項となった。',
        institutionalBarriers: '道路占用許可（歩行者天国化）の申請手続きに約2ヶ月を要したため、年間の定期開催に向けた包括的特区申請が急務。',
        lessonsLearned: [
          '若者自身が企画から関わることで当事者意識が芽生え、自走的な広報力が発揮される。',
          '静寂な景観保全と適度な賑わいの音響バランス（BGM音量や営業時間）の事前合意が成功の鍵。'
        ]
      },
      nextRecommendations: {
        commercializationFeasibility: 'high',
        requiredSupport: '道路占用特区（歩行者利便増進道路・ほこみち等）の指定推進と、まちなか運営会社（まちづくり柳井）への什器・照明設備補助。',
        nextActionPlan: '令和9年4月からの「週末ナイトマルシェ＆テラス」の定期開催化（毎月第2・第4土曜）に向け、商店街振興組合および市都市計画課との実務協議を開始する。'
      },
      status: 'submitted'
    },
    likesCount: 184,
    updatedAt: '2026-08-20',
    tags: ['ナイトタイム', '高校生共創', '白壁景観', 'テラス実験']
  },
  {
    id: 'poc-02',
    title: '駅前〜白壁直結「スマート回遊モビリティ」実証運行',
    subtitle: '電動キックボード＆小型EVグリーンスローモビリティによる歩行者ネットワーク実験',
    eyecatchImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1000&auto=format&fit=crop&q=80',
    category: '交通・ウォーカブル',
    status: 'in_progress',
    workingGroupName: '次世代モビリティ・ウォーカブル推進部会 (WG-2)',
    why: {
      vision: 'JR柳井駅、柳井港フェリー乗り場、そして白壁の町並みがストレスフリーにつながり、車を持たない観光客や高齢者、高校生が心地よく街を巡れるウォーカブルタウンを創出します。',
      backgroundChallenges: '駅・港から白壁地区への移動手段が限られ、夏場の猛暑や坂道が観光客やシニアの回遊意欲を阻害している点です。'
    },
    what: {
      planDescription: '柳井駅前広場とやない西蔵、柳井港の3拠点に特設モビリティポートを配置し、アプリ不要のワンタッチ型電動アシスト自転車と時速20km未満のグリスロ無料周遊便を運行テストします。',
      period: '2026年9月19日(土) 〜 2026年10月4日(日)',
      location: 'JR柳井駅前広場 〜 柳井川沿いプロムナード 〜 白壁エリア 〜 柳井港'
    },
    how: {
      hypothesis: '小型低速モビリティの導入により、徒歩圏外とされていた柳井港〜白壁間の観光客流入が40%増加し、駅前商店街での立ち寄り件数が増加する。',
      testMethods: [
        'モビリティGPSログによる走行ルート・利用頻度ヒートマップの生成',
        '乗車後タブレットアンケート（使いやすさ・安全性・料金受容性）',
        '駅前・白壁商店街での立寄り消費額の比較調査'
      ]
    },
    kpi: {
      quantitative: [
        '実証期間中の総乗車回数: 800回以上',
        '走行事故・ヒヤリハットゼロ件（安全性の担保）',
        '駅前〜白壁相互回遊率: 35%以上向上'
      ],
      qualitative: [
        '「普段行かない裏路地やお店を発見できた」という利用者の心理的満足',
        '歩行者とモビリティの共存に対する商店街・住民の安心感の醸成'
      ],
      quantitativeMetrics: [
        {
          id: 'kpi-02-01',
          name: '実証期間中の総乗車回数',
          targetValue: 800,
          currentValue: 640,
          unit: '回',
          note: '週末を中心にグリスロが満席運行'
        },
        {
          id: 'kpi-02-02',
          name: '安全運行（事故・トラブルゼロ）',
          targetValue: 0,
          currentValue: 0,
          unit: '件',
          note: '誘導員の配置と低速制限（時速18km）で無事故継続中'
        },
        {
          id: 'kpi-02-03',
          name: '駅前〜白壁相互回遊率の向上',
          targetValue: 35,
          currentValue: 38,
          unit: '%',
          note: 'GPSログ分析で港からの直接流入と商店街立ち寄りが大幅増'
        }
      ],
      qualitativeMetrics: [
        {
          id: 'qkpi-02-01',
          name: '利用者の移動快適性と周遊満足度',
          targetState: '「移動そのものが観光アクティビティとして楽しかった」との高評価',
          currentStatus: 'achieved',
          progressPercent: 90,
          observation: '窓のないグリスロで風を感じながら川沿いを走る体験が家族連れ・高齢者に大好評。'
        },
        {
          id: 'qkpi-02-02',
          name: '歩行者空間との共存・安心感の確立',
          targetState: '住民・歩行者から危険等の苦情がなく、穏やかな運行が定着',
          currentStatus: 'in_progress',
          progressPercent: 82,
          observation: '路側帯の狭い区間で一部すれ違い時の配慮ルールを策定し運行中。'
        }
      ]
    },
    who: {
      leader: {
        name: '河野 誠司',
        title: 'WGリーダー / まちづくりプランナー',
        organization: '次世代モビリティ推進部会',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        comment: '歩く楽しさと乗る楽しさを両立させ、まちなか全体をひとつの大きなテーマパークのように巡れる未来を描きます。'
      },
      stakeholders: [
        { name: 'JR西日本 広島支社', role: '駅前広場利用調整', organization: '鉄道事業者' },
        { name: '防予フェリー / 柳井港関係者', role: '港湾部ポート連携', organization: '海運事業者' },
        { name: '柳井警察署 交通課', role: '安全走行ルート監修', organization: '治安・交通機関' }
      ],
      partnerOrganizations: ['柳井市都市計画課', 'モビリティサービス実証コンソーシアム']
    },
    nextStep: {
      nextPhase: '公募型プロポーザルによる本格シェアモビリティ事業者の選定・常設導入',
      roadmap: [
        '2026年10月末: 安全検証・採算性レポート取りまとめ',
        '2027年1月: 柳井市スマートシティ推進ビジョンへの正式採択'
      ]
    },
    recruitment: {
      isRecruiting: true,
      targetRoles: ['乗車案内サポーター', 'バッテリー交換クルー', '安全誘導スタッフ'],
      capacity: 10,
      currentApplicants: 7
    },
    likesCount: 142,
    updatedAt: '2026-08-19',
    tags: ['グリスロ', 'スマート交通', 'ウォーカブル', '駅前活性化']
  },
  {
    id: 'poc-03',
    title: '旧商家空き町屋「オープンリビング＆親子コワーキング」体験実証',
    subtitle: '伝統建築のDIYリノベーション×多世代交流・テレワーク拠点の実効性検証',
    eyecatchImage: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=1000&auto=format&fit=crop&q=80',
    category: '空き家再生・コミュニティ',
    status: 'planning',
    workingGroupName: '古民家再生・移住定住部会 (WG-3)',
    why: {
      vision: '歴史ある空き町屋を壊さず活かし、子育て世代のテレワーク拠点と高校生・シニアの集い場が自然に交わる「みんなのリビング」をつくります。',
      backgroundChallenges: '白壁地区内の空き町屋が増加する一方、改修費用のハードルや用途の不透明さから利活用が進まない課題を解決します。'
    },
    what: {
      planDescription: '古市町の一角にある築100年の旧商家を一部DIYで片付け・簡易改修し、1階をキッズスペース付きカフェ、2階を高速Wi-Fi完備のテレワーク空間として1ヶ月間トライアルオープンします。',
      period: '2026年10月10日(土) 〜 2026年11月8日(日)',
      location: '柳井市古市金屋 旧山崎家住宅（町並み中ほど）'
    },
    how: {
      hypothesis: '子育て見守りサービスとコワーキングを併設すれば、市外在住のフリーランスや子育て世代の週2回以上の継続利用が定着し、移住定住相談につながる。',
      testMethods: [
        'コワーキング利用会員登録数と滞在時間ログ',
        'DIY改修ワークショップ参加者によるコミュニティ形成度測定',
        '移住希望者・事業創業相談件数の集計'
      ]
    },
    kpi: {
      quantitative: [
        'トライアル期間中の利用登録者数: 200名',
        'DIYワークショップ参加者数: 延べ50名（高校生・親子）',
        '空き家活用ビジネスプランの創出: 3件以上'
      ],
      qualitative: [
        '「家でも職場でもない第3の心地よい居場所（サードプレイス）」としての実感',
        '町屋所有者に対する「有効活用できる」という安心感の提示'
      ],
      quantitativeMetrics: [
        {
          id: 'kpi-03-01',
          name: 'トライアル期間中の利用登録者数',
          targetValue: 200,
          currentValue: 45,
          unit: '名',
          note: '事前プレ登録受付中'
        },
        {
          id: 'kpi-03-02',
          name: 'DIYワークショップ参加者数',
          targetValue: 50,
          currentValue: 28,
          unit: '名',
          note: '第1期クルー募集にて28名が参加確定'
        },
        {
          id: 'kpi-03-03',
          name: '空き家活用ビジネスプラン創出',
          targetValue: 3,
          currentValue: 1,
          unit: '件',
          note: '地域特産品セレクトショップ構想が1件進行中'
        }
      ],
      qualitativeMetrics: [
        {
          id: 'qkpi-03-01',
          name: 'サードプレイスとしての心地よさの実感',
          targetState: '子育て世代が気兼ねなく仕事・対話できる安心空間の確立',
          currentStatus: 'in_progress',
          progressPercent: 50,
          observation: 'DIYワークショップを通じて参加者同士のコミュニティ形成が始まっている。'
        },
        {
          id: 'qkpi-03-02',
          name: '町屋所有者への活用安心感の提示',
          targetState: '「空き町屋でも賃貸・利活用が可能」というモデルケースの提示',
          currentStatus: 'not_started',
          progressPercent: 20,
          observation: 'プレオープン時の内覧会に近隣の空き家所有者3名が来訪予定。'
        }
      ]
    },
    who: {
      leader: {
        name: '佐藤 美咲',
        title: 'WGリーダー / 建築士・2児の母',
        organization: '柳井子育てまちづくりネット',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        comment: '子どもたちの笑顔と、働く大人たちの活気が満ちる場所を、みんなの手で育てていきましょう！'
      },
      stakeholders: [
        { name: '地元大工・左官職人有志', role: 'DIY改修技術指導', organization: '柳井建設業協会' },
        { name: '柳井高校・情報探究クラブ', role: 'IT環境構築・広報', organization: '高校生クリエイターズ' }
      ],
      partnerOrganizations: ['柳井市商工観光課', 'やまぐち暮らし東京支援センター']
    },
    nextStep: {
      nextPhase: '国の地方創生拠点整備交付金を活用した本改修および民間運営会社設立',
      roadmap: [
        '2026年11月: トライアル事業採算性シミュレーション策定',
        '2027年2月: 補助金申請・町屋所有者との長期賃貸借契約締結'
      ]
    },
    recruitment: {
      isRecruiting: true,
      targetRoles: ['DIYリノベクルー', '見守りキッズサポーター', 'Web広報担当'],
      capacity: 12,
      currentApplicants: 9
    },
    likesCount: 167,
    updatedAt: '2026-08-21',
    tags: ['古民家再生', '子育て支援', 'テレワーク', 'DIY']
  }
];

export const INITIAL_CMS_ARTICLES: CMSArticle[] = [

  {
    id: 'cms-001',
    title: '【速報】住民意見120件を突破！「2軸マトリックス分析結果」を公開しました',
    category: 'committee_report',
    summary: '第2回まちなか夢プラン策定委員会にて、市民の皆様から寄せられたアイデアの「実現可能性」×「期待度」の分析結果を審議しました。',
    content: `柳井市中心市街地活性化基本計画（まちなか夢プラン）の策定に向け、本プラットフォーム上で実施している市民アイデア募集において、投稿数が120件、投票数が1,200票を突破いたしました。\n\n高校生による「白壁ライトアップカフェ」や、子育て世代からの「古民家コワーキング」など、具体的な提案が多数寄せられています。\n\n委員会では、毎晩午前3時に集計された最新データをもとに、即時実行可能な「クイックウィン施策」を4件選定し、令和8年秋より実証実験を開始することを決定しました。`,
    author: '柳井市役所 地域づくり推進課',
    publishedAt: '2026-08-20 17:00',
    isPublished: true
  },
  {
    id: 'cms-002',
    title: '9月12日(土)開催「第3回 まちなか未来共創ワークショップ」参加者募集中',
    category: 'workshop_info',
    summary: '柳井市文化福祉会館にて、高校生と市民、専門家が一同に会するアイデア検討ワークショップを開催します。',
    content: `市民の皆様の「こんな街にしたい」という声を、具体的な事業計画へとブラッシュアップする共創ワークショップを開催します。\n\n当日は、GISマップにプロットされた意見を眺めながら、グループワーク形式で柳井駅前・白壁エリアの未来予想図を描きます。お気軽にご参加ください。`,
    author: 'まちなか夢プラン策定事務局',
    publishedAt: '2026-08-19 10:00',
    isPublished: true
  }
];

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  batchExecutionTime: '03:00',
  reflectionMode: 'manual',
  lastAnalysisTimestamp: '2026-08-21 03:00:12',
  independentMode: true,
  spreadSheetSynced: true,
  spreadSheetId: '1YnAI-MachiNaka-DreamPlan-2026-DataStore',
  sectionVisibility: {
    workshopPopup: true,
    mapSection: true,
    visionVoteSection: true,
    recruitmentSection: true,
    matrixAnalyticsSection: true,
    progressTimeline: true
  },
  frontendSectionToggles: {
    about: true,             // 柳井市まちなかまちづくりプロジェクトとは
    projects: true,          // プロジェクト
    vision: true,            // ビジョン投票
    recruitment: true,       // 要員募集
    submit_idea: true,       // 意見投稿
    citizen_dashboard: true  // ダッシュボード
  }
};

export const FREQUENT_KEYWORDS = [
  { text: '白壁の町並み', count: 86, weight: 1.0, category: '景観・文化' },
  { text: '高校生・若者', count: 74, weight: 0.9, category: '教育・次世代' },
  { text: '金魚ちょうちん', count: 68, weight: 0.85, category: '伝統工芸' },
  { text: '柳井駅前', count: 59, weight: 0.8, category: '交通・拠点' },
  { text: '古民家カフェ', count: 52, weight: 0.75, category: '商業・飲食' },
  { text: '夜間ライトアップ', count: 47, weight: 0.7, category: 'ナイトタイム' },
  { text: '子育てコワーキング', count: 41, weight: 0.65, category: '暮らし・支援' },
  { text: 'シェアサイクル', count: 38, weight: 0.6, category: 'モビリティ' },
  { text: '柳井川マルシェ', count: 35, weight: 0.58, category: '水辺賑わい' },
  { text: '甘露醤油スイーツ', count: 31, weight: 0.52, category: '特産品' },
  { text: 'バリアフリー歩道', count: 28, weight: 0.48, category: '福祉・安心' },
  { text: 'デジタルAR体験', count: 24, weight: 0.42, category: 'DX観光' }
];

// ==========================================
// 1. ロードマップ・ガントチャート データ（令和8〜9年度）
// ==========================================
export const INITIAL_ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: 'road-01',
    title: '白壁夜間テラス＆行灯ライトアップ社会実験',
    category: 'ナイトタイム・賑わい',
    workingGroup: 'WG-1 白壁賑わい創出部会',
    startDate: '2026-05-01',
    endDate: '2026-10-31',
    quarter: '2026_Q3',
    progress: 75,
    status: 'in_progress',
    milestoneTitle: '10/2〜10/18 実証実験本番運用',
    assignee: '藤井達也 (商業協同組合) / 市民WG',
    description: '歴史的景観行灯照明の調達・高校生カフェメニュー開発・安全誘導計画の策定。'
  },
  {
    id: 'road-02',
    title: '高校生サードプレイス・空き店舗活用リノベーション',
    category: '教育・次世代',
    workingGroup: 'WG-2 若者・教育探究部会',
    startDate: '2026-06-15',
    endDate: '2026-12-25',
    quarter: '2026_Q4',
    progress: 50,
    status: 'in_progress',
    milestoneTitle: '11/15 内装DIYワークショップ',
    assignee: '柳井学園・柳井高 有志 / 地域づくり課',
    description: '旧商家跡の物件オーナー協定締結、学生向けレイアウト設計、什器調達。'
  },
  {
    id: 'road-03',
    title: 'JR柳井駅前〜白壁シェアモビリティ（e-Bike/キックボード）実証',
    category: '交通・ウォーカブル',
    workingGroup: 'WG-3 スマート交通部会',
    startDate: '2026-08-01',
    endDate: '2027-02-28',
    quarter: '2026_Q4',
    progress: 30,
    status: 'planned',
    milestoneTitle: '12/1 モビリティHUB仮設置・試乗会',
    assignee: '都市計画課 / JR西日本・事業者',
    description: '駅前広場・白壁西蔵前・柳井港へのポート設置申請と安全利用ガイドライン作成。'
  },
  {
    id: 'road-04',
    title: '柳井川水辺プロムナード・サンデー親水マルシェ',
    category: '水辺空間・飲食',
    workingGroup: 'WG-4 水辺・マルシェ推進部会',
    startDate: '2026-07-01',
    endDate: '2026-11-30',
    quarter: '2026_Q3',
    progress: 60,
    status: 'in_progress',
    milestoneTitle: '9/20 第1回 柳井川リバーサイドマルシェ',
    assignee: '商業協同組合 / 観光コンベンション協会',
    description: '河川占用ミズベリング協議完了、地元出店者12店舗の募集と衛生基準確認。'
  },
  {
    id: 'road-05',
    title: '「柳井市まちなか未来ビジョン＆基本構想」答申・市議会報告',
    category: '計画策定・制度化',
    workingGroup: '全体統括・行政調整会議',
    startDate: '2026-10-01',
    endDate: '2027-03-31',
    quarter: '2027_Q1',
    progress: 15,
    status: 'planned',
    milestoneTitle: '2027年3月 まちなか夢プラン市議会提出',
    assignee: '地域づくり推進課 / 都市計画アドバイザー',
    description: '各WGの社会実験データ、市民アンケート、KPI実績を総合した都市マスタープランへの正式反映。'
  },
  {
    id: 'road-06',
    title: '民間主導型「柳井まちなか共創まちづくり会社」設立準備',
    category: '持続可能スキーム',
    workingGroup: '民間事業者連携WG',
    startDate: '2027-01-10',
    endDate: '2027-06-30',
    quarter: '2027_Q2',
    progress: 0,
    status: 'planned',
    milestoneTitle: '2027年4月 まちづくり会社発足総会',
    assignee: '商工会議所青年部 / 地元事業者有志',
    description: '実証実験で成果のあった夜間事業・カフェ・マルシェを恒常的に運営する民間スキームの確立。'
  }
];

// ==========================================
// 2. チームカレンダー・日程イベント
// ==========================================
export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal-01',
    title: '第4回 まちなか共創ワーキンググループ全体定例会',
    date: '2026-08-28',
    time: '18:30 - 20:00',
    type: 'regular_meeting',
    location: '柳井市役所 3階 第1会議室 ＋ オンライン併用',
    isOnline: true,
    meetingUrl: 'https://meet.google.com/yna-mach-2026',
    organizer: '地域づくり推進課・全体事務局',
    attendeesCount: 26,
    description: '各WGの進捗共有（白壁夜市・高校生カフェ・モビリティ）、秋の実証実験スケジュールの最終確認。',
    agendaItems: [
      '1. 各ワーキンググループの進捗報告（各5分）',
      '2. 10月「白壁夜市・ライトアップ実験」の運営体制とボランティア配置',
      '3. 高校生探究チームによる中間企画プレゼンテーション',
      '4. 質疑応答と次回日程確認'
    ]
  },
  {
    id: 'cal-02',
    title: '白壁夜間ライトアップ 機材テスト＆現地夜間照度調査',
    date: '2026-09-04',
    time: '19:00 - 21:00',
    type: 'field_survey',
    location: 'やない西蔵前広場〜古市金屋通り',
    isOnline: false,
    organizer: 'WG-1 白壁賑わい創出部会',
    attendeesCount: 14,
    description: 'LED行灯と金魚ちょうちんの試験点灯を行い、周辺景観への影響、防犯照度、写真映えアングルを実地検証。',
    agendaItems: [
      '1. 西蔵前での行灯配置テスト',
      '2. スマホ撮影時の照度チェック',
      '3. 近隣自治会長への現地説明とご意見ヒアリング'
    ]
  },
  {
    id: 'cal-03',
    title: '高校生×地元商店主「学生カフェメニュー試食会＆企画会議」',
    date: '2026-09-12',
    time: '15:00 - 17:00',
    type: 'workshop',
    location: '古市金屋 むろや園地・町屋スペース',
    isOnline: false,
    organizer: 'WG-2 若者・教育探究部会',
    attendeesCount: 18,
    description: '柳井学園・柳井高の生徒が考案した「甘露醤油ソフト」「金魚ソーダ」の試作試食会および価格・オペレーション検討。',
    agendaItems: [
      '1. 試作メニュー4品の試食と採点',
      '2. 原価計算とテイクアウト容器の選定',
      '3. 当日のシフト作成と衛生講習'
    ]
  },
  {
    id: 'cal-04',
    title: '駅前シェアモビリティHUB 現地測量と安全走行ルート確認',
    date: '2026-09-18',
    time: '10:00 - 12:00',
    type: 'field_survey',
    location: 'JR柳井駅前広場〜白壁通りルート',
    isOnline: false,
    organizer: 'WG-3 スマート交通部会',
    attendeesCount: 8,
    description: '柳井駅前ロータリーでのポート設置可能スペースの測量と、白壁への推奨走行ルート（歩車分離区間）の安全確認。',
    agendaItems: [
      '1. 駅前広場ポート設置位置のマーキング',
      '2. 歩道幅員と段差の解消ポイント洗い出し',
      '3. 警察署・道路管理者との事前協議事項まとめ'
    ]
  },
  {
    id: 'cal-05',
    title: '白壁夜間テラス＆金魚あかりの夕べ 実証実験【初日オープン】',
    date: '2026-10-02',
    time: '17:00 - 21:00',
    type: 'poc_experiment',
    location: '白壁の町並み（やない西蔵周辺）',
    isOnline: false,
    organizer: 'まちなか共創ワーキンググループ全WG',
    attendeesCount: 30,
    description: 'いよいよ本番実証実験がスタート！テラス席、高校生カフェ、行灯点灯、来訪者アンケート調査を一斉実施。',
    agendaItems: [
      '1. 16:30 スタッフ全体ミーティング・点灯式',
      '2. 17:00 オープン（カフェ・テラス営業開始）',
      '3. 21:00 消灯・初日集計ミーティング'
    ]
  }
];

// ==========================================
// 3. チームチャット＆オンライン会議（チャンネル・メッセージ）
// ==========================================
export const INITIAL_CHAT_CHANNELS: ChatChannel[] = [
  { id: 'ch-general', name: '全体連絡・定例報告', description: 'メンバー全員への重要連絡、定例会のアジェンダや議事録共有' },
  { id: 'ch-shirakabe', name: '白壁夜市・ライトアップ', description: 'WG-1：夜間照明演出、カフェ運営、近隣調整に関する相談' },
  { id: 'ch-youth', name: '高校生探究・サードプレイス', description: 'WG-2：柳井学園・柳井高の探究学習、空き店舗リノベ企画' },
  { id: 'ch-mobility', name: '駅前モビリティ・歩行空間', description: 'WG-3：駅前広場、シェアサイクル、回遊性向上に関する意見交換' },
  { id: 'ch-marche', name: '柳井川マルシェ・親水空間', description: 'WG-4：水辺テラス、出店者募集、ミズベリング協議' },
  { id: 'ch-feedback', name: '市民意見・アイデア分析', description: '市民から投稿されたアイデアやアンケート結果へのリアクション' }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-01',
    channelId: 'ch-general',
    authorId: 'mem-01',
    authorName: '地域づくり推進課 事務局 (川口)',
    authorRole: '行政事務局',
    authorOrg: '柳井市役所',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    content: 'メンバーの皆様、お疲れ様です！次回「第4回 まちなか共創WG定例会」は8/28(金) 18:30〜市役所3階およびオンライン併用で開催します。10月実証実験のシフト表を共有資料タブにアップロードしましたのでご確認をお願いします。',
    createdAt: '2026-08-22 11:30',
    meetingLink: {
      title: '第4回 定例ミーティング（ブラウザ直接参加可能）',
      url: 'https://meet.google.com/yna-mach-2026',
      startsAt: '2026-08-28 18:30'
    },
    reactions: [
      { emoji: '👍', count: 12, users: ['藤井達也', '佐藤美咲', '田中健一', '高校生代表'] },
      { emoji: '👏', count: 6, users: ['村上浩二', '中村達也'] }
    ]
  },
  {
    id: 'msg-02',
    channelId: 'ch-shirakabe',
    authorId: 'mem-02',
    authorName: '藤井 達也',
    authorRole: 'WG-1 リーダー',
    authorOrg: '柳井商業協同組合 青年部',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    content: 'LED和風行灯のサンプル品が3基届きました！今夜19時にやない西蔵前にてテスト点灯してみます。お時間ある方はぜひ見に来てください。写真も後ほどこちらにアップします。',
    createdAt: '2026-08-22 13:15',
    reactions: [
      { emoji: '💡', count: 8, users: ['地域づくり推進課', '白壁まちなみ保存会'] },
      { emoji: '🔥', count: 5, users: ['柳井学園生'] }
    ]
  },
  {
    id: 'msg-03',
    channelId: 'ch-youth',
    authorId: 'mem-03',
    authorName: '柳井学園・高校生探究チーム (高橋)',
    authorRole: 'WG-2 サブリーダー',
    authorOrg: '柳井学園高等学校',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    content: '商店街の和菓子店「ひがしや」さんと共同開発している「金魚ちょうちん白玉サンデー」の試作が完成しました！テイクアウトカップのデザインも柳井高校の美術部とコラボして制作中です。9/12の試食会でぜひご意見ください！',
    createdAt: '2026-08-22 14:40',
    reactions: [
      { emoji: '❤️', count: 15, users: ['佐藤美咲', '川口事務局', '藤井達也'] },
      { emoji: '😋', count: 9, users: ['村上浩二', '松田トシ子'] }
    ]
  },
  {
    id: 'msg-04',
    channelId: 'ch-mobility',
    authorId: 'mem-04',
    authorName: '都市計画課 (松本)',
    authorRole: 'モビリティ担当',
    authorOrg: '柳井市役所',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    content: 'JR西日本様およびシェアサイクル事業者との現地協議を行いました。柳井駅北口広場の観光案内所横に電動アシスト自転車8台分の仮設ポートを設置できる見込みです。12月プレ運用に向け調整を加速します。',
    createdAt: '2026-08-22 15:10',
    reactions: [
      { emoji: '🚲', count: 11, users: ['田中健一', '中村達也'] }
    ]
  }
];

// ==========================================
// 4. 30名メンバー名簿・プロジェクト体制（行政・民間・学生・市民・専門家）
// ==========================================
export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  // 行政・事務局 (6名)
  {
    id: 'mem-01',
    name: '川口 浩平',
    role: '事務局長 / 地域づくり推進課 課長補佐',
    userRole: 'admin',
    organization: '柳井市役所 地域づくり推進課',
    departmentCategory: 'city_gov',
    email: 'k-kawaguchi@city.yanai.yamaguchi.jp',
    phone: '0820-22-2111 (内線321)',
    assignedWgs: ['全体統括', 'WG-1 白壁賑わい', '予算・制度化'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    bio: '柳井生まれ柳井育ち。市民の皆さんと一緒に対話を重ね、実現力ある計画を作ります！'
  },
  {
    id: 'mem-02',
    name: '松本 陽介',
    role: '都市計画・ウォーカブル推進担当',
    userRole: 'admin',
    organization: '柳井市役所 都市計画課',
    departmentCategory: 'city_gov',
    email: 'y-matsumoto@city.yanai.yamaguchi.jp',
    phone: '0820-22-2111 (内線342)',
    assignedWgs: ['WG-3 スマート交通', '駅前広場再整備'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    bio: '駅前から白壁までの歩行空間とモビリティの接続を担当しています。'
  },
  {
    id: 'mem-03',
    name: '井上 真由美',
    role: '観光振興・インバウンド担当',
    userRole: 'recruiter',
    organization: '柳井市役所 商工観光課',
    departmentCategory: 'city_gov',
    email: 'm-inoue@city.yanai.yamaguchi.jp',
    assignedWgs: ['WG-1 白壁賑わい', 'WG-4 水辺マルシェ'],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    status: 'busy',
    bio: '金魚ちょうちん祭りや歴史遺産を活用した観光体験の磨き上げを担当。'
  },
  {
    id: 'mem-04',
    name: '山本 健太郎',
    role: '道路・河川占用管理係',
    userRole: 'workspace',
    organization: '柳井市役所 建設課',
    departmentCategory: 'city_gov',
    email: 'k-yamamoto@city.yanai.yamaguchi.jp',
    assignedWgs: ['WG-4 水辺マルシェ', '道路空間利活用'],
    status: 'offline',
    bio: '河川・道路のオープン化（ミズベリング・ウォーカブル推進）をバックアップ。'
  },
  {
    id: 'mem-05',
    name: '吉村 恵美',
    role: '広報・シティプロモーション係',
    userRole: 'admin',
    organization: '柳井市役所 総務課広報係',
    departmentCategory: 'city_gov',
    email: 'e-yoshimura@city.yanai.yamaguchi.jp',
    assignedWgs: ['市民周知・SNS発信', 'ワークショップ運営'],
    status: 'online',
    bio: '市民の皆さんの熱いアイデアを写真と動画で分かりやすく発信します。'
  },
  {
    id: 'mem-06',
    name: '大野 誠治',
    role: '教育委員会 生涯学習課',
    userRole: 'workspace',
    organization: '柳井市教育委員会',
    departmentCategory: 'city_gov',
    email: 's-ohno@city.yanai.yamaguchi.jp',
    assignedWgs: ['WG-2 若者・教育探究', '高校連携'],
    status: 'offline',
    bio: '市内の高校・中学校と連携した地域探究学習プログラムをコーディネート。'
  },

  // 民間事業者・商工会議所 (8名)
  {
    id: 'mem-07',
    name: '藤井 達也',
    role: 'WG-1 リーダー / 商業協同組合 青年部 会長',
    userRole: 'recruiter',
    organization: '柳井商業協同組合 / フジイ洋品店 店主',
    departmentCategory: 'business_chamber',
    email: 'fujii@yanai-shoko.com',
    phone: '0820-22-0055',
    assignedWgs: ['WG-1 白壁賑わい (リーダー)', 'ナイトテラス'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    bio: '白壁で生まれ育ちました。若者がワクワクして集まれる夜の風景を創りましょう！'
  },
  {
    id: 'mem-08',
    name: '村上 浩二',
    role: 'WG-4 リーダー / 水辺マルシェ実行委員長',
    userRole: 'workspace',
    organization: '柳井まちなかマルシェ実行委員会 / カフェ・ミズベ オーナー',
    departmentCategory: 'business_chamber',
    email: 'murakami@mizube-yanai.jp',
    assignedWgs: ['WG-4 水辺マルシェ (リーダー)', '地域食文化'],
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    bio: '柳井川沿いの風情ある水辺空間で毎月マルシェを開くのが長年の夢です。'
  },
  {
    id: 'mem-09',
    name: '木村 芳雄',
    role: '白壁まちなみ保存会 代表',
    organization: '古市金屋 伝統的建造物群保存地区 住民協議会',
    departmentCategory: 'business_chamber',
    email: 'kimura@shirakabe-hozon.org',
    assignedWgs: ['WG-1 白壁賑わい', '景観調和アドバイザー'],
    status: 'busy',
    bio: '歴史と伝統を守りつつ、新しい世代の活力を歓迎する町並みにしたい。'
  },
  {
    id: 'mem-10',
    name: '佐伯 順平',
    role: '柳井商工会議所 専務理事',
    organization: '柳井商工会議所',
    departmentCategory: 'business_chamber',
    email: 'saeki@yanai-cci.or.jp',
    assignedWgs: ['民間活力導入', 'まちづくり会社準備'],
    status: 'online',
    bio: '地域経済の好循環と事業承継・新規出店を全力で支援します。'
  },
  {
    id: 'mem-11',
    name: '東 雅樹',
    role: '老舗菓子店 代表（甘露醤油スイーツ開発）',
    organization: 'ひがしや菓子舗',
    departmentCategory: 'business_chamber',
    email: 'higashi@kanro-sweets.jp',
    assignedWgs: ['WG-2 若者・教育探究', '特産品コラボ'],
    status: 'offline',
    bio: '高校生の斬新なアイデアを取り入れた新商品開発に挑戦中。'
  },
  {
    id: 'mem-12',
    name: '竹中 涼子',
    role: '柳井駅前通り商店街 振興組合理事',
    organization: '柳井駅前通り商店街',
    departmentCategory: 'business_chamber',
    email: 'takenaka@ekimae-yanai.com',
    assignedWgs: ['WG-3 スマート交通', '空き店舗対策'],
    status: 'online',
    bio: '駅前から白壁までの通りを明るく歩きやすいストリートにしたいです。'
  },
  {
    id: 'mem-13',
    name: '西田 敏郎',
    role: '金魚ちょうちん職人・伝承館代表',
    organization: 'やない西蔵 金魚ちょうちん工房',
    departmentCategory: 'business_chamber',
    email: 'nishida@kingyo-yanai.jp',
    assignedWgs: ['WG-1 白壁賑わい', '伝統工芸体験'],
    status: 'offline',
    bio: '金魚ちょうちんの伝統をデジタルや現代アートと融合させて後世へ。'
  },
  {
    id: 'mem-14',
    name: '原田 慎也',
    role: '柳井港観光フェリー連絡協議会',
    organization: '防予フェリー 営業企画部',
    departmentCategory: 'business_chamber',
    email: 'harada@boyo-ferry.co.jp',
    assignedWgs: ['WG-3 スマート交通', '広域観光連携'],
    status: 'busy',
    bio: '松山・四国からの来訪者を柳井まちなかへ誘客するモビリティを検討。'
  },

  // 高校生・大学生・若者教育 (6名)
  {
    id: 'mem-15',
    name: '高橋 葵',
    role: 'WG-2 サブリーダー / 柳井学園 地域創生コース代表',
    organization: '柳井学園高等学校 3年生',
    departmentCategory: 'youth_education',
    email: 'a-takahashi@student.yanaigakuen.ed.jp',
    assignedWgs: ['WG-2 若者・教育探究 (サブリーダー)', '学生カフェ'],
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    bio: '放課後にもっと立ち寄れる場所をつくりたい！同世代の声を届けます。'
  },
  {
    id: 'mem-16',
    name: '宮崎 翔太',
    role: '柳井高校 情報探究部 リーダー',
    organization: '山口県立柳井高等学校 2年生',
    departmentCategory: 'youth_education',
    email: 's-miyazaki@yanai-h.ysn21.jp',
    assignedWgs: ['WG-2 若者・教育探究', 'デジタル金魚AR'],
    status: 'online',
    bio: 'VR/AR技術を使って白壁の町並みを楽しくガイドするアプリを開発中。'
  },
  {
    id: 'mem-17',
    name: '白石 莉央',
    role: '柳井高校 生徒会長',
    organization: '山口県立柳井高等学校 2年生',
    departmentCategory: 'youth_education',
    email: 'r-shiraishi@yanai-h.ysn21.jp',
    assignedWgs: ['WG-2 若者・教育探究', '高校生アンケート調査'],
    status: 'offline',
    bio: '全校生徒を対象に「まちなかに欲しい機能」のアンケートを実施中。'
  },
  {
    id: 'mem-18',
    name: '野村 陸斗',
    role: '柳井学園 探究学習クリエイティブ班',
    organization: '柳井学園高等学校 2年生',
    departmentCategory: 'youth_education',
    email: 'r-nomura@student.yanaigakuen.ed.jp',
    assignedWgs: ['WG-1 白壁賑わい', 'SNSショート動画制作'],
    status: 'online',
    bio: 'TikTokやInstagramで柳井の魅力を全国の若者に届ける動画を作っています。'
  },
  {
    id: 'mem-19',
    name: '近藤 雄大',
    role: '大学生インターン（山口大学 人文学部）',
    organization: '山口大学 地域デザイン研究室',
    departmentCategory: 'youth_education',
    email: 'y-kondo@yamaguchi-u.ac.jp',
    assignedWgs: ['WG-2 若者・教育探究', 'GIS人流データ分析'],
    status: 'online',
    bio: '大学でまちづくりを専攻しています。人流データの可視化をサポート。'
  },
  {
    id: 'mem-20',
    name: '吉川 菜々美',
    role: '山口県立大学 文化創造学科 3年',
    organization: '山口県立大学',
    departmentCategory: 'youth_education',
    email: 'n-yoshikawa@ypu.jp',
    assignedWgs: ['WG-1 白壁賑わい', 'イベント空間装飾'],
    status: 'busy',
    bio: '伝統とモダンが調和する行灯やテラスのデザインを担当。'
  },

  // 市民ボランティア・子育て世代代表 (6名)
  {
    id: 'mem-21',
    name: '佐藤 美咲',
    role: '柳井子育てまちづくりネット 代表',
    organization: '柳井子育てサークル「おひさま」',
    departmentCategory: 'citizen_volunteer',
    email: 'misaki-s@yanai-kosodate.net',
    assignedWgs: ['子育てコワーキング', 'ファミリー向け回遊'],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    bio: 'ベビーカーでも歩きやすく、親子で気兼ねなく休める拠点を提案しています。'
  },
  {
    id: 'mem-22',
    name: '田中 健一',
    role: 'Uターン移住者 / リモートエンジニア',
    organization: '柳井ITワーカーズ・コミュニティ',
    departmentCategory: 'citizen_volunteer',
    email: 'k-tanaka@remote-yanai.dev',
    assignedWgs: ['WG-3 スマート交通', 'デジタル施策検討'],
    status: 'online',
    bio: '東京からUターンしました。デジタルと自然が共存する柳井の可能性を追求！'
  },
  {
    id: 'mem-23',
    name: '松田 トシ子',
    role: '柳井地区民生委員・シニアクラブ代表',
    organization: '柳井市シニア連合会',
    departmentCategory: 'citizen_volunteer',
    email: 't-matsuda@senior-yanai.or.jp',
    assignedWgs: ['バリアフリー歩行空間', '高齢者安心見守り'],
    status: 'offline',
    bio: 'お年寄りも安心して買い物や散歩ができる道づくりをお願いしています。'
  },
  {
    id: 'mem-24',
    name: '中村 達也',
    role: '柳井市観光ボランティアガイドの会',
    organization: '柳井市観光ボランティアガイド',
    departmentCategory: 'citizen_volunteer',
    email: 'nakamura@yanai-guide.jp',
    assignedWgs: ['歴史遺産案内', '白壁ウォーキングツアー'],
    status: 'busy',
    bio: '年間1,000名以上の観光客をご案内しています。現場の生の声をお伝えします。'
  },
  {
    id: 'mem-25',
    name: '小林 裕子',
    role: '柳井国際交流協会 運営委員',
    organization: '柳井市国際交流ラウンジ',
    departmentCategory: 'citizen_volunteer',
    email: 'yuko-k@yanai-inter.org',
    assignedWgs: ['多言語サイン', 'インバウンド受け入れ'],
    status: 'offline',
    bio: '外国人居住者や観光客が分かりやすい多言語ピクトグラムを整備したいです。'
  },
  {
    id: 'mem-26',
    name: '阿部 康弘',
    role: '柳井まちなかサイクリング同好会 代表',
    organization: '周防大島・柳井サイクルコネクト',
    departmentCategory: 'citizen_volunteer',
    email: 'abe@yanai-cycle.club',
    assignedWgs: ['WG-3 スマート交通', 'サイクリスト拠点'],
    status: 'online',
    bio: '瀬戸内の絶景と白壁をつなぐサイクリングツーリズムの推進を担当。'
  },

  // 専門家・アドバイザー (4名)
  {
    id: 'mem-27',
    name: '神田 浩一郎 教授',
    role: '都市計画・プレイスメイキング専門アドバイザー',
    organization: '広島大学 大学院 都市計画研究室',
    departmentCategory: 'expert_advisor',
    email: 'k-kanda@hiroshima-u.ac.jp',
    assignedWgs: ['全体構想アドバイザー', '社会実験KPI評価'],
    status: 'busy',
    bio: '全国のウォーカブルシティ政策や官民連携まちづくりを助言。'
  },
  {
    id: 'mem-28',
    name: '長谷川 恵',
    role: '古民家再生・建築デザイナー',
    organization: '地域建築デザイン工房',
    departmentCategory: 'expert_advisor',
    email: 'm-hasegawa@studio-arch.jp',
    assignedWgs: ['WG-2 空き店舗リノベ', '景観デザイン'],
    status: 'online',
    bio: '伝統的な木造町家を現代の多様な用途に再構築する設計を支援。'
  },
  {
    id: 'mem-29',
    name: '水野 翔平',
    role: '公共空間利活用（ミズベリング・パークPFI）プランナー',
    organization: 'パブリックスペース研究所',
    departmentCategory: 'expert_advisor',
    email: 's-mizuno@public-space.jp',
    assignedWgs: ['WG-4 水辺マルシェ', '河川占用制度設計'],
    status: 'offline',
    bio: '柳井川の親水プロムナードを市民の憩いの場にする制度設計を担当。'
  },
  {
    id: 'mem-30',
    name: '坂本 典子',
    role: '地域ファシリテーター / 合意形成コーディネーター',
    organization: 'コ・クリエーション地域ラボ',
    departmentCategory: 'expert_advisor',
    email: 'n-sakamoto@cocreation-lab.jp',
    assignedWgs: ['市民ワークショップ進行', '合意形成プロセス'],
    status: 'online',
    bio: '多様な世代の本音を引き出し、具体的アクションへ導くワークショップを設計。'
  }
];

// ==========================================
// 5. 共有資料・議事録ライブラリ
// ==========================================
export const INITIAL_SHARED_DOCS: SharedDoc[] = [
  {
    id: 'doc-01',
    title: '【議事録】第3回 まちなか共創ワーキンググループ定例会議事要旨',
    category: 'minutes',
    author: '地域づくり推進課 事務局',
    updatedAt: '2026-08-15',
    fileType: 'pdf',
    url: '#',
    summary: '白壁夜市・高校生カフェ実証実験の実施要領および警察・消防との事前協議結果のまとめ。',
    fileSize: '1.8 MB'
  },
  {
    id: 'doc-02',
    title: '【基本構想スライド】柳井市まちなか未来共創ビジョン＆実施ロードマップ',
    category: 'presentation',
    author: '全体事務局・都市計画アドバイザー',
    updatedAt: '2026-08-20',
    fileType: 'slides',
    url: 'https://docs.google.com/presentation/d/1JtYlNLeZBxkl16lKsjFqQCcO7VNyUOnQDW_-_jE-q18/edit?usp=sharing',
    summary: '市民意見・高校生提案を取り入れた柳井駅前〜白壁エリアの一体再生グランドデザイン（全32スライド）。',
    fileSize: '8.4 MB'
  },
  {
    id: 'doc-03',
    title: '【マニュアル】白壁夜間テラス＆行灯ライトアップ 社会実験 運営マニュアル',
    category: 'guideline',
    author: 'WG-1 白壁賑わい創出部会',
    updatedAt: '2026-08-18',
    fileType: 'doc',
    url: '#',
    summary: 'スタッフ配置、安全管理、行灯点灯手順、アンケート収集フロー、緊急時連絡網を網羅。',
    fileSize: '2.4 MB'
  },
  {
    id: 'doc-04',
    title: '【調査票】市民・来訪者向け「夜間白壁エリア滞在＆満足度」アンケート設計書',
    category: 'survey',
    author: '山口大学 地域デザイン研究室',
    updatedAt: '2026-08-10',
    fileType: 'sheet',
    url: '#',
    summary: '二次元コード回答用Googleフォーム連携設問項目、属性別クロス集計用テンプレート。',
    fileSize: '950 KB'
  },
  {
    id: 'doc-05',
    title: '【メンバーワークスペース構想】30人共創プラットフォーム機能仕様書',
    category: 'presentation',
    author: 'プロジェクトマネジメント推進チーム',
    updatedAt: '2026-08-21',
    fileType: 'slides',
    url: 'https://docs.google.com/presentation/d/1OWBjosnsvAhLph7RR4iB76f0E5Bk3a0vGY-0wMs-RcY/edit?usp=sharing',
    summary: 'Googleアカウント非保有者も含めた全メンバーが利用できるカンバン・ガント・カレンダー・チャット仕様。',
    fileSize: '4.6 MB'
  }
];

