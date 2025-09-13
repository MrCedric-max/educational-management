import React, { useState } from 'react';
import { Upload, Folder, File, Image, FileText, Download, Trash2, Edit, Eye, Search, Filter } from 'lucide-react';
import { useFileManagement } from '../contexts/FileManagementContext';
import { useFeatureManagement } from '../contexts/FeatureManagementContext';
import FileUpload from '../components/FileUpload';
import FileBrowser from '../components/FileBrowser';
import { useAuth } from '../contexts/AuthContext';

const FileManager: React.FC = () => {
  const { user } = useAuth();
  const { files, isLoading } = useFileManagement();
  const { isFeatureEnabled } = useFeatureManagement();
  const [activeTab, setActiveTab] = useState<'upload' | 'browse'>('upload');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'template' | 'resource' | 'image' | 'document'>('all');

  const getFileStats = () => {
    const stats = {
      total: files.length,
      templates: files.filter(f => f.category === 'template').length,
      resources: files.filter(f => f.category === 'resource').length,
      images: files.filter(f => f.category === 'image').length,
      documents: files.filter(f => f.category === 'document').length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0)
    };
    return stats;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = getFileStats();

  // Check if File Manager feature is enabled for the current user
  if (!isFeatureEnabled('File Manager', user?.role || '')) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">File Manager Disabled</h1>
          <p className="text-gray-600 mb-4">The File Manager feature is currently disabled for your role.</p>
          <p className="text-sm text-gray-500">Contact your administrator to enable this feature.</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">File Manager</h1>
            <p className="text-gray-600">Upload, organize, and manage your educational resources</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Files</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Size</p>
              <p className="text-2xl font-bold text-green-600">{formatFileSize(stats.totalSize)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Templates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.templates}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Folder className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resources</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resources}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Image className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Images</p>
              <p className="text-2xl font-bold text-gray-900">{stats.images}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <File className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.documents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Upload className="h-4 w-4 inline mr-2" />
              Upload Files
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'browse'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Folder className="h-4 w-4 inline mr-2" />
              Browse Files
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Upload Templates */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Lesson Templates</h3>
            <FileUpload
              onFileUpload={async (file) => {
                // This will be handled by the FileUpload component
              }}
              onFileRemove={async (fileId) => {
                // This will be handled by the FileUpload component
              }}
              uploadedFiles={[]}
              category="template"
              maxFileSize={10}
              acceptedTypes={['.pdf', '.doc', '.docx', '.txt']}
            />
          </div>

          {/* Upload Resources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Educational Resources</h3>
            <FileUpload
              onFileUpload={async (file) => {
                // This will be handled by the FileUpload component
              }}
              onFileRemove={async (fileId) => {
                // This will be handled by the FileUpload component
              }}
              uploadedFiles={[]}
              category="resource"
              maxFileSize={10}
              acceptedTypes={['image/*', '.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx']}
            />
          </div>

          {/* Upload Images */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Images</h3>
            <FileUpload
              onFileUpload={async (file) => {
                // This will be handled by the FileUpload component
              }}
              onFileRemove={async (fileId) => {
                // This will be handled by the FileUpload component
              }}
              uploadedFiles={[]}
              category="image"
              maxFileSize={5}
              acceptedTypes={['image/*']}
            />
          </div>
        </div>
      )}

      {activeTab === 'browse' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <FileBrowser
            showAttachButton={false}
            showSelectButton={false}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading files...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;
