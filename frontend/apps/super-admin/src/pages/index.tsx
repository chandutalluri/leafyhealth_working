import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../stores/authStore';

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Show fallback content if loading takes too long
    const fallbackTimer = setTimeout(() => {
      setShowFallback(true);
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Immediate redirect if not authenticated and not loading
    if (!isAuthenticated && !isLoading) {
      console.log('Not authenticated, redirecting to login');
      router.replace('/login');
      return;
    }

    // Redirect authenticated users to appropriate dashboard
    if (isAuthenticated && user) {
      console.log('User authenticated, redirecting to dashboard');
      // Redirect based on user role - implementing dual super admin system
      if (user?.role === 'super_admin') {
        // Check user type for proper dashboard routing
        if (user?.email?.includes('ops.admin') || user?.email?.includes('branch') || user?.email?.includes('operations')) {
          // Operational Super Admin - Business Domain Dashboard
          router.replace('/operational-dashboard');
        } else {
          // Global Super Admin - Technical Microservice Dashboard  
          router.replace('/system-dashboard');
        }
      } else {
        // Other roles get redirected to appropriate dashboards
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, user, router, mounted, isLoading]);

  if (!mounted) {
    return null;
  }

  // Show fallback content if authentication is taking too long
  if (showFallback || (!isLoading && !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              LeafyHealth Super Admin
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Telugu Organic Grocery Platform Administration
            </p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/login')}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Access Super Admin Dashboard
            </button>
            <div className="text-center text-xs text-gray-500">
              Port 5000 Unified Gateway • All Services Operational
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state while checking authentication or redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading LeafyHealth Super Admin...</p>
      </div>
    </div>
  );
}