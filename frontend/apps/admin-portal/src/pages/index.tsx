import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAdminAuthStore } from '../stores/adminAuthStore';

export default function AdminPortalHome() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAdminAuthStore();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}