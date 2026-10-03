import {
  AggregatedCount,
  CrossTabItem,
  SurveyAnalysisSummary,
  SurveyRow,
  CorrelationItem,
  CorrelationAnalysisSummary,
  SurveyDimensionKey,
  PivotMetric,
  PivotTableData,
} from "../types/survey";

// Count occurrences helper
export function aggregateCounts(items: string[], totalDenom: number): AggregatedCount[] {
  const map: Record<string, number> = {};
  items.forEach((item) => {
    if (!item) return;
    map[item] = (map[item] || 0) + 1;
  });

  return Object.entries(map)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalDenom > 0 ? Math.round((count / totalDenom) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

// Cross tabulate primary category with multi-choice array items
export function crossTabulate(
  rows: SurveyRow[],
  categoryKey: "q3_age" | "q4_household" | "q1_jichikai",
  itemsKey: "q7_worry" | "q8_hope" | "q5_pride" | "q6_facilities"
): CrossTabItem[] {
  const groups: Record<string, { total: number; items: Record<string, number> }> = {};

  rows.forEach((row) => {
    const cat = row[categoryKey] || "未回答";
    if (!groups[cat]) {
      groups[cat] = { total: 0, items: {} };
    }
    groups[cat].total += 1;

    const list = row[itemsKey] || [];
    list.forEach((item) => {
      groups[cat].items[item] = (groups[cat].items[item] || 0) + 1;
    });
  });

  return Object.entries(groups).map(([category, data]) => ({
    category,
    total: data.total,
    items: data.items,
  }));
}

// Summarize entire survey dataset
export function analyzeSurveyData(rows: SurveyRow[]): SurveyAnalysisSummary {
  const total = rows.length;

  const ageDistribution = aggregateCounts(
    rows.map((r) => r.q3_age || "不明"),
    total
  );
  const householdDistribution = aggregateCounts(
    rows.map((r) => r.q4_household || "未回答"),
    total
  );
  const genderDistribution = aggregateCounts(
    rows.map((r) => r.q2_gender || "回答なし"),
    total
  );
  const jichikaiDistribution = aggregateCounts(
    rows.map((r) => r.q1_jichikai || "未回答"),
    total
  );

  const prideRanking = aggregateCounts(
    rows.flatMap((r) => r.q5_pride),
    total
  );
  const facilityRanking = aggregateCounts(
    rows.flatMap((r) => r.q6_facilities),
    total
  );
  const worryRanking = aggregateCounts(
    rows.flatMap((r) => r.q7_worry),
    total
  );
  const hopeRanking = aggregateCounts(
    rows.flatMap((r) => r.q8_hope),
    total
  );

  const ageToWorry = crossTabulate(rows, "q3_age", "q7_worry");
  const ageToHope = crossTabulate(rows, "q3_age", "q8_hope");
  const householdToWorry = crossTabulate(rows, "q4_household", "q7_worry");
  const householdToHope = crossTabulate(rows, "q4_household", "q8_hope");

  // Young/Child-rearing vs Senior contrasts
  const youngRows = rows.filter((r) => r.q3_age?.includes("20") || r.q3_age?.includes("30") || r.q3_age?.includes("40") || r.q3_age?.includes("10"));
  const seniorRows = rows.filter((r) => r.q3_age?.includes("60") || r.q3_age?.includes("70") || r.q3_age?.includes("80"));
  const childRearingRows = rows.filter((r) => r.q4_household?.includes("子育て") || r.q4_household?.includes("子ども") || r.q4_household?.includes("同居"));
  const singleRows = rows.filter((r) => r.q4_household?.includes("単身") || r.q4_household?.includes("1人") || r.q4_household?.includes("一人"));

  const getTop = (targetRows: SurveyRow[], key: "q7_worry" | "q8_hope") => {
    if (targetRows.length === 0) return undefined;
    const list = targetRows.flatMap((r) => r[key]);
    const agg = aggregateCounts(list, targetRows.length);
    return agg[0];
  };

  // Collect non-empty free opinions
  const opinions = rows
    .filter((r) => r.q9_opinion && r.q9_opinion.trim().length > 0)
    .map((r, idx) => ({
      id: `opinion-${idx + 1}`,
      jichikai: r.q1_jichikai,
      age: r.q3_age,
      household: r.q4_household,
      text: r.q9_opinion!.trim(),
    }));

  return {
    totalCount: total,
    ageDistribution,
    householdDistribution,
    genderDistribution,
    jichikaiDistribution,
    prideRanking,
    facilityRanking,
    worryRanking,
    hopeRanking,
    ageToWorry,
    ageToHope,
    householdToWorry,
    householdToHope,
    youngTopWorry: getTop(youngRows, "q7_worry"),
    youngTopHope: getTop(youngRows, "q8_hope"),
    seniorTopWorry: getTop(seniorRows, "q7_worry"),
    seniorTopHope: getTop(seniorRows, "q8_hope"),
    childRearingTopHope: getTop(childRearingRows, "q8_hope"),
    childRearingTopWorry: getTop(childRearingRows, "q7_worry"),
    singleTopWorry: getTop(singleRows, "q7_worry"),
    opinions,
  };
}

// Generate the required Facilitation Markdown format
export function generateFacilitationMarkdown(summary: SurveyAnalysisSummary): string {
  const topPrides = summary.prideRanking.slice(0, 3);
  const topWorries = summary.worryRanking.slice(0, 3);
  const topHopes = summary.hopeRanking.slice(0, 3);

  const pride1 = topPrides[0]?.name || "歴史や文化";
  const pride2 = topPrides[1]?.name || "観光資源";
  const pride3 = topPrides[2]?.name || "災害が少なく安心";

  const worry1 = topWorries[0]?.name || "健康・医療";
  const worry2 = topWorries[1]?.name || "公共交通や移動";
  const worry3 = topWorries[2]?.name || "空き家・周辺環境";

  const hope1 = topHopes[0]?.name || "多世代が集える場所";
  const hope2 = topHopes[1]?.name || "医療や福祉の充実";
  const hope3 = topHopes[2]?.name || "公共交通の充実";

  // Detailed gap extraction
  const youngWorry = summary.youngTopWorry?.name || "子育て・教育や買い物";
  const youngWorryPct = summary.youngTopWorry ? `${summary.youngTopWorry.percentage}%` : "多数";
  const youngHope = summary.youngTopHope?.name || "子どもの遊び場や多世代が集える場所";

  const seniorWorry = summary.seniorTopWorry?.name || "健康・医療や公共交通・移動";
  const seniorWorryPct = summary.seniorTopWorry ? `${summary.seniorTopWorry.percentage}%` : "多数";
  const seniorHope = summary.seniorTopHope?.name || "医療・福祉の充実や公共交通の利便性";

  const childRearingHope = summary.childRearingTopHope?.name || "子どもの遊び場・多世代の集い";

  // Sample real quotes from free opinions if available
  const sampleOpinions = summary.opinions.slice(0, 4);
  const opinionQuotes = sampleOpinions.length > 0
    ? `\n> **【参加者の生の声（問9: 自由意見より抜粋）】**\n` +
      sampleOpinions
        .map(
          (o) =>
            `> - 「${o.text}」（${o.jichikai ? `${o.jichikai}・` : ""}${o.age || "住民"}）`
        )
        .join("\n") + "\n>"
    : "";

  return `## 1. まちなかの現状サマリー（定量データのハイライト）

- **全体回収数**: 回答総数 **${summary.totalCount}名**（古市・姫田・金屋・新庄・柳井町など各地区の住民から回答を集約）
- **地域の誇り・強み（問5 上位）**:
  1. **${topPrides[0]?.name || pride1}** (${topPrides[0]?.percentage || 0}% / ${topPrides[0]?.count || 0}票)
  2. **${topPrides[1]?.name || pride2}** (${topPrides[1]?.percentage || 0}% / ${topPrides[1]?.count || 0}票)
  3. **${topPrides[2]?.name || pride3}** (${topPrides[2]?.percentage || 0}% / ${topPrides[2]?.count || 0}票)
- **全体の共通課題（問7 上位）**:
  - 最も多くの声が集まったのは **「${worry1}」** (${topWorries[0]?.percentage || 0}%)、次いで **「${worry2}」** (${topWorries[1]?.percentage || 0}%)、**「${worry3}」** (${topWorries[2]?.percentage || 0}%)。
- **世代別（問3）に見られた顕著なギャップ**:
  - **若者・子育て世代（20〜40代）**: 日常の切実な困りごととして **「${youngWorry}」** (${youngWorryPct}) や防犯・買い物を挙げる割合が高く、求めているもの（問8）は **「${youngHope}」** や買い物・生活サービス。
  - **シニア世代（60代〜80歳以上）**: **「${seniorWorry}」** (${seniorWorryPct}) や「空き家・周辺環境」への危機感が極めて高い。求めているもの（問8）は **「${seniorHope}」** や多世代が集える居場所。
- **世帯構成別（問4）の対比**:
  - 家族同居・子育て世帯では「${childRearingHope}」や休日に過ごせる場所への期待が強い一方、単身世帯や高齢夫婦世帯では「通院や買い物の足（移動）」や「人とのつながり・見守り」を重視する傾向が顕著です。

---

## 2. ワークショップ用 事前インプット情報（参加者への提示用）

> **【ファシリテーターからの語りかけ・データを物語として翻訳】**
>
> 私たちの柳井には、全国に誇れる「${pride1}」や「${pride2}」、そして「${pride3}」というかけがえのない宝物があります。白壁の町並みや図書館・駅前などを日常的に利用しながら、多くの住民がこの町の落ち着いた暮らしに誇りを持っています。
>
> しかし、世代や世帯構成によって、日々の暮らしで見えている風景にははっきりとした違いがあります。
>
> - **若い世代・子育て世代の声**:
>   「${youngWorry}」に不安を感じており、「子どもが安全に遊べる屋内施設や、気軽に立ち寄れるカフェ、家族で休日に過ごせる場所（問8: ${youngHope}）がまちなかにほしい」と願っています。
>
> - **シニア世代・単身世帯の声**:
>   年齢を重ねるにつれ「${seniorWorry}」に直面しており、「病院への通院の足がなくて困る」「夜道が暗くて歩くのが怖い」「空き家が増えて景観や防犯が心配」という切実な不安を抱えています。その一方で、問8では「**${seniorHope}**」とともに「若い世代や同年代と気軽に集える場所」を求めています。
>${opinionQuotes}
>
> 困りごとの内容は世代ごとに異なりますが、どちらの世代も「**多世代が集える場所**」や「**暮らしやすさの向上**」を強く求めています。この共通の願いこそが、対話を始める一番の出発点です。

---

## 3. 対話を深める3つの「問い立て」

### 【問い1】地域の自慢（問5）× 課題・不安（問7）
> **「私たちが誇る『${pride1}』や『観光資源』の魅力を活かして、増えつつある『${worry3}（空き家）』や『夜道の暗さ・不安』を、みんなが安心して立ち寄れる温かい灯りの拠点に変えるには、どんなアイデアがあるでしょうか？」**
> - **対話のヒント**: 空き家をリノベーションしたコミュニティカフェ、金魚ちょうちんを活用した夜間フットライト、日中の見守りを兼ねた古民家サロンなど。

### 【問い2】課題・不安（問7）× あったらいいな（問8）
> **「『${worry2}（移動の不便さ）』や『${worry1}・買い物』の不安を解消しながら、住民が望む『${hope1}』や『${hope3}』をカタチにするために、身近な助け合いや新しい移動・集いの仕組みをどう作れるでしょうか？」**
> - **対話のヒント**: まちなかのワゴン車によるお買い物・通院乗合サポート、集いの場への出張診療・健康相談カフェ、地元商店と連携した移動販売マルシェなど。

### 【問い3】若者・子育て世代 × シニア世代（世代・世帯間の掛け合わせ）
> **「子育て世代が求める『安全な子どもの遊び場・居場所』と、シニア世代が求める『多世代の交流・見守り・安心』。この2つが1つの場所で同時に叶う、まちなかの“新世代の縁側”をつくるとしたら、どんな空間にしたいですか？」**
> - **対話のヒント**: シニアが見守る屋内キッズスペース併設カフェ、昔遊びや宿題を一緒にできる放課後サロン、親子とシニアが一緒に楽しむ地元の特産品ワークショップなど。
`;
}

// Extract string items for any dimension from a SurveyRow
export function getDimensionValues(row: SurveyRow, key: SurveyDimensionKey): string[] {
  switch (key) {
    case "q1_jichikai":
      return row.q1_jichikai ? [row.q1_jichikai] : ["未回答・不明"];
    case "q2_gender":
      return row.q2_gender ? [row.q2_gender] : ["未回答"];
    case "q3_age":
      return row.q3_age ? [row.q3_age] : ["年代不明"];
    case "q4_household":
      return row.q4_household ? [row.q4_household] : ["未回答"];
    case "q5_pride":
      return row.q5_pride && row.q5_pride.length > 0 ? row.q5_pride : ["特になし/未回答"];
    case "q6_facilities":
      return row.q6_facilities && row.q6_facilities.length > 0 ? row.q6_facilities : ["特になし/未回答"];
    case "q7_worry":
      return row.q7_worry && row.q7_worry.length > 0 ? row.q7_worry : ["特になし/未回答"];
    case "q8_hope":
      return row.q8_hope && row.q8_hope.length > 0 ? row.q8_hope : ["特になし/未回答"];
    default:
      return [];
  }
}

// Dimension display label mapping
export const DIMENSION_LABELS: Record<SurveyDimensionKey, string> = {
  q1_jichikai: "問1: 自治会・地区",
  q2_gender: "問2: 性別",
  q3_age: "問3: 年齢・年代",
  q4_household: "問4: 世帯構成",
  q5_pride: "問5: 自慢できるもの（強み）",
  q6_facilities: "問6: 利用施設",
  q7_worry: "問7: 不安・困りごと（課題）",
  q8_hope: "問8: あったらいいな（期待）",
};

// Analyze Co-occurrence & Correlation among Q5 (Pride), Q7 (Worry), Q8 (Hope) for each respondent
export function analyzeCorrelations(rows: SurveyRow[]): CorrelationAnalysisSummary {
  const N = rows.length;
  if (N === 0) {
    return {
      prideToWorry: [],
      worryToHope: [],
      prideToHope: [],
      topStrongestPairs: [],
      worryToPrimaryHope: [],
      prideToPrimaryHope: [],
    };
  }

  // Count individual frequencies
  const prideCounts: Record<string, number> = {};
  const worryCounts: Record<string, number> = {};
  const hopeCounts: Record<string, number> = {};

  rows.forEach((r) => {
    (r.q5_pride || []).forEach((p) => {
      prideCounts[p] = (prideCounts[p] || 0) + 1;
    });
    (r.q7_worry || []).forEach((w) => {
      worryCounts[w] = (worryCounts[w] || 0) + 1;
    });
    (r.q8_hope || []).forEach((h) => {
      hopeCounts[h] = (hopeCounts[h] || 0) + 1;
    });
  });

  // Calculate pair co-occurrences
  const computePairList = (
    sourceKey: "q5_pride" | "q7_worry",
    targetKey: "q5_pride" | "q7_worry" | "q8_hope",
    sourceCounts: Record<string, number>,
    targetCounts: Record<string, number>
  ): CorrelationItem[] => {
    const pairMap: Record<string, number> = {};

    rows.forEach((r) => {
      const sourceList = (r[sourceKey] || []) as string[];
      const targetList = (r[targetKey] || []) as string[];

      // Unique combinations per respondent
      const setS = Array.from(new Set(sourceList));
      const setT = Array.from(new Set(targetList));

      for (const s of setS) {
        for (const t of setT) {
          if (s === t && sourceKey === targetKey) continue;
          const key = `${s}|||${t}`;
          pairMap[key] = (pairMap[key] || 0) + 1;
        }
      }
    });

    const results: CorrelationItem[] = [];

    Object.entries(pairMap).forEach(([key, coOccurrence]) => {
      const [source, target] = key.split("|||");
      const sCount = sourceCounts[source] || 0;
      const tCount = targetCounts[target] || 0;
      if (sCount === 0 || tCount === 0) return;

      const conditionalProb = Math.round((coOccurrence / sCount) * 1000) / 10;
      const reverseProb = Math.round((coOccurrence / tCount) * 1000) / 10;
      // Lift = (coOccurrence / N) / ((sCount / N) * (tCount / N)) = (coOccurrence * N) / (sCount * tCount)
      const lift = Math.round(((coOccurrence * N) / (sCount * tCount)) * 100) / 100;
      // Jaccard = coOccurrence / (sCount + tCount - coOccurrence)
      const jaccard = Math.round((coOccurrence / (sCount + tCount - coOccurrence)) * 100) / 100;

      results.push({
        source,
        target,
        sourceCategory: sourceKey,
        targetCategory: targetKey,
        coOccurrence,
        sourceCount: sCount,
        targetCount: tCount,
        conditionalProb,
        reverseProb,
        lift,
        jaccard,
      });
    });

    // Sort primarily by co-occurrence, then lift
    return results.sort((a, b) => b.coOccurrence - a.coOccurrence || b.lift - a.lift);
  };

  const prideToWorry = computePairList("q5_pride", "q7_worry", prideCounts, worryCounts);
  const worryToHope = computePairList("q7_worry", "q8_hope", worryCounts, hopeCounts);
  const prideToHope = computePairList("q5_pride", "q8_hope", prideCounts, hopeCounts);

  // Top strongest pairs across categories with meaningful support (coOccurrence >= 3 or >= 10% of total)
  const minCo = Math.max(2, Math.round(N * 0.08));
  const candidatePool = [...worryToHope, ...prideToHope, ...prideToWorry].filter(
    (item) => item.coOccurrence >= minCo
  );
  // Sort by lift * coOccurrence weight
  const topStrongestPairs = candidatePool
    .sort((a, b) => b.lift * Math.log2(b.coOccurrence + 1) - a.lift * Math.log2(a.coOccurrence + 1))
    .slice(0, 10);

  // Mapping each worry to its top correlated hopes (What people who have this worry actually want)
  const worryToPrimaryHope = Object.keys(worryCounts)
    .filter((w) => worryCounts[w] >= 2)
    .map((worry) => {
      const related = worryToHope
        .filter((item) => item.source === worry)
        .map((item) => ({
          hope: item.target,
          count: item.coOccurrence,
          percentage: item.conditionalProb,
          lift: item.lift,
        }))
        .sort((a, b) => b.count - a.count || b.lift - a.lift);

      return {
        worry,
        worryCount: worryCounts[worry],
        topHopes: related.slice(0, 4),
      };
    })
    .sort((a, b) => b.worryCount - a.worryCount);

  // Mapping each pride to top correlated hopes
  const prideToPrimaryHope = Object.keys(prideCounts)
    .filter((p) => prideCounts[p] >= 2)
    .map((pride) => {
      const related = prideToHope
        .filter((item) => item.source === pride)
        .map((item) => ({
          hope: item.target,
          count: item.coOccurrence,
          percentage: item.conditionalProb,
        }))
        .sort((a, b) => b.count - a.count);

      return {
        pride,
        prideCount: prideCounts[pride],
        topHopes: related.slice(0, 4),
      };
    })
    .sort((a, b) => b.prideCount - a.prideCount);

  return {
    prideToWorry,
    worryToHope,
    prideToHope,
    topStrongestPairs,
    worryToPrimaryHope,
    prideToPrimaryHope,
  };
}

// Compute custom dynamic pivot table for any pair of dimensions
export function computePivotTable(
  rows: SurveyRow[],
  rowDim: SurveyDimensionKey,
  colDim: SurveyDimensionKey,
  metric: PivotMetric
): PivotTableData {
  const respondentCount = rows.length;

  // Track raw counts: rowItem -> colItem -> count
  const rawMatrix: Record<string, Record<string, number>> = {};
  const rowTotals: Record<string, number> = {};
  const colTotals: Record<string, number> = {};
  let grandTotal = 0;

  // Initialize
  rows.forEach((row) => {
    const rowVals = Array.from(new Set(getDimensionValues(row, rowDim)));
    const colVals = Array.from(new Set(getDimensionValues(row, colDim)));

    rowVals.forEach((rVal) => {
      if (!rawMatrix[rVal]) rawMatrix[rVal] = {};
      rowTotals[rVal] = (rowTotals[rVal] || 0) + 1;

      colVals.forEach((cVal) => {
        rawMatrix[rVal][cVal] = (rawMatrix[rVal][cVal] || 0) + 1;
        colTotals[cVal] = (colTotals[cVal] || 0) + 1;
        grandTotal += 1;
      });
    });
  });

  // Extract and sort labels
  const rowLabels = Object.keys(rowTotals).sort((a, b) => (rowTotals[b] || 0) - (rowTotals[a] || 0));
  const colLabels = Object.keys(colTotals).sort((a, b) => (colTotals[b] || 0) - (colTotals[a] || 0));

  // Compute final metric values
  const matrix: Record<string, Record<string, number>> = {};

  rowLabels.forEach((rVal) => {
    matrix[rVal] = {};
    const rTotal = rowTotals[rVal] || 0;

    colLabels.forEach((cVal) => {
      const rawCount = rawMatrix[rVal]?.[cVal] || 0;
      const cTotal = colTotals[cVal] || 0;

      if (metric === "count") {
        matrix[rVal][cVal] = rawCount;
      } else if (metric === "row_percent") {
        matrix[rVal][cVal] = rTotal > 0 ? Math.round((rawCount / rTotal) * 1000) / 10 : 0;
      } else if (metric === "col_percent") {
        matrix[rVal][cVal] = cTotal > 0 ? Math.round((rawCount / cTotal) * 1000) / 10 : 0;
      } else if (metric === "total_percent") {
        // Based on total respondent count if available
        matrix[rVal][cVal] =
          respondentCount > 0 ? Math.round((rawCount / respondentCount) * 1000) / 10 : 0;
      }
    });
  });

  return {
    rowDimension: rowDim,
    colDimension: colDim,
    metric,
    rowLabels,
    colLabels,
    matrix,
    rowTotals,
    colTotals,
    grandTotal,
    respondentCount,
  };
}

