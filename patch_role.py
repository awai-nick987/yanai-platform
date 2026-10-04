import re

with open('src/components/UserRoleManagement.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add activeTab state
tabs_state = """  const [activeTab, setActiveTab] = useState<'issue' | 'pending' | 'registered'>('registered');

  // Dummy state for Issue / Pending
  const [issuedTokens, setIssuedTokens] = useState([
    { id: '1', email: 'shoko@yanai.example.com', role: 'workspace', token: 'YNA-9981', issuedAt: '2026-10-04 10:00', expiresAt: '2026-10-11 10:00' },
    { id: '2', email: 'citizen01@example.com', role: 'citizen', token: 'YNA-3442', issuedAt: '2026-10-03 15:30', expiresAt: '2026-10-10 15:30' }
  ]);
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: '1', name: '柳井 太郎', email: 'taro.yanai@example.com', requestedRole: 'workspace', org: '地元企業', appliedAt: '2026-10-04 18:20' },
    { id: '2', name: '観光 協子', email: 'kyoko@tourism.example.com', requestedRole: 'recruiter', org: '観光協会', appliedAt: '2026-10-04 19:45' }
  ]);
  
  const [issueEmail, setIssueEmail] = useState('');
  const [issueRole, setIssueRole] = useState<UserRole>('workspace');

  const handleIssueToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueEmail) return;
    const newToken = {
      id: Date.now().toString(),
      email: issueEmail,
      role: issueRole,
      token: `YNA-${Math.floor(1000 + Math.random() * 9000)}`,
      issuedAt: new Date().toLocaleString('ja-JP'),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString('ja-JP')
    };
    setIssuedTokens([newToken, ...issuedTokens]);
    setIssueEmail('');
    showNotification(`${issueEmail} 宛に招待トークンを発行しました`);
  };

  const handleApprove = (id: string, name: string) => {
    setPendingApprovals(prev => prev.filter(p => p.id !== id));
    showNotification(`${name} のアカウントを承認しました`);
  };

  const handleReject = (id: string, name: string) => {
    setPendingApprovals(prev => prev.filter(p => p.id !== id));
    showNotification(`${name} の申請を却下しました`);
  };
"""

content = re.sub(
    r'(const \[notification, setNotification\] = useState<string \| null>\(null\);\n)',
    r'\1\n' + tabs_state,
    content
)

# 2. Add Tabs UI in the header
tabs_ui = """
      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('issue')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'issue' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
        >
          新規事前発行（招待）
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'pending' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
        >
          承認待ち
          {pendingApprovals.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingApprovals.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('registered')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'registered' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
        >
          登録済み管理 ({members.length})
        </button>
      </div>

      {activeTab === 'issue' && (
        <div className="space-y-6">
          <div className="bg-white border border-blue-200 bg-blue-50/30 p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600"/> 招待トークンの事前発行</h3>
            <form onSubmit={handleIssueToken} className="flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-600 mb-1">招待先メールアドレス</label>
                <input required type="email" value={issueEmail} onChange={e => setIssueEmail(e.target.value)} placeholder="example@yanai.city" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>
              <div className="w-full sm:w-48">
                <label className="block text-xs font-bold text-slate-600 mb-1">初期付与ロール</label>
                <select value={issueRole} onChange={e => setIssueRole(e.target.value as UserRole)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                  <option value="workspace">ワークスペース (WG)</option>
                  <option value="recruiter">募集管理 (Recruiter)</option>
                  <option value="citizen">一般市民 (Citizen)</option>
                  <option value="admin">管理者 (Admin)</option>
                </select>
              </div>
              <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg whitespace-nowrap shadow-sm">
                トークン発行
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-xs font-bold text-slate-600">メールアドレス</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-600">ロール</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-600">発行トークン</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-600">有効期限</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {issuedTokens.map(token => (
                  <tr key={token.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-800">{token.email}</td>
                    <td className="py-3 px-4"><span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">{ROLE_BADGES[token.role as UserRole].label}</span></td>
                    <td className="py-3 px-4 font-mono text-xs font-bold text-indigo-600">{token.token}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{token.expiresAt}</td>
                  </tr>
                ))}
                {issuedTokens.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center text-slate-500">発行済みのトークンはありません</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-xs font-bold text-slate-600">申請者情報</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-600">所属・組織</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-600">希望ロール</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-600">申請日時</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-600 text-right">アクション</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {pendingApprovals.map(req => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{req.name}</div>
                    <div className="text-xs text-slate-500">{req.email}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{req.org}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded font-bold">
                      {ROLE_BADGES[req.requestedRole as UserRole].label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">{req.appliedAt}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button onClick={() => handleReject(req.id, req.name)} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50">却下</button>
                    <button onClick={() => handleApprove(req.id, req.name)} className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded hover:bg-emerald-700">承認</button>
                  </td>
                </tr>
              ))}
              {pendingApprovals.length === 0 && (
                <tr><td colSpan={5} className="py-12 text-center text-slate-500 font-bold">承認待ちのユーザーはいません</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'registered' && (
"""

content = re.sub(
    r'(\<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"\>)',
    tabs_ui + r'\n        \1',
    content
)

# Close the registered tab brace
content = re.sub(
    r'(          \</div\>\n        \</div\>\n      \</div\>\n\n      \{\/\* Add Member Modal \*\/})',
    r'        </div>\n      )}\n\n      {/* Add Member Modal */}',
    content
)

# And fix any lucide imports if needed, but we already have Mail imported (from original UserRoleManagement.tsx)
# Original had Mail imported: `Mail, Building, Shield, Briefcase`

with open('src/components/UserRoleManagement.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
