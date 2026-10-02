import re

with open('src/components/LoginModal.tsx', 'r') as f:
    content = f.read()

# 1. Update Left Card Header and Description
old_left_header = """              <div>
                <h3 className="text-base font-bold text-slate-900">
                  管理画面 / ログイン
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  希望する権限を選択してログインしてください。
                </p>
              </div>"""

new_left_header = """              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  関係者専用ログイン
                </h3>
                <div className="mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-800 text-[11px] leading-relaxed">
                  <strong className="block mb-0.5">※事前登録されていない方はログインできません。</strong>
                  一般の市民向け画面（閲覧・アイデア投稿など）は、<strong className="underline cursor-pointer" onClick={() => handleDirectRoleSelect('citizen', 'home')}>ログイン不要（こちら）</strong>でそのままご利用いただけます。
                </div>
                <p className="text-xs text-slate-600 mt-3 font-medium">
                  ご自身に付与された「担当ロール」を選択してください。
                </p>
              </div>"""

content = content.replace(old_left_header, new_left_header)


# 2. Update Right Card
old_right_card = """            <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ログイン後の導線
                </h3>
                <ul className="text-xs text-slate-600 space-y-2 mt-3 list-disc pl-4 leading-relaxed">
                  <li>
                    <strong className="text-slate-900">管理者:</strong> 投稿モデレーション / 朝のレポート / 夜間バッチ / 公開設定
                  </li>
                  <li>
                    <strong className="text-slate-900">ワークスペース:</strong> タスク管理 (Kanban/List/Calendar) / ドキュメント
                  </li>
                  <li>
                    <strong className="text-slate-900">募集投稿担当:</strong> 実証実験の要員募集投稿・応募者管理のみ
                  </li>
                </ul>

                {/* Exclusive Admin/Member Features Notice */}
                <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>限定機能へのアクセス</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    「２軸マトリックス分析」および「データエクスポート＆会議用A3出力センター」は、ログイン後の画面からご利用いただけます。
                  </p>
                </div>
              </div>

              {/* Direct Navigation Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleDirectRoleSelect('admin', 'admin')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-100 hover:bg-blue-200 text-blue-900 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>管理画面へ直接移動</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectRoleSelect('workspace', 'workspace')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-100 hover:bg-indigo-200 text-indigo-900 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>ワークスペースへ直接移動</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectRoleSelect('recruiter', 'recruiter_admin')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>募集投稿画面へ直接移動</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>"""


new_right_card = """            <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Navigation2 className="w-4 h-4 text-blue-600" />
                  担当画面へのダイレクト移動
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  ログインと同時に、ご自身の担当機能の画面へ直接ジャンプします。<br/>
                  <span className="text-rose-600 font-medium text-[11px]">※付与された権限以外の画面は操作できません。初めての方でも迷わずご自身の担当業務に専念できます。</span>
                </p>

                <div className="space-y-2 mt-4 relative z-10">
                  <button
                    type="button"
                    onClick={() => handleDirectRoleSelect('admin', 'admin')}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex flex-col items-start">
                      <span>👑 管理画面へ直接移動</span>
                      <span className="text-[10px] font-normal text-blue-200 mt-0.5">全体管理・データ分析・A3出力用</span>
                    </div>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectRoleSelect('workspace', 'workspace')}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex flex-col items-start">
                      <span>🤝 ワークスペースへ直接移動</span>
                      <span className="text-[10px] font-normal text-indigo-200 mt-0.5">タスク・ドキュメント管理専用</span>
                    </div>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectRoleSelect('recruiter', 'recruiter_admin')}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex flex-col items-start">
                      <span>📢 募集投稿画面へ直接移動</span>
                      <span className="text-[10px] font-normal text-amber-200 mt-0.5">実証実験の要員募集・応募者管理専用</span>
                    </div>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="mt-2 p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-[11px] leading-relaxed flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  初めての方は、ご自身の担当業務のボタンをクリックしてログインしてください。担当外の他画面に迷い込むことなくスムーズに作業を開始できます。
                </p>
              </div>

            </div>"""

content = content.replace(old_right_card, new_right_card)

with open('src/components/LoginModal.tsx', 'w') as f:
    f.write(content)
