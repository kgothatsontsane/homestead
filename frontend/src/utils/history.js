/**
 * Navigation utility functions for consistent routing behavior
 */

export const navigate = (to) => {
  // Handle both absolute and relative paths
  const path = to.startsWith('/') ? to : `/${to}`;
  window.location.href = path;
};

export const getReturnUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('returnUrl') || '/dashboard';
};

export const createRedirectUrl = (path, returnUrl) => {
  return `${path}?returnUrl=${encodeURIComponent(returnUrl)}`;
};
