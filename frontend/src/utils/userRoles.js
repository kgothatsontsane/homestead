export const ROLES = {
  BUYER: 'buyer',
  AGENT: 'agent',
  OWNER: 'owner',
  ADMIN: 'admin',
  INVESTOR: 'investor',
  TENANT: 'tenant'
};

export const ROLE_COMBINATIONS = {
  [ROLES.AGENT]: {
    allowedCombinations: [ROLES.BUYER, ROLES.INVESTOR, ROLES.OWNER],
    description: "Agents can also buy, invest, or list their own properties"
  },
  [ROLES.OWNER]: {
    allowedCombinations: [ROLES.BUYER, ROLES.INVESTOR, ROLES.AGENT],
    description: "Property owners can also buy more properties or become agents"
  },
  [ROLES.INVESTOR]: {
    allowedCombinations: [ROLES.BUYER, ROLES.OWNER],
    description: "Investors can buy properties and manage their portfolio"
  },
  [ROLES.TENANT]: {
    allowedCombinations: [ROLES.BUYER],
    description: "Tenants can also browse properties to buy"
  }
};

export const DEFAULT_ROLE = ROLES.BUYER;

export const isValidRole = (role) => {
  return Object.values(ROLES).includes(role);
};

export const canHaveMultipleRoles = (role) => {
  return ROLE_COMBINATIONS[role] !== undefined;
};

export const getRoleDisplay = (role) => {
  const displays = {
    [ROLES.BUYER]: 'Home Buyer',
    [ROLES.AGENT]: 'Real Estate Agent',
    [ROLES.OWNER]: 'Property Owner',
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.INVESTOR]: 'Property Investor',
    [ROLES.TENANT]: 'Tenant'
  };
  return displays[role] || role;
};
