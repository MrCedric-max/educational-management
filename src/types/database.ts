// Database types and interfaces for the educational management system

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'school_admin' | 'teacher' | 'parent' | 'student';
  schoolId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  profileImage?: string;
  phoneNumber?: string;
  address?: string;
  language: 'en' | 'fr';
}

export interface School {
  id: string;
  name: string;
  nameFr: string;
  address: string;
  phoneNumber: string;
  email: string;
  principalName: string;
  principalNameFr: string;
  system: 'anglophone' | 'francophone' | 'both';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  settings: SchoolSettings;
}

export interface SchoolSettings {
  allowParentRegistration: boolean;
  allowTeacherRegistration: boolean;
  requireEmailVerification: boolean;
  defaultLanguage: 'en' | 'fr';
  timezone: string;
  academicYear: string;
  terms: Term[];
}

export interface Term {
  id: string;
  name: string;
  nameFr: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface Class {
  id: string;
  name: string;
  nameFr: string;
  code: string;
  schoolId: string;
  teacherId: string;
  level: string;
  system: 'anglophone' | 'francophone';
  academicYear: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  studentCount: number;
}

export interface Student {
  id: string;
  fullName: string;
  studentNumber: string;
  classId: string;
  schoolId: string;
  parentId?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
  emergencyContact?: string;
  medicalInfo?: string;
}

export interface Parent {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  schoolId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  children: string[]; // Student IDs
  language: 'en' | 'fr';
}

export interface Subject {
  id: string;
  name: string;
  nameFr: string;
  code: string;
  schoolId: string;
  system: 'anglophone' | 'francophone';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonPlan {
  id: string;
  title: string;
  titleFr: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  schoolId: string;
  date: Date;
  duration: number; // in minutes
  objectives: string[];
  objectivesFr: string[];
  content: string;
  contentFr: string;
  activities: string[];
  activitiesFr: string[];
  resources: string[];
  assessment: string;
  assessmentFr: string;
  homework: string;
  homeworkFr: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  schoolId: string;
  timeLimit: number; // in minutes
  totalPoints: number;
  questions: Question[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  attempts: QuizAttempt[];
}

export interface Question {
  id: string;
  text: string;
  textFr: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  points: number;
  answers: Answer[];
  explanation: string;
  explanationFr: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
}

export interface Answer {
  id: string;
  text: string;
  textFr: string;
  isCorrect: boolean;
  explanation?: string;
  explanationFr?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  answers: StudentAnswer[];
  score: number;
  totalPoints: number;
  percentage: number;
  timeSpent: number; // in seconds
  startedAt: Date;
  completedAt: Date;
  status: 'in-progress' | 'completed' | 'abandoned';
}

export interface StudentAnswer {
  questionId: string;
  answerId?: string; // for multiple choice
  textAnswer?: string; // for short answer/essay
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number; // in seconds
}

export interface ContentLibrary {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  type: 'document' | 'video' | 'audio' | 'image' | 'link' | 'other';
  subjectId: string;
  classId?: string;
  teacherId: string;
  schoolId: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  url?: string;
  tags: string[];
  isPublic: boolean;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  titleFr: string;
  message: string;
  messageFr: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'system' | 'academic' | 'communication' | 'reminder';
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
  readAt?: Date;
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  reason?: string;
  markedBy: string; // Teacher ID
  createdAt: Date;
  updatedAt: Date;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  type: 'quiz' | 'assignment' | 'exam' | 'project' | 'participation';
  title: string;
  titleFr: string;
  points: number;
  maxPoints: number;
  percentage: number;
  letterGrade?: string;
  comments: string;
  commentsFr: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  subject: string;
  subjectFr: string;
  content: string;
  contentFr: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments: string[]; // File IDs
  createdAt: Date;
  readAt?: Date;
  repliedAt?: Date;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description: string;
  category: 'general' | 'academic' | 'communication' | 'security' | 'features';
  isPublic: boolean;
  updatedAt: Date;
  updatedBy: string;
}

export interface RealtimeUpdate {
  id: string;
  type: 'notification' | 'activity' | 'status' | 'data';
  title: string;
  titleFr: string;
  message: string;
  messageFr: string;
  userId: string;
  timestamp: Date;
  data?: any;
}

export interface FileUploadResponse {
  success: boolean;
  fileId: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface LessonPlanResponse {
  success: boolean;
  data: LessonPlan[];
  pagination?: PaginationInfo;
}

export interface QuizResponse {
  success: boolean;
  data: Quiz[];
  pagination?: PaginationInfo;
}

export interface QuizSubmission {
  quizId: string;
  studentId: string;
  answers: StudentAnswer[];
  timeSpent: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  answers: StudentAnswer[];
  timeSpent: number;
  completedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: User['role'];
  schoolId?: string;
  language: 'en' | 'fr';
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

// Database connection configuration
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  pool?: {
    min: number;
    max: number;
    idle: number;
  };
}

// Query options
export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  search?: string;
}

export interface BulkOperation {
  operation: 'create' | 'update' | 'delete' | 'archive' | 'unarchive';
  ids: string[];
  data?: Record<string, any>;
}
