import { QueryProvider } from '../providers/QueryProvider';
import { ToastProvider } from '../providers/ToastProvider';
import { AuthProvider } from '../providers/AuthProvider';
import { suppressQueryErrors } from '../lib/errorHandler';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import { DynamicSidebar } from '../components/layout/DynamicSidebar'
import { useEffect, useState } from 'react';
import { Building2, Menu } from 'lucide-react';

// Gateway Enforcement: Ensure Admin Portal is accessed through Multi-App Gateway (port 5000)
function GatewayEnforcer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPort = window.location.port;
      const isDirectAccess = currentPort === '3002'; // Direct Next.js access
      
      if (isDirectAccess) {
        // Redirect to Multi-App Gateway
        const gatewayUrl = window.location.origin.replace(':3002', ':5000') + '/admin';
        window.location.href = gatewayUrl;
        return;
      }
    }
  }, []);

  return <>{children}</>;
}

// Initialize global error handling
suppressQueryErrors();

// Pages that should not have the sidebar layout
const PUBLIC_PAGES = ['/login', '/login/', '/'];

export default function AdminPortalApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isPublicPage, setIsPublicPage] = useState(true);

  useEffect(() => {
    // Check if current route is a public page
    const currentPath = router.pathname;
    const isPublic = PUBLIC_PAGES.includes(currentPath) || currentPath === '/';
    setIsPublicPage(isPublic);
  }, [router.pathname]);

  // Always render public pages without any layout wrapper
  if (isPublicPage || router.pathname === '/login') {
    return (
      <GatewayEnforcer>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <div className="min-h-screen">
                <Component {...pageProps} />
              </div>
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </GatewayEnforcer>
    );
  }

  // For authenticated pages, render with professional responsive layout
  return (
    <GatewayEnforcer>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="flex h-screen bg-slate-50 overflow-hidden">
              {/* Mobile-responsive sidebar */}
              <div className="hidden lg:flex">
                <DynamicSidebar collapsed={false} onToggle={() => {}} />
              </div>
              
              {/* Main content area */}
              <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile header for smaller screens */}
                <div className="lg:hidden bg-white border-b border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <h1 className="text-lg font-semibold text-slate-900">Admin Portal</h1>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                      <Menu className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>
                </div>
                
                {/* Scrollable content */}
                <div className="flex-1 overflow-auto">
                  <div className="container-responsive py-6 lg:py-8">
                    <Component {...pageProps} />
                  </div>
                </div>
              </main>
            </div>
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </GatewayEnforcer>
  )
}