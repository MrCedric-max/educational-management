import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallbackPath = '/login' 
}) => {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has permission for any of the allowed roles
  const hasAccess = allowedRoles.some(role => hasPermission(role));

  if (!hasAccess) {
    // Redirect to appropriate fallback based on user role
    if (user.role === 'parent') {
      return <Navigate to="/parent-portal" replace />;
    } else if (user.role === 'student') {
      return <Navigate to="/student-progress" replace />;
    } else if (user.role === 'teacher') {
      return <Navigate to="/teacher-dashboard" replace />;
    } else if (user.role === 'school_admin') {
      return <Navigate to="/school-admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
