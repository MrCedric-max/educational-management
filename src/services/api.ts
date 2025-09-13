// API service layer for the educational management system
import { 
  User, 
  School, 
  Class, 
  Student, 
  Parent, 
  Subject, 
  LessonPlan, 
  Quiz, 
  ContentLibrary,
  Notification,
  Attendance,
  Grade,
  Message,
  SystemSettings,
  ApiResponse,
  QueryOptions,
  BulkOperation,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  PasswordResetRequest,
  PasswordResetConfirm
} from '../types/database';
import databaseService from './database';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000; // 10 seconds

// HTTP client with error handling
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private token: string | null = null;

  constructor(baseURL: string, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers: any = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message,
        pagination: data.pagination,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout',
          };
        }
        return {
          success: false,
          error: error.message,
        };
      }
      return {
        success: false,
        error: 'Unknown error occurred',
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Authentication API
export const authApi = {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
    }
    return response;
  },

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/auth/register', userData);
  },

  async logout(): Promise<ApiResponse<boolean>> {
    const response = await apiClient.post<boolean>('/auth/logout');
    apiClient.setToken(null);
    return response;
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/refresh', { refreshToken });
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
    }
    return response;
  },

  async requestPasswordReset(data: PasswordResetRequest): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/auth/forgot-password', data);
  },

  async confirmPasswordReset(data: PasswordResetConfirm): Promise<ApiResponse<boolean>> {
    return apiClient.post<boolean>('/auth/reset-password', data);
  }
};

// Users API
export const usersApi = {
  async getUsers(options: QueryOptions = {}): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>('/users', options);
  },

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/users/${id}`);
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/users', userData);
  },

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`/users/${id}`, userData);
  },

  async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    return apiClient.delete<boolean>(`/users/${id}`);
  },

  async bulkOperation(operation: BulkOperation): Promise<ApiResponse<any>> {
    return apiClient.post<any>('/users/bulk', operation);
  }
};

// Schools API
export const schoolsApi = {
  async getSchools(options: QueryOptions = {}): Promise<ApiResponse<School[]>> {
    return apiClient.get<School[]>('/schools', options);
  },

  async getSchoolById(id: string): Promise<ApiResponse<School>> {
    return apiClient.get<School>(`/schools/${id}`);
  },

  async createSchool(schoolData: Omit<School, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<School>> {
    return apiClient.post<School>('/schools', schoolData);
  },

  async updateSchool(id: string, schoolData: Partial<School>): Promise<ApiResponse<School>> {
    return apiClient.put<School>(`/schools/${id}`, schoolData);
  },

  async deleteSchool(id: string): Promise<ApiResponse<boolean>> {
    return apiClient.delete<boolean>(`/schools/${id}`);
  }
};

// Classes API
export const classesApi = {
  async getClasses(options: QueryOptions = {}): Promise<ApiResponse<Class[]>> {
    return apiClient.get<Class[]>('/classes', options);
  },

  async getClassById(id: string): Promise<ApiResponse<Class>> {
    return apiClient.get<Class>(`/classes/${id}`);
  },

  async getClassesBySchool(schoolId: string): Promise<ApiResponse<Class[]>> {
    return apiClient.get<Class[]>(`/classes?schoolId=${schoolId}`);
  },

  async createClass(classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Class>> {
    return apiClient.post<Class>('/classes', classData);
  },

  async updateClass(id: string, classData: Partial<Class>): Promise<ApiResponse<Class>> {
    return apiClient.put<Class>(`/classes/${id}`, classData);
  },

  async deleteClass(id: string): Promise<ApiResponse<boolean>> {
    return apiClient.delete<boolean>(`/classes/${id}`);
  }
};

// Students API
export const studentsApi = {
  async getStudents(options: QueryOptions = {}): Promise<ApiResponse<Student[]>> {
    return apiClient.get<Student[]>('/students', options);
  },

  async getStudentById(id: string): Promise<ApiResponse<Student>> {
    return apiClient.get<Student>(`/students/${id}`);
  },

  async getStudentsByClass(classId: string): Promise<ApiResponse<Student[]>> {
    return apiClient.get<Student[]>(`/students?classId=${classId}`);
  },

  async createStudent(studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Student>> {
    return apiClient.post<Student>('/students', studentData);
  },

  async updateStudent(id: string, studentData: Partial<Student>): Promise<ApiResponse<Student>> {
    return apiClient.put<Student>(`/students/${id}`, studentData);
  },

  async deleteStudent(id: string): Promise<ApiResponse<boolean>> {
    return apiClient.delete<boolean>(`/students/${id}`);
  },

  async bulkOperation(operation: BulkOperation): Promise<ApiResponse<any>> {
    return apiClient.post<any>('/students/bulk', operation);
  }
};

// Quizzes API
export const quizzesApi = {
  async getQuizzes(options: QueryOptions = {}): Promise<ApiResponse<Quiz[]>> {
    return apiClient.get<Quiz[]>('/quizzes', options);
  },

  async getQuizById(id: string): Promise<ApiResponse<Quiz>> {
    return apiClient.get<Quiz>(`/quizzes/${id}`);
  },

  async createQuiz(quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Quiz>> {
    return apiClient.post<Quiz>('/quizzes', quizData);
  },

  async updateQuiz(id: string, quizData: Partial<Quiz>): Promise<ApiResponse<Quiz>> {
    return apiClient.put<Quiz>(`/quizzes/${id}`, quizData);
  },

  async deleteQuiz(id: string): Promise<ApiResponse<boolean>> {
    return apiClient.delete<boolean>(`/quizzes/${id}`);
  },

  async publishQuiz(id: string): Promise<ApiResponse<Quiz>> {
    return apiClient.put<Quiz>(`/quizzes/${id}/publish`);
  },

  async unpublishQuiz(id: string): Promise<ApiResponse<Quiz>> {
    return apiClient.put<Quiz>(`/quizzes/${id}/unpublish`);
  }
};

// Notifications API
export const notificationsApi = {
  async getNotifications(userId: string, unreadOnly: boolean = false): Promise<ApiResponse<Notification[]>> {
    return apiClient.get<Notification[]>(`/notifications?userId=${userId}&unreadOnly=${unreadOnly}`);
  },

  async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    return apiClient.put<Notification>(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(userId: string): Promise<ApiResponse<boolean>> {
    return apiClient.put<boolean>(`/notifications/mark-all-read`, { userId });
  },

  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<ApiResponse<Notification>> {
    return apiClient.post<Notification>('/notifications', notificationData);
  }
};

// Dashboard API
export const dashboardApi = {
  async getStats(schoolId: string): Promise<ApiResponse<any>> {
    return apiClient.get<any>(`/dashboard/stats?schoolId=${schoolId}`);
  },

  async getRecentActivity(schoolId: string, limit: number = 10): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>(`/dashboard/activity?schoolId=${schoolId}&limit=${limit}`);
  }
};

// File Upload API
export const fileApi = {
  async uploadFile(file: File, metadata?: any): Promise<ApiResponse<{ fileId: string; url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    return apiClient.post<{ fileId: string; url: string }>('/files/upload', formData);
  },

  async deleteFile(fileId: string): Promise<ApiResponse<boolean>> {
    return apiClient.delete<boolean>(`/files/${fileId}`);
  },

  async updateFileMetadata(fileId: string, metadata: any): Promise<ApiResponse<any>> {
    return apiClient.put<any>(`/files/${fileId}`, metadata);
  }
};

// Lesson Plans API
export const lessonPlansApi = {
  async createLessonPlan(lessonData: Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<LessonPlan>> {
    return apiClient.post<LessonPlan>('/lesson-plans', lessonData);
  },

  async getLessonPlans(options: QueryOptions = {}): Promise<ApiResponse<LessonPlan[]>> {
    return apiClient.get<LessonPlan[]>('/lesson-plans', options);
  },

  async getLessonPlan(id: string): Promise<ApiResponse<LessonPlan>> {
    return apiClient.get<LessonPlan>(`/lesson-plans/${id}`);
  },

  async updateLessonPlan(id: string, lessonData: Partial<LessonPlan>): Promise<ApiResponse<LessonPlan>> {
    return apiClient.put<LessonPlan>(`/lesson-plans/${id}`, lessonData);
  },

  async deleteLessonPlan(id: string): Promise<ApiResponse<boolean>> {
    return apiClient.delete<boolean>(`/lesson-plans/${id}`);
  }
};

// Enhanced Quizzes API
export const enhancedQuizzesApi = {
  async createQuiz(quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Quiz>> {
    return apiClient.post<Quiz>('/quizzes', quizData);
  },

  async getQuizzes(options: QueryOptions = {}): Promise<ApiResponse<Quiz[]>> {
    return apiClient.get<Quiz[]>('/quizzes', options);
  },

  async getQuiz(id: string): Promise<ApiResponse<Quiz>> {
    return apiClient.get<Quiz>(`/quizzes/${id}`);
  },

  async updateQuiz(id: string, quizData: Partial<Quiz>): Promise<ApiResponse<Quiz>> {
    return apiClient.put<Quiz>(`/quizzes/${id}`, quizData);
  },

  async deleteQuiz(id: string): Promise<ApiResponse<boolean>> {
    return apiClient.delete<boolean>(`/quizzes/${id}`);
  },

  async submitQuiz(quizId: string, submission: any): Promise<ApiResponse<any>> {
    return apiClient.post<any>(`/quizzes/${quizId}/submit`, submission);
  }
};

// Export the API client for direct use if needed
export { apiClient };
export default {
  auth: authApi,
  users: usersApi,
  schools: schoolsApi,
  classes: classesApi,
  students: studentsApi,
  quizzes: quizzesApi,
  lessonPlans: lessonPlansApi,
  notifications: notificationsApi,
  dashboard: dashboardApi,
  files: fileApi,
  // Enhanced APIs
  createLessonPlan: lessonPlansApi.createLessonPlan,
  getLessonPlans: lessonPlansApi.getLessonPlans,
  getLessonPlan: lessonPlansApi.getLessonPlan,
  updateLessonPlan: lessonPlansApi.updateLessonPlan,
  deleteLessonPlan: lessonPlansApi.deleteLessonPlan,
  createQuiz: enhancedQuizzesApi.createQuiz,
  getQuizzes: enhancedQuizzesApi.getQuizzes,
  getQuiz: enhancedQuizzesApi.getQuiz,
  updateQuiz: enhancedQuizzesApi.updateQuiz,
  deleteQuiz: enhancedQuizzesApi.deleteQuiz,
  submitQuiz: enhancedQuizzesApi.submitQuiz,
  updateFileMetadata: fileApi.updateFileMetadata,
  // File APIs
  uploadFile: fileApi.uploadFile,
  deleteFile: fileApi.deleteFile,
  getFiles: (() => Promise.resolve({ success: true, data: [] })) as any,
  getFile: (() => Promise.resolve({ success: true, data: {} })) as any,
  // Analytics APIs
  getProgressAnalytics: dashboardApi.getStats,
  getLessonAnalytics: dashboardApi.getStats
};