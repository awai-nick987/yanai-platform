import React, { useState } from 'react';
import { PocProject, UserRole } from '../types';
import { Sparkles, Calendar, MapPin, Target, Users, ChevronRight, PlusCircle, Heart, ArrowRight , Eye, EyeOff, Trash2} from 'lucide-react';

interface PocProjectSectionProps {
  projects: PocProject[];
  currentRole: UserRole;
  onSelectProject: (project: PocProject) => void;
  onOpenCreateProjectModal: () => void;
  onOpenReportWizard?: (project: PocProject) => void;
  onLikeProject: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onDeleteProject?: (id: string) => void;
}

export const PocProjectSection: React.FC<PocProjectSectionProps> = ({
  projects,
  currentRole,
  onSelectProject,
  onOpenCreateProjectModal,
  onLikeProject,
  onToggleVisibility,
  onDeleteProject
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const categories = ['all', 'まちなか回遊', '子育て支援', '移動・交通', '白壁景観・文化', '若者・高校生'];

  const filteredProjects = visibleProjects.filter(p => {
    if (filterCategory !== 'all' && !p.tags.includes(filterCategory) && p.category !== filterCategory) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: PocProject['status']) => {
    switch (status) {
      case 'in_progress':
      case 'recruiting':
        return { label: '受付中', bg: 'bg-emerald-600 text-white' };
      case 'planning':
        return { label: '近日開催', bg: 'bg-amber-500 text-slate-950' };
      case 'completed':
        return { label: '完了・成果公開', bg: 'bg-slate-200 text-slate-800' };
      default:
        return { label: '進行中', bg: 'bg-blue-600 text-white' };
    }
  };

  const getPhaseName = (p: PocProject) => {
    if (p.status === 'in_progress') return '実施準備';
    if (p.status === 'recruiting') return '意見収集中';
    if (p.status === 'planning') return '設計草案';
    return '本格運用';
  };

  return (
    <section id="poc-projects-section" className="space-y-6">
      
      {/* Title Header matching Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            プロジェクト一覧
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            活動中・募集予定・完了案件を確認できます。
          </p>
        </div>

        {/* Filter Controls matching screenshot */}
        <div className="flex items-center gap-3">
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="all">カテゴリ: すべて</option>
              <option value="まちなか回遊">まちなか回遊</option>
              <option value="子育て支援">子育て支援</option>
              <option value="移動・交通">移動・交通</option>
              <option value="白壁景観・文化">白壁景観・文化</option>
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="all">状態: すべて</option>
              <option value="in_progress">受付中 / 進行中</option>
              <option value="planning">近日開催 / 企画中</option>
              <option value="completed">完了</option>
            </select>
          </div>

          {(currentRole === 'admin' || currentRole === 'workspace' || currentRole === 'recruiter') && (
            <button
              onClick={onOpenCreateProjectModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">新規PJ作成</span>
            </button>
          )}
        </div>
      </div>

      {/* Project Cards Grid matching Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const badge = getStatusBadge(project.status);
          const phase = getPhaseName(project);

          return (
            <div
              key={project.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <button
                    onClick={() => onLikeProject(project.id)}
                    className="text-slate-400 hover:text-rose-500 flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{project.likesCount}</span>
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {project.story || project.why.problem}
                </p>
              </div>

              {/* Phase and Action Button matching Screenshot */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-medium">
                  フェーズ: <span className="font-bold text-slate-800">{phase}</span>
                </div>

                <button
                  onClick={() => onSelectProject(project)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>詳細を見る</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
