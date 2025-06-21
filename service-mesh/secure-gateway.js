/**
 * Secure API Gateway with Service Mesh Integration
 * Replaces the existing gateway with mesh-aware routing
 */

const http = require('http');
const url = require('url');
const { Pool } = require('pg');
const winston = require('winston');
const serviceMesh = require('./service-registry');
const portSecurity = require('./port-security');

// Enhanced logging for Secure Gateway
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

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 20
});

class SecureApiGateway {
  constructor() {
    this.serviceRoutes = new Map();
    this.rateLimiter = new Map();
    this.gatewayToken = null;
    
    this.initializeGateway();
  }

  async initializeGateway() {
    // Register gateway in service mesh
    const registration = serviceMesh.registerService('api-gateway', {
      port: PORT,
      host: 'localhost',
      endpoints: ['/api/*', '/health'],
      metadata: { type: 'gateway', role: 'external-access-point' }
    });
    
    this.gatewayToken = registration.internalToken;
    
    // Initialize port security
    portSecurity.initialize();
    
    // Register all microservices in the mesh
    await this.registerMicroservices();
    
    logger.info('🔒 Secure API Gateway initialized with service mesh');
  }

  async registerMicroservices() {
    const services = [
      { name: 'identity-access', port: 3010 },
      { name: 'user-role-management', port: 3011 },
      { name: 'catalog-management', port: 3020 },
      { name: 'inventory-management', port: 3021 },
      { name: 'order-management', port: 3022 },
      { name: 'payment-processing', port: 3023 },
      { name: 'notification-service', port: 3024 },
      { name: 'customer-service', port: 3031 }
    ];

    for (const service of services) {
      serviceMesh.registerService(service.name, {
        port: service.port,
        host: 'localhost',
        endpoints: ['/health', '/api/docs', '/__introspect'],
        metadata: { type: 'microservice' }
      });
    }
  }

  handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Rate limiting
    if (!this.checkRateLimit(req)) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Rate limit exceeded' }));
      return;
    }

    // Health check endpoint
    if (pathname === '/health') {
      this.handleHealthCheck(req, res);
      return;
    }

    // Mesh status endpoint (internal only)
    if (pathname === '/mesh/status') {
      this.handleMeshStatus(req, res);
      return;
    }

    // Route API requests through service mesh
    if (pathname.startsWith('/api/')) {
      this.routeToService(req, res, pathname);
      return;
    }

    // Default response for non-API requests
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not Found',
      message: 'Endpoint not found',
      availableRoutes: ['/api/*', '/health', '/mesh/status']
    }));
  }

  async routeToService(req, res, pathname) {
    try {
      // Extract service name from path
      const pathSegments = pathname.split('/').filter(Boolean);
      const serviceName = this.mapPathToService(pathSegments);
      
      if (!serviceName) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Service not found' }));
        return;
      }

      // Get service endpoint through mesh
      const endpoint = serviceMesh.getServiceEndpoint(serviceName, this.gatewayToken);
      
      // Create secure proxy request
      await this.proxyToService(req, res, endpoint, pathname);
      
    } catch (error) {
      logger.error('Routing error:', error);
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Service Unavailable',
        message: error.message,
        timestamp: new Date().toISOString()
      }));
    }
  }

  mapPathToService(pathSegments) {
    const routeMap = {
      'auth': 'identity-access',
      'users': 'user-role-management',
      'products': 'catalog-management',
      'categories': 'catalog-management',
      'inventory': 'inventory-management',
      'orders': 'order-management',
      'payments': 'payment-processing',
      'notifications': 'notification-service',
      'customers': 'customer-service'
    };

    return routeMap[pathSegments[1]] || null;
  }

  async proxyToService(req, res, endpoint, originalPath) {
    return new Promise((resolve, reject) => {
      // Prepare request options
      const targetUrl = url.parse(endpoint.url);
      const options = {
        hostname: targetUrl.hostname,
        port: targetUrl.port,
        path: originalPath.replace('/api', ''),
        method: req.method,
        headers: {
          ...req.headers,
          'host': `${targetUrl.hostname}:${targetUrl.port}`,
          'x-forwarded-for': req.socket.remoteAddress,
          'x-forwarded-proto': 'http',
          'x-mesh-token': endpoint.internalToken,
          'user-agent': 'API-Gateway/1.0'
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
        resolve();
      });

      proxyReq.on('error', (err) => {
        logger.error(`Proxy error for ${originalPath}:`, err.message);
        reject(err);
      });

      proxyReq.on('timeout', () => {
        proxyReq.destroy();
        reject(new Error('Gateway timeout'));
      });

      // Forward request body
      if (req.method === 'POST' || req.method === 'PUT') {
        req.pipe(proxyReq, { end: true });
      } else {
        proxyReq.end();
      }
    });
  }

  handleHealthCheck(req, res) {
    const meshStatus = serviceMesh.getMeshStatus();
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      gateway: {
        port: PORT,
        version: '2.0.0',
        features: ['service-mesh', 'port-security', 'rate-limiting']
      },
      mesh: meshStatus
    }));
  }

  handleMeshStatus(req, res) {
    // Only allow internal access to mesh status
    const meshToken = req.headers['x-mesh-token'];
    if (!serviceMesh.validateMeshToken(meshToken)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized mesh access' }));
      return;
    }

    const meshStatus = serviceMesh.getMeshStatus();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(meshStatus));
  }

  checkRateLimit(req) {
    const clientIP = req.socket.remoteAddress;
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 100;

    if (!this.rateLimiter.has(clientIP)) {
      this.rateLimiter.set(clientIP, { count: 1, resetTime: now + windowMs });
      return true;
    }

    const clientData = this.rateLimiter.get(clientIP);
    
    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + windowMs;
      return true;
    }

    if (clientData.count >= maxRequests) {
      return false;
    }

    clientData.count++;
    return true;
  }

  start() {
    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Secure API Gateway running on port ${PORT}`);
      logger.info(`🛡️ Service mesh security enabled`);
      logger.info(`🔒 External access restricted to gateway only`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('🔒 Shutting down secure gateway...');
      server.close(() => {
        serviceMesh.shutdown();
        logger.info('✅ Secure gateway shutdown complete');
      });
    });
  }
}

// Start the secure gateway
const gateway = new SecureApiGateway();
gateway.start();