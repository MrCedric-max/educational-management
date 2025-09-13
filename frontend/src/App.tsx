import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CameroonianEducationProvider } from './contexts/CameroonianEducationContext';
import { CameroonianCurriculumProvider } from './contexts/CameroonianCurriculumContext';
import { ContentLibraryProvider } from './contexts/ContentLibraryContext';
import { FileManagementProvider } from './contexts/FileManagementContext';
import { FeatureManagementProvider } from './contexts/FeatureManagementContext';
import { AnglophoneCurriculumProvider } from './contexts/AnglophoneCurriculumContext';
import { RealtimeProvider } from './contexts/RealtimeContext';
import { ErrorProvider } from './contexts/ErrorContext';
import { ApiProvider } from './contexts/ApiContext';
import SidebarNavigation from './components/SidebarNavigation';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Classes from './pages/Classes';
import QuizTool from './pages/QuizTool';
import ParentQuizPage from './pages/ParentQuizPage';
import SystemAwareLessonPlanner from './components/SystemAwareLessonPlanner';
import StudentProgress from './pages/StudentProgress';
import ParentPortal from './pages/ParentPortal';
import ParentDashboard from './pages/ParentDashboard';
import MonthlyReports from './pages/MonthlyReports';
import StudentRoster from './pages/StudentRoster';
import SchoolAdminOverview from './pages/SchoolAdminOverview';
import SchoolAdminUsers from './pages/SchoolAdminUsers';
import TeacherDashboard from './pages/TeacherDashboard';
import ProgressInsights from './pages/ProgressInsights';
import ExportCenter from './pages/ExportCenter';
import AnalyticsPage from './pages/AnalyticsPage';
import FileManager from './pages/FileManager';
import FeatureManagement from './pages/FeatureManagement';
import AnglophoneCurriculumBrowser from './components/AnglophoneCurriculumBrowser';
import ContentLibraryManager from './components/ContentLibraryManager';
import { AdvancedContentSearch } from './components/AdvancedContentSearch';
import { BulkUploadManager } from './components/BulkUploadManager';
import CurriculumBrowser from './components/CurriculumBrowser';
import GlobalSearch from './components/GlobalSearch';
import RealtimeDemo from './pages/RealtimeDemo';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import BulkOperationsManager from './components/BulkOperationsManager';
import MobileDashboard from './components/MobileDashboard';
import PerformanceMonitor from './components/PerformanceMonitor';
import ApiIntegrationTest from './components/ApiIntegrationTest';
import './App.css';

// Main App Content Component
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  // Redirect authenticated users to their appropriate dashboard based on role
  const getDefaultRoute = (userRole: string) => {
    switch (userRole) {
      case 'super_admin':
        return '/';
      case 'school_admin':
        return '/school-admin-overview';
      case 'teacher':
        return '/teacher-dashboard';
      case 'student':
        return '/student-progress';
      case 'parent':
        return '/parent-portal';
      default:
        return '/login';
    }
  };

  return (
    <div className="App">
      <SidebarNavigation />
      
      <main className="min-h-screen bg-gray-50 lg:ml-64">
        <MobileDashboard>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <Classes />
            </ProtectedRoute>
          } />
          <Route path="/school-admin" element={
            <ProtectedRoute allowedRoles={['school_admin']}>
              <StudentRoster />
            </ProtectedRoute>
          } />
          <Route path="/school-admin-overview" element={
            <ProtectedRoute allowedRoles={['school_admin']}>
              <SchoolAdminOverview />
            </ProtectedRoute>
          } />
          <Route path="/school-admin-users" element={
            <ProtectedRoute allowedRoles={['school_admin']}>
              <SchoolAdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/classes" element={
            <ProtectedRoute allowedRoles={['school_admin']}>
              <StudentRoster />
            </ProtectedRoute>
          } />
          <Route path="/teacher-dashboard" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student-progress" element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher', 'student']}>
              <StudentProgress />
            </ProtectedRoute>
          } />
          <Route path="/lesson-planner" element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <SystemAwareLessonPlanner />
            </ProtectedRoute>
          } />
          <Route path="/monthly-reports" element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <MonthlyReports />
            </ProtectedRoute>
          } />
          <Route path="/progress-insights" element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <ProgressInsights />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <AnalyticsPage />
            </ProtectedRoute>
          } />
          <Route path="/file-manager" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <FileManager />
            </ProtectedRoute>
          } />
          <Route path="/feature-management" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <FeatureManagement />
            </ProtectedRoute>
          } />
          <Route path="/anglophone-curriculum" element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <AnglophoneCurriculumBrowser />
            </ProtectedRoute>
          } />
                                <Route path="/export-center" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
                          <ExportCenter />
                        </ProtectedRoute>
                      } />
                      <Route path="/curriculum" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher', 'student', 'parent']}>
                          <CurriculumBrowser />
                        </ProtectedRoute>
                      } />
                      <Route path="/content-library" element={
  <ProtectedRoute allowedRoles={['super_admin']}>
    <ContentLibraryManager />
  </ProtectedRoute>
} />
<Route path="/content-search" element={
  <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
    <AdvancedContentSearch />
  </ProtectedRoute>
} />
<Route path="/bulk-upload" element={
  <ProtectedRoute allowedRoles={['super_admin']}>
    <BulkUploadManager />
  </ProtectedRoute>
} />
                      <Route path="/parent-dashboard" element={
                        <ProtectedRoute allowedRoles={['parent']}>
                          <ParentDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/parent-portal" element={
                        <ProtectedRoute allowedRoles={['parent']}>
                          <ParentPortal />
                        </ProtectedRoute>
                      } />
          <Route path="/parent-quiz" element={
            <ProtectedRoute allowedRoles={['parent']}>
              <ParentQuizPage />
            </ProtectedRoute>
          } />
          <Route path="/quiz" element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher', 'student', 'parent']}>
              <QuizTool />
            </ProtectedRoute>
          } />
          <Route path="/global-search" element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <GlobalSearch />
            </ProtectedRoute>
          } />
          <Route path="/realtime-demo" element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <RealtimeDemo />
            </ProtectedRoute>
          } />
          <Route path="/advanced-analytics" element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <AdvancedAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/bulk-operations" element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <BulkOperationsManager />
            </ProtectedRoute>
          } />
          <Route path="/performance-monitor" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <PerformanceMonitor />
            </ProtectedRoute>
          } />
          <Route path="/api-test" element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <ApiIntegrationTest />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to={getDefaultRoute(user?.role || 'super_admin')} replace />} />
        </Routes>
        </MobileDashboard>
      </main>
      
      <Toaster position="top-right" />
    </div>
  );
};

// Main App Component with Auth Provider
function App() {
  return (
    <Router>
    <AuthProvider>
        <ApiProvider>
        <CameroonianEducationProvider>
          <CameroonianCurriculumProvider>
        <ContentLibraryProvider>
        <FileManagementProvider>
        <FeatureManagementProvider>
        <AnglophoneCurriculumProvider>
        <RealtimeProvider>
        <ErrorProvider>
        <AppContent />
        </ErrorProvider>
        </RealtimeProvider>
        </AnglophoneCurriculumProvider>
        </FeatureManagementProvider>
        </FileManagementProvider>
        </ContentLibraryProvider>
          </CameroonianCurriculumProvider>
        </CameroonianEducationProvider>
        </ApiProvider>
      </AuthProvider>
      </Router>
  );
}

export default App;
