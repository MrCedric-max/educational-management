// API Context for managing API state and operations
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, ApiResponse } from '../types/database';
import api from '../services/api';

// API State interface
interface ApiState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: Date | null;
}

// API Actions
type ApiAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_ACTIVITY' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: ApiState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastActivity: null,
};

// API Reducer
function apiReducer(state: ApiState, action: ApiAction): ApiState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        lastActivity: new Date(),
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        lastActivity: null,
      };
    case 'UPDATE_ACTIVITY':
      return { ...state, lastActivity: new Date() };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// API Context interface
interface ApiContextType {
  state: ApiState;
  login: (email: string, password: string) => Promise<ApiResponse<any>>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<ApiResponse<any>>;
  refreshToken: () => Promise<ApiResponse<any>>;
  updateUser: (userData: Partial<User>) => Promise<ApiResponse<User>>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// API Provider component
interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  // Initialize authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          // In a real app, you would validate the token with the server
          const userData = localStorage.getItem('user');
          if (userData) {
            const user = JSON.parse(userData);
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    initializeAuth();
  }, []);

  // Auto-logout on inactivity
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const timeout = 30 * 60 * 1000; // 30 minutes
    const interval = setInterval(() => {
      if (state.lastActivity) {
        const timeSinceActivity = Date.now() - state.lastActivity.getTime();
        if (timeSinceActivity > timeout) {
          logout();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.lastActivity]);

  // Login function
  const login = async (email: string, password: string): Promise<ApiResponse<any>> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await api.auth.login({ email, password });
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        
        return {
          success: true,
          data: { user, token },
          message: 'Login successful'
        };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Login failed' });
        return response;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Register function
  const register = async (userData: any): Promise<ApiResponse<any>> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await api.auth.register(userData);
      
      if (response.success) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return response;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Registration failed' });
        return response;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<ApiResponse<any>> => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await api.auth.refreshToken(refreshTokenValue);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        
        return response;
      } else {
        throw new Error(response.error || 'Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed'
      };
    }
  };

  // Update user function
  const updateUser = async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      if (!state.user) {
        return {
          success: false,
          error: 'No user logged in'
        };
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await api.users.updateUser(state.user.id, userData);
      
      if (response.success && response.data) {
        const updatedUser = response.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch({ type: 'SET_USER', payload: updatedUser });
        dispatch({ type: 'UPDATE_ACTIVITY' });
        
        return response;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Update failed' });
        return response;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Set loading function
  const setLoading = (loading: boolean): void => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  // Set error function
  const setError = (error: string | null): void => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  // Update activity on user interaction
  useEffect(() => {
    const handleUserActivity = () => {
      if (state.isAuthenticated) {
        dispatch({ type: 'UPDATE_ACTIVITY' });
      }
    };

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [state.isAuthenticated]);

  const contextValue: ApiContextType = {
    state,
    login,
    logout,
    register,
    refreshToken,
    updateUser,
    clearError,
    setLoading,
    setError,
  };

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use API context
export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export default ApiContext;




