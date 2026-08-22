import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('icop_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors uniformly
api.interceptors.response.use(
  (response) => {
    // If backend wrapped response in ApiResponse { success, message, data }
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Token expired or unauthorized
      if (status === 401) {
        // Only redirect if already logged in and token is expired
        if (localStorage.getItem('icop_token')) {
          localStorage.removeItem('icop_token');
          localStorage.removeItem('icop_user');
          window.location.href = '/login?expired=true';
        }
      }

      // Return a clean error message from backend
      const message = data?.message || (status === 403 ? 'Access forbidden: insufficient permissions' : 'An error occurred');
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error('Cannot connect to backend server. Please make sure Spring Boot is running on port 8080.'));
    } else {
      return Promise.reject(new Error(error.message));
    }
  }
);

export default api;
