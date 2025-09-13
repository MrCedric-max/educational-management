import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  Trash2, 
  Edit, 
  Eye, 
  File, 
  Image, 
  FileText,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { useFileManagement } from '../contexts/FileManagementContext';
import toast from 'react-hot-toast';

interface FileBrowserProps {
  onFileSelect?: (file: any) => void;
  onFileAttach?: (file: any) => void;
  selectedFiles?: string[];
  showAttachButton?: boolean;
  showSelectButton?: boolean;
  className?: string;
}

const FileBrowser: React.FC<FileBrowserProps> = ({
  onFileSelect,
  onFileAttach,
  selectedFiles = [],
  showAttachButton = false,
  showSelectButton = false,
  className = ''
}) => {
  const {
    files,
    isLoading,
    removeFile,
    updateFileMetadata,
    getFilesByCategory,
    searchFiles,
    refreshFiles
  } = useFileManagement();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'template' | 'resource' | 'image' | 'document'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    tags: ''
  });

  const filteredFiles = useMemo(() => {
    let filtered = files;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = getFilesByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = searchFiles(searchQuery);
    }

    // Sort files
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = a.uploadedAt.getTime() - b.uploadedAt.getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [files, selectedCategory, searchQuery, sortBy, sortOrder, getFilesByCategory, searchFiles]);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileText className="h-5 w-5 text-blue-600" />;
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return <FileText className="h-5 w-5 text-orange-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleEditFile = (file: any) => {
    setEditingFile(file.id);
    setEditForm({
      name: file.name,
      description: file.description || '',
      tags: file.tags?.join(', ') || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingFile) return;

    try {
      await updateFileMetadata(editingFile, {
        name: editForm.name,
        description: editForm.description,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });
      setEditingFile(null);
      toast.success('File updated successfully!');
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Failed to update file');
    }
  };

  const handleCancelEdit = () => {
    setEditingFile(null);
    setEditForm({ name: '', description: '', tags: '' });
  };

  const handleDownloadFile = (file: any) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewFile = (file: any) => {
    window.open(file.url, '_blank');
  };

  const handleDeleteFile = async (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      await removeFile(fileId);
    }
  };

  const handleFileSelect = (file: any) => {
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleFileAttach = (file: any) => {
    if (onFileAttach) {
      onFileAttach(file);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with search and filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">File Browser</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              title="Grid view"
              aria-label="Switch to grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              title="List view"
              aria-label="Switch to list view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            title="Filter by category"
            aria-label="Filter files by category"
          >
            <option value="all">All Categories</option>
            <option value="template">Templates</option>
            <option value="resource">Resources</option>
            <option value="image">Images</option>
            <option value="document">Documents</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              setSortBy(sort as any);
              setSortOrder(order as any);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            title="Sort files"
            aria-label="Sort files by criteria"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="size-desc">Largest First</option>
            <option value="size-asc">Smallest First</option>
          </select>
        </div>
      </div>

      {/* Files list */}
      <div className="space-y-2">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No files found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:text-blue-800 mt-2"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
                  selectedFiles.includes(file.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                {editingFile === file.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="File name"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description"
                      rows={2}
                    />
                    <input
                      type="text"
                      value={editForm.tags}
                      onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tags (comma separated)"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{file.name}</h4>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        {file.description && (
                          <p className="text-xs text-gray-600 mt-1">{file.description}</p>
                        )}
                        {file.tags && file.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {file.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {file.uploadedAt.toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {file.uploadedBy}
                        </span>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {file.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewFile(file)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View file"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadFile(file)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Download file"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditFile(file)}
                          className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                          title="Edit file"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete file"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex space-x-2">
                        {showSelectButton && (
                          <button
                            onClick={() => handleFileSelect(file)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                          >
                            Select
                          </button>
                        )}
                        {showAttachButton && (
                          <button
                            onClick={() => handleFileAttach(file)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
                          >
                            Attach
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileBrowser;
