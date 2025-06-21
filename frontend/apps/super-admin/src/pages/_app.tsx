import type { AppProps } from 'next/app'
import { MainNavigation } from '../components/layout/MainNavigation'
import { QueryProvider } from '../providers/QueryProvider';
import { ToastProvider } from '../providers/ToastProvider';
import { AuthProvider } from '../providers/AuthProvider';
import { SecurityWrapper } from '../components/SecurityWrapper';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Gateway Enforcement: Ensure Super Admin app is accessed through Multi-App Gateway (port 5000)
function GatewayEnforcer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPort = window.location.port;
      const isDirectAccess = currentPort === '3003'; // Direct Next.js access
      
      if (isDirectAccess) {
        // Redirect to Multi-App Gateway
        const gatewayUrl = window.location.origin.replace(':3003', ':5000');
        console.log('Redirecting to Multi-App Gateway:', gatewayUrl);
        window.location.href = gatewayUrl;
        return;
      }
    }
  }, []);

  return <>{children}</>;
}

import '../styles/globals.css'
import '../styles/accessibility.css'

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Immediate redirect to login if not authenticated and not on login page
    if (!isLoading && !isAuthenticated && router.pathname !== '/login') {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // SECURITY: Only show login page when not authenticated - never show dashboard content
  if (!isAuthenticated) {
    // Only allow login page to be displayed
    if (router.pathname === '/login') {
      return <>{children}</>;
    }
    // For any other route, return null to prevent content flash
    return null;
  }

  // Only render authenticated layout after confirming authentication
  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function App({ Component, pageProps }: AppProps) {
  return (
    <GatewayEnforcer>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <SecurityWrapper>
              <AuthenticatedLayout>
                <Component {...pageProps} />
              </AuthenticatedLayout>
            </SecurityWrapper>
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </GatewayEnforcer>
  )
}

export default App;