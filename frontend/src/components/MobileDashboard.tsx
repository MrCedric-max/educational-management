import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  BookOpen,
  HelpCircle,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Activity,
  FileText,
  Upload,
  Folder,
  Target,
  TrendingUp,
  Download,
  School,
  Zap,
  GraduationCap,
  LogOut,
  Calendar,
  CheckSquare,
  Award,
  Layers
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';

interface MobileDashboardProps {
  children: React.ReactNode;
}

interface NavSection {
  title: string;
  titleFr: string;
  items: {
    path: string;
    label: string;
    labelFr: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({ children }) => {
  const { user, school, logout, language } = useAuth();
  const { getUnreadCount } = useRealtime();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Strict role-specific navigation sections (zero duplication)
  const getRoleSections = (): NavSection[] => {
    if (!user) return [];

    switch (user.role) {
      case 'super_admin':
        return [
          {
            title: 'Network Governance',
            titleFr: 'Gouvernance Réseau',
            items: [
              { path: '/', label: 'Overview Dashboard', labelFr: 'Tableau de Bord', icon: Home },
              { path: '/global-search', label: 'Global Search', labelFr: 'Recherche Globale', icon: Search }
            ]
          },
          {
            title: 'Curriculum & Resources',
            titleFr: 'Contenus & Programmes',
            items: [
              { path: '/content-library', label: 'Content Library', labelFr: 'Bibliothèque de Contenus', icon: BookOpen },
              { path: '/content-search', label: 'Resource Search', labelFr: 'Recherche de Ressources', icon: Search },
              { path: '/bulk-upload', label: 'Bulk Upload', labelFr: 'Téléchargement en Lot', icon: Upload },
              { path: '/file-manager', label: 'File Manager', labelFr: 'Gestionnaire de Fichiers', icon: Folder },
              { path: '/anglophone-curriculum', label: 'Official Curriculum', labelFr: 'Programme National', icon: Target }
            ]
          },
          {
            title: 'System & Infrastructure',
            titleFr: 'Système & Infrastructure',
            items: [
              { path: '/feature-management', label: 'Feature Flags', labelFr: 'Gestion Fonctionnalités', icon: Settings, badge: 'Core' },
              { path: '/performance-monitor', label: 'Performance Monitor', labelFr: 'Moniteur Performance', icon: Activity },
              { path: '/bulk-operations', label: 'Bulk Operations', labelFr: 'Opérations en Lot', icon: Layers },
              { path: '/realtime-demo', label: 'Real-time Feed', labelFr: 'Flux Temps Réel', icon: Zap },
              { path: '/api-test', label: 'API Diagnostics', labelFr: 'Diagnostics API', icon: Zap }
            ]
          }
        ];

      case 'school_admin':
        return [
          {
            title: 'School Administration',
            titleFr: 'Administration École',
            items: [
              { path: '/school-admin-overview', label: 'Principal Overview', labelFr: 'Tableau de Bord Proviseur', icon: Home },
              { path: '/school-admin-users', label: 'Staff & Users', labelFr: 'Personnel & Utilisateurs', icon: Users },
              { path: '/classes', label: 'Classes & Streams', labelFr: 'Gestion des Classes', icon: GraduationCap }
            ]
          },
          {
            title: 'Academic Operations',
            titleFr: 'Vie Scolaire & Résultats',
            items: [
              { path: '/attendance', label: 'Attendance & Discipline', labelFr: 'Présences & Discipline', icon: CheckSquare },
              { path: '/gradebook', label: 'MINESEC Report Cards', labelFr: 'Notes & Bulletins MINESEC', icon: Award, badge: 'MINESEC' },
              { path: '/timetable', label: 'Master Timetables', labelFr: 'Emplois du Temps', icon: Calendar }
            ]
          },
          {
            title: 'Reports & Analytics',
            titleFr: 'Statistiques & Rapports',
            items: [
              { path: '/analytics', label: 'School Analytics', labelFr: 'Statistiques & Ratios', icon: BarChart3 },
              { path: '/monthly-reports', label: 'Monthly Reports', labelFr: 'Rapports Mensuels', icon: FileText }
            ]
          }
        ];

      case 'teacher':
        return [
          {
            title: 'Teaching & Pedagogy',
            titleFr: 'Pédagogie & Cours',
            items: [
              { path: '/teacher-dashboard', label: 'Teacher Dashboard', labelFr: 'Tableau de Bord', icon: Home },
              { path: '/lesson-planner', label: 'Lesson Planner', labelFr: 'Planificateur de Cours', icon: BookOpen },
              { path: '/quiz', label: 'Quiz & Exam Builder', labelFr: 'Création de Quiz', icon: HelpCircle },
              { path: '/anglophone-curriculum', label: 'Official Syllabus', labelFr: 'Programme Officiel', icon: Target }
            ]
          },
          {
            title: 'Classroom & Grading',
            titleFr: 'Gestion de Classe & Notes',
            items: [
              { path: '/attendance', label: 'Attendance Register', labelFr: 'Feuille d\'Appel', icon: CheckSquare },
              { path: '/gradebook', label: 'Séquences & APC', labelFr: 'Notes & Séquences APC', icon: Award, badge: 'APC' },
              { path: '/timetable', label: 'My Teaching Schedule', labelFr: 'Mon Emploi du Temps', icon: Calendar }
            ]
          },
          {
            title: 'Student Tracking',
            titleFr: 'Suivi des Élèves',
            items: [
              { path: '/student-progress', label: 'Student Progress', labelFr: 'Progrès des Élèves', icon: TrendingUp },
              { path: '/progress-insights', label: 'Competency Insights', labelFr: 'Aperçu Pédagogique', icon: BarChart3 },
              { path: '/export-center', label: 'Export Center', labelFr: 'Centre d\'Exportation', icon: Download }
            ]
          }
        ];

      case 'parent':
        return [
          {
            title: 'Child Academic Profile',
            titleFr: 'Suivi de l\'Élève',
            items: [
              { path: '/parent-portal', label: 'Child Dashboard', labelFr: 'Tableau de Bord Enfant', icon: Home },
              { path: '/gradebook', label: 'Official Report Cards', labelFr: 'Bulletins & Notes', icon: Award, badge: 'QR' },
              { path: '/timetable', label: 'Class Schedule', labelFr: 'Emploi du Temps', icon: Calendar },
              { path: '/parent-quiz', label: 'Home Practice Quizzes', labelFr: 'Quiz de Révision', icon: HelpCircle }
            ]
          }
        ];

      default:
        return [];
    }
  };

  // Primary bottom navigation items (exactly 4 non-redundant core shortcuts per role)
  const getBottomNavItems = () => {
    if (!user) return [];
    switch (user.role) {
      case 'super_admin':
        return [
          { path: '/', label: 'Network', icon: Home },
          { path: '/content-library', label: 'Content', icon: BookOpen },
          { path: '/global-search', label: 'Search', icon: Search },
          { path: '/feature-management', label: 'System', icon: Settings }
        ];
      case 'school_admin':
        return [
          { path: '/school-admin-overview', label: 'Overview', icon: Home },
          { path: '/school-admin-users', label: 'Staff', icon: Users },
          { path: '/classes', label: 'Classes', icon: GraduationCap },
          { path: '/gradebook', label: 'Bulletins', icon: Award }
        ];
      case 'teacher':
        return [
          { path: '/teacher-dashboard', label: 'Dashboard', icon: Home },
          { path: '/lesson-planner', label: 'Lessons', icon: BookOpen },
          { path: '/attendance', label: 'Roll Call', icon: CheckSquare },
          { path: '/gradebook', label: 'Gradebook', icon: Award }
        ];
      case 'parent':
        return [
          { path: '/parent-portal', label: 'Child', icon: Home },
          { path: '/gradebook', label: 'Bulletins', icon: Award },
          { path: '/timetable', label: 'Schedule', icon: Calendar },
          { path: '/parent-quiz', label: 'Practice', icon: HelpCircle }
        ];
      default:
        return [];
    }
  };

  const sections = getRoleSections();
  const bottomNavItems = getBottomNavItems();

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              title="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="ml-3">
              <h1 className="text-sm font-bold text-gray-900 truncate max-w-[180px]">
                {school?.name || 'GBHS Yaoundé'}
              </h1>
              <p className="text-[11px] text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg touch-manipulation" 
              title={language === 'fr' ? 'Notifications' : 'Notifications'}
              onClick={() => {
                navigate('/gradebook');
              }}
            >
              <Bell className="w-5 h-5" />
              {getUnreadCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-xs text-white rounded-full flex items-center justify-center font-bold">
                  {getUnreadCount()}
                </span>
              )}
            </button>
            <button 
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg touch-manipulation" 
              title={language === 'fr' ? 'Recherche' : 'Search'}
              onClick={() => {
                navigate(user?.role === 'super_admin' ? '/global-search' : '/gradebook');
              }}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer - Organized by Role Sections */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-slate-900 text-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center space-x-2">
                <School className="h-6 w-6 text-indigo-400" />
                <h2 className="text-sm font-black tracking-wider uppercase text-white">
                  {language === 'fr' ? 'Navigation' : 'Menu'}
                </h2>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                title="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="p-4 flex-1 overflow-y-auto space-y-4">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    {language === 'fr' ? section.titleFr : section.title}
                  </div>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center px-3 py-2.5 text-left rounded-xl text-xs font-semibold transition-colors touch-manipulation ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3 text-indigo-400" />
                        <span className="truncate">{language === 'fr' ? item.labelFr : item.label}</span>
                        {item.badge && (
                          <span className="ml-2 px-1.5 py-0.2 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-500" />
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Logout Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/70">
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 text-left rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3 text-rose-400" />
                {language === 'fr' ? 'Se Déconnecter' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <div className="min-h-screen">
        <div className="px-4 py-4 pb-24">
          {children}
        </div>

        {/* Clean, Non-Repetitive Bottom Navigation Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-1.5 z-40 shadow-lg">
          <div className="flex items-center justify-around">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-colors touch-manipulation ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50 font-bold'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
