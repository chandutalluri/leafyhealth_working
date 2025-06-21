/**
 * HTTP API Gateway - Pure Node.js Implementation
 * Direct HTTP server without Express to avoid path-to-regexp issues
 */

const http = require('http');
const url = require('url');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Enhanced logging for API Gateway
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

const PORT = 8080;

// Import services
const LocationService = require('../shared/services/location-service');
const AuthService = require('../shared/services/auth-service');

// Initialize services
const locationService = new LocationService(pool);
const authService = new AuthService(pool);

function proxyToPremiumEcommerce(req, res) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      'host': 'localhost:3000',
      'x-forwarded-for': req.socket.remoteAddress,
      'x-forwarded-proto': 'http'
    },
    timeout: 10000
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    Object.keys(proxyRes.headers).forEach(key => {
      res.setHeader(key, proxyRes.headers[key]);
    });

    res.writeHead(proxyRes.statusCode);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error('Premium E-commerce proxy error:', err.message);

    if (!res.headersSent) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Service Unavailable',
        message: 'Premium e-commerce application is starting up',
        retry: true,
        timestamp: new Date().toISOString()
      }));
    }
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    res.writeHead(504, { 'Content-Type': 'text/plain' });
    res.end('Gateway Timeout');
  });

  if (req.method === 'POST' || req.method === 'PUT') {
    req.pipe(proxyReq, { end: true });
  } else {
    proxyReq.end();
  }
}










async function handleProductsAPI(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Get branch context from session
    const sessionToken = req.headers['x-session-token'];
    let branchId = null;

    if (sessionToken) {
      const authData = await authService.validateSession(sessionToken);
      if (authData && authData.branch) {
        branchId = authData.branch.id;
      }
    }

    let query, params;

    if (branchId) {
      // Get branch-specific products with pricing
      query = `
        SELECT 
          p.id, p.name, p.description, p.sku, p.unit, p.is_active,
          c.name as category_name,
          bp.price, bp.discounted_price, bp.stock_quantity, bp.is_available
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        LEFT JOIN branch_products bp ON p.id = bp.product_id AND bp.branch_id = $1
        WHERE p.is_active = true AND (bp.is_available = true OR bp.is_available IS NULL)
        ORDER BY p.name ASC
      `;
      params = [branchId];
    } else {
      // Fallback to general products without branch-specific pricing
      query = `
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.is_active = true
        ORDER BY p.name ASC 
        LIMIT 50
      `;
      params = [];
    }

    const result = await pool.query(query, params);

    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      products: result.rows,
      count: result.rows.length,
      branchSpecific: !!branchId
    }));
  } catch (error) {
    console.error('Database error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      error: 'Database connection error',
      message: 'Unable to fetch products'
    }));
  }
}

async function handleCategoriesAPI(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Complete category catalog
    const categories = [
      { 
        id: 1, 
        name: "Fruits", 
        description: "Fresh organic fruits from local farms", 
        icon: "🍎",
        productCount: 4
      },
      { 
        id: 2, 
        name: "Vegetables", 
        description: "Farm-fresh organic vegetables", 
        icon: "🥕",
        productCount: 4
      },
      { 
        id: 3, 
        name: "Dairy", 
        description: "Organic dairy products from grass-fed cows", 
        icon: "🥛",
        productCount: 3
      },
      { 
        id: 4, 
        name: "Bakery", 
        description: "Fresh baked goods made daily", 
        icon: "🍞",
        productCount: 2
      },
      { 
        id: 5, 
        name: "Protein", 
        description: "High-quality protein sources", 
        icon: "🥩",
        productCount: 3
      },
      { 
        id: 6, 
        name: "Beverages", 
        description: "Healthy drinks and teas", 
        icon: "🥤",
        productCount: 2
      },
      { 
        id: 7, 
        name: "Grains", 
        description: "Wholesome grains and cereals", 
        icon: "🌾",
        productCount: 2
      },
      { 
        id: 8, 
        name: "Herbs", 
        description: "Fresh herbs and spices", 
        icon: "🌿",
        productCount: 0
      }
    ];

    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: categories,
      count: categories.length
    }));
  } catch (error) {
    console.error('Categories API error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      error: 'Failed to load categories'
    }));
  }
}

function getCategoryIcon(categoryName) {
  const name = categoryName.toLowerCase();
  if (name.includes('vegetable')) return '🥬';
  if (name.includes('fruit')) return '🍎';
  if (name.includes('dairy')) return '🥛';
  if (name.includes('grain') || name.includes('cereal')) return '🌾';
  if (name.includes('herb') || name.includes('spice')) return '🌿';
  if (name.includes('oil')) return '🫒';
  return '📦';
}

// Authentication handlers
async function handleRegister(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const userData = JSON.parse(body);
        req.body = userData; // Add body to req for services

        const result = await authService.register(userData, req);

        res.writeHead(201);
        res.end(JSON.stringify({
          success: true,
          user: result.user,
          session: result.session,
          location: result.location,
          message: result.message
        }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          error: error.message
        }));
      }
    });
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      error: 'Registration failed'
    }));
  }
}

async function handleLogin(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const credentials = JSON.parse(body);
        req.body = credentials; // Add body to req for services

        const result = await authService.login(credentials, req);

        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          user: result.user,
          session: result.session,
          location: result.location,
          message: result.message
        }));
      } catch (error) {
        res.writeHead(401);
        res.end(JSON.stringify({
          success: false,
          error: error.message
        }));
      }
    });
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      error: 'Login failed'
    }));
  }
}

async function handleLogout(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const sessionToken = req.headers['x-session-token'];
    if (!sessionToken) {
      res.writeHead(400);
      res.end(JSON.stringify({
        success: false,
        error: 'Session token required'
      }));
      return;
    }

    await authService.logout(sessionToken);
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: 'Logged out successfully'
    }));
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      error: 'Logout failed'
    }));
  }
}

async function handleGetUser(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-token');

  try {
    // For development - return null to indicate user not authenticated
    // This allows the frontend to handle unauthenticated state gracefully
    res.writeHead(401);
    res.end(JSON.stringify({
      success: false,
      error: 'Authentication required',
      message: 'User not authenticated'
    }));
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      error: 'Failed to get user data'
    }));
  }
}

async function handleLocationDetection(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const locationData = JSON.parse(body);
        req.body = locationData; // Add body to req for services

        const sessionToken = req.headers['x-session-token'];
        let userId = null, sessionId = null;

        if (sessionToken) {
          const authData = await authService.validateSession(sessionToken);
          if (authData) {
            userId = authData.user.id;
            sessionId = authData.session.sessionId;
          }
        }

        const result = await locationService.detectUserLocation(req, userId, sessionId);

        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          ...result
        }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          error: error.message
        }));
      }
    });
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      error: 'Location detection failed'
    }));
  }
}

async function handlePermissionsDomains(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId') || 'admin-001';

    // Hybrid RBAC + Domain-Permission data
    const domainPermissions = {
      'catalog-management': ['read', 'create', 'update', 'delete'],
      'order-management': ['read', 'create', 'update'],
      'inventory-management': ['read', 'create', 'update'],
      'payment-processing': ['read', 'create'],
      'customer-service': ['read', 'create', 'update'],
      'analytics-reporting': ['read'],
      'accounting-management': ['read', 'create', 'update'],
      'employee-management': ['read', 'create', 'update'],
      'shipping-delivery': ['read', 'create', 'update']
    };

    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      userId: userId,
      permissions: domainPermissions,
      timestamp: new Date().toISOString(),
      system: 'hybrid-rbac'
    }));
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      error: 'Failed to get domain permissions'
    }));
  }
}

async function handleGetBranches(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const branches = [
      {
        id: 'downtown',
        name: 'Downtown Branch',
        address: '123 Main Street, Downtown District',
        phone: '+1 (555) 123-4567',
        email: 'downtown@leafyhealth.com',
        deliveryFee: 4.99,
        minimumOrderAmount: 50.00,
        operatingHours: '7:00 AM - 10:00 PM',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        features: ['Express Delivery', '24/7 Customer Support', 'Organic Certification'],
        manager: 'Sarah Johnson',
        specialties: ['Premium Organic Produce', 'Artisan Bakery', 'Fresh Seafood']
      },
      {
        id: 'suburban',
        name: 'Suburban Branch',
        address: '456 Oak Avenue, Green Valley Suburbia',
        phone: '+1 (555) 234-5678',
        email: 'suburban@leafyhealth.com',
        deliveryFee: 3.99,
        minimumOrderAmount: 40.00,
        operatingHours: '8:00 AM - 9:00 PM',
        coordinates: { lat: 40.6892, lng: -74.0445 },
        features: ['Family Packs', 'Bulk Discounts', 'Local Farm Partnership'],
        manager: 'Michael Chen',
        specialties: ['Family Meal Plans', 'Bulk Grains', 'Kids Nutrition']
      },
      {
        id: 'riverside',
        name: 'Riverside Branch',
        address: '789 River Road, Riverside Community',
        phone: '+1 (555) 345-6789',
        email: 'riverside@leafyhealth.com',
        deliveryFee: 5.99,
        minimumOrderAmount: 45.00,
        operatingHours: '7:30 AM - 9:30 PM',
        coordinates: { lat: 40.7589, lng: -73.9851 },
        features: ['Waterfront Location', 'Eco-Friendly Packaging', 'Seasonal Specials'],
        manager: 'Emily Rodriguez',
        specialties: ['Fresh Fish Market', 'Seasonal Produce', 'Eco Products']
      }
    ];

    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: branches,
      count: branches.length
    }));
  } catch (error) {
    console.error('Branches API error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      error: 'Failed to load branches'
    }));
  }
}



// Complete service mapping for all 19 microservices with domain routing
const serviceMap = {
  // Authentication and Users
  '/api/auth': { host: 'localhost', port: 3010, service: 'identity-access' },
  '/api/identity-access': { host: 'localhost', port: 3010, service: 'identity-access' },
  '/api/users': { host: 'localhost', port: 3011, service: 'user-role-management' },
  '/api/user-role-management': { host: 'localhost', port: 3011, service: 'user-role-management' },
  
  // Core Business
  '/api/catalog': { host: 'localhost', port: 3020, service: 'catalog-management' },
  '/api/catalog-management': { host: 'localhost', port: 3020, service: 'catalog-management' },
  '/api/inventory': { host: 'localhost', port: 3021, service: 'inventory-management' },
  '/api/inventory-management': { host: 'localhost', port: 3021, service: 'inventory-management' },
  '/api/orders': { host: 'localhost', port: 3022, service: 'order-management' },
  '/api/order-management': { host: 'localhost', port: 3022, service: 'order-management' },
  '/api/payments': { host: 'localhost', port: 3023, service: 'payment-processing' },
  '/api/payment-processing': { host: 'localhost', port: 3023, service: 'payment-processing' },
  '/api/notifications': { host: 'localhost', port: 3024, service: 'notification-service' },
  '/api/notification-service': { host: 'localhost', port: 3024, service: 'notification-service' },
  
  // Customer and Support
  '/api/customers': { host: 'localhost', port: 3031, service: 'customer-service' },
  '/api/customer-service': { host: 'localhost', port: 3031, service: 'customer-service' },
  
  // Financial Management
  '/api/accounting': { host: 'localhost', port: 3032, service: 'accounting-management' },
  '/api/accounting-management': { host: 'localhost', port: 3032, service: 'accounting-management' },
  '/api/analytics': { host: 'localhost', port: 3033, service: 'analytics-reporting' },
  '/api/analytics-reporting': { host: 'localhost', port: 3033, service: 'analytics-reporting' },
  '/api/compliance': { host: 'localhost', port: 3034, service: 'compliance-audit' },
  '/api/compliance-audit': { host: 'localhost', port: 3034, service: 'compliance-audit' },
  
  // Content and Media
  '/api/content': { host: 'localhost', port: 3035, service: 'content-management' },
  '/api/content-management': { host: 'localhost', port: 3035, service: 'content-management' },
  
  // Operations
  '/api/employees': { host: 'localhost', port: 3036, service: 'employee-management' },
  '/api/employee-management': { host: 'localhost', port: 3036, service: 'employee-management' },
  '/api/expenses': { host: 'localhost', port: 3037, service: 'expense-monitoring' },
  '/api/expense-monitoring': { host: 'localhost', port: 3037, service: 'expense-monitoring' },
  '/api/integrations': { host: 'localhost', port: 3038, service: 'integration-hub' },
  '/api/integration-hub': { host: 'localhost', port: 3038, service: 'integration-hub' },
  '/api/labels': { host: 'localhost', port: 3039, service: 'label-design' },
  '/api/label-design': { host: 'localhost', port: 3039, service: 'label-design' },
  '/api/marketplace': { host: 'localhost', port: 3040, service: 'marketplace-management' },
  '/api/marketplace-management': { host: 'localhost', port: 3040, service: 'marketplace-management' },
  '/api/performance': { host: 'localhost', port: 3041, service: 'performance-monitor' },
  '/api/performance-monitor': { host: 'localhost', port: 3041, service: 'performance-monitor' },
  '/api/shipping': { host: 'localhost', port: 3042, service: 'shipping-delivery' },
  '/api/shipping-delivery': { host: 'localhost', port: 3042, service: 'shipping-delivery' },
  
  // Multi-language
  '/api/languages': { host: 'localhost', port: 3050, service: 'multi-language-management' },
  '/api/multi-language-management': { host: 'localhost', port: 3050, service: 'multi-language-management' },
  
  // Permissions and legacy routes
  '/api/permissions': { host: 'localhost', port: 3010, service: 'identity-access' },
  '/api/multi-language': { host: 'localhost', port: 3050, service: 'multi-language-management' },
};

function findMatchingService(pathname) {
  for (const [route, service] of Object.entries(serviceMap)) {
    if (pathname.startsWith(route)) {
      return { route, service };
    }
  }
  return null;
}

function proxyToService(req, res, targetService, originalRoute) {
  const { host, port, service } = targetService;

  // Remove route prefix from path
  const targetPath = req.url.replace(originalRoute, '') || '/';

  const options = {
    hostname: host,
    port: port,
    path: targetPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: `${host}:${port}`
    }
  };

  console.log(`Routing ${req.method} ${req.url} -> ${host}:${port}${targetPath}`);

  const proxyReq = http.request(options, (proxyRes) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error(`Proxy error for ${service}:`, err.message);
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Service unavailable',
      service: service,
      message: 'The requested service is not responding',
      timestamp: new Date().toISOString()
    }));
  });

  req.pipe(proxyReq);
}

async function handleMicroserviceGeneration(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { MicroserviceGenerator } = require('../scripts/microservice-generator.js');
        const generator = new MicroserviceGenerator();
        
        const domainConfig = JSON.parse(body);
        
        // Validate required fields
        if (!domainConfig.name || !domainConfig.label || !domainConfig.port) {
          res.writeHead(400);
          res.end(JSON.stringify({
            success: false,
            error: 'Missing required fields: name, label, and port are required'
          }));
          return;
        }
        
        console.log(`🚀 Generating microservice for domain: ${domainConfig.label}`);
        
        // Generate the microservice
        const result = await generator.generateMicroservice(domainConfig);
        
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          data: {
            message: `Microservice ${domainConfig.label} generated successfully`,
            domain: domainConfig.name,
            port: domainConfig.port,
            path: result.path,
            apiEndpoint: result.apiEndpoint,
            features: [
              'Complete NestJS microservice structure',
              'RESTful API endpoints with Swagger documentation',
              'JWT authentication integration',
              'Database schema with Drizzle ORM',
              'API Gateway routing automatically configured',
              'Frontend domain registries updated',
              'Docker containerization ready',
              'Comprehensive testing setup'
            ]
          }
        }));
        
      } catch (error) {
        console.error('Error parsing request body:', error);
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid request format'
        }));
      }
    });
  } catch (error) {
    console.error('Error generating microservice:', error);
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      error: 'Failed to generate microservice: ' + error.message
    }));
  }
}

function handleDomainDataEndpoint(pathname) {
  const domainData = {
    '/api/compliance-audit': {
      success: true,
      data: [
        { id: 1, title: 'GST Compliance Check', status: 'completed', date: '2024-01-15', risk: 'low', description: 'Annual GST filing compliance verification' },
        { id: 2, title: 'Food Safety Audit', status: 'in-progress', date: '2024-01-20', risk: 'medium', description: 'FSSAI license renewal audit' },
        { id: 3, title: 'Financial Review', status: 'pending', date: '2024-01-25', risk: 'high', description: 'Quarterly financial compliance check' }
      ],
      count: 3,
      service: 'compliance-audit'
    },
    '/api/identity-access': {
      success: true,
      data: [
        { id: 1, name: 'Admin User', email: 'admin@leafyhealth.com', role: 'super-admin', status: 'active', lastLogin: '2024-01-20T10:30:00Z' },
        { id: 2, name: 'Store Manager', email: 'manager@leafyhealth.com', role: 'manager', status: 'active', lastLogin: '2024-01-20T09:15:00Z' },
        { id: 3, name: 'Sales Staff', email: 'sales@leafyhealth.com', role: 'staff', status: 'active', lastLogin: '2024-01-19T16:45:00Z' }
      ],
      count: 3,
      service: 'identity-access'
    },
    '/api/user-role-management': {
      success: true,
      data: [
        { id: 1, name: 'Super Admin', permissions: ['read', 'write', 'delete', 'admin'], userCount: 1, description: 'Full system access' },
        { id: 2, name: 'Store Manager', permissions: ['read', 'write'], userCount: 5, description: 'Store management access' },
        { id: 3, name: 'Sales Staff', permissions: ['read'], userCount: 15, description: 'Point of sale access only' }
      ],
      count: 3,
      service: 'user-role-management'
    },
    '/api/accounting-management': {
      success: true,
      data: [
        { id: 1, type: 'sale', amount: 1250.50, date: '2024-01-20', status: 'completed', description: 'Daily sales revenue', category: 'revenue' },
        { id: 2, type: 'purchase', amount: -875.25, date: '2024-01-19', status: 'completed', description: 'Inventory purchase', category: 'expense' },
        { id: 3, type: 'refund', amount: -125.00, date: '2024-01-18', status: 'pending', description: 'Customer refund', category: 'refund' }
      ],
      count: 3,
      service: 'accounting-management'
    },
    '/api/expense-monitoring': {
      success: true,
      data: [
        { id: 1, category: 'Rent', amount: 25000, date: '2024-01-01', status: 'paid', description: 'Monthly store rent', vendor: 'Property Owner' },
        { id: 2, category: 'Utilities', amount: 3500, date: '2024-01-05', status: 'paid', description: 'Electricity and water', vendor: 'Utility Company' },
        { id: 3, category: 'Marketing', amount: 8000, date: '2024-01-10', status: 'pending', description: 'Digital advertising', vendor: 'Ad Agency' }
      ],
      count: 3,
      service: 'expense-monitoring'
    },
    '/api/payment-processing': {
      success: true,
      data: [
        { id: 1, amount: 450.75, method: 'UPI', status: 'completed', orderId: 'ORD001', timestamp: '2024-01-20T14:30:00Z', gateway: 'Razorpay' },
        { id: 2, amount: 320.50, method: 'Card', status: 'completed', orderId: 'ORD002', timestamp: '2024-01-20T13:15:00Z', gateway: 'Stripe' },
        { id: 3, amount: 180.25, method: 'Cash', status: 'pending', orderId: 'ORD003', timestamp: '2024-01-20T12:00:00Z', gateway: 'POS' }
      ],
      count: 3,
      service: 'payment-processing'
    },
    '/api/employee-management': {
      success: true,
      data: [
        { id: 1, name: 'Raj Kumar', position: 'Store Manager', department: 'Operations', status: 'active', salary: 45000, joinDate: '2023-06-15' },
        { id: 2, name: 'Priya Singh', position: 'Cashier', department: 'Sales', status: 'active', salary: 25000, joinDate: '2023-08-20' },
        { id: 3, name: 'Amit Shah', position: 'Delivery Executive', department: 'Logistics', status: 'active', salary: 20000, joinDate: '2023-10-01' }
      ],
      count: 3,
      service: 'employee-management'
    },
    '/api/inventory-management': {
      success: true,
      data: [
        { id: 1, name: 'Basmati Rice', category: 'Grains', stock: 50, price: 180.00, unit: '1kg', supplier: 'Grain Traders Ltd', reorderLevel: 10 },
        { id: 2, name: 'Toor Dal', category: 'Pulses', stock: 75, price: 165.00, unit: '1kg', supplier: 'Pulse Suppliers Co', reorderLevel: 15 },
        { id: 3, name: 'Mustard Oil', category: 'Oils', stock: 30, price: 185.00, unit: '1L', supplier: 'Oil Mills India', reorderLevel: 8 }
      ],
      count: 3,
      service: 'inventory-management'
    },
    '/api/shipping-delivery': {
      success: true,
      data: [
        { id: 1, orderId: 'ORD001', status: 'in-transit', destination: 'Mumbai', eta: '2024-01-21', trackingId: 'TRK001', courier: 'Dunzo' },
        { id: 2, orderId: 'ORD002', status: 'delivered', destination: 'Delhi', deliveredAt: '2024-01-20T16:30:00Z', trackingId: 'TRK002', courier: 'Swiggy' },
        { id: 3, orderId: 'ORD003', status: 'pending', destination: 'Bangalore', eta: '2024-01-22', trackingId: 'TRK003', courier: 'Zomato' }
      ],
      count: 3,
      service: 'shipping-delivery'
    }
  };

  return domainData[pathname] || null;
}

function handleDirectRequest(req, res, pathname) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'API Gateway',
      timestamp: new Date().toISOString(),
      routes: Object.keys(serviceMap).length
    }));
    return;
  }

  if (pathname === '/api/status') {
    res.writeHead(200);
    res.end(JSON.stringify({
      gateway: 'running',
      port: PORT,
      version: '5.0.0',
      description: 'Pure HTTP server gateway',
      routes: Object.keys(serviceMap),
      services: serviceMap,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  if (pathname === '/') {
    // Route to premium e-commerce platform
    proxyToPremiumEcommerce(req, res);
    return;
  }

  if (pathname === '/api') {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: 'LeafyHealth API Gateway',
      status: 'running',
      version: '5.0.0',
      routes: Object.keys(serviceMap),
      premiumPlatform: '/',
      endpoints: {
        health: '/health',
        status: '/api/status'
      }
    }));
    return;
  }

  // Route not found
  res.writeHead(404);
  res.end(JSON.stringify({
    error: 'Route not found',
    availableRoutes: Object.keys(serviceMap)
  }));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);

  // Handle OPTIONS for CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.writeHead(200);
    res.end();
    return;
  }



  // Handle authentication endpoints
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    handleRegister(req, res);
    return;
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    handleLogin(req, res);
    return;
  }

  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    handleLogout(req, res);
    return;
  }

  if (pathname === '/api/auth/user' && req.method === 'GET') {
    handleGetUser(req, res);
    return;
  }

  // Handle permissions endpoint for hybrid RBAC system
  if (pathname === '/api/permissions/domains' && req.method === 'GET') {
    handlePermissionsDomains(req, res);
    return;
  }

  // Handle microservice generation endpoint
  if (pathname === '/api/microservices/generate' && req.method === 'POST') {
    handleMicroserviceGeneration(req, res);
    return;
  }



  // Handle location detection
  if (pathname === '/api/location/detect' && req.method === 'POST') {
    handleLocationDetection(req, res);
    return;
  }

  if (pathname === '/api/branches' && req.method === 'GET') {
    handleGetBranches(req, res);
    return;
  }



  // Handle product endpoints
  if (pathname === '/api/products' && req.method === 'GET') {
    handleProductsAPI(req, res);
    return;
  }

  if (pathname === '/api/catalog/products') {
    handleProductsAPI(req, res);
    return;
  }

  // Handle category endpoints
  if (pathname === '/api/categories' && req.method === 'GET') {
    handleCategoriesAPI(req, res);
    return;
  }

  if (pathname === '/api/catalog/categories') {
    handleCategoriesAPI(req, res);
    return;
  }

  // Handle inventory endpoints for frontend
  if (pathname === '/api/inventory/products' && req.method === 'GET') {
    handleProductsAPI(req, res);
    return;
  }

  if (pathname === '/api/inventory/categories' && req.method === 'GET') {
    handleCategoriesAPI(req, res);
    return;
  }



  // Handle sample data endpoints directly
  if (pathname.startsWith('/api/') && req.method === 'GET') {
    const domainData = handleDomainDataEndpoint(pathname);
    if (domainData) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.writeHead(200);
      res.end(JSON.stringify(domainData));
      return;
    }
  }

  // Handle inventory products endpoint specifically
  if (pathname === '/api/inventory/products' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: [
        { id: 1, name: 'Basmati Rice', category: 'Grains', stock: 50, price: 180.00, unit: '1kg', supplier: 'Grain Traders Ltd', reorderLevel: 10 },
        { id: 2, name: 'Toor Dal', category: 'Pulses', stock: 75, price: 165.00, unit: '1kg', supplier: 'Pulse Suppliers Co', reorderLevel: 15 },
        { id: 3, name: 'Mustard Oil', category: 'Oils', stock: 30, price: 185.00, unit: '1L', supplier: 'Oil Mills India', reorderLevel: 8 }
      ],
      count: 3
    }));
    return;
  }

  // Handle inventory categories endpoint specifically
  if (pathname === '/api/inventory/categories' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: [
        { id: 1, name: 'Grains', description: 'Rice, wheat, and cereals', productCount: 15 },
        { id: 2, name: 'Pulses', description: 'Lentils and legumes', productCount: 12 },
        { id: 3, name: 'Oils', description: 'Cooking oils and ghee', productCount: 8 }
      ],
      count: 3
    }));
    return;
  }

  // Skip microservice proxy for direct data endpoints
  if (pathname.startsWith('/api/') && req.method === 'GET') {
    // If we reach here, no direct endpoint was found, but don't proxy
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(404);
    res.end(JSON.stringify({
      error: 'Endpoint not found',
      message: 'This API endpoint is not available in demo mode',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Find matching service for non-API requests
  const match = findMatchingService(pathname);

  if (match && match.service.type !== 'frontend') {
    proxyToService(req, res, match.service, match.route);
  } else {
    handleDirectRequest(req, res, pathname);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('HTTP API Gateway Started');
  console.log(`External access: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Status: http://localhost:${PORT}/api/status`);
  console.log('Service routes configured:');
  Object.entries(serviceMap).forEach(([route, target]) => {
    console.log(`  ${route} -> ${target.host}:${target.port}`);
  });
});



module.exports = server;