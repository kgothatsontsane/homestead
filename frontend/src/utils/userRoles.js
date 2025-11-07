export const ROLES = {
  UNSET: 'unset',
  BUYER: 'buyer',
  AGENT: 'agent',
  OWNER: 'owner',
  INVESTOR: 'investor',
  TENANT: 'tenant',
  ADMIN: 'admin'
};

// Updated ROLE_COMBINATIONS with more specific role relationships
export const ROLE_COMBINATIONS = {
  [ROLES.UNSET]: {
    allowedCombinations: [],
    description: "Role not yet set",
    canList: false,
    isTemporary: true
  },
  [ROLES.BUYER]: {
    allowedCombinations: [],
    description: "Basic home buyer role"
  },
  [ROLES.AGENT]: {
    allowedCombinations: [ROLES.BUYER, ROLES.OWNER],
    description: "Real estate agents can also buy and own properties",
    canList: true
  },
  [ROLES.OWNER]: {
    allowedCombinations: [ROLES.BUYER, ROLES.AGENT],
    description: "Property owners can also buy and list properties",
    canList: true
  },
  [ROLES.INVESTOR]: {
    allowedCombinations: [ROLES.BUYER, ROLES.OWNER],
    description: "Investors can buy and own multiple properties",
    canList: true
  }
};

export const DEFAULT_ROLE = ROLES.UNSET;

export const isValidRole = (role) => {
  return Object.values(ROLES).includes(role);
};

export const canHaveMultipleRoles = (role) => {
  return ROLE_COMBINATIONS[role] !== undefined;
};

export const getRoleDisplay = (role) => {
  const displays = {
    [ROLES.UNSET]: 'Role Not Set',
    [ROLES.BUYER]: 'Home Buyer',
    [ROLES.AGENT]: 'Real Estate Agent',
    [ROLES.OWNER]: 'Property Owner',
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.INVESTOR]: 'Property Investor',
    [ROLES.TENANT]: 'Tenant'
  };
  return displays[role] || role;
};

// New helper functions
export const canCreateListing = (role) => {
  return ROLE_COMBINATIONS[role]?.canList || false;
};

export const getAvailableRoles = (currentRole) => {
  return ROLE_COMBINATIONS[currentRole]?.allowedCombinations || [];
};

export const isValidRoleCombination = (primaryRole, secondaryRole) => {
  return ROLE_COMBINATIONS[primaryRole]?.allowedCombinations.includes(secondaryRole) || false;
};
