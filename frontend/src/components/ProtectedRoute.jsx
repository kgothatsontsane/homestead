import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRolePermissions } from '../hooks/useRolePermissions';
import { ROLE_PERMISSIONS } from '../utils/permissions';

export const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  requiredPermission = null 
}) => {
  const { activeRole, roles } = useRolePermissions();

  const hasPermission = () => {
    if (!requiredPermission) return true;
    
    const userPermissions = roles.flatMap(role => ROLE_PERMISSIONS[role] || []);
    return userPermissions.includes(requiredPermission);
  };

  const hasRole = () => {
    if (!requiredRole) return true;
    return roles.includes(requiredRole);
  };

  if (!hasRole() || !hasPermission()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
