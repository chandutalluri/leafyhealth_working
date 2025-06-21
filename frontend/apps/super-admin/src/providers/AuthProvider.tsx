'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { verifyToken, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      await verifyToken();
      setLoading(false);
    };
    initAuth();
  }, [verifyToken, setLoading]);

  return <>{children}</>;
}