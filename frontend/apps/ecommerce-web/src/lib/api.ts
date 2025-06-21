function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
}

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}, retries = 3) {
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

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (response.status === 502 && attempt < retries) {
          // Service starting up, wait and retry
          console.log(`Service starting up, retrying in ${attempt * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          continue;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`API request failed (attempt ${attempt}/${retries}):`, error);
        
        if (attempt === retries) {
          // After all retries failed, throw the error
          throw error;
        }
        
        // Wait before retrying on network errors
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      }
    }
  }

  async getProducts(params?: URLSearchParams, branchId?: string) {
    const queryString = params ? `?${params.toString()}` : '';
    const endpoint = branchId 
      ? `/api/products${queryString}&branchId=${branchId}`
      : `/api/products${queryString}`;
    
    return this.request(endpoint);
  }

  async getCategories() {
    return this.request('/api/categories');
  }

  async getBranches() {
    return this.request('/api/branches');
  }

  async getProduct(id: string) {
    return this.request(`/api/products/${id}`);
  }

  async login(email: string, password: string) {
    return this.request('/api/auth/internal/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getOrders(branchId?: string) {
    const endpoint = branchId 
      ? `/api/direct-data/orders?branchId=${branchId}`
      : '/api/direct-data/orders';
    return this.request(endpoint);
  }

  async createOrder(orderData: any) {
    return this.request('/api/direct-data/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getInventory(branchId?: string) {
    const endpoint = branchId 
      ? `/api/direct-data/inventory?branchId=${branchId}`
      : '/api/direct-data/inventory';
    return this.request(endpoint);
  }

  async processPayment(paymentData: any) {
    return this.request('/api/payment-processing/process', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);