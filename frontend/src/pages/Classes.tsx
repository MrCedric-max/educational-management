import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Plus, BarChart3, School, CheckCircle, XCircle, Eye, Edit, 
  Search, Filter, Download, Upload, Settings, DollarSign, TrendingUp, 
  BookOpen, HelpCircle, FileText, Target, Calendar, UserCheck, 
  Package, CreditCard, PieChart, Activity, Globe, Shield, 
  ChevronDown, ChevronRight, Star, Crown, Zap, LogOut, X
} from 'lucide-react';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useCameroonianEducation } from '../contexts/CameroonianEducationContext';

// Types and Interfaces
type SchoolSystem = 'anglophone' | 'francophone';
type ContentType = 'quiz' | 'lesson_plan' | 'scheme_of_work' | 'pedagogic_project';
type SubscriptionStatus = 'active' | 'expired' | 'canceled' | 'pending';
type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';

interface SchoolData {
  id: string;
  name: string;
  system: SchoolSystem;
  adminEmail: string;
  adminName: string;
  adminId: string;
  schoolCode: string;
  createdAt: Date;
  isActive: boolean;
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
  subscriptionStatus: SubscriptionStatus;
  revenue: number;
  lastActivity: Date;
}

interface PremiumContent {
  id: string;
  title: string;
  type: ContentType;
  description: string;
  createdBy: string;
  createdAt: Date;
  isPremium: boolean;
  price: number;
  downloads: number;
  rating: number;
  tags: string[];
}

interface SubscriptionPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in months
  contentIds: string[];
  isActive: boolean;
  subscribers: number;
  revenue: number;
  createdAt: Date;
}

interface PlatformAnalytics {
  totalSchools: number;
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalQuizzesCreated: number;
  totalQuizzesCompleted: number;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeSubscriptions: number;
  topPerformingContent: PremiumContent[];
  schoolDemographics: {
    schoolId: string;
    schoolName: string;
    ageDistribution: { [key: string]: number };
    subjectPerformance: { [key: string]: number };
  }[];
}

const SuperAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getSystemDescription, getSubjectsForSystem } = useCameroonianEducation();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schools' | 'users' | 'content' | 'subscriptions' | 'reports'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create-school' | 'create-user' | 'create-content' | 'create-package' | 'impersonate-user'>('create-school');
  const [showContentModal, setShowContentModal] = useState(false);
  const [contentType, setContentType] = useState<'quiz' | 'lesson-plan' | 'scheme-of-work' | 'pedagogic-project'>('quiz');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewContentType, setViewContentType] = useState<'quiz' | 'lesson-plan' | 'scheme-of-work' | 'pedagogic-project'>('quiz');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContent, setEditingContent] = useState<{type: string, title: string, description: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  
  // School modal states
  const [showSchoolViewModal, setShowSchoolViewModal] = useState(false);
  const [showSchoolEditModal, setShowSchoolEditModal] = useState(false);
  const [selectedSchoolData, setSelectedSchoolData] = useState<SchoolData | null>(null);
  
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolSystem: 'anglophone' as SchoolSystem,
    adminEmail: '',
    adminName: '',
    // User creation fields
    userFullName: '',
    userEmail: '',
    userRole: 'student' as 'teacher' | 'student' | 'parent',
    userSchoolId: '',
    userClassId: '',
    contentTitle: '',
    contentType: 'quiz' as ContentType,
    contentDescription: '',
    contentPrice: 0,
    packageName: '',
    packageDescription: '',
    packagePrice: 0,
    packageDuration: 1,
    selectedContent: [] as string[]
  });

  // Reset component state when user changes
  useEffect(() => {
    // Reset all state to initial values when user changes
    setActiveTab('dashboard');
    setIsModalOpen(false);
    setModalType('create-school');
    setShowContentModal(false);
    setContentType('quiz');
    setShowViewModal(false);
    setViewContentType('quiz');
    setShowEditModal(false);
    setEditingContent(null);
    setSearchTerm('');
    setSelectedSchoolId('');
    setExpandedSections({});
    setShowSchoolViewModal(false);
    setShowSchoolEditModal(false);
    setSelectedSchoolData(null);
    setFormData({
      schoolName: '',
      schoolSystem: 'anglophone' as SchoolSystem,
      adminEmail: '',
      adminName: '',
      userFullName: '',
      userEmail: '',
      userRole: 'student' as 'teacher' | 'student' | 'parent',
      userSchoolId: '',
      userClassId: '',
      contentTitle: '',
      contentType: 'quiz' as ContentType,
      contentDescription: '',
      contentPrice: 0,
      packageName: '',
      packageDescription: '',
      packagePrice: 0,
      packageDuration: 1,
      selectedContent: [] as string[]
    });
  }, [user?.id]); // Reset when user changes

  // Mock data - in a real app, this would come from an API
  const mockSchools: SchoolData[] = [
    {
      id: '1',
      name: 'St. Mary\'s Primary School',
      system: 'anglophone',
      adminEmail: 'admin@stmarys.edu',
      adminName: 'John Smith',
      adminId: 'admin_1',
      schoolCode: 'SMS001',
      createdAt: new Date('2024-01-15'),
      isActive: true,
      totalTeachers: 12,
      totalStudents: 240,
      totalClasses: 12,
      subscriptionStatus: 'active',
      revenue: 12000,
      lastActivity: new Date('2024-01-20')
    },
    {
      id: '2',
      name: 'École Primaire La Salle',
      system: 'francophone',
      adminEmail: 'admin@lasalle.edu',
      adminName: 'Marie Dubois',
      adminId: 'admin_2',
      schoolCode: 'EPS002',
      createdAt: new Date('2024-02-01'),
      isActive: true,
      totalTeachers: 8,
      totalStudents: 160,
      totalClasses: 8,
      subscriptionStatus: 'active',
      revenue: 8000,
      lastActivity: new Date('2024-02-05')
    },
    {
      id: '3',
      name: 'Greenwood Elementary School',
      system: 'anglophone',
      adminEmail: 'admin@greenwood.edu',
      adminName: 'Sarah Johnson',
      adminId: 'admin_3',
      schoolCode: 'GES003',
      createdAt: new Date('2024-01-20'),
      isActive: true,
      totalTeachers: 15,
      totalStudents: 300,
      totalClasses: 15,
      subscriptionStatus: 'active',
      revenue: 15000,
      lastActivity: new Date('2024-02-10')
    },
    {
      id: '4',
      name: 'Lycée International de Paris',
      system: 'francophone',
      adminEmail: 'admin@lycee.edu',
      adminName: 'Pierre Martin',
      adminId: 'admin_4',
      schoolCode: 'LIP004',
      createdAt: new Date('2024-01-25'),
      isActive: false,
      totalTeachers: 20,
      totalStudents: 400,
      totalClasses: 20,
      subscriptionStatus: 'expired',
      revenue: 0,
      lastActivity: new Date('2024-01-30')
    }
  ];

  // Mock parent data
  const mockParents = [
    {
      id: '1',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      schoolId: '1',
      schoolName: 'St. Mary\'s Primary School',
      childrenCount: 2,
      isActive: true,
      lastLogin: new Date('2024-01-20'),
      createdAt: new Date('2024-01-10')
    },
    {
      id: '2',
      name: 'David Brown',
      email: 'david.brown@email.com',
      schoolId: '1',
      schoolName: 'St. Mary\'s Primary School',
      childrenCount: 1,
      isActive: true,
      lastLogin: new Date('2024-01-19'),
      createdAt: new Date('2024-01-12')
    },
    {
      id: '3',
      name: 'Lisa Davis',
      email: 'lisa.davis@email.com',
      schoolId: '2',
      schoolName: 'École Primaire La Salle',
      childrenCount: 3,
      isActive: false,
      lastLogin: new Date('2024-01-15'),
      createdAt: new Date('2024-01-08')
    },
    {
      id: '4',
      name: 'Michael Johnson',
      email: 'michael.johnson@email.com',
      schoolId: '1',
      schoolName: 'St. Mary\'s Primary School',
      childrenCount: 1,
      isActive: true,
      lastLogin: new Date('2024-01-18'),
      createdAt: new Date('2024-01-14')
    },
    {
      id: '5',
      name: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      schoolId: '2',
      schoolName: 'École Primaire La Salle',
      childrenCount: 2,
      isActive: true,
      lastLogin: new Date('2024-01-17'),
      createdAt: new Date('2024-01-11')
    }
  ];

  const statistics = {
    totalSchools: mockSchools.length,
    activeSchools: mockSchools.filter(s => s.isActive).length,
    totalUsers: mockSchools.reduce((sum, school) => sum + school.totalTeachers + school.totalStudents, 0),
    totalStudents: mockSchools.reduce((sum, school) => sum + school.totalStudents, 0),
    totalParents: mockParents.length,
    activeParents: mockParents.filter(p => p.isActive).length
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Generate unique school code based on school name
  const generateSchoolCode = (schoolName: string): string => {
    // Extract first letters of each word and add a random number
    const words = schoolName.split(' ').filter(word => word.length > 0);
    const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${initials}${randomNum}`;
  };

  // Generate unique user code
  const generateUserCode = (userName: string, role: string): string => {
    const words = userName.split(' ').filter(word => word.length > 0);
    const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
    const rolePrefix = role.charAt(0).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${rolePrefix}${initials}${randomNum}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalType === 'create-school') {
    if (!formData.schoolName || !formData.adminEmail || !formData.adminName) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Generate school ID, unique school code, and temporary password
    const schoolId = `SCH_${Date.now()}`;
    const schoolCode = generateSchoolCode(formData.schoolName);
    const tempPassword = `temp_${Math.random().toString(36).substring(2, 8)}`;
    
    toast.success(`School "${formData.schoolName}" created successfully!`);
    toast.success(`School ID: ${schoolId} | School Code: ${schoolCode} | Admin Password: ${tempPassword}`);
    
      setFormData(prev => ({ 
        ...prev, 
        schoolName: '', 
        schoolSystem: 'anglophone', 
        adminEmail: '', 
        adminName: '' 
      }));
    } else if (modalType === 'create-user') {
      if (!formData.userFullName || !formData.userEmail || !formData.userSchoolId) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Generate user ID, unique user code, and temporary password
      const userId = `USR_${Date.now()}`;
      const userCode = generateUserCode(formData.userFullName, formData.userRole);
      const tempPassword = `temp_${Math.random().toString(36).substring(2, 8)}`;
      
      toast.success(`${formData.userRole.charAt(0).toUpperCase() + formData.userRole.slice(1)} "${formData.userFullName}" created successfully!`);
      toast.success(`User ID: ${userId} | User Code: ${userCode} | Password: ${tempPassword}`);
      
      setFormData(prev => ({ 
        ...prev, 
        userFullName: '', 
        userEmail: '', 
        userRole: 'student',
        userSchoolId: '',
        userClassId: ''
      }));
    }
    
    setIsModalOpen(false);
  };

  const handleCreateContent = (type: 'quiz' | 'lesson-plan' | 'scheme-of-work' | 'pedagogic-project') => {
    setContentType(type);
    setShowContentModal(true);
  };

  const handleViewContent = (type: 'quiz' | 'lesson-plan' | 'scheme-of-work' | 'pedagogic-project') => {
    setViewContentType(type);
    setShowViewModal(true);
  };

  const handleEditContent = (type: string, title: string, description: string) => {
    setEditingContent({ type, title, description });
    setShowEditModal(true);
  };

  const toggleSchoolStatus = (schoolId: string) => {
    const school = mockSchools.find(s => s.id === schoolId);
    if (school) {
      school.isActive = !school.isActive;
      toast.success(`School ${school.isActive ? 'activated' : 'deactivated'} successfully!`);
    }
  };

  const toggleUserStatus = (userId: string, userType: 'teacher' | 'parent') => {
    // In a real app, this would make an API call to update the user status
    // For now, we'll simulate the action with a toast message
    const action = Math.random() > 0.5 ? 'activated' : 'deactivated';
    toast.success(`${userType.charAt(0).toUpperCase() + userType.slice(1)} ${userId} ${action} successfully!`);
    
    // In a real implementation, you would:
    // 1. Make an API call to update the user status
    // 2. Update the local state to reflect the change
    // 3. Refresh the user list
  };

  const handleViewSchool = (school: SchoolData) => {
    setSelectedSchoolData(school);
    setShowSchoolViewModal(true);
  };

  const handleEditSchool = (school: SchoolData) => {
    setSelectedSchoolData(school);
    setShowSchoolEditModal(true);
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.schoolName || !formData.adminEmail || !formData.adminName) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Generate unique school code
    const schoolCode = generateSchoolCode(formData.schoolName);
    
    const newSchool: SchoolData = {
      id: Date.now().toString(),
      name: formData.schoolName,
      system: formData.schoolSystem,
      adminEmail: formData.adminEmail,
      adminName: formData.adminName,
      adminId: Date.now().toString(),
      schoolCode: schoolCode,
      createdAt: new Date(),
      isActive: true,
      totalTeachers: 0,
      totalStudents: 0,
      totalClasses: 0,
      subscriptionStatus: 'active',
      revenue: 0,
      lastActivity: new Date()
    };

    // Add Cameroonian educational context
    const systemDescription = getSystemDescription(formData.schoolSystem);
    const availableSubjects = getSubjectsForSystem(formData.schoolSystem);
    
    console.log(`Created ${formData.schoolSystem} school: ${systemDescription}`);
    console.log(`Available subjects: ${availableSubjects.join(', ')}`);
    
    toast.success(`School created successfully! School Code: ${schoolCode}`);
    setIsModalOpen(false);
    setFormData({
      schoolName: '',
      schoolSystem: 'anglophone',
      adminEmail: '',
      adminName: '',
      userFullName: '',
      userEmail: '',
      userRole: 'student' as 'teacher' | 'student' | 'parent',
      userSchoolId: '',
      userClassId: '',
      contentTitle: '',
      contentType: 'quiz' as ContentType,
      contentDescription: '',
      contentPrice: 0,
      packageName: '',
      packageDescription: '',
      packagePrice: 0,
      packageDuration: 1,
      selectedContent: [] as string[]
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin Dashboard</h1>
        <p className="text-gray-600">Manage schools and monitor system-wide performance</p>
      </div>


      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="inline-block w-4 h-4 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('schools')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'schools'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <School className="inline-block w-4 h-4 mr-2" />
              Schools
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
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="inline-block w-4 h-4 mr-2" />
              Content Management
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subscriptions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <DollarSign className="inline-block w-4 h-4 mr-2" />
              Subscriptions & Revenue
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
          </nav>
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <School className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">{statistics.totalSchools}</div>
                  <div className="text-sm text-blue-600">Total Schools</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{statistics.activeSchools}</div>
                  <div className="text-sm text-green-600">Active Schools</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">{statistics.totalUsers}</div>
                  <div className="text-sm text-purple-600">Total Users</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-orange-600">{statistics.totalStudents}</div>
                  <div className="text-sm text-orange-600">Total Students</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-indigo-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{statistics.totalParents}</div>
                  <div className="text-sm text-indigo-600">Total Parents</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Schools</h3>
            <div className="space-y-3">
              {mockSchools.slice(0, 3).map((school) => (
                <div key={school.id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                  <div>
                    <h4 className="font-medium">{school.name}</h4>
                    <p className="text-sm text-gray-600">
                      {school.system} • {school.totalStudents} students • {school.totalClasses} classes
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    school.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {school.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Parents</h3>
            <div className="space-y-3">
              {mockParents.slice(0, 3).map((parent) => (
                <div key={parent.id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                  <div>
                    <h4 className="font-medium">{parent.name}</h4>
                    <p className="text-sm text-gray-600">
                      {parent.schoolName} • {parent.childrenCount} child{parent.childrenCount !== 1 ? 'ren' : ''} • Last login: {parent.lastLogin.toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    parent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {parent.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Schools Tab */}
      {activeTab === 'schools' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Schools</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Plus className="inline w-4 h-4 mr-2" />
              Add School
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">School</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">System</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockSchools.map((school) => (
                  <tr key={school.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{school.name}</div>
                        <div className="text-sm text-gray-500">Created: {school.createdAt.toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-800 font-mono">
                        {school.schoolCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-sm ${
                        school.system === 'anglophone' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {school.system}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {school.adminEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {school.totalStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleSchoolStatus(school.id)}
                        className={`flex items-center px-2 py-1 rounded text-sm ${
                          school.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {school.isActive ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                        {school.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewSchool(school)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="View School Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditSchool(school)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit School"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">User Management</h2>
            <div className="flex space-x-3">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                value={selectedSchoolId}
              >
                <option value="">Select School</option>
                {mockSchools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  setModalType('create-user');
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <Plus className="inline w-4 h-4 mr-2" />
                Add User
              </button>
            </div>
          </div>

          {selectedSchoolId && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Teachers Section */}
          <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Teachers
                </h3>
                <div className="space-y-3">
                  {[
                    { id: '1', name: 'John Doe', email: 'john@school.edu', isActive: true },
                    { id: '2', name: 'Jane Smith', email: 'jane@school.edu', isActive: true },
                    { id: '3', name: 'Mike Johnson', email: 'mike@school.edu', isActive: false }
                  ].map((teacher) => (
                    <div key={teacher.id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                      <div>
                        <h4 className="font-medium">{teacher.name}</h4>
                        <p className="text-sm text-gray-600">{teacher.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          teacher.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {teacher.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => toggleUserStatus(teacher.id, 'teacher')}
                          className={`px-3 py-1 rounded text-sm ${
                            teacher.isActive 
                              ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {teacher.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parents Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  Parents
                </h3>
                <div className="space-y-3">
                  {[
                    { id: '1', name: 'Sarah Wilson', email: 'sarah@email.com', isActive: true },
                    { id: '2', name: 'David Brown', email: 'david@email.com', isActive: true },
                    { id: '3', name: 'Lisa Davis', email: 'lisa@email.com', isActive: false }
                  ].map((parent) => (
                    <div key={parent.id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                      <div>
                        <h4 className="font-medium">{parent.name}</h4>
                        <p className="text-sm text-gray-600">{parent.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          parent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {parent.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => toggleUserStatus(parent.id, 'parent')}
                          className={`px-3 py-1 rounded text-sm ${
                            parent.isActive 
                              ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {parent.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!selectedSchoolId && (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a School</h3>
              <p className="text-gray-600">Choose a school from the dropdown above to view and manage its users.</p>
            </div>
          )}
        </div>
      )}

      {/* Content Management Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Content Management</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/quiz')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Plus className="inline-block w-4 h-4 mr-2" />
                Create New Quiz
              </button>
              <button
                onClick={() => navigate('/lesson-planner')}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <Plus className="inline-block w-4 h-4 mr-2" />
                Create Lesson Plan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <HelpCircle className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-sm text-blue-600">Quizzes</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-green-600 mr-3" />
              <div>
                  <div className="text-2xl font-bold text-green-600">18</div>
                  <div className="text-sm text-green-600">Lesson Plans</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-purple-600">Schemes of Work</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                  <div className="text-2xl font-bold text-orange-600">8</div>
                  <div className="text-sm text-orange-600">Pedagogic Projects</div>
                </div>
              </div>
            </div>
              </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Content Library</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Quizzes</h4>
                <p className="text-sm text-gray-600 mb-3">Interactive assessments and practice tests</p>
                <button 
                  onClick={() => navigate('/quiz')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View All Quizzes →
                </button>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Lesson Plans</h4>
                <p className="text-sm text-gray-600 mb-3">Structured teaching materials and activities</p>
                <button 
                  onClick={() => navigate('/lesson-planner')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View All Lesson Plans →
                </button>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Schemes of Work</h4>
                <p className="text-sm text-gray-600 mb-3">Long-term curriculum planning documents</p>
                <button 
                  onClick={() => handleViewContent('scheme-of-work')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View All Schemes →
                </button>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Pedagogic Projects</h4>
                <p className="text-sm text-gray-600 mb-3">Innovative teaching methodologies and projects</p>
                <button 
                  onClick={() => handleViewContent('pedagogic-project')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View All Projects →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscriptions & Revenue Tab */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Subscriptions & Revenue</h2>
            <button
              onClick={() => {
                setModalType('create-package');
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Plus className="inline-block w-4 h-4 mr-2" />
              Create New Package
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-green-600">$45,230</div>
                  <div className="text-sm text-green-600">Total Revenue</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-blue-600">Active Packages</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <School className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-purple-600">Subscribed Schools</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Subscription Packages</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Basic Plan</h4>
                      <p className="text-sm text-gray-600">$99/month</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Premium Plan</h4>
                      <p className="text-sm text-gray-600">$199/month</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Enterprise Plan</h4>
                      <p className="text-sm text-gray-600">$399/month</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Subscriptions</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">St. Mary's Primary School</p>
                    <p className="text-sm text-gray-600">Premium Plan</p>
                  </div>
                  <span className="text-green-600 font-medium">$199</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">Greenwood Academy</p>
                    <p className="text-sm text-gray-600">Basic Plan</p>
                  </div>
                  <span className="text-green-600 font-medium">$99</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">Riverside Elementary</p>
                    <p className="text-sm text-gray-600">Enterprise Plan</p>
                  </div>
                  <span className="text-green-600 font-medium">$399</span>
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
            <h2 className="text-xl font-semibold">Reports</h2>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Select School for Reports</h3>
            <div className="mb-4">
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a school...</option>
                <option value="st-marys">St. Mary's Primary School</option>
                <option value="greenwood">Greenwood Academy</option>
                <option value="riverside">Riverside Elementary</option>
                <option value="oakwood">Oakwood International School</option>
              </select>
            </div>

            {selectedSchoolId && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h4 className="font-medium mb-4">Student Progress Reports</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Class 1 Progress Report</span>
                      <button 
                        onClick={() => navigate('/student-progress')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View →
                      </button>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Class 2 Progress Report</span>
                      <button 
                        onClick={() => navigate('/student-progress')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View →
                      </button>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Class 3 Progress Report</span>
                      <button 
                        onClick={() => navigate('/student-progress')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View →
                      </button>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Overall School Performance</span>
                      <button 
                        onClick={() => navigate('/progress-insights')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View →
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h4 className="font-medium mb-4">Teacher Lesson Plans</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Mathematics Lesson Plans</span>
                      <button 
                        onClick={() => navigate('/lesson-planner')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View →
                      </button>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>English Lesson Plans</span>
                      <button 
                        onClick={() => navigate('/lesson-planner')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View →
                      </button>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Science Lesson Plans</span>
                      <button 
                        onClick={() => navigate('/lesson-planner')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View →
                      </button>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>All Subject Lesson Plans</span>
                      <button 
                        onClick={() => navigate('/lesson-planner')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === 'create-package' ? 'Create New Package' : 
          modalType === 'create-user' ? 'Add New User' : 
          'Quick Add School'
        }
      >
        {modalType === 'create-package' ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            toast.success('Package created successfully!');
            setIsModalOpen(false);
          }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter package name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
                </label>
              <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter package description"
                rows={3}
                  required
              />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
                </label>
                <input
                type="number"
                step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (months) *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                <option value="">Select duration</option>
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Features Included
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Quiz Creation Tools</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Lesson Plan Templates</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Progress Analytics</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Export Reports</span>
                </label>
              </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                Create Package
                </button>
              </div>
            </form>
        ) : modalType === 'create-user' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
                </label>
                <input
                  type="text"
                name="userFullName"
                value={formData.userFullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
                </label>
                <input
                  type="email"
                name="userEmail"
                value={formData.userEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
                  required
                />
              </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                name="userRole"
                value={formData.userRole}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </select>
              </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School *
              </label>
              <select
                name="userSchoolId"
                value={formData.userSchoolId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select School</option>
                {mockSchools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>

            {formData.userRole === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class (Optional)
                </label>
                <select
                  name="userClassId"
                  value={formData.userClassId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Class</option>
                  <option value="class_1">Class 1</option>
                  <option value="class_2">Class 2</option>
                  <option value="class_3">Class 3</option>
                  <option value="class_4">Class 4</option>
                  <option value="class_5">Class 5</option>
                  <option value="class_6">Class 6</option>
                </select>
              </div>
            )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                Cancel
                </button>
                <button
                  type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                Create User
                </button>
              </div>
            </form>
        ) : (
        <form onSubmit={handleCreateSchool} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Name *
            </label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter school name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System *
            </label>
            <select
              name="schoolSystem"
              value={formData.schoolSystem}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="anglophone">Anglophone</option>
              <option value="francophone">Francophone</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email *
            </label>
            <input
              type="email"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Create School
            </button>
          </div>
        </form>
        )}
      </Modal>

      {/* Create Content Modal */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Create New {contentType === 'quiz' ? 'Quiz' : 
                           contentType === 'lesson-plan' ? 'Lesson Plan' :
                           contentType === 'scheme-of-work' ? 'Scheme of Work' : 'Pedagogic Project'}
              </h3>
              <button
                onClick={() => setShowContentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${contentType} title`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Subject</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="english">English</option>
                  <option value="science">Science</option>
                  <option value="social-studies">Social Studies</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Grade</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter description for ${contentType}`}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowContentModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success(`${contentType === 'quiz' ? 'Quiz' : 
                                contentType === 'lesson-plan' ? 'Lesson Plan' :
                                contentType === 'scheme-of-work' ? 'Scheme of Work' : 'Pedagogic Project'} created successfully!`);
                  setShowContentModal(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Create {contentType === 'quiz' ? 'Quiz' : 
                       contentType === 'lesson-plan' ? 'Lesson Plan' :
                       contentType === 'scheme-of-work' ? 'Scheme' : 'Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Content Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                All {viewContentType === 'quiz' ? 'Quizzes' : 
                      viewContentType === 'lesson-plan' ? 'Lesson Plans' :
                      viewContentType === 'scheme-of-work' ? 'Schemes of Work' : 'Pedagogic Projects'}
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {viewContentType === 'quiz' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Mathematics Quiz - Grade 3</h4>
                    <p className="text-sm text-gray-600 mb-2">Basic addition and subtraction problems</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Created: Jan 15, 2024</span>
                      <button 
                        onClick={() => handleEditContent('quiz', 'Mathematics Quiz - Grade 3', 'Basic addition and subtraction problems')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">English Quiz - Grade 2</h4>
                    <p className="text-sm text-gray-600 mb-2">Vocabulary and grammar exercises</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Created: Jan 12, 2024</span>
                      <button 
                        onClick={() => handleEditContent('quiz', 'English Quiz - Grade 2', 'Vocabulary and grammar exercises')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Science Quiz - Grade 4</h4>
                    <p className="text-sm text-gray-600 mb-2">Plants and animals knowledge test</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Created: Jan 10, 2024</span>
                      <button 
                        onClick={() => handleEditContent('quiz', 'Science Quiz - Grade 4', 'Plants and animals knowledge test')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Social Studies Quiz - Grade 5</h4>
                    <p className="text-sm text-gray-600 mb-2">Geography and history questions</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Created: Jan 8, 2024</span>
                      <button 
                        onClick={() => handleEditContent('quiz', 'Social Studies Quiz - Grade 5', 'Geography and history questions')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {viewContentType === 'lesson-plan' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Introduction to Fractions - Grade 3</h4>
                    <p className="text-sm text-gray-600 mb-2">Understanding basic fraction concepts</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Created: Jan 20, 2024</span>
                      <button 
                        onClick={() => handleEditContent('lesson-plan', 'Introduction to Fractions - Grade 3', 'Understanding basic fraction concepts')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Creative Writing - Grade 4</h4>
                    <p className="text-sm text-gray-600 mb-2">Story writing and narrative techniques</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Created: Jan 18, 2024</span>
                      <button 
                        onClick={() => handleEditContent('lesson-plan', 'Creative Writing - Grade 4', 'Story writing and narrative techniques')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Water Cycle - Grade 2</h4>
                    <p className="text-sm text-gray-600 mb-2">Understanding the water cycle process</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Created: Jan 16, 2024</span>
                      <button 
                        onClick={() => handleEditContent('lesson-plan', 'Water Cycle - Grade 2', 'Understanding the water cycle process')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Community Helpers - Grade 1</h4>
                    <p className="text-sm text-gray-600 mb-2">Learning about different community roles</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Created: Jan 14, 2024</span>
                      <button 
                        onClick={() => handleEditContent('lesson-plan', 'Community Helpers - Grade 1', 'Learning about different community roles')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {viewContentType === 'scheme-of-work' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Mathematics Scheme - Grade 3</h4>
                    <p className="text-sm text-gray-600 mb-2">Full year mathematics curriculum plan</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Created: Jan 25, 2024</span>
                      <button 
                        onClick={() => handleEditContent('scheme-of-work', 'Mathematics Scheme - Grade 3', 'Full year mathematics curriculum plan')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">English Scheme - Grade 4</h4>
                    <p className="text-sm text-gray-600 mb-2">Comprehensive English language program</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Created: Jan 22, 2024</span>
                      <button 
                        onClick={() => handleEditContent('scheme-of-work', 'English Scheme - Grade 4', 'Comprehensive English language program')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {viewContentType === 'pedagogic-project' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">STEM Garden Project</h4>
                    <p className="text-sm text-gray-600 mb-2">Hands-on science and math through gardening</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Created: Jan 28, 2024</span>
                      <button 
                        onClick={() => handleEditContent('pedagogic-project', 'STEM Garden Project', 'Hands-on science and math through gardening')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Digital Storytelling</h4>
                    <p className="text-sm text-gray-600 mb-2">Creative writing with technology integration</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Created: Jan 26, 2024</span>
                      <button 
                        onClick={() => handleEditContent('pedagogic-project', 'Digital Storytelling', 'Creative writing with technology integration')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Content Modal */}
      {showEditModal && editingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Edit {editingContent.type === 'quiz' ? 'Quiz' : 
                      editingContent.type === 'lesson-plan' ? 'Lesson Plan' :
                      editingContent.type === 'scheme-of-work' ? 'Scheme of Work' : 'Pedagogic Project'}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  defaultValue={editingContent.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Subject</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="english">English</option>
                  <option value="science">Science</option>
                  <option value="social-studies">Social Studies</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Grade</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  defaultValue={editingContent.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success(`${editingContent.type === 'quiz' ? 'Quiz' : 
                                editingContent.type === 'lesson-plan' ? 'Lesson Plan' :
                                editingContent.type === 'scheme-of-work' ? 'Scheme of Work' : 'Pedagogic Project'} updated successfully!`);
                  setShowEditModal(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* School View Modal */}
      {showSchoolViewModal && selectedSchoolData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">School Details</h2>
              <button
                onClick={() => setShowSchoolViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                  <p className="text-gray-900">{selectedSchoolData.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">System</label>
                  <span className={`px-2 py-1 rounded text-sm ${
                    selectedSchoolData.system === 'anglophone' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedSchoolData.system}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                  <p className="text-gray-900">{selectedSchoolData.adminEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Students</label>
                  <p className="text-gray-900">{selectedSchoolData.totalStudents}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 rounded text-sm ${
                    selectedSchoolData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedSchoolData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                  <p className="text-gray-900">{selectedSchoolData.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSchoolViewModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowSchoolViewModal(false);
                  handleEditSchool(selectedSchoolData);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit School
              </button>
            </div>
          </div>
        </div>
      )}

      {/* School Edit Modal */}
      {showSchoolEditModal && selectedSchoolData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit School</h2>
              <button
                onClick={() => setShowSchoolEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                <input
                  type="text"
                  defaultValue={selectedSchoolData.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">System</label>
                <select 
                  defaultValue={selectedSchoolData.system}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="anglophone">Anglophone</option>
                  <option value="francophone">Francophone</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                <input
                  type="email"
                  defaultValue={selectedSchoolData.adminEmail}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Students</label>
                <input
                  type="number"
                  defaultValue={selectedSchoolData.totalStudents}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  defaultValue={selectedSchoolData.isActive ? 'active' : 'inactive'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSchoolEditModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('School updated successfully!');
                  setShowSchoolEditModal(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SuperAdminDashboard;