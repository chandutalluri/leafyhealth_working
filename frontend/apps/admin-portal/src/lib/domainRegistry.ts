import { Package, ShoppingBag, Warehouse, CreditCard, Users, BarChart, Calculator, UserCheck, Truck, Building, MessageSquare, FileText, Tag, Globe, Shield, Zap, Settings } from 'lucide-react';

export interface DomainConfig {
  name: string;
  label: string;
  icon: any;
  route: string;
  description: string;
  category: string;
  requiredPermissions: string[];
  component?: any;
}

export const DOMAIN_REGISTRY: Record<string, DomainConfig> = {
  'catalog-management': {
    name: 'catalog-management',
    label: 'Product Catalog',
    icon: Package,
    route: '/catalog',
    description: 'Manage products, categories, and inventory items',
    category: 'operations',
    requiredPermissions: ['read']
  },
  'order-management': {
    name: 'order-management',
    label: 'Order Management',
    icon: ShoppingBag,
    route: '/orders',
    description: 'Process orders, manage fulfillment, and track deliveries',
    category: 'operations',
    requiredPermissions: ['read']
  },
  'inventory-management': {
    name: 'inventory-management',
    label: 'Inventory Management',
    icon: Warehouse,
    route: '/inventory',
    description: 'Track stock levels, manage warehouses, and monitor supply',
    category: 'operations',
    requiredPermissions: ['read']
  },
  'payment-processing': {
    name: 'payment-processing',
    label: 'Payment Processing',
    icon: CreditCard,
    route: '/payments',
    description: 'Process payments, handle refunds, and manage transactions',
    category: 'financial',
    requiredPermissions: ['read']
  },
  'customer-service': {
    name: 'customer-service',
    label: 'Customer Service',
    icon: Users,
    route: '/customers',
    description: 'Manage customer relationships and support tickets',
    category: 'customer',
    requiredPermissions: ['read']
  },
  'analytics-reporting': {
    name: 'analytics-reporting',
    label: 'Analytics & Reports',
    icon: BarChart,
    route: '/analytics',
    description: 'Business intelligence, KPI dashboards, and metrics',
    category: 'analytics',
    requiredPermissions: ['read']
  },
  'accounting-management': {
    name: 'accounting-management',
    label: 'Accounting',
    icon: Calculator,
    route: '/accounting',
    description: 'Financial management, general ledger, and reporting',
    category: 'financial',
    requiredPermissions: ['read']
  },
  'employee-management': {
    name: 'employee-management',
    label: 'Employee Management',
    icon: UserCheck,
    route: '/employees',
    description: 'HR management, payroll, and performance evaluation',
    category: 'administration',
    requiredPermissions: ['read']
  },
  'shipping-delivery': {
    name: 'shipping-delivery',
    label: 'Shipping & Delivery',
    icon: Truck,
    route: '/shipping',
    description: 'Logistics management, tracking, and carrier integration',
    category: 'operations',
    requiredPermissions: ['read']
  },

};

export const CATEGORIES = {
  operations: {
    label: 'Operations',
    description: 'Core business operations and processes'
  },
  financial: {
    label: 'Financial',
    description: 'Financial management and accounting'
  },
  customer: {
    label: 'Customer',
    description: 'Customer relationship and service management'
  },
  analytics: {
    label: 'Analytics',
    description: 'Business intelligence and reporting'
  },
  administration: {
    label: 'Administration',
    description: 'System administration and HR management'
  }
};

export function getDomainsByCategory(category: string): DomainConfig[] {
  return Object.values(DOMAIN_REGISTRY).filter(domain => domain.category === category);
}

export function getAllCategories(): string[] {
  return Object.keys(CATEGORIES);
}

export function getCategoryLabel(category: string): string {
  return CATEGORIES[category as keyof typeof CATEGORIES]?.label || category;
}