import re

with open('src/components/IdeaSubmissionModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove AI Button and UI
ai_button_regex = r'<div className="bg-indigo-50.*?AIによる即時スコアリング＆講評.*?</div>\s*</div>\s*\{/\* AI Feedback Preview Card if available \*/\}\s*\{aiAnalysisResult && \([\s\S]*?\)\}'
content = re.sub(ai_button_regex, '', content)

# 2. Update category options
old_categories = r'<select[\s\S]*?</select>'
new_categories = """<select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="living_infrastructure">【暮らし×課題解決】交通・インフラの改善</option>
                <option value="living_environment">【暮らし×課題解決】防犯・防災・居住環境の改善</option>
                <option value="living_community">【暮らし×価値創造】子育て・福祉・コミュニティの充実</option>
                <option value="bustle_landscape">【賑わい×課題解決】空き家・空き店舗の活用・景観保全</option>
                <option value="bustle_tourism">【賑わい×価値創造】観光・イベント・新たな魅力創出</option>
                <option value="other_concept">【その他】まちなか全体の仕組み・構想</option>
              </select>"""
# Find the first select, which is category
content = re.sub(r'<select[\s\S]*?value=\{category\}[\s\S]*?</select>', new_categories, content)

# 3. Update Age options
new_ages = """<select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="under_10s">10代未満</option>
                <option value="10s">10代</option>
                <option value="20s">20代</option>
                <option value="30s">30代</option>
                <option value="40s">40代</option>
                <option value="50s">50代</option>
                <option value="60s">60代</option>
                <option value="70s">70代</option>
                <option value="80s_plus">80代以上</option>
              </select>"""
content = re.sub(r'<select[\s\S]*?value=\{ageGroup\}[\s\S]*?</select>', new_ages, content)

# 4. Update Residency options
new_res = """<select
                value={residency}
                onChange={(e) => setResidency(e.target.value as ResidencyArea)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="yanai_student">柳井高校・柳井学園在校生（通学）</option>
                <option value="commuter">通勤者</option>
                <option value="downtown_resident">まちなか在住</option>
                <option value="suburban_resident">市内郊外在住</option>
                <option value="tourist_fan">観光客・関係人口・ファン</option>
              </select>"""
content = re.sub(r'<select[\s\S]*?value=\{residency\}[\s\S]*?</select>', new_res, content)

# 5. Make Location Optional
content = content.replace(
    '対象の場所・エリア <span className="text-rose-500">*</span>',
    '対象の場所・エリア（任意）'
)
content = content.replace(
    'type="text"\n                  required\n                  value={locationName}',
    'type="text"\n                  value={locationName}'
)
content = content.replace(
    '※ マップから指定した場合、その位置情報が自動で記録されます。場所の名称はわかりやすいように自由に変更可能です。',
    '※ まちなかの構想的なアイデアなど特定できない場合は空欄で構いません。マップ指定の場合はその場所が記録されますが、概ねのエリア指定としてテキスト入力（任意）も可能です。'
)

with open('src/components/IdeaSubmissionModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("patched IdeaSubmissionModal")
