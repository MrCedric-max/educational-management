import apiService from './api';
import toast from 'react-hot-toast';

export interface ProgressData {
  id: string;
  studentId: string;
  userId: string;
  classId: string;
  subject: string;
  level: string;
  score: number;
  date: string;
  type: 'QUIZ' | 'ASSIGNMENT' | 'EXAM' | 'PROJECT';
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  totalQuizzes: number;
  averageScore: number;
  subjectPerformance: Record<string, {
    total: number;
    count: number;
    average: number;
  }>;
  recentActivity: Array<{
    id: string;
    quizTitle: string;
    subject: string;
    score: number;
    completedAt: string;
  }>;
  weeklyProgress: Array<{
    week: number;
    average: number;
    attempts: number;
  }>;
  progressData: ProgressData[];
}

export interface LessonAnalytics {
  totalLessons: number;
  subjectBreakdown: Record<string, number>;
  systemBreakdown: Record<string, number>;
  recentLessons: Array<{
    id: string;
    title: string;
    subject: string;
    className: string;
    system: string;
    createdAt: string;
  }>;
  lessons: Array<{
    id: string;
    title: string;
    subject: string;
    className: string;
    system: string;
    createdAt: string;
  }>;
}

class AnalyticsService {
  async getStudentProgress(params?: {
    studentId?: string;
    subject?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<StudentProgress> {
    try {
      const response = await apiService.getProgressAnalytics(params as any);
      return (response as any).data || response as any;
    } catch (error) {
      console.error('Error fetching student progress:', error);
      toast.error('Failed to fetch student progress');
      throw error;
    }
  }

  async getLessonAnalytics(params?: {
    subject?: string;
    system?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<LessonAnalytics> {
    try {
      const response = await apiService.getLessonAnalytics(params as any);
      return (response as any).data || response as any;
    } catch (error) {
      console.error('Error fetching lesson analytics:', error);
      toast.error('Failed to fetch lesson analytics');
      throw error;
    }
  }

  // Helper method to format date for API calls
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Helper method to get date range for different periods
  getDateRange(period: 'week' | 'month' | 'quarter' | 'year'): { startDate: string; endDate: string } {
    const now = new Date();
    const endDate = this.formatDate(now);
    
    let startDate: Date;
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return {
      startDate: this.formatDate(startDate),
      endDate
    };
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
