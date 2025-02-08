import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { canAccessRoute } from '../../utils/roleRoutes';

const RoleGuard = ({ children }) => {
  const { user } = useUser();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  const metadata = user.unsafeMetadata || {};
  const currentRole = metadata.activeRole || 'buyer';
  const allRoles = metadata.roles || [currentRole];

  // Check if user can access the current route
  if (!canAccessRoute(location.pathname, currentRole, allRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default React.memo(RoleGuard);
