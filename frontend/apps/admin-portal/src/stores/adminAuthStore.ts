import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  assignedBranches: string[];
  primaryBranch: string;
  permissions: Record<string, any>;
  assignedMicroservices: string[];
}

interface AdminAuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  currentBranch: string | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loadUserProfile: () => Promise<void>;
  switchBranch: (branchId: string) => void;
  clearError: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      currentBranch: null,
      loading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await fetch('/api/admin/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, userType: 'internal' }),
          });

          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          // Verify user is assigned to admin portal
          if (data.user.assignedApp !== 'admin' && data.user.assignedApp !== 'Admin Portal') {
            throw new Error('Access denied: Not authorized for Admin Portal');
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            currentBranch: data.user.primaryBranch,
            loading: false,
            error: null,
          });

          return true;
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          currentBranch: null,
          error: null,
        });
      },

      loadUserProfile: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch('/api/admin/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            set({ user: userData });
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
        }
      },

      switchBranch: (branchId: string) => {
        const { user } = get();
        if (user?.assignedBranches.includes(branchId)) {
          set({ currentBranch: branchId });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        currentBranch: state.currentBranch,
      }),
    }
  )
);