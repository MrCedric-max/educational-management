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
  Plus,
  ChevronRight,
  Activity,
  FileText,
  Upload,
  Folder,
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

interface MobileDashboardProps {
  children: React.ReactNode;
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({ children }) => {
  const { user, school, logout, hasPermission, language } = useAuth();
  const { getUnreadCount } = useRealtime();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Changed to lg breakpoint to work with sidebar
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get navigation items based on user role (same logic as SidebarNavigation)
  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: language === 'fr' ? 'Tableau de bord' : 'Dashboard', icon: Home, path: '/', roles: ['super_admin', 'school_admin', 'teacher', 'parent'] },
      { id: 'lessons', label: language === 'fr' ? 'Leçons' : 'Lessons', icon: BookOpen, path: '/lesson-planner', roles: ['super_admin', 'school_admin', 'teacher'] },
      { id: 'quizzes', label: language === 'fr' ? 'Quiz' : 'Quizzes', icon: HelpCircle, path: '/quiz', roles: ['super_admin', 'school_admin', 'teacher', 'parent'] },
      { id: 'students', label: language === 'fr' ? 'Étudiants' : 'Students', icon: Users, path: '/student-roster', roles: ['super_admin', 'school_admin', 'teacher'] },
      { id: 'analytics', label: language === 'fr' ? 'Analytiques' : 'Analytics', icon: BarChart3, path: '/analytics', roles: ['super_admin', 'school_admin'] },
      { id: 'content', label: language === 'fr' ? 'Contenu' : 'Content', icon: FileText, path: '/content-library', roles: ['super_admin', 'school_admin', 'teacher'] },
      { id: 'files', label: language === 'fr' ? 'Fichiers' : 'Files', icon: Folder, path: '/file-manager', roles: ['super_admin', 'school_admin', 'teacher'] },
      { id: 'curriculum', label: language === 'fr' ? 'Programme' : 'Curriculum', icon: Target, path: '/curriculum', roles: ['super_admin', 'school_admin', 'teacher'] },
      { id: 'reports', label: language === 'fr' ? 'Rapports' : 'Reports', icon: TrendingUp, path: '/monthly-reports', roles: ['super_admin', 'school_admin'] },
      { id: 'export', label: language === 'fr' ? 'Exporter' : 'Export', icon: Download, path: '/export-center', roles: ['super_admin', 'school_admin'] },
      { id: 'progress', label: language === 'fr' ? 'Progrès' : 'Progress', icon: BarChart3, path: '/progress-insights', roles: ['super_admin', 'school_admin', 'teacher'] },
      { id: 'parent-portal', label: language === 'fr' ? 'Portail Parent' : 'Parent Portal', icon: Users, path: '/parent-portal', roles: ['parent'] },
      { id: 'parent-dashboard', label: language === 'fr' ? 'Tableau Parent' : 'Parent Dashboard', icon: Home, path: '/parent-dashboard', roles: ['parent'] },
      { id: 'parent-quiz', label: language === 'fr' ? 'Quiz Parent' : 'Parent Quiz', icon: HelpCircle, path: '/parent-quiz', roles: ['parent'] },
      { id: 'school-admin-overview', label: language === 'fr' ? 'Vue d\'ensemble' : 'Overview', icon: PieChart, path: '/school-admin-overview', roles: ['school_admin'] },
      { id: 'school-admin-users', label: language === 'fr' ? 'Utilisateurs' : 'Users', icon: UserPlus, path: '/school-admin-users', roles: ['school_admin'] },
      { id: 'settings', label: language === 'fr' ? 'Paramètres' : 'Settings', icon: Settings, path: '/settings', roles: ['super_admin', 'school_admin', 'teacher', 'parent'] }
    ];

    return baseItems.filter(item => 
      item.roles.includes(user?.role as any || '') || 
      item.roles.some(role => hasPermission(role as any))
    );
  };

  const navigationItems = getNavigationItems();


  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Hidden on desktop when sidebar is visible */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              title="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">
                {school?.name || 'School Management'}
              </h1>
              <p className="text-sm text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg touch-manipulation" 
              title={language === 'fr' ? 'Notifications' : 'Notifications'}
              onClick={() => {
                // TODO: Open notifications modal
                console.log('Open notifications');
              }}
            >
              <Bell className="w-5 h-5" />
              {getUnreadCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-xs text-white rounded-full flex items-center justify-center">
                  {getUnreadCount() > 9 ? '9+' : getUnreadCount()}
                </span>
              )}
            </button>
            <button 
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg touch-manipulation" 
              title={language === 'fr' ? 'Recherche' : 'Search'}
              onClick={() => {
                navigate('/global-search');
              }}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer - Hidden on desktop */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="p-4 flex-1 overflow-y-auto">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors touch-manipulation ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  );
                })}
              </div>
              
              {/* Logout Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors text-red-600 hover:bg-red-50 active:bg-red-100 touch-manipulation"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  {language === 'fr' ? 'Déconnexion' : 'Logout'}
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Content - Show actual page content */}
      <div className="min-h-screen">
        {/* Main Content Area with proper mobile padding */}
        <div className="px-4 py-4 pb-24">
          {children}
        </div>

        {/* Bottom Navigation - Hidden on desktop */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
          <div className="flex items-center justify-around">
            {navigationItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors touch-manipulation ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 active:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
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
