import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { API_ROUTES, env } from '@leafyhealth/config'

export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
}

export interface User {
  id: number
  email: string
  name: string
  role: string
  isActive: boolean
  preferredBranchId?: number
  currentBranchId?: number
}

export interface Product {
  id: number
  name: string
  description?: string
  sku: string
  price: string
  images?: string[]
  categoryId?: number
  stockQuantity: number
  isActive: boolean
  isFeatured: boolean
}

export interface Order {
  id: number
  orderNumber: string
  customerId: number
  branchId: number
  status: string
  totalAmount: string
  paymentStatus: string
  createdAt: string
}

export interface Branch {
  id: number
  name: string
  code: string
  address: string
  latitude: string
  longitude: string
  isActive: boolean
  operatingHours?: any
  deliveryRadius: number
}

class ApiClient {
  private api: AxiosInstance
  private token: string | null = null

  constructor(baseURL = env.NEXT_PUBLIC_API_GATEWAY_URL) {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`
      }
      return config
    })

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken()
          // Redirect to login if in browser
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  getStoredToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  // Initialize token from storage
  initializeAuth() {
    const storedToken = this.getStoredToken()
    if (storedToken) {
      this.token = storedToken
    }
  }

  // Authentication API (Identity & Access Service - Port 3010)
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.api.post(API_ROUTES.AUTH.LOGIN, credentials)
    if (response.data.token) {
      this.setToken(response.data.token)
    }
    return response.data
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.api.post(API_ROUTES.AUTH.REGISTER, userData)
    if (response.data.token) {
      this.setToken(response.data.token)
    }
    return response.data
  }

  async logout(): Promise<void> {
    try {
      await this.api.post(API_ROUTES.AUTH.LOGOUT)
    } finally {
      this.clearToken()
    }
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.api.get(API_ROUTES.AUTH.PROFILE)
    return response.data
  }

  // Products API (Catalog Management Service - Port 3020)
  async getProducts(params?: { branchId?: string; category?: string; search?: string }): Promise<ApiResponse<Product[]>> {
    const response = await this.api.get(API_ROUTES.PRODUCTS.LIST, { params })
    return response.data
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await this.api.get(API_ROUTES.PRODUCTS.DETAIL(id))
    return response.data
  }

  async searchProducts(query: string, branchId?: string): Promise<ApiResponse<Product[]>> {
    const response = await this.api.get(API_ROUTES.PRODUCTS.SEARCH, {
      params: { q: query, branchId }
    })
    return response.data
  }

  // Categories API (Catalog Management Service - Port 3020)
  async getCategories(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get(API_ROUTES.CATEGORIES.LIST)
    return response.data
  }

  // Orders API (Order Management Service - Port 3022)
  async createOrder(orderData: any): Promise<ApiResponse<Order>> {
    const response = await this.api.post(API_ROUTES.ORDERS.CREATE, orderData)
    return response.data
  }

  async getOrders(params?: { status?: string; branchId?: string }): Promise<ApiResponse<Order[]>> {
    const response = await this.api.get(API_ROUTES.ORDERS.LIST, { params })
    return response.data
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    const response = await this.api.get(API_ROUTES.ORDERS.DETAIL(id))
    return response.data
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    const response = await this.api.patch(API_ROUTES.ORDERS.UPDATE_STATUS(id), { status })
    return response.data
  }

  // Inventory API (Inventory Management Service - Port 3021)
  async getBranchInventory(branchId: string): Promise<ApiResponse<any[]>> {
    const response = await this.api.get(API_ROUTES.INVENTORY.BRANCH_STOCK(branchId))
    return response.data
  }

  async getInventoryLevels(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get(API_ROUTES.INVENTORY.LEVELS)
    return response.data
  }

  // Branches API (Multi-service endpoints)
  async getBranches(): Promise<ApiResponse<Branch[]>> {
    const response = await this.api.get(API_ROUTES.BRANCHES.LIST)
    return response.data
  }

  async getNearestBranch(latitude: number, longitude: number): Promise<ApiResponse<Branch>> {
    const response = await this.api.get(API_ROUTES.BRANCHES.NEAREST, {
      params: { lat: latitude, lng: longitude }
    })
    return response.data
  }

  async getBranch(id: string): Promise<ApiResponse<Branch>> {
    const response = await this.api.get(API_ROUTES.BRANCHES.DETAIL(id))
    return response.data
  }

  // Payments API (Payment Processing Service - Port 3023)
  async processPayment(paymentData: any): Promise<ApiResponse<any>> {
    const response = await this.api.post(API_ROUTES.PAYMENTS.PROCESS, paymentData)
    return response.data
  }

  async getPaymentHistory(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get(API_ROUTES.PAYMENTS.HISTORY)
    return response.data
  }

  // Notifications API (Notification Service - Port 3024)
  async getNotifications(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get(API_ROUTES.NOTIFICATIONS.LIST)
    return response.data
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.patch(API_ROUTES.NOTIFICATIONS.MARK_READ(id))
    return response.data
  }

  // Analytics API (Analytics & Reporting Service - Port 3033)
  async getDashboardData(): Promise<ApiResponse<any>> {
    const response = await this.api.get(API_ROUTES.ANALYTICS.DASHBOARD)
    return response.data
  }

  async getSalesAnalytics(params?: { period?: string; branchId?: string }): Promise<ApiResponse<any>> {
    const response = await this.api.get(API_ROUTES.ANALYTICS.SALES, { params })
    return response.data
  }

  // Generic request method for custom endpoints
  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.request(config)
    return response.data
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient()

// Initialize auth on import (browser only)
if (typeof window !== 'undefined') {
  apiClient.initializeAuth()
}

export default apiClient