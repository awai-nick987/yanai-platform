import React from "react";
import { SlidersHorizontal, Check, AlertCircle } from "lucide-react";
import { ColumnMapping } from "../../types/survey";

interface ColumnMapperProps {
  headers: string[];
  mapping: ColumnMapping;
  onMappingChange: (newMapping: ColumnMapping) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const QUESTION_LABELS: { key: keyof ColumnMapping; label: string; desc: string }[] = [
  { key: "q1", label: "問1: 自治会・地区", desc: "古市・姫田・金屋・新庄などのお住まいの地区" },
  { key: "q2", label: "問2: 性別", desc: "回答者の性別" },
  { key: "q3", label: "問3: 年齢・年代", desc: "20代〜80歳以上の世代区分" },
  { key: "q4", label: "問4: 世帯構成", desc: "1人暮らし・夫婦のみ・家族と同居など" },
  { key: "q5", label: "問5: 自慢できるもの", desc: "歴史や文化、観光資源、災害が少なく安心など" },
  { key: "q6", label: "問6: 利用施設", desc: "図書館、ゆめタウン、柳井駅、サンビームなど" },
  { key: "q7", label: "問7: 不安・困りごと", desc: "健康・医療、移動、空き家、買い物、子育てなど" },
  { key: "q8", label: "問8: あったらいいな", desc: "多世代が集える場所、医療福祉、遊び場など" },
  { key: "q9", label: "問9: 自由意見", desc: "住民の自由意見・ご意見・感想（任意）" },
];

export const ColumnMapper: React.FC<ColumnMapperProps> = ({
  headers,
  mapping,
  onMappingChange,
  isOpen,
  onToggle,
}) => {
  const handleChange = (key: keyof ColumnMapping, index: number) => {
    onMappingChange({
      ...mapping,
      [key]: index,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs mb-6 overflow-hidden">
      <div
        onClick={onToggle}
        className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-slate-800">
            アンケート設問と列（カラム）の対応付け設定
          </span>
          <span className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium">
            自動判定済み (問1〜問9)
          </span>
        </div>
        <span className="text-xs text-blue-600 font-medium hover:underline">
          {isOpen ? "設定を閉じる" : "列の割り当てを変更・確認"}
        </span>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-5 bg-white space-y-4 text-xs">
          <p className="text-slate-500">
            取り込んだデータから自動で「問1〜問9」を判別しています。異なる設問名や列順の場合はプルダウンから変更できます。
          </p>

          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-lg text-xs space-y-1.5 text-blue-900">
            <div className="flex items-center gap-1.5 font-semibold text-blue-800">
              <span>✨ 自動データクレンジング機能が有効です</span>
            </div>
            <p className="text-[11px] leading-relaxed text-blue-800/90">
              ・<span className="font-semibold">問5・問7・問8（数字の自動変換）:</span> Googleフォーム等の集計で「1, 3, 5」のような数字のみが入力されていても、自動的に該当する設問テキスト（例:「1」→「公園や緑が身近」）へと展開して集計します。
            </p>
            <p className="text-[11px] leading-relaxed text-blue-800/90">
              ・<span className="font-semibold">問6（利用施設の自動分割・表記揺れ統合）:</span> 1つのセルに複数の施設が書かれている場合（読点、カンマ、スラッシュ、中黒、空白など）は別々の言葉として個別に抽出。「Mr.Max」「ミスターマックス」「MR.MAX」「ｍｒ．ｍａｘ」等の表記揺れを同一施設として集計し、個人店など未知の施設名も漏れなく全て集計対象とします。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {QUESTION_LABELS.map((item) => {
              const currentVal = mapping[item.key];
              const isMapped = currentVal >= 0 && currentVal < headers.length;

              return (
                <div
                  key={item.key}
                  className="p-3 bg-slate-50/50 rounded-lg border border-slate-200/80 flex flex-col justify-between space-y-2"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{item.label}</span>
                      {isMapped ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>

                  <select
                    value={currentVal}
                    onChange={(e) => handleChange(item.key, parseInt(e.target.value, 10))}
                    className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
                  >
                    <option value={-1}>-- 割り当てなし --</option>
                    {headers.map((header, idx) => (
                      <option key={idx} value={idx}>
                        列 {idx + 1}: {header || `(列 ${idx + 1})`}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
