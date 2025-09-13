import React, { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface ErrorInfo {
  id: string;
  type: 'network' | 'validation' | 'permission' | 'server' | 'client' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  details?: string;
  timestamp: Date;
  userId?: string;
  actionUrl?: string;
  actionLabel?: string;
  retryable: boolean;
  context?: {
    component?: string;
    function?: string;
    props?: any;
    state?: any;
  };
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorContextType {
  errors: ErrorInfo[];
  addError: (error: Omit<ErrorInfo, 'id' | 'timestamp'>) => void;
  removeError: (errorId: string) => void;
  clearErrors: () => void;
  getErrorsByType: (type: ErrorInfo['type']) => ErrorInfo[];
  getErrorsBySeverity: (severity: ErrorInfo['severity']) => ErrorInfo[];
  retryError: (errorId: string, retryFn: () => void) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addError = (errorData: Omit<ErrorInfo, 'id' | 'timestamp'>) => {
    const error: ErrorInfo = {
      ...errorData,
      id: generateId(),
      timestamp: new Date()
    };

    setErrors(prev => [error, ...prev].slice(0, 100)); // Keep only last 100 errors

    // Show toast notification based on severity
    const toastOptions = {
      duration: error.severity === 'critical' ? 10000 : 
                error.severity === 'high' ? 8000 : 
                error.severity === 'medium' ? 6000 : 4000,
      position: 'top-right' as const,
    };

    switch (error.severity) {
      case 'critical':
        toast.error(error.message, { ...toastOptions, icon: '🚨' });
        break;
      case 'high':
        toast.error(error.message, { ...toastOptions, icon: '⚠️' });
        break;
      case 'medium':
        toast(error.message, { ...toastOptions, icon: '⚠️' });
        break;
      case 'low':
        toast(error.message, toastOptions);
        break;
    }
  };

  const removeError = (errorId: string) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const getErrorsByType = (type: ErrorInfo['type']) => {
    return errors.filter(error => error.type === type);
  };

  const getErrorsBySeverity = (severity: ErrorInfo['severity']) => {
    return errors.filter(error => error.severity === severity);
  };

  const retryError = (errorId: string, retryFn: () => void) => {
    const error = errors.find(e => e.id === errorId);
    if (error && error.retryable) {
      try {
        retryFn();
        removeError(errorId);
        toast.success('Operation retried successfully');
      } catch (err) {
        toast.error('Retry failed');
      }
    }
  };

  const value: ErrorContextType = {
    errors,
    addError,
    removeError,
    clearErrors,
    getErrorsByType,
    getErrorsBySeverity,
    retryError
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

// Error Boundary Component
export class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to context if available
    if ((window as any).errorContext) {
      ((window as any).errorContext as any).addError({
        type: 'client',
        severity: 'high',
        title: 'React Error Boundary Caught Error',
        message: error.message,
        details: errorInfo.componentStack,
        retryable: true,
        context: {
          component: errorInfo.componentStack?.split('\n')[1]?.trim(),
          function: 'componentDidCatch'
        }
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Something went wrong</h3>
                <p className="text-sm text-gray-500">An unexpected error occurred</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {this.state.error?.message || 'An unknown error occurred'}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Reload Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400"
              >
                Try Again
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
