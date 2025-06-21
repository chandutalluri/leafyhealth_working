import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
  role?: string;
  permissions?: string[];
  addresses?: Address[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
          }

          const data = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Store token in localStorage for API requests
          localStorage.setItem('auth_token', data.token);
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
          }

          const data = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem('auth_token', data.token);
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        
        localStorage.removeItem('auth_token');
        
        // Call logout endpoint to invalidate server session
        fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        }).catch(() => {
          // Ignore errors during logout
        });
      },

      updateProfile: async (data) => {
        const { token } = get();
        if (!token) throw new Error('Not authenticated');

        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Update failed');
          }

          const updatedUser = await response.json();
          
          set(state => ({
            user: { ...state.user, ...updatedUser },
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      addAddress: async (address) => {
        const { token } = get();
        if (!token) throw new Error('Not authenticated');

        try {
          const response = await fetch('/api/auth/addresses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(address),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add address');
          }

          const newAddress = await response.json();
          
          set(state => ({
            user: state.user ? {
              ...state.user,
              addresses: [...(state.user.addresses || []), newAddress]
            } : state.user
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      updateAddress: async (id, addressData) => {
        const { token } = get();
        if (!token) throw new Error('Not authenticated');

        try {
          const response = await fetch(`/api/auth/addresses/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(addressData),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update address');
          }

          const updatedAddress = await response.json();
          
          set(state => ({
            user: state.user ? {
              ...state.user,
              addresses: state.user.addresses?.map(addr => 
                addr.id === id ? { ...addr, ...updatedAddress } : addr
              )
            } : state.user
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      deleteAddress: async (id) => {
        const { token } = get();
        if (!token) throw new Error('Not authenticated');

        try {
          const response = await fetch(`/api/auth/addresses/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete address');
          }
          
          set(state => ({
            user: state.user ? {
              ...state.user,
              addresses: state.user.addresses?.filter(addr => addr.id !== id)
            } : state.user
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      setDefaultAddress: async (id) => {
        const { token } = get();
        if (!token) throw new Error('Not authenticated');

        try {
          const response = await fetch(`/api/auth/addresses/${id}/default`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to set default address');
          }
          
          set(state => ({
            user: state.user ? {
              ...state.user,
              addresses: state.user.addresses?.map(addr => ({
                ...addr,
                isDefault: addr.id === id
              }))
            } : state.user
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      refreshUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const user = await response.json();
            set({ user });
          } else {
            // Token might be expired, logout
            get().logout();
          }
        } catch (error) {
          console.error('Failed to refresh user:', error);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'leafy-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);