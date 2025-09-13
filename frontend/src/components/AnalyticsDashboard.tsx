/* eslint-disable react/forbid-dom-props */
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award, 
  Clock, 
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { analyticsService, StudentProgress, LessonAnalytics } from '../services/analyticsService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
  const { user, language } = useAuth();
  const [activeTab, setActiveTab] = useState<'progress' | 'lessons'>('progress');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [lessonAnalytics, setLessonAnalytics] = useState<LessonAnalytics | null>(null);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const dateRange = analyticsService.getDateRange(timeRange);
      
      if (activeTab === 'progress') {
        const progress = await analyticsService.getStudentProgress({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        });
        setStudentProgress(progress);
      } else {
        const lessons = await analyticsService.getLessonAnalytics({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        });
        setLessonAnalytics(lessons);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [activeTab, timeRange]);

  const handleExport = () => {
    const data = activeTab === 'progress' ? studentProgress : lessonAnalytics;
    if (data) {
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeTab}-analytics-${timeRange}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Analytics exported successfully!');
    }
  };

  const getTimeRangeLabel = (range: string) => {
    const labels = {
      week: language === 'fr' ? 'Cette semaine' : 'This Week',
      month: language === 'fr' ? 'Ce mois' : 'This Month',
      quarter: language === 'fr' ? 'Ce trimestre' : 'This Quarter',
      year: language === 'fr' ? 'Cette année' : 'This Year'
    };
    return labels[range as keyof typeof labels] || range;
  };

  const getTabLabel = (tab: string) => {
    const labels = {
      progress: language === 'fr' ? 'Progrès des étudiants' : 'Student Progress',
      lessons: language === 'fr' ? 'Analyses des leçons' : 'Lesson Analytics'
    };
    return labels[tab as keyof typeof labels] || tab;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'fr' ? 'Tableau de bord analytique' : 'Analytics Dashboard'}
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Select time range"
          >
            <option value="week">{getTimeRangeLabel('week')}</option>
            <option value="month">{getTimeRangeLabel('month')}</option>
            <option value="quarter">{getTimeRangeLabel('quarter')}</option>
            <option value="year">{getTimeRangeLabel('year')}</option>
          </select>
          <button
            onClick={loadAnalytics}
            disabled={isLoading}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            title="Refresh analytics"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {language === 'fr' ? 'Actualiser' : 'Refresh'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            title="Export analytics"
          >
            <Download className="h-4 w-4 mr-2" />
            {language === 'fr' ? 'Exporter' : 'Export'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {(['progress', 'lessons'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">
            {language === 'fr' ? 'Chargement des données...' : 'Loading analytics...'}
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'progress' && studentProgress && (
            <StudentProgressView progress={studentProgress} language={language} />
          )}
          {activeTab === 'lessons' && lessonAnalytics && (
            <LessonAnalyticsView analytics={lessonAnalytics} language={language} />
          )}
        </div>
      )}
    </div>
  );
};

// Student Progress View Component
const StudentProgressView: React.FC<{ progress: StudentProgress; language: string }> = ({ 
  progress, 
  language 
}) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">
                {language === 'fr' ? 'Total Quizzes' : 'Total Quizzes'}
              </p>
              <p className="text-2xl font-bold text-blue-900">{progress.totalQuizzes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">
                {language === 'fr' ? 'Score Moyen' : 'Average Score'}
              </p>
              <p className="text-2xl font-bold text-green-900">{Math.round(progress.averageScore)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">
                {language === 'fr' ? 'Matières' : 'Subjects'}
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {Object.keys(progress.subjectPerformance).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600">
                {language === 'fr' ? 'Progrès' : 'Progress'}
              </p>
              <p className="text-2xl font-bold text-orange-900">
                {progress.weeklyProgress.length > 0 
                  ? Math.round(progress.weeklyProgress[progress.weeklyProgress.length - 1].average)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'fr' ? 'Performance par matière' : 'Performance by Subject'}
        </h3>
        <div className="space-y-3">
          {Object.entries(progress.subjectPerformance).map(([subject, data]) => (
            <div key={subject} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{subject}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${data.average}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {Math.round(data.average)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'fr' ? 'Activité récente' : 'Recent Activity'}
        </h3>
        <div className="space-y-3">
          {progress.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.quizTitle}</p>
                <p className="text-xs text-gray-500">{activity.subject}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{activity.score}%</p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.completedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Lesson Analytics View Component
const LessonAnalyticsView: React.FC<{ analytics: LessonAnalytics; language: string }> = ({ 
  analytics, 
  language 
}) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">
                {language === 'fr' ? 'Total Leçons' : 'Total Lessons'}
              </p>
              <p className="text-2xl font-bold text-blue-900">{analytics.totalLessons}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">
                {language === 'fr' ? 'Matières' : 'Subjects'}
              </p>
              <p className="text-2xl font-bold text-green-900">
                {Object.keys(analytics.subjectBreakdown).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">
                {language === 'fr' ? 'Systèmes' : 'Systems'}
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {Object.keys(analytics.systemBreakdown).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'fr' ? 'Répartition par matière' : 'Breakdown by Subject'}
        </h3>
        <div className="space-y-3">
          {Object.entries(analytics.subjectBreakdown).map(([subject, count]) => (
            <div key={subject} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{subject}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(count / analytics.totalLessons) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Lessons */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'fr' ? 'Leçons récentes' : 'Recent Lessons'}
        </h3>
        <div className="space-y-3">
          {analytics.recentLessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                <p className="text-xs text-gray-500">
                  {lesson.subject} - {lesson.className} ({lesson.system})
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {new Date(lesson.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
