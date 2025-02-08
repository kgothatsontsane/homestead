
import { useMemo } from 'react';
import { useRolePermissions } from './useRolePermissions';
import { ROLE_PERMISSIONS, PERMISSIONS } from '../utils/permissions';

export const useFeatureAccess = () => {
  const { roles, activeRole } = useRolePermissions();

  const permissions = useMemo(() => {
    const allPermissions = roles.flatMap(role => ROLE_PERMISSIONS[role] || []);
    return [...new Set(allPermissions)];
  }, [roles]);

  return {
    can: (permission) => permissions.includes(permission),
    hasRole: (role) => roles.includes(role),
    permissions,
    activeRole,
  };
};