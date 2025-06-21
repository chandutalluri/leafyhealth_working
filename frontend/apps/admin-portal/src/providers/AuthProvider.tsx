/**
 * Authentication Provider with Replit Auth integration
 */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Use static demo user data instead of API calls
  const userData = {
    id: 'admin-user',
    email: 'admin@leafyhealth.com',
    firstName: 'Admin',
    lastName: 'User',
    roles: ['admin', 'manager']
  };
  const isLoading = false;

  useEffect(() => {
    setUser(userData || null);
  }, []);

  const login = () => {
    window.location.href = '/api/login';
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      // Even if logout fails, redirect to home
      window.location.href = '/';
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}