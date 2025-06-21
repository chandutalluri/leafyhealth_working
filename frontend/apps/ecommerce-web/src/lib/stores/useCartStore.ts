import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  name_telugu?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxQuantity?: number;
  image?: string;
  category?: string;
  weight?: string;
  unit?: string;
  branchId: string;
  discount?: number;
  tax?: number;
  isSubscription?: boolean;
  subscriptionDetails?: {
    frequency: string;
    duration: string;
  };
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  deliveryFee: number;
  tax: number;
  discount: number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  validateCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  syncWithBranch: (branchId: string) => void;
  
  // Getters
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getFinalTotal: () => number;
  getCartSummary: () => {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    discount: number;
    total: number;
    itemCount: number;
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      deliveryFee: 0,
      tax: 0,
      discount: 0,
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id && i.branchId === item.branchId);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;
          const maxQuantity = existingItem.maxQuantity || 99;
          
          if (newQuantity > maxQuantity) {
            return state; // Don't add if exceeds max quantity
          }
          
          return {
            items: state.items.map(i =>
              i.id === item.id && i.branchId === item.branchId 
                ? { ...i, quantity: newQuantity } 
                : i
            )
          };
        }
        
        return {
          items: [...state.items, { ...item, quantity: 1 }]
        };
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      
      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            items: state.items.filter(item => item.id !== id)
          };
        }
        
        return {
          items: state.items.map(item => {
            if (item.id === id) {
              const maxQuantity = item.maxQuantity || 99;
              const validQuantity = Math.min(quantity, maxQuantity);
              return { ...item, quantity: validQuantity };
            }
            return item;
          })
        };
      }),
      
      clearCart: () => set({ 
        items: [], 
        deliveryFee: 0, 
        tax: 0, 
        discount: 0,
        error: null 
      }),

      validateCart: async () => {
        const { items } = get();
        if (items.length === 0) return;

        set({ isLoading: true, error: null });
        
        try {
          // Validate each item's availability and pricing
          const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
          const response = await fetch(`${apiGateway}/api/cart/validate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
            body: JSON.stringify({ items: items.map(item => ({ id: item.id, quantity: item.quantity, branchId: item.branchId })) }),
          });

          if (!response.ok) throw new Error('Cart validation failed');
          
          const validation = await response.json();
          
          // Update items with latest pricing and availability
          set(state => ({
            items: state.items.map(item => {
              const validatedItem = validation.items.find((v: any) => v.id === item.id);
              return validatedItem ? { ...item, ...validatedItem } : item;
            }),
            isLoading: false
          }));
        } catch (error) {
          console.error('Cart validation error:', error);
          set({ error: 'Failed to validate cart', isLoading: false });
        }
      },

      applyCoupon: async (code: string) => {
        const { items } = get();
        set({ isLoading: true, error: null });

        try {
          const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
          const response = await fetch(`${apiGateway}/api/coupons/apply`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
            body: JSON.stringify({ 
              code, 
              cartTotal: get().getSubtotal(),
              items: items.map(item => ({ id: item.id, quantity: item.quantity, price: item.price }))
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Invalid coupon code');
          }
          
          const couponData = await response.json();
          set({ 
            discount: couponData.discountAmount,
            isLoading: false 
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      removeCoupon: () => set({ discount: 0 }),

      syncWithBranch: (branchId: string) => {
        set(state => ({
          items: state.items.filter(item => item.branchId === branchId)
        }));
      },
      
      getTotalPrice: () => {
        return get().getFinalTotal();
      },
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const itemPrice = item.originalPrice && item.discount 
            ? item.originalPrice - (item.originalPrice * item.discount / 100)
            : item.price;
          return total + (itemPrice * item.quantity);
        }, 0);
      },

      getFinalTotal: () => {
        const subtotal = get().getSubtotal();
        const { deliveryFee, tax, discount } = get();
        return Math.max(0, subtotal + deliveryFee + tax - discount);
      },

      getCartSummary: () => {
        const subtotal = get().getSubtotal();
        const { deliveryFee, tax, discount } = get();
        const total = get().getFinalTotal();
        const itemCount = get().getTotalItems();

        return {
          subtotal,
          deliveryFee,
          tax,
          discount,
          total,
          itemCount
        };
      }
    }),
    {
      name: 'leafy-cart-storage',
      partialize: (state) => ({
        items: state.items,
        discount: state.discount,
      }),
    }
  )
);