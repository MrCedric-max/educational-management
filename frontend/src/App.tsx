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
import AttendancePage from './pages/AttendancePage';
import GradebookPage from './pages/GradebookPage';
import TimetablePage from './pages/TimetablePage';
import './App.css';

// Main App Content Component
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement / Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  // Redirect authenticated users to their dedicated portal based on strict role separation
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

            {/* ============================================================= */}
            {/* 1. SUPER ADMIN EXCLUSIVE ROUTES                               */}
            {/* ============================================================= */}
            <Route path="/" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <Classes />
              </ProtectedRoute>
            } />
            <Route path="/global-search" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <GlobalSearch />
              </ProtectedRoute>
            } />
            <Route path="/content-library" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <ContentLibraryManager />
              </ProtectedRoute>
            } />
            <Route path="/content-search" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdvancedContentSearch />
              </ProtectedRoute>
            } />
            <Route path="/bulk-upload" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <BulkUploadManager />
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
            <Route path="/performance-monitor" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <PerformanceMonitor />
              </ProtectedRoute>
            } />
            <Route path="/bulk-operations" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <BulkOperationsManager />
              </ProtectedRoute>
            } />
            <Route path="/realtime-demo" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <RealtimeDemo />
              </ProtectedRoute>
            } />
            <Route path="/advanced-analytics" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdvancedAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/api-test" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <ApiIntegrationTest />
              </ProtectedRoute>
            } />

            {/* ============================================================= */}
            {/* 2. SCHOOL ADMIN EXCLUSIVE ROUTES                              */}
            {/* ============================================================= */}
            <Route path="/school-admin-overview" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <SchoolAdminOverview />
              </ProtectedRoute>
            } />
            <Route path="/school-admin" element={
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
            <Route path="/analytics" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <AnalyticsPage />
              </ProtectedRoute>
            } />

            {/* ============================================================= */}
            {/* 3. TEACHER EXCLUSIVE ROUTES                                   */}
            {/* ============================================================= */}
            <Route path="/teacher-dashboard" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } />
            <Route path="/lesson-planner" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <SystemAwareLessonPlanner />
              </ProtectedRoute>
            } />
            <Route path="/progress-insights" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <ProgressInsights />
              </ProtectedRoute>
            } />
            <Route path="/export-center" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <ExportCenter />
              </ProtectedRoute>
            } />
            <Route path="/anglophone-curriculum" element={
              <ProtectedRoute allowedRoles={['super_admin', 'teacher']}>
                <AnglophoneCurriculumBrowser />
              </ProtectedRoute>
            } />

            {/* ============================================================= */}
            {/* 4. SHARED ACADEMIC & VIE SCOLAIRE ROUTES                      */}
            {/* ============================================================= */}
            <Route path="/attendance" element={
              <ProtectedRoute allowedRoles={['school_admin', 'teacher']}>
                <AttendancePage />
              </ProtectedRoute>
            } />
            <Route path="/gradebook" element={
              <ProtectedRoute allowedRoles={['school_admin', 'teacher', 'parent']}>
                <GradebookPage />
              </ProtectedRoute>
            } />
            <Route path="/timetable" element={
              <ProtectedRoute allowedRoles={['school_admin', 'teacher', 'student', 'parent']}>
                <TimetablePage />
              </ProtectedRoute>
            } />
            <Route path="/monthly-reports" element={
              <ProtectedRoute allowedRoles={['school_admin', 'teacher']}>
                <MonthlyReports />
              </ProtectedRoute>
            } />
            <Route path="/quiz" element={
              <ProtectedRoute allowedRoles={['teacher', 'student']}>
                <QuizTool />
              </ProtectedRoute>
            } />
            <Route path="/student-progress" element={
              <ProtectedRoute allowedRoles={['teacher', 'student']}>
                <StudentProgress />
              </ProtectedRoute>
            } />

            {/* ============================================================= */}
            {/* 5. PARENT & STUDENT EXCLUSIVE ROUTES                          */}
            {/* ============================================================= */}
            <Route path="/parent-portal" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentPortal />
              </ProtectedRoute>
            } />
            <Route path="/parent-dashboard" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/parent-quiz" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentQuizPage />
              </ProtectedRoute>
            } />
            <Route path="/curriculum" element={
              <ProtectedRoute allowedRoles={['student']}>
                <CurriculumBrowser />
              </ProtectedRoute>
            } />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to={getDefaultRoute(user?.role || 'super_admin')} replace />} />
          </Routes>
        </MobileDashboard>
      </main>
      
      <Toaster position="top-right" />
    </div>
  );
};

// Main App Component with Providers
function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
