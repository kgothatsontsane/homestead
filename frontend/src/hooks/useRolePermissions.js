import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { ROLES, ROLE_COMBINATIONS } from '../utils/userRoles';

export const useRolePermissions = () => {
  const { user } = useUser();
  const [activeRole, setActiveRole] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (user) {
      const metadata = user.unsafeMetadata || {};
      setRoles(metadata.roles || [ROLES.BUYER]);
      setActiveRole(metadata.activeRole || ROLES.BUYER);
    }
  }, [user]);

  const setUserRole = async (newRole) => {
    if (!user || !ROLES[newRole]) return;

    try {
      const updatedRoles = [newRole];
      // Check if the role can be combined with others
      if (ROLE_COMBINATIONS[newRole]) {
        const existingCombinedRoles = roles.filter(role => 
          ROLE_COMBINATIONS[newRole].allowedCombinations.includes(role)
        );
        updatedRoles.push(...existingCombinedRoles);
      }

      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          roles: updatedRoles,
          activeRole: newRole,
          lastUpdated: new Date().toISOString()
        }
      });

      setRoles(updatedRoles);
      setActiveRole(newRole);
    } catch (error) {
      console.error('Failed to update user role:', error);
      throw error;
    }
  };

  return {
    activeRole,
    roles,
    setActiveRole: setUserRole,
    isLoaded: Boolean(user),
    hasRole: (role) => roles.includes(role),
    canSwitchTo: (role) => {
      if (!role || !activeRole) return false;
      return roles.includes(role) || 
        (ROLE_COMBINATIONS[activeRole]?.allowedCombinations || []).includes(role);
    }
  };
};

export default useRolePermissions;
