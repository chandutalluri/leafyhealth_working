/**
 * Enhanced API Hooks for payment-processing
 * Real backend integration with error handling and caching
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, APIError } from '../lib/apiClient';
import { useToast } from './use-toast';

// Get API prefix for this domain
const getApiPrefix = (domain: string) => {
  const prefixMap = {
    'identity-access': '/api/auth',
    'user-role-management': '/api/users',
    'catalog-management': '/api/catalog',
    'inventory-management': '/api/inventory',
    'order-management': '/api/orders',
    'payment-processing': '/api/payments',
    'notification-service': '/api/notifications',
    'customer-service': '/api/customers',
    'accounting-management': '/api/accounting',
    'analytics-reporting': '/api/analytics',
    'compliance-audit': '/api/compliance',
    'content-management': '/api/content',
    'employee-management': '/api/employees',
    'expense-monitoring': '/api/expenses',
    'integration-hub': '/api/integrations',
    'label-design': '/api/labels',
    'marketplace-management': '/api/marketplace',
    'performance-monitor': '/api/performance',
    'shipping-delivery': '/api/shipping',
    'multi-language-management': '/api/languages'
  };
  return (prefixMap as any)[domain] || '/api/generic';
};

const API_PREFIX = getApiPrefix('payment-processing');

interface PaymentProcessingItem {
  id: string;
  [key: string]: any;
}

export function usePaymentProcessing() {
  const [items, setItems] = useState<PaymentProcessingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for fetching all items
  const {
    data: itemsData,
    isLoading: isItemsLoading,
    error: itemsError,
    refetch: refetchItems
  } = useQuery({
    queryKey: ['payment-processing', 'all'],
    queryFn: async () => {
      try {
        return await apiClient.get(API_PREFIX);
      } catch (error) {
        if (error instanceof APIError && error.status === 401) {
          toast({
            title: 'Authentication Required',
            description: 'Please log in to access this data.',
            variant: 'destructive',
          });
          // Redirect to login
          window.location.href = '/api/login';
          return [];
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
      if (error instanceof APIError && error.status === 401) {
        return false; // Don't retry auth errors
      }
      return failureCount < 3;
    },
  });

  // Update local state when query data changes
  useEffect(() => {
    if (itemsData) {
      setItems(itemsData);
    }
  }, [itemsData]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (newItem: Partial<PaymentProcessingItem>) => {
      return await apiClient.post(API_PREFIX, newItem);
    },
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: ['payment-processing'] });
      setItems(prev => [...prev, newItem]);
      toast({
        title: 'Success',
        description: 'payment processing item created successfully',
      });
    },
    onError: (error: any) => {
      if (error instanceof APIError && error.status === 401) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to perform this action.',
          variant: 'destructive',
        });
        window.location.href = '/api/login';
        return;
      }
      
      toast({
        title: 'Error',
        description: error instanceof APIError ? error.message : 'Failed to create item',
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PaymentProcessingItem> }) => {
      return await apiClient.put(`${API_PREFIX}/${id}`, data);
    },
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: ['payment-processing'] });
      setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
      toast({
        title: 'Success',
        description: 'payment processing item updated successfully',
      });
    },
    onError: (error: any) => {
      if (error instanceof APIError && error.status === 401) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to perform this action.',
          variant: 'destructive',
        });
        window.location.href = '/api/login';
        return;
      }
      
      toast({
        title: 'Error',
        description: error instanceof APIError ? error.message : 'Failed to update item',
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`${API_PREFIX}/${id}`);
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['payment-processing'] });
      setItems(prev => prev.filter(item => item.id !== deletedId));
      toast({
        title: 'Success',
        description: 'payment processing item deleted successfully',
      });
    },
    onError: (error: any) => {
      if (error instanceof APIError && error.status === 401) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to perform this action.',
          variant: 'destructive',
        });
        window.location.href = '/api/login';
        return;
      }
      
      toast({
        title: 'Error',
        description: error instanceof APIError ? error.message : 'Failed to delete item',
        variant: 'destructive',
      });
    },
  });

  return {
    // Data
    items,
    isLoading: isItemsLoading || isLoading,
    error: itemsError,
    
    // Actions
    refetch: refetchItems,
    createItem: createMutation.mutate,
    updateItem: updateMutation.mutate,
    deleteItem: deleteMutation.mutate,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
