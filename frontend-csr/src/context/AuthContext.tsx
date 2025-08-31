import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  loginWithGoogle: () => void;
  handleGoogleCallback: (token: string, refreshToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  // Set up axios interceptor for authentication
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Add response interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, logout user
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      console.log('AuthContext: Checking authentication on app load');
      const token = localStorage.getItem('accessToken');
      console.log('AuthContext: Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'null');
      
      if (token) {
        try {
          console.log('AuthContext: Validating token with /auth/me');
          const response = await axios.get(`${API_BASE_URL}/auth/me`);
          console.log('AuthContext: Token validation successful:', response.data);
          setUser(response.data.data);
        } catch (error) {
          console.error('AuthContext: Token validation failed:', error.response?.data || error.message);
          // Token is invalid, remove it
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          delete axios.defaults.headers.common['Authorization'];
        }
      } else {
        console.log('AuthContext: No token found in localStorage');
      }
      setIsLoading(false);
      console.log('AuthContext: Authentication check completed');
    };

    checkAuth();
  }, []);

  const loginWithGoogle = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleGoogleCallback = useCallback(async (token: string, refreshToken: string) => {
    console.log('AuthContext: handleGoogleCallback called');
    console.log('AuthContext: Received token length:', token?.length);
    console.log('AuthContext: Received refreshToken length:', refreshToken?.length);
    
    try {
      // Store tokens
      console.log('AuthContext: Storing tokens in localStorage');
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Set authorization header
      console.log('AuthContext: Setting authorization header');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user data
      console.log('AuthContext: Fetching user data from:', `${API_BASE_URL}/auth/me`);
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      console.log('AuthContext: User data response:', response.data);
      
      setUser(response.data.data);
      console.log('AuthContext: User state updated, redirecting to dashboard');
      
      // Redirect to dashboard after successful authentication
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('AuthContext: Error handling Google callback:', error);
      console.error('AuthContext: Error details:', error.response?.data || error.message);
      logout();
    }
  }, [logout]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    logout,
    loginWithGoogle,
    handleGoogleCallback
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};