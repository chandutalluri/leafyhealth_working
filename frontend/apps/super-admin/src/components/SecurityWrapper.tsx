/**
 * Security Wrapper - Prevents any content rendering before authentication
 * Critical security component to prevent information disclosure
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../stores/authStore';
import ClientOnly from './ClientOnly';

interface SecurityWrapperProps {
  children: React.ReactNode;
}

export function SecurityWrapper({ children }: SecurityWrapperProps) {
  return (
    <ClientOnly>
      <SecurityWrapperClient>{children}</SecurityWrapperClient>
    </ClientOnly>
  );
}

function SecurityWrapperClient({ children }: SecurityWrapperProps) {
  const [isSecurityChecked, setIsSecurityChecked] = useState(false);
  const { isAuthenticated, isLoading, verifyToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const performSecurityCheck = async () => {
      // Immediate security check - no content until verified
      if (!isAuthenticated) {
        await verifyToken();
      }
      setIsSecurityChecked(true);
    };

    performSecurityCheck();
  }, [isAuthenticated, verifyToken]);

  useEffect(() => {
    // Immediate redirect for unauthorized access
    if (isSecurityChecked && !isLoading && !isAuthenticated && router.pathname !== '/login') {
      router.replace('/login');
    }
  }, [isSecurityChecked, isAuthenticated, isLoading, router]);

  // Show loading state while security check is ongoing
  if (!isSecurityChecked || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // SECURITY: Only allow login page for unauthenticated users
  if (!isAuthenticated && router.pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
}