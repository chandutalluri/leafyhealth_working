import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from './authStore';

interface DomainPermission {
  domain: string;
  label: string;
  icon: string;
  actions: string[];
}

interface PermissionsContextType {
  domains: DomainPermission[];
  hasPermission: (domain: string, action: string) => boolean;
  getAllowedDomains: () => string[];
  getDomainActions: (domain: string) => string[];
  isLoading: boolean;
  refreshPermissions: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | null>(null);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [domains, setDomains] = useState<DomainPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (user && token) {
      fetchUserPermissions();
    } else {
      setDomains([]);
      setIsLoading(false);
    }
  }, [user, token]);

  const fetchUserPermissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/profile', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDomains(data.domains || []);
      } else {
        console.error('Failed to fetch permissions:', response.statusText);
        setDomains([]);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      setDomains([]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (domain: string, action: string): boolean => {
    // Super admin bypasses all permission checks
    if (user?.role === 'super_admin') {
      return true;
    }
    
    const domainPerms = domains.find(d => d.domain === domain);
    return domainPerms?.actions.includes(action) ?? false;
  };

  const getAllowedDomains = (): string[] => {
    if (user?.role === 'super_admin') {
      // Return all available domains for super admin
      return [
        'catalog-management', 'inventory-management', 'order-management',
        'payment-processing', 'notification-service', 'customer-service',
        'employee-management', 'accounting-management', 'expense-monitoring',
        'analytics-reporting', 'performance-monitor', 'shipping-delivery',
        'marketplace-management', 'compliance-audit', 'content-management',
        'label-design', 'integration-hub'
      ];
    }
    return domains.map(d => d.domain);
  };

  const getDomainActions = (domain: string): string[] => {
    if (user?.role === 'super_admin') {
      return ['create', 'read', 'update', 'delete'];
    }
    
    const domainPerms = domains.find(d => d.domain === domain);
    return domainPerms?.actions || [];
  };

  const refreshPermissions = async () => {
    await fetchUserPermissions();
  };

  return (
    <PermissionsContext.Provider value={{
      domains,
      hasPermission,
      getAllowedDomains,
      getDomainActions,
      isLoading,
      refreshPermissions
    }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionsProvider');
  }
  return context;
}