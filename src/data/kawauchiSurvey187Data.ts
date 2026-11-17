/**
 * 旧河内小学校 施設跡地活用 住民アンケート 全187件統合データ
 * （3枚目シート「全アンケート」：Web回答48件 ＋ 紙回答139件 ＝ 計187件）
 */

export interface KawauchiSurvey187Record {
  id: number;
  src: "Web" | "紙";
  d: string;
  a: string;
  b: string;
  f: string[];
  p: string;
  i: string[];
  c: string;
}

export const KAWAUCHI_SURVEY_187_DATA: KawauchiSurvey187Record[] = undefined;
