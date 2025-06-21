import React from 'react';
import { 
  Package, Warehouse, ShoppingBag, CreditCard, Users, 
  BarChart, Calculator, UserCheck, Truck, Settings,
  FileText, Shield, Layers, Tag, Building, Activity,
  Monitor, Bell, HeadphonesIcon
} from 'lucide-react';

export interface DomainMeta {
  label: string;
  icon: React.ComponentType<any>;
  component: React.LazyExoticComponent<React.ComponentType>;
  route: string;
  description: string;
  servicePort: number;
  category: 'core' | 'operations' | 'analytics' | 'management';
}

export const DOMAIN_REGISTRY: Record<string, DomainMeta> = {
  // Core Business Operations
  'catalog-management': {
    label: 'Product Catalog',
    icon: Package,
    component: React.lazy(() => import('./components/CatalogPage')),
    route: '/catalog',
    description: 'Manage products, categories, and inventory items',
    servicePort: 3020,
    category: 'core'
  },
  'inventory-management': {
    label: 'Inventory Management', 
    icon: Warehouse,
    component: React.lazy(() => import('./components/InventoryPage')),
    route: '/inventory',
    description: 'Track stock levels, manage suppliers, and handle restocking',
    servicePort: 3021,
    category: 'core'
  },
  'order-management': {
    label: 'Order Management',
    icon: ShoppingBag, 
    component: React.lazy(() => import('./components/OrdersPage')),
    route: '/orders',
    description: 'Process orders, manage fulfillment, and track deliveries',
    servicePort: 3022,
    category: 'core'
  },
  'payment-processing': {
    label: 'Payment Processing',
    icon: CreditCard,
    component: React.lazy(() => import('./components/PaymentsPage')),
    route: '/payments', 
    description: 'Handle transactions, refunds, and payment methods',
    servicePort: 3023,
    category: 'core'
  },
  'notification-service': {
    label: 'Notifications',
    icon: Bell,
    component: React.lazy(() => import('./components/NotificationsPage')),
    route: '/notifications',
    description: 'Manage alerts, messages, and customer communications',
    servicePort: 3024,
    category: 'operations'
  },

  // Customer & Staff Management
  'customer-service': {
    label: 'Customer Service',
    icon: HeadphonesIcon,
    component: React.lazy(() => import('./components/CustomersPage')),
    route: '/customers',
    description: 'Manage customer accounts, support tickets, and communications',
    servicePort: 3031,
    category: 'management'
  },
  'employee-management': {
    label: 'Employee Management',
    icon: UserCheck,
    component: React.lazy(() => import('./components/EmployeesPage')),
    route: '/employees',
    description: 'Staff management, schedules, and HR functions',
    servicePort: 3036,
    category: 'management'
  },

  // Financial Management
  'accounting-management': {
    label: 'Accounting',
    icon: Calculator,
    component: React.lazy(() => import('./components/AccountingPage')),
    route: '/accounting',
    description: 'Financial management, invoicing, and expense tracking',
    servicePort: 3032,
    category: 'management'
  },
  'expense-monitoring': {
    label: 'Expense Monitoring',
    icon: FileText,
    component: React.lazy(() => import('./components/ExpensePage')),
    route: '/expenses',
    description: 'Monitor operational costs and budget management',
    servicePort: 3037,
    category: 'management'
  },

  // Analytics & Reporting
  'analytics-reporting': {
    label: 'Analytics & Reports',
    icon: BarChart,
    component: React.lazy(() => import('./components/AnalyticsPage')),
    route: '/analytics',
    description: 'Business intelligence, KPIs, and performance metrics',
    servicePort: 3033,
    category: 'analytics'
  },
  'performance-monitor': {
    label: 'Performance Monitor',
    icon: Monitor,
    component: React.lazy(() => import('./components/PerformancePage')),
    route: '/performance',
    description: 'System performance tracking and optimization',
    servicePort: 3041,
    category: 'analytics'
  },

  // Operations & Logistics
  'shipping-delivery': {
    label: 'Shipping & Delivery',
    icon: Truck,
    component: React.lazy(() => import('./components/ShippingPage')),
    route: '/shipping',
    description: 'Delivery management, logistics, and tracking',
    servicePort: 3042,
    category: 'operations'
  },
  'marketplace-management': {
    label: 'Marketplace',
    icon: Building,
    component: React.lazy(() => import('./components/MarketplacePage')),
    route: '/marketplace',
    description: 'Multi-vendor marketplace and partner management',
    servicePort: 3040,
    category: 'operations'
  },

  // System Management
  'compliance-audit': {
    label: 'Compliance & Audit',
    icon: Shield,
    component: React.lazy(() => import('./components/CompliancePage')),
    route: '/compliance',
    description: 'Regulatory compliance, audits, and security monitoring',
    servicePort: 3034,
    category: 'management'
  },
  'content-management': {
    label: 'Content Management',
    icon: Layers,
    component: React.lazy(() => import('./components/ContentPage')),
    route: '/content',
    description: 'Manage website content, blogs, and marketing materials',
    servicePort: 3035,
    category: 'management'
  },
  'label-design': {
    label: 'Label Design',
    icon: Tag,
    component: React.lazy(() => import('./components/LabelPage')),
    route: '/labels',
    description: 'Product label design and packaging management',
    servicePort: 3039,
    category: 'operations'
  },
  'integration-hub': {
    label: 'Integration Hub',
    icon: Settings,
    component: React.lazy(() => import('./components/IntegrationPage')),
    route: '/integrations',
    description: 'Third-party integrations and API management',
    servicePort: 3038,
    category: 'management'
  }
};

export function getDomainMeta(domain: string): DomainMeta | undefined {
  return DOMAIN_REGISTRY[domain];
}

export function getAvailableDomains(userDomains: string[]): DomainMeta[] {
  return userDomains
    .map(domain => DOMAIN_REGISTRY[domain])
    .filter(Boolean);
}

export function getDomainsByCategory(userDomains: string[], category: string): DomainMeta[] {
  return getAvailableDomains(userDomains)
    .filter(domain => domain.category === category);
}

export function getAllCategories(): string[] {
  return ['core', 'operations', 'analytics', 'management'];
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    core: 'Core Business',
    operations: 'Operations',
    analytics: 'Analytics & Reports',
    management: 'Management'
  };
  return labels[category] || category;
}