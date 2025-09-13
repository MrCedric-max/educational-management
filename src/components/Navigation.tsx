import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  School, 
  BookOpen, 
  HelpCircle, 
  BarChart3, 
  Users, 
  FileText, 
  Download, 
  Settings, 
  LogOut, 
  User,
  ChevronDown,
  Home,
  Target,
  TrendingUp,
  MessageSquare,
  Upload,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Calendar,
  Tag,
  Star,
  Eye,
  Clock,
  Filter,
  Folder,
  Activity,
  Bell,
  AlertTriangle
} from 'lucide-react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';
import NotificationCenter from '../components/NotificationCenter';
import RealtimeActivityFeed from '../components/RealtimeActivityFeed';
import RealtimeStatusIndicator from '../components/RealtimeStatusIndicator';
import ErrorDashboard from '../components/ErrorDashboard';
import toast from 'react-hot-toast';

const Navigation: React.FC = () => {
  const { user, school, logout, hasPermission, switchRole, language } = useAuth();
  const { getUnreadCount } = useRealtime();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const [showErrorDashboard, setShowErrorDashboard] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    setShowUserMenu(false);
  };

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    toast.success(`Switched to ${role.replace('_', ' ')} view`);
    setShowRoleMenu(false);
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'school_admin': return 'bg-orange-100 text-orange-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return <Settings className="h-4 w-4" />;
      case 'school_admin': return <School className="h-4 w-4" />;
      case 'teacher': return <BookOpen className="h-4 w-4" />;
      case 'student': return <User className="h-4 w-4" />;
      case 'parent': return <Users className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
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
      baseItems.push({ path: '/student-roster', label: language === 'fr' ? 'Tableau de Bord' : 'Dashboard', icon: Home, roles: ['school_admin'] });
    } else if (hasPermission('teacher')) {
      baseItems.push({ path: '/teacher-dashboard', label: language === 'fr' ? 'Tableau de Bord' : 'Dashboard', icon: Home, roles: ['teacher'] });
    } else if (hasPermission('student')) {
      baseItems.push({ path: '/student-progress', label: language === 'fr' ? 'Tableau de Bord' : 'Dashboard', icon: Home, roles: ['student'] });
    } else if (hasPermission('parent')) {
      baseItems.push({ path: '/parent-portal', label: language === 'fr' ? 'Tableau de Bord' : 'Dashboard', icon: Home, roles: ['parent'] });
    }

    const roleSpecificItems = [];

    // Super Admin: No additional navigation items needed
    // All functionality is available through the internal 5-tab dashboard structure
    // (Dashboard, Schools, Content Management, Subscriptions & Revenue, Reports)

    // School Admin items (only if not super admin)
   // Super Admin items
if (hasPermission('super_admin') && user.role === 'super_admin') {
  roleSpecificItems.push(
    { path: '/global-search', label: language === 'fr' ? 'Recherche Globale' : 'Global Search', icon: Search, roles: ['super_admin'] },
    { path: '/realtime-demo', label: language === 'fr' ? 'Démo Temps Réel' : 'Real-time Demo', icon: Activity, roles: ['super_admin'] },
    { path: '/advanced-analytics', label: language === 'fr' ? 'Analyses Avancées' : 'Advanced Analytics', icon: BarChart3, roles: ['super_admin'] },
    { path: '/bulk-operations', label: language === 'fr' ? 'Opérations en Lot' : 'Bulk Operations', icon: Settings, roles: ['super_admin'] },
    { path: '/performance-monitor', label: language === 'fr' ? 'Moniteur de Performance' : 'Performance Monitor', icon: Activity, roles: ['super_admin'] },
    { path: '/content-library', label: language === 'fr' ? 'Bibliothèque de Contenu' : 'Content Library', icon: BookOpen, roles: ['super_admin'] },
    { path: '/content-search', label: language === 'fr' ? 'Recherche Avancée' : 'Advanced Search', icon: Search, roles: ['super_admin'] },
    { path: '/bulk-upload', label: language === 'fr' ? 'Téléchargement en Lot' : 'Bulk Upload', icon: Upload, roles: ['super_admin'] },
    { path: '/file-manager', label: language === 'fr' ? 'Gestionnaire de Fichiers' : 'File Manager', icon: Folder, roles: ['super_admin'] },
    { path: '/feature-management', label: language === 'fr' ? 'Gestion des Fonctionnalités' : 'Feature Management', icon: Settings, roles: ['super_admin'] },
    { path: '/anglophone-curriculum', label: language === 'fr' ? 'Programme Anglophone' : 'Anglophone Curriculum', icon: BookOpen, roles: ['super_admin', 'school_admin', 'teacher'] }
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
        { path: '/parent-portal', label: language === 'fr' ? 'Portail Parent' : 'Parent Portal', icon: MessageSquare, roles: ['parent'] },
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
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <School className="h-8 w-8 mr-3" />
            <div>
              <h1 className="text-xl font-bold">
                {language === 'fr' ? 'Système de Gestion Éducative' : 'Educational Management System'}
              </h1>
              {school && (
                <p className="text-sm text-blue-200">{school.name}</p>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Real-time Components */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Real-time Status */}
            <RealtimeStatusIndicator showDetails={false} />
            
            {/* Activity Feed Toggle */}
            <button
              onClick={() => setShowActivityFeed(!showActivityFeed)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
              title="Live Activity"
            >
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </button>
            
            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {getUnreadCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  {getUnreadCount() > 9 ? '9+' : getUnreadCount()}
                </span>
              )}
            </button>
            
            {/* Error Dashboard */}
            <button
              onClick={() => setShowErrorDashboard(!showErrorDashboard)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
              title="Error Dashboard"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Errors
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-blue-100 hover:text-white focus:outline-none"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRoleColor(user.role)}`}>
                  {getRoleIcon(user.role)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-blue-200">{user.role.replace('_', ' ')}</p>
                </div>
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    <span className="ml-1">{user.role.replace('_', ' ')}</span>
                  </span>
                </div>

                {/* Role Switching (for demo purposes) */}
                {hasPermission(['super_admin', 'school_admin']) && (
                  <div className="border-b border-gray-200">
                    <div className="px-4 py-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Switch Role (Demo)</p>
                    </div>
                    <button
                      onClick={() => setShowRoleMenu(!showRoleMenu)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                    >
                      <span>Switch Role</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showRoleMenu ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showRoleMenu && (
                      <div className="bg-gray-50">
                        {['teacher', 'student', 'parent'].map((role) => (
                          <button
                            key={role}
                            onClick={() => handleRoleSwitch(role as UserRole)}
                            className="w-full px-6 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {role.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {language === 'fr' ? 'Se Déconnecter' : 'Sign Out'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40 md:hidden" 
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Real-time Modals */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      
      <RealtimeActivityFeed 
        isOpen={showActivityFeed} 
        onClose={() => setShowActivityFeed(false)} 
      />
      
      <ErrorDashboard 
        isOpen={showErrorDashboard} 
        onClose={() => setShowErrorDashboard(false)} 
      />
    </nav>
  );
};

export default Navigation;