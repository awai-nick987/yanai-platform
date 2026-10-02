import re

with open('src/components/IdeaSubmissionModal.tsx', 'r') as f:
    content = f.read()

# 1. Update useEffect for location name so it resets when modal opens
effect_code = """  useEffect(() => {
    if (isOpen) {
      setLocationName(defaultLocationName);
    }
  }, [isOpen, defaultLocationName]);
"""
content = content.replace("  if (!isOpen) return null;", effect_code + "\n  if (!isOpen) return null;")

# 2. Update the layout of location selection
old_loc_select = """            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                対象の場所・エリア <span className="text-rose-500">*</span>
              </label>
              <select
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="白壁の町並み・やない西蔵前">🏮 白壁の町並み・やない西蔵前</option>
                <option value="JR柳井駅前・ロータリー広場">🚉 JR柳井駅前・ロータリー広場</option>
                <option value="柳井川水辺プロムナード">🌊 柳井川水辺プロムナード</option>
                <option value="古市・金屋地区（旧商家通り）">🏯 古市・金屋地区（旧商家通り）</option>
                <option value="柳井学園・柳井高校周辺">🏫 柳井学園・柳井高校周辺</option>
                <option value="柳井港フェリーターミナル">⛵ 柳井港フェリーターミナル</option>
                <option value="中心市街地全域・巡回ルート">🌐 中心市街地全域・巡回ルート</option>
              </select>
            </div>"""

new_loc_select = """            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                対象の場所・エリア <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="具体的な場所（例: 白壁通り、駅前広場など）"
                  className="w-full sm:flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <div className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap border border-slate-200">
                  📍 座標: {defaultLat.toFixed(5)}, {defaultLng.toFixed(5)}
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">※ マップから指定した場合、その位置情報が自動で記録されます。場所の名称はわかりやすいように自由に変更可能です。</p>
            </div>"""
content = content.replace(old_loc_select, new_loc_select)

with open('src/components/IdeaSubmissionModal.tsx', 'w') as f:
    f.write(content)
