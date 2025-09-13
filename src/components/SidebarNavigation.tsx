import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  LogOut,
  Clock,
  PieChart,
  Calendar,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';

const SidebarNavigation: React.FC = () => {
  const { user, school, logout, hasPermission, language } = useAuth();
  const { getUnreadCount } = useRealtime();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Shield className="h-4 w-4" />;
      case 'school_admin': return <School className="h-4 w-4" />;
      case 'teacher': return <BookOpen className="h-4 w-4" />;
      case 'student': return <Users className="h-4 w-4" />;
      case 'parent': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500';
      case 'school_admin': return 'bg-blue-500';
      case 'teacher': return 'bg-green-500';
      case 'student': return 'bg-purple-500';
      case 'parent': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];

    const baseItems = [];
    
    // Dashboard access based on role
    if (hasPermission('super_admin')) {
      baseItems.push({ path: '/', label: language === 'fr' ? 'Tableau de Bord' : 'Dashboard', icon: Home, roles: ['super_admin'] });
    } else if (hasPermission('school_admin')) {
      baseItems.push({ path: '/school-admin-overview', label: language === 'fr' ? 'Tableau de Bord' : 'Dashboard', icon: Home, roles: ['school_admin'] });
    } else if (hasPermission('teacher')) {
      baseItems.push({ path: '/teacher-dashboard', label: language === 'fr' ? 'Tableau de Bord' : 'Dashboard', icon: Home, roles: ['teacher'] });
    } else if (hasPermission('student')) {
      baseItems.push({ path: '/student-progress', label: language === 'fr' ? 'Tableau de Bord' : 'Dashboard', icon: Home, roles: ['student'] });
    } else if (hasPermission('parent')) {
      baseItems.push({ path: '/parent-dashboard', label: language === 'fr' ? 'Tableau de Bord' : 'Dashboard', icon: Home, roles: ['parent'] });
    }

    const roleSpecificItems = [];

    // Super Admin items
    if (hasPermission('super_admin') && user.role === 'super_admin') {
      roleSpecificItems.push(
        { path: '/global-search', label: language === 'fr' ? 'Recherche Globale' : 'Global Search', icon: Search, roles: ['super_admin'] },
        { path: '/realtime-demo', label: language === 'fr' ? 'Démo Temps Réel' : 'Real-time Demo', icon: Activity, roles: ['super_admin'] },
        { path: '/advanced-analytics', label: language === 'fr' ? 'Analyses Avancées' : 'Advanced Analytics', icon: BarChart3, roles: ['super_admin'] },
        { path: '/bulk-operations', label: language === 'fr' ? 'Opérations en Lot' : 'Bulk Operations', icon: Settings, roles: ['super_admin'] },
        { path: '/performance-monitor', label: language === 'fr' ? 'Moniteur de Performance' : 'Performance Monitor', icon: Zap, roles: ['super_admin'] },
        { path: '/content-library', label: language === 'fr' ? 'Bibliothèque de Contenu' : 'Content Library', icon: BookOpen, roles: ['super_admin'] },
        { path: '/content-search', label: language === 'fr' ? 'Recherche Avancée' : 'Advanced Search', icon: Search, roles: ['super_admin'] },
        { path: '/bulk-upload', label: language === 'fr' ? 'Téléchargement en Lot' : 'Bulk Upload', icon: Upload, roles: ['super_admin'] },
        { path: '/file-manager', label: language === 'fr' ? 'Gestionnaire de Fichiers' : 'File Manager', icon: Folder, roles: ['super_admin'] },
        { path: '/feature-management', label: language === 'fr' ? 'Gestion des Fonctionnalités' : 'Feature Management', icon: Settings, roles: ['super_admin'], isSpecial: true },
        { path: '/api-test', label: language === 'fr' ? 'Test API' : 'API Test', icon: Zap, roles: ['super_admin', 'school_admin', 'teacher'] },
        { path: '/anglophone-curriculum', label: language === 'fr' ? 'Programme Anglophone' : 'Anglophone Curriculum', icon: BookOpen, roles: ['super_admin', 'school_admin', 'teacher'] }
      );
    }

    // School Admin items
    if (hasPermission('school_admin') && user.role === 'school_admin') {
      roleSpecificItems.push(
        { path: '/school-admin', label: language === 'fr' ? 'Tableau de Bord' : 'Overview', icon: Home, roles: ['school_admin'] },
        { path: '/school-admin-users', label: language === 'fr' ? 'Utilisateurs' : 'Users', icon: Users, roles: ['school_admin'] },
        { path: '/classes', label: language === 'fr' ? 'Classes' : 'Classes', icon: GraduationCap, roles: ['school_admin'] },
        { path: '/analytics', label: language === 'fr' ? 'Analyses' : 'Analytics', icon: BarChart3, roles: ['school_admin'] },
        { path: '/monthly-reports', label: language === 'fr' ? 'Rapports' : 'Reports', icon: FileText, roles: ['school_admin'] },
        { path: '/feature-management', label: language === 'fr' ? 'Paramètres' : 'Settings', icon: Settings, roles: ['school_admin'], isSpecial: true },
        { path: '/lesson-planner', label: language === 'fr' ? 'Planificateur de Cours' : 'Lesson Planner', icon: BookOpen, roles: ['school_admin'] },
        { path: '/quiz', label: language === 'fr' ? 'Outil de Quiz' : 'Quiz Tool', icon: HelpCircle, roles: ['school_admin'] },
        { path: '/file-manager', label: language === 'fr' ? 'Gestionnaire de Fichiers' : 'File Manager', icon: Folder, roles: ['school_admin'] },
        { path: '/anglophone-curriculum', label: language === 'fr' ? 'Programme Anglophone' : 'Anglophone Curriculum', icon: BookOpen, roles: ['school_admin'] },
        { path: '/global-search', label: language === 'fr' ? 'Recherche Globale' : 'Global Search', icon: Search, roles: ['school_admin'] }
      );
    }

    // Teacher items (only if not super admin)
    if (hasPermission('teacher') && user.role === 'teacher') {
      roleSpecificItems.push(
        { path: '/lesson-planner', label: language === 'fr' ? 'Planificateur de Cours' : 'Lesson Planner', icon: BookOpen, roles: ['teacher'] },
        { path: '/quiz', label: language === 'fr' ? 'Outil de Quiz' : 'Quiz Tool', icon: HelpCircle, roles: ['teacher'] },
        { path: '/student-progress', label: language === 'fr' ? 'Progrès des Élèves' : 'Student Progress', icon: TrendingUp, roles: ['teacher'] },
        { path: '/monthly-reports', label: language === 'fr' ? 'Rapports Mensuels' : 'Monthly Reports', icon: FileText, roles: ['teacher'] }
      );
    }

    // Student items (only if not super admin)
    if (hasPermission('student') && user.role === 'student') {
      roleSpecificItems.push(
        { path: '/student-progress', label: language === 'fr' ? 'Mon Progrès' : 'My Progress', icon: BarChart3, roles: ['student'] }
      );
    }

    // Parent items (only if not super admin)
    if (hasPermission('parent') && user.role === 'parent') {
      roleSpecificItems.push(
        { path: '/parent-portal', label: language === 'fr' ? 'Portail Parent' : 'Parent Portal', icon: Users, roles: ['parent'] },
        { path: '/parent-quiz', label: language === 'fr' ? 'Quiz de Pratique' : 'Practice Quizzes', icon: HelpCircle, roles: ['parent'] }
      );
    }

    // Common items for teachers only (school admin has these integrated in their dashboard)
    if (hasPermission('teacher') && user.role === 'teacher') {
      roleSpecificItems.push(
        { path: '/global-search', label: language === 'fr' ? 'Recherche Globale' : 'Global Search', icon: Search, roles: ['teacher'] },
        { path: '/progress-insights', label: language === 'fr' ? 'Aperçu des Progrès' : 'Progress Insights', icon: Target, roles: ['teacher'] },
        { path: '/analytics', label: language === 'fr' ? 'Analyses' : 'Analytics', icon: BarChart3, roles: ['teacher'] },
        { path: '/anglophone-curriculum', label: language === 'fr' ? 'Programme Anglophone' : 'Anglophone Curriculum', icon: BookOpen, roles: ['teacher'] },
        { path: '/export-center', label: language === 'fr' ? 'Centre d\'Exportation' : 'Export Center', icon: Download, roles: ['teacher'] }
      );
    }

    return [...baseItems, ...roleSpecificItems];
  };

  const navigationItems = getNavigationItems();

  if (!user) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-blue-800 shadow-lg text-white hover:bg-blue-700"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 bg-blue-800 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col ${
        isCollapsed ? 'lg:w-16' : 'lg:w-64'
      } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          {!isCollapsed && (
            <div className="flex items-center">
              <School className="h-8 w-8 mr-3 text-white" />
              <div>
                <h1 className="text-lg font-bold text-white">
                  {language === 'fr' ? 'Système de Gestion Éducative' : 'Educational Management System'}
                </h1>
                {school && (
                  <p className="text-sm text-blue-200 truncate">{school.name}</p>
                )}
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 rounded-lg text-blue-200 hover:bg-blue-700 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 relative">
          <div className="px-2 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              const isSpecial = (item as any).isSpecial;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isSpecial
                      ? 'text-yellow-200 hover:bg-yellow-600 hover:text-white border border-yellow-400'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
          {/* Scroll indicator gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-blue-800 to-transparent pointer-events-none"></div>
        </nav>

        {/* Bottom Section - Fixed at bottom */}
        <div className="mt-auto">
          {/* Real-time Components */}
          {!isCollapsed && (
            <div className="border-t border-blue-700 p-4">
              <div className="space-y-2">
                {/* Notifications */}
                <button 
                  onClick={() => {
                    // Show notifications - for now just a toast message
                    toast.success('Notifications clicked! (Feature coming soon)');
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white rounded-lg"
                >
                  <Bell className="h-5 w-5 mr-3" />
                  <span className="truncate">
                    {language === 'fr' ? 'Notifications' : 'Notifications'}
                  </span>
                  {getUnreadCount() > 0 && (
                    <span className="ml-auto h-5 w-5 bg-red-500 text-xs text-white rounded-full flex items-center justify-center">
                      {getUnreadCount() > 9 ? '9+' : getUnreadCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* User Profile */}
          <div className="border-t border-blue-700 p-4">
            <div className="flex items-center mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getRoleColor(user.role)}`}>
                {getRoleIcon(user.role)}
              </div>
              {!isCollapsed && (
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-blue-200 capitalize">
                    {user.role.replace('_', ' ')}
                  </p>
                </div>
              )}
            </div>
            
            {/* Logout Button - Always visible */}
            <button
              onClick={logout}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? (language === 'fr' ? 'Déconnexion' : 'Logout') : undefined}
            >
              <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && (
                <span>{language === 'fr' ? 'Déconnexion' : 'Logout'}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default SidebarNavigation;
