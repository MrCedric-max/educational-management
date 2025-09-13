import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Square,
  Trash2,
  Edit,
  Copy,
  Download,
  Upload,
  Archive,
  Tag,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BookOpen,
  HelpCircle,
  FileText,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface BulkOperation {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  action: (selectedItems: string[]) => void;
  requiresConfirmation: boolean;
  confirmationMessage: string;
}

interface BulkItem {
  id: string;
  type: 'lesson' | 'quiz' | 'content' | 'file';
  title: string;
  description: string;
  author: string;
  createdAt: string;
  status: 'active' | 'archived' | 'draft';
  tags: string[];
  size?: string;
  lastModified: string;
}

const BulkOperationsManager: React.FC = () => {
  const { user } = useAuth();
  // Note: Using mock data instead of ContentLibrary context for now
  // const { contentItems, updateContentItem, deleteContentItem } = useContentLibrary();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<BulkOperation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data - in a real app, this would come from APIs
  const mockItems: BulkItem[] = useMemo(() => [
    {
      id: '1',
      type: 'lesson',
      title: 'Introduction to Mathematics',
      description: 'Basic mathematical concepts for beginners',
      author: 'John Doe',
      createdAt: '2024-01-15',
      status: 'active',
      tags: ['mathematics', 'beginner', 'core'],
      lastModified: '2024-01-20'
    },
    {
      id: '2',
      type: 'quiz',
      title: 'Math Quiz - Chapter 1',
      description: 'Assessment for basic math concepts',
      author: 'Jane Smith',
      createdAt: '2024-01-16',
      status: 'active',
      tags: ['mathematics', 'assessment', 'quiz'],
      lastModified: '2024-01-18'
    },
    {
      id: '3',
      type: 'content',
      title: 'Science Lab Manual',
      description: 'Laboratory procedures and safety guidelines',
      author: 'Dr. Brown',
      createdAt: '2024-01-10',
      status: 'draft',
      tags: ['science', 'laboratory', 'safety'],
      size: '2.5 MB',
      lastModified: '2024-01-22'
    },
    {
      id: '4',
      type: 'file',
      title: 'Student Roster Template',
      description: 'Excel template for managing student information',
      author: 'Admin',
      createdAt: '2024-01-05',
      status: 'archived',
      tags: ['template', 'excel', 'students'],
      size: '150 KB',
      lastModified: '2024-01-12'
    },
    {
      id: '5',
      type: 'lesson',
      title: 'English Grammar Basics',
      description: 'Fundamental grammar rules and exercises',
      author: 'Sarah Wilson',
      createdAt: '2024-01-18',
      status: 'active',
      tags: ['english', 'grammar', 'language'],
      lastModified: '2024-01-21'
    }
  ], []);

  const bulkOperations: BulkOperation[] = [
    {
      id: 'delete',
      name: 'Delete Selected',
      description: 'Permanently delete selected items',
      icon: Trash2,
      color: 'red',
      action: handleDelete,
      requiresConfirmation: true,
      confirmationMessage: 'Are you sure you want to permanently delete the selected items? This action cannot be undone.'
    },
    {
      id: 'archive',
      name: 'Archive Selected',
      description: 'Move selected items to archive',
      icon: Archive,
      color: 'yellow',
      action: handleArchive,
      requiresConfirmation: false,
      confirmationMessage: ''
    },
    {
      id: 'unarchive',
      name: 'Unarchive Selected',
      description: 'Restore selected items from archive',
      icon: Archive,
      color: 'green',
      action: handleUnarchive,
      requiresConfirmation: false,
      confirmationMessage: ''
    },
    {
      id: 'duplicate',
      name: 'Duplicate Selected',
      description: 'Create copies of selected items',
      icon: Copy,
      color: 'blue',
      action: handleDuplicate,
      requiresConfirmation: false,
      confirmationMessage: ''
    },
    {
      id: 'export',
      name: 'Export Selected',
      description: 'Download selected items as files',
      icon: Download,
      color: 'purple',
      action: handleExport,
      requiresConfirmation: false,
      confirmationMessage: ''
    },
    {
      id: 'tag',
      name: 'Add Tags',
      description: 'Add tags to selected items',
      icon: Tag,
      color: 'indigo',
      action: handleAddTags,
      requiresConfirmation: false,
      confirmationMessage: ''
    }
  ];

  function handleDelete(selectedIds: string[]) {
    console.log('Deleting items:', selectedIds);
    toast.success(`Deleted ${selectedIds.length} items successfully`);
    setSelectedItems(new Set());
  }

  function handleArchive(selectedIds: string[]) {
    console.log('Archiving items:', selectedIds);
    toast.success(`Archived ${selectedIds.length} items successfully`);
    setSelectedItems(new Set());
  }

  function handleUnarchive(selectedIds: string[]) {
    console.log('Unarchiving items:', selectedIds);
    toast.success(`Unarchived ${selectedIds.length} items successfully`);
    setSelectedItems(new Set());
  }

  function handleDuplicate(selectedIds: string[]) {
    console.log('Duplicating items:', selectedIds);
    toast.success(`Duplicated ${selectedIds.length} items successfully`);
    setSelectedItems(new Set());
  }

  function handleExport(selectedIds: string[]) {
    console.log('Exporting items:', selectedIds);
    toast.success(`Exporting ${selectedIds.length} items...`);
    setSelectedItems(new Set());
  }

  function handleAddTags(selectedIds: string[]) {
    console.log('Adding tags to items:', selectedIds);
    toast.success(`Added tags to ${selectedIds.length} items successfully`);
    setSelectedItems(new Set());
  }

  const filteredItems = useMemo(() => {
    return mockItems.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [mockItems, searchQuery, filterType, filterStatus]);

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkOperation = (operation: BulkOperation) => {
    if (selectedItems.size === 0) {
      toast.error('Please select items to perform this operation');
      return;
    }

    if (operation.requiresConfirmation) {
      setPendingOperation(operation);
      setShowConfirmDialog(true);
    } else {
      executeOperation(operation);
    }
  };

  const executeOperation = (operation: BulkOperation) => {
    setIsProcessing(true);
    setTimeout(() => {
      operation.action(Array.from(selectedItems));
      setIsProcessing(false);
    }, 1000);
  };

  const confirmOperation = () => {
    if (pendingOperation) {
      executeOperation(pendingOperation);
    }
    setShowConfirmDialog(false);
    setPendingOperation(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return BookOpen;
      case 'quiz': return HelpCircle;
      case 'content': return FileText;
      case 'file': return FileText;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'archived': return 'text-yellow-600 bg-yellow-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'text-purple-600 bg-purple-100';
      case 'quiz': return 'text-orange-600 bg-orange-100';
      case 'content': return 'text-blue-600 bg-blue-100';
      case 'file': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bulk Operations Manager
          </h1>
          <p className="text-gray-600">
            Efficiently manage multiple items with bulk operations
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="Filter by content type"
            >
              <option value="all">All Types</option>
              <option value="lesson">Lessons</option>
              <option value="quiz">Quizzes</option>
              <option value="content">Content</option>
              <option value="file">Files</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="draft">Draft</option>
            </select>
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              {filteredItems.length} items found
            </div>
          </div>
        </div>

        {/* Bulk Operations Bar */}
        {selectedItems.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">
                  {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {bulkOperations.map((operation) => {
                  const Icon = operation.icon;
                  return (
                    <button
                      key={operation.id}
                      onClick={() => handleBulkOperation(operation)}
                      disabled={isProcessing}
                      className={`flex items-center px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                        operation.color === 'red' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                        operation.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                        operation.color === 'green' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                        operation.color === 'blue' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                        operation.color === 'purple' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' :
                        'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {operation.name}
                    </button>
                  );
                })}
                <button
                  onClick={() => setSelectedItems(new Set())}
                  className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <button
                onClick={handleSelectAll}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {selectedItems.size === filteredItems.length && filteredItems.length > 0 ? (
                  <CheckSquare className="w-4 h-4 mr-2 text-blue-600" />
                ) : (
                  <Square className="w-4 h-4 mr-2 text-gray-400" />
                )}
                Select All
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredItems.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              const isSelected = selectedItems.has(item.id);
              
              return (
                <div
                  key={item.id}
                  className={`px-6 py-4 hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center">
                    <button
                      onClick={() => handleSelectItem(item.id)}
                      className="mr-4"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    <div className="flex-shrink-0 mr-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                            {item.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Users className="w-3 h-3 mr-1" />
                        <span className="mr-4">{item.author}</span>
                        <Clock className="w-3 h-3 mr-1" />
                        <span className="mr-4">Modified: {item.lastModified}</span>
                        {item.size && (
                          <>
                            <Settings className="w-3 h-3 mr-1" />
                            <span>{item.size}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center mt-2">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full mr-2"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search criteria' : 'No items match your current filters'}
              </p>
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && pendingOperation && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowConfirmDialog(false)} />
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Confirm Operation
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {pendingOperation.confirmationMessage}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          This will affect {selectedItems.size} selected item{selectedItems.size !== 1 ? 's' : ''}.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={confirmOperation}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkOperationsManager;
