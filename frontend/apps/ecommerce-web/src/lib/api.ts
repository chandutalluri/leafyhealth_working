// Centralized API Gateway - All requests must go through port 8080
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: Always use centralized API gateway
    return 'http://localhost:8080';
  }
  // Server-side: Also use centralized API gateway
  return process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
};

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'same-origin',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // If the main API fails, try fallback for essential endpoints
      if (endpoint.includes('/api/products') || endpoint.includes('/api/categories')) {
        console.warn('Using fallback data due to API connection issues');
        return this.getFallbackData(endpoint);
      }
      
      throw error;
    }
  }

  private getFallbackData(endpoint: string) {
    if (endpoint.includes('/api/products')) {
      return {
        success: false,
        data: [],
        error: 'Please select a branch to view available products',
        message: 'Branch selection required for product availability'
      };
    }
    
    if (endpoint.includes('/api/categories')) {
      return {
        success: true,
        data: [
          { id: 1, name: "Leafy Greens", slug: "leafy-greens" },
          { id: 2, name: "Vegetables", slug: "vegetables" },
          { id: 3, name: "Fruits", slug: "fruits" }
        ]
      };
    }

    return { success: false, error: 'API temporarily unavailable' };
  }

  async getProducts(params?: URLSearchParams, branchId?: string) {
    // Route through centralized gateway to catalog-management service
    const queryParams = new URLSearchParams(params || {});
    
    if (branchId) {
      queryParams.set('branchId', branchId);
    }
    
    const endpoint = queryParams.toString() ? `/api/catalog-management/products?${queryParams.toString()}` : '/api/catalog-management/products';
    return this.request(endpoint);
  }

  async getCategories() {
    // Route through centralized gateway to catalog-management service
    return this.request('/api/catalog-management/categories');
  }

  async getBranches() {
    // Route through centralized gateway to company-management service
    return this.request('/api/company-management/branches');
  }

  async getProduct(id: string) {
    // Route through centralized gateway to catalog-management service
    return this.request(`/api/catalog-management/products/${id}`);
  }

  async login(email: string, password: string) {
    // Route through centralized gateway to identity-access service
    return this.request('/api/identity-access/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getOrders(branchId?: string) {
    // Route through centralized gateway to order-management service
    const endpoint = branchId ? `/api/order-management/orders?branchId=${branchId}` : '/api/order-management/orders';
    return this.request(endpoint);
  }

  async createOrder(orderData: any) {
    // Route through centralized gateway to order-management service
    return this.request('/api/order-management/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getInventory(branchId?: string) {
    // Route through centralized gateway to inventory-management service
    const endpoint = branchId ? `/api/inventory-management/inventory?branchId=${branchId}` : '/api/inventory-management/inventory';
    return this.request(endpoint);
  }

  async processPayment(paymentData: any) {
    // Route through centralized gateway to payment-processing service
    return this.request('/api/payment-processing/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);