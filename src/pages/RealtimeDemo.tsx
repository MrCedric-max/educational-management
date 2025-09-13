import React, { useState } from 'react';
import { 
  Bell, 
  Activity, 
  Wifi, 
  WifiOff, 
  Play, 
  Pause, 
  RefreshCw,
  Plus
} from 'lucide-react';
import { useRealtime } from '../contexts/RealtimeContext';

const RealtimeDemo: React.FC = () => {
  const { 
    addNotification, 
    addRealtimeUpdate, 
    stats, 
    isConnected, 
    isOnline,
    connect,
    disconnect,
    reconnect
  } = useRealtime();

  const [isGenerating, setIsGenerating] = useState(false);

  const generateSampleNotification = () => {
    const types = ['success', 'error', 'warning', 'info', 'lesson_plan', 'quiz', 'content', 'system'] as const;
    const categories = ['lesson', 'quiz', 'content', 'system', 'collaboration', 'reminder'] as const;
    const priorities = ['low', 'medium', 'high', 'urgent'] as const;
    
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];

    addNotification({
      type,
      title: `Sample ${type.replace('_', ' ')} notification`,
      message: `This is a sample ${type} notification with ${priority} priority`,
      priority,
      category,
      actionUrl: '#',
      actionLabel: 'View Details'
    });
  };

  const generateSampleUpdate = () => {
    const updateTypes = ['lesson_plan_updated', 'quiz_updated', 'content_updated', 'user_activity', 'system_status'] as const;
    const changes = [
      'Updated content',
      'Modified settings',
      'Added new item',
      'Deleted old data',
      'Changed permissions'
    ];

    const type = updateTypes[Math.floor(Math.random() * updateTypes.length)];
    const changeCount = Math.floor(Math.random() * 3) + 1;
    const selectedChanges = changes
      .sort(() => 0.5 - Math.random())
      .slice(0, changeCount);

    addRealtimeUpdate({
      type,
      entityId: `entity-${Math.random().toString(36).substr(2, 9)}`,
      entityType: type.split('_')[0],
      changes: selectedChanges,
      userId: 'demo-user',
      userName: 'Demo User',
      schoolId: 'demo-school'
    });
  };

  const startAutoGeneration = () => {
    setIsGenerating(true);
    const interval = setInterval(() => {
      if (Math.random() < 0.7) {
        generateSampleNotification();
      }
      if (Math.random() < 0.5) {
        generateSampleUpdate();
      }
    }, 3000);

    // Store interval ID for cleanup
    (window as any).demoInterval = interval;
  };

  const stopAutoGeneration = () => {
    setIsGenerating(false);
    if ((window as any).demoInterval) {
      clearInterval((window as any).demoInterval);
      (window as any).demoInterval = null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Real-time Features Demo
          </h1>
          <p className="text-gray-600">
            Test and demonstrate the real-time notification and activity features
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isOnline ? 'bg-green-100' : 'bg-red-100'}`}>
                {isOnline ? <Wifi className="w-6 h-6 text-green-600" /> : <WifiOff className="w-6 h-6 text-red-600" />}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Connection</p>
                <p className={`text-lg font-semibold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isConnected ? 'bg-green-100' : 'bg-yellow-100'}`}>
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Real-time</p>
                <p className={`text-lg font-semibold ${isConnected ? 'text-green-600' : 'text-yellow-600'}`}>
                  {isConnected ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Notifications</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalNotifications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Activities</p>
                <p className="text-lg font-semibold text-gray-900">{stats.recentActivity.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Demo Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Connection Controls */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Connection</h3>
              <div className="space-y-3">
                <button
                  onClick={connect}
                  disabled={isConnected}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wifi className="w-4 h-4" />
                  Connect
                </button>
                <button
                  onClick={disconnect}
                  disabled={!isConnected}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <WifiOff className="w-4 h-4" />
                  Disconnect
                </button>
                <button
                  onClick={reconnect}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reconnect
                </button>
              </div>
            </div>

            {/* Notification Controls */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Generate Content</h3>
              <div className="space-y-3">
                <button
                  onClick={generateSampleNotification}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Notification
                </button>
                <button
                  onClick={generateSampleUpdate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Activity className="w-4 h-4" />
                  Add Activity
                </button>
                <button
                  onClick={isGenerating ? stopAutoGeneration : startAutoGeneration}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                    isGenerating 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isGenerating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isGenerating ? 'Stop Auto-Generation' : 'Start Auto-Generation'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalNotifications}</div>
              <div className="text-sm text-gray-500">Total Notifications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.unreadNotifications}</div>
              <div className="text-sm text-gray-500">Unread Notifications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.onlineUsers}</div>
              <div className="text-sm text-gray-500">Online Users</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">System Status</h3>
                <p className="text-sm text-gray-500">Current system operational status</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                stats.systemStatus === 'online' ? 'bg-green-100 text-green-800' :
                stats.systemStatus === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {stats.systemStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeDemo;

