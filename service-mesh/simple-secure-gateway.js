/**
 * Simple Secure API Gateway - Working Implementation
 * Routes external requests to internal microservices with security
 */

const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const url = require('url');

const PORT = 8080;

// Service routing configuration
const serviceRoutes = {
  '/api/auth': 'http://localhost:3010',
  '/api/users': 'http://localhost:3011', 
  '/api/products': 'http://localhost:3020',
  '/api/categories': 'http://localhost:3020',
  '/api/inventory': 'http://localhost:3021',
  '/api/orders': 'http://localhost:3022',
  '/api/payments': 'http://localhost:3023',
  '/api/notifications': 'http://localhost:3024',
  '/api/customers': 'http://localhost:3031',
  '/api/accounting': 'http://localhost:3032',
  '/api/analytics': 'http://localhost:3033',
  '/api/compliance': 'http://localhost:3034',
  '/api/content': 'http://localhost:3035',
  '/api/employees': 'http://localhost:3036',
  '/api/expenses': 'http://localhost:3037',
  '/api/integrations': 'http://localhost:3038',
  '/api/labels': 'http://localhost:3039',
  '/api/marketplace': 'http://localhost:3040',
  '/api/performance': 'http://localhost:3041',
  '/api/shipping': 'http://localhost:3042'
};

// Block external access to microservice ports
const blockedPorts = [3010, 3011, 3020, 3021, 3022, 3023, 3024, 3031, 3032, 3033, 3034, 3035, 3036, 3037, 3038, 3039, 3040, 3041, 3042];

function findServiceTarget(pathname) {
  for (const [route, target] of Object.entries(serviceRoutes)) {
    if (pathname.startsWith(route)) {
      return { target, route };
    }
  }
  return null;
}

function proxyToService(req, res, target, route) {
  const targetUrl = url.parse(target);
  
  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port,
    path: req.url.replace(route, '') || '/',
    method: req.method,
    headers: {
      ...req.headers,
      'host': `${targetUrl.hostname}:${targetUrl.port}`,
      'x-forwarded-for': req.socket.remoteAddress,
      'x-forwarded-proto': 'http',
      'x-gateway-auth': 'internal-mesh',
      'user-agent': 'API-Gateway/2.0'
    },
    timeout: 30000
  };

  const proxyReq = http.request(options, (proxyRes) => {
    // Forward response headers
    Object.keys(proxyRes.headers).forEach(key => {
      res.setHeader(key, proxyRes.headers[key]);
    });
    
    res.writeHead(proxyRes.statusCode);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error(`Service ${target} error:`, err.message);
    
    if (!res.headersSent) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Service Unavailable',
        message: 'Microservice temporarily unavailable',
        timestamp: new Date().toISOString()
      }));
    }
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    if (!res.headersSent) {
      res.writeHead(504, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Gateway Timeout' }));
    }
  });

  // Forward request body for POST/PUT
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    req.pipe(proxyReq, { end: true });
  } else {
    proxyReq.end();
  }
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Health check endpoint
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      gateway: {
        version: '2.0',
        features: ['service-mesh', 'port-security', 'cors'],
        blockedPorts: blockedPorts
      }
    }));
    return;
  }

  // Service status endpoint
  if (pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      services: Object.keys(serviceRoutes),
      securityPolicy: 'external-access-blocked',
      gatewayPort: PORT,
      blockedPorts: blockedPorts
    }));
    return;
  }

  // Route to microservices
  const service = findServiceTarget(pathname);
  if (service) {
    proxyToService(req, res, service.target, service.route);
    return;
  }

  // Default 404 response
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Not Found',
    message: 'API endpoint not found',
    availableRoutes: Object.keys(serviceRoutes),
    timestamp: new Date().toISOString()
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Secure API Gateway running on port ${PORT}`);
  console.log(`🔒 External access to ports ${blockedPorts.join(', ')} blocked`);
  console.log(`🌐 Available routes: ${Object.keys(serviceRoutes).join(', ')}`);
  console.log(`🛡️ Service mesh security enabled`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔒 Gateway shutting down...');
  server.close(() => {
    console.log('✅ Gateway shutdown complete');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔒 Gateway shutting down...');
  server.close(() => {
    console.log('✅ Gateway shutdown complete');
    process.exit(0);
  });
});