import { ROLES } from './userRoles';

export const getUserRole = (user) => {
  if (!user) return ROLES.UNSET;
  
  // Check metadata for roles
  const metadata = user.unsafeMetadata || {};
  const primaryRole = metadata.primaryRole || ROLES.UNSET;
  
  console.log('Getting user role:', {
    userId: user.id,
    metadata,
    primaryRole
  });

  return primaryRole;
};

export const isValidRole = (role) => {
  const validRoles = ['buyer', 'agent', 'owner'];
  return validRoles.includes(role);
};
