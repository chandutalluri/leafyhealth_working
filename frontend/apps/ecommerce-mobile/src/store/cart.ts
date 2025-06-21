/**
 * Cart Store with Indian e-commerce logic
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../lib/products';
import { formatCurrency, calculateGST, calculateTotal } from '../lib/utils';

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getGST: (rate?: number) => number;
  getTotal: (gstRate?: number) => number;
  getDeliveryCharge: (pincode?: string) => number;
  getFinalTotal: (pincode?: string, gstRate?: number) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          
          return {
            items: [...state.items, { ...product, quantity }]
          };
        });
      },
      
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getGST: (rate = 18) => {
        return calculateGST(get().getSubtotal(), rate);
      },
      
      getTotal: (gstRate = 18) => {
        return calculateTotal(get().getSubtotal(), gstRate);
      },
      
      getDeliveryCharge: (pincode = '') => {
        const subtotal = get().getSubtotal();
        
        // Free delivery for orders above ₹500
        if (subtotal >= 500) return 0;
        
        // Metro cities: ₹40, Others: ₹60
        const metroPincodes = ['110', '400', '560', '600', '700', '500'];
        const isMetro = metroPincodes.some(code => pincode.startsWith(code));
        
        return isMetro ? 40 : 60;
      },
      
      getFinalTotal: (pincode = '', gstRate = 18) => {
        return get().getTotal(gstRate) + get().getDeliveryCharge(pincode);
      }
    }),
    {
      name: 'leafyhealth-cart',
      version: 1
    }
  )
);
