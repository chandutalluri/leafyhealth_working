import { create } from 'zustand';

interface MicroservicePermission {
  name: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface SidebarItem {
  id: string;
  name: string;
  icon: string;
  path: string;
  microservice: string;
  requiredPermission: string;
  category: string;
}

interface PermissionState {
  userPermissions: Record<string, MicroservicePermission>;
  availableSidebar: SidebarItem[];
  loading: boolean;
  
  // Actions
  loadUserPermissions: (token: string) => Promise<void>;
  generateSidebar: () => void;
  hasPermission: (microservice: string, operation: string) => boolean;
}

// Microservice definitions matching Super Admin system
const MICROSERVICE_DEFINITIONS: Record<string, SidebarItem> = {
  'company-management': { id: 'company', name: 'Company Management', icon: 'Building2', path: '/company-management', microservice: 'company-management', requiredPermission: 'read', category: 'core' },
  'image-management': { id: 'images', name: 'Image Management', icon: 'Image', path: '/image-management', microservice: 'image-management', requiredPermission: 'read', category: 'core' },
  'identity-access': { id: 'identity', name: 'Identity Access', icon: 'Shield', path: '/identity-access', microservice: 'identity-access', requiredPermission: 'read', category: 'security' },
  'user-role-management': { id: 'user-roles', name: 'User Role Management', icon: 'Users', path: '/user-roles', microservice: 'user-role-management', requiredPermission: 'read', category: 'security' },
  'catalog-management': { id: 'catalog', name: 'Catalog Management', icon: 'Package', path: '/catalog', microservice: 'catalog-management', requiredPermission: 'read', category: 'business' },
  'inventory-management': { id: 'inventory', name: 'Inventory Management', icon: 'Package', path: '/inventory', microservice: 'inventory-management', requiredPermission: 'read', category: 'business' },
  'order-management': { id: 'orders', name: 'Order Management', icon: 'ShoppingCart', path: '/orders', microservice: 'order-management', requiredPermission: 'read', category: 'business' },
  'customer-service': { id: 'customers', name: 'Customer Service', icon: 'Users', path: '/customer-service', microservice: 'customer-service', requiredPermission: 'read', category: 'business' },
  'marketplace-management': { id: 'marketplace', name: 'Marketplace Management', icon: 'Store', path: '/marketplace', microservice: 'marketplace-management', requiredPermission: 'read', category: 'business' },
  'payment-processing': { id: 'payments', name: 'Payment Processing', icon: 'CreditCard', path: '/payment-processing', microservice: 'payment-processing', requiredPermission: 'read', category: 'financial' },
  'accounting-management': { id: 'accounting', name: 'Accounting Management', icon: 'Calculator', path: '/accounting-management', microservice: 'accounting-management', requiredPermission: 'read', category: 'financial' },
  'expense-monitoring': { id: 'expenses', name: 'Expense Monitoring', icon: 'Receipt', path: '/expense-monitoring', microservice: 'expense-monitoring', requiredPermission: 'read', category: 'financial' },
  'shipping-delivery': { id: 'shipping', name: 'Shipping Delivery', icon: 'Truck', path: '/shipping', microservice: 'shipping-delivery', requiredPermission: 'read', category: 'operations' },
  'employee-management': { id: 'employees', name: 'Employee Management', icon: 'UserCheck', path: '/employees', microservice: 'employee-management', requiredPermission: 'read', category: 'operations' },
  'label-design': { id: 'labels', name: 'Label Design', icon: 'Tag', path: '/labels', microservice: 'label-design', requiredPermission: 'read', category: 'operations' },
  'analytics-reporting': { id: 'analytics', name: 'Analytics Reporting', icon: 'TrendingUp', path: '/analytics-reporting', microservice: 'analytics-reporting', requiredPermission: 'read', category: 'analytics' },
  'reporting-management': { id: 'reports', name: 'Reporting Management', icon: 'FileText', path: '/reports', microservice: 'reporting-management', requiredPermission: 'read', category: 'analytics' },
  'content-management': { id: 'content', name: 'Content Management', icon: 'FileText', path: '/content', microservice: 'content-management', requiredPermission: 'read', category: 'content' },
  'notification-service': { id: 'notifications', name: 'Notification Service', icon: 'Bell', path: '/notifications', microservice: 'notification-service', requiredPermission: 'read', category: 'content' },
  'multi-language-management': { id: 'languages', name: 'Multi-Language Management', icon: 'Globe', path: '/languages', microservice: 'multi-language-management', requiredPermission: 'read', category: 'content' },
  'performance-monitor': { id: 'performance', name: 'Performance Monitor', icon: 'Activity', path: '/performance', microservice: 'performance-monitor', requiredPermission: 'read', category: 'system' },
  'integration-hub': { id: 'integrations', name: 'Integration Hub', icon: 'Link', path: '/integrations', microservice: 'integration-hub', requiredPermission: 'read', category: 'system' },
  'compliance-audit': { id: 'compliance', name: 'Compliance Audit', icon: 'CheckCircle', path: '/compliance', microservice: 'compliance-audit', requiredPermission: 'read', category: 'system' }
};

export const usePermissionStore = create<PermissionState>((set, get) => ({
  userPermissions: {},
  availableSidebar: [],
  loading: false,

  loadUserPermissions: async (token: string) => {
    set({ loading: true });
    
    try {
      // First get user info to verify admin portal assignment
      const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
      const userResponse = await fetch(`${apiGateway}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (!userResponse.ok) {
        throw new Error('Token verification failed');
      }

      const userData = await userResponse.json();
      
      // Verify user is assigned to admin portal
      if (userData.user?.assignedApp?.toLowerCase() !== 'admin portal' && 
          userData.user?.assignedApp?.toLowerCase() !== 'admin') {
        throw new Error('User not assigned to Admin Portal');
      }

      // Get assigned microservices from Super Admin permission system
      const permissionsResponse = await fetch('/api/user-role-management/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (permissionsResponse.ok) {
        const permissionData = await permissionsResponse.json();
        const userPermissions = permissionData.data?.find((user: any) => 
          user.email === userData.user.email
        )?.permissions || [];

        // Convert permission array to microservice permissions object
        const microservicePermissions: Record<string, MicroservicePermission> = {};
        
        userPermissions.forEach((permission: string) => {
          microservicePermissions[permission] = {
            name: permission,
            create: true,
            read: true,
            update: true,
            delete: false // Default to read-only unless explicitly granted
          };
        });

        set({ 
          userPermissions: microservicePermissions,
          loading: false 
        });
        
        // Generate sidebar after loading permissions
        get().generateSidebar();
      } else {
        throw new Error('Failed to load user permissions');
      }
    } catch (error) {
      console.error('Failed to load user permissions:', error);
      set({ 
        userPermissions: {},
        availableSidebar: [],
        loading: false 
      });
    }
  },

  generateSidebar: () => {
    const { userPermissions } = get();
    
    // Always include dashboard
    const availableItems: SidebarItem[] = [
      {
        id: 'dashboard',
        name: 'Dashboard',
        icon: 'BarChart3',
        path: '/dashboard',
        microservice: 'general',
        requiredPermission: 'read',
        category: 'overview'
      }
    ];
    
    // Add microservices assigned by Super Admin
    Object.keys(userPermissions).forEach(microserviceName => {
      const definition = MICROSERVICE_DEFINITIONS[microserviceName];
      if (definition) {
        availableItems.push(definition);
      }
    });

    set({ availableSidebar: availableItems });
  },

  hasPermission: (microservice: string, operation: string): boolean => {
    const { userPermissions } = get();
    const servicePermissions = userPermissions[microservice];
    
    if (!servicePermissions) return false;
    const permission = servicePermissions[operation as keyof MicroservicePermission];
    return Boolean(permission);
  },
}));