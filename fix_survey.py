with open('src/components/WorkspaceKanban.tsx', 'r') as f:
    content = f.read()

bad = """          {/* 7. SURVEY */}
          {activeMenu === 'survey' && (
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-500" />
                  アンケート分析 (外部ツール)
                </h3>
              </div>
              <iframe
                src="https://survey-58dmlydd2-hiroki987-3697s-projects.vercel.app/"
                className="w-full h-full border-0"
                title="Survey Analysis Tool"
              />
            </div>
          )}"""

good = """          {/* 7. SURVEY */}
          {activeMenu === 'survey' && (
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

content = content.replace(bad, good)

with open('src/components/WorkspaceKanban.tsx', 'w') as f:
    f.write(content)
