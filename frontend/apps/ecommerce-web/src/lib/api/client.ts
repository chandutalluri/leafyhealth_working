// API Client Configuration - All requests through centralized gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';

export const apiClient = {
  // Basic endpoints (Direct Data Gateway)
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },

  // Enhanced endpoints
  getProducts: async (params?: any) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiClient.get(`/products${queryString}`);
  },

  getOrders: async () => {
    return apiClient.get('/api/order-management/orders');
  },

  getBranches: async () => {
    return apiClient.get('/branches');
  },

  getCategories: async () => {
    return apiClient.get('/categories');
  },

  // Microservice endpoints through centralized gateway
  orders: {
    create: async (orderData: any) => {
      return apiClient.post('/api/order-management/orders', orderData);
    },

    getByCustomer: async (customerId: string) => {
      return apiClient.get(`/api/order-management/orders/customer/${customerId}`);
    },

    getById: async (orderId: string) => {
      return apiClient.get(`/api/order-management/orders/${orderId}`);
    }
  },

  payments: {
    createRazorpay: async (paymentData: any) => {
      return apiClient.post('/api/payment-processing/payments/razorpay/create', paymentData);
    },

    verifyRazorpay: async (verificationData: any) => {
      return apiClient.post('/api/payment-processing/payments/razorpay/verify', verificationData);
    }
  },

  subscriptions: {
    getAll: async () => {
      return apiClient.get('/api/subscription-management/subscriptions');
    },

    create: async (subscriptionData: any) => {
      return apiClient.post('/api/subscription-management/subscriptions', subscriptionData);
    },

    pause: async (subscriptionId: string) => {
      const response = await fetch(`${API_BASE_URL}/api/subscription-management/subscriptions/${subscriptionId}/pause`, {
        method: 'PUT'
      });
      return response.json();
    }
  },

  notifications: {
    send: async (notificationData: any) => {
      return apiClient.post('/api/notification-service/notifications', notificationData);
    }
  },

  inventory: {
    checkStock: async (productId: string, branchId: string) => {
      return apiClient.get(`/api/inventory-management/inventory/check-stock?productId=${productId}&branchId=${branchId}`);
    },

    getStock: async (branchId: string) => {
      return apiClient.get(`/api/inventory-management/inventory/branch/${branchId}`);
    }
  },

  customerService: {
    createTicket: async (ticketData: any) => {
      return apiClient.post('/api/customer-service/tickets', ticketData);
    },

    getTickets: async (customerId: string) => {
      return apiClient.get(`/api/customer-service/tickets/customer/${customerId}`);
    }
  },

  analytics: {
    trackEvent: async (eventData: any) => {
      return apiClient.post('/api/analytics-reporting/events', eventData);
    },

    getReports: async () => {
      return apiClient.get('/api/analytics-reporting/reports');
    }
  },

  catalog: {
    getProducts: async (filters?: any) => {
      const params = filters ? '?' + new URLSearchParams(filters).toString() : '';
      return apiClient.get(`/api/catalog-management/products${params}`);
    },

    getCategories: async () => {
      return apiClient.get('/api/catalog-management/categories');
    },

    searchProducts: async (query: string) => {
      return apiClient.get(`/api/catalog-management/search?q=${encodeURIComponent(query)}`);
    }
  },

  content: {
    getPages: async () => {
      return apiClient.get('/api/content-management/pages');
    },

    getPage: async (slug: string) => {
      return apiClient.get(`/api/content-management/pages/${slug}`);
    },

    getBanners: async () => {
      return apiClient.get('/api/content-management/banners');
    }
  },

  multiLanguage: {
    getTranslations: async (language: string) => {
      return apiClient.get(`/api/multi-language-management/translations/${language}`);
    },

    getSupportedLanguages: async () => {
      return apiClient.get('/api/multi-language-management/languages');
    }
  },

  shipping: {
    calculateShipping: async (orderData: any) => {
      return apiClient.post('/api/shipping-delivery/shipping/calculate', orderData);
    },

    trackShipment: async (trackingId: string) => {
      return apiClient.get(`/api/shipping-delivery/shipments/${trackingId}`);
    }
  },

  marketplace: {
    getVendors: async () => {
      return apiClient.get('/api/marketplace-management/vendors');
    },

    getVendorProducts: async (vendorId: string) => {
      return apiClient.get(`/api/marketplace-management/vendors/${vendorId}/products`);
    }
  }
};