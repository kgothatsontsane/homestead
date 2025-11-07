import { ROLES, ROLE_COMBINATIONS } from '../utils/userRoles';

export const roleMiddleware = {
  // Get primary role from combined roles
  getPrimaryRole: (roles) => {
    if (!Array.isArray(roles) || roles.length === 0) return ROLES.BUYER;
    return roles[0];
  },

  // Check if user can perform specific actions
  canPerformAction: (userRoles, requiredRole) => {
    if (!userRoles || !requiredRole) return false;
    return userRoles.includes(requiredRole);
  },

  // Get available features for current role
  getFeatures: (roles) => {
    const features = new Set();
    roles.forEach(role => {
      // Get base features
      const baseFeatures = this.getBaseFeatures(role);
      baseFeatures.forEach(feature => features.add(feature));

      // Get additional features from role combinations
      if (ROLE_COMBINATIONS[role]) {
        ROLE_COMBINATIONS[role].allowedCombinations.forEach(combinedRole => {
          const combinedFeatures = this.getBaseFeatures(combinedRole);
          combinedFeatures.forEach(feature => features.add(feature));
        });
      }
    });
    return Array.from(features);
  },

  // Helper function to get base features for a role
  getBaseFeatures: (role) => {
    switch(role) {
      case ROLES.BUYER:
        return ['view_properties', 'save_favorites', 'book_viewings'];
      case ROLES.AGENT:
        return ['manage_listings', 'view_clients', 'manage_viewings'];
      case ROLES.OWNER:
        return ['manage_properties', 'view_tenants', 'manage_maintenance'];
      case ROLES.INVESTOR:
        return ['view_analytics', 'investment_tools', 'portfolio_management'];
      case ROLES.TENANT:
        return ['view_rentals', 'maintenance_requests', 'rent_payments'];
      case ROLES.ADMIN:
        return ['all_features'];
      default:
        return [];
    }
  },

  getAvailableRoles: (currentRole) => {
    if (!currentRole) return [ROLES.BUYER];
    const combinations = ROLE_COMBINATIONS[currentRole]?.allowedCombinations || [];
    return [currentRole, ...combinations];
  }
};
