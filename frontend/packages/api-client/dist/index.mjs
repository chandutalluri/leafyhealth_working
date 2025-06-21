// src/index.ts
import axios from "axios";
var API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
var apiClient = axios.create({
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
export {
  API,
  analyticsAPI,
  apiClient,
  authAPI,
  branchesAPI,
  categoriesAPI,
  index_default as default,
  inventoryAPI,
  ordersAPI,
  productsAPI,
  usersAPI
};
