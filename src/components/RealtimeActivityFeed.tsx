import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Users, 
  Clock, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Settings, 
  User,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { useRealtime, RealtimeUpdate } from '../contexts/RealtimeContext';

interface RealtimeActivityFeedProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RealtimeActivityFeed: React.FC<RealtimeActivityFeedProps> = ({ isOpen, onClose }) => {
  const { realtimeUpdates, stats, clearOldUpdates, isConnected } = useRealtime();
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const getActivityIcon = (type: RealtimeUpdate['type']) => {
    switch (type) {
      case 'lesson_plan_updated':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'quiz_updated':
        return <HelpCircle className="w-4 h-4 text-orange-500" />;
      case 'content_updated':
        return <FileText className="w-4 h-4 text-indigo-500" />;
      case 'user_activity':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'system_status':
        return <Settings className="w-4 h-4 text-gray-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: RealtimeUpdate['type']) => {
    switch (type) {
      case 'lesson_plan_updated':
        return 'bg-purple-50 border-purple-200';
      case 'quiz_updated':
        return 'bg-orange-50 border-orange-200';
      case 'content_updated':
        return 'bg-indigo-50 border-indigo-200';
      case 'user_activity':
        return 'bg-blue-50 border-blue-200';
      case 'system_status':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getActivityDescription = (update: RealtimeUpdate) => {
    switch (update.type) {
      case 'lesson_plan_updated':
        return `${update.userName} updated a lesson plan`;
      case 'quiz_updated':
        return `${update.userName} modified a quiz`;
      case 'content_updated':
        return `${update.userName} updated content`;
      case 'user_activity':
        return `${update.userName} performed an action`;
      case 'system_status':
        return 'System status updated';
      default:
        return 'Activity detected';
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh || !isOpen) return;

    const interval = setInterval(() => {
      // In a real app, this would fetch new updates from the server
      console.log('Auto-refreshing activity feed...');
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80">
      <div className="rounded-lg border border-gray-200 bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Live Activity</h3>
            <div className={`h-2 w-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`rounded p-1 text-xs ${
                autoRefresh 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
            >
              <RefreshCw className={`w-3 h-3 ${autoRefresh ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded p-1 text-gray-400 hover:bg-gray-100"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="rounded p-1 text-gray-400 hover:bg-gray-100"
            >
              ×
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {stats.onlineUsers} online
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {realtimeUpdates.length} activities
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              stats.systemStatus === 'online' ? 'bg-green-100 text-green-800' :
              stats.systemStatus === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {stats.systemStatus}
            </div>
          </div>
        </div>

        {/* Activity List */}
        {isExpanded && (
          <div className="max-h-64 overflow-y-auto">
            {realtimeUpdates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Activity className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {realtimeUpdates.slice(0, 10).map((update) => (
                  <div
                    key={update.id}
                    className={`border-l-2 p-3 ${getActivityColor(update.type)}`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        {getActivityIcon(update.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900">
                          {getActivityDescription(update)}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(update.timestamp)}
                        </div>
                        {update.changes.length > 0 && (
                          <div className="mt-1">
                            <p className="text-xs text-gray-600">
                              Changes: {update.changes.join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <button
              onClick={clearOldUpdates}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear old
            </button>
            <div className="text-xs text-gray-400">
              Last updated: {formatTimeAgo(new Date())}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeActivityFeed;





