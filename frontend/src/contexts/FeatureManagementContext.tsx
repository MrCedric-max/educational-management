import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export interface FeaturePermission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  roles: string[];
  category: 'file_management' | 'analytics' | 'content' | 'communication' | 'assessment';
}

interface FeatureManagementContextType {
  features: FeaturePermission[];
  isLoading: boolean;
  updateFeaturePermission: (featureId: string, enabled: boolean, roles: string[]) => Promise<void>;
  isFeatureEnabled: (featureName: string, userRole: string) => boolean;
  getFeaturesByCategory: (category: string) => FeaturePermission[];
  refreshFeatures: () => Promise<void>;
}

const FeatureManagementContext = createContext<FeatureManagementContextType | undefined>(undefined);

interface FeatureManagementProviderProps {
  children: ReactNode;
}

export const FeatureManagementProvider: React.FC<FeatureManagementProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<FeaturePermission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize default features
  useEffect(() => {
    const defaultFeatures: FeaturePermission[] = [
      {
        id: 'file-manager',
        name: 'File Manager',
        description: 'Upload, organize, and manage educational resources and files',
        enabled: true,
        roles: ['super_admin'],
        category: 'file_management'
      },
      {
        id: 'analytics-dashboard',
        name: 'Analytics Dashboard',
        description: 'View detailed analytics and progress reports',
        enabled: true,
        roles: ['super_admin', 'school_admin', 'teacher'],
        category: 'analytics'
      },
      {
        id: 'quiz-tool',
        name: 'Quiz Tool',
        description: 'Create and manage quizzes and assessments',
        enabled: true,
        roles: ['super_admin', 'school_admin', 'teacher'],
        category: 'assessment'
      },
      {
        id: 'lesson-planner',
        name: 'Lesson Planner',
        description: 'Create and manage lesson plans',
        enabled: true,
        roles: ['super_admin', 'school_admin', 'teacher'],
        category: 'content'
      },
      {
        id: 'content-library',
        name: 'Content Library',
        description: 'Access and manage educational content library',
        enabled: true,
        roles: ['super_admin', 'school_admin'],
        category: 'content'
      },
      {
        id: 'bulk-upload',
        name: 'Bulk Upload',
        description: 'Upload multiple files and content at once',
        enabled: true,
        roles: ['super_admin'],
        category: 'file_management'
      },
      {
        id: 'export-center',
        name: 'Export Center',
        description: 'Export reports and data in various formats',
        enabled: true,
        roles: ['super_admin', 'school_admin', 'teacher'],
        category: 'analytics'
      },
      {
        id: 'progress-insights',
        name: 'Progress Insights',
        description: 'View detailed student progress and insights',
        enabled: true,
        roles: ['super_admin', 'school_admin', 'teacher'],
        category: 'analytics'
      }
    ];

    setFeatures(defaultFeatures);
  }, []);

  const updateFeaturePermission = async (featureId: string, enabled: boolean, roles: string[]) => {
    try {
      setIsLoading(true);
      
      // In a real application, this would make an API call to update the feature permissions
      // For now, we'll update the local state
      setFeatures(prev => prev.map(feature => 
        feature.id === featureId 
          ? { ...feature, enabled, roles }
          : feature
      ));
      
      toast.success(`Feature permissions updated successfully!`);
    } catch (error) {
      console.error('Error updating feature permissions:', error);
      toast.error('Failed to update feature permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const isFeatureEnabled = (featureName: string, userRole: string): boolean => {
    const feature = features.find(f => f.name.toLowerCase().replace(/\s+/g, '-') === featureName.toLowerCase().replace(/\s+/g, '-'));
    if (!feature) return false;
    
    return feature.enabled && feature.roles.includes(userRole);
  };

  const getFeaturesByCategory = (category: string): FeaturePermission[] => {
    return features.filter(feature => feature.category === category);
  };

  const refreshFeatures = async () => {
    try {
      setIsLoading(true);
      // In a real application, this would fetch features from the API
      // For now, we'll just simulate a refresh
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error refreshing features:', error);
      toast.error('Failed to refresh features');
    } finally {
      setIsLoading(false);
    }
  };

  const value: FeatureManagementContextType = {
    features,
    isLoading,
    updateFeaturePermission,
    isFeatureEnabled,
    getFeaturesByCategory,
    refreshFeatures,
  };

  return (
    <FeatureManagementContext.Provider value={value}>
      {children}
    </FeatureManagementContext.Provider>
  );
};

export const useFeatureManagement = (): FeatureManagementContextType => {
  const context = useContext(FeatureManagementContext);
  if (context === undefined) {
    throw new Error('useFeatureManagement must be used within a FeatureManagementProvider');
  }
  return context;
};

export default FeatureManagementContext;





