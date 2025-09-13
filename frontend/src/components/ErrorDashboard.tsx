import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  RefreshCw, 
  Trash2, 
  Filter, 
  Search, 
  Clock, 
  User,
  Code,
  Shield,
  Server,
  Wifi,
  AlertCircle,
  Info,
  CheckCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useError, ErrorInfo } from '../contexts/ErrorContext';

interface ErrorDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ErrorDashboard: React.FC<ErrorDashboardProps> = ({ isOpen, onClose }) => {
  const {
    errors,
    removeError,
    clearErrors,
    getErrorsByType,
    getErrorsBySeverity,
    retryError
  } = useError();

  const [filter, setFilter] = useState<'all' | ErrorInfo['type'] | ErrorInfo['severity']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set());

  const getErrorIcon = (type: ErrorInfo['type']) => {
    switch (type) {
      case 'network':
        return <Wifi className="w-5 h-5 text-red-500" />;
      case 'validation':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'permission':
        return <Shield className="w-5 h-5 text-orange-500" />;
      case 'server':
        return <Server className="w-5 h-5 text-purple-500" />;
      case 'client':
        return <Code className="w-5 h-5 text-blue-500" />;
      case 'unknown':
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: ErrorInfo['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: ErrorInfo['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <Info className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredErrors = errors.filter(error => {
    // Filter by type/severity
    if (filter !== 'all') {
      if (['network', 'validation', 'permission', 'server', 'client', 'unknown'].includes(filter)) {
        if (error.type !== filter) return false;
      } else if (['low', 'medium', 'high', 'critical'].includes(filter)) {
        if (error.severity !== filter) return false;
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        error.title.toLowerCase().includes(query) ||
        error.message.toLowerCase().includes(query) ||
        error.details?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const toggleExpanded = (errorId: string) => {
    const newExpanded = new Set(expandedErrors);
    if (newExpanded.has(errorId)) {
      newExpanded.delete(errorId);
    } else {
      newExpanded.add(errorId);
    }
    setExpandedErrors(newExpanded);
  };

  const handleRetry = (error: ErrorInfo) => {
    if (error.retryable) {
      retryError(error.id, () => {
        // In a real app, this would retry the specific operation
        console.log('Retrying error:', error.id);
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Error Dashboard</h2>
                <p className="text-sm text-gray-500">
                  {errors.length} error{errors.length !== 1 ? 's' : ''} logged
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Close error dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters and Search */}
          <div className="border-b border-gray-200 p-4">
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search errors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {['network', 'validation', 'permission', 'server', 'client', 'unknown'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type as ErrorInfo['type'])}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    filter === type
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getErrorIcon(type as ErrorInfo['type'])}
                  {type}
                </button>
              ))}
              {['critical', 'high', 'medium', 'low'].map(severity => (
                <button
                  key={severity}
                  onClick={() => setFilter(severity as ErrorInfo['severity'])}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    filter === severity
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getSeverityIcon(severity as ErrorInfo['severity'])}
                  {severity}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={clearErrors}
                className="flex items-center gap-1 rounded-lg px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredErrors.length} of {errors.length} errors
            </div>
          </div>

          {/* Errors List */}
          <div className="flex-1 overflow-y-auto">
            {filteredErrors.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <AlertTriangle className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No errors found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'No errors match your search.' : 'No errors have been logged.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredErrors.map((error) => (
                  <div
                    key={error.id}
                    className={`border-l-4 p-4 hover:bg-gray-50 ${getSeverityColor(error.severity)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getErrorIcon(error.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {error.title}
                              </h4>
                              <div className="flex items-center gap-1">
                                {getSeverityIcon(error.severity)}
                                <span className="text-xs font-medium text-gray-500">
                                  {error.severity}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {error.message}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(error.timestamp)}
                              </div>
                              <div className="flex items-center gap-1">
                                {getErrorIcon(error.type)}
                                {error.type}
                              </div>
                              {error.userId && (
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {error.userId}
                                </div>
                              )}
                            </div>

                            {(error.details || error.context) && (
                              <button
                                onClick={() => toggleExpanded(error.id)}
                                className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500"
                              >
                                {expandedErrors.has(error.id) ? (
                                  <ChevronDown className="w-3 h-3" />
                                ) : (
                                  <ChevronRight className="w-3 h-3" />
                                )}
                                {expandedErrors.has(error.id) ? 'Hide' : 'Show'} Details
                              </button>
                            )}

                            {expandedErrors.has(error.id) && (
                              <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                                {error.details && (
                                  <div className="mb-2">
                                    <h5 className="text-xs font-medium text-gray-700 mb-1">Details:</h5>
                                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                                      {error.details}
                                    </pre>
                                  </div>
                                )}
                                
                                {error.context && (
                                  <div>
                                    <h5 className="text-xs font-medium text-gray-700 mb-1">Context:</h5>
                                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                                      {JSON.stringify(error.context, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 ml-2">
                            {error.retryable && (
                              <button
                                onClick={() => handleRetry(error)}
                                className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                                title="Retry operation"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => removeError(error.id)}
                              className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                              title="Remove error"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDashboard;





