import { create } from 'zustand';
import React from 'react';

// Hybrid RBAC auth implementation for admin portal
interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'staff' | 'manager' | 'admin' | 'super_admin';
  branchId?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Record<string, string[]>;
}

export const useAuthStore = create<AuthState>(() => ({
  user: {
    id: 'admin-001',
    email: 'superadmin@leafyhealth.com',
    name: 'Super Admin User',
    role: 'super_admin',
    branchId: 'branch-001'
  },
  isAuthenticated: true,
  isLoading: false,
  permissions: {
    'catalog-management': ['read', 'create', 'update', 'delete'],
    'order-management': ['read', 'create', 'update'],
    'inventory-management': ['read', 'create', 'update'],
    'payment-processing': ['read', 'create'],
    'customer-service': ['read', 'create', 'update'],
    'analytics-reporting': ['read'],
    'accounting-management': ['read', 'create', 'update'],
    'employee-management': ['read', 'create', 'update'],
    'shipping-delivery': ['read', 'create', 'update'],
    'security-dashboard': ['super_admin']
  }
}));

export function usePermissions() {
  const { permissions, user } = useAuthStore();
  
  const hasPermission = (domain: string, action: string): boolean => {
    if (user?.role === 'super_admin') return true;
    return permissions[domain]?.includes(action) || false;
  };

  const getAllowedDomains = () => {
    if (user?.role === 'super_admin') {
      return Object.keys(permissions);
    }
    return Object.keys(permissions).filter(domain => permissions[domain].length > 0);
  };

  const getUserRole = () => user?.role || 'customer';
  
  const getPermissionMatrix = () => permissions;

  return {
    hasPermission,
    getAllowedDomains,
    getUserRole,
    getPermissionMatrix,
    user,
    isLoading: false,
    permissions
  };
}

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}

export function DomainGuard({ 
  domain, 
  action, 
  children, 
  fallback = null 
}: { 
  domain: string; 
  action: string; 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}) {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(domain, action)) {
    return fallback;
  }
  
  return children;
}