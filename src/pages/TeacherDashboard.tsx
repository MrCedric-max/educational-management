import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, BarChart3, FileText, TrendingUp, Download, 
  Plus, Eye, Settings, Globe, Clock, Target,
  UserPlus, Edit
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Types and Interfaces
interface Student {
  id: string;
  name: string;
  class: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  lastActivity: Date;
}

interface Class {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  teacherId: string;
  schedule: string;
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  class: string;
  questionCount: number;
  createdAt: Date;
  isPublished: boolean;
}

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  class: string;
  date: string;
  duration: string;
  status: 'draft' | 'completed';
}

interface ProgressData {
  studentId: string;
  studentName: string;
  averageScore: number;
  totalQuizzes: number;
  lastQuizDate: Date;
  trend: 'up' | 'down' | 'stable';
}

const TeacherDashboard: React.FC = () => {
  const { logout, user, language, setLanguage } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'students' | 'quizzes' | 'lessons' | 'progress' | 'reports' | 'settings'>('overview');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Reset component state when user changes
  useEffect(() => {
    // Reset all state to initial values when user changes
    setActiveTab('overview');
    setSelectedClass('');
    setCurrentDateTime(new Date());
  }, [user?.id]); // Reset when user changes

  // Mock data - All available classes in the school
  const allClasses: Class[] = [
    { id: '1', name: 'Class 3A', subject: 'Mathematics', studentCount: 25, teacherId: 'teacher1', schedule: 'Mon, Wed, Fri 9:00 AM' },
    { id: '2', name: 'Class 3B', subject: 'English', studentCount: 23, teacherId: 'teacher1', schedule: 'Tue, Thu 10:00 AM' },
    { id: '3', name: 'Class 4A', subject: 'Science', studentCount: 28, teacherId: 'teacher1', schedule: 'Mon, Wed 2:00 PM' },
    { id: '4', name: 'Class 3A', subject: 'English', studentCount: 25, teacherId: 'teacher2', schedule: 'Mon, Wed, Fri 11:00 AM' },
    { id: '5', name: 'Class 3B', subject: 'Mathematics', studentCount: 23, teacherId: 'teacher2', schedule: 'Tue, Thu 1:00 PM' },
    { id: '6', name: 'Class 5A', subject: 'History', studentCount: 30, teacherId: 'teacher3', schedule: 'Mon, Wed 3:00 PM' }
  ];

  // Filter classes based on user role
  const teacherAssignedClasses = user?.role === 'teacher' 
    ? allClasses.filter(cls => cls.teacherId === user?.id)
    : allClasses; // Admins can see all classes
  
  // Get all subjects available in the classes (for teachers: only assigned classes, for admins: all classes)
  const availableSubjects = Array.from(new Set(teacherAssignedClasses.map(cls => cls.subject)));

  // All students in the school
  const allStudents: Student[] = [
    { id: '1', name: 'Emma Johnson', class: 'Class 3A', email: 'emma.johnson@school.com', isActive: true, lastActivity: new Date() },
    { id: '2', name: 'Michael Brown', class: 'Class 3A', email: 'michael.brown@school.com', isActive: true, lastActivity: new Date() },
    { id: '3', name: 'Sophia Davis', class: 'Class 3B', email: 'sophia.davis@school.com', isActive: true, lastActivity: new Date() },
    { id: '4', name: 'James Wilson', class: 'Class 4A', email: 'james.wilson@school.com', isActive: false, lastActivity: new Date() },
    { id: '5', name: 'Olivia Smith', class: 'Class 5A', email: 'olivia.smith@school.com', isActive: true, lastActivity: new Date() },
    { id: '6', name: 'William Jones', class: 'Class 5A', email: 'william.jones@school.com', isActive: true, lastActivity: new Date() }
  ];

  // Filter students based on user role
  const teacherAssignedClassNames = teacherAssignedClasses.map(cls => cls.name);
  const teacherStudents = user?.role === 'teacher'
    ? allStudents.filter(student => teacherAssignedClassNames.includes(student.class))
    : allStudents; // Admins can see all students

  // All quizzes in the school
  const allQuizzes: Quiz[] = [
    { id: '1', title: 'Fractions Quiz', subject: 'Mathematics', class: 'Class 3A', questionCount: 10, createdAt: new Date(), isPublished: true },
    { id: '2', title: 'Grammar Test', subject: 'English', class: 'Class 3B', questionCount: 15, createdAt: new Date(), isPublished: false },
    { id: '3', title: 'Science Quiz', subject: 'Science', class: 'Class 4A', questionCount: 12, createdAt: new Date(), isPublished: true },
    { id: '4', title: 'History Quiz', subject: 'History', class: 'Class 5A', questionCount: 8, createdAt: new Date(), isPublished: true },
    { id: '5', title: 'Advanced Math', subject: 'Mathematics', class: 'Class 3B', questionCount: 20, createdAt: new Date(), isPublished: false }
  ];

  // Filter quizzes based on user role
  const teacherQuizzes = user?.role === 'teacher'
    ? allQuizzes.filter(quiz => teacherAssignedClassNames.includes(quiz.class))
    : allQuizzes; // Admins can see all quizzes

  // All lesson plans in the school
  const allLessonPlans: LessonPlan[] = [
    { id: '1', title: 'Introduction to Fractions', subject: 'Mathematics', class: 'Class 3A', date: '2024-01-15', duration: '45 minutes', status: 'completed' },
    { id: '2', title: 'Reading Comprehension', subject: 'English', class: 'Class 3B', date: '2024-01-16', duration: '40 minutes', status: 'draft' },
    { id: '3', title: 'Plant Life Cycle', subject: 'Science', class: 'Class 4A', date: '2024-01-17', duration: '50 minutes', status: 'completed' },
    { id: '4', title: 'World War II', subject: 'History', class: 'Class 5A', date: '2024-01-18', duration: '60 minutes', status: 'completed' },
    { id: '5', title: 'Advanced Algebra', subject: 'Mathematics', class: 'Class 3B', date: '2024-01-19', duration: '50 minutes', status: 'draft' }
  ];

  // Filter lesson plans based on user role
  const teacherLessonPlans = user?.role === 'teacher'
    ? allLessonPlans.filter(plan => teacherAssignedClassNames.includes(plan.class))
    : allLessonPlans; // Admins can see all lesson plans

  // All progress data in the school
  const allProgressData: ProgressData[] = [
    { studentId: '1', studentName: 'Emma Johnson', averageScore: 85, totalQuizzes: 8, lastQuizDate: new Date(), trend: 'up' },
    { studentId: '2', studentName: 'Michael Brown', averageScore: 72, totalQuizzes: 6, lastQuizDate: new Date(), trend: 'stable' },
    { studentId: '3', studentName: 'Sophia Davis', averageScore: 91, totalQuizzes: 7, lastQuizDate: new Date(), trend: 'up' },
    { studentId: '4', studentName: 'James Wilson', averageScore: 68, totalQuizzes: 5, lastQuizDate: new Date(), trend: 'down' },
    { studentId: '5', studentName: 'Olivia Smith', averageScore: 88, totalQuizzes: 9, lastQuizDate: new Date(), trend: 'up' },
    { studentId: '6', studentName: 'William Jones', averageScore: 75, totalQuizzes: 6, lastQuizDate: new Date(), trend: 'stable' }
  ];

  // Filter progress data based on user role
  const teacherStudentIds = teacherStudents.map(student => student.id);
  const teacherProgressData = user?.role === 'teacher'
    ? allProgressData.filter(progress => teacherStudentIds.includes(progress.studentId))
    : allProgressData; // Admins can see all progress data

  // Update date/time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter data based on selected class
  const filteredStudents = selectedClass ? teacherStudents.filter(s => s.class === selectedClass) : teacherStudents;
  const filteredQuizzes = selectedClass ? teacherQuizzes.filter(q => q.class === selectedClass) : teacherQuizzes;
  const filteredLessonPlans = selectedClass ? teacherLessonPlans.filter(l => l.class === selectedClass) : teacherLessonPlans;
  const filteredProgressData = selectedClass ? teacherProgressData.filter(p => filteredStudents.some(s => s.id === p.studentId)) : teacherProgressData;


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user?.role === 'teacher' 
                      ? (language === 'en' ? 'Teacher Dashboard' : 'Tableau de Bord Enseignant')
                      : user?.role === 'super_admin'
                      ? (language === 'en' ? 'Teacher Dashboard (Super Admin View)' : 'Tableau Enseignant (Vue Super Admin)')
                      : (language === 'en' ? 'Teacher Dashboard (School Admin View)' : 'Tableau Enseignant (Vue Admin École)')
                    }
                  </h1>
                  <p className="text-sm text-gray-600">
                    {language === 'en' ? 'Welcome back, ' : 'Bon retour, '}{user?.fullName}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-gray-500" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              
              {/* Current Date/Time */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{currentDateTime.toLocaleString()}</span>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      {user?.role === 'super_admin' && (
        <div className="bg-blue-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-800">
                  {language === 'en' ? 'Admin Access:' : 'Accès Admin:'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/')}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {language === 'en' ? 'Super Admin Dashboard' : 'Tableau Super Admin'}
                </button>
                <button
                  onClick={() => navigate('/student-roster')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  {language === 'en' ? 'School Admin Dashboard' : 'Tableau Admin École'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'school_admin' && (
        <div className="bg-green-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-green-800">
                  {language === 'en' ? 'Admin Access:' : 'Accès Admin:'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/student-roster')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  {language === 'en' ? 'School Admin Dashboard' : 'Tableau Admin École'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {[
                { id: 'overview', label: language === 'en' ? 'Overview' : 'Aperçu', icon: BarChart3 },
                { id: 'classes', label: language === 'en' ? 'Classes' : 'Classes', icon: Users },
                { id: 'students', label: language === 'en' ? 'Students' : 'Étudiants', icon: UserPlus },
                { id: 'quizzes', label: language === 'en' ? 'Quizzes' : 'Quiz', icon: Target },
                { id: 'lessons', label: language === 'en' ? 'Lesson Plans' : 'Plans de Cours', icon: BookOpen },
                { id: 'progress', label: language === 'en' ? 'Progress' : 'Progrès', icon: TrendingUp },
                { id: 'reports', label: language === 'en' ? 'Reports' : 'Rapports', icon: FileText },
                { id: 'settings', label: language === 'en' ? 'Settings' : 'Paramètres', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Class Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              {language === 'en' ? 'Filter by Class:' : 'Filtrer par Classe:'}
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{language === 'en' ? 'All Classes' : 'Toutes les Classes'}</option>
              {teacherAssignedClasses.map((cls) => (
                <option key={cls.id} value={cls.name}>{cls.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Total Classes' : 'Classes Totales'}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">{teacherAssignedClasses.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserPlus className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Total Students' : 'Étudiants Totaux'}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">{teacherStudents.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Active Quizzes' : 'Quiz Actifs'}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {teacherQuizzes.filter(q => q.isPublished).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Lesson Plans' : 'Plans de Cours'}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">{teacherLessonPlans.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher's Assigned Classes and Subjects */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {user?.role === 'teacher' 
                    ? (language === 'en' ? 'My Assigned Classes' : 'Mes Classes Assignées')
                    : (language === 'en' ? 'All Classes' : 'Toutes les Classes')
                  }
                </h3>
                <div className="space-y-3">
                  {teacherAssignedClasses.length > 0 ? (
                    teacherAssignedClasses.map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{cls.name}</h4>
                          <p className="text-sm text-gray-600">{cls.subject} • {cls.studentCount} {language === 'en' ? 'students' : 'étudiants'}</p>
                          <p className="text-xs text-gray-500">{cls.schedule}</p>
                          {user?.role !== 'teacher' && (
                            <p className="text-xs text-gray-500 mt-1">
                              {language === 'en' ? 'Teacher:' : 'Enseignant:'} Teacher {cls.teacherId}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {cls.subject}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>{language === 'en' ? 'No classes assigned yet' : 'Aucune classe assignée pour le moment'}</p>
                      <p className="text-sm">{language === 'en' ? 'Contact your school admin to get assigned to classes' : 'Contactez votre administrateur scolaire pour être assigné à des classes'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {user?.role === 'teacher'
                    ? (language === 'en' ? 'Available Subjects' : 'Matières Disponibles')
                    : (language === 'en' ? 'All Subjects' : 'Toutes les Matières')
                  }
                </h3>
                <div className="space-y-3">
                  {availableSubjects.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {availableSubjects.map((subject, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {subject}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>{language === 'en' ? 'No subjects available' : 'Aucune matière disponible'}</p>
                      <p className="text-sm">{language === 'en' ? 'Subjects will appear when you are assigned to classes' : 'Les matières apparaîtront quand vous serez assigné à des classes'}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{language === 'en' ? 'Note:' : 'Note :'}</strong> {user?.role === 'teacher' 
                      ? (language === 'en' 
                        ? 'You can create quizzes and lesson plans for any of these subjects within your assigned classes.' 
                        : 'Vous pouvez créer des quiz et des plans de cours pour n\'importe laquelle de ces matières dans vos classes assignées.')
                      : (language === 'en'
                        ? 'As an admin, you can view and manage all classes, students, quizzes, and lesson plans across the school.'
                        : 'En tant qu\'administrateur, vous pouvez voir et gérer toutes les classes, étudiants, quiz et plans de cours de l\'école.')
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'en' ? 'Recent Quizzes' : 'Quiz Récents'}
                </h3>
                <div className="space-y-3">
                  {teacherQuizzes.slice(0, 3).map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                        <p className="text-sm text-gray-600">{quiz.subject} • {quiz.class}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(quiz.isPublished ? 'published' : 'draft')}`}>
                        {quiz.isPublished ? (language === 'en' ? 'Published' : 'Publié') : (language === 'en' ? 'Draft' : 'Brouillon')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'en' ? 'Recent Lesson Plans' : 'Plans de Cours Récents'}
                </h3>
                <div className="space-y-3">
                  {teacherLessonPlans.slice(0, 3).map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{plan.title}</h4>
                        <p className="text-sm text-gray-600">{plan.subject} • {plan.class}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(plan.status)}`}>
                        {plan.status === 'completed' ? (language === 'en' ? 'Completed' : 'Terminé') : (language === 'en' ? 'Draft' : 'Brouillon')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'My Classes' : 'Mes Classes'}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teacherAssignedClasses.map((cls) => (
                  <div key={cls.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{cls.name}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {cls.subject}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{cls.studentCount} {language === 'en' ? 'students' : 'étudiants'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{cls.schedule}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                        {language === 'en' ? 'View Details' : 'Voir Détails'}
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'Student Management' : 'Gestion des Étudiants'}
              </h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                <span>{language === 'en' ? 'Add Student' : 'Ajouter Étudiant'}</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'en' ? 'Student' : 'Étudiant'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'en' ? 'Class' : 'Classe'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'en' ? 'Status' : 'Statut'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'en' ? 'Last Activity' : 'Dernière Activité'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'en' ? 'Actions' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.class}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.isActive ? (language === 'en' ? 'Active' : 'Actif') : (language === 'en' ? 'Inactive' : 'Inactif')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.lastActivity.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'Quiz Management' : 'Gestion des Quiz'}
              </h3>
              <button 
                onClick={() => navigate('/quiz')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>{language === 'en' ? 'Create Quiz' : 'Créer Quiz'}</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => (
                  <div key={quiz.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{quiz.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(quiz.isPublished ? 'published' : 'draft')}`}>
                        {quiz.isPublished ? (language === 'en' ? 'Published' : 'Publié') : (language === 'en' ? 'Draft' : 'Brouillon')}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{quiz.subject}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{quiz.class}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4" />
                        <span>{quiz.questionCount} {language === 'en' ? 'questions' : 'questions'}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                        {language === 'en' ? 'Preview' : 'Aperçu'}
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'Lesson Plans' : 'Plans de Cours'}
              </h3>
              <button 
                onClick={() => navigate('/lesson-planner')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>{language === 'en' ? 'Create Lesson Plan' : 'Créer Plan de Cours'}</span>
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredLessonPlans.map((plan) => (
                  <div key={plan.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{plan.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(plan.status)}`}>
                        {plan.status === 'completed' ? (language === 'en' ? 'Completed' : 'Terminé') : (language === 'en' ? 'Draft' : 'Brouillon')}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{plan.subject}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{plan.class}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{plan.duration}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                        {language === 'en' ? 'View' : 'Voir'}
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'Student Progress Overview' : 'Aperçu des Progrès des Étudiants'}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProgressData.map((progress) => (
                  <div key={progress.studentId} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{progress.studentName}</h4>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(progress.trend)}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {language === 'en' ? 'Average Score' : 'Score Moyen'}
                        </span>
                        <span className="text-lg font-semibold text-gray-900">{progress.averageScore}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {language === 'en' ? 'Total Quizzes' : 'Quiz Totaux'}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{progress.totalQuizzes}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {language === 'en' ? 'Last Quiz' : 'Dernier Quiz'}
                        </span>
                        <span className="text-sm text-gray-500">{progress.lastQuizDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button 
                        onClick={() => navigate('/student-progress')}
                        className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        {language === 'en' ? 'View Details' : 'Voir Détails'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'Reports & Analytics' : 'Rapports et Analyses'}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {language === 'en' ? 'Monthly Reports' : 'Rapports Mensuels'}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {language === 'en' ? 'Generate and send monthly progress reports to parents' : 'Générer et envoyer des rapports de progrès mensuels aux parents'}
                  </p>
                  <button 
                    onClick={() => navigate('/monthly-reports')}
                    className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    {language === 'en' ? 'Generate Reports' : 'Générer Rapports'}
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {language === 'en' ? 'Progress Insights' : 'Aperçus de Progrès'}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {language === 'en' ? 'Detailed analytics and insights on student performance' : 'Analyses détaillées et aperçus sur les performances des étudiants'}
                  </p>
                  <button 
                    onClick={() => navigate('/progress-insights')}
                    className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                  >
                    {language === 'en' ? 'View Insights' : 'Voir Aperçus'}
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Download className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {language === 'en' ? 'Export Center' : 'Centre d\'Exportation'}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {language === 'en' ? 'Export data, reports, and analytics in various formats' : 'Exporter des données, rapports et analyses dans différents formats'}
                  </p>
                  <button 
                    onClick={() => navigate('/export-center')}
                    className="w-full px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
                  >
                    {language === 'en' ? 'Export Data' : 'Exporter Données'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'Settings' : 'Paramètres'}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    {language === 'en' ? 'Language Preferences' : 'Préférences de Langue'}
                  </h4>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="language"
                        value="en"
                        checked={language === 'en'}
                        onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
                        className="mr-2"
                      />
                      English
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="language"
                        value="fr"
                        checked={language === 'fr'}
                        onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
                        className="mr-2"
                      />
                      Français
                    </label>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    {language === 'en' ? 'Profile Information' : 'Informations du Profil'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'en' ? 'Name' : 'Nom'}
                      </label>
                      <input
                        type="text"
                        value={user?.fullName || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'en' ? 'Email' : 'Email'}
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    {language === 'en' ? 'Quick Actions' : 'Actions Rapides'}
                  </h4>
                  <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      {language === 'en' ? 'Save Changes' : 'Sauvegarder Modifications'}
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                      {language === 'en' ? 'Reset' : 'Réinitialiser'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
