/**
 * Centralized API Gateway - True Microservices Architecture
 * All frontend requests must go through this gateway
 * Eliminates direct frontend-to-microservice communication
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = process.env.GATEWAY_PORT || 8080;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:5000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Microservice registry with schema-aware routing
const MICROSERVICE_REGISTRY = {
  // Authentication service
  'auth': {
    url: 'http://localhost:3020',
    schema: 'auth',
    public_routes: ['/login', '/register', '/validate-token', '/refresh-token']
  },
  
  // Company management
  'company': {
    url: 'http://localhost:3021',
    schema: 'company',
    permissions: ['company:read', 'company:write', 'company:admin']
  },
  
  // Catalog management
  'catalog': {
    url: 'http://localhost:3022',
    schema: 'catalog',
    public_routes: ['/products', '/categories'],
    permissions: ['catalog:read', 'catalog:write']
  },
  
  // Order management
  'orders': {
    url: 'http://localhost:3023',
    schema: 'orders',
    permissions: ['order:create', 'order:read', 'order:update']
  },
  
  // Customer service
  'customers': {
    url: 'http://localhost:3024',
    schema: 'customers',
    permissions: ['customer:read', 'customer:write']
  },
  
  // Inventory management
  'inventory': {
    url: 'http://localhost:3025',
    schema: 'inventory',
    permissions: ['inventory:read', 'inventory:write']
  },
  
  // Payment processing
  'payments': {
    url: 'http://localhost:3026',
    schema: 'payments',
    permissions: ['payment:process', 'payment:read']
  },
  
  // Shipping and delivery
  'shipping': {
    url: 'http://localhost:3027',
    schema: 'shipping',
    permissions: ['shipping:read', 'shipping:write']
  },
  
  // Employee management
  'employees': {
    url: 'http://localhost:3028',
    schema: 'employees',
    permissions: ['employee:read', 'employee:write', 'employee:admin']
  },
  
  // Analytics and reporting
  'analytics': {
    url: 'http://localhost:3029',
    schema: 'analytics',
    permissions: ['analytics:read', 'analytics:write']
  },
  
  // Image management
  'images': {
    url: 'http://localhost:3030',
    schema: 'images',
    public_routes: ['/images', '/upload'],
    permissions: ['image:upload', 'image:read']
  },
  
  // Notification service
  'notifications': {
    url: 'http://localhost:3031',
    schema: 'notifications',
    permissions: ['notification:send', 'notification:read']
  }
};

/**
 * Centralized token validation using identity-access service
 */
async function validateTokenWithAuthService(token) {
  try {
    const response = await axios.post('http://localhost:3020/auth/validate-token', {
      token: token
    }, {
      timeout: 5000
    });
    
    return response.data;
  } catch (error) {
    console.error('Token validation failed:', error.message);
    return { valid: false, error: 'Token validation failed' };
  }
}

/**
 * Authentication middleware
 */
async function authenticate(req, res, next) {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const validation = await validateTokenWithAuthService(token);
  
  if (!validation.valid) {
    return res.status(401).json({ error: validation.error || 'Invalid token' });
  }

  req.user = validation.user;
  next();
}

/**
 * Permission validation middleware
 */
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

/**
 * Branch isolation middleware
 */
function enforceBranchIsolation(req, res, next) {
  if (req.user && req.user.branch_id) {
    req.headers['x-branch-id'] = req.user.branch_id;
  }
  next();
}

/**
 * Route microservice requests
 */
function getServiceFromPath(path) {
  const segments = path.split('/').filter(Boolean);
  const service = segments[0];
  
  if (service === 'api') {
    return segments[1]; // Handle /api/service-name format
  }
  
  return service;
}

/**
 * Check if route is public
 */
function isPublicRoute(serviceName, path) {
  const service = MICROSERVICE_REGISTRY[serviceName];
  if (!service || !service.public_routes) return false;
  
  return service.public_routes.some(route => path.includes(route));
}

/**
 * Main routing middleware
 */
app.use('/api/*', async (req, res, next) => {
  const pathSegments = req.path.split('/').filter(Boolean);
  const serviceName = pathSegments[1]; // Skip 'api' segment
  const service = MICROSERVICE_REGISTRY[serviceName];
  
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const fullPath = req.originalUrl.replace(`/api/${serviceName}`, '');
  
  // Skip authentication for public routes
  if (isPublicRoute(serviceName, fullPath)) {
    return next();
  }

  // Authenticate user
  await authenticate(req, res, () => {
    // Check service permissions
    if (service.permissions && service.permissions.length > 0) {
      const hasPermission = service.permissions.some(permission => 
        req.user.permissions.includes(permission)
      );
      
      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions for this service' });
      }
    }

    // Enforce branch isolation
    enforceBranchIsolation(req, res, next);
  });
});

/**
 * Simple proxy routing without dynamic patterns
 */
app.all('/api/:service*', (req, res, next) => {
  const serviceName = req.params.service;
  const service = MICROSERVICE_REGISTRY[serviceName];
  
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const target = service.url;
  const path = req.originalUrl.replace(`/api/${serviceName}`, '');
  
  // Create a simple proxy request
  const axios = require('axios');
  const method = req.method.toLowerCase();
  
  const axiosConfig = {
    method: method,
    url: `${target}${path}`,
    headers: {
      ...req.headers,
      'X-Service-Name': serviceName,
      'X-Schema-Name': service.schema,
      host: undefined // Remove original host header
    },
    timeout: 30000
  };

  // Add user context headers
  if (req.user) {
    axiosConfig.headers['X-User-ID'] = req.user.id;
    axiosConfig.headers['X-User-Role'] = req.user.role;
    axiosConfig.headers['X-User-Permissions'] = JSON.stringify(req.user.permissions);
    
    if (req.user.branch_id) {
      axiosConfig.headers['X-Branch-ID'] = req.user.branch_id;
    }
  }

  // Add request body for POST/PUT/PATCH requests
  if (['post', 'put', 'patch'].includes(method) && req.body) {
    axiosConfig.data = req.body;
  }

  // Forward the request
  axios(axiosConfig)
    .then(response => {
      res.status(response.status).json(response.data);
    })
    .catch(error => {
      console.error(`Proxy error for ${serviceName}:`, error.message);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(502).json({
          error: 'Service temporarily unavailable',
          service: serviceName
        });
      }
    });
});

/**
 * Health check endpoint
 */
app.get('/health', async (req, res) => {
  const serviceHealth = {};
  
  for (const [serviceName, config] of Object.entries(MICROSERVICE_REGISTRY)) {
    try {
      const response = await axios.get(`${config.url}/health`, { timeout: 2000 });
      serviceHealth[serviceName] = {
        status: 'healthy',
        schema: config.schema,
        url: config.url
      };
    } catch (error) {
      serviceHealth[serviceName] = {
        status: 'unhealthy',
        schema: config.schema,
        url: config.url,
        error: error.message
      };
    }
  }

  const healthyCount = Object.values(serviceHealth).filter(s => s.status === 'healthy').length;
  const totalCount = Object.keys(serviceHealth).length;

  res.json({
    status: healthyCount === totalCount ? 'healthy' : 'degraded',
    services: serviceHealth,
    summary: `${healthyCount}/${totalCount} services healthy`
  });
});

/**
 * Service registry endpoint
 */
app.get('/registry', (req, res) => {
  res.json({
    services: Object.keys(MICROSERVICE_REGISTRY),
    registry: MICROSERVICE_REGISTRY
  });
});

/**
 * Catch-all for undefined routes
 */
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: 'All requests must go through /api/{service-name}',
    available_services: Object.keys(MICROSERVICE_REGISTRY)
  });
});

/**
 * Global error handler
 */
app.use((error, req, res, next) => {
  console.error('Gateway error:', error);
  res.status(500).json({ 
    error: 'Internal gateway error',
    message: 'Please try again later'
  });
});

/**
 * Start the centralized API gateway
 */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Centralized API Gateway running on port ${PORT}`);
  console.log(`📊 Managing ${Object.keys(MICROSERVICE_REGISTRY).length} microservices`);
  console.log(`🔒 Authentication: Identity-Access Service (port 3020)`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`📋 Service Registry: http://localhost:${PORT}/registry`);
  
  // Display service mappings
  console.log('\n📡 Service Mappings:');
  Object.entries(MICROSERVICE_REGISTRY).forEach(([name, config]) => {
    console.log(`   /api/${name} → ${config.url} (${config.schema} schema)`);
  });
});

module.exports = app;