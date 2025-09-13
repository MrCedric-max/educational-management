import apiService from './api';
import toast from 'react-hot-toast';

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  className: string;
  duration: number;
  instructions?: string;
  questions: Array<{
    id: string;
    question: string;
    type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
    options?: string[];
    correctAnswer: string;
    points: number;
  }>;
  system?: 'anglophone' | 'francophone';
  createdAt: string;
  updatedAt: string;
}

export interface QuizSubmission {
  answers: Array<{
    questionId: string;
    answer: string;
    timeSpent?: number;
  }>;
}

export interface QuizResult {
  result: {
    id: string;
    quizId: string;
    userId: string;
    answers: Array<{
      questionId: string;
      answer: string;
      timeSpent?: number;
    }>;
    score: number;
    maxScore: number;
    percentage: number;
    completedAt: string;
  };
  results: Array<{
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    points: number;
  }>;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface QuizResponse {
  quizzes: Quiz[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class QuizService {
  async createQuiz(quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> {
    try {
      const response = await apiService.createQuiz(quizData as any);
      toast.success('Quiz created successfully!'); 
      return (response as any).data || response as any;
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Failed to create quiz');
      throw error;
    }
  }

  async getQuizzes(params?: {
    page?: number;
    limit?: number;
    subject?: string;
    system?: string;
  }): Promise<QuizResponse> {
    try {
      const response = await apiService.getQuizzes(params as any);
      return { quizzes: (response as any).data || [] } as QuizResponse;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Failed to fetch quizzes');
      throw error;
    }
  }

  async getQuiz(id: string): Promise<Quiz> {
    try {
      const response = await apiService.getQuiz(id);
      return (response as any).data || response as any;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      toast.error('Failed to fetch quiz');
      throw error;
    }
  }

  async submitQuiz(id: string, submission: QuizSubmission): Promise<QuizResult> {
    try {
      const response = await apiService.submitQuiz(id, submission);   
      toast.success('Quiz submitted successfully!');
      return (response as any).data || response as any;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
      throw error;
    }
  }

  async updateQuiz(id: string, quizData: Partial<Quiz>): Promise<Quiz> {
    try {
      const response = await apiService.updateQuiz(id, quizData as any);     
      toast.success('Quiz updated successfully!');
      return (response as any).data || response as any;
    } catch (error) {
      console.error('Error updating quiz:', error);
      toast.error('Failed to update quiz');
      throw error;
    }
  }

  async deleteQuiz(id: string): Promise<void> {
    try {
      await apiService.deleteQuiz(id);
      toast.success('Quiz deleted successfully!');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Failed to delete quiz');
      throw error;
    }
  }

  // Helper method to convert frontend quiz format to API format
  convertToApiFormat(quiz: any): Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      title: quiz.title,
      subject: quiz.subject,
      className: quiz.class,
      duration: quiz.duration,
      instructions: quiz.instructions,
      questions: quiz.questions || [],
      system: quiz.system || 'anglophone'
    };
  }
}

export const quizService = new QuizService();
export default quizService;
