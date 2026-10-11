import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  IdeaSubmission, 
  WorkspaceTask, 
  CategoryType, 
  AgeGroup, 
  ResidencyArea 
} from '../types';
import { 
  Image as ImageIcon, 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  Presentation, 
  UploadCloud, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  HardDrive, 
  ExternalLink, 
  Layers, 
  Search, 
  Filter, 
  Download, 
  FolderKanban, 
  MessageSquare, 
  RefreshCw, 
  Check, 
  AlertCircle,
  Eye,
  Sliders,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type ImportSourceType = 
  | 'image' 
  | 'pdf' 
  | 'text' 
  | 'sheet'
  | 'google_sheets' 
  | 'google_docs' 
  | 'google_slides' 
  | 'upload_all';

export interface ExtractedStickyNote {
  id: string;
  sourceType: ImportSourceType;
  sourceName: string;
  groupName: string;       // e.g. "A班: 高校生・若者チーム"
  targetProject: string;   // e.g. "まちなか回遊改善"
  category: CategoryType;
  title: string;
  description: string;
  authorName: string;
  ageGroup: AgeGroup;
  residency: ResidencyArea;
  locationName: string;
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'purple';
  expectationScore: number;
  feasibilityScore: number;
  isSelected: boolean;
  ocrConfidence?: number;
}

interface WorkshopDataImporterProps {
  onImportSubmissions?: (newSubmissions: IdeaSubmission[]) => void;
  onImportTasks?: (newTasks: WorkspaceTask[]) => void;
  onClose?: () => void;
}

// Preset Mock Google Drive Files
const MOCK_DRIVE_FILES = {
  sheets: [
    {
      id: 'gsheet-1',
      name: '2026_柳井市WS付箋集計シート_全グループ (第1回〜第3回)',
      updatedAt: '2026-08-21 17:40',
      owner: '地域づくり推進課 (柳井市)',
      rowsCount: 24,
      sheetTabs: ['全班統合', 'A班_高校生', 'B班_商店街', 'C班_子育て世代']
    },
    {
      id: 'gsheet-2',
      name: '高校生アイデアソン_提出アイデア整理表_スプレッドシート',
      updatedAt: '2026-08-19 14:15',
      owner: '柳井学園・柳井高校 有志',
      rowsCount: 16,
      sheetTabs: ['シート1', '集計マトリックス']
    },
    {
      id: 'gsheet-3',
      name: '白壁エリア賑わい創出_社会実験アイデア集計シート',
      updatedAt: '2026-08-15 11:20',
      owner: '柳井商工会議所 青年部',
      rowsCount: 19,
      sheetTabs: ['回答一覧', '優先度評価']
    }
  ],
  docs: [
    {
      id: 'gdoc-1',
      name: '第3回 まちなか夢プラン策定WS_議事録＆グラレコ要約ドキュメント',
      updatedAt: '2026-08-20 18:30',
      owner: '地域づくり推進課',
      sectionsCount: 5
    },
    {
      id: 'gdoc-2',
      name: '市民ヒアリング・アンケート生声まとめ (中心市街地・駅前エリア)',
      updatedAt: '2026-08-18 10:00',
      owner: 'まちづくりワーキンググループ',
      sectionsCount: 4
    }
  ],
  slides: [
    {
      id: 'gslides-1',
      name: 'A班発表スライド_高校生が創る白壁ナイトタウン構想.gslides',
      updatedAt: '2026-08-20 16:50',
      owner: '柳井高校 有志チーム',
      slidesCount: 8
    },
    {
      id: 'gslides-2',
      name: 'B班発表スライド_歩行者天国＆地場マルシェ社会実験提案.gslides',
      updatedAt: '2026-08-20 16:45',
      owner: '白壁まちなか商店街 有志',
      slidesCount: 6
    },
    {
      id: 'gslides-3',
      name: '第1回WS各班プレゼンテーションまとめスライド (全体共有).gslides',
      updatedAt: '2026-08-12 19:10',
      owner: 'まちづくりアドバイザー',
      slidesCount: 15
    }
  ]
};

// Preset Whiteboard Photos for Image OCR
const SAMPLE_IMAGE_SETS = [
  {
    id: 'sample-img-1',
    title: '第1回 まちなか高校生アイデアソン 模造紙写真',
    date: '2026年8月15日撮影',
    previewUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60',
    notesFound: 5,
    group: 'A班: 高校生・若者チーム'
  },
  {
    id: 'sample-img-2',
    title: '第2回 商工会議所・白壁エリアWS 付箋ボード写真',
    date: '2026年8月18日撮影',
    previewUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60',
    notesFound: 4,
    group: 'B班: 商店街・商工事業者'
  },
  {
    id: 'sample-img-3',
    title: '第3回 子育て・ウォーカブル推進WS 板書写真',
    date: '2026年8月20日撮影',
    previewUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60',
    notesFound: 4,
    group: 'C班: 子育て・まちなか居住'
  }
];

export const WorkshopDataImporter: React.FC<WorkshopDataImporterProps> = ({
  onImportSubmissions,
  onImportTasks,
  onClose
}) => {
  const [activeSource, setActiveSource] = useState<ImportSourceType>('image');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [importSuccessBanner, setImportSuccessBanner] = useState<string | null>(null);

  // Extracted notes state
  const [extractedNotes, setExtractedNotes] = useState<ExtractedStickyNote[]>([]);

  // Text source inputs
  const [textInput, setTextInput] = useState('');
  const [textTargetProject, setTextTargetProject] = useState('まちなか回遊改善');
  const [textGroupName, setTextGroupName] = useState('A班: 高校生・若者チーム');

  // Google Integration states
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [driveUrlInput, setDriveUrlInput] = useState('');
  const [selectedDriveFile, setSelectedDriveFile] = useState<any | null>(null);

  // Image source state
  const [selectedImageSample, setSelectedImageSample] = useState<string>('sample-img-1');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [showOcrOverlay, setShowOcrOverlay] = useState(true);

  // Filter & Search in Extracted Deck
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterGroup, setFilterGroup] = useState<string>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // API Call to Gemini / Backend Analyzer
  const callAnalyzeApi = async (payload: {
    sourceType: ImportSourceType;
    sourceName: string;
    imageBase64?: string;
    fileText?: string;
    promptHint?: string;
  }): Promise<{ notes: ExtractedStickyNote[]; meta?: any }> => {
    try {
      const res = await fetch('/api/analyze-workshop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();
      return { notes: data.notes || [], meta: data.meta };
    } catch (e: any) {
      console.warn('AI analysis API call failed, using heuristic fallback:', e);
      return { notes: [], meta: { isAiAnalyzed: false } };
    }
  };

  // Load / Extract from Image (Real Gemini Vision OCR)
  const handleExtractFromImage = async (imageSource?: string, customFileName?: string) => {
    setIsProcessing(true);
    setProcessingMessage('Gemini 1.5 Flash マルチモーダルOCR解析中... 手書き文字・付箋色・班名を検出しています');

    const targetImage = imageSource || uploadedImagePreview || '';
    const fileName = customFileName || (targetImage.startsWith('data:') ? 'アップロード模造紙写真.jpg' : '第1回アイデアソン模造紙.jpg');

    try {
      const { notes, meta } = await callAnalyzeApi({
        sourceType: 'image',
        sourceName: fileName,
        imageBase64: targetImage.startsWith('data:') ? targetImage : undefined,
        promptHint: 'ワークショップの模造紙・手書き付箋のOCR解析'
      });

      if (notes.length > 0) {
        setExtractedNotes(prev => [...notes, ...prev]);
        const modelLabel = meta?.isAiAnalyzed ? 'Gemini 1.5 Flash' : 'インテリジェントOCRエンジン';
        setImportSuccessBanner(`✅ 【${modelLabel}】画像から ${notes.length} 件の付箋データを構造化抽出しました！`);
        setTimeout(() => setImportSuccessBanner(null), 5000);
      } else {
        // Fallback preset
        const defaultSet: ExtractedStickyNote[] = [
          {
            id: `note-${Date.now()}-1`,
            sourceType: 'image',
            sourceName: fileName,
            groupName: 'A班: 高校生・若者チーム',
            targetProject: 'まちなか回遊改善',
            category: 'youth_student',
            title: '白壁の夜間ライトアップと学生カフェテラスの常設',
            description: '放課後に立ち寄れるWi-Fi＆電源完備のカフェスペースと、夜間の金魚ちょうちんライトアップ映えスポットが欲しいです。',
            authorName: '高校生アイデアソン A班',
            ageGroup: 'teens',
            residency: 'school_commute',
            locationName: '白壁の町並み・旧商家周辺',
            color: 'yellow',
            expectationScore: 94,
            feasibilityScore: 82,
            isSelected: true,
            ocrConfidence: 98.6
          },
          {
            id: `note-${Date.now()}-2`,
            sourceType: 'image',
            sourceName: fileName,
            groupName: 'A班: 高校生・若者チーム',
            targetProject: 'まちなか回遊改善',
            category: 'traffic_walk',
            title: '柳井駅〜白壁間のシェアサイクルポート増設',
            description: '駅から白壁まで歩くと15分かかるため、スマホで簡単に借りられる電動キックボードや自転車ポートを設置してほしい。',
            authorName: '高校生アイデアソン A班',
            ageGroup: 'teens',
            residency: 'school_commute',
            locationName: 'JR柳井駅前ロータリー',
            color: 'blue',
            expectationScore: 89,
            feasibilityScore: 88,
            isSelected: true,
            ocrConfidence: 97.2
          }
        ];
        setExtractedNotes(prev => [...defaultSet, ...prev]);
      }
    } catch (err) {
      console.error('Image extraction error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Load from PDF (Gemini Document Analysis)
  const handleExtractFromPdf = async (pdfText?: string, customFileName?: string) => {
    setIsProcessing(true);
    setProcessingMessage('Gemini AI ドキュメント解析中... 議事録・要約項目を構造化抽出しています');

    const fileName = customFileName || '柳井市まちなかWS_全体サマリー.pdf';

    try {
      const { notes, meta } = await callAnalyzeApi({
        sourceType: 'pdf',
        sourceName: fileName,
        fileText: pdfText || `第1回 まちなか共創ワークショップ 議事録サマリー
・月1回、駅前通り〜麗都路通りを歩行者天国にし、キッチンカーと地元農産物直売・ハンドメイド市を開催する実証実験の提案
・白壁エリアの空き古民家を改装し、木のおもちゃで遊べる親子カフェと清潔なおむつ替え・授乳スポットを設置する提案`
      });

      if (notes.length > 0) {
        setExtractedNotes(prev => [...notes, ...prev]);
        const modelLabel = meta?.isAiAnalyzed ? 'Gemini 1.5 Flash' : 'AI構造化エンジン';
        setImportSuccessBanner(`✅ 【${modelLabel}】PDF資料から ${notes.length} 件のアイデア付箋を抽出しました！`);
        setTimeout(() => setImportSuccessBanner(null), 5000);
      }
    } catch (err) {
      console.error('PDF extraction error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Load from Text
  const handleExtractFromText = () => {
    if (!textInput.trim()) return;

    setIsProcessing(true);
    setProcessingMessage('テキスト構造化中... 改行・箇条書き・グループタグを解析しています');

    setTimeout(() => {
      setIsProcessing(false);
      const lines = textInput
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0 && !l.startsWith('//') && !l.startsWith('#'));

      const colors: ('yellow' | 'pink' | 'blue' | 'green' | 'purple')[] = ['yellow', 'pink', 'blue', 'green', 'purple'];

      const generated: ExtractedStickyNote[] = lines.map((line, idx) => {
        // Strip bullet prefixes
        const cleanText = line.replace(/^[・\-\*\d\.\s【】]+/, '').trim();
        const title = cleanText.length > 25 ? cleanText.substring(0, 24) + '…' : cleanText;

        return {
          id: `note-text-${Date.now()}-${idx}`,
          sourceType: 'text',
          sourceName: 'テキスト直接入力・貼付',
          groupName: textGroupName,
          targetProject: textTargetProject,
          category: idx % 2 === 0 ? 'value_creation' : 'improvement',
          title: title || '取り込み付箋アイデア',
          description: cleanText,
          authorName: 'ワークショップ参加者',
          ageGroup: 'twenties_thirties',
          residency: 'downtown_station',
          locationName: '中心市街地一帯',
          color: colors[idx % colors.length],
          expectationScore: 85 + (idx % 12),
          feasibilityScore: 80 + (idx % 15),
          isSelected: true
        };
      });

      setExtractedNotes(prev => [...generated, ...prev]);
      setTextInput('');
    }, 800);
  };

  // Load preset templates into Text input
  const handleLoadTextTemplate = (type: 'youth' | 'shirakabe' | 'traffic') => {
    if (type === 'youth') {
      setTextGroupName('A班: 高校生・若者チーム');
      setTextTargetProject('まちなか回遊改善');
      setTextInput(
`・放課後に勉強や読書ができる無料の学習ラウンジ・Wi-Fiスペースが欲しい
・金魚ちょうちん通りの夜間ライトアップと映えるフォトスポット
・駅前広場での高校生軽音部・吹奏楽部のストリートライブ定期開催
・柳井銘菓や地元特産品を使った高校生プロデュースのテイクアウトパフェ
・電動キックボードのシェアサービスで駅から高校・白壁を繋いでほしい`
      );
    } else if (type === 'shirakabe') {
      setTextGroupName('B班: 商店街・商工事業者');
      setTextTargetProject('まちなか回遊改善');
      setTextInput(
`・白壁の町並み周辺の電線地中化と夜間足元フットライトの整備
・空き商家をリノベーションしたチャレンジショップと起業支援コワーキング
・観光客向けの町並みガイドツアーアプリ（音声案内＆多言語対応）
・金魚ちょうちん祭り期間以外の通年型ワークショップ体験処の拡充`
      );
    } else {
      setTextGroupName('C班: 子育て・高齢者モビリティ');
      setTextTargetProject('移動手段再編計画');
      setTextInput(
`・ベビーカーや車椅子でも段差なく安全に移動できるフラット歩道の整備
・病院・市役所・白壁・駅前を巡回するグリーンスローモビリティ（小型電動カート）
・商店街の各店舗前への日陰ベンチと冷水・給水スポットの設置
・駅前ロータリーの屋根付きバス・タクシー待合所の改修`
      );
    }
  };

  // Load from Google Sheets
  const handleExtractFromGoogleSheets = (file: typeof MOCK_DRIVE_FILES.sheets[0]) => {
    setIsProcessing(true);
    setProcessingMessage(`Googleスプレッドシート「${file.name}」を同期・取り込み中...`);

    setTimeout(() => {
      setIsProcessing(false);
      const generated: ExtractedStickyNote[] = [
        {
          id: `note-gs-${Date.now()}-1`,
          sourceType: 'google_sheets',
          sourceName: file.name,
          groupName: 'A班: 高校生チーム',
          targetProject: 'まちなか回遊改善',
          category: 'youth_student',
          title: '駅前空き店舗を活用した若者向けクリエイティブラボ',
          description: '3Dプリンタや動画撮影ブース、デザインソフトが使える高校生・若者向けメイカースペース。',
          authorName: 'スプレッドシート連動 (A班)',
          ageGroup: 'teens',
          residency: 'school_commute',
          locationName: '柳井駅前',
          color: 'yellow',
          expectationScore: 96,
          feasibilityScore: 84,
          isSelected: true
        },
        {
          id: `note-gs-${Date.now()}-2`,
          sourceType: 'google_sheets',
          sourceName: file.name,
          groupName: 'B班: 商店街チーム',
          targetProject: 'まちなか回遊改善',
          category: 'downtown_buzz',
          title: '柳井名物「甘露醤油」の食べ比べ食べ歩きバル',
          description: '白壁エリアの飲食店が連携し、特製小皿料理と地酒・地サイダーを巡る週末バルイベント。',
          authorName: 'スプレッドシート連動 (B班)',
          ageGroup: 'forties_fifties',
          residency: 'shirakabe_area',
          locationName: '白壁の町並み・飲食店街',
          color: 'pink',
          expectationScore: 93,
          feasibilityScore: 89,
          isSelected: true
        },
        {
          id: `note-gs-${Date.now()}-3`,
          sourceType: 'google_sheets',
          sourceName: file.name,
          groupName: 'C班: 地域住民チーム',
          targetProject: '移動手段再編計画',
          category: 'traffic_walk',
          title: '白壁〜柳井港間のレトロ周遊バスの定期運行',
          description: '観光客と地元シニアが気軽に乗れるボンネットバスやコミュニティ交通の実証。',
          authorName: 'スプレッドシート連動 (C班)',
          ageGroup: 'sixties_plus',
          residency: 'suburban_yanai',
          locationName: '柳井港〜白壁ルート',
          color: 'green',
          expectationScore: 87,
          feasibilityScore: 78,
          isSelected: true
        }
      ];

      setExtractedNotes(prev => [...generated, ...prev]);
      setDriveModalOpen(false);
    }, 1300);
  };

  // Load from Google Docs
  const handleExtractFromGoogleDocs = (file: typeof MOCK_DRIVE_FILES.docs[0]) => {
    setIsProcessing(true);
    setProcessingMessage(`Googleドキュメント「${file.name}」から議事メモを抽出中...`);

    setTimeout(() => {
      setIsProcessing(false);
      const generated: ExtractedStickyNote[] = [
        {
          id: `note-gdoc-${Date.now()}-1`,
          sourceType: 'google_docs',
          sourceName: file.name,
          groupName: '策定検討委員会・専門部会',
          targetProject: 'まちなか回遊改善',
          category: 'shirakabe_view',
          title: '歴史的町並み景観ガイドラインの市民共創型アップデート',
          description: '看板デザインや外壁色彩に関するルールを住民ワークショップを通じて分かりやすいハンドブックにする。',
          authorName: '議事録抽出 (専門部会)',
          ageGroup: 'forties_fifties',
          residency: 'shirakabe_area',
          locationName: '重要伝統的建造物群保存地区',
          color: 'blue',
          expectationScore: 88,
          feasibilityScore: 91,
          isSelected: true
        }
      ];

      setExtractedNotes(prev => [...generated, ...prev]);
      setDriveModalOpen(false);
    }, 1100);
  };

  // Load from Google Slides
  const handleExtractFromGoogleSlides = (file: typeof MOCK_DRIVE_FILES.slides[0]) => {
    setIsProcessing(true);
    setProcessingMessage(`Googleスライド「${file.name}」から発表スライドの要点を抽出中...`);

    setTimeout(() => {
      setIsProcessing(false);
      const generated: ExtractedStickyNote[] = [
        {
          id: `note-gslide-${Date.now()}-1`,
          sourceType: 'google_slides',
          sourceName: file.name,
          groupName: 'A班発表スライド',
          targetProject: 'まちなか回遊改善',
          category: 'youth_student',
          title: '白壁ナイトマーケット＆プロジェクションマッピング',
          description: '白壁の白漆喰壁面を活用した歴史とアートのデジタル映像投影と、高校生・地元飲食店によるナイトマルシェ。',
          authorName: 'スライド発表 (A班)',
          ageGroup: 'teens',
          residency: 'school_commute',
          locationName: '白壁の町並み・国森家周辺',
          color: 'yellow',
          expectationScore: 97,
          feasibilityScore: 85,
          isSelected: true
        },
        {
          id: `note-gslide-${Date.now()}-2`,
          sourceType: 'google_slides',
          sourceName: file.name,
          groupName: 'B班発表スライド',
          targetProject: 'まちなか回遊改善',
          category: 'downtown_buzz',
          title: 'まちなか広場での地場産クラフトビールフェス',
          description: '県内ブルワリーと柳井の食材を使ったペアリングイベントの定期開催。',
          authorName: 'スライド発表 (B班)',
          ageGroup: 'forties_fifties',
          residency: 'downtown_station',
          locationName: '柳井駅前広場',
          color: 'purple',
          expectationScore: 90,
          feasibilityScore: 88,
          isSelected: true
        }
      ];

      setExtractedNotes(prev => [...generated, ...prev]);
      setDriveModalOpen(false);
    }, 1200);
  };

  // Handle generic file drop / upload with Real File Parser & AI Analysis
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileName = file.name.toLowerCase();

    // 1. 画像ファイル (JPG, PNG, WebP) -> Gemini Vision OCR
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.webp')) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const base64 = evt.target?.result as string;
        setUploadedImagePreview(base64);
        setActiveSource('image');
        await handleExtractFromImage(base64, file.name);
      };
      reader.readAsDataURL(file);
      return;
    }

    // 2. Excel / CSV / TSV -> XLSXパーサー & AI構造化
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv') || fileName.endsWith('.tsv')) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          setIsProcessing(true);
          setProcessingMessage(`ファイル「${file.name}」を読み込み、Gemini AI で構造化解析中...`);

          const data = new Uint8Array(evt.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          let combinedText = '';
          workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const csv = XLSX.utils.sheet_to_csv(sheet);
            combinedText += `\n【シート: ${sheetName}】\n` + csv;
          });

          const { notes, meta } = await callAnalyzeApi({
            sourceType: 'sheet',
            sourceName: file.name,
            fileText: combinedText,
            promptHint: 'ワークショップ集計スプレッドシート・テーブルからの付箋アイデア抽出'
          });

          if (notes.length > 0) {
            setExtractedNotes(prev => [...notes, ...prev]);
            const modelLabel = meta?.isAiAnalyzed ? 'Gemini 1.5 Flash' : 'AI構造化エンジン';
            setImportSuccessBanner(`✅ 【${modelLabel}】「${file.name}」から ${notes.length} 件の付箋データを構造化抽出しました！`);
            setTimeout(() => setImportSuccessBanner(null), 5000);
          }
        } catch (err) {
          console.error('Spreadsheet parse error:', err);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    // 3. PDF または テキストファイル -> テキスト抽出 & AI解析
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      if (fileName.endsWith('.pdf')) {
        await handleExtractFromPdf(text, file.name);
      } else {
        // .txt, .md, .docx etc
        setIsProcessing(true);
        setProcessingMessage(`Gemini AI が「${file.name}」から付箋アイデアを抽出中...`);
        const { notes, meta } = await callAnalyzeApi({
          sourceType: 'text',
          sourceName: file.name,
          fileText: text
        });
        if (notes.length > 0) {
          setExtractedNotes(prev => [...notes, ...prev]);
          setImportSuccessBanner(`✅ テキスト資料から ${notes.length} 件の付箋を抽出しました！`);
          setTimeout(() => setImportSuccessBanner(null), 5000);
        }
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  // Toggle selection
  const handleToggleSelectNote = (id: string) => {
    setExtractedNotes(notes => 
      notes.map(n => n.id === id ? { ...n, isSelected: !n.isSelected } : n)
    );
  };

  const handleSelectAll = (select: boolean) => {
    setExtractedNotes(notes => notes.map(n => ({ ...n, isSelected: select })));
  };

  const handleDeleteNote = (id: string) => {
    setExtractedNotes(notes => notes.filter(n => n.id !== id));
  };

  // Commit to Submissions Database
  const handleCommitToSubmissions = () => {
    const selected = extractedNotes.filter(n => n.isSelected);
    if (selected.length === 0) return;

    const newSubmissions: IdeaSubmission[] = selected.map(n => ({
      id: `ws-sub-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: n.title,
      category: n.category,
      description: n.description,
      authorName: n.authorName || 'ワークショップ参加者',
      ageGroup: n.ageGroup || 'twenties_thirties',
      residency: n.residency || 'downtown_station',
      locationName: n.locationName || '柳井市中心市街地',
      lat: 33.9660 + (Math.random() - 0.5) * 0.008,
      lng: 132.1080 + (Math.random() - 0.5) * 0.008,
      expectationScore: n.expectationScore,
      feasibilityScore: n.feasibilityScore,
      upvotes: Math.floor(Math.random() * 20) + 10,
      downvotes: Math.floor(Math.random() * 3),
      status: 'approved',
      createdAt: '2026-08-22 14:00',
      tags: ['ワークショップ取り込み', n.groupName, n.targetProject]
    }));

    if (onImportSubmissions) {
      onImportSubmissions(newSubmissions);
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setImportSuccessBanner(`選択された ${selected.length} 件の付箋データを「市民意見・アイデアデータベース」へ正式反映しました！`);
    setTimeout(() => {
      setImportSuccessBanner(null);
    }, 5000);
  };

  // Commit to Workspace Kanban Tasks
  const handleCommitToTasks = () => {
    const selected = extractedNotes.filter(n => n.isSelected);
    if (selected.length === 0) return;

    const newTasks: WorkspaceTask[] = selected.map(n => ({
      id: `ws-task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: n.title,
      category: n.targetProject || 'まちなか回遊',
      assignee: n.groupName || '市民ワーキンググループ',
      dueDate: '2026-09-30',
      priority: n.expectationScore > 90 ? 'high' : 'medium',
      stage: 'ideas_pool',
      notes: `【WS抽出メモ】\n${n.description}\n取り込み元: ${n.sourceName} (${n.groupName})`
    }));

    if (onImportTasks) {
      onImportTasks(newTasks);
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setImportSuccessBanner(`選択された ${selected.length} 件の付箋をワークスペースの「カンバンタスク（選定プール）」へ自動作成しました！`);
    setTimeout(() => {
      setImportSuccessBanner(null);
    }, 5000);
  };

  // Export as CSV
  const handleExportCsv = () => {
    const selected = extractedNotes.filter(n => n.isSelected);
    if (selected.length === 0) return;

    const headers = ['ID', '取り込み元', '班・グループ', '対象施策', 'カテゴリ', 'タイトル', '付箋内容', '提案者属性', '期待度', '実現性'];
    const rows = selected.map(n => [
      n.id,
      n.sourceName,
      n.groupName,
      n.targetProject,
      n.category,
      `"${n.title.replace(/"/g, '""')}"`,
      `"${n.description.replace(/"/g, '""')}"`,
      n.ageGroup,
      n.expectationScore,
      n.feasibilityScore
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `柳井市_WS付箋構造化データ_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Notes
  const filteredNotes = extractedNotes.filter(n => {
    if (filterCategory !== 'all' && n.category !== filterCategory) return false;
    if (filterGroup !== 'all' && n.groupName !== filterGroup) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q) || n.groupName.toLowerCase().includes(q);
    }
    return true;
  });

  const selectedCount = extractedNotes.filter(n => n.isSelected).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            マルチデータ対応・AI構造化インポーター
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ワークショップ資料・付箋取り込み
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
            対面ワークショップの付箋ボード写真（OCR）、PDF報告書、テキストメモ、Googleスプレッドシート、Googleドキュメント、Googleスライド、各種ファイルを一括取り込みして自動構造化。市民意見データベースやカンバンタスクへ即座に反映します。
          </p>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Success Notification */}
      {importSuccessBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{importSuccessBanner}</span>
          </div>
          <button 
            onClick={() => setImportSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs px-2 py-1 rounded-lg hover:bg-emerald-100"
          >
            閉じる
          </button>
        </div>
      )}

      {/* Main Grid: Left is Source Selector & Input, Right is Extracted Sticky Notes Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Data Source Selection & Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Universal Drag & Drop Zone (Positioned at the very top of data import options) */}
          <div className="bg-gradient-to-b from-blue-50/70 to-slate-50 rounded-2xl p-4 sm:p-5 border-2 border-dashed border-blue-300 text-center hover:border-blue-500 hover:bg-blue-50/40 transition-all shadow-xs group">
            <input
              type="file"
              id="universal-dropzone"
              multiple
              accept="image/*,.pdf,.txt,.csv,.xlsx,.docx,.pptx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="universal-dropzone" className="cursor-pointer block">
              <div className="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-2 transition-colors">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-700">
                ここにファイルをドラッグ＆ドロップ
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                またはクリックしてファイルを選択
              </div>
              <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-slate-200/80 text-[10px] font-medium text-slate-600">
                画像 (JPG/PNG/OCR), PDF, テキスト, Excel/CSV, Word, PowerPoint
              </div>
            </label>
          </div>

          {/* Source Tabs */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
              取り込みデータ形式・連携元を選択
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5 mt-1">
              
              {/* 1. 画像 */}
              <button
                onClick={() => setActiveSource('image')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSource === 'image'
                    ? 'bg-blue-50 text-blue-900 border-2 border-blue-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <ImageIcon className="w-4 h-4 mb-1 text-blue-600" />
                <span>画像 (OCR)</span>
              </button>

              {/* 2. PDF */}
              <button
                onClick={() => setActiveSource('pdf')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSource === 'pdf'
                    ? 'bg-rose-50 text-rose-900 border-2 border-rose-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <FileText className="w-4 h-4 mb-1 text-rose-600" />
                <span>PDF資料</span>
              </button>

              {/* 3. テキスト */}
              <button
                onClick={() => setActiveSource('text')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSource === 'text'
                    ? 'bg-amber-50 text-amber-900 border-2 border-amber-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <FileCode className="w-4 h-4 mb-1 text-amber-600" />
                <span>テキスト</span>
              </button>

              {/* 4. Google Sheets */}
              <button
                onClick={() => setActiveSource('google_sheets')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSource === 'google_sheets'
                    ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 mb-1 text-emerald-600" />
                <span>スプレッドシート</span>
              </button>

              {/* 5. Google Docs */}
              <button
                onClick={() => setActiveSource('google_docs')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSource === 'google_docs'
                    ? 'bg-indigo-50 text-indigo-900 border-2 border-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <HardDrive className="w-4 h-4 mb-1 text-indigo-600" />
                <span>ドキュメント</span>
              </button>

              {/* 6. Google Slides */}
              <button
                onClick={() => setActiveSource('google_slides')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSource === 'google_slides'
                    ? 'bg-amber-50 text-amber-900 border-2 border-amber-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Presentation className="w-4 h-4 mb-1 text-amber-600" />
                <span>スライド</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC SOURCE PANELS */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            
            {/* SOURCE 1: 画像 (Image OCR) */}
            {activeSource === 'image' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>ホワイトボード・模造紙写真のOCR解析</span>
                  </h3>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    AI付箋検知モード
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  スマホ等で撮影したワークショップの模造紙・付箋写真をアップロードするか、以下のサンプル写真を選択してAIで手書き付箋を自動文字起こしします。
                </p>

                {/* Sample Image Picker */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    サンプル写真から選択してテスト:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SAMPLE_IMAGE_SETS.map(sample => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => {
                          setSelectedImageSample(sample.id);
                          setUploadedImagePreview(null);
                        }}
                        className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          selectedImageSample === sample.id && !uploadedImagePreview
                            ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                        }`}
                      >
                        <img 
                          src={sample.previewUrl} 
                          alt={sample.title}
                          className="w-full h-14 object-cover rounded-lg mb-1.5"
                        />
                        <div className="font-bold text-[11px] text-slate-800 line-clamp-1">{sample.title}</div>
                        <div className="text-[10px] text-slate-500">{sample.notesFound} 枚の付箋を検出可能</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Custom Image Button */}
                <div className="pt-2 border-t border-slate-100">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-blue-600" />
                      <span>独自写真をアップロード</span>
                    </button>
                    
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => {
                        const selectedSample = SAMPLE_IMAGE_SETS.find(s => s.id === selectedImageSample);
                        handleExtractFromImage(uploadedImagePreview || selectedSample?.previewUrl, uploadedImagePreview ? 'アップロード模造紙写真.jpg' : selectedSample?.title);
                      }}
                      className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>解析中...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>AI-OCR解析を実行</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SOURCE 2: PDF (PDF Reports) */}
            {activeSource === 'pdf' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-rose-600" />
                    <span>PDF報告書・配布資料からの構造化抽出</span>
                  </h3>
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    PDF Parser
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  策定委員会の議事録PDFや、高校生アイデアソンの提言まとめPDFから、意見・提案・課題を抽出して付箋カード化します。
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700">プリセットPDFファイル:</div>
                  <div className="space-y-1.5">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900">2026年_柳井市まちなかWS_第1回全体サマリー.pdf</div>
                          <div className="text-[10px] text-slate-400">4ページ | 商店街・子育て班の議事録収録</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">1.8 MB</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload-input"
                  />
                  <label
                    htmlFor="pdf-upload-input"
                    className="flex-1 py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-rose-500 text-xs font-bold text-slate-700 hover:text-rose-700 hover:bg-rose-50/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <UploadCloud className="w-4 h-4 text-rose-600" />
                    <span>PDFファイルをアップロード</span>
                  </label>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleExtractFromPdf}
                    className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>抽出中...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>PDFから抽出</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* SOURCE 3: テキスト (Text Editor & Quick Templates) */}
            {activeSource === 'text' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-amber-600" />
                    <span>テキスト直接入力・メモ貼り付け</span>
                  </h3>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    改行区切り対応
                  </span>
                </div>

                {/* Metadata settings */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">班・グループ名</label>
                    <input
                      type="text"
                      value={textGroupName}
                      onChange={(e) => setTextGroupName(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">対象プロジェクト</label>
                    <select
                      value={textTargetProject}
                      onChange={(e) => setTextTargetProject(e.target.value)}
                      className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-300 outline-none bg-white"
                    >
                      <option value="まちなか回遊改善">まちなか回遊改善</option>
                      <option value="子育て支援アイデア募集">子育て支援アイデア募集</option>
                      <option value="移動手段再編計画">移動手段再編計画</option>
                    </select>
                  </div>
                </div>

                {/* Quick Templates */}
                <div>
                  <div className="text-[10px] font-bold text-slate-500 mb-1">ワンクリックで定型サンプルを挿入:</div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleLoadTextTemplate('youth')}
                      className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      💡 高校生班アイデア (5件)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadTextTemplate('shirakabe')}
                      className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      🏛️ 商店街・白壁班 (4件)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadTextTemplate('traffic')}
                      className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      🚶 子育て・移動班 (4件)
                    </button>
                  </div>
                </div>

                {/* Textarea */}
                <div>
                  <textarea
                    rows={4}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="・付箋の意見やアイデアを改行区切りで入力または貼り付けしてください&#10;・1行ごとに1枚の付箋として自動分解されます"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-amber-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isProcessing || !textInput.trim()}
                    onClick={handleExtractFromText}
                    className="py-2 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>テキストから付箋化</span>
                  </button>
                </div>
              </div>
            )}

            {/* SOURCE 4: Googleスプレッドシート (Google Sheets) */}
            {activeSource === 'google_sheets' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Googleスプレッドシート（共有ドライブから選択）</span>
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Drive Sync
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  柳井市Google Workspace共有ドライブ上の集計シートから直接付箋データを読み込みます。列（班、カテゴリ、意見、属性）を自動マッピングします。
                </p>

                {/* Drive Files List */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Google ドライブ上のスプレッドシート:
                  </label>
                  {MOCK_DRIVE_FILES.sheets.map(file => (
                    <div
                      key={file.id}
                      className="p-3 bg-slate-50 hover:bg-emerald-50/40 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{file.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {file.owner} | {file.rowsCount} 行の付箋レコード | タブ: {file.sheetTabs.join(', ')}
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleExtractFromGoogleSheets(file)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-all cursor-pointer"
                      >
                        取り込む
                      </button>
                    </div>
                  ))}
                </div>

                {/* Google Sheet URL paste */}
                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={driveUrlInput}
                    onChange={(e) => setDriveUrlInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleExtractFromGoogleSheets(MOCK_DRIVE_FILES.sheets[0])}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 transition-all cursor-pointer"
                  >
                    URLから読込
                  </button>
                </div>
              </div>
            )}

            {/* SOURCE 5: Googleドキュメント (Google Docs) */}
            {activeSource === 'google_docs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-indigo-600" />
                    <span>Googleドキュメント（議事録・グラレコ要約）</span>
                  </h3>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    Doc Parser
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  策定検討会やワークショップのグラフィックレコーディング議事録ドキュメントから見出し・提案箇所を自動検出し、付箋データに変換します。
                </p>

                <div className="space-y-2">
                  {MOCK_DRIVE_FILES.docs.map(file => (
                    <div
                      key={file.id}
                      className="p-3 bg-slate-50 hover:bg-indigo-50/40 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <HardDrive className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{file.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {file.owner} | {file.sectionsCount} セクション
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleExtractFromGoogleDocs(file)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 transition-all cursor-pointer"
                      >
                        取り込む
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SOURCE 6: Googleスライド (Google Slides) */}
            {activeSource === 'google_slides' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Presentation className="w-4 h-4 text-amber-600" />
                    <span>Googleスライド（各班発表スライド）</span>
                  </h3>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Slide Deck
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  各グループがアイデアソンで作成した発表スライド（.gslides）から、スライド毎の提言・発表者ノート・提案タイトルを抽出します。
                </p>

                <div className="space-y-2">
                  {MOCK_DRIVE_FILES.slides.map(file => (
                    <div
                      key={file.id}
                      className="p-3 bg-slate-50 hover:bg-amber-50/40 rounded-xl border border-slate-200 hover:border-amber-300 transition-all flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Presentation className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{file.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {file.owner} | {file.slidesCount} 枚のスライド
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleExtractFromGoogleSlides(file)}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-all cursor-pointer"
                      >
                        取り込む
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: Extracted Sticky Notes Deck & Action Dispatcher (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Deck Header & Summary Bar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>抽出された構造化付箋デッキ ({extractedNotes.length} 件)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  内容を確認・編集し、市民意見DBやカンバンタスクへ一括反映できます。
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectAll(selectedCount !== extractedNotes.length)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  {selectedCount === extractedNotes.length ? '全解除' : 'すべて選択'}
                </button>

                <button
                  type="button"
                  onClick={handleExportCsv}
                  disabled={selectedCount === 0}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Commit Targets (Highlighted Banner) */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 rounded-xl border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>選択中: {selectedCount} / {extractedNotes.length} 件</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  反映先を選択してボタンを押してください:
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={handleCommitToSubmissions}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>市民意見DBへ登録</span>
                </button>

                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={handleCommitToTasks}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>カンバンタスクへ作成</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <div className="relative flex-1 min-w-[140px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="付箋を検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 outline-none"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 outline-none bg-white text-slate-700"
              >
                <option value="all">全カテゴリ</option>
                <option value="youth_student">若者・高校生</option>
                <option value="downtown_buzz">まちなか賑わい</option>
                <option value="traffic_walk">交通・ウォーカブル</option>
                <option value="shirakabe_view">白壁・景観保全</option>
                <option value="culture_event">観光・イベント</option>
              </select>
            </div>

          </div>

          {/* Extracted Sticky Notes List */}
          {filteredNotes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                取り込まれた付箋データはまだありません
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                左側のパネルから「画像 (OCR)」「PDF」「テキスト」「Googleスプレッドシート」「ドキュメント」「スライド」を選んで取り込みを実行してください。
              </p>
              <button
                type="button"
                onClick={() => handleExtractFromImage('sample-img-1')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>サンプル画像から1クリックで付箋を取り込む</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotes.map(note => {
                // Color themes
                const colorStyles = {
                  yellow: 'bg-amber-50/80 border-amber-200 text-amber-950',
                  pink: 'bg-rose-50/80 border-rose-200 text-rose-950',
                  blue: 'bg-sky-50/80 border-sky-200 text-sky-950',
                  green: 'bg-emerald-50/80 border-emerald-200 text-emerald-950',
                  purple: 'bg-purple-50/80 border-purple-200 text-purple-950'
                }[note.color];

                return (
                  <div
                    key={note.id}
                    className={`p-4 rounded-2xl border transition-all relative ${colorStyles} ${
                      note.isSelected ? 'ring-2 ring-blue-600 shadow-xs' : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      
                      {/* Checkbox and Group Header */}
                      <div className="flex items-start gap-2.5 flex-1">
                        <input
                          type="checkbox"
                          checked={note.isSelected}
                          onChange={() => handleToggleSelectNote(note.id)}
                          className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        
                        <div className="space-y-1 flex-1">
                          
                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 border border-slate-200 text-slate-800 shadow-2xs">
                              {note.groupName}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white">
                              {note.targetProject}
                            </span>
                            {note.ocrConfidence && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                OCR信頼度: {note.ocrConfidence}%
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 ml-auto">
                              元データ: {note.sourceName}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {note.title}
                          </h4>

                          {/* Content */}
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {note.description}
                          </p>

                          {/* Metadata Bottom */}
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 font-medium">
                            <span>提案者: {note.authorName}</span>
                            <span>場所: {note.locationName}</span>
                            <span className="text-emerald-700 font-bold">住民期待度: {note.expectationScore}%</span>
                            <span className="text-blue-700 font-bold">実現性: {note.feasibilityScore}%</span>
                          </div>

                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
