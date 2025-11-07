// Remove the import since we're not using any external auth package

// Custom logger implementation
export const authLogger = {
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Auth]', message, data);
    }
  },
  info: (message, data) => {
    console.info('[Auth]', message, data);
  },
  warn: (message, data) => {
    console.warn('[Auth]', message, data);
  },
  error: (message, data) => {
    console.error('[Auth]', message, data);
  }
};

export const authConfig = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  tokenKey: 'homestead_auth_token',
  refreshTokenKey: 'homestead_refresh_token',
  roles: {
    USER: 'user',
    AGENT: 'agent',
    ADMIN: 'admin'
  }
};

export default {
  authLogger,
  authConfig
};
