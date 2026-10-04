/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  FileSpreadsheet,
  Users,
  Compass,
  Sparkles,
  Layers,
  Database,
  RefreshCw,
  Eye,
  Building,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  Home,
  Table,
  Link2,
  BarChart3,
  MessageSquare,
  BookOpen,
  Menu,
  X,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Heart,
  Lightbulb,
  ChevronRight,
  FileText,
} from "lucide-react";
import { ColumnMapping, SurveyRow } from "../../types/survey";
import { parseRawText, detectColumnMapping, buildSurveyRows } from "../../utils/parser";
import { SAMPLE_TSV_DATA } from "../../utils/sampleData";
import {
  analyzeSurveyData,
  generateFacilitationMarkdown,
  analyzeCorrelations,
} from "../../utils/analysis";
import { DataImporter } from "./DataImporter";
import { ColumnMapper } from "./ColumnMapper";
import { FacilitatorInsightView } from "./FacilitatorInsightView";
import { ChartsDashboard } from "./ChartsDashboard";
import { RawDataModal } from "./RawDataModal";
import { CorrelationAnalysisView } from "./CorrelationAnalysisView";
import { CustomPivotTable } from "./CustomPivotTable";
import { AnalysisGuideModal } from "./AnalysisGuideModal";

type TabType = "home" | "correlations" | "pivot" | "charts" | "all";

export function SurveyApp() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    q1: 1,
    q2: 2,
    q3: 3,
    q4: 4,
    q5: 5,
    q6: 6,
    q7: 7,
    q8: 8,
    q9: 9,
  });
  const [dataSourceName, setDataSourceName] = useState<string>("");
  const [isMapperOpen, setIsMapperOpen] = useState(false);
  const [isRawModalOpen, setIsRawModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active View Tab (Default: home)
  const [activeViewTab, setActiveViewTab] = useState<TabType>("home");

  // Filters
  const [filterJichikai, setFilterJichikai] = useState<string>("all");
  const [filterAge, setFilterAge] = useState<string>("all");
  const [filterHousehold, setFilterHousehold] = useState<string>("all");

  // AI-generated markdown (if triggered), otherwise defaults to computed markdown
  const [aiMarkdown, setAiMarkdown] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Production mode: Start blank. Removed sample data.
  useEffect(() => {
    // Intentionally left blank for production so users import their own data
  }, []);

  // When data is imported via Google Sheets, Excel upload, or paste
  const handleDataLoaded = (
    newHeaders: string[],
    newRows: string[][],
    sourceName: string
  ) => {
    setHeaders(newHeaders);
    setRawRows(newRows);
    setDataSourceName(sourceName);
    const detected = detectColumnMapping(newHeaders);
    setMapping(detected);
    setAiMarkdown(null); // Reset custom AI text on new data import
    // Reset filters
    setFilterJichikai("all");
    setFilterAge("all");
    setFilterHousehold("all");
  };

  // Convert raw string rows into normalized SurveyRows
  const allSurveyRows = useMemo(() => {
    if (headers.length === 0 || rawRows.length === 0) return [];
    return buildSurveyRows(headers, rawRows, mapping);
  }, [headers, rawRows, mapping]);

  // Apply active filters
  const filteredSurveyRows = useMemo(() => {
    return allSurveyRows.filter((r) => {
      if (filterJichikai !== "all" && r.q1_jichikai !== filterJichikai) return false;
      if (filterAge !== "all" && r.q3_age !== filterAge) return false;
      if (filterHousehold !== "all" && r.q4_household !== filterHousehold) return false;
      return true;
    });
  }, [allSurveyRows, filterJichikai, filterAge, filterHousehold]);

  // Analyze dataset
  const summary = useMemo(() => {
    return analyzeSurveyData(filteredSurveyRows);
  }, [filteredSurveyRows]);

  // Analyze individual respondent correlations (Q5 x Q7 x Q8)
  const correlations = useMemo(() => {
    return analyzeCorrelations(filteredSurveyRows);
  }, [filteredSurveyRows]);

  // Generate deterministic facilitator markdown report
  const deterministicMarkdown = useMemo(() => {
    return generateFacilitationMarkdown(summary);
  }, [summary]);

  const activeMarkdown = aiMarkdown || deterministicMarkdown;

  // AI Deep-dive analysis trigger via backend
  const handleTriggerAiAnalysis = async (extraPrompt?: string) => {
    setIsAiLoading(true);
    try {
      const topPrides = summary.prideRanking.slice(0, 5).map((p) => `${p.name} (${p.count}票)`);
      const topWorries = summary.worryRanking.slice(0, 5).map((w) => `${w.name} (${w.count}票)`);
      const topHopes = summary.hopeRanking.slice(0, 5).map((h) => `${h.name} (${h.count}票)`);

      const summaryPayload = {
        totalCount: summary.totalCount,
        topPrides,
        topWorries,
        topHopes,
        ageSummary: summary.ageDistribution,
        youngVoice: {
          worry: summary.youngTopWorry,
          hope: summary.youngTopHope,
        },
        seniorVoice: {
          worry: summary.seniorTopWorry,
          hope: summary.seniorTopHope,
        },
        childRearingVoice: {
          worry: summary.childRearingTopWorry,
          hope: summary.childRearingTopHope,
        },
        opinions: summary.opinions.slice(0, 10),
      };

      const rawSample = filteredSurveyRows
        .slice(0, 10)
        .map(
          (r, i) =>
            `[${i + 1}] 地区: ${r.q1_jichikai}, 年代: ${r.q3_age}, 世帯: ${r.q4_household}, 不安: ${r.q7_worry.join("/")}, 期待: ${r.q8_hope.join("/")}, 自由意見: "${r.q9_opinion || "なし"}"`
        )
        .join("\n");

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summaryData: summaryPayload,
          rawSample,
          promptExtra: extraPrompt,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "AI分析の呼び出しに失敗しました。");
      }

      const data = await res.json();
      if (data.markdown) {
        setAiMarkdown(data.markdown);
      }
    } catch (err: any) {
      console.warn("AI fallback used:", err);
      // Fallback: keep high-precision deterministic markdown
      setAiMarkdown(deterministicMarkdown);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filter option lists
  const jichikaiOptions = useMemo(() => {
    return Array.from(new Set(allSurveyRows.map((r) => r.q1_jichikai || "").filter(Boolean)));
  }, [allSurveyRows]);

  const ageOptions = useMemo(() => {
    return Array.from(new Set(allSurveyRows.map((r) => r.q3_age || "").filter(Boolean)));
  }, [allSurveyRows]);

  const householdOptions = useMemo(() => {
    return Array.from(new Set(allSurveyRows.map((r) => r.q4_household || "").filter(Boolean)));
  }, [allSurveyRows]);

  // Home Navigation Handler
  const handleGoHome = () => {
    setActiveViewTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const handleSelectTab = (tab: TabType) => {
    setActiveViewTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  // Quick metrics for Home portal
  const topPrideItem = summary.prideRanking[0];
  const topWorryItem = summary.worryRanking[0];
  const topHopeItem = summary.hopeRanking[0];
  const topJichikaiItem = summary.jichikaiDistribution[0];

  const prideRate = topPrideItem
    ? Math.round((topPrideItem.count / (filteredSurveyRows.length || 1)) * 100)
    : 0;
  const worryRate = topWorryItem
    ? Math.round((topWorryItem.count / (filteredSurveyRows.length || 1)) * 100)
    : 0;
  const hopeRate = topHopeItem
    ? Math.round((topHopeItem.count / (filteredSurveyRows.length || 1)) * 100)
    : 0;

  // Global Navigation Item Definitions
  const navItems: {
    id: TabType;
    label: string;
    subLabel: string;
    badge?: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: "home",
      label: "ホーム",
      subLabel: "全体概要・対話設計",
      icon: Home,
    },
    {
      id: "correlations",
      label: "相関分析",
      subLabel: "強み×課題×期待",
      badge: "深掘り",
      icon: Link2,
    },
    {
      id: "pivot",
      label: "クロス集計",
      subLabel: "自由ピボット表",
      badge: "自由分析",
      icon: Table,
    },
    {
      id: "charts",
      label: "基本グラフ",
      subLabel: "全8問の回答分布",
      icon: BarChart3,
    },
    {
      id: "all",
      label: "全セクション",
      subLabel: "一括表示・印刷",
      icon: Layers,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 sm:pb-16 text-slate-800 antialiased">
      {/* Top Municipal Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Top Bar: Brand, Title & Quick Actions */}
          <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
            {/* Clickable Brand / Home Button */}
            <button
              id="btn-brand-home"
              type="button"
              onClick={handleGoHome}
              className="flex items-center gap-2.5 sm:gap-3 text-left group hover:opacity-90 transition focus:outline-none"
              title="ホーム（全体サマリー・対話設計）へ戻る"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 flex items-center justify-center text-white shadow-xs group-hover:shadow-md transition">
                <Compass className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200/70">
                    山口県柳井市
                  </span>
                  <span className="hidden md:inline text-[11px] font-medium text-slate-500">
                    まちなかまちづくり対話支援システム
                  </span>
                </div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 tracking-tight leading-tight truncate">
                  まちなかアンケート クロス集計ダッシュボード
                </h1>
              </div>
            </button>

            {/* Desktop / Tablet Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                id="btn-open-guide-modal"
                type="button"
                onClick={() => setIsGuideOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-lg transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>分析項目ガイド</span>
              </button>

              <button
                id="btn-view-raw-modal"
                type="button"
                onClick={() => setIsRawModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/90 rounded-lg transition"
              >
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                <span>回答データ一覧 ({allSurveyRows.length}件)</span>
              </button>

              <button
                id="btn-toggle-data-importer"
                type="button"
                onClick={() => setIsImporterOpen(!isImporterOpen)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition border shadow-2xs ${
                  isImporterOpen
                    ? "text-blue-900 bg-blue-100 border-blue-300"
                    : "text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200"
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-700" />
                <span>データ取り込み</span>
                {isImporterOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                )}
              </button>
            </div>

            {/* Mobile / Tablet Medium Right Actions */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                id="btn-mobile-toggle-importer"
                type="button"
                onClick={() => setIsImporterOpen(!isImporterOpen)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition border ${
                  isImporterOpen
                    ? "text-blue-800 bg-blue-100 border-blue-300"
                    : "text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200"
                }`}
                title="データ取り込み画面"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">データ取り込み</span>
              </button>

              <button
                id="btn-mobile-menu-toggle"
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                aria-label="メニューを開く"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Global Menu Bar (Desktop & Tablet Horizontal Navigation) */}
          <nav className="border-t border-slate-100 py-1.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 sm:gap-2 min-w-max">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeViewTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`group relative px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 whitespace-nowrap min-h-[38px] ${
                      isActive
                        ? "bg-blue-700 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/90"
                    }`}
                  >
                    <IconComponent
                      className={`w-3.5 h-3.5 ${
                        isActive ? "text-white" : "text-slate-500 group-hover:text-slate-800"
                      }`}
                    />
                    <div className="flex flex-col items-start leading-tight">
                      <div className="flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              isActive
                                ? "bg-blue-500 text-white"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span
                        className={`hidden md:block text-[10px] font-normal ${
                          isActive ? "text-blue-100" : "text-slate-400 group-hover:text-slate-500"
                        }`}
                      >
                        {item.subLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Home shortcut & View Toggle on larger screens */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              {activeViewTab !== "home" && (
                <button
                  type="button"
                  onClick={handleGoHome}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-md transition font-medium"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>ホームへ</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer / Full Navigation Modal */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/50 backdrop-blur-xs flex flex-col justify-end animate-fadeIn">
          <div className="bg-white rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl border-t border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  グローバルメニュー
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                主要機能ナビゲーション
              </p>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeViewTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                      isActive
                        ? "bg-blue-700 text-white font-bold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4" />
                      <div className="text-left">
                        <div className="text-sm font-bold">{item.label}</div>
                        <div className={`text-[11px] ${isActive ? "text-blue-100" : "text-slate-400"}`}>
                          {item.subLabel}
                        </div>
                      </div>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isActive ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-700"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Utility Actions in Mobile */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                データ・設定ツール
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsImporterOpen(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Googleフォーム / CSVデータ取り込み
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsRawModalOpen(true);
                }}
                className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  回答元データ一覧 ({allSurveyRows.length}件)
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsGuideOpen(true);
                }}
                className="w-full px-3 py-2 text-xs font-semibold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  分析項目・設問定義ガイド
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-5 sm:space-y-6">
        {/* Source Badge & Filter Toolbar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              現在の読込データ:
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-medium border border-slate-200 truncate max-w-[200px] sm:max-w-none">
              {dataSourceName || "データなし"}
            </span>
            <button
              id="btn-inline-open-importer"
              type="button"
              onClick={() => setIsImporterOpen(!isImporterOpen)}
              className="text-[11px] text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              {isImporterOpen ? "取り込み画面を閉じる" : "データを再読み込み・変更"}
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="w-full sm:w-auto mt-1 sm:mt-0 text-slate-600">
              有効回答: <strong className="text-blue-700 font-bold">{filteredSurveyRows.length}</strong> / {allSurveyRows.length} 件
            </span>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
            <div className="flex items-center gap-1 text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>地区:</span>
            </div>
            <select
              value={filterJichikai}
              onChange={(e) => setFilterJichikai(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            >
              <option value="all">全地区</option>
              {jichikaiOptions.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>

            <span className="text-slate-300">/</span>

            <div className="flex items-center gap-1 text-slate-500 font-medium">
              <span>年代:</span>
            </div>
            <select
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            >
              <option value="all">全世代</option>
              {ageOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            {(filterJichikai !== "all" || filterAge !== "all" || filterHousehold !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setFilterJichikai("all");
                  setFilterAge("all");
                  setFilterHousehold("all");
                }}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold hover:underline ml-1 px-1.5 py-0.5 rounded bg-blue-50"
              >
                リセット
              </button>
            )}
          </div>
        </div>

        {/* Section: Data Importer (Closed by default, opens on button click with close button or via floating modal) */}
        {isImporterOpen && (
          <div className="relative animate-fadeIn">
            <DataImporter
              onDataLoaded={(h, r, s) => {
                handleDataLoaded(h, r, s);
                setIsImporterOpen(false);
              }}
              onClose={() => setIsImporterOpen(false)}
              isModal={false}
            />
          </div>
        )}

        {/* Section: Column Mapper (collapsible check) */}
        {headers.length > 0 && (
          <ColumnMapper
            headers={headers}
            mapping={mapping}
            onMappingChange={setMapping}
            isOpen={isMapperOpen}
            onToggle={() => setIsMapperOpen(!isMapperOpen)}
          />
        )}

                {/* Data Importer Block (If no data loaded yet) */}
        {headers.length === 0 && !isImporterOpen && (
          <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-slate-300 text-center flex flex-col items-center justify-center space-y-4 my-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">データが未取り込みです</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                上の「データ取り込み (上書き)」ボタンをクリックして、Googleフォームの回答スプレッドシートやCSVファイルを読み込んでください。
              </p>
            </div>
            <button
              onClick={() => setIsImporterOpen(true)}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet className="w-5 h-5" />
              データを読み込む
            </button>
          </div>
        )}

        {/* HOME VIEW: Portal Overview & Highlights */}
        {(activeViewTab === "home" || activeViewTab === "all") && (
          <div className="space-y-6">
            {/* Municipal Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {/* Card 1: Total Responses */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-start justify-between h-full">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-0.5">
                    有効回答サンプル数
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {filteredSurveyRows.length}
                    <span className="text-xs font-normal text-slate-500 ml-1">件</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    全 {allSurveyRows.length} 件中 (読込済み)
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2: Top Pride */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-start justify-between h-full">
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mb-0.5">
                    <Heart className="w-3.5 h-3.5" />
                    自慢・強み No.1
                  </span>
                  <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words" title={topPrideItem?.name}>
                    {topPrideItem?.name || "なし"}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    得票率: <strong className="text-emerald-600 font-bold">{prideRate}%</strong> ({topPrideItem?.count || 0}票)
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              {/* Card 3: Top Worry */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-start justify-between h-full">
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-semibold text-rose-600 flex items-center gap-1 mb-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    最大の不安・課題 No.1
                  </span>
                  <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words" title={topWorryItem?.name}>
                    {topWorryItem?.name || "なし"}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    懸念率: <strong className="text-rose-600 font-bold">{worryRate}%</strong> ({topWorryItem?.count || 0}票)
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              {/* Card 4: Top Hope */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-start justify-between h-full">
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 mb-0.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    住民の期待・要望 No.1
                  </span>
                  <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words" title={topHopeItem?.name}>
                    {topHopeItem?.name || "なし"}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    期待率: <strong className="text-indigo-600 font-bold">{hopeRate}%</strong> ({topHopeItem?.count || 0}票)
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Building className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Quick Navigation Tile Hub */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="max-w-3xl mb-4">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider inline-flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  柳井市 まちなか井戸端会議 総合ナビゲーション
                </span>
                <h2 className="text-lg sm:text-xl font-bold mt-2">
                  住民同士の対話を深める3つの分析アプローチ
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  アンケート結果を単なる集計で終わらせず、ワークショップの対話（問い立て）へと昇華させるための各機能へダイレクトにアクセスできます。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {/* Tile 1: Correlation */}
                <button
                  type="button"
                  onClick={() => handleSelectTab("correlations")}
                  className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl p-4 text-left transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center text-blue-300">
                        <Link2 className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-400/20 text-blue-200 border border-blue-400/30">
                        深掘り
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-200 transition">
                      同一回答 相関分析
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                      「白壁を誇る人が抱える不安」「空き家を懸念する人が望む未来」など個別回答の連動性を解明。
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-blue-300 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>相関分析を開く</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>

                {/* Tile 2: Pivot */}
                <button
                  type="button"
                  onClick={() => handleSelectTab("pivot")}
                  className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl p-4 text-left transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                        <Table className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                        自由分析
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-200 transition">
                      自由ピボットクロス集計
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                      自治会・年代・世帯を縦軸に、問5〜8を横軸に指定。行%/列%やCSV出力にも対応。
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-emerald-300 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>ピボット表を作成</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>

                {/* Tile 3: Charts */}
                <button
                  type="button"
                  onClick={() => handleSelectTab("charts")}
                  className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl p-4 text-left transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-400/20 text-indigo-200 border border-indigo-400/30">
                        ビジュアル
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-200 transition">
                      基本集計グラフ
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                      全8問の回答分布・比率チャート。地区別・世代別・自慢・困りごとの全体像をグラフィカルに把握。
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-indigo-300 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>グラフ一覧を見る</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>
            </div>

            {/* Overall Analytical Findings Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <FileText className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  【全体分析結果・傾向】まちなかアンケートから浮かび上がる住民意識の要約
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    人口・属性の傾向と生活実感
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    回答者の中心はシニア層（60代以上）および単身・夫婦の小規模世帯。日常の買い物や通院、歩行環境への切実な声が多い一方、現役・子育て世代からは「放課後や休日に子どもと滞在できる場所が中心部にない」という課題が寄せられています。
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    不安の第1位「空き家」と求められる処方箋
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    最大の不安は「{topWorryItem?.name}（{worryRate}%）」。しかし住民が望んでいるのは単なる取り壊しではなく、期待第1位の「{topHopeItem?.name}（{hopeRate}%）」が示す通り、「人が集い、会話が生まれる日常の居場所」への活用です。
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    不動の誇り「{topPrideItem?.name}」をどう活かすか
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    自慢第1位は「{topPrideItem?.name}（{prideRate}%）」。住民共通の誇りである歴史的景観を、観光客だけのものではなく「市民が日常的に歩いてお茶を飲み、交流できる親しみのある空間」へと再定義することが、まちづくりの求心力になります。
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    ワークショップ（井戸端会議）での対話の勘所
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    「行政への要望」にとどまらず、「この強みを活かして自分たちでできる小さな一歩は何か」「シニアの安心と若者の活気をどう掛け合わせるか」という前向きな問いを投げかけることで、住民同士の協働の輪を広げることができます。
                  </p>
                </div>
              </div>
            </div>

            {/* Facilitator Insights & Dialogue Questions */}
            <FacilitatorInsightView
              markdown={activeMarkdown}
              summary={summary}
              onRefreshAi={handleTriggerAiAnalysis}
              isAiLoading={isAiLoading}
            />
          </div>
        )}

        {/* View Section 2: Correlation & Co-occurrence Analysis (Q5 x Q7 x Q8) */}
        {(activeViewTab === "correlations" || activeViewTab === "all") && (
          <div className="space-y-4">
            {activeViewTab === "correlations" && (
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-blue-700" />
                    <span>同一回答 相関分析（強み×課題×期待）</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    一人の住民が同時に選んだ「自慢（問5）」「不安（問7）」「期待（問8）」の組み合わせ分析
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGoHome}
                  className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>ホームへ戻る</span>
                </button>
              </div>
            )}
            <CorrelationAnalysisView
              correlations={correlations}
              totalRespondents={filteredSurveyRows.length}
            />
          </div>
        )}

        {/* View Section 3: Custom Pivot Cross-Tabulation System */}
        {(activeViewTab === "pivot" || activeViewTab === "all") && (
          <div className="space-y-4">
            {activeViewTab === "pivot" && (
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Table className="w-5 h-5 text-blue-700" />
                    <span>自由ピボットクロス集計表</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    地区・年代・世帯構成と、各設問（問5〜問8）の自由な掛け合わせクロス集計と比率計算
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGoHome}
                  className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>ホームへ戻る</span>
                </button>
              </div>
            )}
            <CustomPivotTable rows={filteredSurveyRows} />
          </div>
        )}

        {/* View Section 4: Quantitative Visual Charts & Demographics */}
        {(activeViewTab === "charts" || activeViewTab === "all") && (
          <div className="space-y-4">
            {activeViewTab === "charts" && (
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-700" />
                    <span>基本集計グラフダッシュボード</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    全8問の回答割合・分布チャート（地区、年代、世帯、強み、利用施設、課題、期待）
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGoHome}
                  className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>ホームへ戻る</span>
                </button>
              </div>
            )}
            <ChartsDashboard summary={summary} />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Fixed bottom for Smartphones) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1 flex items-center justify-around">
        <button
          type="button"
          onClick={() => handleSelectTab("home")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition min-w-[56px] ${
            activeViewTab === "home" ? "text-blue-700 font-bold" : "text-slate-500"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">ホーム</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab("correlations")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition min-w-[56px] ${
            activeViewTab === "correlations" ? "text-blue-700 font-bold" : "text-slate-500"
          }`}
        >
          <Link2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">相関分析</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab("pivot")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition min-w-[56px] ${
            activeViewTab === "pivot" ? "text-blue-700 font-bold" : "text-slate-500"
          }`}
        >
          <Table className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">ピボット</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab("charts")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition min-w-[56px] ${
            activeViewTab === "charts" ? "text-blue-700 font-bold" : "text-slate-500"
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">グラフ</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-lg transition text-slate-500 min-w-[56px]"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">メニュー</span>
        </button>
      </nav>

      {/* Raw Data Modal */}
      <RawDataModal
        rows={allSurveyRows}
        headers={headers}
        isOpen={isRawModalOpen}
        onClose={() => setIsRawModalOpen(false)}
      />

      {/* Analysis Guide Specification Modal */}
      <AnalysisGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
