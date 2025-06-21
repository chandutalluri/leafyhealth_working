'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { verifyToken, setLoading, token } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      // If no token exists, skip verification and set loading to false immediately
      if (!token) {
        console.log('No token found, skipping verification');
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        await verifyToken();
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Immediate fallback - prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Auth initialization timeout, setting loading to false');
      setLoading(false);
    }, 2000); // Reduced timeout for faster rendering

    initAuth();

    return () => clearTimeout(timeoutId);
  }, [verifyToken, setLoading, token]);

  return <>{children}</>;
}