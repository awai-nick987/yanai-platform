import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  IdeaSubmission, 
  VisionOption, 
  RecruitmentPost, 
  WorkspaceTask, 
  CMSArticle, 
  SystemSettings, 
  PocProject, 
  TeamMember
} from './types';
import { 
  INITIAL_SUBMISSIONS, 
  INITIAL_VISION_OPTIONS, 
  INITIAL_RECRUITMENT_POSTS, 
  INITIAL_WORKSPACE_TASKS, 
  INITIAL_CMS_ARTICLES, 
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_POC_PROJECTS,
  INITIAL_TEAM_MEMBERS
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CitizenDashboard } from './components/CitizenDashboard';
import { IdeaSubmissionSection } from './components/IdeaSubmissionSection';
import { PocProjectSection } from './components/PocProjectSection';
import { VisionVoteSection } from './components/VisionVoteSection';
import { RecruitmentSection } from './components/RecruitmentSection';
import { RecruitmentAdmin } from './components/RecruitmentAdmin';
import { InteractiveTownMap } from './components/InteractiveTownMap';
import { TwoAxisMatrixDashboard } from './components/TwoAxisMatrixDashboard';
import { WorkspaceKanban } from './components/WorkspaceKanban';
import { AdminModeration } from './components/AdminModeration';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';

import { 
  subscribeToSubmissions, 
  subscribeToVisionOptions,
  saveSubmission,
  updateSubmissionInDb,
  updateVisionOptionInDb,
  initializeDefaultData 
} from './services/firebaseService';


import { IdeaSubmissionModal } from './components/IdeaSubmissionModal';
import { IdeaDetailModal } from './components/IdeaDetailModal';
import { ExportModal } from './components/ExportModal';
import { PocProjectDetailModal } from './components/PocProjectDetailModal';
import { PocProjectEditorModal } from './components/PocProjectEditorModal';
import { PocReportWizardModal } from './components/PocReportWizardModal';
import { WorkshopPopupModal } from './components/WorkshopPopupModal';

import { 
  Building2, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  BarChart3, 
  Vote, 
  Users, 
  FolderKanban,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Info,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { SITE_CONFIG } from './config/siteConfig';

export default function App() {
  // Main Data States with localStorage fallback
  const [submissions, setSubmissions] = useState<IdeaSubmission[]>(() => {
    const saved = localStorage.getItem('yanai_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [visionOptions, setVisionOptions] = useState<VisionOption[]>(() => {
    const saved = localStorage.getItem('yanai_vision_options');
    return saved ? JSON.parse(saved) : INITIAL_VISION_OPTIONS;
  });

  const [recruitmentPosts, setRecruitmentPosts] = useState<RecruitmentPost[]>(() => {
    const saved = localStorage.getItem('yanai_recruitment_posts');
    return saved ? JSON.parse(saved) : INITIAL_RECRUITMENT_POSTS;
  });

  const [workspaceTasks, setWorkspaceTasks] = useState<WorkspaceTask[]>(() => {
    const saved = localStorage.getItem('yanai_workspace_tasks');
    return saved ? JSON.parse(saved) : INITIAL_WORKSPACE_TASKS;
  });

  const [cmsArticles, setCmsArticles] = useState<CMSArticle[]>(() => {
    const saved = localStorage.getItem('yanai_cms_articles');
    return saved ? JSON.parse(saved) : INITIAL_CMS_ARTICLES;
  });

  const [members, setMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('yanai_team_members');
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('yanai_system_settings');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_SETTINGS;
  });

  const [pocProjects, setPocProjects] = useState<PocProject[]>(() => {
    const saved = localStorage.getItem('yanai_poc_projects');
    return saved ? JSON.parse(saved) : INITIAL_POC_PROJECTS;
  });

  // UI Navigation, Role & Modal States
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [activeTab, setActiveTab] = useState<string>('home');
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitCoords, setSubmitCoords] = useState<{lat: number, lng: number, locationName: string} | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isWorkshopPopupOpen, setIsWorkshopPopupOpen] = useState(false);

  const [selectedDetailSubmission, setSelectedDetailSubmission] = useState<IdeaSubmission | null>(null);
  const [selectedDetailPocProject, setSelectedDetailPocProject] = useState<PocProject | null>(null);
  const [isPocEditorOpen, setIsPocEditorOpen] = useState(false);
  const [editingPocProject, setEditingPocProject] = useState<PocProject | null>(null);
  const [reportingPocProject, setReportingPocProject] = useState<PocProject | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  
  // Firebase Data Subscription
  useEffect(() => {
    initializeDefaultData(INITIAL_SUBMISSIONS, INITIAL_VISION_OPTIONS);
    
    const unsubSub = subscribeToSubmissions((data) => {
      if (data.length > 0) setSubmissions(data);
    });
    
    const unsubVis = subscribeToVisionOptions((data) => {
      if (data.length > 0) setVisionOptions(data);
    });
    
    return () => {
      unsubSub();
      unsubVis();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('yanai_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('yanai_vision_options', JSON.stringify(visionOptions));
  }, [visionOptions]);

  useEffect(() => {
    localStorage.setItem('yanai_workspace_tasks', JSON.stringify(workspaceTasks));
  }, [workspaceTasks]);

  useEffect(() => {
    localStorage.setItem('yanai_poc_projects', JSON.stringify(pocProjects));
  }, [pocProjects]);

  useEffect(() => {
    localStorage.setItem('yanai_system_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem('yanai_team_members', JSON.stringify(members));
  }, [members]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateMemberRole = (memberId: string, newRole: UserRole) => {
    setMembers(members.map(m => m.id === memberId ? { ...m, userRole: newRole } : m));
    showToast(`メンバー権限を「${newRole.toUpperCase()}」に変更しました`);
  };

  const handleAddMember = (newMem: Partial<TeamMember>) => {
    const member: TeamMember = {
      id: `mem-${Date.now()}`,
      name: newMem.name || '新規メンバー',
      role: newMem.role || 'ワーキンググループ担当',
      userRole: newMem.userRole || 'workspace',
      organization: newMem.organization || '柳井市役所 / 民間有志',
      departmentCategory: newMem.departmentCategory || 'city_gov',
      email: newMem.email || 'user@example.com',
      assignedWgs: newMem.assignedWgs || ['まちなか活性化WG'],
      status: 'online'
    };
    setMembers([...members, member]);
    showToast(`新メンバー「${member.name}」を追加しました`);
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
    showToast('メンバーを削除しました');
  };

  // Actions
  const handleOpenSubmitWithCoords = (lat: number, lng: number, locationName: string) => {
    setSubmitCoords({ lat, lng, locationName });
    setIsSubmitModalOpen(true);
  };
  const handleAddNewIdea = (newIdea: Partial<IdeaSubmission>) => {
    const created: IdeaSubmission = {
      id: `sub-${Date.now()}`,
      title: newIdea.title || '無題の市民提案',
      category: newIdea.category || 'downtown_buzz',
      description: newIdea.description || '',
      authorName: newIdea.authorName || '市民有志',
      ageGroup: newIdea.ageGroup || 'twenties_thirties',
      residency: newIdea.residency || 'downtown_station',
      locationName: newIdea.locationName || '柳井市中心市街地',
      lat: newIdea.lat || 33.9678,
      lng: newIdea.lng || 132.1075,
      upvotes: 1,
      downvotes: 0,
      createdAt: new Date().toISOString().split('T')[0],
      expectationScore: newIdea.expectationScore || 85,
      feasibilityScore: newIdea.feasibilityScore || 80,
      tags: newIdea.tags || ['市民投稿'],
      status: 'approved'
    };

    // Save to Firestore
    saveSubmission(created).then(() => {
      showToast('貴重なご意見ありがとうございます！データ集計に反映されました。');
    }).catch(err => {
      console.error(err);
      showToast('保存に失敗しました。');
    });
  };

  const handleUpdateSubmissionStatus = (id: string, newStatus: IdeaSubmission['status']) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status: newStatus } : s));
    showToast(`投稿ステータスを「${newStatus}」に更新しました`);
  };

  const handleVoteVision = (visionId: string) => {
    setVisionOptions(visionOptions.map(opt => opt.id === visionId ? { ...opt, votes: opt.votes + 1 } : opt));
    showToast('未来シナリオに投票しました！ありがとうございます。');
  };

  const handleApplyRecruitment = (postId: string) => {
    setRecruitmentPosts(recruitmentPosts.map(p => p.id === postId ? { ...p, currentApplicants: p.currentApplicants + 1 } : p));
    showToast('要員・サポーター応募を受け付けました！');
  };

  const handleImportSubmissions = (newSubs: IdeaSubmission[]) => {
    setSubmissions(prev => [...newSubs, ...prev]);
    showToast(`ワークショップ付箋・資料から ${newSubs.length} 件のアイデアを取り込みました！`);
  };

  const handleImportTasks = (newTasks: WorkspaceTask[]) => {
    setWorkspaceTasks(prev => [...newTasks, ...prev]);
    showToast(`ワークショップから ${newTasks.length} 件のタスクをプロジェクトプールに追加しました！`);
  };

  const handleCreateRecruitmentPost = (newPost: Partial<RecruitmentPost>) => {
    const post: RecruitmentPost = {
      id: `rec-${Date.now()}`,
      title: newPost.title || '新規プロジェクト要員募集',
      category: newPost.category || 'support_crew',
      description: newPost.description || '',
      capacity: newPost.capacity || 10,
      currentApplicants: 0,
      status: 'recruiting',
      organizer: newPost.organizer || '柳井市まちなか共創ワーキンググループ',
      targetAudience: typeof newPost.targetAudience === 'string' ? newPost.targetAudience : '高校生・市民ボランティア',
      date: newPost.date || '2026-08-31',
      location: newPost.location || '柳井市白壁の町並み',
      tags: newPost.tags || ['サポーター募集']
    };
    setRecruitmentPosts([post, ...recruitmentPosts]);
    showToast('新規募集案件を公開しました');
  };

  const handleSavePocProject = (projectData: Partial<PocProject>) => {
    if (editingPocProject) {
      setPocProjects(pocProjects.map(p => p.id === editingPocProject.id ? { ...p, ...projectData, updatedAt: new Date().toISOString().split('T')[0] } as PocProject : p));
      showToast('実証プロジェクトを更新しました');
    } else {
      const newProj: PocProject = {
        id: `poc-${Date.now()}`,
        title: projectData.title || '新規実証プロジェクト',
        subtitle: projectData.subtitle || '柳井の未来をひらく実証実験',
        status: projectData.status || 'in_progress',
        category: projectData.category || 'まちなか回遊',
        workingGroupName: projectData.workingGroupName || '柳井市まちなか共創ワーキンググループ',
        eyecatchImage: projectData.eyecatchImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
        why: projectData.why || { vision: '白壁の町並みと駅前をつなぐ賑わい創出', backgroundChallenges: '回遊性の不足' },
        what: projectData.what || { planDescription: '実証実験の実施とデータ計測', period: '2026年9月〜10月', location: '柳井駅前・白壁エリア' },
        how: projectData.how || { hypothesis: '滞在スポットの設置により滞留時間が向上する', testMethods: ['人流センサー計測', 'アンケート調査'] },
        kpi: projectData.kpi || { quantitative: ['参加者数 100名以上'], qualitative: ['満足度80%以上'] },
        who: projectData.who || { leader: { name: 'プロジェクトリーダー', title: 'WG代表', organization: '市民有志', avatarUrl: '', comment: '' }, stakeholders: [], partnerOrganizations: [] },
        nextStep: projectData.nextStep || { nextPhase: '本計画への正式反映', roadmap: ['令和8年秋: 効果測定', '令和8年冬: 計画反映'] },
        recruitment: projectData.recruitment || { isRecruiting: true, targetRoles: ['サポーター'], capacity: 10, currentApplicants: 0 },
        likesCount: 1,
        updatedAt: new Date().toISOString().split('T')[0],
        tags: projectData.tags || ['実証実験']
      };
      setPocProjects([newProj, ...pocProjects]);
      showToast('新規実証プロジェクトを作成・公開しました');
    }
    setIsPocEditorOpen(false);
    setEditingPocProject(null);
  };

  const handleLikePocProject = (id: string) => {
    setPocProjects(pocProjects.map(p => p.id === id ? { ...p, likesCount: p.likesCount + 1 } : p));
    showToast('プロジェクトに応援の「いいね」を送りました！');
  };

  const handleCreateArticle = (newArt: Partial<CMSArticle>) => {
    const article: CMSArticle = {
      id: `cms-${Date.now()}`,
      title: newArt.title || '広報記事',
      category: newArt.category || 'committee_report',
      summary: newArt.summary || '',
      content: newArt.content || '',
      author: newArt.author || '柳井市役所 地域づくり推進課',
      publishedAt: newArt.publishedAt || new Date().toLocaleDateString('ja-JP'),
      isPublished: true
    };
    setCmsArticles([article, ...cmsArticles]);
    showToast('広報記事（CMS）を配信しました');
  };

  // Section Toggles from Admin
  const toggles = systemSettings.frontendSectionToggles || {
    about: true,
    projects: true,
    vision: true,
    recruitment: true,
    submit_idea: true,
    citizen_dashboard: true
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-4 sm:px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Edit Mode Toggle */}
      {currentRole === 'admin' && (
        <button
          onClick={() => {
            const isEditable = document.body.classList.contains('admin-edit-mode-active');
            if (isEditable) {
              document.querySelectorAll('h1, h2, h3, h4, p, li, span').forEach(el => el.removeAttribute('contenteditable'));
              document.body.classList.remove('admin-edit-mode-active');
              showToast('編集モードを終了しました');
            } else {
              document.querySelectorAll('h1, h2, h3, h4, p, li').forEach(el => {
                if (!el.closest('nav') && !el.closest('button')) {
                    el.setAttribute('contenteditable', 'true');
                }
              });
              document.body.classList.add('admin-edit-mode-active');
              showToast('ページ編集モードをONにしました。テキストをクリックして直接編集できます。');
            }
          }}
          className="fixed bottom-6 left-6 z-50 bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 transition-transform hover:scale-105"
        >
          <span>✏️ ページ編集モード</span>
        </button>
      )}

      {/* 1. Global Navigation Bar */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        systemSettings={systemSettings}
      />

      {/* 2. Main Body Content Area (Fully responsive across Mobile, Tablet, PC) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10 space-y-8 sm:space-y-12">
          
          {/* TAB: home (Citizen Frontend View) */}
          {activeTab === 'home' && (
            <>
              {/* Dynamic Section Ordering via SITE_CONFIG */}
              {SITE_CONFIG.homeSectionOrder
                .filter(item => item.enabled)
                .map(item => {
                  switch (item.id) {
                    case 'hero':
                      return (
                        <HeroSection
                          key="hero"
                          onNavigateToProjects={() => setActiveTab('projects')}
                          onNavigateToIdeas={() => setActiveTab('submit_idea')}
                          onNavigateToRecruitment={() => setActiveTab('recruitment')}
                          activePocCount={pocProjects.filter(p => p.status === 'in_progress' || p.status === 'recruiting').length}
                          approvedSubmissionsCount={submissions.filter(s => s.status === 'approved' || s.status === 'reflected').length}
                        />
                      );
                    case 'about':
                      return toggles.about ? (
                        <AboutSection
                          key="about"
                          onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                          onNavigateToProjects={() => setActiveTab('projects')}
                        />
                      ) : null;
                    case 'projects':
                      return toggles.projects ? (
                        <PocProjectSection
                          key="projects"
                          projects={pocProjects}
                          currentRole={currentRole}
                          onSelectProject={(proj) => setSelectedDetailPocProject(proj)}
                          onOpenCreateProjectModal={() => {
                            setEditingPocProject(null);
                            setIsPocEditorOpen(true);
                          }}
                          onLikeProject={handleLikePocProject}
                        />
                      ) : null;
                    case 'vision':
                      return toggles.vision ? (
                        <VisionVoteSection
                          key="vision"
                          visionOptions={visionOptions}
                          onVoteVision={handleVoteVision}
                        />
                      ) : null;
                    case 'town_map':
                      return (
                        <InteractiveTownMap
                          key="town_map"
                          submissions={submissions}
                          onVote={(id, type) => {
                            const sub = submissions.find(s => s.id === id);
                            if (sub) {
                              const newData = {
                                upvotes: type === 'up' ? sub.upvotes + 1 : sub.upvotes,
                                downvotes: type === 'down' ? (sub.downvotes || 0) + 1 : sub.downvotes
                              };
                              updateSubmissionInDb(id, newData);
                            }
                            setSubmissions(submissions.map(s => s.id === id ? { 
                              ...s, 
                              upvotes: type === 'up' ? s.upvotes + 1 : s.upvotes,
                              downvotes: type === 'down' ? (s.downvotes || 0) + 1 : s.downvotes
                            } : s));
                            showToast(type === 'up' ? 'アイデアに共感しました！' : 'ご意見を記録しました');
                          }}
                          onSelectSubmissionForDetails={(sub) => setSelectedDetailSubmission(sub)}
                          onAddNewLocationIdea={() => setIsSubmitModalOpen(true)}
                        />
                      );
                    case 'recruitment':
                      return toggles.recruitment ? (
                        <RecruitmentSection
                          key="recruitment"
                          posts={recruitmentPosts}
                          onApply={handleApplyRecruitment}
                          onOpenCreateModal={() => {
                            if (currentRole === 'recruiter' || currentRole === 'admin') {
                              setActiveTab('recruiter_admin');
                            }
                          }}
                          isRecruiter={currentRole === 'recruiter' || currentRole === 'admin'}
                        />
                      ) : null;
                    case 'submit_idea':
                      return toggles.submit_idea ? (
                        <IdeaSubmissionSection
                          key="submit_idea"
                          onAddNewIdea={handleAddNewIdea}
                          submissionsCount={submissions.length}
                        />
                      ) : null;
                    case 'citizen_dashboard':
                      return toggles.citizen_dashboard ? (
                        <CitizenDashboard
                          key="citizen_dashboard"
                          submissions={submissions}
                        />
                      ) : null;
                    default:
                      return null;
                  }
                })}
            </>
          )}

          {/* TAB: about */}
          {activeTab === 'about' && (
            <div className="space-y-8">
              <AboutSection
                onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                onNavigateToProjects={() => setActiveTab('projects')}
              />
              <InteractiveTownMap
                submissions={submissions}
                onVote={(id, type) => {
                  const sub = submissions.find(s => s.id === id);
                  if (sub) {
                    const newData = {
                      upvotes: type === 'up' ? sub.upvotes + 1 : sub.upvotes,
                      downvotes: type === 'down' ? (sub.downvotes || 0) + 1 : sub.downvotes
                    };
                    updateSubmissionInDb(id, newData);
                  }
                  setSubmissions(submissions.map(s => s.id === id ? { 
                    ...s, 
                    upvotes: type === 'up' ? s.upvotes + 1 : s.upvotes,
                    downvotes: type === 'down' ? (s.downvotes || 0) + 1 : s.downvotes
                  } : s));
                  showToast(type === 'up' ? 'アイデアに共感しました！' : 'ご意見を記録しました');
                }}
                onSelectSubmissionForDetails={(sub) => setSelectedDetailSubmission(sub)}
                onAddNewLocationIdea={() => setIsSubmitModalOpen(true)}
                onOpenSubmitWithCoords={handleOpenSubmitWithCoords}
              />
            </div>
          )}

          {/* TAB: projects */}
          {activeTab === 'projects' && (
            <PocProjectSection
              projects={pocProjects}
              currentRole={currentRole}
              onSelectProject={(proj) => setSelectedDetailPocProject(proj)}
              onOpenCreateProjectModal={() => {
                setEditingPocProject(null);
                setIsPocEditorOpen(true);
              }}
              onLikeProject={handleLikePocProject}
            />
          )}

          {/* TAB: vision */}
          {activeTab === 'vision' && (
            <VisionVoteSection
              visionOptions={visionOptions}
              onVoteVision={handleVoteVision}
            />
          )}

          {/* TAB: recruitment */}
          {activeTab === 'recruitment' && (
            <RecruitmentSection
              posts={recruitmentPosts}
              onApply={handleApplyRecruitment}
              onOpenCreateModal={() => {
                if (currentRole === 'recruiter' || currentRole === 'admin') {
                  setActiveTab('recruiter_admin');
                }
              }}
              isRecruiter={currentRole === 'recruiter' || currentRole === 'admin'}
            />
          )}

          {/* TAB: submit_idea */}
          {activeTab === 'submit_idea' && (
            <div className="space-y-8">
              <IdeaSubmissionSection
                onAddNewIdea={handleAddNewIdea}
                submissionsCount={submissions.length}
              />
              <InteractiveTownMap
                submissions={submissions}
                onVote={(id, type) => {
                  const sub = submissions.find(s => s.id === id);
                  if (sub) {
                    const newData = {
                      upvotes: type === 'up' ? sub.upvotes + 1 : sub.upvotes,
                      downvotes: type === 'down' ? (sub.downvotes || 0) + 1 : sub.downvotes
                    };
                    updateSubmissionInDb(id, newData);
                  }
                  setSubmissions(submissions.map(s => s.id === id ? { 
                    ...s, 
                    upvotes: type === 'up' ? s.upvotes + 1 : s.upvotes,
                    downvotes: type === 'down' ? (s.downvotes || 0) + 1 : s.downvotes
                  } : s));
                  showToast(type === 'up' ? 'アイデアに共感しました！' : 'ご意見を記録しました');
                }}
                onSelectSubmissionForDetails={(sub) => setSelectedDetailSubmission(sub)}
                onAddNewLocationIdea={() => setIsSubmitModalOpen(true)}
                onOpenSubmitWithCoords={handleOpenSubmitWithCoords}
              />
            </div>
          )}

          {/* TAB: citizen_dashboard */}
          {activeTab === 'citizen_dashboard' && (
            <CitizenDashboard
              submissions={submissions}
            />
          )}

          {/* TAB: matrix (Admin / Member restricted) */}
          {activeTab === 'matrix' && (
            <TwoAxisMatrixDashboard
              submissions={submissions}
              onUpdateCoordinates={(id, f, e) => {
                setSubmissions(submissions.map(s => s.id === id ? { ...s, feasibilityScore: f, expectationScore: e } : s));
              }}
              onBatchAnalyze={() => {
                showToast('夜間バッチAI分析（2軸マトリックス）を実行しました');
              }}
              isAnalyzing={false}
            />
          )}

          {/* TAB: admin (Admin Role only) */}
          {activeTab === 'admin' && (
            <AdminModeration
              submissions={submissions}
              onUpdateStatus={handleUpdateSubmissionStatus}
              systemSettings={systemSettings}
              onUpdateSettings={setSystemSettings}
              cmsArticles={cmsArticles}
              onCreateArticle={handleCreateArticle}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              members={members}
              onUpdateMemberRole={handleUpdateMemberRole}
              onAddMember={handleAddMember}
              onDeleteMember={handleDeleteMember}
              onImportSubmissions={handleImportSubmissions}
              onImportTasks={handleImportTasks}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
            />
          )}

          {/* TAB: workspace (Member Role) */}
          {activeTab === 'workspace' && (
            <WorkspaceKanban
              tasks={workspaceTasks}
              submissions={submissions}
              currentRole={currentRole}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
              onSwitchRole={(role) => setCurrentRole(role)}
              onUpdateTaskStage={(id, stage) => {
                setWorkspaceTasks(workspaceTasks.map(t => t.id === id ? { ...t, stage } : t));
                showToast('タスクのステージを更新しました');
              }}
              onUpdateTaskStatus={(id, stage) => {
                setWorkspaceTasks(workspaceTasks.map(t => t.id === id ? { ...t, stage } : t));
                showToast('タスクのステージを更新しました');
              }}
              onAddTask={(task) => {
                const newTask: WorkspaceTask = {
                  id: `task-${Date.now()}`,
                  title: task.title || '新規タスク',
                  category: task.category || 'まちなか回遊',
                  stage: (task as any).stage || 'ideas_pool',
                  priority: task.priority || 'medium',
                  assignee: task.assignee || '市民ワーキンググループ',
                  dueDate: task.dueDate || '2026-09-15',
                  notes: task.notes || '',
                  linkedSubmissionId: task.linkedSubmissionId
                };
                setWorkspaceTasks([...workspaceTasks, newTask]);
                showToast('新規タスクを追加しました');
              }}
              systemSettings={systemSettings}
              onUpdateSettings={setSystemSettings}
              cmsArticles={cmsArticles}
              onCreateArticle={handleCreateArticle}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              members={members}
              onUpdateMemberRole={handleUpdateMemberRole}
              onAddMember={handleAddMember}
              onDeleteMember={handleDeleteMember}
              onUpdateSubmissionStatus={handleUpdateSubmissionStatus}
              recruitmentPosts={recruitmentPosts}
              onCreateRecruitmentPost={handleCreateRecruitmentPost}
              onImportSubmissions={handleImportSubmissions}
              onImportTasks={handleImportTasks}
            />
          )}

          {/* TAB: recruiter_admin (Recruiter Role) */}
          {activeTab === 'recruiter_admin' && (
            <RecruitmentAdmin
              posts={recruitmentPosts}
              onCreatePost={handleCreateRecruitmentPost}
            />
          )}

        </main>

        {/* 4. Footer with User-Requested Login Button */}
        <Footer
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          currentRole={currentRole}
          setActiveTab={setActiveTab}
          onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        />

        {/* Modals Container */}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        onNavigateToTab={setActiveTab}
      />

      {/* Idea Submission Modal */}
      <IdeaSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          setSubmitCoords(null);
        }}
        onSubmitIdea={handleAddNewIdea}
        defaultLat={submitCoords?.lat}
        defaultLng={submitCoords?.lng}
        defaultLocationName={submitCoords?.locationName}
      />

      {/* Idea Detail Modal */}
      {selectedDetailSubmission && (
        <IdeaDetailModal
          isOpen={!!selectedDetailSubmission}
          submission={selectedDetailSubmission}
          onClose={() => setSelectedDetailSubmission(null)}
          onUpdateStatus={handleUpdateSubmissionStatus}
          currentRole={currentRole}
        />
      )}

      {/* A3 Data Export & Spec Document Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        submissions={submissions}
        visionOptions={visionOptions}
        workspaceTasks={workspaceTasks}
        systemSettings={systemSettings}
        pocProjects={pocProjects}
      />

      {/* PoC Detail Modal */}
      {selectedDetailPocProject && (
        <PocProjectDetailModal
          isOpen={!!selectedDetailPocProject}
          project={selectedDetailPocProject}
          onClose={() => setSelectedDetailPocProject(null)}
          onOpenEditor={() => {
            setEditingPocProject(selectedDetailPocProject);
            setIsPocEditorOpen(true);
            setSelectedDetailPocProject(null);
          }}
          onOpenReportWizard={() => {
            setReportingPocProject(selectedDetailPocProject);
            setSelectedDetailPocProject(null);
          }}
          currentRole={currentRole}
          onLikeProject={handleLikePocProject}
        />
      )}

      {/* PoC Editor Modal */}
      {isPocEditorOpen && (
        <PocProjectEditorModal
          isOpen={isPocEditorOpen}
          initialProject={editingPocProject}
          onClose={() => {
            setIsPocEditorOpen(false);
            setEditingPocProject(null);
          }}
          onSave={handleSavePocProject}
        />
      )}

      {/* PoC Report Wizard Modal */}
      {reportingPocProject && (
        <PocReportWizardModal
          isOpen={!!reportingPocProject}
          project={reportingPocProject}
          onClose={() => setReportingPocProject(null)}
          onSaveReport={(rep) => {
            showToast('実証実験レポートを作成しました');
            setReportingPocProject(null);
          }}
        />
      )}

      {/* Workshop Popup Modal */}
      {isWorkshopPopupOpen && (
        <WorkshopPopupModal
          isOpen={isWorkshopPopupOpen}
          onClose={() => setIsWorkshopPopupOpen(false)}
          onApply={() => {
            setIsWorkshopPopupOpen(false);
            setActiveTab('recruitment');
          }}
        />
      )}

    </div>
  );
}
