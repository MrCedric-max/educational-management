import React, { ComponentType, useEffect } from 'react';
import { useError } from '../contexts/ErrorContext';
import { handleApiError, handleClientError, ErrorType, ErrorSeverity } from '../utils/errorHandler';

interface WithErrorHandlingOptions {
  componentName?: string;
  onError?: (error: any) => void;
  fallback?: React.ComponentType<{ error: any; retry: () => void }>;
}

// Higher-order component for error handling
export function withErrorHandling<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithErrorHandlingOptions = {}
) {
  const WithErrorHandlingComponent = (props: P) => {
    const { addError } = useError();
    const { componentName, onError, fallback: FallbackComponent } = options;

    useEffect(() => {
      // Set up global error handler for this component
      const handleError = (error: any) => {
        const errorInfo = handleClientError(error, componentName);
        addError(errorInfo);
        
        if (onError) {
          onError(error);
        }
      };

      // Add error handler to window for this component
      if (componentName) {
        (window as any)[`${componentName}ErrorHandler`] = handleError;
      }

      return () => {
        if (componentName) {
          delete (window as any)[`${componentName}ErrorHandler`];
        }
      };
    }, [addError, componentName, onError]);

    return <WrappedComponent {...props} />;
  };

  WithErrorHandlingComponent.displayName = `withErrorHandling(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorHandlingComponent;
}

// Hook for API error handling
export const useApiErrorHandler = () => {
  const { addError } = useError();

  const handleApiCall = async (
    apiCall: () => Promise<any>,
    context?: string
  ): Promise<any> => {
    try {
      return await apiCall();
    } catch (error) {
      const errorInfo = handleApiError(error, context);
      addError(errorInfo);
      return null;
    }
  };

  const handleApiCallWithRetry = async (
    apiCall: () => Promise<any>,
    context?: string,
    maxRetries: number = 3
  ): Promise<any> => {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          const errorInfo = handleApiError(error, context);
          addError(errorInfo);
          return null;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    return null;
  };

  return {
    handleApiCall,
    handleApiCallWithRetry
  };
};

// Hook for form validation error handling
export const useValidationErrorHandler = () => {
  const { addError } = useError();

  const handleValidationError = (errors: any, field?: string) => {
    const errorInfo = {
      type: ErrorType.VALIDATION,
      severity: ErrorSeverity.LOW,
      title: 'Validation Error',
      message: field 
        ? `Validation error in ${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
        : `Validation error: ${Array.isArray(errors) ? errors.join(', ') : errors}`,
      retryable: false,
      context: {
        component: 'Form',
        function: 'handleValidationError',
        props: { field, errors }
      }
    };
    
    addError(errorInfo);
  };

  return { handleValidationError };
};

// Hook for permission error handling
export const usePermissionErrorHandler = () => {
  const { addError } = useError();

  const handlePermissionError = (action: string, resource?: string) => {
    const errorInfo = {
      type: ErrorType.PERMISSION,
      severity: ErrorSeverity.HIGH,
      title: 'Permission Denied',
      message: resource 
        ? `You do not have permission to ${action} ${resource}`
        : `You do not have permission to ${action}`,
      retryable: false,
      context: {
        component: 'Permission',
        function: 'handlePermissionError',
        props: { action, resource }
      }
    };
    
    addError(errorInfo);
  };

  return { handlePermissionError };
};

// Error Boundary Fallback Component
export const ErrorFallback: React.FC<{ 
  error: any; 
  retry: () => void; 
  componentName?: string;
}> = ({ error, retry, componentName }) => {
  return (
    <div className="min-h-64 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="text-center">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {componentName ? `${componentName} Error` : 'Something went wrong'}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <div className="flex space-x-3 justify-center">
          <button
            onClick={retry}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};

// Utility function to wrap API calls with error handling
export const withApiErrorHandling = (
  apiFunction: (...args: any[]) => Promise<any>,
  context?: string
) => {
  return async (...args: any[]): Promise<any> => {
    try {
      return await apiFunction(...args);
    } catch (error) {
      const errorInfo = handleApiError(error, context);
      
      // Add error to context if available
      if ((window as any).errorContext) {
        ((window as any).errorContext as any).addError(errorInfo);
      }
      
      return null;
    }
  };
};

// Utility function to wrap async functions with error handling
export const withAsyncErrorHandling = (
  asyncFunction: (...args: any[]) => Promise<any>,
  context?: string
) => {
  return async (...args: any[]): Promise<any> => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      const errorInfo = handleClientError(error as Error, context);
      
      // Add error to context if available
      if ((window as any).errorContext) {
        ((window as any).errorContext as any).addError(errorInfo);
      }
      
      return null;
    }
  };
};