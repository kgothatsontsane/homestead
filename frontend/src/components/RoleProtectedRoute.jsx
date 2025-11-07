import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { DEFAULT_ROLE } from '../utils/userRoles';
import { authLogger } from '../config/authConfig';

export const RoleProtectedRoute = ({ children, requiredRole }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    authLogger.warn('Unauthorized access attempt', {
      path: location.pathname
    });
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  const userRole = user?.publicMetadata?.role || DEFAULT_ROLE;
  if (userRole !== requiredRole) {
    authLogger.warn('Insufficient role permissions', {
      userRole,
      requiredRole,
      path: location.pathname
    });
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};
