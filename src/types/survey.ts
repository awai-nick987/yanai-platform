export interface SurveyRow {
  id: string;
  raw: Record<string, string>;
  q1_jichikai?: string; // 問1: 自治会
  q2_gender?: string;   // 問2: 性別
  q3_age?: string;      // 問3: 年齢
  q4_household?: string;// 問4: 世帯構成
  q5_pride: string[];   // 問5: 自慢できるもの（3つ）
  q6_facilities: string[]; // 問6: 利用施設
  q7_worry: string[];   // 問7: 不安・困りごと（3つ）
  q8_hope: string[];    // 問8: あったらいいな（3つ）
  q9_opinion?: string;  // 問9: 自由意見
}

export interface ColumnMapping {
  q1: number; // 自治会
  q2: number; // 性別
  q3: number; // 年齢
  q4: number; // 世帯構成
  q5: number; // 自慢できるもの
  q6: number; // 利用施設
  q7: number; // 不安・困りごと
  q8: number; // あったらいいな
  q9: number; // 自由意見
}

export interface AggregatedCount {
  name: string;
  count: number;
  percentage: number;
}

export interface CrossTabItem {
  category: string;
  total: number;
  items: { [key: string]: number };
}

export interface SurveyOpinion {
  id: string;
  jichikai?: string;
  age?: string;
  household?: string;
  text: string;
}

export interface SurveyAnalysisSummary {
  totalCount: number;
  ageDistribution: AggregatedCount[];
  householdDistribution: AggregatedCount[];
  genderDistribution: AggregatedCount[];
  jichikaiDistribution: AggregatedCount[];
  prideRanking: AggregatedCount[];
  facilityRanking: AggregatedCount[];
  worryRanking: AggregatedCount[];
  hopeRanking: AggregatedCount[];
  
  // Cross tabulations
  ageToWorry: CrossTabItem[];
  ageToHope: CrossTabItem[];
  householdToWorry: CrossTabItem[];
  householdToHope: CrossTabItem[];
  
  // Generational contrast highlights
  youngTopWorry?: { name: string; count: number; percentage: number };
  youngTopHope?: { name: string; count: number; percentage: number };
  seniorTopWorry?: { name: string; count: number; percentage: number };
  seniorTopHope?: { name: string; count: number; percentage: number };
  
  childRearingTopHope?: { name: string; count: number; percentage: number };
  childRearingTopWorry?: { name: string; count: number; percentage: number };
  singleTopWorry?: { name: string; count: number; percentage: number };

  // Free opinions
  opinions: SurveyOpinion[];
}

export interface CorrelationItem {
  source: string;
  target: string;
  sourceCategory: string;
  targetCategory: string;
  coOccurrence: number;
  sourceCount: number;
  targetCount: number;
  conditionalProb: number;
  reverseProb: number;
  lift: number;
  jaccard: number;
}

export interface CorrelationAnalysisSummary {
  prideToWorry: CorrelationItem[];
  worryToHope: CorrelationItem[];
  prideToHope: CorrelationItem[];
  topStrongestPairs: CorrelationItem[];
  worryToPrimaryHope: {
    worry: string;
    worryCount: number;
    topHopes: {
      hope: string;
      count: number;
      percentage: number;
      lift: number;
    }[];
  }[];
  prideToPrimaryHope: {
    pride: string;
    prideCount: number;
    topHopes: {
      hope: string;
      count: number;
      percentage: number;
    }[];
  }[];
}

export type SurveyDimensionKey =
  | "q1_jichikai"
  | "q2_gender"
  | "q3_age"
  | "q4_household"
  | "q5_pride"
  | "q6_facilities"
  | "q7_worry"
  | "q8_hope";

export type PivotMetric = "count" | "row_percent" | "col_percent" | "total_percent";

export interface PivotTableData {
  rowDimension: SurveyDimensionKey;
  colDimension: SurveyDimensionKey;
  metric: PivotMetric;
  rowLabels: string[];
  colLabels: string[];
  matrix: Record<string, Record<string, number>>;
  rowTotals: Record<string, number>;
  colTotals: Record<string, number>;
  grandTotal: number;
  respondentCount: number;
}

