import React, { useState, useEffect } from 'react';
import { TrendingUp, BookOpen, Users, Calendar, BarChart3, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ParentDashboard: React.FC = () => {
  const { user, language } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock data for parent dashboard overview
  const dashboardData = {
    children: [
      { id: '1', name: 'Emma Johnson', class: 'Class 1A', avatar: 'EJ' },
      { id: '2', name: 'Michael Brown', class: 'Class 2B', avatar: 'MB' }
    ],
    recentActivity: [
      { id: 1, type: 'quiz', message: 'Emma completed Math quiz with 85%', time: '2 hours ago' },
      { id: 2, type: 'attendance', message: 'Michael was present today', time: '1 day ago' },
      { id: 3, type: 'assignment', message: 'Emma submitted English essay', time: '2 days ago' }
    ],
    upcomingEvents: [
      { id: 1, title: 'Parent-Teacher Meeting', date: '2024-01-15', time: '10:00 AM' },
      { id: 2, title: 'School Sports Day', date: '2024-01-20', time: '9:00 AM' }
    ],
    quickStats: {
      totalChildren: 2,
      activeQuizzes: 3,
      messagesUnread: 2,
      attendanceRate: 95
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {language === 'fr' ? 'Tableau de Bord Parent' : 'Parent Dashboard'}
                </h1>
                <p className="text-gray-600">
                  {language === 'fr' ? 'Vue d\'ensemble de l\'activité de vos enfants' : 'Overview of your children\'s activity'}
                </p>
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{dashboardData.quickStats.totalChildren}</div>
                <div className="text-sm text-blue-600">
                  {language === 'fr' ? 'Enfants' : 'Children'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-green-600">{dashboardData.quickStats.activeQuizzes}</div>
                <div className="text-sm text-green-600">
                  {language === 'fr' ? 'Quiz Actifs' : 'Active Quizzes'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{dashboardData.quickStats.attendanceRate}%</div>
                <div className="text-sm text-purple-600">
                  {language === 'fr' ? 'Taux de Présence' : 'Attendance Rate'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{dashboardData.quickStats.messagesUnread}</div>
                <div className="text-sm text-orange-600">
                  {language === 'fr' ? 'Messages Non Lus' : 'Unread Messages'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Children Overview */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {language === 'fr' ? 'Vos Enfants' : 'Your Children'}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.children.map((child) => (
                  <div key={child.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {child.avatar}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{child.name}</h4>
                      <p className="text-sm text-gray-500">{child.class}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {language === 'fr' ? 'Actif' : 'Active'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {language === 'fr' ? 'Activité Récente' : 'Recent Activity'}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {language === 'fr' ? 'Événements à Venir' : 'Upcoming Events'}
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                  </div>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;





