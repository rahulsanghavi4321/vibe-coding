import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('homeserve_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial session hydration
  useEffect(() => {
    const hydrateAuth = async () => {
      const storedToken = localStorage.getItem('homeserve_token');
      const storedUser = localStorage.getItem('homeserve_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend if online
          const res = await api.get('/auth/me');
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('homeserve_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session verification fallback to stored user:', err.message);
        }
      }
      setIsLoading(false);
    };

    hydrateAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = res.data;
      
      localStorage.setItem('homeserve_token', access_token);
      localStorage.setItem('homeserve_user', JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      setIsLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      setIsLoading(false);
      const msg = err.response?.data?.detail || 'Invalid email or password. Please try again.';
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      const { access_token, user: newUser } = res.data;
      
      localStorage.setItem('homeserve_token', access_token);
      localStorage.setItem('homeserve_user', JSON.stringify(newUser));
      setToken(access_token);
      setUser(newUser);
      setIsLoading(false);
      return { success: true, user: newUser };
    } catch (err) {
      setIsLoading(false);
      const msg = err.response?.data?.detail || 'Registration failed. Please check your details.';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('homeserve_token');
    localStorage.removeItem('homeserve_user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  // Demo account switcher for easy role testing
  const switchDemoRole = async (targetRole) => {
    const demoCredentials = {
      super_admin: { email: 'admin@homeservetech.com', password: 'Password@123' },
      customer: { email: 'customer@gmail.com', password: 'Password@123' },
      service_provider: { email: 'provider@apexservices.com', password: 'Password@123' },
      technician: { email: 'technician@apexservices.com', password: 'Password@123' },
    };

    const creds = demoCredentials[targetRole];
    if (creds) {
      return await login(creds.email, creds.password);
    }
    return { success: false, error: 'Unknown role' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        role: user?.role || null,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
        setUser,
      }}
    >
      {children}
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
