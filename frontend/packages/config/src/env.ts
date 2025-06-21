import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'preview', 'production']).default('development'),
  NEXT_PUBLIC_API_GATEWAY_URL: z.string().default('http://localhost:8080'),
  NEXT_PUBLIC_APP_NAME: z.string().default('LeafyHealth'),
  NEXT_PUBLIC_BRANCH_ID: z.string().optional(),
})

export const env = envSchema.parse(process.env)

// API Routes Aligned with Your 19 Microservices Backend (Ports 3010-3042)
export const API_ROUTES = {
  // Identity & Access Service (Port 3010)
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    REFRESH: '/api/auth/refresh'
  },
  
  // User Role Management Service (Port 3011)
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
    ROLES: '/api/users/roles',
    PERMISSIONS: '/api/users/permissions'
  },

  // Catalog Management Service (Port 3020)
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: (id: string) => `/api/products/${id}`,
    SEARCH: '/api/products/search',
    CREATE: '/api/products',
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`
  },

  CATEGORIES: {
    LIST: '/api/categories',
    DETAIL: (id: string) => `/api/categories/${id}`,
    CREATE: '/api/categories',
    UPDATE: (id: string) => `/api/categories/${id}`
  },

  // Inventory Management Service (Port 3021)
  INVENTORY: {
    LEVELS: '/api/inventory',
    LOW_STOCK: '/api/inventory/low-stock',
    UPDATE: (id: string) => `/api/inventory/${id}`,
    BRANCH_STOCK: (branchId: string) => `/api/inventory/branch/${branchId}`,
    STOCK_ALERTS: '/api/inventory/alerts'
  },

  // Order Management Service (Port 3022)
  ORDERS: {
    LIST: '/api/orders',
    CREATE: '/api/orders',
    DETAIL: (id: string) => `/api/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/api/orders/${id}/status`,
    CANCEL: (id: string) => `/api/orders/${id}/cancel`,
    HISTORY: '/api/orders/history'
  },

  // Payment Processing Service (Port 3023)
  PAYMENTS: {
    PROCESS: '/api/payments/process',
    HISTORY: '/api/payments',
    REFUND: (id: string) => `/api/payments/${id}/refund`,
    METHODS: '/api/payments/methods',
    VERIFY: (id: string) => `/api/payments/${id}/verify`
  },

  // Notification Service (Port 3024)
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    SEND: '/api/notifications/send',
    TEMPLATES: '/api/notifications/templates',
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
    PREFERENCES: '/api/notifications/preferences'
  },

  // Customer Service (Port 3031)
  CUSTOMERS: {
    LIST: '/api/customers',
    PROFILE: (id: string) => `/api/customers/${id}`,
    SUPPORT_TICKETS: '/api/customers/support',
    LOYALTY: '/api/customers/loyalty',
    ADDRESSES: '/api/customers/addresses'
  },

  // Accounting Management Service (Port 3032)
  ACCOUNTING: {
    TRANSACTIONS: '/api/accounting/transactions',
    REPORTS: '/api/accounting/reports',
    RECONCILIATION: '/api/accounting/reconciliation',
    TAX_REPORTS: '/api/accounting/tax'
  },

  // Analytics & Reporting Service (Port 3033)
  ANALYTICS: {
    DASHBOARD: '/api/analytics/dashboard',
    SALES: '/api/analytics/sales',
    INVENTORY: '/api/analytics/inventory',
    CUSTOMERS: '/api/analytics/customers',
    PERFORMANCE: '/api/analytics/performance',
    REAL_TIME: '/api/analytics/realtime'
  },

  // Compliance & Audit Service (Port 3034)
  COMPLIANCE: {
    AUDIT_LOGS: '/api/compliance/audit',
    REPORTS: '/api/compliance/reports',
    POLICIES: '/api/compliance/policies'
  },

  // Content Management Service (Port 3035)
  CONTENT: {
    BANNERS: '/api/content/banners',
    PROMOTIONS: '/api/content/promotions',
    PAGES: '/api/content/pages',
    MEDIA: '/api/content/media'
  },

  // Employee Management Service (Port 3036)
  EMPLOYEES: {
    LIST: '/api/employees',
    PROFILE: (id: string) => `/api/employees/${id}`,
    SCHEDULES: '/api/employees/schedules',
    PERFORMANCE: '/api/employees/performance'
  },

  // Expense Monitoring Service (Port 3037)
  EXPENSES: {
    LIST: '/api/expenses',
    CREATE: '/api/expenses',
    REPORTS: '/api/expenses/reports',
    CATEGORIES: '/api/expenses/categories'
  },

  // Integration Hub Service (Port 3038)
  INTEGRATIONS: {
    THIRD_PARTY: '/api/integrations/third-party',
    WEBHOOKS: '/api/integrations/webhooks',
    API_KEYS: '/api/integrations/api-keys'
  },

  // Label Design Service (Port 3039)
  LABELS: {
    DESIGNS: '/api/labels/designs',
    GENERATE: '/api/labels/generate',
    TEMPLATES: '/api/labels/templates'
  },

  // Marketplace Management Service (Port 3040)
  MARKETPLACE: {
    VENDORS: '/api/marketplace/vendors',
    LISTINGS: '/api/marketplace/listings',
    COMMISSIONS: '/api/marketplace/commissions'
  },

  // Performance Monitor Service (Port 3041)
  PERFORMANCE: {
    METRICS: '/api/performance/metrics',
    HEALTH: '/api/performance/health',
    ALERTS: '/api/performance/alerts'
  },

  // Shipping & Delivery Service (Port 3042)
  SHIPPING: {
    TRACKING: '/api/shipping/tracking',
    RATES: '/api/shipping/rates',
    LABELS: '/api/shipping/labels',
    PROVIDERS: '/api/shipping/providers'
  },

  // Branch Operations (Multi-service endpoints)
  BRANCHES: {
    LIST: '/api/branches',
    NEAREST: '/api/branches/nearest',
    DETAIL: (id: string) => `/api/branches/${id}`,
    INVENTORY: (id: string) => `/api/branches/${id}/inventory`,
    ORDERS: (id: string) => `/api/branches/${id}/orders`
  }
} as const

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  EXECUTIVE: 'executive'
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// Service Port Mapping (for direct service communication if needed)
export const SERVICE_PORTS = {
  'identity-access': 3010,
  'user-role-management': 3011,
  'catalog-management': 3020,
  'inventory-management': 3021,
  'order-management': 3022,
  'payment-processing': 3023,
  'notification-service': 3024,
  'customer-service': 3031,
  'accounting-management': 3032,
  'analytics-reporting': 3033,
  'compliance-audit': 3034,
  'content-management': 3035,
  'employee-management': 3036,
  'expense-monitoring': 3037,
  'integration-hub': 3038,
  'label-design': 3039,
  'marketplace-management': 3040,
  'performance-monitor': 3041,
  'shipping-delivery': 3042
} as const