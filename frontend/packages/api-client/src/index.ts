import axios from 'axios'

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

// Authentication API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/api/auth/login', credentials),
  
  register: (userData: { email: string; password: string; name: string }) =>
    apiClient.post('/api/auth/register', userData),
  
  logout: () =>
    apiClient.post('/api/auth/logout'),
  
  getUser: () =>
    apiClient.get('/api/auth/user'),
}

// Products API
export const productsAPI = {
  getAll: (params?: { category?: string; search?: string; branch?: string }) =>
    apiClient.get('/api/products', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/api/products/${id}`),
  
  create: (product: any) =>
    apiClient.post('/api/products', product),
  
  update: (id: string, product: any) =>
    apiClient.put(`/api/products/${id}`, product),
  
  delete: (id: string) =>
    apiClient.delete(`/api/products/${id}`),
}

// Categories API
export const categoriesAPI = {
  getAll: () =>
    apiClient.get('/api/categories'),
  
  getById: (id: string) =>
    apiClient.get(`/api/categories/${id}`),
  
  create: (category: any) =>
    apiClient.post('/api/categories', category),
  
  update: (id: string, category: any) =>
    apiClient.put(`/api/categories/${id}`, category),
  
  delete: (id: string) =>
    apiClient.delete(`/api/categories/${id}`),
}

// Orders API
export const ordersAPI = {
  getAll: (params?: { status?: string; branch?: string }) =>
    apiClient.get('/api/orders', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/api/orders/${id}`),
  
  create: (order: any) =>
    apiClient.post('/api/orders', order),
  
  update: (id: string, order: any) =>
    apiClient.put(`/api/orders/${id}`, order),
  
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/api/orders/${id}/status`, { status }),
}

// Branches API
export const branchesAPI = {
  getAll: () =>
    apiClient.get('/api/branches'),
  
  getById: (id: string) =>
    apiClient.get(`/api/branches/${id}`),
  
  getNearby: (lat: number, lng: number, radius: number = 10) =>
    apiClient.get('/api/branches/nearby', { params: { lat, lng, radius } }),
}

// Inventory API
export const inventoryAPI = {
  getByBranch: (branchId: string) =>
    apiClient.get(`/api/inventory/branch/${branchId}`),
  
  getByProduct: (productId: string) =>
    apiClient.get(`/api/inventory/product/${productId}`),
  
  updateStock: (productId: string, branchId: string, quantity: number) =>
    apiClient.put('/api/inventory/stock', { productId, branchId, quantity }),
}

// User management API
export const usersAPI = {
  getProfile: () =>
    apiClient.get('/api/users/profile'),
  
  updateProfile: (userData: any) =>
    apiClient.put('/api/users/profile', userData),
  
  getAll: () =>
    apiClient.get('/api/users'),
  
  getById: (id: string) =>
    apiClient.get(`/api/users/${id}`),
  
  update: (id: string, userData: any) =>
    apiClient.put(`/api/users/${id}`, userData),
  
  delete: (id: string) =>
    apiClient.delete(`/api/users/${id}`),
}

// Analytics API
export const analyticsAPI = {
  getDashboard: (branchId?: string) =>
    apiClient.get('/api/analytics/dashboard', { params: { branchId } }),
  
  getSales: (startDate: string, endDate: string, branchId?: string) =>
    apiClient.get('/api/analytics/sales', { params: { startDate, endDate, branchId } }),
  
  getProducts: (branchId?: string) =>
    apiClient.get('/api/analytics/products', { params: { branchId } }),
}

// Export all APIs
export const API = {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  orders: ordersAPI,
  branches: branchesAPI,
  inventory: inventoryAPI,
  users: usersAPI,
  analytics: analyticsAPI,
}

export default API