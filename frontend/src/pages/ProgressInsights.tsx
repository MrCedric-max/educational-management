import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Target, Clock, AlertTriangle, CheckCircle, Activity, RefreshCw, ArrowLeft, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ProgressData {
  studentId: string;
  studentName: string;
  grade: string;
  className: string;
  overallProgress: number;
  subjectProgress: {
    mathematics: number;
    english: number;
    science: number;
    socialStudies: number;
  };
  attendance: number;
  behaviorScore: number;
  lastUpdated: Date;
  trends: {
    academic: 'up' | 'down' | 'stable';
    attendance: 'up' | 'down' | 'stable';
    behavior: 'up' | 'down' | 'stable';
  };
}

interface ClassInsights {
  className: string;
  grade: string;
  averageProgress: number;
  attendanceRate: number;
  behaviorAverage: number;
  topPerformers: string[];
  needsAttention: string[];
  recentActivity: number;
}

interface SchoolInsights {
  totalStudents: number;
  averageProgress: number;
  attendanceRate: number;
  behaviorAverage: number;
  gradeDistribution: Array<{
    grade: string;
    count: number;
    averageProgress: number;
  }>;
  subjectPerformance: Array<{
    subject: string;
    averageScore: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  alerts: Array<{
    type: 'academic' | 'attendance' | 'behavior';
    message: string;
    severity: 'low' | 'medium' | 'high';
    count: number;
  }>;
}

const ProgressInsights: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'classes' | 'school'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data - in a real app, this would come from an API
  const mockProgressData: ProgressData[] = [
    {
      studentId: 'STU001',
      studentName: 'Alice Johnson',
      grade: '3',
      className: '3A',
      overallProgress: 85,
      subjectProgress: {
        mathematics: 88,
        english: 82,
        science: 90,
        socialStudies: 80
      },
      attendance: 95,
      behaviorScore: 90,
      lastUpdated: new Date(),
      trends: {
        academic: 'up',
        attendance: 'stable',
        behavior: 'up'
      }
    },
    {
      studentId: 'STU002',
      studentName: 'Bob Smith',
      grade: '3',
      className: '3A',
      overallProgress: 78,
      subjectProgress: {
        mathematics: 75,
        english: 80,
        science: 85,
        socialStudies: 72
      },
      attendance: 88,
      behaviorScore: 85,
      lastUpdated: new Date(),
      trends: {
        academic: 'up',
        attendance: 'down',
        behavior: 'stable'
      }
    },
    {
      studentId: 'STU003',
      studentName: 'Carol Davis',
      grade: '3',
      className: '3A',
      overallProgress: 92,
      subjectProgress: {
        mathematics: 95,
        english: 90,
        science: 88,
        socialStudies: 95
      },
      attendance: 98,
      behaviorScore: 95,
      lastUpdated: new Date(),
      trends: {
        academic: 'up',
        attendance: 'stable',
        behavior: 'up'
      }
    }
  ];

  const mockClassInsights: ClassInsights[] = [
    {
      className: '3A',
      grade: '3',
      averageProgress: 85,
      attendanceRate: 94,
      behaviorAverage: 90,
      topPerformers: ['Carol Davis', 'Alice Johnson'],
      needsAttention: ['Bob Smith'],
      recentActivity: 12
    }
  ];

  const mockSchoolInsights: SchoolInsights = {
    totalStudents: 150,
    averageProgress: 82,
    attendanceRate: 92,
    behaviorAverage: 88,
    gradeDistribution: [
      { grade: '1', count: 25, averageProgress: 78 },
      { grade: '2', count: 28, averageProgress: 80 },
      { grade: '3', count: 30, averageProgress: 85 },
      { grade: '4', count: 27, averageProgress: 83 },
      { grade: '5', count: 25, averageProgress: 84 },
      { grade: '6', count: 15, averageProgress: 86 }
    ],
    subjectPerformance: [
      { subject: 'Mathematics', averageScore: 85, trend: 'up' },
      { subject: 'English', averageScore: 82, trend: 'stable' },
      { subject: 'Science', averageScore: 88, trend: 'up' },
      { subject: 'Social Studies', averageScore: 80, trend: 'down' }
    ],
    alerts: [
      { type: 'academic', message: 'Students below 70% in Mathematics', severity: 'medium', count: 8 },
      { type: 'attendance', message: 'Students with attendance below 85%', severity: 'high', count: 12 },
      { type: 'behavior', message: 'Recent behavior incidents', severity: 'low', count: 3 }
    ]
  };

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return '#10B981'; // green
    if (progress >= 80) return '#3B82F6'; // blue
    if (progress >= 70) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  // Chart data preparation
  const studentChartData = mockProgressData.map(student => ({
    name: student.studentName.split(' ')[0],
    progress: student.overallProgress,
    attendance: student.attendance,
    behavior: student.behaviorScore
  }));

  const subjectChartData = Object.keys(mockProgressData[0].subjectProgress).map(subject => {
    const average = mockProgressData.reduce((sum, student) => 
      sum + (student.subjectProgress as any)[subject], 0) / mockProgressData.length;
    return {
      subject: subject.charAt(0).toUpperCase() + subject.slice(1),
      average: Math.round(average)
    };
  });

  const pieData = [
    { name: 'Excellent (90-100%)', value: mockProgressData.filter(s => s.overallProgress >= 90).length, color: '#10B981' },
    { name: 'Good (80-89%)', value: mockProgressData.filter(s => s.overallProgress >= 80 && s.overallProgress < 90).length, color: '#3B82F6' },
    { name: 'Average (70-79%)', value: mockProgressData.filter(s => s.overallProgress >= 70 && s.overallProgress < 80).length, color: '#F59E0B' },
    { name: 'Needs Improvement (<70%)', value: mockProgressData.filter(s => s.overallProgress < 70).length, color: '#EF4444' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Insights Dashboard</h1>
            <p className="text-gray-600">Real-time progress visualization and analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
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
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="inline-block w-4 h-4 mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="inline-block w-4 h-4 mr-2" />
              Students
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'classes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Target className="inline-block w-4 h-4 mr-2" />
              Classes
            </button>
            <button
              onClick={() => setActiveTab('school')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'school'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Activity className="inline-block w-4 h-4 mr-2" />
              School
            </button>
          </nav>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {(['week', 'month', 'semester'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{mockSchoolInsights.averageProgress}%</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+2.5% from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{mockSchoolInsights.attendanceRate}%</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+1.2% from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Behavior Score</p>
                  <p className="text-2xl font-bold text-gray-900">{mockSchoolInsights.behaviorAverage}/100</p>
                  <div className="flex items-center mt-2">
                    <Activity className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-600">Stable</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{mockSchoolInsights.alerts.length}</p>
                  <div className="flex items-center mt-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-yellow-600">3 require attention</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Progress Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Progress Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="progress" fill="#3B82F6" name="Progress %" />
                  <Bar dataKey="attendance" fill="#10B981" name="Attendance %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Subject Performance */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
              <div className="space-y-3">
                {mockSchoolInsights.alerts.map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">{alert.message}</span>
                      </div>
                      <span className="text-sm font-bold">{alert.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Individual Student Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProgressData.map((student) => (
                <div key={student.studentId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{student.studentName}</h4>
                      <p className="text-sm text-gray-600">{student.grade} • {student.className}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: getProgressColor(student.overallProgress) }}>
                        {student.overallProgress}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Mathematics</span>
                      <span>{student.subjectProgress.mathematics}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${student.subjectProgress.mathematics}%`, backgroundColor: getProgressColor(student.subjectProgress.mathematics) }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>English</span>
                      <span>{student.subjectProgress.english}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${student.subjectProgress.english}%`, backgroundColor: getProgressColor(student.subjectProgress.english) }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{student.attendance}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                      <span>{student.behaviorScore}/100</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(student.trends.academic)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Classes Tab */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockClassInsights.map((classInsight) => (
              <div key={classInsight.className} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{classInsight.className}</h3>
                    <p className="text-sm text-gray-600">Grade {classInsight.grade}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{classInsight.averageProgress}%</div>
                    <div className="text-sm text-gray-500">Average Progress</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{classInsight.attendanceRate}%</div>
                    <div className="text-sm text-gray-500">Attendance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">{classInsight.behaviorAverage}/100</div>
                    <div className="text-sm text-gray-500">Behavior</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Top Performers</h4>
                    <div className="flex flex-wrap gap-1">
                      {classInsight.topPerformers.map((performer, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {performer}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Needs Attention</h4>
                    <div className="flex flex-wrap gap-1">
                      {classInsight.needsAttention.map((student, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          {student}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* School Tab */}
      {activeTab === 'school' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockSchoolInsights.gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="averageProgress" fill="#3B82F6" name="Average Progress %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Subject Performance Trends */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance Trends</h3>
              <div className="space-y-3">
                {mockSchoolInsights.subjectPerformance.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{subject.subject}</div>
                      <div className="text-sm text-gray-600">{subject.averageScore}% average</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Trend:</span>
                      {getTrendIcon(subject.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* School-wide Metrics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">School-wide Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{mockSchoolInsights.totalStudents}</div>
                <div className="text-sm text-gray-500">Total Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{mockSchoolInsights.averageProgress}%</div>
                <div className="text-sm text-gray-500">Average Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{mockSchoolInsights.attendanceRate}%</div>
                <div className="text-sm text-gray-500">Attendance Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressInsights;
