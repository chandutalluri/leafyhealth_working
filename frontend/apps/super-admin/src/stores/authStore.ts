/**
 * Super Admin Authentication Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'manager' | 'staff';
  type: 'internal';
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
  loginInternal: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Route through Multi-App Gateway on port 5000 to authentication service
// Use relative URLs for proper routing through gateway
const AUTH_SERVICE_URL = '/api/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      loginInternal: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('Attempting login to:', `${AUTH_SERVICE_URL}/internal/login`);
          console.log('Request payload:', { email, password: '***' });
          
          const response = await fetch(`${AUTH_SERVICE_URL}/internal/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({ email, password }),
          });

          console.log('Response status:', response.status, response.statusText);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));

          if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response body:', errorText);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();

          if (data.success) {
            // Validate Super Admin role
            const userRole = data.user.role;
            if (userRole !== 'super_admin') {
              set({
                error: 'Super Admin privileges required. Access denied.',
                isLoading: false,
              });
              return false;
            }

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
          console.error('Login error:', error);
          set({
            error: error instanceof Error ? error.message : 'Network error. Please try again.',
            isLoading: false,
          });
          return false;
        }
      },

      verifyToken: async () => {
        const { token } = get();
        if (!token) {
          set({ 
            isAuthenticated: false, 
            user: null, 
            token: null,
            isLoading: false 
          });
          return false;
        }

        try {
          const response = await fetch(`${AUTH_SERVICE_URL}/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          const data = await response.json();

          if (data.success) {
            set({ 
              isAuthenticated: true,
              isLoading: false 
            });
            return true;
          }
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          });
          return false;
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          });
          return false;
        }
      },

      logout: () => {
        const { token } = get();
        if (token) {
          fetch(`${AUTH_SERVICE_URL}/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }).catch(() => {});
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
      name: 'super-admin-auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);