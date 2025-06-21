"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  config: () => config,
  default: () => index_default,
  roleRoutes: () => roleRoutes,
  routes: () => routes
});
module.exports = __toCommonJS(index_exports);
var config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  APP_NAME: "LeafyHealth",
  APP_VERSION: "1.0.0",
  // Feature flags
  FEATURES: {
    ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
    MULTI_BRANCH_ENABLED: true,
    PWA_ENABLED: process.env.NEXT_PUBLIC_PWA_ENABLED === "true",
    LOCATION_SERVICES: true
  },
  // API endpoints
  ENDPOINTS: {
    AUTH: "/api/auth",
    PRODUCTS: "/api/products",
    CATEGORIES: "/api/categories",
    ORDERS: "/api/orders",
    BRANCHES: "/api/branches",
    INVENTORY: "/api/inventory",
    USERS: "/api/users",
    ANALYTICS: "/api/analytics"
  },
  // UI Configuration
  UI: {
    THEME: {
      PRIMARY_COLOR: "green",
      BRAND_COLORS: {
        50: "#f0fdf4",
        100: "#dcfce7",
        200: "#bbf7d0",
        300: "#86efac",
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d"
      }
    },
    ANIMATIONS: {
      ENABLED: true,
      DURATION: 300
    },
    GLASSMORPHISM: {
      ENABLED: true,
      BLUR_STRENGTH: "lg",
      TRANSPARENCY: 0.1
    }
  },
  // Business configuration
  BUSINESS: {
    CURRENCY: "USD",
    CURRENCY_SYMBOL: "$",
    TAX_RATE: 0.08,
    DELIVERY_FEE: 5.99,
    FREE_DELIVERY_THRESHOLD: 50,
    MAX_CART_ITEMS: 50,
    ORDER_STATUSES: [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "out_for_delivery",
      "delivered",
      "cancelled"
    ]
  },
  // Map configuration
  MAPS: {
    DEFAULT_CENTER: {
      lat: 40.7128,
      lng: -74.006
    },
    DEFAULT_ZOOM: 12,
    SEARCH_RADIUS: 25
    // kilometers
  },
  // File upload limits
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    // 5MB
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"]
  },
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
  },
  // Cache configuration
  CACHE: {
    PRODUCTS_TTL: 5 * 60 * 1e3,
    // 5 minutes
    CATEGORIES_TTL: 30 * 60 * 1e3,
    // 30 minutes
    BRANCHES_TTL: 60 * 60 * 1e3
    // 1 hour
  }
};
var routes = {
  // Public routes
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/[id]",
  CATEGORIES: "/categories",
  BRANCHES: "/branches",
  ABOUT: "/about",
  CONTACT: "/contact",
  // Auth routes
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  // Customer routes
  PROFILE: "/profile",
  ORDERS: "/orders",
  ORDER_DETAIL: "/orders/[id]",
  CART: "/cart",
  CHECKOUT: "/checkout",
  FAVORITES: "/favorites",
  // Staff routes
  STAFF_DASHBOARD: "/staff",
  STAFF_ORDERS: "/staff/orders",
  STAFF_INVENTORY: "/staff/inventory",
  // Manager routes
  MANAGER_DASHBOARD: "/manager",
  MANAGER_ANALYTICS: "/manager/analytics",
  MANAGER_STAFF: "/manager/staff",
  MANAGER_INVENTORY: "/manager/inventory",
  // Admin routes
  ADMIN_DASHBOARD: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_BRANCHES: "/admin/branches",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ANALYTICS: "/admin/analytics",
  // Super Admin routes
  SUPER_ADMIN_DASHBOARD: "/super-admin",
  SUPER_ADMIN_SYSTEM: "/super-admin/system",
  SUPER_ADMIN_USERS: "/super-admin/users",
  SUPER_ADMIN_BRANCHES: "/super-admin/branches"
};
var roleRoutes = {
  customer: [
    routes.HOME,
    routes.PRODUCTS,
    routes.CATEGORIES,
    routes.BRANCHES,
    routes.PROFILE,
    routes.ORDERS,
    routes.CART,
    routes.CHECKOUT,
    routes.FAVORITES
  ],
  staff: [
    routes.STAFF_DASHBOARD,
    routes.STAFF_ORDERS,
    routes.STAFF_INVENTORY
  ],
  manager: [
    routes.MANAGER_DASHBOARD,
    routes.MANAGER_ANALYTICS,
    routes.MANAGER_STAFF,
    routes.MANAGER_INVENTORY
  ],
  admin: [
    routes.ADMIN_DASHBOARD,
    routes.ADMIN_USERS,
    routes.ADMIN_PRODUCTS,
    routes.ADMIN_CATEGORIES,
    routes.ADMIN_BRANCHES,
    routes.ADMIN_ORDERS,
    routes.ADMIN_ANALYTICS
  ],
  super_admin: [
    routes.SUPER_ADMIN_DASHBOARD,
    routes.SUPER_ADMIN_SYSTEM,
    routes.SUPER_ADMIN_USERS,
    routes.SUPER_ADMIN_BRANCHES
  ]
};
var index_default = config;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config,
  roleRoutes,
  routes
});
