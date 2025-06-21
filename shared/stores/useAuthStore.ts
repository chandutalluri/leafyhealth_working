/**
 * Universal Authentication Store for All Frontend Applications
 * Handles both customer and internal user authentication
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
  type: 'customer' | 'internal';
  branchId?: string;
  branchName?: string;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loginCustomer: (email: string, password: string) => Promise<boolean>;
  registerCustomer: (data: RegisterCustomerData) => Promise<boolean>;
  loginInternal: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

interface RegisterCustomerData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  branchId?: string;
}

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8085';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      loginCustomer: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/customer/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (data.success) {
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              error: data.message || 'Login failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: 'Network error. Please try again.',
            isLoading: false,
          });
          return false;
        }
      },

      registerCustomer: async (data: RegisterCustomerData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/customer/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (result.success) {
            set({
              user: result.user,
              token: result.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              error: result.message || 'Registration failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: 'Network error. Please try again.',
            isLoading: false,
          });
          return false;
        }
      },

      loginInternal: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/internal/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (data.success) {
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              error: data.message || 'Login failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: 'Network error. Please try again.',
            isLoading: false,
          });
          return false;
        }
      },

      verifyToken: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return false;
        }

        try {
          const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          const data = await response.json();

          if (data.success) {
            // Fetch full user profile
            const profileResponse = await fetch(`${AUTH_SERVICE_URL}/api/auth/profile`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            const profileData = await profileResponse.json();

            if (profileData.success) {
              set({
                user: profileData.user,
                isAuthenticated: true,
              });
              return true;
            }
          }
          
          // Token invalid
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          return false;
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          return false;
        }
      },

      logout: () => {
        // Call logout endpoint
        const { token } = get();
        if (token) {
          fetch(`${AUTH_SERVICE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }).catch(() => {
            // Ignore errors on logout
          });
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);