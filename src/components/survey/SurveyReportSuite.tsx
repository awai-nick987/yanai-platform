import React, { useState, useMemo } from 'react';
import {
  Presentation,
  FileText,
  Table2,
  Users,
  Compass,
  Zap,
  BookOpen,
  Printer,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  Sparkles,
  Layers,
  Building2,
  School,
  Link2,
  Settings,
  RefreshCw,
  Upload,
  RotateCcw,
  QrCode,
  X,
  Download,
} from 'lucide-react';
import {
  SurveyAnalysisSummary,
  CorrelationAnalysisSummary,
  SurveyRow,
} from '../../types/survey';
import {
  KAWAUCHI_SURVEY_187_DATA,
  KawauchiSurvey187Record,
} from '../../data/kawauchiSurvey187Data';

export type DatasetMode = 'yanai_dynamic' | 'kawauchi_187';
export type ReportFormatMode = 'slide' | 'a4' | 'explore' | 'form' | 'iframe_full';
export type ReportAudienceMode = 'resident' | 'stakeholder';
export type ReportDepthMode = 'digest' | 'detailed';
export type SourceFilterMode = 'all' | 'Web' | '紙';
export type PivotAxisKey = 'src' | 'd' | 'a' | 'b' | 'p' | 'f' | 'i';

export interface SurveySuiteAppConfig {
  badgeText: string;
  appTitle: string;
  residentTitle: string;
  stakeholderTitle: string;
  organizationName: string;
  customSubtitle: string;
  sheetUrl: string;
  sheetNameOrGid: string;
  formUrl: string;
  lastSyncAt: string;
  qAgeLabel: string;
  qDistLabel: string;
  qBldgLabel: string;
  qFuncLabel: string;
  qPrivLabel: string;
  qSustLabel: string;
  qCommentLabel: string;
  customResidentSummary: string;
  customStakeholderSummary: string;
}

export interface SurveyReportSuiteProps {
  summary: SurveyAnalysisSummary;
  correlations: CorrelationAnalysisSummary;
  rows: SurveyRow[];
  dataSourceName?: string;
  defaultDataset?: DatasetMode;
}

interface BarStatItem {
  label: string;
  count: number;
  pct: number;
  subText?: string;
  tone: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate';
}

interface SlideOrPageItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  digestIncluded: boolean;
  audience: 'both' | 'resident' | 'stakeholder';
  renderContent: () => React.ReactNode;
}

interface GvizCell {
  v?: string | number | boolean | null;
  f?: string | null;
}

interface GvizRow {
  c?: (GvizCell | null)[];
}

interface GvizCol {
  label?: string;
}

interface GvizResponse {
  table?: {
    cols?: GvizCol[];
    rows?: GvizRow[];
  };
}

const DEFAULT_SUITE_CONFIG: SurveySuiteAppConfig = {
  badgeText: '共',
  appTitle: '旧河内小学校 跡地活用アンケート 統合レポート＆対話支援システム',
  residentTitle: '住民アンケート 統合結果報告レポート',
  stakeholderTitle: '住民アンケート 統合分析・インサイト＆対話設計レポート',
  organizationName: 'まちづくり協議会 ／ 施設跡地活用・共創部会',
  customSubtitle: '',
  sheetUrl:
    'https://docs.google.com/spreadsheets/d/1mgaRfu0f9GYQ47b3ShOhKu-UetWbbWry-6JjsFtjoyY/edit?usp=sharing',
  sheetNameOrGid: '全アンケート',
  formUrl: '',
  lastSyncAt: '',
  qAgeLabel: '問1-1：年代',
  qDistLabel: '問1-2：お住まいの地区',
  qBldgLabel: '問2：校舎・体育館など建物の扱い',
  qFuncLabel: '問3：優先して導入・整備すべき機能（複数回答）',
  qPrivLabel: '問4：民間企業の参入・誘致',
  qSustLabel: '問5：住民の負担・関わり方（複数回答）',
  qCommentLabel: '自由記述（アイデア・ご意見）',
  customResidentSummary: '',
  customStakeholderSummary: '',
};

const STORAGE_KEY_CONFIG = 'agy_yanai_survey_suite_config_v1';
const STORAGE_KEY_RECORDS = 'agy_yanai_survey_suite_records_v1';

const BLDG_SHORT_MAP: Record<string, string> = {
  '使える建物はできる限りそのまま残し、リノベーションして活用する':
    'すべて残してリノベーション（全面活用）',
  '必要な部分だけを残し、老朽化した危険な建物は解体する':
    '一部残して危険・不要建物を解体（部分活用）',
  'すべて解体し、更地にして新しい施設や広場をつくる':
    'すべて解体して更地にする',
  'わからない / どちらでもよい': 'わからない',
};

const PRIV_SHORT_MAP: Record<string, string> = {
  '条件付きで賛成（住民が利用できるスペースや避難機能が確保されるなら）':
    '条件付きで賛成（地域の利用や避難機能が守られるなら）',
  '賛成（地域の利便性向上や雇用の場、賑わい創出につながるため）':
    '積極的に賛成（利便性向上や雇用・賑わいにつながる）',
  '反対（静かな住環境の悪化、交通量や騒音の増加が心配なため）':
    '反対（住環境や治安・管理面に不安がある）',
};

const FUNC_SHORT_MAP: Record<string, string> = {
  '防災・避難拠点（指定避難所、備蓄倉庫、ヘリポートなど）':
    '防災・避難拠点（指定避難所・備蓄倉庫）',
  '地域交流・生涯学習（南河内分館・出張所の移転・集会所）':
    '地域交流・コミュニティ（南河内分館の移転・集会所）',
  '健康づくり・スポーツ（体育館の維持・活用、グラウンド、ウォーキングコース）':
    '健康・スポーツ（体育館・グラウンド開放）',
  '地域産業・特産品振興（地元農産品等の販売所、直売カフェ、週末マルシェ）':
    '地域産業・マルシェ（直売所・カフェ）',
  '子育て・福祉（放課後児童教室の継続、高齢者デイサービス、多世代サロン）':
    '子育て・福祉（児童教室・高齢者サロン）',
  '緑地・憩いの広場（芝生広場、市民農園、ドッグランなど）':
    '緑地・憩いの広場（芝生広場・ドッグラン）',
  '歴史・体験（学校資料館、木工・ものづくり体験工房、文化展示）':
    '歴史・文化・体験（資料展示・体験工房）',
  '働く場・テレワーク（サテライトオフィス、移住者向けシェアオフィス、起業支援）':
    '働く場・テレワーク（サテライトオフィス）',
};

const SUST_SHORT_MAP: Record<string, string> = {
  '住民の労力や金銭的負担は難しいため、維持が困難な部分は積極的に縮小・解体すべき':
    '維持管理が難しい部分は縮小・解体すべき',
  '自分たちの活動場所として、清掃・草刈りや簡易な維持管理にはボランティアとして参加したい':
    '定期的な清掃・草刈り等のボランティアなら参加したい',
  '基本的にすべて行政や民間事業者に管理・運営を任せるべき':
    '行政や民間事業者にすべて任せるべき',
  '維持管理費を賄うためであれば、施設の利用料（有料化）を負担してもよい':
    '施設利用料（受益者負担）を払ってでも維持すべき',
  '役員などの固定的な負担ではなく、特技や興味（イベント企画・SNS発信・DIY等）を活かして関わりたい':
    '特技や興味（企画・SNS・DIY等）を活かして関わりたい',
};

const shortLabel = (val: string, map: Record<string, string>): string => {
  const trimmed = (val || '').trim();
  if (!trimmed) return '無回答';
  return map[trimmed] || trimmed;
};

const getUniqueAxisValues = (
  records: KawauchiSurvey187Record[],
  key: PivotAxisKey
): string[] => {
  const valueSet = new Set<string>();
  records.forEach((r) => {
    if (key === 'f' || key === 'i') {
      const arr = r[key];
      if (arr.length === 0) {
        valueSet.add('無回答');
      } else {
        arr.forEach((v) => valueSet.add(v));
      }
    } else {
      const val = r[key];
      valueSet.add(val || '無回答');
    }
  });
  return Array.from(valueSet);
};

const recordMatchesValue = (
  record: KawauchiSurvey187Record,
  key: PivotAxisKey,
  target: string
): boolean => {
  if (key === 'f' || key === 'i') {
    const arr = record[key];
    if (target === '無回答') return arr.length === 0;
    return arr.includes(target);
  }
  const val = record[key] || '無回答';
  return val === target;
};

const toEmbedGoogleFormUrl = (rawUrl: string): string => {
  const u = rawUrl.trim();
  if (!u) return '';
  if (u.includes('embedded=true')) return u;
  if (u.includes('/viewform')) {
    return `${u.split('?')[0]}?embedded=true`;
  }
  return u;
};

const parseFlexibleSheetRows = (
  headers: string[],
  rawRows: string[][]
): KawauchiSurvey187Record[] => {
  const findIdx = (keywords: string[], fallback: number): number => {
    const idx = headers.findIndex((h) =>
      keywords.some((k) => (h || '').includes(k))
    );
    return idx >= 0 ? idx : fallback;
  };

  const idxSrc = findIdx(
    ['経路', '媒体', '区分', 'Web', '紙', 'source', '回答方法'],
    -1
  );
  const idxAge = findIdx(['年代', '年齢', '問1-1', '属性1'], 1);
  const idxDist = findIdx(
    ['地区', '自治会', 'お住まい', '問1-2', '居住', '属性2'],
    2
  );
  const idxBldg = findIdx(
    ['建物', '校舎', '扱い', '方向性', '問2', '自慢', '誇り'],
    3
  );
  const idxFunc = findIdx(
    ['機能', '優先', '問3', 'したい', '期待', 'あったら'],
    4
  );
  const idxPriv = findIdx(['民間', '企業', '誘致', '参入', '問4'], 5);
  const idxSust = findIdx(
    ['関わり', '負担', '参加', '維持', '問5', '不安', '課題'],
    6
  );
  const idxComm = findIdx(
    ['自由', '意見', 'アイデア', 'その他', 'コメント', '記述'],
    Math.max(7, headers.length - 1)
  );

  const splitMulti = (val: string): string[] => {
    const s = (val || '').trim();
    if (!s || s === '無回答') return [];
    return s
      .split(/[;\n]|,(?![^（(]*[）)])/)
      .map((x) => x.trim())
      .filter(Boolean);
  };

  const result: KawauchiSurvey187Record[] = [];
  rawRows.forEach((cols, i) => {
    if (!cols || cols.every((c) => !(c || '').trim())) return;
    const rawSrc = idxSrc >= 0 ? cols[idxSrc] || '' : '';
    const src: 'Web' | '紙' =
      rawSrc.includes('紙') || rawSrc.toLowerCase().includes('paper')
        ? '紙'
        : 'Web';
    result.push({
      id: i + 1,
      src,
      a: (cols[idxAge] || '無回答').trim() || '無回答',
      d: (cols[idxDist] || '無回答').trim() || '無回答',
      b: shortLabel(cols[idxBldg] || '無回答', BLDG_SHORT_MAP),
      f: splitMulti(cols[idxFunc]).map((x) => shortLabel(x, FUNC_SHORT_MAP)),
      p: shortLabel(cols[idxPriv] || '無回答', PRIV_SHORT_MAP),
      i: splitMulti(cols[idxSust]).map((x) => shortLabel(x, SUST_SHORT_MAP)),
      c: (cols[idxComm] || '').trim(),
    });
  });

  return result;
};

const renderToneBar = (item: BarStatItem) => {
  const colorMap: Record<BarStatItem['tone'], string> = {
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    slate: 'bg-slate-400',
  };
  const badgeMap: Record<BarStatItem['tone'], string> = {
    emerald: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    blue: 'text-blue-800 bg-blue-50 border-blue-200',
    amber: 'text-amber-800 bg-amber-50 border-amber-200',
    rose: 'text-rose-800 bg-rose-50 border-rose-200',
    slate: 'text-slate-700 bg-slate-50 border-slate-200',
  };
  return (
    <div key={item.label} className="space-y-1">
      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
        <span className="font-bold text-slate-800">{item.label}</span>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-extrabold border shrink-0 ${badgeMap[item.tone]}`}
        >
          {item.count}件 ({item.pct.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorMap[item.tone]}`}
          style={{ width: `${Math.min(100, item.pct)}%` }}
        />
      </div>
      {item.subText && (
        <div className="text-[11px] text-slate-500 pl-0.5">{item.subText}</div>
      )}
    </div>
  );
};

export const SurveyReportSuite: React.FC<SurveyReportSuiteProps> = ({
  summary,
  correlations,
  rows,
  dataSourceName,
  defaultDataset = 'yanai_dynamic',
}) => {
  const [config, setConfig] = useState<SurveySuiteAppConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return { ...DEFAULT_SUITE_CONFIG, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return { ...DEFAULT_SUITE_CONFIG };
  });

  const [records, setRecords] = useState<KawauchiSurvey187Record[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (saved) {
        const parsed = JSON.parse(saved) as KawauchiSurvey187Record[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return KAWAUCHI_SURVEY_187_DATA;
  });

  const [datasetMode, setDatasetMode] = useState<DatasetMode>(defaultDataset);
  const [formatMode, setFormatMode] = useState<ReportFormatMode>('slide');
  const [audienceMode, setAudienceMode] =
    useState<ReportAudienceMode>('stakeholder');
  const [depthMode, setDepthMode] = useState<ReportDepthMode>('detailed');
  const [slideSingleView, setSlideSingleView] = useState<boolean>(true);
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [activeDrawer, setActiveDrawer] = useState<'none' | 'data' | 'config'>(
    'none'
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [sourceFilter, setSourceFilter] = useState<SourceFilterMode>('all');
  const [rowAxis, setRowAxis] = useState<PivotAxisKey>('a');
  const [colAxis, setColAxis] = useState<PivotAxisKey>('b');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyComments, setOnlyComments] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4500);
  };

  const updateAndSaveConfig = (next: SurveySuiteAppConfig) => {
    setConfig(next);
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const updateAndSaveRecords = (nextRows: KawauchiSurvey187Record[]) => {
    setRecords(nextRows);
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(nextRows));
    } catch {
      // ignore
    }
  };

  const handleSyncFromGoogleSheet = (
    targetUrlInput?: string,
    targetSheetInput?: string
  ) => {
    const rawUrl = (targetUrlInput ?? config.sheetUrl).trim();
    const sheetArg = (targetSheetInput ?? config.sheetNameOrGid).trim();

    if (!rawUrl) {
      showToast('⚠️ Googleスプレッドシートまたはフォームの共有URLを入力してください');
      return;
    }

    if (rawUrl.includes('/forms/')) {
      const nextCfg = { ...config, formUrl: rawUrl };
      updateAndSaveConfig(nextCfg);
      setActiveDrawer('none');
      setFormatMode('form');
      showToast('✅ GoogleフォームURLを登録し、回答受付画面を開きました');
      return;
    }

    const match = rawUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      showToast('⚠️ 有効なGoogleスプレッドシートの共有URLではありません');
      return;
    }

    const sheetId = match[1];
    const gidMatch = rawUrl.match(/[#&?]gid=([0-9]+)/);
    let queryParam = '';
    if (sheetArg && /^\d+$/.test(sheetArg)) {
      queryParam = `&gid=${sheetArg}`;
    } else if (sheetArg) {
      queryParam = `&sheet=${encodeURIComponent(sheetArg)}`;
    } else if (gidMatch) {
      queryParam = `&gid=${gidMatch[1]}`;
    }

    setIsSyncing(true);
    const cbName = `gvizYanaiSuiteCb_${Math.floor(Math.random() * 1000000)}`;
    const win = window as unknown as Record<string, unknown>;

    win[cbName] = (res: GvizResponse) => {
      delete win[cbName];
      const sc = document.getElementById(cbName);
      if (sc) sc.remove();
      setIsSyncing(false);

      if (!res || !res.table || !res.table.rows) {
        showToast(
          '⚠️ 取得失敗：スプレッドシートの共有設定を「リンクを知っている全員」にしてください'
        );
        return;
      }

      const colsInfo = res.table.cols || [];
      const labelHeaders = colsInfo.map((c) =>
        c && c.label ? String(c.label).trim() : ''
      );
      const allRows: string[][] = res.table.rows.map((r) =>
        (r.c || []).map((cell) => {
          if (!cell) return '';
          if (cell.f !== undefined && cell.f !== null) return String(cell.f).trim();
          if (cell.v !== undefined && cell.v !== null) return String(cell.v).trim();
          return '';
        })
      );

      let headers = labelHeaders;
      let dataRows = allRows;
      if (labelHeaders.filter(Boolean).length <= 1 && allRows.length > 1) {
        headers = allRows[0];
        dataRows = allRows.slice(1);
      }

      const parsed = parseFlexibleSheetRows(headers, dataRows);
      if (parsed.length === 0) {
        showToast('⚠️ シート内に有効な回答データが見つかりませんでした');
        return;
      }

      const nowStr = new Date().toLocaleString('ja-JP');
      updateAndSaveConfig({
        ...config,
        sheetUrl: rawUrl,
        sheetNameOrGid: sheetArg,
        lastSyncAt: nowStr,
      });
      updateAndSaveRecords(parsed);
      setDatasetMode('kawauchi_187');
      setActiveDrawer('none');
      showToast(`✅ Googleスプレッドシートから全 ${parsed.length} 件を同期しました！`);
    };

    const script = document.createElement('script');
    script.id = cbName;
    script.src = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=responseHandler:${cbName}${queryParam}`;
    script.onerror = () => {
      delete win[cbName];
      script.remove();
      setIsSyncing(false);
      showToast(
        '⚠️ 通信エラー：スプレッドシートの共有設定（「リンクを知っている全員が閲覧可」）を確認してください'
      );
    };
    document.body.appendChild(script);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result || '');
      const sep = text.includes('\t') ? '\t' : ',';
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        showToast('⚠️ CSVの行数が不足しています');
        return;
      }
      const parseLine = (line: string): string[] => {
        const res: string[] = [];
        let cur = '';
        let inQ = false;
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if (ch === '"') {
            inQ = !inQ;
          } else if (ch === sep && !inQ) {
            res.push(cur.trim());
            cur = '';
          } else {
            cur += ch;
          }
        }
        res.push(cur.trim());
        return res;
      };
      const csvRows = lines.map(parseLine);
      const parsed = parseFlexibleSheetRows(csvRows[0], csvRows.slice(1));
      if (parsed.length === 0) {
        showToast('⚠️ 有効なデータ行が見つかりませんでした');
        return;
      }
      updateAndSaveConfig({
        ...config,
        lastSyncAt: `${new Date().toLocaleString('ja-JP')} (${file.name})`,
      });
      updateAndSaveRecords(parsed);
      setDatasetMode('kawauchi_187');
      setActiveDrawer('none');
      showToast(`✅ CSVファイルから全 ${parsed.length} 件を取り込みました！`);
    };
    reader.readAsText(file);
  };

  const handleResetToDefault = () => {
    updateAndSaveConfig({ ...DEFAULT_SUITE_CONFIG });
    updateAndSaveRecords(KAWAUCHI_SURVEY_187_DATA);
    setDatasetMode('kawauchi_187');
    setActiveDrawer('none');
    showToast('✅ 旧河内小学校アンケート（全187件：Web48＋紙139）の初期状態に戻しました');
  };

  const handleExportBundleJson = () => {
    const payload = {
      config,
      records,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `survey_suite_bundle_${Date.now()}.json`;
    a.click();
  };

  // 河内・カスタムシートデータ（records）の動的統計
  const kStats = useMemo(() => {
    const total = records.length || 1;
    let webCount = 0;
    let paperCount = 0;
    const distSet = new Set<string>();
    const commentRows: KawauchiSurvey187Record[] = [];

    const bldgMap: Record<string, { total: number; web: number; paper: number }> = {};
    const privMap: Record<string, { total: number; web: number; paper: number }> = {};
    const funcMap: Record<string, { total: number; web: number; paper: number }> = {};
    const sustMap: Record<string, { total: number; web: number; paper: number }> = {};

    let bldgValid = 0;
    let privValid = 0;

    records.forEach((r) => {
      const isWeb = r.src === 'Web';
      if (isWeb) webCount++;
      else paperCount++;
      if (r.d && r.d !== '無回答') distSet.add(r.d);
      if (r.c && r.c.trim()) commentRows.push(r);

      const add = (
        map: Record<string, { total: number; web: number; paper: number }>,
        key: string
      ) => {
        if (!map[key]) map[key] = { total: 0, web: 0, paper: 0 };
        map[key].total++;
        if (isWeb) map[key].web++;
        else map[key].paper++;
      };

      if (r.b && r.b !== '無回答') bldgValid++;
      add(bldgMap, r.b || '無回答');

      if (r.p && r.p !== '無回答') privValid++;
      add(privMap, r.p || '無回答');

      r.f.forEach((fItem) => {
        if (fItem && fItem !== '無回答') add(funcMap, fItem);
      });
      r.i.forEach((iItem) => {
        if (iItem && iItem !== '無回答') add(sustMap, iItem);
      });
    });

    const tones: BarStatItem['tone'][] = [
      'emerald',
      'blue',
      'amber',
      'rose',
      'slate',
    ];

    const toBarList = (
      map: Record<string, { total: number; web: number; paper: number }>,
      denom: number
    ): BarStatItem[] => {
      const safeDenom = denom > 0 ? denom : 1;
      return Object.entries(map)
        .filter(([k]) => k !== '無回答')
        .sort((a, b) => b[1].total - a[1].total)
        .map(([label, v], idx) => ({
          label,
          count: v.total,
          pct: (v.total / safeDenom) * 100,
          subText: `Web ${v.web}件 / 紙 ${v.paper}件`,
          tone: tones[idx % tones.length],
        }));
    };

    return {
      total: records.length,
      webCount,
      paperCount,
      webPct: ((webCount / total) * 100).toFixed(1),
      paperPct: ((paperCount / total) * 100).toFixed(1),
      distCount: distSet.size,
      commentRows,
      bldgValid: bldgValid || total,
      privValid: privValid || total,
      bldgBars: toBarList(bldgMap, bldgValid || total),
      privBars: toBarList(privMap, privValid || total),
      funcBars: toBarList(funcMap, total),
      sustBars: toBarList(sustMap, total),
    };
  }, [records]);

  const axisLabels: Record<PivotAxisKey, string> = useMemo(
    () => ({
      src: '回答経路（Web / 紙）',
      d: config.qDistLabel,
      a: config.qAgeLabel,
      b: config.qBldgLabel,
      p: config.qPrivLabel,
      f: config.qFuncLabel,
      i: config.qSustLabel,
    }),
    [config]
  );

  // A. 柳井まちなか共創プラットフォーム 動的アンケート（summary/correlations）用のページ定義
  const yanaiPages: SlideOrPageItem[] = useMemo(() => {
    const total = summary.totalCount || 1;
    const topPride = summary.prideRanking[0];
    const topWorry = summary.worryRanking[0];
    const topHope = summary.hopeRanking[0];

    const prideBars: BarStatItem[] = summary.prideRanking
      .slice(0, 6)
      .map((item, idx) => ({
        label: item.name,
        count: item.count,
        pct: item.percentage,
        tone: idx === 0 ? 'emerald' : idx === 1 ? 'blue' : 'slate',
      }));

    const worryBars: BarStatItem[] = summary.worryRanking
      .slice(0, 6)
      .map((item, idx) => ({
        label: item.name,
        count: item.count,
        pct: item.percentage,
        tone: idx === 0 ? 'rose' : idx === 1 ? 'amber' : 'slate',
      }));

    const hopeBars: BarStatItem[] = summary.hopeRanking
      .slice(0, 6)
      .map((item, idx) => ({
        label: item.name,
        count: item.count,
        pct: item.percentage,
        tone: idx === 0 ? 'blue' : idx === 1 ? 'emerald' : 'amber',
      }));

    return [
      {
        id: 'yanai-overview',
        badge:
          audienceMode === 'resident'
            ? '市民・地域のみなさまへのご報告'
            : 'まちなか共創会議・部会 基礎データ総括',
        title:
          audienceMode === 'resident'
            ? `${config.residentTitle}（全${summary.totalCount}件）`
            : `${config.stakeholderTitle}（N=${summary.totalCount}）`,
        subtitle:
          config.customSubtitle ||
          `データソース: ${dataSourceName || '柳井市まちなか住民アンケート'} ｜ 地域の誇り・課題・期待の全体像`,
        digestIncluded: true,
        audience: 'both',
        renderContent: () => (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <div className="text-xs font-bold text-blue-800">総回答数</div>
                <div className="text-2xl sm:text-3xl font-black text-blue-950 mt-1">
                  {summary.totalCount}
                  <span className="text-sm font-bold ml-1">件</span>
                </div>
                <div className="text-[11px] text-blue-700 mt-1">
                  自由記述 {summary.opinions.length}件 収録
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs font-bold text-emerald-800">
                  地域の誇り・強み 1位
                </div>
                <div className="text-base sm:text-lg font-black text-emerald-950 mt-1 truncate">
                  {topPride?.name || '—'}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  {topPride
                    ? `${topPride.count}件 (${Math.round((topPride.count / total) * 100)}%)`
                    : ''}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <div className="text-xs font-bold text-rose-800">
                  不安・困りごと 1位
                </div>
                <div className="text-base sm:text-lg font-black text-rose-950 mt-1 truncate">
                  {topWorry?.name || '—'}
                </div>
                <div className="text-[11px] text-rose-700 mt-1">
                  {topWorry
                    ? `${topWorry.count}件 (${Math.round((topWorry.count / total) * 100)}%)`
                    : ''}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="text-xs font-bold text-amber-800">
                  将来への期待 1位
                </div>
                <div className="text-base sm:text-lg font-black text-amber-950 mt-1 truncate">
                  {topHope?.name || '—'}
                </div>
                <div className="text-[11px] text-amber-800 mt-1">
                  {topHope
                    ? `${topHope.count}件 (${Math.round((topHope.count / total) * 100)}%)`
                    : ''}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  🌟 問5：地域の自慢・誇れるもの 上位ランキング
                </h4>
                <div className="space-y-2">{prideBars.map(renderToneBar)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  🚀 問8：これから「あったらいいな」と思う機能・取組
                </h4>
                <div className="space-y-2">{hopeBars.map(renderToneBar)}</div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'yanai-worry-and-generations',
        badge: '課題構造と世代別ギャップ',
        title: '地域の不安・困りごと（問7）と 世代別・世帯別の優先ニーズ比較',
        subtitle:
          '若年・子育て層とシニア層の双方の視点を掛け合わせ、まちなか共創の重点テーマを抽出',
        digestIncluded: true,
        audience: 'both',
        renderContent: () => (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6 p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                ⚠️ 問7：日頃の不安・困りごとランキング
              </h4>
              <div className="space-y-2">{worryBars.map(renderToneBar)}</div>
            </div>
            <div className="lg:col-span-6 p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                👥 属性・ライフステージ別の特徴的な声
              </h4>
              <div className="grid grid-cols-1 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200">
                  <div className="font-extrabold text-blue-950">
                    🧑 若年・現役世代（〜40代）の焦点
                  </div>
                  <p className="text-blue-900 mt-1">
                    最大の関心・不安：「
                    {summary.youngTopWorry?.name || '日常の買い物・子どもの遊び場'}
                    」 ／ 期待1位：「
                    {summary.youngTopHope?.name || 'カフェ・イベント・交流の場'}」
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200">
                  <div className="font-extrabold text-emerald-950">
                    👨‍👩‍👧 子育て世帯の焦点
                  </div>
                  <p className="text-emerald-900 mt-1">
                    最大の関心・不安：「
                    {summary.childRearingTopWorry?.name ||
                      '安全な遊び場・送迎環境'}
                    」 ／ 期待1位：「
                    {summary.childRearingTopHope?.name ||
                      '多世代交流・屋内キッズスペース'}
                    」
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200">
                  <div className="font-extrabold text-amber-950">
                    🧓 シニア世代（60代以上）の焦点
                  </div>
                  <p className="text-amber-900 mt-1">
                    最大の関心・不安：「
                    {summary.seniorTopWorry?.name || '移動手段・防災・買い物'}」 ／
                    期待1位：「
                    {summary.seniorTopHope?.name ||
                      '安心して集える居場所・防災拠点'}
                    」
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'yanai-correlations-and-questions',
        badge:
          audienceMode === 'resident'
            ? '対話ワークショップのご案内'
            : '部会・関係者用 相関インサイト＆問い立て',
        title:
          audienceMode === 'resident'
            ? 'みなさんの声を形にする「これからの対話テーマ」'
            : '強み×課題×期待の相関分析と、共創会議を前に進める「3つの問い」',
        subtitle:
          'アンケートのクロス集計・共起分析から導き出された仮説とアジェンダ',
        digestIncluded: true,
        audience: 'both',
        renderContent: () => (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {correlations.worryToPrimaryHope.slice(0, 3).map((item, idx) => (
                <div
                  key={item.worry}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5"
                >
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-extrabold text-[10px]">
                    相関インサイト {idx + 1}
                  </span>
                  <div className="text-xs font-black text-slate-900">
                    課題「{item.worry}」を抱える層（{item.worryCount}人）
                  </div>
                  <p className="text-xs text-slate-600">
                    最も強く求めている解決策は
                    <strong className="text-emerald-700">
                      「{item.topHopes[0]?.hope || '地域交流拠点'}」（
                      {item.topHopes[0]?.percentage.toFixed(0) || 0}%）
                    </strong>
                    です。
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-amber-300">
                🧭 次回の共創ワークショップで議論する「3つの問い」
              </h4>
              <div className="space-y-2 text-xs leading-relaxed">
                <div>
                  <strong>問い1（強みの活用）：</strong> 地域最大の誇りである「
                  {topPride?.name || '地域の歴史と自然'}
                  」を活かして、課題1位の「{topWorry?.name || '日常の困りごと'}
                  」を和らげる小さな実験は何か？
                </div>
                <div>
                  <strong>問い2（多世代の交差点）：</strong>{' '}
                  シニア層が求める「安心・防災・居場所」と、現役・子育て層が求める「
                  {topHope?.name || '賑わい・交流'}
                  」を同じ空間・時間で両立させる工夫は？
                </div>
                <div>
                  <strong>問い3（無理のない運営）：</strong>{' '}
                  住民ボランティアだけに頼らず、民間プレイヤーや受益者負担を組み合わせて持続させる仕組みはどう作るか？
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'yanai-free-opinions',
        badge: '自由記述の生の声（抜粋）',
        title: `自由意見（全${summary.opinions.length}件）から見える具体的な提案と懸念`,
        subtitle: '定量グラフの背景にある住民一人ひとりの文脈・アイデア',
        digestIncluded: false,
        audience: 'both',
        renderContent: () => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {summary.opinions.slice(0, 12).map((op) => (
              <div
                key={op.id}
                className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-amber-800">
                  <span>
                    {op.jichikai || '地区未記入'} ／ {op.age || '年代未記入'}
                  </span>
                  <span>{op.household || ''}</span>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {op.text}
                </p>
              </div>
            ))}
          </div>
        ),
      },
    ];
  }, [summary, correlations, audienceMode, dataSourceName, config]);

  // B. 河内小学校跡地活用 / Googleスプレッドシート取込データ（records）用のページ定義
  const kawauchiPages: SlideOrPageItem[] = useMemo(() => {
    const topBldg = kStats.bldgBars[0] || { label: '—', count: 0, pct: 0 };
    const topFunc1 = kStats.funcBars[0] || { label: '—', count: 0, pct: 0 };
    const topFunc2 = kStats.funcBars[1] || { label: '—', count: 0, pct: 0 };
    const topFunc3 = kStats.funcBars[2] || { label: '—', count: 0, pct: 0 };
    const topPriv1 = kStats.privBars[0] || { label: '—', count: 0, pct: 0 };
    const topPriv2 = kStats.privBars[1] || { label: '—', count: 0, pct: 0 };
    const topSust1 = kStats.sustBars[0] || { label: '—', count: 0, pct: 0 };

    const privApprovePct = (
      ((topPriv1.count + topPriv2.count) / kStats.privValid) *
      100
    ).toFixed(1);

    return [
      {
        id: 'kawauchi-overview',
        badge:
          audienceMode === 'resident'
            ? `住民のみなさまへのご報告（全${kStats.total}件）`
            : `施設跡地活用部会 基礎データ総括（全${kStats.total}件）`,
        title:
          audienceMode === 'resident'
            ? config.residentTitle
            : config.stakeholderTitle,
        subtitle:
          config.customSubtitle ||
          `統合集計（Web回答 ${kStats.webCount}件［${kStats.webPct}%］／ 紙回答 ${kStats.paperCount}件［${kStats.paperPct}%］／ 全${kStats.distCount}地区網羅）`,
        digestIncluded: true,
        audience: 'both',
        renderContent: () => (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200">
                <div className="text-xs font-bold text-emerald-800">
                  総回答数（全{kStats.distCount}地区）
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
                  {kStats.total}
                  <span className="text-sm font-bold ml-1">件</span>
                </div>
                <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                  Web {kStats.webCount}件({kStats.webPct}%) ＋ 紙{' '}
                  {kStats.paperCount}件({kStats.paperPct}%)
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200">
                <div className="text-xs font-bold text-blue-800">
                  {config.qBldgLabel} 1位
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-950 mt-1">
                  {topBldg.pct.toFixed(1)}
                  <span className="text-sm font-bold ml-1">%</span>
                </div>
                <div className="text-[11px] text-blue-700 mt-1 font-medium truncate">
                  「{topBldg.label}」({topBldg.count}件)
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200">
                <div className="text-xs font-bold text-amber-800">
                  {config.qFuncLabel} 1位
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-950 mt-1">
                  {topFunc1.pct.toFixed(1)}
                  <span className="text-sm font-bold ml-1">%</span>
                </div>
                <div className="text-[11px] text-amber-800 mt-1 font-medium truncate">
                  「{topFunc1.label}」({topFunc1.count}票)
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/90 border border-indigo-200">
                <div className="text-xs font-bold text-indigo-800">
                  {config.qPrivLabel} 上位2項計
                </div>
                <div className="text-2xl sm:text-3xl font-black text-indigo-950 mt-1">
                  {privApprovePct}
                  <span className="text-sm font-bold ml-1">%</span>
                </div>
                <div className="text-[11px] text-indigo-700 mt-1 font-medium truncate">
                  1位: {topPriv1.label} ({topPriv1.count}件)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  👥 回答経路（Web {kStats.webCount}件 vs 紙 {kStats.paperCount}件）の世代補完構造
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  デジタル回答（Web）と紙回答を統合したことで、現役・子育て層から地域の維持管理を担うシニア層まで全世代の視座が揃った基礎データとなっています。
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-950 text-white space-y-2">
                <h4 className="text-xs sm:text-sm font-extrabold text-emerald-300">
                  ✨ 3つの明確な合意点（コンセンサス）
                </h4>
                <p className="text-xs text-emerald-50 leading-relaxed">
                  ①建物方針は<strong>「{topBldg.label}（{topBldg.pct.toFixed(1)}%）</strong>が最多。<br />
                  ②最優先機能は<strong>「{topFunc1.label}」「{topFunc2.label}」「{topFunc3.label}」</strong>。<br />
                  ③維持負担軽減のため<strong>「{topPriv1.label}（{topPriv1.count}件）」</strong>と<strong>「{topSust1.label}（{topSust1.count}票）」</strong>を軸とした運営設計が必要。
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'kawauchi-q2-q3',
        badge: '問2・問3の集計結果',
        title: `${config.qBldgLabel} と ${config.qFuncLabel}`,
        subtitle: '各項目の得票数と割合（Web回答・紙回答の内訳つき）',
        digestIncluded: true,
        audience: 'both',
        renderContent: () => (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5 p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                🏢 {config.qBldgLabel}（有効{kStats.bldgValid}件）
              </h4>
              <div className="space-y-2.5">
                {kStats.bldgBars.slice(0, 6).map(renderToneBar)}
              </div>
            </div>
            <div className="lg:col-span-7 p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                🎯 {config.qFuncLabel}（対{kStats.total}名比）
              </h4>
              <div className="space-y-2">
                {kStats.funcBars.slice(0, 8).map(renderToneBar)}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'kawauchi-q4-q5',
        badge: '問4・問5の集計結果',
        title: `${config.qPrivLabel} と ${config.qSustLabel}`,
        subtitle:
          '住民ボランティア頼みの維持から、受益者負担と条件付き民間誘致のハイブリッド運営へ',
        digestIncluded: true,
        audience: 'both',
        renderContent: () => (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                🤝 {config.qPrivLabel}（有効{kStats.privValid}件）
              </h4>
              <div className="space-y-2.5">
                {kStats.privBars.slice(0, 6).map(renderToneBar)}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                🌱 {config.qSustLabel}
              </h4>
              <div className="space-y-2">
                {kStats.sustBars.slice(0, 6).map(renderToneBar)}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'kawauchi-insights-and-questions',
        badge: '部会討議用 インサイト＆討議の問い',
        title: `自由記述（${kStats.commentRows.length}件）と、活用部会で決断すべき「討議の問い」`,
        subtitle:
          'アンケート結果を具体的な合意形成・アクションへつなげるためのアジェンダ',
        digestIncluded: true,
        audience: 'both',
        renderContent: () => (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
              {kStats.commentRows.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-xl bg-amber-50/80 border border-amber-200"
                >
                  <div className="font-bold text-amber-900 mb-0.5">
                    [#{r.id} / {r.src}] {r.a}・{r.d}
                  </div>
                  <p className="text-slate-800 leading-relaxed">{r.c}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="font-black text-slate-900">
                  問い1（空間の選別）：「{topBldg.label}」をどう具体化するか？
                </div>
                <p className="text-slate-600 mt-1">
                  上位機能（{topFunc1.label}・{topFunc2.label}）に必要なエリアと、解体・減築する老朽エリアをどう線引きするか。
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="font-black text-slate-900">
                  問い2（民間条件）：「{topPriv1.label}」の安心を担保する3原則とは？
                </div>
                <p className="text-slate-600 mt-1">
                  災害時の即時避難開放・体育館等の地域開放枠・住環境保護の3条件をどう協定化するか。
                </p>
              </div>
            </div>
          </div>
        ),
      },
    ];
  }, [kStats, config, audienceMode]);

  const activePages =
    datasetMode === 'kawauchi_187' ? kawauchiPages : yanaiPages;

  const visiblePages = useMemo(() => {
    return activePages.filter((page) => {
      if (page.audience !== 'both' && page.audience !== audienceMode) {
        return false;
      }
      if (depthMode === 'digest' && !page.digestIncluded) {
        return false;
      }
      return true;
    });
  }, [activePages, audienceMode, depthMode]);

  const safeSlideIdx = Math.min(
    currentSlideIdx,
    Math.max(0, visiblePages.length - 1)
  );

  // クロス集計（records用）
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (sourceFilter !== 'all' && r.src !== sourceFilter) return false;
      return true;
    });
  }, [records, sourceFilter]);

  const pivotData = useMemo(() => {
    const rowValues = getUniqueAxisValues(filteredRecords, rowAxis);
    const colValues = getUniqueAxisValues(filteredRecords, colAxis);

    const matrix = rowValues.map((rVal) => {
      const matchingRowRecords = filteredRecords.filter((rec) =>
        recordMatchesValue(rec, rowAxis, rVal)
      );
      const rowTotal = matchingRowRecords.length;
      const cells = colValues.map((cVal) => {
        const count = matchingRowRecords.filter((rec) =>
          recordMatchesValue(rec, colAxis, cVal)
        ).length;
        const pctOfRow = rowTotal > 0 ? (count / rowTotal) * 100 : 0;
        return { colVal: cVal, count, pctOfRow };
      });
      return { rowVal: rVal, rowTotal, cells };
    });

    return { rowValues, colValues, matrix };
  }, [filteredRecords, rowAxis, colAxis]);

  const searchedRawRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return filteredRecords.filter((r) => {
      if (onlyComments && !r.c) return false;
      if (!q) return true;
      const hay = `${r.id} ${r.src} ${r.d} ${r.a} ${r.b} ${r.f.join(' ')} ${r.p} ${r.i.join(' ')} ${r.c}`.toLowerCase();
      return hay.includes(q);
    });
  }, [filteredRecords, searchQuery, onlyComments]);

  const applyPreset = (
    aud: ReportAudienceMode,
    dep: ReportDepthMode,
    fmt: ReportFormatMode
  ) => {
    setAudienceMode(aud);
    setDepthMode(dep);
    setFormatMode(fmt);
    setCurrentSlideIdx(0);
  };

  return (
    <div
      className={`bg-slate-100 rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all relative ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none overflow-y-auto' : ''
      }`}
    >
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs font-bold">
          {toastMsg}
        </div>
      )}

      {/* 上部コントロールヘッダー */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 border-b border-slate-800 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setActiveDrawer(activeDrawer === 'config' ? 'none' : 'config')
              }
              title="クリックしてタイトル・設問ラベルを編集"
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-md font-black text-base cursor-pointer"
            >
              {config.badgeText || '共'}
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  汎用アンケート分析＆対話支援スイート
                </span>
                <span className="text-xs text-slate-400">
                  {config.organizationName}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black tracking-tight mt-0.5">
                {config.appTitle}
              </h2>
            </div>
          </div>

          {/* データセット切替 ＋ Google取込・タイトル設定・印刷 */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setDatasetMode('yanai_dynamic');
                  setCurrentSlideIdx(0);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 transition cursor-pointer ${
                  datasetMode === 'yanai_dynamic'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>柳井まちなか ({rows.length}件)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDatasetMode('kawauchi_187');
                  setCurrentSlideIdx(0);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 transition cursor-pointer ${
                  datasetMode === 'kawauchi_187'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>シート取込 / 旧河内小 ({kStats.total}件)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveDrawer(activeDrawer === 'data' ? 'none' : 'data')
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Googleシート/フォーム取込</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveDrawer(activeDrawer === 'config' ? 'none' : 'config')
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>タイトル・設問変更</span>
            </button>

            <a
              href="/kawauchi_survey_suite.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>専用フル画面(HTML)</span>
            </a>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>印刷</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* ドロワー①：Googleシート/フォーム連携 */}
        {activeDrawer === 'data' && (
          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-800 border border-blue-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-black text-white">
                  Googleスプレッドシート ／ Googleフォーム共有URL データ取込
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDrawer('none')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>閉じる</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2.5">
                <div className="text-xs font-extrabold text-blue-300">
                  ① Googleスプレッドシート共有URLからデータを取り込む
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="url"
                    value={config.sheetUrl}
                    onChange={(e) =>
                      setConfig({ ...config, sheetUrl: e.target.value })
                    }
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="sm:col-span-8 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={config.sheetNameOrGid}
                    onChange={(e) =>
                      setConfig({ ...config, sheetNameOrGid: e.target.value })
                    }
                    placeholder="シート名 (例: 全アンケート)"
                    className="sm:col-span-4 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-xs text-white"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-slate-400">
                    現在件数: <b className="text-white">{records.length}件</b>
                    {config.lastSyncAt ? `（更新: ${config.lastSyncAt}）` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSyncFromGoogleSheet()}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`}
                    />
                    <span>スプレッドシートから取り込む</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-xs font-extrabold text-emerald-300">
                    ② Googleフォーム共有URL（回答受付・QR表示）
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={config.formUrl}
                      onChange={(e) =>
                        setConfig({ ...config, formUrl: e.target.value })
                      }
                      placeholder="https://docs.google.com/forms/d/e/.../viewform"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateAndSaveConfig(config);
                        setFormatMode('form');
                        setActiveDrawer('none');
                        showToast('✅ Googleフォーム回答タブを開きました');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shrink-0 cursor-pointer"
                    >
                      保存して表示
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-amber-300" />
                    <span>CSVファイル取込</span>
                    <input
                      type="file"
                      accept=".csv,.tsv,.txt"
                      onChange={handleCsvUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-600 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>旧河内小187件に戻す</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ドロワー②：アプリ設定（タイトル・設問変更） */}
        {activeDrawer === 'config' && (
          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-800 border border-amber-400/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-300" />
                <h3 className="text-sm font-black text-white">
                  タイトル・主催者・設問ラベルのカスタマイズ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDrawer('none')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>閉じる</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
              <div className="md:col-span-2">
                <label className="block text-slate-300 font-bold mb-1">
                  アイコン文字
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={config.badgeText}
                  onChange={(e) =>
                    setConfig({ ...config, badgeText: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white font-bold text-center"
                />
              </div>
              <div className="md:col-span-5">
                <label className="block text-slate-300 font-bold mb-1">
                  アプリ全体のメインタイトル
                </label>
                <input
                  type="text"
                  value={config.appTitle}
                  onChange={(e) =>
                    setConfig({ ...config, appTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white font-bold"
                />
              </div>
              <div className="md:col-span-5">
                <label className="block text-slate-300 font-bold mb-1">
                  主催・部会・協議会名
                </label>
                <input
                  type="text"
                  value={config.organizationName}
                  onChange={(e) =>
                    setConfig({ ...config, organizationName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  🏡 住民向けレポート表題
                </label>
                <input
                  type="text"
                  value={config.residentTitle}
                  onChange={(e) =>
                    setConfig({ ...config, residentTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  🧭 関係者・部会向けレポート表題
                </label>
                <input
                  type="text"
                  value={config.stakeholderTitle}
                  onChange={(e) =>
                    setConfig({ ...config, stakeholderTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700">
              <button
                type="button"
                onClick={handleExportBundleJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>設定＋データをJSON保存</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  updateAndSaveConfig(config);
                  setActiveDrawer('none');
                  showToast('✅ タイトル・設問設定を保存しました');
                }}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-xs cursor-pointer"
              >
                ✅ 設定を保存して反映
              </button>
            </div>
          </div>
        )}

        {/* 3軸セレクター */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pt-4">
          <div className="bg-slate-800/90 p-2 rounded-2xl border border-slate-700/80 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
              ① 表示フォーマット
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1">
              <button
                type="button"
                onClick={() => setFormatMode('slide')}
                className={`px-2 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition cursor-pointer ${
                  formatMode === 'slide'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>スライド</span>
              </button>
              <button
                type="button"
                onClick={() => setFormatMode('a4')}
                className={`px-2 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition cursor-pointer ${
                  formatMode === 'a4'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>A4タテ</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDatasetMode('kawauchi_187');
                  setFormatMode('explore');
                }}
                className={`px-2 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition cursor-pointer ${
                  formatMode === 'explore'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <Table2 className="w-3.5 h-3.5" />
                <span>クロス集計</span>
              </button>
              <button
                type="button"
                onClick={() => setFormatMode('form')}
                className={`px-2 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition cursor-pointer ${
                  formatMode === 'form'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>フォーム</span>
              </button>
              <button
                type="button"
                onClick={() => setFormatMode('iframe_full')}
                className={`px-2 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition cursor-pointer ${
                  formatMode === 'iframe_full'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>HTML版</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800/90 p-2 rounded-2xl border border-slate-700/80 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
              ② レポート対象
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setAudienceMode('resident');
                  setCurrentSlideIdx(0);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  audienceMode === 'resident'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>🏡 住民・市民用</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAudienceMode('stakeholder');
                  setCurrentSlideIdx(0);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  audienceMode === 'stakeholder'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>🧭 関係者・部会用</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800/90 p-2 rounded-2xl border border-slate-700/80 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
              ③ 情報粒度
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setDepthMode('digest');
                  setCurrentSlideIdx(0);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  depthMode === 'digest'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>⚡ ダイジェスト版</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDepthMode('detailed');
                  setCurrentSlideIdx(0);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  depthMode === 'detailed'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📚 詳細版</span>
              </button>
            </div>
          </div>
        </div>

        {/* 8種プリセット */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1">
            8種プリセット:
          </span>
          {(
            [
              {
                label: '① 住民・要約・スライド',
                aud: 'resident',
                dep: 'digest',
                fmt: 'slide',
              },
              {
                label: '② 住民・詳細・スライド',
                aud: 'resident',
                dep: 'detailed',
                fmt: 'slide',
              },
              {
                label: '③ 住民・要約・A4タテ',
                aud: 'resident',
                dep: 'digest',
                fmt: 'a4',
              },
              {
                label: '④ 住民・詳細・A4タテ',
                aud: 'resident',
                dep: 'detailed',
                fmt: 'a4',
              },
              {
                label: '⑤ 部会・要約・スライド',
                aud: 'stakeholder',
                dep: 'digest',
                fmt: 'slide',
              },
              {
                label: '⑥ 部会・詳細・スライド',
                aud: 'stakeholder',
                dep: 'detailed',
                fmt: 'slide',
              },
              {
                label: '⑦ 部会・要約・A4タテ',
                aud: 'stakeholder',
                dep: 'digest',
                fmt: 'a4',
              },
              {
                label: '⑧ 部会・詳細・A4タテ',
                aud: 'stakeholder',
                dep: 'detailed',
                fmt: 'a4',
              },
            ] as const
          ).map((p) => {
            const active =
              formatMode === p.fmt &&
              audienceMode === p.aud &&
              depthMode === p.dep;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p.aud, p.dep, p.fmt)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'bg-amber-400 text-slate-950 font-extrabold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 sm:p-6">
        {formatMode === 'iframe_full' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">
                🌐 スタンドアロンアンケート分析アプリ（kawauchi_survey_suite.html）
              </span>
              <a
                href="/kawauchi_survey_suite.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline font-extrabold inline-flex items-center gap-1"
              >
                <span>新しいタブで開く</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <iframe
              src="/kawauchi_survey_suite.html"
              title="統合レポートスイート"
              className="w-full h-[860px] border-0"
            />
          </div>
        )}

        {formatMode === 'form' && (
          <div>
            {config.formUrl ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 h-fit">
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold">
                    Googleフォーム連携・QR共有
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    {config.appTitle}
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(config.formUrl)}`}
                      alt="Google Form QR"
                      className="w-40 h-40 rounded-lg border border-slate-200 bg-white p-2"
                    />
                    <a
                      href={config.formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-xs font-extrabold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Googleフォームを別タブで開く</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSyncFromGoogleSheet()}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs transition cursor-pointer"
                  >
                    🔄 回答スプレッドシートから最新データを同期
                  </button>
                </div>
                <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                  <iframe
                    src={toEmbedGoogleFormUrl(config.formUrl)}
                    title="Google Form"
                    className="w-full h-[780px] border-0"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-xl mx-auto space-y-4">
                <QrCode className="w-12 h-12 text-blue-600 mx-auto" />
                <h3 className="text-lg font-black text-slate-900">
                  Googleフォームの共有URLがまだ設定されていません
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  上部の「🔗 Googleシート/フォーム取込」からGoogleフォームの共有URLを貼り付けると、ここに回答フォームとQRコードが表示されます。
                </p>
                <button
                  type="button"
                  onClick={() => setActiveDrawer('data')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-xs cursor-pointer"
                >
                  🔗 GoogleフォームURLを設定する
                </button>
              </div>
            )}
          </div>
        )}

        {(formatMode === 'slide' || formatMode === 'a4') && (
          <div className="space-y-5">
            {formatMode === 'slide' && (
              <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs print:hidden">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentSlideIdx(Math.max(0, safeSlideIdx - 1))
                    }
                    disabled={safeSlideIdx === 0 || !slideSingleView}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>前のスライド</span>
                  </button>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-mono font-bold">
                    Slide {safeSlideIdx + 1} / {visiblePages.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentSlideIdx(
                        Math.min(visiblePages.length - 1, safeSlideIdx + 1)
                      )
                    }
                    disabled={
                      safeSlideIdx >= visiblePages.length - 1 || !slideSingleView
                    }
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <span>次のスライド</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSlideSingleView(!slideSingleView)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100 transition cursor-pointer"
                >
                  {slideSingleView
                    ? '📑 全スライドを縦に一覧表示する'
                    : '🖥️ 1枚ずつプロジェクター投影する'}
                </button>
              </div>
            )}

            <div
              className={
                formatMode === 'a4'
                  ? 'max-w-4xl mx-auto space-y-6'
                  : 'max-w-6xl mx-auto space-y-6'
              }
            >
              {(formatMode === 'slide' && slideSingleView
                ? [visiblePages[safeSlideIdx]]
                : visiblePages
              ).map((page, idx) => {
                if (!page) return null;
                const displayNum =
                  formatMode === 'slide' && slideSingleView
                    ? safeSlideIdx + 1
                    : idx + 1;
                return (
                  <article
                    key={page.id}
                    className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between ${
                      formatMode === 'slide'
                        ? 'min-h-[520px] p-6 sm:p-8'
                        : 'p-6 sm:p-10 print:shadow-none print:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b-2 border-slate-900/10">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900">
                            {page.badge}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            {audienceMode === 'resident'
                              ? '【住民・市民公開用】'
                              : '【部会・関係者討議用】'}{' '}
                            {depthMode === 'digest'
                              ? 'ダイジェスト版'
                              : '詳細分析版'}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          Page {displayNum} / {visiblePages.length}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
                        {page.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-5">
                        {page.subtitle}
                      </p>

                      <div>{page.renderContent()}</div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                      <span>{config.appTitle}</span>
                      <span>{config.organizationName}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {formatMode === 'explore' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <Table2 className="w-5 h-5 text-emerald-700" />
                    <span>
                      全{kStats.total}件（Web{kStats.webCount}＋紙{kStats.paperCount}）自由クロス集計
                    </span>
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {(['all', 'Web', '紙'] as const).map((srcKey) => (
                    <button
                      key={srcKey}
                      type="button"
                      onClick={() => setSourceFilter(srcKey)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                        sourceFilter === srcKey
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {srcKey === 'all' && `全体 (${kStats.total}件)`}
                      {srcKey === 'Web' && `Web回答 (${kStats.webCount}件)`}
                      {srcKey === '紙' && `紙回答 (${kStats.paperCount}件)`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    行（タテ軸）
                  </label>
                  <select
                    value={rowAxis}
                    onChange={(e) => setRowAxis(e.target.value as PivotAxisKey)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 bg-slate-50"
                  >
                    {(Object.keys(axisLabels) as PivotAxisKey[]).map((k) => (
                      <option key={k} value={k}>
                        {axisLabels[k]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    列（ヨコ軸）
                  </label>
                  <select
                    value={colAxis}
                    onChange={(e) => setColAxis(e.target.value as PivotAxisKey)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 bg-slate-50"
                  >
                    {(Object.keys(axisLabels) as PivotAxisKey[]).map((k) => (
                      <option key={k} value={k}>
                        {axisLabels[k]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="p-2.5 text-left font-extrabold border-r border-slate-700">
                        {axisLabels[rowAxis]} ＼ {axisLabels[colAxis]}
                      </th>
                      <th className="p-2.5 text-right font-extrabold bg-slate-800 border-r border-slate-700">
                        行合計
                      </th>
                      {pivotData.colValues.map((cVal) => (
                        <th
                          key={cVal}
                          className="p-2.5 text-right font-bold border-r border-slate-800"
                        >
                          {cVal}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pivotData.matrix.map((row) => (
                      <tr key={row.rowVal} className="hover:bg-slate-50">
                        <td className="p-2.5 font-extrabold text-slate-900 bg-slate-50 border-r border-slate-200">
                          {row.rowVal}
                        </td>
                        <td className="p-2.5 text-right font-black text-slate-900 bg-slate-100 border-r border-slate-200">
                          {row.rowTotal}件
                        </td>
                        {row.cells.map((cell) => (
                          <td
                            key={cell.colVal}
                            className="p-2.5 text-right border-r border-slate-100"
                          >
                            <div className="font-extrabold text-slate-900">
                              {cell.count}件
                            </div>
                            <div className="text-[10px] text-slate-500">
                              ({cell.pctOfRow.toFixed(1)}%)
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-black text-slate-900">
                  全{kStats.total}件 回答データ＆自由記述一覧（該当{' '}
                  {searchedRawRecords.length} 件）
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyComments}
                      onChange={(e) => setOnlyComments(e.target.checked)}
                    />
                    <span>
                      自由記述あり（{kStats.commentRows.length}件）のみ
                    </span>
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="キーワード検索..."
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs w-48"
                  />
                </div>
              </div>

              <div className="max-h-[460px] overflow-y-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-100 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-2 text-left">No.</th>
                      <th className="p-2 text-left">経路</th>
                      <th className="p-2 text-left">{config.qDistLabel}</th>
                      <th className="p-2 text-left">{config.qAgeLabel}</th>
                      <th className="p-2 text-left">{config.qBldgLabel}</th>
                      <th className="p-2 text-left">{config.qFuncLabel}</th>
                      <th className="p-2 text-left">{config.qPrivLabel}</th>
                      <th className="p-2 text-left">{config.qCommentLabel}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {searchedRawRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 align-top">
                        <td className="p-2 font-mono text-slate-400">#{r.id}</td>
                        <td className="p-2 font-bold">{r.src}</td>
                        <td className="p-2 font-bold">{r.d}</td>
                        <td className="p-2">{r.a}</td>
                        <td className="p-2">{r.b}</td>
                        <td className="p-2">{r.f.join(' / ')}</td>
                        <td className="p-2">{r.p}</td>
                        <td className="p-2">{r.c || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyReportSuite;
