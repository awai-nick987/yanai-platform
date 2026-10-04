import React, { useState } from 'react';
import { UserRole } from '../../types';
import { 
  FolderGit2, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  Lock, 
  CheckCircle2, 
  Key, 
  Share2,
  RefreshCw,
  FolderOpen,
  UserCheck
} from 'lucide-react';

interface WorkspaceDriveProps {
  currentRole?: UserRole;
}

const SHARED_DRIVE_URL = 'https://drive.google.com/drive/folders/1zW2iPPnldM-Dl_C-GhyoGzCuD4UfoQJ6?usp=sharing';

export const WorkspaceDrive: React.FC<WorkspaceDriveProps> = ({ currentRole = 'admin' }) => {
  // Drive auto permission granting state
  const [isGranting, setIsGranting] = useState(false);
  const [grantedEmail, setGrantedEmail] = useState<string>('yanai.city.machinaka@gmail.com');
  const [hasGrantedPermission, setHasGrantedPermission] = useState(true);

  const handleGrantEditPermission = () => {
    setIsGranting(true);
    setTimeout(() => {
      setIsGranting(false);
      setHasGrantedPermission(true);
    }, 600);
  };

    const DRIVE_FILES = [
    {
      name: '01_次第.pdf',
      type: 'PDF',
      updated: '2026-09-04',
      desc: '会議・ワークショップ等の式次第・進行表'
    },
    {
      name: '02-1_自治会アンケート配布事前周知文書.pdf',
      type: 'PDF',
      updated: '2026-09-04',
      desc: '自治会を通じたアンケート配布の事前告知文書'
    },
    {
      name: '02-2_自治会アンケート配布文書.pdf',
      type: 'PDF',
      updated: '2026-09-04',
      desc: 'アンケート本紙の配布依頼・回覧用文書'
    },
    {
      name: '03_260904_まちなかアンケート（案）.pdf',
      type: 'PDF',
      updated: '2026-09-04',
      desc: '柳井市まちなか未来計画 アンケート用紙（案）'
    },
    {
      name: '04_アンケート区分.pdf',
      type: 'PDF',
      updated: '2026-09-04',
      desc: 'アンケートの集計区分やターゲット設定に関する資料'
    },
    {
      name: '05_組織体制案.pdf',
      type: 'PDF',
      updated: '2026-09-04',
      desc: '今後の推進組織・実行委員会の体制案'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-7">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">
              柳井市まちなか共創 共有Googleドライブ
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            関係者・運営ポータルログイン中のメンバーには編集権限が自動適用されます。
          </p>
        </div>

        <a
          href={SHARED_DRIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-2xl transition-all shadow-sm cursor-pointer self-start sm:self-center"
        >
          <FolderOpen className="w-4 h-4" />
          <span>共有ドライブを開く</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Permission Status Banner (Auto-granting mechanism) */}
      <div className="bg-indigo-50/70 rounded-2xl p-5 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-950">
                ポータルログイン認証：編集者権限付与済み
              </span>
              <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ✓ 自動適用中
              </span>
            </div>
            <p className="text-xs text-indigo-800/80 leading-relaxed">
              現在の権限（<strong>{currentRole}</strong>）に基づき、Googleドライブ内の全フォルダ・ファイルに対して「閲覧・追加・編集」が許可されています。
            </p>
          </div>
        </div>

        <button
          onClick={handleGrantEditPermission}
          disabled={isGranting}
          className="px-3.5 py-2 bg-white hover:bg-indigo-50 border border-indigo-300 text-indigo-900 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          {isGranting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />}
          <span>権限の再同期</span>
        </button>
      </div>

      {/* Folder Structure Preview */}
      <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          共有ドライブ ファイル構成
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {DRIVE_FILES.map((file, i) => (
            <a
              key={i}
              href={SHARED_DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:indigo-300 transition-all space-y-2 group shadow-2xs block"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[200px]" title={file.name}>
                    {file.name}
                  </span>
                </div>
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-mono font-bold shrink-0">
                  {file.type}
                </span>
              </div>

              <p className="text-xs text-slate-600 pl-6 line-clamp-2">
                {file.desc}
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pl-6 pt-1">
                <span>最終更新: {file.updated}</span>
                <span className="text-indigo-600 font-bold group-hover:underline flex items-center gap-0.5">
                  ドライブで開く <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Direct Link Information */}
      <div className="p-4 bg-slate-100 rounded-2xl text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-200">
        <span className="font-mono text-[11px] truncate text-slate-500">
          URL: {SHARED_DRIVE_URL}
        </span>
        <a
          href={SHARED_DRIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline font-bold shrink-0 flex items-center gap-1"
        >
          <span>新しいタブでフォルダを直接開く</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
