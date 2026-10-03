with open('src/components/survey/SurveyApp.tsx', 'r') as f:
    content = f.read()

empty_state = """        {/* Data Importer Block (If no data loaded yet) */}
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

        {/* HOME VIEW: Portal Overview & Highlights */}"""

if "Data Importer Block (If no data loaded yet)" not in content:
    content = content.replace("{/* HOME VIEW: Portal Overview & Highlights */}", empty_state)
    with open('src/components/survey/SurveyApp.tsx', 'w') as f:
        f.write(content)
