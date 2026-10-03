with open('src/components/WorkspaceKanban.tsx', 'r') as f:
    content = f.read()

import_statement = "import { SurveyApp } from './survey/SurveyApp';\n"
if "import { SurveyApp }" not in content:
    content = content.replace("import { WorkshopDataImporter }", import_statement + "import { WorkshopDataImporter }")

old_code = """          {activeMenu === 'survey' && (
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-10">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">アンケート分析ダッシュボード</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                アンケート分析ツールは別システム（Vercel）で稼働しており、セキュリティ保護（SSO認証）のため外部埋め込みが制限されています。<br/>
                お手数ですが、以下のボタンから別タブで開いてご確認ください。
              </p>
              <a
                href="https://survey-58dmlydd2-hiroki987-3697s-projects.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                外部ツールを開く (別タブ)
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}"""

new_code = """          {activeMenu === 'survey' && (
            <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <SurveyApp />
            </div>
          )}"""

content = content.replace(old_code, new_code)
with open('src/components/WorkspaceKanban.tsx', 'w') as f:
    f.write(content)
