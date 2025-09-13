import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Settings
} from 'lucide-react';
import { useRealtime } from '../contexts/RealtimeContext';

interface RealtimeStatusIndicatorProps {
  showDetails?: boolean;
}

export const RealtimeStatusIndicator: React.FC<RealtimeStatusIndicatorProps> = ({ 
  showDetails = false 
}) => {
  const { isConnected, isOnline, stats, reconnect } = useRealtime();
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500';
    if (!isConnected) return 'text-yellow-500';
    if (stats.systemStatus === 'maintenance') return 'text-yellow-500';
    if (stats.systemStatus === 'offline') return 'text-red-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    if (!isConnected) return <AlertCircle className="w-4 h-4" />;
    if (stats.systemStatus === 'maintenance') return <Clock className="w-4 h-4" />;
    if (stats.systemStatus === 'offline') return <WifiOff className="w-4 h-4" />;
    return <Wifi className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (!isConnected) return 'Disconnected';
    if (stats.systemStatus === 'maintenance') return 'Maintenance';
    if (stats.systemStatus === 'offline') return 'System Offline';
    return 'Connected';
  };

  const getStatusDescription = () => {
    if (!isOnline) return 'No internet connection';
    if (!isConnected) return 'Real-time updates paused';
    if (stats.systemStatus === 'maintenance') return 'System under maintenance';
    if (stats.systemStatus === 'offline') return 'System temporarily unavailable';
    return 'Real-time updates active';
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
          isHovered ? 'bg-gray-100' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`${getStatusColor()}`}>
          {getStatusIcon()}
        </div>
        
        {showDetails && (
          <div className="flex flex-col">
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            <span className="text-xs text-gray-500">
              {getStatusDescription()}
            </span>
          </div>
        )}

        {!showDetails && (
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        )}

        {!isConnected && isOnline && (
          <button
            onClick={reconnect}
            className="ml-2 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            title="Reconnect"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className={`${getStatusColor()}`}>
              {getStatusIcon()}
            </div>
            <span className="font-medium">{getStatusText()}</span>
          </div>
          <p className="text-gray-300 text-xs mb-2">
            {getStatusDescription()}
          </p>
          
          <div className="border-t border-gray-700 pt-2 text-xs text-gray-300">
            <div className="flex justify-between">
              <span>Online Users:</span>
              <span className="text-white">{stats.onlineUsers}</span>
            </div>
            <div className="flex justify-between">
              <span>Notifications:</span>
              <span className="text-white">{stats.unreadNotifications} unread</span>
            </div>
            <div className="flex justify-between">
              <span>System Status:</span>
              <span className={`${
                stats.systemStatus === 'online' ? 'text-green-400' :
                stats.systemStatus === 'maintenance' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {stats.systemStatus}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtimeStatusIndicator;





