import apiService from './api';
import toast from 'react-hot-toast';

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  class: string;
  date: string;
  time?: string;
  duration: string;
  learningTheme: string;
  selectedObjective?: string;
  domain?: string;
  entryBehaviour?: string;
  objectives?: Array<{
    id: string;
    description: string;
    completed: boolean;
    selected?: boolean;
  }>;
  materials?: Array<{
    id: string;
    name: string;
    selected?: boolean;
  }>;
  activities?: Array<{
    id: string;
    description: string;
  }>;
  stages?: Array<{
    id: string;
    stage: string;
    content: string;
    facilitatingActivities: string;
    learningActivities: string;
    resources: string;
  }>;
  assessmentMethod?: string;
  references?: string;
  system?: 'anglophone' | 'francophone';
  createdAt: string;
  updatedAt: string;
}

export interface LessonPlanResponse {
  lessonPlans: LessonPlan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class LessonService {
  async createLessonPlan(lessonData: Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<LessonPlan> {
    try {
      const response = await apiService.createLessonPlan(lessonData as any);
      toast.success('Lesson plan created successfully!');
      return (response as any).data || response as any;
    } catch (error) {
      console.error('Error creating lesson plan:', error);
      toast.error('Failed to create lesson plan');
      throw error;
    }
  }

  async getLessonPlans(params?: {
    page?: number;
    limit?: number;
    subject?: string;
    system?: string;
  }): Promise<LessonPlanResponse> {
    try {
      const response = await apiService.getLessonPlans(params as any);
      return { lessonPlans: (response as any).data || [] } as LessonPlanResponse;
    } catch (error) {
      console.error('Error fetching lesson plans:', error);
      toast.error('Failed to fetch lesson plans');
      throw error;
    }
  }

  async getLessonPlan(id: string): Promise<LessonPlan> {
    try {
      const response = await apiService.getLessonPlan(id);
      return (response as any).data || response as any;
    } catch (error) {
      console.error('Error fetching lesson plan:', error);
      toast.error('Failed to fetch lesson plan');
      throw error;
    }
  }

  async updateLessonPlan(id: string, lessonData: Partial<LessonPlan>): Promise<LessonPlan> {
    try {
      const response = await apiService.updateLessonPlan(id, lessonData as any);
      toast.success('Lesson plan updated successfully!');
      return (response as any).data || response as any;
    } catch (error) {
      console.error('Error updating lesson plan:', error);
      toast.error('Failed to update lesson plan');
      throw error;
    }
  }

  async deleteLessonPlan(id: string): Promise<void> {
    try {
      await apiService.deleteLessonPlan(id);
      toast.success('Lesson plan deleted successfully!');
    } catch (error) {
      console.error('Error deleting lesson plan:', error);
      toast.error('Failed to delete lesson plan');
      throw error;
    }
  }

  // Helper method to convert frontend lesson plan format to API format
  convertToApiFormat(lessonPlan: any): Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      title: lessonPlan.title,
      subject: lessonPlan.subject,
      class: lessonPlan.class,
      date: lessonPlan.date,
      time: lessonPlan.time,
      duration: lessonPlan.duration,
      learningTheme: lessonPlan.learningTheme,
      selectedObjective: lessonPlan.selectedObjective,
      domain: lessonPlan.domain,
      entryBehaviour: lessonPlan.entryBehaviour,
      objectives: lessonPlan.objectives || [],
      materials: lessonPlan.materials || [],
      activities: lessonPlan.activities || [],
      stages: lessonPlan.stages || [],
      assessmentMethod: lessonPlan.assessmentMethod,
      references: lessonPlan.references,
      system: lessonPlan.system || 'anglophone'
    };
  }
}

export const lessonService = new LessonService();
export default lessonService;
