import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Home,
  BookOpen,
  HelpCircle,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  Upload,
  Folder,
  Activity,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  School,
  Target,
  TrendingUp,
  Download,
  Shield,
  Zap,
  UserPlus,
  GraduationCap,
  LogOut,
  Calendar,
  CheckSquare,
  Award,
  Layers,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';

interface NavigationItem {
  path: string;
  label: string;
  labelFr: string;
  icon: React.ElementType;
  badge?: string;
  isSpecial?: boolean;
}

interface NavigationSection {
  id: string;
  title: string;
  titleFr: string;
  icon: React.ElementType;
  items: NavigationItem[];
}

const SidebarNavigation: React.FC = () => {
  const { user, school, logout, switchRole, language } = useAuth();
  const { getUnreadCount } = useRealtime();
  const location = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  // Accordion state: open sections set
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    sec_gov: true,
    sec_content: true,
    sec_sys: true,
    sec_admin: true,
    sec_academic: true,
    sec_stats: true,
    sec_teach: true,
    sec_class: true,
    sec_insights: true,
    sec_parent: true,
    sec_student: true
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Shield className="h-4 w-4" />;
      case 'school_admin': return <School className="h-4 w-4" />;
      case 'teacher': return <BookOpen className="h-4 w-4" />;
      case 'student': return <GraduationCap className="h-4 w-4" />;
      case 'parent': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500';
      case 'school_admin': return 'bg-blue-500';
      case 'teacher': return 'bg-emerald-500';
      case 'student': return 'bg-purple-500';
      case 'parent': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setShowRoleSwitcher(false);
    toast.success(
      language === 'fr'
        ? `Profil activé: ${newRole.replace('_', ' ')}`
        : `Switched profile to: ${newRole.replace('_', ' ')}`
    );
    // Redirect to default route of new role
    if (newRole === 'super_admin') navigate('/');
    else if (newRole === 'school_admin') navigate('/school-admin-overview');
    else if (newRole === 'teacher') navigate('/teacher-dashboard');
    else if (newRole === 'student') navigate('/student-progress');
    else if (newRole === 'parent') navigate('/parent-portal');
  };

  // Structured Accordion Navigation Sections per User Role (Strict Separation)
  const getSectionsForRole = (): NavigationSection[] => {
    if (!user) return [];

    switch (user.role) {
      // =====================================================================
      // 1. SUPER ADMIN (Multi-School & System Governance)
      // =====================================================================
      case 'super_admin':
        return [
          {
            id: 'sec_gov',
            title: 'Network Governance',
            titleFr: 'Gouvernance Réseau',
            icon: School,
            items: [
              { path: '/', label: 'Overview Dashboard', labelFr: 'Tableau de Bord', icon: Home },
              { path: '/global-search', label: 'Global Search', labelFr: 'Recherche Globale', icon: Search }
            ]
          },
          {
            id: 'sec_content',
            title: 'Curriculum & Resources',
            titleFr: 'Contenus & Programmes',
            icon: BookOpen,
            items: [
              { path: '/content-library', label: 'Content Library', labelFr: 'Bibliothèque de Contenus', icon: BookOpen },
              { path: '/content-search', label: 'Resource Search', labelFr: 'Recherche de Ressources', icon: Search },
              { path: '/bulk-upload', label: 'Bulk Upload', labelFr: 'Téléchargement en Lot', icon: Upload },
              { path: '/file-manager', label: 'File Manager', labelFr: 'Gestionnaire de Fichiers', icon: Folder },
              { path: '/anglophone-curriculum', label: 'Official Curriculum', labelFr: 'Programme National', icon: Target }
            ]
          },
          {
            id: 'sec_sys',
            title: 'System & Infrastructure',
            titleFr: 'Système & Infrastructure',
            icon: Settings,
            items: [
              { path: '/feature-management', label: 'Feature Flags', labelFr: 'Gestion Fonctionnalités', icon: Settings, badge: 'Core' },
              { path: '/performance-monitor', label: 'Performance Monitor', labelFr: 'Moniteur Performance', icon: Activity },
              { path: '/bulk-operations', label: 'Bulk Operations', labelFr: 'Opérations en Lot', icon: Layers },
              { path: '/realtime-demo', label: 'Real-time Feed', labelFr: 'Flux Temps Réel', icon: Zap },
              { path: '/api-test', label: 'API Diagnostics', labelFr: 'Diagnostics API', icon: Zap }
            ]
          }
        ];

      // =====================================================================
      // 2. SCHOOL ADMIN (Principal / Proviseur / Administration)
      // =====================================================================
      case 'school_admin':
        return [
          {
            id: 'sec_admin',
            title: 'School Administration',
            titleFr: 'Administration École',
            icon: School,
            items: [
              { path: '/school-admin-overview', label: 'Principal Overview', labelFr: 'Tableau de Bord Proviseur', icon: Home },
              { path: '/school-admin-users', label: 'Staff & Users', labelFr: 'Personnel & Utilisateurs', icon: Users },
              { path: '/classes', label: 'Classes & Streams', labelFr: 'Gestion des Classes', icon: GraduationCap }
            ]
          },
          {
            id: 'sec_academic',
            title: 'Academic Operations',
            titleFr: 'Vie Scolaire & Résultats',
            icon: Award,
            items: [
              { path: '/attendance', label: 'Attendance & Discipline', labelFr: 'Présences & Discipline', icon: CheckSquare },
              { path: '/gradebook', label: 'MINESEC Report Cards', labelFr: 'Notes & Bulletins MINESEC', icon: Award, badge: 'MINESEC' },
              { path: '/timetable', label: 'Master Timetables', labelFr: 'Emplois du Temps', icon: Calendar }
            ]
          },
          {
            id: 'sec_stats',
            title: 'Reports & Analytics',
            titleFr: 'Statistiques & Rapports',
            icon: BarChart3,
            items: [
              { path: '/analytics', label: 'School Analytics', labelFr: 'Statistiques & Ratios', icon: BarChart3 },
              { path: '/monthly-reports', label: 'Monthly Reports', labelFr: 'Rapports Mensuels', icon: FileText }
            ]
          }
        ];

      // =====================================================================
      // 3. TEACHER (Enseignant / Professeur)
      // =====================================================================
      case 'teacher':
        return [
          {
            id: 'sec_teach',
            title: 'Teaching & Pedagogy',
            titleFr: 'Pédagogie & Cours',
            icon: BookOpen,
            items: [
              { path: '/teacher-dashboard', label: 'Teacher Dashboard', labelFr: 'Tableau de Bord', icon: Home },
              { path: '/lesson-planner', label: 'Lesson Planner', labelFr: 'Planificateur de Cours', icon: BookOpen },
              { path: '/quiz', label: 'Quiz & Exam Builder', labelFr: 'Création de Quiz', icon: HelpCircle },
              { path: '/anglophone-curriculum', label: 'Official Syllabus', labelFr: 'Programme Officiel', icon: Target }
            ]
          },
          {
            id: 'sec_class',
            title: 'Classroom & Grading',
            titleFr: 'Gestion de Classe & Notes',
            icon: CheckSquare,
            items: [
              { path: '/attendance', label: 'Attendance Register', labelFr: 'Feuille d\'Appel', icon: CheckSquare },
              { path: '/gradebook', label: 'Séquences & APC', labelFr: 'Notes & Séquences APC', icon: Award, badge: 'APC' },
              { path: '/timetable', label: 'My Teaching Schedule', labelFr: 'Mon Emploi du Temps', icon: Calendar }
            ]
          },
          {
            id: 'sec_insights',
            title: 'Student Tracking',
            titleFr: 'Suivi des Élèves',
            icon: TrendingUp,
            items: [
              { path: '/student-progress', label: 'Student Progress', labelFr: 'Progrès des Élèves', icon: TrendingUp },
              { path: '/progress-insights', label: 'Competency Insights', labelFr: 'Aperçu Pédagogique', icon: BarChart3 },
              { path: '/export-center', label: 'Export Center', labelFr: 'Centre d\'Exportation', icon: Download }
            ]
          }
        ];

      // =====================================================================
      // 4. PARENT (Parent d'élève & Tuteurs)
      // =====================================================================
      case 'parent':
        return [
          {
            id: 'sec_parent',
            title: 'Child Academic Profile',
            titleFr: 'Suivi de l\'Élève',
            icon: Users,
            items: [
              { path: '/parent-portal', label: 'Child Dashboard', labelFr: 'Tableau de Bord Enfant', icon: Home },
              { path: '/gradebook', label: 'Official Report Cards', labelFr: 'Bulletins & Notes', icon: Award, badge: 'QR' },
              { path: '/timetable', label: 'Class Schedule', labelFr: 'Emploi du Temps', icon: Calendar },
              { path: '/parent-quiz', label: 'Home Practice Quizzes', labelFr: 'Quiz de Révision', icon: HelpCircle }
            ]
          }
        ];

      // =====================================================================
      // 5. STUDENT (Élève)
      // =====================================================================
      case 'student':
        return [
          {
            id: 'sec_student',
            title: 'My School Space',
            titleFr: 'Mon Espace Scolaire',
            icon: GraduationCap,
            items: [
              { path: '/student-progress', label: 'My Marks & Progress', labelFr: 'Mes Notes & Cotes', icon: Award },
              { path: '/timetable', label: 'My Class Schedule', labelFr: 'Mon Emploi du Temps', icon: Calendar },
              { path: '/quiz', label: 'Quizzes & Exercises', labelFr: 'Quiz & Exercices', icon: HelpCircle },
              { path: '/curriculum', label: 'Learning Materials', labelFr: 'Programme de Cours', icon: BookOpen }
            ]
          }
        ];

      default:
        return [];
    }
  };

  const sections = getSectionsForRole();

  if (!user) return null;

  return (
    <>
      {/* Mobile Menu Trigger Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-indigo-900 shadow-xl text-white hover:bg-indigo-800 transition-colors"
          title="Open menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-slate-900 text-slate-100 shadow-2xl transform transition-all duration-300 ease-in-out flex flex-col border-r border-slate-800 ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          {!isCollapsed && (
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <School className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-black tracking-tight text-white uppercase truncate">
                  {language === 'fr' ? 'Système Éducatif' : 'EMS Cameroon'}
                </h1>
                <p className="text-[11px] text-indigo-300 font-medium truncate">
                  {school?.name || 'GBHS Yaoundé'}
                </p>
              </div>
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Accordion Role-Separated Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
          {sections.map((section) => {
            const SectionIcon = section.icon;
            const isOpen = openSections[section.id] !== false;

            return (
              <div key={section.id} className="space-y-1">
                {/* Section Accordion Header */}
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 uppercase tracking-wider rounded-md hover:bg-slate-800/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <SectionIcon className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="truncate">{language === 'fr' ? section.titleFr : section.title}</span>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded-full group-hover:bg-slate-700">
                        {section.items.length}
                      </span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${
                          isOpen ? 'rotate-0' : '-rotate-90'
                        }`}
                      />
                    </div>
                  </button>
                ) : (
                  <div className="h-px bg-slate-800 my-2" />
                )}

                {/* Section Items (Collapsible) */}
                {(isOpen || isCollapsed) && (
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      const ItemIcon = item.icon;

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center px-2.5 py-2 rounded-xl text-xs font-semibold transition-all group ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                          title={isCollapsed ? (language === 'fr' ? item.labelFr : item.label) : undefined}
                        >
                          <ItemIcon
                            className={`h-4 w-4 flex-shrink-0 ${
                              isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                            } ${isCollapsed ? 'mx-auto' : 'mr-2.5'}`}
                          />
                          {!isCollapsed && (
                            <div className="flex items-center justify-between flex-1 min-w-0">
                              <span className="truncate">
                                {language === 'fr' ? item.labelFr : item.label}
                              </span>
                              {item.badge && (
                                <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer: User Profile, Role Badge & Switcher */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 space-y-2">
          {/* Quick Role Switcher Toggle (Demo Mode) */}
          {!isCollapsed && (
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700/60 transition-colors"
                title="Switch Profile Perspective"
              >
                <div className="flex items-center space-x-2">
                  <ArrowRightLeft className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="text-[11px] font-bold">
                    {language === 'fr' ? 'Changer de Profil' : 'Switch Profile'}
                  </span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showRoleSwitcher ? 'rotate-180' : ''}`} />
              </button>

              {/* Role Dropdown */}
              {showRoleSwitcher && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden p-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/60 mb-1">
                    {language === 'fr' ? 'Profils de Démonstration' : 'Available Demo Profiles'}
                  </div>
                  {(['super_admin', 'school_admin', 'teacher', 'student', 'parent'] as UserRole[]).map((r) => {
                    const isCurrent = user.role === r;
                    return (
                      <button
                        key={r}
                        onClick={() => handleRoleSwitch(r)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                          isCurrent
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <span className="capitalize">{r.replace('_', ' ')}</span>
                        {isCurrent && <span className="text-[9px] bg-white/20 px-1.5 rounded">Actif</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* User Card */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white flex-shrink-0 ${getRoleColor(user.role)} shadow`}>
                {getRoleIcon(user.role)}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                  <p className="text-[10px] text-slate-400 capitalize truncate">
                    {user.role.replace('_', ' ')}
                  </p>
                </div>
              )}
            </div>

            {/* Logout Icon Button */}
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title={language === 'fr' ? 'Se Déconnecter' : 'Sign Out'}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default SidebarNavigation;
