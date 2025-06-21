"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  API: () => API,
  analyticsAPI: () => analyticsAPI,
  apiClient: () => apiClient,
  authAPI: () => authAPI,
  branchesAPI: () => branchesAPI,
  categoriesAPI: () => categoriesAPI,
  default: () => index_default,
  inventoryAPI: () => inventoryAPI,
  ordersAPI: () => ordersAPI,
  productsAPI: () => productsAPI,
  usersAPI: () => usersAPI
});
module.exports = __toCommonJS(index_exports);
var import_axios = __toESM(require("axios"));
var API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
var apiClient = import_axios.default.create({
  baseURL: API_BASE_URL,
  timeout: 1e4,
  headers: {
    "Content-Type": "application/json"
  }
});
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);
var authAPI = {
  login: (credentials) => apiClient.post("/api/auth/login", credentials),
  register: (userData) => apiClient.post("/api/auth/register", userData),
  logout: () => apiClient.post("/api/auth/logout"),
  getUser: () => apiClient.get("/api/auth/user")
};
var productsAPI = {
  getAll: (params) => apiClient.get("/api/products", { params }),
  getById: (id) => apiClient.get(`/api/products/${id}`),
  create: (product) => apiClient.post("/api/products", product),
  update: (id, product) => apiClient.put(`/api/products/${id}`, product),
  delete: (id) => apiClient.delete(`/api/products/${id}`)
};
var categoriesAPI = {
  getAll: () => apiClient.get("/api/categories"),
  getById: (id) => apiClient.get(`/api/categories/${id}`),
  create: (category) => apiClient.post("/api/categories", category),
  update: (id, category) => apiClient.put(`/api/categories/${id}`, category),
  delete: (id) => apiClient.delete(`/api/categories/${id}`)
};
var ordersAPI = {
  getAll: (params) => apiClient.get("/api/orders", { params }),
  getById: (id) => apiClient.get(`/api/orders/${id}`),
  create: (order) => apiClient.post("/api/orders", order),
  update: (id, order) => apiClient.put(`/api/orders/${id}`, order),
  updateStatus: (id, status) => apiClient.patch(`/api/orders/${id}/status`, { status })
};
var branchesAPI = {
  getAll: () => apiClient.get("/api/branches"),
  getById: (id) => apiClient.get(`/api/branches/${id}`),
  getNearby: (lat, lng, radius = 10) => apiClient.get("/api/branches/nearby", { params: { lat, lng, radius } })
};
var inventoryAPI = {
  getByBranch: (branchId) => apiClient.get(`/api/inventory/branch/${branchId}`),
  getByProduct: (productId) => apiClient.get(`/api/inventory/product/${productId}`),
  updateStock: (productId, branchId, quantity) => apiClient.put("/api/inventory/stock", { productId, branchId, quantity })
};
var usersAPI = {
  getProfile: () => apiClient.get("/api/users/profile"),
  updateProfile: (userData) => apiClient.put("/api/users/profile", userData),
  getAll: () => apiClient.get("/api/users"),
  getById: (id) => apiClient.get(`/api/users/${id}`),
  update: (id, userData) => apiClient.put(`/api/users/${id}`, userData),
  delete: (id) => apiClient.delete(`/api/users/${id}`)
};
var analyticsAPI = {
  getDashboard: (branchId) => apiClient.get("/api/analytics/dashboard", { params: { branchId } }),
  getSales: (startDate, endDate, branchId) => apiClient.get("/api/analytics/sales", { params: { startDate, endDate, branchId } }),
  getProducts: (branchId) => apiClient.get("/api/analytics/products", { params: { branchId } })
};
var API = {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  orders: ordersAPI,
  branches: branchesAPI,
  inventory: inventoryAPI,
  users: usersAPI,
  analytics: analyticsAPI
};
var index_default = API;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  API,
  analyticsAPI,
  apiClient,
  authAPI,
  branchesAPI,
  categoriesAPI,
  inventoryAPI,
  ordersAPI,
  productsAPI,
  usersAPI
});
