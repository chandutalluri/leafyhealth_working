import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
  savings?: string;
  category: 'weekly' | 'monthly' | 'quarterly';
  products: string[]; // Product IDs included in subscription
}

export interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  status: 'active' | 'paused' | 'cancelled' | 'pending';
  startDate: string;
  endDate: string;
  nextDelivery: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  customization?: {
    excludedProducts: string[];
    preferences: string[];
  };
  totalPrice: number;
  branchId: string;
}

interface SubscriptionStore {
  plans: SubscriptionPlan[];
  userSubscriptions: UserSubscription[];
  selectedPlan: SubscriptionPlan | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPlans: () => Promise<void>;
  fetchUserSubscriptions: (userId: string) => Promise<void>;
  setSelectedPlan: (plan: SubscriptionPlan | null) => void;
  createSubscription: (planId: string, customization?: any) => Promise<void>;
  pauseSubscription: (subscriptionId: string) => Promise<void>;
  resumeSubscription: (subscriptionId: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  updateSubscription: (subscriptionId: string, updates: Partial<UserSubscription>) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      plans: [],
      userSubscriptions: [],
      selectedPlan: null,
      isLoading: false,
      error: null,

      fetchPlans: async () => {
        set({ isLoading: true, error: null });
        try {
          // Use the actual backend API endpoint
          const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
          const response = await fetch(`${apiGateway}/api/catalog-management/products?category=subscription`);
          if (!response.ok) throw new Error('Failed to fetch subscription plans');
          
          const data = await response.json();
          
          // Transform product data into subscription plans
          const plans: SubscriptionPlan[] = data.data?.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            duration: product.variants?.duration || 'monthly',
            description: product.description,
            features: product.features || [],
            popular: product.isPopular || false,
            savings: product.savings,
            category: product.category?.toLowerCase() || 'monthly',
            products: product.includedProducts || []
          })) || [];

          set({ plans, isLoading: false });
        } catch (error) {
          console.error('Error fetching subscription plans:', error);
          set({ error: 'Failed to load subscription plans', isLoading: false });
        }
      },

      fetchUserSubscriptions: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
          const response = await fetch(`${apiGateway}/api/order-management/subscriptions?userId=${userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });
          
          if (!response.ok) throw new Error('Failed to fetch user subscriptions');
          
          const data = await response.json();
          set({ userSubscriptions: data.data || [], isLoading: false });
        } catch (error) {
          console.error('Error fetching user subscriptions:', error);
          set({ error: 'Failed to load subscriptions', isLoading: false });
        }
      },

      setSelectedPlan: (plan) => set({ selectedPlan: plan }),

      createSubscription: async (planId: string, customization?: any) => {
        set({ isLoading: true, error: null });
        try {
          const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
          const response = await fetch(`${apiGateway}/api/order-management/subscriptions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({
              planId,
              customization,
              branchId: localStorage.getItem('selectedBranchId')
            })
          });

          if (!response.ok) throw new Error('Failed to create subscription');
          
          const newSubscription = await response.json();
          set(state => ({ 
            userSubscriptions: [...state.userSubscriptions, newSubscription],
            isLoading: false 
          }));
        } catch (error) {
          console.error('Error creating subscription:', error);
          set({ error: 'Failed to create subscription', isLoading: false });
          throw error;
        }
      },

      pauseSubscription: async (subscriptionId: string) => {
        set({ isLoading: true, error: null });
        try {
          const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
          const response = await fetch(`${apiGateway}/api/order-management/subscriptions/${subscriptionId}/pause`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          if (!response.ok) throw new Error('Failed to pause subscription');
          
          set(state => ({
            userSubscriptions: state.userSubscriptions.map(sub =>
              sub.id === subscriptionId ? { ...sub, status: 'paused' as const } : sub
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error pausing subscription:', error);
          set({ error: 'Failed to pause subscription', isLoading: false });
          throw error;
        }
      },

      resumeSubscription: async (subscriptionId: string) => {
        set({ isLoading: true, error: null });
        try {
          const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
          const response = await fetch(`${apiGateway}/api/order-management/subscriptions/${subscriptionId}/resume`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          if (!response.ok) throw new Error('Failed to resume subscription');
          
          set(state => ({
            userSubscriptions: state.userSubscriptions.map(sub =>
              sub.id === subscriptionId ? { ...sub, status: 'active' as const } : sub
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error resuming subscription:', error);
          set({ error: 'Failed to resume subscription', isLoading: false });
          throw error;
        }
      },

      cancelSubscription: async (subscriptionId: string) => {
        set({ isLoading: true, error: null });
        try {
          const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
          const response = await fetch(`${apiGateway}/api/order-management/subscriptions/${subscriptionId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          if (!response.ok) throw new Error('Failed to cancel subscription');
          
          set(state => ({
            userSubscriptions: state.userSubscriptions.map(sub =>
              sub.id === subscriptionId ? { ...sub, status: 'cancelled' as const } : sub
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error cancelling subscription:', error);
          set({ error: 'Failed to cancel subscription', isLoading: false });
          throw error;
        }
      },

      updateSubscription: async (subscriptionId: string, updates: Partial<UserSubscription>) => {
        set({ isLoading: true, error: null });
        try {
          const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
          const response = await fetch(`${apiGateway}/api/order-management/subscriptions/${subscriptionId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(updates)
          });

          if (!response.ok) throw new Error('Failed to update subscription');
          
          set(state => ({
            userSubscriptions: state.userSubscriptions.map(sub =>
              sub.id === subscriptionId ? { ...sub, ...updates } : sub
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error updating subscription:', error);
          set({ error: 'Failed to update subscription', isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'leafy-subscription-storage',
      partialize: (state) => ({
        plans: state.plans,
        selectedPlan: state.selectedPlan
      })
    }
  )
);