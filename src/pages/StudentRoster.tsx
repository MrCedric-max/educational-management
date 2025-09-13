import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, UserPlus, Download, Upload, Settings, School, BookOpen, GraduationCap, CheckCircle, XCircle, Eye, Edit, BarChart3, Clock, FileText, TrendingUp, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCameroonianEducation } from '../contexts/CameroonianEducationContext';

// Types and Interfaces for School Admin Dashboard
type UserRole = 'teacher' | 'student' | 'parent';
type SchoolSystem = 'anglophone' | 'francophone';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  classId?: string;
  isActive: boolean;
  createdAt: Date;
  temporaryPassword?: string;
}

interface ClassData {
  id: string;
  name: string;
  displayName: string; // Based on school system
  teacherId?: string;
  teacherName?: string;
  studentCount: number;
  capacity: number;
  createdAt: Date;
}

interface SchoolSettings {
  id: string;
  name: string;
  system: SchoolSystem;
  adminEmail: string;
}

// Class name mapping based on school system
const CLASS_NAME_MAPPING: Record<SchoolSystem, Record<string, string>> = {
  anglophone: {
    '1': 'Class 1',
    '2': 'Class 2',
    '3': 'Class 3',
    '4': 'Class 4',
    '5': 'Class 5',
    '6': 'Class 6',
  },
  francophone: {
    '1': 'CP',
    '2': 'CE1',
    '3': 'CE2',
    '4': 'CM1',
    '5': 'CM2',
    '6': '6ème',
  }
};

const SchoolAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { 
    getClassDisplayName, 
    getAgeForLevel, 
    getLearningObjectives, 
    getAssessmentCriteria,
    getSubjectsForSystem,
    getTerm,
    getLevelFromClassName
  } = useCameroonianEducation();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'classes' | 'analytics' | 'reports' | 'settings'>('overview');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedClassData, setEditedClassData] = useState<any>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showUserForm, setShowUserForm] = useState(false);
  const [showClassForm, setShowClassForm] = useState(false);
  const [showUserViewModal, setShowUserViewModal] = useState(false);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Lesson plan filters
  const [lessonPlanFilters, setLessonPlanFilters] = useState({
    teacher: '',
    className: '',
    subject: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [newUserData, setNewUserData] = useState({
    fullName: '',
    email: '',
    role: 'student' as UserRole,
    classId: ''
  });
  
  const [newClassData, setNewClassData] = useState({
    name: '',
    capacity: 30
  });

  // Reset component state when user changes
  useEffect(() => {
    // Reset all state to initial values when user changes
    setActiveTab('overview');
    setSelectedClass(null);
    setShowClassModal(false);
    setIsEditMode(false);
    setEditedClassData(null);
    setShowExportModal(false);
    setShowImportModal(false);
    setShowSettingsModal(false);
    setCurrentDateTime(new Date());
    setShowUserForm(false);
    setShowClassForm(false);
    setShowUserViewModal(false);
    setShowUserEditModal(false);
    setSelectedUser(null);
    setLessonPlanFilters({
      teacher: '',
      className: '',
      subject: ''
    });
    setSearchTerm('');
    setFilterRole('');
    setNewUserData({
      fullName: '',
      email: '',
      role: 'student' as UserRole,
      classId: ''
    });
  }, [user?.id]); // Reset when user changes

  // Mock data - in a real app, this would come from an API
  const schoolSettings: SchoolSettings = {
    id: 'sch_1',
    name: 'St. Mary\'s Primary School',
    system: 'anglophone',
    adminEmail: 'admin@stmarys.edu'
  };

  const mockUsers: User[] = [
    {
      id: '1',
      email: 'john.doe@stmarys.edu',
      fullName: 'John Doe',
      role: 'teacher',
      classId: 'class_1',
      isActive: true,
      createdAt: new Date('2024-01-15'),
      temporaryPassword: 'temp123'
    },
    {
      id: '2',
      email: 'jane.smith@stmarys.edu',
      fullName: 'Jane Smith',
      role: 'teacher',
      classId: 'class_2',
      isActive: true,
      createdAt: new Date('2024-01-16'),
      temporaryPassword: 'temp456'
    },
    {
      id: '3',
      email: 'alice.johnson@student.stmarys.edu',
      fullName: 'Alice Johnson',
      role: 'student',
      classId: 'class_1',
      isActive: true,
      createdAt: new Date('2024-01-20'),
      temporaryPassword: 'temp789'
    },
    {
      id: '4',
      email: 'bob.smith@student.stmarys.edu',
      fullName: 'Bob Smith',
      role: 'student',
      classId: 'class_1',
      isActive: true,
      createdAt: new Date('2024-01-21'),
      temporaryPassword: 'temp012'
    },
    {
      id: '5',
      email: 'carol.davis@student.stmarys.edu',
      fullName: 'Carol Davis',
      role: 'student',
      classId: 'class_2',
      isActive: true,
      createdAt: new Date('2024-01-22'),
      temporaryPassword: 'temp345'
    }
  ];

  const mockClasses: ClassData[] = [
    {
      id: 'class_1',
      name: '1',
      displayName: CLASS_NAME_MAPPING[schoolSettings.system]['1'],
      teacherId: '1',
      teacherName: 'John Doe',
      studentCount: 2,
      capacity: 30,
      createdAt: new Date('2024-01-10')
    },
    {
      id: 'class_2',
      name: '2',
      displayName: CLASS_NAME_MAPPING[schoolSettings.system]['2'],
      teacherId: '2',
      teacherName: 'Jane Smith',
      studentCount: 1,
      capacity: 30,
      createdAt: new Date('2024-01-11')
    },
    {
      id: 'class_3',
      name: '3',
      displayName: CLASS_NAME_MAPPING[schoolSettings.system]['3'],
      teacherId: undefined,
      teacherName: 'Unassigned',
      studentCount: 0,
      capacity: 30,
      createdAt: new Date('2024-01-12')
    }
  ];

  const statistics = {
    totalUsers: mockUsers.length,
    totalTeachers: mockUsers.filter(u => u.role === 'teacher').length,
    totalStudents: mockUsers.filter(u => u.role === 'student').length,
    totalClasses: mockClasses.length,
    activeUsers: mockUsers.filter(u => u.isActive).length
  };

  // Mock analytics data
  const mockAnalytics = {
    schoolPerformance: {
      averageQuizScore: 78.5,
      totalQuizzesCompleted: 1247,
      averageAttendance: 94.2,
      totalLessonsPlanned: 89
    },
    subjectPerformance: [
      { subject: 'Mathematics', averageScore: 82.3, totalStudents: 240, improvement: '+5.2%' },
      { subject: 'English', averageScore: 76.8, totalStudents: 240, improvement: '+3.1%' },
      { subject: 'Science', averageScore: 79.1, totalStudents: 240, improvement: '+4.7%' },
      { subject: 'Social Studies', averageScore: 75.4, totalStudents: 240, improvement: '+2.8%' },
      { subject: 'French', averageScore: 73.2, totalStudents: 240, improvement: '+6.1%' }
    ],
    demographics: {
      ageDistribution: [
        { age: '6-7 years', count: 45, percentage: 18.8 },
        { age: '7-8 years', count: 52, percentage: 21.7 },
        { age: '8-9 years', count: 48, percentage: 20.0 },
        { age: '9-10 years', count: 51, percentage: 21.3 },
        { age: '10-11 years', count: 44, percentage: 18.3 }
      ],
      genderDistribution: [
        { gender: 'Male', count: 125, percentage: 52.1 },
        { gender: 'Female', count: 115, percentage: 47.9 }
      ]
    }
  };

  // Mock reports data
  const mockReports = [
    {
      id: '1',
      studentName: 'Alice Johnson',
      className: 'Class 3',
      month: 'January 2024',
      status: 'completed',
      averageScore: 85.2,
      subjects: ['Mathematics', 'English', 'Science'],
      teacherName: 'John Doe'
    },
    {
      id: '2',
      studentName: 'Bob Smith',
      className: 'Class 4',
      month: 'January 2024',
      status: 'completed',
      averageScore: 78.9,
      subjects: ['Mathematics', 'English', 'Social Studies'],
      teacherName: 'Jane Wilson'
    },
    {
      id: '3',
      studentName: 'Carol Davis',
      className: 'Class 2',
      month: 'January 2024',
      status: 'pending',
      averageScore: null,
      subjects: ['Mathematics', 'English', 'Science'],
      teacherName: 'Mike Brown'
    }
  ];

  // Mock lesson plans data
  const mockLessonPlans = [
    {
      id: '1',
      title: 'Introduction to Fractions',
      subject: 'Mathematics',
      className: 'Class 3',
      teacherName: 'John Doe',
      date: '2024-01-15',
      duration: '45 minutes',
      objectives: ['Understand basic fractions', 'Identify numerator and denominator'],
      status: 'completed'
    },
    {
      id: '2',
      title: 'Reading Comprehension: Short Stories',
      subject: 'English',
      className: 'Class 4',
      teacherName: 'Jane Wilson',
      date: '2024-01-16',
      duration: '40 minutes',
      objectives: ['Improve reading skills', 'Answer comprehension questions'],
      status: 'completed'
    },
    {
      id: '3',
      title: 'Plant Life Cycle',
      subject: 'Science',
      className: 'Class 2',
      teacherName: 'Mike Brown',
      date: '2024-01-17',
      duration: '50 minutes',
      objectives: ['Learn plant growth stages', 'Observe real plants'],
      status: 'draft'
    }
  ];

  // Filter lesson plans based on selected filters
  const filteredLessonPlans = mockLessonPlans.filter(plan => {
    const matchesTeacher = lessonPlanFilters.teacher === '' || plan.teacherName === lessonPlanFilters.teacher;
    const matchesClass = lessonPlanFilters.className === '' || plan.className === lessonPlanFilters.className;
    const matchesSubject = lessonPlanFilters.subject === '' || plan.subject === lessonPlanFilters.subject;
    
    return matchesTeacher && matchesClass && matchesSubject;
  });

  // Get unique values for filter dropdowns
  const uniqueTeachers = Array.from(new Set(mockLessonPlans.map(plan => plan.teacherName)));
  const uniqueClasses = Array.from(new Set(mockLessonPlans.map(plan => plan.className)));
  const uniqueSubjects = Array.from(new Set(mockLessonPlans.map(plan => plan.subject)));

  const handleViewClass = (classItem: any) => {
    setSelectedClass(classItem);
    setIsEditMode(false);
    setEditedClassData(null);
    setShowClassModal(true);
  };

  const handleEditClass = (classItem: any) => {
    setSelectedClass(classItem);
    setIsEditMode(true);
    setEditedClassData({
      name: classItem.name,
      capacity: classItem.capacity
    });
    setShowClassModal(true);
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleClassDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedClassData((prev: any) => ({ 
      ...prev, 
      [name]: name === 'capacity' ? parseInt(value) || 0 : value 
    }));
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserViewModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUserEditModal(true);
  };

  const handleExportUsers = () => {
    setShowExportModal(true);
  };

  const handleImportUsers = () => {
    setShowImportModal(true);
  };

  const handleSystemSettings = () => {
    setShowSettingsModal(true);
  };

  const handleViewAllReports = () => {
    navigate('/student-progress');
  };

  const handleViewAllLessonPlans = () => {
    navigate('/lesson-planner');
  };

  const handleLessonPlanFilterChange = (filterType: string, value: string) => {
    setLessonPlanFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Update date/time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClassInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewClassData(prev => ({ ...prev, [name]: name === 'capacity' ? parseInt(value) : value }));
  };

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserData.fullName || !newUserData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Generate user ID and temporary password
    const userId = `USR_${Date.now()}`;
    const tempPassword = `temp_${Math.random().toString(36).substring(2, 8)}`;
    
    toast.success(`${newUserData.role} "${newUserData.fullName}" added successfully!`);
    toast.success(`User ID: ${userId} | Password: ${tempPassword}`);
    
    setNewUserData({ fullName: '', email: '', role: 'student', classId: '' });
    setShowUserForm(false);
  };

  const addClass = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClassData.name) {
      toast.error('Please enter a class name');
      return;
    }

    // Determine the level from class name
    const level = getLevelFromClassName(newClassData.name, schoolSettings.system) || '1';
    const system = schoolSettings.system;
    
    // Get proper display name and context
    const displayName = getClassDisplayName(level as any, system);
    const age = getAgeForLevel(level as any);
    const learningObjectives = getLearningObjectives(level as any, system);
    const assessmentCriteria = getAssessmentCriteria(level as any, system);
    const subjects = getSubjectsForSystem(system);
    
    const newClass = {
      id: Date.now().toString(),
      name: displayName,
      originalName: newClassData.name,
      capacity: newClassData.capacity,
      currentStudents: 0,
      ageGroup: age,
      system: system,
      level: level,
      learningObjectives: learningObjectives,
      assessmentCriteria: assessmentCriteria,
      subjects: subjects,
      createdAt: new Date()
    };

    console.log(`Created ${system} class: ${displayName} (Age: ${age})`);
    console.log(`Learning objectives: ${learningObjectives.join(', ')}`);
    console.log(`Available subjects: ${subjects.join(', ')}`);
    
    toast.success(`Class created successfully!`);
    setNewClassData({ name: '', capacity: 30 });
    setShowClassForm(false);
  };

  const toggleUserStatus = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.isActive = !user.isActive;
      toast.success(`User ${user.isActive ? 'activated' : 'deactivated'} successfully!`);
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === '' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* School Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          {/* School Logo, Name, and Motto - Left Side */}
          <div className="flex items-center space-x-6">
            <div className="bg-blue-100 p-4 rounded-full flex-shrink-0">
              <School className="h-12 w-12 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-gray-900">{schoolSettings.name}</h2>
              <p className="text-gray-600 italic">"Excellence in Education, Character, and Service"</p>
            </div>
          </div>
          
          {/* Centralized Title */}
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-gray-900">School Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage users, classes, and school settings</p>
          </div>
          
          {/* Current Date and Time - Right Side */}
          <div className="flex items-center space-x-2 text-right">
            <Clock className="h-5 w-5 text-gray-500" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {currentDateTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-sm text-gray-600">
                {currentDateTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="inline-block w-4 h-4 mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="inline-block w-4 h-4 mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'classes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <School className="inline-block w-4 h-4 mr-2" />
              Classes
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="inline-block w-4 h-4 mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="inline-block w-4 h-4 mr-2" />
              Reports
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="inline-block w-4 h-4 mr-2" />
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">{statistics.totalUsers}</div>
                  <div className="text-sm text-blue-600">Total Users</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{statistics.totalTeachers}</div>
                  <div className="text-sm text-green-600">Teachers</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">{statistics.totalStudents}</div>
                  <div className="text-sm text-purple-600">Students</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <School className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-orange-600">{statistics.totalClasses}</div>
                  <div className="text-sm text-orange-600">Classes</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-emerald-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-emerald-600">{statistics.activeUsers}</div>
                  <div className="text-sm text-emerald-600">Active Users</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
              <div className="space-y-3">
                {mockUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                    <div>
                      <h4 className="font-medium">{user.fullName}</h4>
                      <p className="text-sm text-gray-600">{user.role} • {user.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Class Overview</h3>
              <div className="space-y-3">
                {mockClasses.map((classItem) => (
                  <div key={classItem.id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                    <div>
                      <h4 className="font-medium">{classItem.displayName}</h4>
                      <p className="text-sm text-gray-600">Teacher: {classItem.teacherName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{classItem.studentCount}/{classItem.capacity}</div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowUserForm(true)}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserPlus className="h-6 w-6 text-blue-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Add New User</div>
                  <div className="text-sm text-gray-600">Create teacher or student account</div>
                </div>
              </button>
              
              <button
                onClick={() => setShowClassForm(true)}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-6 w-6 text-green-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Add New Class</div>
                  <div className="text-sm text-gray-600">Create a new class</div>
                </div>
              </button>
              
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-6 w-6 text-purple-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Export Data</div>
                  <div className="text-sm text-gray-600">Export users and reports</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">User Management</h2>
            <button
              onClick={() => setShowUserForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <UserPlus className="inline w-4 h-4 mr-2" />
              Add User
            </button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                <option value="teacher">Teachers</option>
                <option value="student">Students</option>
                <option value="parent">Parents</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const userClass = mockClasses.find(c => c.id === user.classId);
                  return (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-sm ${
                          user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'student' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {userClass ? userClass.displayName : 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`flex items-center px-2 py-1 rounded text-sm ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {user.isActive ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="View User Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Classes Tab */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Class Management</h2>
            <button
              onClick={() => setShowClassForm(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              <Plus className="inline w-4 h-4 mr-2" />
              Add Class
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockClasses.map((classItem) => (
              <div key={classItem.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{classItem.displayName}</h3>
                    <p className="text-sm text-gray-600">Teacher: {classItem.teacherName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    classItem.teacherId ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {classItem.teacherId ? 'Assigned' : 'Unassigned'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Students</span>
                    <span className="text-sm font-medium">{classItem.studentCount}/{classItem.capacity}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(classItem.studentCount / classItem.capacity) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm text-gray-500">{classItem.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4 pt-4 border-t">
                  <button 
                    onClick={() => handleViewClass(classItem)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                  >
                    <Eye className="inline w-4 h-4 mr-1" />
                    View
                  </button>
                  <button 
                    onClick={() => handleEditClass(classItem)}
                    className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                  >
                    <Edit className="inline w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">School-Wide Analytics</h2>
          </div>

          {/* School Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{mockAnalytics.schoolPerformance.averageQuizScore}%</div>
                  <div className="text-sm text-green-600">Average Quiz Score</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">{mockAnalytics.schoolPerformance.totalQuizzesCompleted}</div>
                  <div className="text-sm text-blue-600">Quizzes Completed</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">{mockAnalytics.schoolPerformance.averageAttendance}%</div>
                  <div className="text-sm text-purple-600">Average Attendance</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-orange-600">{mockAnalytics.schoolPerformance.totalLessonsPlanned}</div>
                  <div className="text-sm text-orange-600">Lessons Planned</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Progress by Discipline</h3>
              <div className="space-y-4">
                {mockAnalytics.subjectPerformance.map((subject, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                    <div>
                      <h4 className="font-medium">{subject.subject}</h4>
                      <p className="text-sm text-gray-600">{subject.totalStudents} students</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{subject.averageScore}%</div>
                      <div className="text-sm text-green-600">{subject.improvement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demographics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Student Demographics</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Age Distribution</h4>
                  <div className="space-y-2">
                    {mockAnalytics.demographics.ageDistribution.map((age, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{age.age}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${age.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12">{age.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Gender Distribution</h4>
                  <div className="space-y-2">
                    {mockAnalytics.demographics.genderDistribution.map((gender, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{gender.gender}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${gender.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`}
                              style={{ width: `${gender.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12">{gender.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Reports & Lesson Plans Access</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Reports */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Student Progress Reports</h3>
              <div className="space-y-3">
                {mockReports.map((report) => (
                  <div key={report.id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                    <div>
                      <h4 className="font-medium">{report.studentName}</h4>
                      <p className="text-sm text-gray-600">{report.className} • {report.month}</p>
                      <p className="text-sm text-gray-500">Teacher: {report.teacherName}</p>
                    </div>
                    <div className="text-right">
                      {report.status === 'completed' ? (
                        <div>
                          <div className="text-lg font-bold text-green-600">{report.averageScore}%</div>
                          <span className="text-sm text-green-600">Completed</span>
                        </div>
                      ) : (
                        <span className="text-sm text-yellow-600">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <button 
                  onClick={handleViewAllReports}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  View All Reports
                </button>
              </div>
            </div>

            {/* Lesson Plans */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Teacher Lesson Plans</h3>
              
              {/* Filter Controls */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Teacher</label>
                  <select
                    value={lessonPlanFilters.teacher}
                    onChange={(e) => handleLessonPlanFilterChange('teacher', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Teachers</option>
                    {uniqueTeachers.map(teacher => (
                      <option key={teacher} value={teacher}>{teacher}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Class</label>
                  <select
                    value={lessonPlanFilters.className}
                    onChange={(e) => handleLessonPlanFilterChange('className', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Classes</option>
                    {uniqueClasses.map(className => (
                      <option key={className} value={className}>{className}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Subject</label>
                  <select
                    value={lessonPlanFilters.subject}
                    onChange={(e) => handleLessonPlanFilterChange('subject', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Subjects</option>
                    {uniqueSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-3">
                {filteredLessonPlans.map((plan) => (
                  <div key={plan.id} className="p-3 border border-gray-200 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{plan.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        plan.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {plan.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{plan.subject} • {plan.className}</p>
                    <p className="text-sm text-gray-500">Teacher: {plan.teacherName} • {plan.date}</p>
                    <p className="text-sm text-gray-500 mt-1">Duration: {plan.duration}</p>
                  </div>
                ))}
              </div>
              
              {/* Results count and clear filters */}
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {filteredLessonPlans.length} of {mockLessonPlans.length} lesson plans
                </p>
                {(lessonPlanFilters.teacher || lessonPlanFilters.className || lessonPlanFilters.subject) && (
                  <button
                    onClick={() => setLessonPlanFilters({ teacher: '', className: '', subject: '' })}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <button 
                  onClick={handleViewAllLessonPlans}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  View All Lesson Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">System Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* School Profile */}
          <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">School Profile</h3>
              <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                <input
                  type="text"
                  value={schoolSettings.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Educational System</label>
                <input
                  type="text"
                  value={schoolSettings.system}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={schoolSettings.adminEmail}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  readOnly
                />
              </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Class Naming System</h4>
              <p className="text-sm text-blue-800 mb-3">
                Your school uses the <strong>{schoolSettings.system}</strong> system:
              </p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {Object.entries(CLASS_NAME_MAPPING[schoolSettings.system]).map(([key, value]) => (
                  <div key={key} className="bg-white p-2 rounded text-center">
                    {value}
                  </div>
                ))}
                  </div>
              </div>
            </div>
          </div>

            {/* Language Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Language Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interface Language</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Language for New Users</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Current Settings</h4>
                  <p className="text-sm text-green-800">
                    Interface: <strong>English</strong><br/>
                    Default for new users: <strong>English</strong><br/>
                    Educational system: <strong>{schoolSettings.system}</strong>
                  </p>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300">
                    Reset
              </button>
                  <button 
                    onClick={() => toast.success('Settings saved successfully!')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save Changes
              </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <form onSubmit={addUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={newUserData.fullName}
                  onChange={handleUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={newUserData.email}
                  onChange={handleUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  name="role"
                  value={newUserData.role}
                  onChange={handleUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class Assignment</label>
                <select
                  name="classId"
                  value={newUserData.classId}
                  onChange={handleUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No Class Assignment</option>
                  {mockClasses.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-800">
                  A temporary password will be generated and sent to the user's email.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUserForm(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showClassForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Class</h2>
            <form onSubmit={addClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class Level *</label>
                <select
                  name="name"
                  value={newClassData.name}
                  onChange={handleClassInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Class Level</option>
                  {Object.entries(CLASS_NAME_MAPPING[schoolSettings.system]).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={newClassData.capacity}
                  onChange={handleClassInputChange}
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm text-green-800">
                  Class names are automatically mapped to your school's {schoolSettings.system} system.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowClassForm(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Add Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Details Modal */}
      {showClassModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {isEditMode ? 'Edit Class' : 'Class Details'}
              </h3>
              <button
                onClick={() => {
                  setShowClassModal(false);
                  setIsEditMode(false);
                  setEditedClassData(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Class Name</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="name"
                    value={editedClassData?.name || ''}
                    onChange={handleClassDataChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter class name"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{getClassDisplayName(selectedClass.name, 'anglophone')}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Students</label>
                {isEditMode ? (
                  <div className="mt-1">
                    <p className="text-sm text-gray-600">Current: {selectedClass.studentCount} students</p>
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-600">Capacity</label>
                      <input
                        type="number"
                        name="capacity"
                        value={editedClassData?.capacity || 0}
                        onChange={handleClassDataChange}
                        min="1"
                        max="50"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter capacity"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{selectedClass.studentCount}/{selectedClass.capacity}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Created Date</label>
                <p className="mt-1 text-sm text-gray-900">{selectedClass.createdAt.toLocaleDateString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Class ID</label>
                <p className="mt-1 text-sm text-gray-900">{selectedClass.id}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowClassModal(false);
                  setIsEditMode(false);
                  setEditedClassData(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                {isEditMode ? 'Cancel' : 'Close'}
              </button>
              {isEditMode && (
                <button
                  onClick={() => {
                    if (!editedClassData?.name || !editedClassData?.capacity) {
                      toast.error('Please fill in all required fields');
                      return;
                    }
                    toast.success('Class updated successfully!');
                    setShowClassModal(false);
                    setIsEditMode(false);
                    setEditedClassData(null);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Export Users Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Export Users</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="csv">CSV (Excel Compatible)</option>
                  <option value="pdf">PDF Report</option>
                  <option value="json">JSON Data</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Include Data</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">User Information (Name, Email, Role)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">Class Assignments</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Account Status</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Export started! File will download shortly.');
                  setShowExportModal(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Export Users
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Users Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Import Users</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Drop your CSV file here or click to browse</p>
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-1">File Format Requirements:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• CSV or Excel format (.csv, .xlsx)</li>
                  <li>• Required columns: Name, Email, Role, Class</li>
                  <li>• Maximum 100 users per import</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Import completed! 5 users added successfully.');
                  setShowImportModal(false);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Import Users
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">System Settings</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School System</label>
                <select 
                  value={schoolSettings.system}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="anglophone">Anglophone</option>
                  <option value="francophone">Francophone</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Class Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  defaultValue="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Registration</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">Allow self-registration</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">Require email verification</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Settings saved successfully!');
                  setShowSettingsModal(false);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User View Modal */}
      {showUserViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Details</h3>
              <button
                onClick={() => {
                  setShowUserViewModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.fullName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <span className={`inline-flex px-2 py-1 rounded text-sm mt-1 ${
                  selectedUser.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                  selectedUser.role === 'student' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {selectedUser.role}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedUser.classId ? mockClasses.find(c => c.id === selectedUser.classId)?.displayName || 'Unknown' : 'Unassigned'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex items-center px-2 py-1 rounded text-sm mt-1 ${
                  selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedUser.isActive ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                  {selectedUser.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Created Date</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.createdAt.toLocaleDateString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <p className="mt-1 text-sm text-gray-900 font-mono">{selectedUser.id}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowUserViewModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowUserViewModal(false);
                  handleEditUser(selectedUser);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {showUserEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <button
                onClick={() => {
                  setShowUserEditModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success('User updated successfully!');
              setShowUserEditModal(false);
              setSelectedUser(null);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  defaultValue={selectedUser.fullName}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  defaultValue={selectedUser.email}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  defaultValue={selectedUser.role}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Class Assignment</label>
                <select
                  defaultValue={selectedUser.classId || ''}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Unassigned</option>
                  {mockClasses.map(classItem => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.displayName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  defaultValue={selectedUser.isActive ? 'active' : 'inactive'}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserEditModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SchoolAdminDashboard;