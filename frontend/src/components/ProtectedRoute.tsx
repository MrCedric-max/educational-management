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
  fallbackPath
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Strict role check: user's role must be explicitly in allowedRoles
  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    if (fallbackPath) {
      return <Navigate to={fallbackPath} replace />;
    }
    // Redirect to each role's dedicated home portal
    if (user.role === 'parent') {
      return <Navigate to="/parent-portal" replace />;
    } else if (user.role === 'teacher') {
      return <Navigate to="/teacher-dashboard" replace />;
    } else if (user.role === 'school_admin') {
      return <Navigate to="/school-admin-overview" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
