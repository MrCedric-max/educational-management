import { useError } from '../contexts/ErrorContext';

// Error types for better categorization
export enum ErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// API Error Handler
export const handleApiError = (error: any, context?: string) => {
  let errorType: ErrorType = ErrorType.UNKNOWN;
  let severity: ErrorSeverity = ErrorSeverity.MEDIUM;
  let title = 'API Error';
  let message = 'An error occurred while communicating with the server';
  let retryable = false;

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    
    switch (status) {
      case 400:
        errorType = ErrorType.VALIDATION;
        severity = ErrorSeverity.LOW;
        title = 'Validation Error';
        message = error.response.data?.message || 'Invalid request data';
        break;
      case 401:
        errorType = ErrorType.PERMISSION;
        severity = ErrorSeverity.HIGH;
        title = 'Authentication Required';
        message = 'Please log in to continue';
        break;
      case 403:
        errorType = ErrorType.PERMISSION;
        severity = ErrorSeverity.HIGH;
        title = 'Access Denied';
        message = 'You do not have permission to perform this action';
        break;
      case 404:
        errorType = ErrorType.CLIENT;
        severity = ErrorSeverity.LOW;
        title = 'Not Found';
        message = 'The requested resource was not found';
        break;
      case 422:
        errorType = ErrorType.VALIDATION;
        severity = ErrorSeverity.MEDIUM;
        title = 'Validation Error';
        message = error.response.data?.message || 'Invalid data provided';
        break;
      case 429:
        errorType = ErrorType.SERVER;
        severity = ErrorSeverity.MEDIUM;
        title = 'Rate Limited';
        message = 'Too many requests. Please try again later';
        retryable = true;
        break;
      case 500:
        errorType = ErrorType.SERVER;
        severity = ErrorSeverity.HIGH;
        title = 'Server Error';
        message = 'An internal server error occurred';
        retryable = true;
        break;
      case 502:
      case 503:
      case 504:
        errorType = ErrorType.SERVER;
        severity = ErrorSeverity.HIGH;
        title = 'Service Unavailable';
        message = 'The service is temporarily unavailable';
        retryable = true;
        break;
      default:
        errorType = ErrorType.SERVER;
        severity = ErrorSeverity.MEDIUM;
        title = `HTTP ${status} Error`;
        message = error.response.data?.message || `Server returned error ${status}`;
    }
  } else if (error.request) {
    // Network error
    errorType = ErrorType.NETWORK;
    severity = ErrorSeverity.HIGH;
    title = 'Network Error';
    message = 'Unable to connect to the server. Please check your internet connection';
    retryable = true;
  } else {
    // Other error
    errorType = ErrorType.CLIENT;
    severity = ErrorSeverity.MEDIUM;
    title = 'Request Error';
    message = error.message || 'An unexpected error occurred';
  }

  return {
    type: errorType,
    severity,
    title,
    message,
    retryable,
    details: error.stack,
    context: {
      component: context,
      function: 'handleApiError',
      props: { status: error.response?.status, url: error.config?.url }
    }
  };
};

// Validation Error Handler
export const handleValidationError = (errors: any, field?: string) => {
  const errorMessages = Array.isArray(errors) ? errors : [errors];
  const message = field 
    ? `Validation error in ${field}: ${errorMessages.join(', ')}`
    : `Validation error: ${errorMessages.join(', ')}`;

  return {
    type: ErrorType.VALIDATION,
    severity: ErrorSeverity.LOW,
    title: 'Validation Error',
    message,
    retryable: false,
    context: {
      component: 'Validation',
      function: 'handleValidationError',
      props: { field, errors }
    }
  };
};

// Permission Error Handler
export const handlePermissionError = (action: string, resource?: string) => {
  const message = resource 
    ? `You do not have permission to ${action} ${resource}`
    : `You do not have permission to ${action}`;

  return {
    type: ErrorType.PERMISSION,
    severity: ErrorSeverity.HIGH,
    title: 'Permission Denied',
    message,
    retryable: false,
    context: {
      component: 'Permission',
      function: 'handlePermissionError',
      props: { action, resource }
    }
  };
};

// Network Error Handler
export const handleNetworkError = (error: any) => {
  let message = 'Network connection failed';
  
  if (error.code === 'NETWORK_ERROR') {
    message = 'Unable to connect to the server';
  } else if (error.code === 'TIMEOUT') {
    message = 'Request timed out. Please try again';
  } else if (error.message) {
    message = error.message;
  }

  return {
    type: ErrorType.NETWORK,
    severity: ErrorSeverity.HIGH,
    title: 'Network Error',
    message,
    retryable: true,
    details: error.stack,
    context: {
      component: 'Network',
      function: 'handleNetworkError',
      props: { code: error.code, timeout: error.timeout }
    }
  };
};

// Client Error Handler
export const handleClientError = (error: Error, component?: string, functionName?: string) => {
  return {
    type: ErrorType.CLIENT,
    severity: ErrorSeverity.MEDIUM,
    title: 'Client Error',
    message: error.message,
    retryable: false,
    details: error.stack,
    context: {
      component,
      function: functionName,
      props: { name: error.name }
    }
  };
};

// Generic Error Handler
export const handleGenericError = (error: any, context?: string) => {
  const message = error?.message || error?.toString() || 'An unknown error occurred';
  
  return {
    type: ErrorType.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    title: 'Unexpected Error',
    message,
    retryable: false,
    details: error?.stack,
    context: {
      component: context,
      function: 'handleGenericError',
      props: { errorType: typeof error }
    }
  };
};

// Error Boundary Helper
export const createErrorBoundaryFallback = (error: Error, errorInfo: React.ErrorInfo) => {
  return {
    type: ErrorType.CLIENT,
    severity: ErrorSeverity.HIGH,
    title: 'React Component Error',
    message: error.message,
    details: errorInfo.componentStack,
    retryable: true,
    context: {
      component: errorInfo.componentStack?.split('\n')[1]?.trim(),
      function: 'componentDidCatch',
      props: { errorBoundary: true }
    }
  };
};

// Retry Logic
export const createRetryFunction = (fn: (...args: any[]) => Promise<any>, maxRetries: number = 3, delay: number = 1000) => {
  return async (...args: any[]) => {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError;
  };
};

// Error Reporting (for future integration with external services)
export const reportError = (error: any, context?: any) => {
  // In a real app, this would send errors to a service like Sentry, LogRocket, etc.
  console.error('Error reported:', error, context);
  
  // For now, just log to console
  if (process.env.NODE_ENV === 'development') {
    console.group('🚨 Error Report');
    console.error('Error:', error);
    console.error('Context:', context);
    console.error('Stack:', error?.stack);
    console.groupEnd();
  }
};

// Error Recovery Strategies
export const ErrorRecoveryStrategies = {
  // Retry with exponential backoff
  retryWithBackoff: (fn: () => Promise<any>, maxRetries: number = 3) => {
    return createRetryFunction(fn, maxRetries, 1000);
  },
  
  // Fallback to cached data
  fallbackToCache: (cacheKey: string, fallbackFn: () => any) => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Failed to read from cache:', error);
    }
    
    return fallbackFn();
  },
  
  // Show user-friendly message
  showUserMessage: (message: string, type: 'error' | 'warning' | 'info' = 'error') => {
    // This would integrate with your notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
  },
  
  // Redirect to safe page
  redirectToSafePage: (path: string = '/') => {
    window.location.href = path;
  }
};
