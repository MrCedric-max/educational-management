import React, { useState } from 'react';
import { 
  Settings, 
  ToggleLeft, 
  ToggleRight, 
  Users, 
  Shield, 
  BookOpen, 
  BarChart3, 
  FileText, 
  Upload,
  Download,
  Target,
  Save,
  RefreshCw
} from 'lucide-react';
import { useFeatureManagement } from '../contexts/FeatureManagementContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const FeatureManagement: React.FC = () => {
  const { user } = useAuth();
  const { 
    features, 
    isLoading, 
    updateFeaturePermission, 
    getFeaturesByCategory,
    refreshFeatures 
  } = useFeatureManagement();
  
  const [editingFeature, setEditingFeature] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const categories = [
    { id: 'file_management', name: 'File Management', icon: FileText, color: 'blue' },
    { id: 'analytics', name: 'Analytics & Reports', icon: BarChart3, color: 'green' },
    { id: 'content', name: 'Content Management', icon: BookOpen, color: 'purple' },
    { id: 'assessment', name: 'Assessment Tools', icon: Target, color: 'orange' },
    { id: 'communication', name: 'Communication', icon: Users, color: 'indigo' }
  ];

  const roles = [
    { id: 'super_admin', name: 'Super Admin', icon: Shield, color: 'red' },
    { id: 'school_admin', name: 'School Admin', icon: Users, color: 'blue' },
    { id: 'teacher', name: 'Teacher', icon: BookOpen, color: 'green' }
  ];

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : Settings;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'gray';
  };

  const handleEditFeature = (feature: any) => {
    setEditingFeature(feature.id);
    setSelectedRoles([...feature.roles]);
  };

  const handleSaveFeature = async (featureId: string) => {
    try {
      await updateFeaturePermission(featureId, true, selectedRoles);
      setEditingFeature(null);
      setSelectedRoles([]);
    } catch (error) {
      console.error('Error saving feature:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingFeature(null);
    setSelectedRoles([]);
  };

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleFeatureToggle = async (featureId: string, enabled: boolean) => {
    const feature = features.find(f => f.id === featureId);
    if (feature) {
      await updateFeaturePermission(featureId, enabled, feature.roles);
    }
  };

  if (user?.role !== 'super_admin') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Only super administrators can access feature management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Feature Management</h1>
            <p className="text-gray-600">Control which features are available to different user roles</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refreshFeatures}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {categories.map((category) => {
          const categoryFeatures = getFeaturesByCategory(category.id);
          if (categoryFeatures.length === 0) return null;

          const CategoryIcon = category.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
            indigo: 'bg-indigo-100 text-indigo-600'
          };

          return (
            <div key={category.id} className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${colorClasses[category.color as keyof typeof colorClasses]}`}>
                    <CategoryIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                    <p className="text-sm text-gray-500">{categoryFeatures.length} features</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {categoryFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleFeatureToggle(feature.id, !feature.enabled)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                feature.enabled ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                              title={feature.enabled ? 'Disable feature' : 'Enable feature'}
                              aria-label={feature.enabled ? 'Disable feature' : 'Enable feature'}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  feature.enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            <span className={`text-sm font-medium ${feature.enabled ? 'text-green-600' : 'text-gray-500'}`}>
                              {feature.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                        
                        {editingFeature === feature.id ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available to Roles:
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {roles.map((role) => (
                                  <button
                                    key={role.id}
                                    onClick={() => handleRoleToggle(role.id)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                      selectedRoles.includes(role.id)
                                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                        : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                                    }`}
                                  >
                                    {role.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSaveFeature(feature.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {feature.roles.map((roleId) => {
                                const role = roles.find(r => r.id === roleId);
                                return role ? (
                                  <span
                                    key={roleId}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {role.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                            <button
                              onClick={() => handleEditFeature(feature)}
                              className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Edit Permissions
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{features.length}</div>
            <div className="text-sm text-gray-600">Total Features</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {features.filter(f => f.enabled).length}
            </div>
            <div className="text-sm text-gray-600">Enabled Features</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {features.filter(f => !f.enabled).length}
            </div>
            <div className="text-sm text-gray-600">Disabled Features</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureManagement;
