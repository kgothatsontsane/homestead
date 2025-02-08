import axios from 'axios';
import { authConfig } from '../config/authConfig';

const api = axios.create({
  baseURL: authConfig.apiUrl
});

// Change to named export
export const authService = {
  async login(email, password) {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem(authConfig.tokenKey, response.data.token);
    }
    return response.data;
  },

  async loginWithGoogle(tokenId) {
    const response = await api.post('/api/auth/google', { tokenId });
    if (response.data.token) {
      localStorage.setItem(authConfig.tokenKey, response.data.token);
    }
    return response.data;
  },

  async loginWithFacebook(accessToken) {
    const response = await api.post('/api/auth/facebook', { accessToken });
    if (response.data.token) {
      localStorage.setItem(authConfig.tokenKey, response.data.token);
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem(authConfig.tokenKey, response.data.token);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem(authConfig.tokenKey);
  },

  getCurrentUser() {
    const token = localStorage.getItem(authConfig.tokenKey);
    if (token) {
      // Simple JWT decode (you might want to use a proper JWT library)
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
      } catch (error) {
        console.error('Error parsing token:', error);
        return null;
      }
    }
    return null;
  }
};

// Add default export
export default authService;
