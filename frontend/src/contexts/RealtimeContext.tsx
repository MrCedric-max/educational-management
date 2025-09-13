import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'lesson_plan' | 'quiz' | 'content' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'lesson' | 'quiz' | 'content' | 'system' | 'collaboration' | 'reminder';
  userId?: string;
  schoolId?: string;
  metadata?: {
    lessonPlanId?: string;
    quizId?: string;
    contentId?: string;
    authorId?: string;
    authorName?: string;
  };
}

export interface RealtimeUpdate {
  id: string;
  type: 'lesson_plan_updated' | 'quiz_updated' | 'content_updated' | 'user_activity' | 'system_status';
  entityId: string;
  entityType: string;
  changes: string[];
  timestamp: Date;
  userId: string;
  userName: string;
  schoolId?: string;
}

export interface RealtimeStats {
  totalNotifications: number;
  unreadNotifications: number;
  onlineUsers: number;
  recentActivity: RealtimeUpdate[];
  systemStatus: 'online' | 'maintenance' | 'offline';
}

interface RealtimeContextType {
  notifications: Notification[];
  realtimeUpdates: RealtimeUpdate[];
  stats: RealtimeStats;
  isConnected: boolean;
  isOnline: boolean;
  
  // Notification methods
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  
  // Real-time update methods
  addRealtimeUpdate: (update: Omit<RealtimeUpdate, 'id' | 'timestamp'>) => void;
  clearOldUpdates: () => void;
  
  // Connection methods
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  
  // Utility methods
  getNotificationsByCategory: (category: Notification['category']) => Notification[];
  getUnreadCount: () => number;
  getNotificationsByPriority: (priority: Notification['priority']) => Notification[];
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

interface RealtimeProviderProps {
  children: ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const { user, school } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [realtimeUpdates, setRealtimeUpdates] = useState<RealtimeUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Initialize stats
  const [stats, setStats] = useState<RealtimeStats>({
    totalNotifications: 0,
    unreadNotifications: 0,
    onlineUsers: 1,
    recentActivity: [],
    systemStatus: 'online'
  });

  // Generate unique ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add notification
  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...notificationData,
      id: generateId(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => {
      const newNotifications = [notification, ...prev].slice(0, 100); // Keep only last 100
      return newNotifications;
    });

    // Show toast notification
    const toastOptions = {
      duration: notification.priority === 'urgent' ? 8000 : 4000,
      position: 'top-right' as const,
    };

    switch (notification.type) {
      case 'success':
        toast.success(notification.message, toastOptions);
        break;
      case 'error':
        toast.error(notification.message, toastOptions);
        break;
      case 'warning':
        toast(notification.message, { ...toastOptions, icon: '⚠️' });
        break;
      case 'lesson_plan':
        toast(notification.message, { ...toastOptions, icon: '📚' });
        break;
      case 'quiz':
        toast(notification.message, { ...toastOptions, icon: '📝' });
        break;
      case 'content':
        toast(notification.message, { ...toastOptions, icon: '📄' });
        break;
      case 'system':
        toast(notification.message, { ...toastOptions, icon: '🔧' });
        break;
      default:
        toast(notification.message, toastOptions);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Remove notification
  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Add real-time update
  const addRealtimeUpdate = (updateData: Omit<RealtimeUpdate, 'id' | 'timestamp'>) => {
    const update: RealtimeUpdate = {
      ...updateData,
      id: generateId(),
      timestamp: new Date()
    };

    setRealtimeUpdates(prev => {
      const newUpdates = [update, ...prev].slice(0, 50); // Keep only last 50
      return newUpdates;
    });

    // Update stats
    setStats(prev => ({
      ...prev,
      recentActivity: [update, ...prev.recentActivity.slice(0, 9)] // Keep last 10
    }));
  };

  // Clear old updates
  const clearOldUpdates = () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    setRealtimeUpdates(prev =>
      prev.filter(update => update.timestamp > oneHourAgo)
    );
  };

  // Connection methods (simulated for now)
  const connect = () => {
    setIsConnected(true);
    addNotification({
      type: 'success',
      title: 'Connected',
      message: 'Real-time updates are now active',
      priority: 'low',
      category: 'system'
    });
  };

  const disconnect = () => {
    setIsConnected(false);
    addNotification({
      type: 'warning',
      title: 'Disconnected',
      message: 'Real-time updates are paused',
      priority: 'medium',
      category: 'system'
    });
  };

  const reconnect = () => {
    disconnect();
    setTimeout(() => {
      connect();
    }, 1000);
  };

  // Utility methods
  const getNotificationsByCategory = (category: Notification['category']) => {
    return notifications.filter(n => n.category === category);
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getNotificationsByPriority = (priority: Notification['priority']) => {
    return notifications.filter(n => n.priority === priority);
  };

  // Update stats when notifications change
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      totalNotifications: notifications.length,
      unreadNotifications: getUnreadCount()
    }));
  }, [notifications]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addNotification({
        type: 'success',
        title: 'Back Online',
        message: 'Your connection has been restored',
        priority: 'medium',
        category: 'system'
      });
      if (isConnected) {
        reconnect();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      addNotification({
        type: 'warning',
        title: 'Connection Lost',
        message: 'You are currently offline. Some features may be limited.',
        priority: 'high',
        category: 'system'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isConnected]);

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (user && !isConnected) {
      connect();
    }
  }, [user, isConnected]);

  // Simulate real-time updates (in a real app, this would be WebSocket)
  useEffect(() => {
    if (!isConnected || !user) return;

    const interval = setInterval(() => {
      // Simulate random updates
      const updateTypes = ['lesson_plan_updated', 'quiz_updated', 'content_updated', 'user_activity'];
      const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
      
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        addRealtimeUpdate({
          type: randomType as any,
          entityId: `entity-${Math.random().toString(36).substr(2, 9)}`,
          entityType: randomType.split('_')[0],
          changes: ['Updated content', 'Modified settings'],
          userId: user.id,
          userName: user.fullName || 'User',
          schoolId: school?.id
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isConnected, user, school]);

  // Clean up old updates periodically
  useEffect(() => {
    const interval = setInterval(clearOldUpdates, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const value: RealtimeContextType = {
    notifications,
    realtimeUpdates,
    stats,
    isConnected,
    isOnline,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    addRealtimeUpdate,
    clearOldUpdates,
    connect,
    disconnect,
    reconnect,
    getNotificationsByCategory,
    getUnreadCount,
    getNotificationsByPriority
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};





