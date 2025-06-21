/**
 * Multi-Application Gateway for Replit
 * Serves all 5 frontend applications through sub-paths on a single port
 * Handles both API routing and frontend application serving
 */

const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const querystring = require('querystring');

const PORT = process.env.GATEWAY_PORT || 5000;

// Security utilities
function sanitizePath(requestPath) {
  // Normalize path and prevent directory traversal
  const normalized = path.normalize(requestPath);
  
  // Check for path traversal attempts
  if (normalized.includes('..') || normalized.includes('\\') || normalized.startsWith('/etc/') || normalized.startsWith('/proc/')) {
    throw new Error('Path traversal detected');
  }
  
  return normalized;
}

function isValidPath(pathname) {
  try {
    sanitizePath(pathname);
    return true;
  } catch (error) {
    return false;
  }
}

// Frontend application configurations
const FRONTEND_APPS = {
  'super-admin': { port: 3003, basePath: '/' },
  'web': { port: 3000, basePath: '/web' },
  'mobile': { port: 3001, basePath: '/mobile' },
  'admin': { port: 3002, basePath: '/admin' },
  'ops': { port: 3004, basePath: '/ops' }
};

// Complete Service registry - All 26 microservices
const SERVICES = {
  'auth': { port: 8085, url: 'http://localhost:8085' },
  'identity-access': { port: 3020, url: 'http://localhost:3020' },
  'user-role-management': { port: 3035, url: 'http://localhost:3035' },
  'company-management': { port: 3013, url: 'http://localhost:3013' },
  'catalog-management': { port: 3022, url: 'http://localhost:3022' },
  'inventory-management': { port: 3025, url: 'http://localhost:3025' },
  'order-management': { port: 3023, url: 'http://localhost:3023' },
  'payment-processing': { port: 3026, url: 'http://localhost:3026' },
  'shipping-delivery': { port: 3034, url: 'http://localhost:3034' },
  'customer-service': { port: 3024, url: 'http://localhost:3024' },
  'notification-service': { port: 3031, url: 'http://localhost:3031' },
  'employee-management': { port: 3028, url: 'http://localhost:3028' },
  'accounting-management': { port: 3014, url: 'http://localhost:3014' },
  'expense-monitoring': { port: 3021, url: 'http://localhost:3021' },
  'analytics-reporting': { port: 3015, url: 'http://localhost:3015' },
  'performance-monitor': { port: 3029, url: 'http://localhost:3029' },
  'reporting-management': { port: 3032, url: 'http://localhost:3032' },
  'content-management': { port: 3017, url: 'http://localhost:3017' },
  'image-management': { port: 3030, url: 'http://localhost:3030' },
  'label-design': { port: 3027, url: 'http://localhost:3027' },
  'marketplace-management': { port: 3033, url: 'http://localhost:3033' },
  'subscription-management': { port: 3036, url: 'http://localhost:3036' },
  'multi-language-management': { port: 3019, url: 'http://localhost:3019' },
  'compliance-audit': { port: 3016, url: 'http://localhost:3016' },
  'integration-hub': { port: 3018, url: 'http://localhost:3018' },
  'direct-data': { port: 8081, url: 'http://localhost:8081' }
};

function setCorsHeaders(res, origin) {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:5000'
  ];
  
  // Allow all Replit domains
  if (origin && (origin.includes('.replit.dev') || origin.includes('.replit.app') || allowedOrigins.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
}

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Development-friendly CSP that allows Next.js hot reloading
  const isDevelopment = process.env.NODE_ENV !== 'production';
  if (isDevelopment) {
    res.setHeader('Content-Security-Policy', 
      "default-src 'self'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' ws: wss:;"
    );
  } else {
    res.setHeader('Content-Security-Policy', 
      "default-src 'self'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "script-src 'self'; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self';"
    );
  }
}

function sendJSON(res, statusCode, data, origin = null) {
  setCorsHeaders(res, origin);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Determine which frontend app to serve based on URL path
function getFrontendApp(pathname) {
  for (const [appName, config] of Object.entries(FRONTEND_APPS)) {
    if (pathname === config.basePath || pathname.startsWith(config.basePath + '/')) {
      return { appName, config };
    }
  }
  return null;
}

// Proxy request to microservice or frontend app
function proxyRequest(req, res, targetPort, targetPath, requestBody = null) {
  const bodyData = requestBody ? JSON.stringify(requestBody) : '';
  
  const options = {
    hostname: 'localhost',
    port: targetPort,
    path: targetPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: `localhost:${targetPort}`,
      'Content-Length': Buffer.byteLength(bodyData)
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    setCorsHeaders(res, req.headers.origin);
    
    // Forward response headers
    Object.keys(proxyRes.headers).forEach(key => {
      if (key.toLowerCase() !== 'access-control-allow-origin') {
        res.setHeader(key, proxyRes.headers[key]);
      }
    });

    res.writeHead(proxyRes.statusCode);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error(`Proxy error to port ${targetPort}:`, err.message);
    sendJSON(res, 502, { 
      error: 'Service unavailable',
      service: `Port ${targetPort}`,
      message: err.message 
    }, req.headers.origin);
  });

  if (bodyData) {
    proxyReq.write(bodyData);
  }
  
  proxyReq.end();
}

// Parse request body
function parseRequestBody(req) {
  return new Promise((resolve) => {
    if (req.method === 'GET' || req.method === 'HEAD') {
      resolve(null);
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : null);
      } catch {
        resolve(null);
      }
    });
  });
}

async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname} - Origin: ${req.headers.origin || 'None'}`);
  
  // Debug authentication requests
  if (pathname.includes('/auth/')) {
    console.log('AUTH REQUEST DEBUG:', {
      method: req.method,
      pathname: pathname,
      headers: {
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent'],
        'origin': req.headers.origin
      }
    });
  }

  // Security: Validate path for traversal attacks
  if (!isValidPath(pathname)) {
    setCorsHeaders(res, req.headers.origin);
    setSecurityHeaders(res);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid path detected' }));
    return;
  }

  // Security headers for all responses
  setSecurityHeaders(res);
  setCorsHeaders(res, req.headers.origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse request body for API calls
  req.body = await parseRequestBody(req);

  // API Routes - All /api/* requests go to microservices
  if (pathname.startsWith('/api/')) {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length < 2) {
      return sendJSON(res, 400, { error: 'Invalid API path' }, req.headers.origin);
    }

    const serviceName = pathSegments[1]; // Extract service name from /api/{service}/...
    const service = SERVICES[serviceName];
    
    if (!service) {
      return sendJSON(res, 404, { 
        error: 'Service not found',
        requested: serviceName,
        available: Object.keys(SERVICES)
      }, req.headers.origin);
    }

    // For auth service, preserve the full path structure
    let targetPath;
    if (serviceName === 'auth') {
      targetPath = pathname + (parsedUrl.search || '');
    } else {
      targetPath = '/' + pathSegments.slice(1).join('/') + (parsedUrl.search || '');
    }
    
    // Debug authentication routing
    if (pathname.includes('/auth/')) {
      console.log('AUTH ROUTING DEBUG:', {
        serviceName,
        targetPath,
        targetPort: service.port,
        originalPath: pathname
      });
    }
    
    return proxyRequest(req, res, service.port, targetPath, req.body);
  }

  // Frontend App Routes - Serve different apps based on path
  const frontendApp = getFrontendApp(pathname);
  
  if (frontendApp) {
    const { appName, config } = frontendApp;
    
    // Remove the base path prefix for the target app
    let targetPath = pathname;
    if (config.basePath !== '/' && pathname.startsWith(config.basePath)) {
      targetPath = pathname.substring(config.basePath.length) || '/';
    }
    
    // Add query string if present
    if (parsedUrl.search) {
      targetPath += parsedUrl.search;
    }
    
    return proxyRequest(req, res, config.port, targetPath, req.body);
  }

  // Default fallback - serve super admin (root path)
  return proxyRequest(req, res, FRONTEND_APPS['super-admin'].port, pathname + (parsedUrl.search || ''), req.body);
}

// Create and start the server
const server = http.createServer(handleRequest);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Multi-Application Gateway running on port ${PORT}`);
  console.log(`📊 Managing ${Object.keys(SERVICES).length} microservices`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/auth/health`);
  
  console.log('\n🌐 Frontend Applications:');
  Object.entries(FRONTEND_APPS).forEach(([name, config]) => {
    const displayPath = config.basePath === '/' ? '/' : config.basePath;
    console.log(`   ${name}: http://localhost:${PORT}${displayPath} → :${config.port}`);
  });
  
  console.log('\n📡 API Service Mappings:');
  Object.entries(SERVICES).forEach(([name, config]) => {
    console.log(`   /api/${name} → ${config.url}`);
  });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Gateway shutting down...');
  server.close();
});

process.on('SIGINT', () => {
  console.log('Gateway shutting down...');
  server.close();
  process.exit(0);
});

module.exports = server;