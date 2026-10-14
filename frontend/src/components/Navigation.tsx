import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Activity,
  Bell,
  AlertTriangle,
  Folder,
  Calendar,
  CheckSquare,
  Award,
  GraduationCap
} from 'lucide-react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';
import NotificationCenter from '../components/NotificationCenter';
import RealtimeActivityFeed from '../components/RealtimeActivityFeed';
import RealtimeStatusIndicator from '../components/RealtimeStatusIndicator';
import ErrorDashboard from '../components/ErrorDashboard';
import toast from 'react-hot-toast';

const Navigation: React.FC = () => {
  const { user, school, logout, switchRole, language } = useAuth();
  const { getUnreadCount } = useRealtime();
  const location = useLocation();
  const navigate = useNavigate();

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
    if (role === 'super_admin') navigate('/');
    else if (role === 'school_admin') navigate('/school-admin-overview');
    else if (role === 'teacher') navigate('/teacher-dashboard');
    else if (role === 'parent') navigate('/parent-portal');
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'school_admin': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-emerald-100 text-emerald-800';
      case 'parent': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return <Settings className="h-4 w-4" />;
      case 'school_admin': return <School className="h-4 w-4" />;
      case 'teacher': return <BookOpen className="h-4 w-4" />;
      case 'parent': return <Users className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  // Strictly isolated navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'super_admin':
        return [
          { path: '/', label: language === 'fr' ? 'Tableau de Bord' : 'Dashboard', icon: Home },
          { path: '/global-search', label: language === 'fr' ? 'Recherche Globale' : 'Global Search', icon: Search },
          { path: '/content-library', label: language === 'fr' ? 'Bibliothèque' : 'Content Library', icon: BookOpen },
          { path: '/feature-management', label: language === 'fr' ? 'Fonctionnalités' : 'Feature Flags', icon: Settings }
        ];

      case 'school_admin':
        return [
          { path: '/school-admin-overview', label: language === 'fr' ? 'Tableau de Bord' : 'Overview', icon: Home },
          { path: '/school-admin-users', label: language === 'fr' ? 'Personnel' : 'Staff & Users', icon: Users },
          { path: '/classes', label: language === 'fr' ? 'Classes' : 'Classes', icon: GraduationCap },
          { path: '/attendance', label: language === 'fr' ? 'Présences' : 'Attendance', icon: CheckSquare },
          { path: '/gradebook', label: language === 'fr' ? 'Bulletins MINESEC' : 'Report Cards', icon: Award },
          { path: '/timetable', label: language === 'fr' ? 'Emplois du Temps' : 'Timetables', icon: Calendar }
        ];

      case 'teacher':
        return [
          { path: '/teacher-dashboard', label: language === 'fr' ? 'Tableau de Bord' : 'Dashboard', icon: Home },
          { path: '/lesson-planner', label: language === 'fr' ? 'Planificateur de Cours' : 'Lesson Planner', icon: BookOpen },
          { path: '/quiz', label: language === 'fr' ? 'Outil de Quiz' : 'Quiz Tool', icon: HelpCircle },
          { path: '/attendance', label: language === 'fr' ? 'Présences' : 'Attendance', icon: CheckSquare },
          { path: '/gradebook', label: language === 'fr' ? 'Notes Séquences' : 'Gradebook', icon: Award },
          { path: '/student-progress', label: language === 'fr' ? 'Progrès des Élèves' : 'Student Progress', icon: TrendingUp },
          { path: '/monthly-reports', label: language === 'fr' ? 'Rapports Mensuels' : 'Monthly Reports', icon: FileText }
        ];

      case 'parent':
        return [
          { path: '/parent-portal', label: language === 'fr' ? 'Portail Parent' : 'Parent Portal', icon: MessageSquare },
          { path: '/gradebook', label: language === 'fr' ? 'Bulletins' : 'Report Cards', icon: Award },
          { path: '/timetable', label: language === 'fr' ? 'Emploi du Temps' : 'Timetable', icon: Calendar },
          { path: '/parent-quiz', label: language === 'fr' ? 'Quiz de Pratique' : 'Practice Quizzes', icon: HelpCircle }
        ];

      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  if (!user) return null;

  return (
    <nav className="bg-slate-900 text-white shadow-lg border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <School className="h-7 w-7 text-indigo-400 mr-3" />
            <div>
              <h1 className="text-base font-bold tracking-tight">
                {language === 'fr' ? 'Système de Gestion Éducative' : 'Educational Management System'}
              </h1>
              {school && (
                <p className="text-xs text-indigo-300">{school.name}</p>
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
                  className={`flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2 text-indigo-400" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Real-time Indicators & User Menu */}
          <div className="flex items-center space-x-3">
            <RealtimeStatusIndicator showDetails={false} />
            
            <button
              onClick={() => setShowActivityFeed(!showActivityFeed)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
              title="Activity Feed"
            >
              <Activity className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {getUnreadCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                  {getUnreadCount()}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-slate-200 hover:text-white focus:outline-none bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${getRoleColor(user.role)}`}>
                  {getRoleIcon(user.role)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold leading-none">{user.fullName}</p>
                  <p className="text-[10px] text-indigo-300 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-xl py-1 z-50 border border-slate-700 text-xs text-slate-200">
                  <div className="px-3 py-2 border-b border-slate-700">
                    <p className="font-bold text-white">{user.fullName}</p>
                    <p className="text-[10px] text-slate-400">{user.email}</p>
                  </div>

                  <div className="border-b border-slate-700 py-1">
                    <button
                      onClick={() => setShowRoleMenu(!showRoleMenu)}
                      className="w-full px-3 py-1.5 text-left hover:bg-slate-700 flex items-center justify-between"
                    >
                      <span>Switch Profile (Demo)</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    
                    {showRoleMenu && (
                      <div className="bg-slate-900/60 py-1">
                        {(['super_admin', 'school_admin', 'teacher', 'parent'] as UserRole[]).map((role) => (
                          <button
                            key={role}
                            onClick={() => handleRoleSwitch(role)}
                            className="w-full px-5 py-1 text-left text-[11px] hover:bg-indigo-600 hover:text-white capitalize"
                          >
                            {role.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-1.5 text-left text-rose-400 hover:bg-rose-500/20 flex items-center"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2" />
                    {language === 'fr' ? 'Se Déconnecter' : 'Sign Out'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <RealtimeActivityFeed isOpen={showActivityFeed} onClose={() => setShowActivityFeed(false)} />
      <ErrorDashboard isOpen={showErrorDashboard} onClose={() => setShowErrorDashboard(false)} />
    </nav>
  );
};

export default Navigation;
