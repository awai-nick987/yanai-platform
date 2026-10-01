import React, { useState } from 'react';
import { TeamMember, UserRole } from '../types';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  KeyRound, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  Building,
  Shield,
  Briefcase
} from 'lucide-react';

interface UserRoleManagementProps {
  members: TeamMember[];
  onUpdateMemberRole: (memberId: string, newRole: UserRole) => void;
  onAddMember?: (newMember: Partial<TeamMember>) => void;
  onDeleteMember?: (memberId: string) => void;
}

export const UserRoleManagement: React.FC<UserRoleManagementProps> = ({
  members,
  onUpdateMemberRole,
  onAddMember,
  onDeleteMember
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | UserRole>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // New Member Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newOrg, setNewOrg] = useState('柳井市役所');
  const [newRoleTitle, setNewRoleTitle] = useState('推進メンバー');
  const [newUserRole, setNewUserRole] = useState<UserRole>('workspace');
  const [newCategory, setNewCategory] = useState<TeamMember['departmentCategory']>('city_gov');

  const ROLE_BADGES: Record<UserRole, { label: string; bg: string; text: string; border: string; desc: string }> = {
    admin: {
      label: '管理者 (Admin)',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      desc: '全権限（システム設定、フロント公開制御、権限管理、モデレーション）'
    },
    workspace: {
      label: 'ワークスペース (WG)',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      desc: '推進WG（カンバン、ガント、チャット、カレンダー、共有資料）'
    },
    recruiter: {
      label: '募集管理 (Recruiter)',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      desc: 'プロジェクト要員募集・ボランティア管理・応募者審査'
    },
    citizen: {
      label: '一般市民 (Citizen)',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      desc: '住民閲覧・アイデア投稿・ビジョン投票のみ'
    }
  };

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRoleChange = (memberId: string, memberName: string, newRole: UserRole) => {
    onUpdateMemberRole(memberId, newRole);
    notify(`${memberName} さんの権限を「${ROLE_BADGES[newRole].label}」に更新しました`);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    if (onAddMember) {
      onAddMember({
        id: `mem-${Date.now()}`,
        name: newName.trim(),
        email: newEmail.trim(),
        organization: newOrg.trim(),
        role: newRoleTitle.trim(),
        userRole: newUserRole,
        departmentCategory: newCategory,
        assignedWgs: ['新規参加WG'],
        status: 'online',
        bio: '新規登録メンバー'
      });
      notify(`${newName} さんを新規追加し「${ROLE_BADGES[newUserRole].label}」を付与しました`);
    }

    setNewName('');
    setNewEmail('');
    setIsAddModalOpen(false);
  };

  // Filtered members list
  const filteredMembers = members.filter(member => {
    const role = member.userRole || 'workspace';
    const matchQuery = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchRole = selectedRoleFilter === 'all' || role === selectedRoleFilter;
    const matchCategory = selectedCategoryFilter === 'all' || member.departmentCategory === selectedCategoryFilter;

    return matchQuery && matchRole && matchCategory;
  });

  // Role count stats
  const adminCount = members.filter(m => (m.userRole || 'workspace') === 'admin').length;
  const workspaceCount = members.filter(m => (m.userRole || 'workspace') === 'workspace').length;
  const recruiterCount = members.filter(m => (m.userRole || 'workspace') === 'recruiter').length;
  const citizenCount = members.filter(m => (m.userRole || 'workspace') === 'citizen').length;

  return (
    <div className="space-y-6">
      
      {/* Toast notification */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between text-xs sm:text-sm font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Header & Stats Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold mb-2 border border-rose-200">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              柳井市 権限管理・メンバーアクセス制御
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ログインメンバー一覧 & 権限付与・削除
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              左メニューバーの表示項目や各管理機能（ワークスペース、募集、行政管理）へのアクセス権限を一元管理できます。
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>メンバー新規招待・登録</span>
          </button>
        </div>

        {/* 4 Role Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div 
            onClick={() => setSelectedRoleFilter(selectedRoleFilter === 'admin' ? 'all' : 'admin')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedRoleFilter === 'admin' ? 'border-rose-400 bg-rose-50/80 ring-2 ring-rose-300' : 'border-slate-200 bg-slate-50 hover:bg-rose-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700">管理者 (Admin)</span>
              <Shield className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{adminCount} <span className="text-xs font-normal text-slate-500">名</span></div>
            <div className="text-[11px] text-slate-500 mt-0.5">全管理画面・公開制御</div>
          </div>

          <div 
            onClick={() => setSelectedRoleFilter(selectedRoleFilter === 'workspace' ? 'all' : 'workspace')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedRoleFilter === 'workspace' ? 'border-indigo-400 bg-indigo-50/80 ring-2 ring-indigo-300' : 'border-slate-200 bg-slate-50 hover:bg-indigo-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700">ワークスペース (WG)</span>
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{workspaceCount} <span className="text-xs font-normal text-slate-500">名</span></div>
            <div className="text-[11px] text-slate-500 mt-0.5">タスク・チャット・資料</div>
          </div>

          <div 
            onClick={() => setSelectedRoleFilter(selectedRoleFilter === 'recruiter' ? 'all' : 'recruiter')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedRoleFilter === 'recruiter' ? 'border-emerald-400 bg-emerald-50/80 ring-2 ring-emerald-300' : 'border-slate-200 bg-slate-50 hover:bg-emerald-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700">募集管理者 (Recruiter)</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{recruiterCount} <span className="text-xs font-normal text-slate-500">名</span></div>
            <div className="text-[11px] text-slate-500 mt-0.5">要員公募・応募者管理</div>
          </div>

          <div 
            onClick={() => setSelectedRoleFilter(selectedRoleFilter === 'citizen' ? 'all' : 'citizen')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedRoleFilter === 'citizen' ? 'border-slate-400 bg-slate-100 ring-2 ring-slate-300' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">一般市民 (Citizen)</span>
              <UserCheck className="w-4 h-4 text-slate-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{citizenCount} <span className="text-xs font-normal text-slate-500">名</span></div>
            <div className="text-[11px] text-slate-500 mt-0.5">フロント閲覧・投稿のみ</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="名前、所属、メールアドレス、担当役割で検索..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value as any)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">すべての権限</option>
              <option value="admin">管理者のみ ({adminCount})</option>
              <option value="workspace">ワークスペースのみ ({workspaceCount})</option>
              <option value="recruiter">募集管理のみ ({recruiterCount})</option>
              <option value="citizen">一般市民のみ ({citizenCount})</option>
            </select>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">すべての属性区分</option>
              <option value="city_gov">行政・事務局</option>
              <option value="business_chamber">民間・商工会議所</option>
              <option value="youth_education">高校生・学生・若者</option>
              <option value="citizen_volunteer">市民ボランティア</option>
              <option value="expert_advisor">専門家・アドバイザー</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">登録メンバー一覧</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {filteredMembers.length} 名 表示中
            </span>
          </div>
          <span className="text-xs text-slate-500">
            権限セレクトボックスを変更すると即時に権限が反映されます
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">メンバー情報</th>
                <th className="py-3.5 px-4">所属組織 / 担当役割</th>
                <th className="py-3.5 px-4">連絡先</th>
                <th className="py-3.5 px-6">付与権限（Role）</th>
                <th className="py-3.5 px-4 text-center">状態</th>
                <th className="py-3.5 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredMembers.map((member) => {
                const currentRoleValue: UserRole = member.userRole || 'workspace';
                const badge = ROLE_BADGES[currentRoleValue];

                return (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Member Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-slate-300">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            member.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span>{member.name}</span>
                            {member.status === 'online' && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="オンライン"></span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            ID: {member.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Org & Role */}
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-800">{member.organization}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{member.role}</div>
                      {member.assignedWgs && member.assignedWgs.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {member.assignedWgs.map((wg, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                              {wg}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="text-[11px] text-slate-400 mt-1">
                          {member.phone}
                        </div>
                      )}
                    </td>

                    {/* Role Selector */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <select
                          value={currentRoleValue}
                          onChange={(e) => handleRoleChange(member.id, member.name, e.target.value as UserRole)}
                          className={`w-full px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors outline-none cursor-pointer ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          <option value="admin">管理者 (Admin) - 全権限</option>
                          <option value="workspace">ワークスペース (WG) - 推進メンバー</option>
                          <option value="recruiter">募集管理 (Recruiter) - 要員公募</option>
                          <option value="citizen">一般市民 (Citizen) - 閲覧・投稿</option>
                        </select>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          {badge.desc}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        member.status === 'online' ? 'bg-emerald-100 text-emerald-800' :
                        member.status === 'busy' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {member.status === 'online' ? '● ログイン中' : member.status === 'busy' ? '▲ 離席' : '○ オフライン'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      {onDeleteMember && (
                        <button
                          onClick={() => {
                            if (window.confirm(`${member.name} さんの権限を解除し、メンバー一覧から削除しますか？`)) {
                              onDeleteMember(member.id);
                              notify(`${member.name} さんを削除しました`);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="メンバー権限削除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  新規メンバー登録 & 権限付与
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">氏名</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="例: 山口 太郎"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">メールアドレス</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="例: t-yamaguchi@city.yanai.yamaguchi.jp"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">所属組織</label>
                  <input
                    type="text"
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    placeholder="例: 柳井市役所 都市計画課"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">担当役職・役割</label>
                  <input
                    type="text"
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    placeholder="例: WG-1推進担当"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">付与するシステム権限</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="admin">管理者 (Admin)</option>
                    <option value="workspace">ワークスペース (WG)</option>
                    <option value="recruiter">募集管理 (Recruiter)</option>
                    <option value="citizen">一般市民 (Citizen)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">属性区分</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none"
                  >
                    <option value="city_gov">行政・事務局</option>
                    <option value="business_chamber">民間・商工会議所</option>
                    <option value="youth_education">高校生・若者</option>
                    <option value="citizen_volunteer">市民ボランティア</option>
                    <option value="expert_advisor">専門家・アドバイザー</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  権限を付与して登録
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
