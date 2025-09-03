import React, { createContext, useContext, useState, useEffect } from 'react';
import { useValidateToken } from '../api/authentication/authentication';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Validate token hook (optional - for token validation)
  const { data: tokenValid, error: tokenError } = useValidateToken(
    { token }, 
    { 
      query: { 
        enabled: !!token,
        retry: false,
        staleTime: 5 * 60 * 1000 // 5 minutes
      }
    }
  );

  // Handle token validation result
  useEffect(() => {
    if (token && tokenError) {
      // Token is invalid, logout user
      logout();
    }
  }, [tokenError, token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const isAdmin = () => {
    console.log('isAdmin check - user:', user);
    console.log('isAdmin check - user.role:', user?.role);
    console.log('isAdmin check - comparison result:', !!user && user.role === 'ADMIN');
    return !!user && user.role === 'ADMIN';
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};