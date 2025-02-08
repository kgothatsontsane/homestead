import { ROLES } from './userRoles';

const BASE_ROUTES = {
  public: ['/', '/listings', '/contact'],
  buyer: ['/dashboard', '/saved', '/viewings', '/messages', '/search'],
  agent: ['/dashboard', '/listings/manage', '/clients', '/appointments', '/analytics'],
  owner: ['/dashboard', '/properties', '/tenants', '/finances', '/maintenance']
};

export const getRoleRoutes = (role, combinedRoles = []) => {
  let routes = [...BASE_ROUTES.public];
  
  // Add primary role routes
  if (BASE_ROUTES[role]) {
    routes.push(...BASE_ROUTES[role]);
  }
  
  // Add additional role routes for combined roles
  combinedRoles.forEach(additionalRole => {
    if (BASE_ROUTES[additionalRole]) {
      routes.push(...BASE_ROUTES[additionalRole]);
    }
  });

  return [...new Set(routes)]; // Remove duplicates
};

export const canAccessRoute = (path, role, combinedRoles = []) => {
  const allowedRoutes = getRoleRoutes(role, combinedRoles);
  return allowedRoutes.some(route => path.startsWith(route));
};
