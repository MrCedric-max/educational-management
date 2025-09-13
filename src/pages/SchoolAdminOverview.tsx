import React, { useState, useEffect } from 'react';
import { Users, School, BookOpen, GraduationCap, Download, Settings, TrendingUp, Calendar, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Types and Interfaces for School Admin Overview
interface SchoolSettings {
  id: string;
  name: string;
  system: string;
  adminEmail: string;
}

const SchoolAdminOverview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);


  const schoolSettings: SchoolSettings = {
    id: 'school1',
    name: 'Sample School',
    system: 'anglophone',
    adminEmail: 'admin@school.com'
  };

  // Mock analytics data - High-level school overview
  const mockAnalytics = {
    schoolPerformance: {
      totalStudents: 150,
      totalTeachers: 8,
      totalClasses: 6,
      averageAttendance: 95.5,
      completionRate: 88.2
    },
    schoolHealth: {
      systemStatus: 'Healthy',
      lastBackup: '2 hours ago',
      storageUsed: '65%',
      activeConnections: 45
    },
    recentActivity: [
      { id: 1, type: 'user_added', message: 'New student added to Class 1', timestamp: new Date() },
      { id: 2, type: 'class_created', message: 'New class created: Class 3', timestamp: new Date() },
      { id: 3, type: 'report_generated', message: 'Monthly report generated', timestamp: new Date() }
    ],
    upcomingEvents: [
      { id: 1, title: 'Parent-Teacher Meeting', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      { id: 2, title: 'End of Term Exams', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <School className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">School Admin Dashboard</h1>
                <p className="text-gray-600">Manage users, classes, and school settings</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {currentDateTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  {currentDateTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.fullName?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.schoolPerformance.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.schoolPerformance.totalTeachers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.schoolPerformance.totalClasses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.schoolPerformance.averageAttendance}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* School Health Status */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">School System Health</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <div className="h-6 w-6 bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">System Status</p>
                  <p className="text-lg font-bold text-green-600">{mockAnalytics.schoolHealth.systemStatus}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Last Backup</p>
                  <p className="text-lg font-bold text-blue-600">{mockAnalytics.schoolHealth.lastBackup}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <div className="h-6 w-6 bg-yellow-500 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Storage Used</p>
                  <p className="text-lg font-bold text-yellow-600">{mockAnalytics.schoolHealth.storageUsed}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-lg font-bold text-purple-600">{mockAnalytics.schoolHealth.activeConnections}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/student-roster')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserPlus className="h-6 w-6 text-blue-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Add User</div>
                  <div className="text-sm text-gray-600">Add new student or teacher</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/classes')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <GraduationCap className="h-6 w-6 text-green-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Manage Classes</div>
                  <div className="text-sm text-gray-600">Create or edit classes</div>
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

              <button
                onClick={() => setShowSettingsModal(true)}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-6 w-6 text-gray-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium">School Settings</div>
                  <div className="text-sm text-gray-600">Configure school options</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockAnalytics.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockAnalytics.upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {event.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Data</h3>
            <div className="space-y-4">
              <button
                onClick={() => {
                  toast.success('Exporting users data...');
                  setShowExportModal(false);
                }}
                className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Export Users
              </button>
              <button
                onClick={() => {
                  toast.success('Exporting reports data...');
                  setShowExportModal(false);
                }}
                className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Export Reports
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">School Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">School Name</label>
                <input
                  type="text"
                  value={schoolSettings.name}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  readOnly
                  title="School name (read-only)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">System</label>
                <input
                  type="text"
                  value={schoolSettings.system}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  readOnly
                  title="School system (read-only)"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolAdminOverview;
