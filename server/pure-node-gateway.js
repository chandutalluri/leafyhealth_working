/**
 * Pure Node.js Centralized API Gateway
 * No Express dependencies to avoid path-to-regexp conflicts
 */

const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

const PORT = process.env.GATEWAY_PORT || 5000;

// Complete Service registry - All 25 microservices
const SERVICES = {
  // Core Authentication & Access
  'auth': { url: 'http://localhost:8085', port: 8085 },
  'identity-access': { url: 'http://localhost:3020', port: 3020 },
  'user-role-management': { url: 'http://localhost:3035', port: 3035 },
  
  // Company & Branch Management
  'company-management': { url: 'http://localhost:3013', port: 3013 },
  
  // Product & Catalog
  'catalog-management': { url: 'http://localhost:3022', port: 3022 },
  'inventory-management': { url: 'http://localhost:3025', port: 3025 },
  
  // Orders & Commerce
  'order-management': { url: 'http://localhost:3023', port: 3023 },
  'payment-processing': { url: 'http://localhost:3026', port: 3026 },
  'shipping-delivery': { url: 'http://localhost:3034', port: 3034 },
  
  // Customer Operations
  'customer-service': { url: 'http://localhost:3024', port: 3024 },
  'notification-service': { url: 'http://localhost:3031', port: 3031 },
  
  // Employee & HR
  'employee-management': { url: 'http://localhost:3028', port: 3028 },
  
  // Financial Management
  'accounting-management': { url: 'http://localhost:3014', port: 3014 },
  'expense-monitoring': { url: 'http://localhost:3021', port: 3021 },
  
  // Analytics & Reporting
  'analytics-reporting': { url: 'http://localhost:3015', port: 3015 },
  'performance-monitor': { url: 'http://localhost:3029', port: 3029 },
  'reporting-management': { url: 'http://localhost:3032', port: 3032 },
  
  // Content & Media
  'content-management': { url: 'http://localhost:3017', port: 3017 },
  'image-management': { url: 'http://localhost:3030', port: 3030 },
  'label-design': { url: 'http://localhost:3027', port: 3027 },
  
  // Platform Management
  'marketplace-management': { url: 'http://localhost:3033', port: 3033 },
  'subscription-management': { url: 'http://localhost:3036', port: 3036 },
  'multi-language-management': { url: 'http://localhost:3019', port: 3019 },
  
  // Operations & Compliance
  'compliance-audit': { url: 'http://localhost:3016', port: 3016 },
  'integration-hub': { url: 'http://localhost:3018', port: 3018 },
  
  // Direct Data Gateway for ecommerce endpoints
  'direct-data': { url: 'http://localhost:8081', port: 8081 }
};

// CORS headers - Handle both localhost and Replit domains
function setCorsHeaders(res, origin) {
  // Allow all origins for development, but specifically handle Replit domains
  const allowedOrigins = [
    'http://localhost:3003',
    'https://localhost:3003',
    /https:\/\/.*\.replit\.app$/,
    /https:\/\/.*\.replit\.dev$/,
    /https:\/\/.*\.riker\.replit\.dev$/
  ];
  
  if (origin) {
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      } else {
        return allowed.test(origin);
      }
    });
    
    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
}

// JSON response helper
function sendJSON(res, statusCode, data, origin) {
  setCorsHeaders(res, origin);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

// Token validation
function validateToken(token) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ token: token.replace('Bearer ', '') });
    
    const options = {
      hostname: 'localhost',
      port: 8085,
      path: '/api/auth/verify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            resolve({ 
              valid: true, 
              user: result.user || { 
                id: result.decoded?.id, 
                role: result.decoded?.role, 
                branch_id: result.decoded?.branchId 
              }
            });
          } else {
            resolve({ valid: false, error: result.message || 'Invalid token' });
          }
        } catch {
          resolve({ valid: false, error: 'Invalid response' });
        }
      });
    });

    req.on('error', () => {
      resolve({ valid: false, error: 'Token validation failed' });
    });

    req.write(postData);
    req.end();
  });
}

// Proxy request to microservice
function proxyRequest(req, res, serviceName, targetPath, requestBody = null, customPort = null) {
  const service = SERVICES[serviceName];
  const port = customPort || (service ? service.port : null);
  
  if (!port) {
    return sendJSON(res, 404, { error: 'Service not found' }, req.headers.origin);
  }

  const bodyData = requestBody ? JSON.stringify(requestBody) : '';
  
  const options = {
    hostname: 'localhost',
    port: port,
    path: targetPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: `localhost:${port}`,
      'Content-Length': Buffer.byteLength(bodyData)
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    setCorsHeaders(res);
    res.statusCode = proxyRes.statusCode;
    
    // Forward response headers
    Object.keys(proxyRes.headers).forEach(key => {
      res.setHeader(key, proxyRes.headers[key]);
    });

    proxyRes.pipe(res);
  });

  proxyReq.on('error', () => {
    sendJSON(res, 502, {
      error: 'Service temporarily unavailable',
      service: serviceName
    });
  });

  // Write body data if available
  if (bodyData) {
    proxyReq.write(bodyData);
  }
  
  proxyReq.end();
}

// Parse request body
function parseRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        req.body = body ? JSON.parse(body) : {};
        resolve();
      } catch {
        req.body = {};
        resolve();
      }
    });
  });
}

// Main request handler
async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Log all requests for debugging
  console.log(`[${new Date().toISOString()}] ${method} ${pathname} - Origin: ${req.headers.origin || 'None'}`);

  // Always set CORS headers for all requests
  setCorsHeaders(res, req.headers.origin);

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    console.log('CORS preflight request handled');
    res.statusCode = 200;
    return res.end();
  }

  // Parse request body for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    await parseRequestBody(req);
  }

  // Health check endpoint
  if (pathname === '/health') {
    const healthChecks = await Promise.allSettled(
      Object.entries(SERVICES).map(async ([name, config]) => {
        return new Promise((resolve) => {
          const healthReq = http.request({
            hostname: 'localhost',
            port: config.port,
            path: '/health',
            method: 'GET',
            timeout: 2000
          }, (healthRes) => {
            resolve({ service: name, status: 'healthy' });
          });
          
          healthReq.on('error', () => {
            resolve({ service: name, status: 'unhealthy' });
          });
          
          healthReq.end();
        });
      })
    );

    const results = healthChecks.map(result => result.value);
    const healthy = results.filter(r => r.status === 'healthy').length;
    
    return sendJSON(res, 200, {
      status: healthy === results.length ? 'healthy' : 'degraded',
      services: results,
      summary: `${healthy}/${results.length} services healthy`
    }, req.headers.origin);
  }

  // Service registry endpoint
  if (pathname === '/registry') {
    return sendJSON(res, 200, {
      services: Object.keys(SERVICES),
      endpoints: SERVICES
    }, req.headers.origin);
  }

  // Route API requests
  if (pathname.startsWith('/api/')) {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    if (pathSegments.length < 2) {
      return sendJSON(res, 400, { error: 'Invalid API path' }, req.headers.origin);
    }

    const serviceName = pathSegments[1]; // Skip 'api' segment
    // Special handling for different service routing patterns
    let targetPath;
    if (serviceName === 'auth') {
      targetPath = pathname; // Auth service expects full /api/auth path
    } else if (serviceName === 'company-management') {
      targetPath = '/' + pathSegments.slice(1).join('/'); // Company management expects /company-management path
    } else {
      targetPath = '/' + pathSegments.slice(2).join('/'); // Standard microservices
    }
    const queryParams = parsedUrl.search || '';
    const fullTargetPath = targetPath + queryParams;

    // Special routing for ecommerce endpoints via Direct Data Gateway
    if (['products', 'categories', 'branches', 'cart', 'coupons'].includes(serviceName)) {
      return proxyRequest(req, res, 'direct-data', `/api/${serviceName}${queryParams}`, req.body);
    }

    // Public routes that don't require authentication
    const isPublicRoute = (
      serviceName === 'auth' || 
      serviceName === 'products' ||
      serviceName === 'categories' ||
      serviceName === 'branches' ||
      (serviceName === 'catalog-management' && method === 'GET') ||
      (serviceName === 'inventory-management' && method === 'GET') ||
      (serviceName === 'order-management' && method === 'GET') ||
      (serviceName === 'image-management' && method === 'GET') ||
      (serviceName === 'cart' && method === 'POST') ||
      (serviceName === 'coupons' && method === 'POST')
    );

    if (!isPublicRoute) {
      const token = req.headers.authorization;
      
      if (!token) {
        return sendJSON(res, 401, { error: 'No token provided' }, req.headers.origin);
      }

      const validation = await validateToken(token);
      
      if (!validation.valid) {
        return sendJSON(res, 401, { error: validation.error || 'Invalid token' }, req.headers.origin);
      }

      // Add user context headers
      req.headers['x-user-id'] = validation.user.id || '';
      req.headers['x-user-role'] = validation.user.role || '';
      req.headers['x-branch-id'] = validation.user.branch_id || '';
    }

    return proxyRequest(req, res, serviceName, fullTargetPath, req.body);
  }

  // Proxy to Super Admin Dashboard for non-API routes
  if (!pathname.startsWith('/api/')) {
    return proxyRequest(req, res, 'super-admin', pathname, req.body, 3003);
  }

  // Default 404 response for API routes
  sendJSON(res, 404, { 
    error: 'Route not found',
    message: 'Use /api/{service-name} format',
    available_services: Object.keys(SERVICES)
  }, req.headers.origin);
}

// Create and start server
const server = http.createServer(handleRequest);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Pure Node.js API Gateway running on port ${PORT}`);
  console.log(`📊 Managing ${Object.keys(SERVICES).length} microservices`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`📋 Registry: http://localhost:${PORT}/registry`);
  
  console.log('\n📡 Service Mappings:');
  Object.entries(SERVICES).forEach(([name, config]) => {
    console.log(`   /api/${name} → ${config.url}`);
  });
});

module.exports = server;