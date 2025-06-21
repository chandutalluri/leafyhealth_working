/**
 * Super Admin Login Page
 * Secure authentication entry point with no dashboard access
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuthStore } from '../stores/authStore';
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminType, setAdminType] = useState<'global' | 'operational'>('global');
  const { loginInternal, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!email || !password) {
      return;
    }

    const success = await loginInternal(email, password);
    if (success) {
      router.replace('/');
    }
  };

  return (
    <>
      <Head>
        <title>Super Admin Login - LeafyHealth</title>
        <meta name="description" content="Secure access to LeafyHealth system administration" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div>
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 shadow-lg">
              <ShieldCheckIcon className="h-12 w-12 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Super Admin Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              LeafyHealth System Administration
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Admin Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Super Admin Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAdminType('global')}
                    className={`px-4 py-3 text-sm font-medium rounded-lg border transition-colors ${
                      adminType === 'global'
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Global Super Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminType('operational')}
                    className={`px-4 py-3 text-sm font-medium rounded-lg border transition-colors ${
                      adminType === 'operational'
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Operational Super Admin
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {adminType === 'global' 
                    ? 'Full system control and configuration access'
                    : 'Operational oversight and business management'
                  }
                </p>
              </div>

              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pr-10"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  <>
                    <ShieldCheckIcon className="h-5 w-5 mr-2" />
                    Sign in to Dashboard
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-800 font-medium">Admin Credentials</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="text-xs text-blue-700 font-medium">Global Admin:</p>
                    <p className="text-xs text-blue-600">global.admin@leafyhealth.com</p>
                    <p className="text-xs text-blue-600">securepassword123</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 font-medium">Operations Admin:</p>
                    <p className="text-xs text-blue-600">ops.admin@leafyhealth.com</p>
                    <p className="text-xs text-blue-600">securepassword123</p>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              LeafyHealth Multi-Branch ERP System v1.0
            </p>
            <p className="text-xs text-gray-400 mt-1">
              24 Microservices • Enterprise Security • Branch Isolation
            </p>
          </div>
        </div>
      </div>
    </>
  );
}