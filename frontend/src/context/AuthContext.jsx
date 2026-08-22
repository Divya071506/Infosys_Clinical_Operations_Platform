import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = authService.getStoredToken();
      const storedUser = authService.getStoredUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        try {
          const profileRes = await authService.getCurrentUser();
          if (profileRes?.data) {
            const updated = {
              ...storedUser,
              fullName: profileRes.data.fullName,
              email: profileRes.data.email,
              role: profileRes.data.role,
              patientId: profileRes.data.patientId,
              doctorId: profileRes.data.doctorId
            };
            setUser(updated);
            localStorage.setItem('icop_user', JSON.stringify(updated));
          }
        } catch {
          // If token invalid, auth interceptor will handle
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response?.data) {
      setUser(response.data);
      setToken(response.data.token);
    }
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    try {
      const profileRes = await authService.getCurrentUser();
      if (profileRes?.data && user) {
        const updated = {
          ...user,
          fullName: profileRes.data.fullName,
          email: profileRes.data.email,
          role: profileRes.data.role,
          patientId: profileRes.data.patientId,
          doctorId: profileRes.data.doctorId
        };
        setUser(updated);
        localStorage.setItem('icop_user', JSON.stringify(updated));
      }
    } catch {
      // Ignored
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
    isPatient: user?.role === 'PATIENT',
    isDoctor: user?.role === 'DOCTOR',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
