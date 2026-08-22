import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.data?.token) {
      localStorage.setItem('icop_token', response.data.data.token);
      localStorage.setItem('icop_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('icop_token');
    localStorage.removeItem('icop_user');
  },

  getStoredUser: () => {
    try {
      const user = localStorage.getItem('icop_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  getStoredToken: () => {
    return localStorage.getItem('icop_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('icop_token');
  }
};
