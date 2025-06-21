/**
 * Internal Proxy Server for Secure Service-to-Service Communication
 * Routes internal requests through encrypted mesh network
 */

const http = require('http');
const httpProxy = require('http-proxy-middleware');
const serviceMesh = require('./service-registry');

class InternalProxyServer {
  constructor() {
    this.proxy = httpProxy.createProxyMiddleware({
      router: this.routeRequest.bind(this),
      changeOrigin: true,
      timeout: 30000,
      secure: false,
      onProxyReq: this.addMeshHeaders.bind(this),
      onError: this.handleProxyError.bind(this)
    });
    
    this.server = null;
    this.internalPort = 9999; // Internal mesh communication port
  }

  /**
   * Route requests based on service mesh registry
   */
  routeRequest(req) {
    const serviceName = this.extractServiceName(req.url);
    
    try {
      const meshToken = req.headers['x-mesh-token'];
      if (!meshToken) {
        throw new Error('Missing mesh authentication token');
      }

      const endpoint = serviceMesh.getServiceEndpoint(serviceName, meshToken);
      return endpoint.url;
    } catch (error) {
      console.error(`❌ Routing failed for ${serviceName}:`, error.message);
      return null;
    }
  }

  /**
   * Extract service name from internal request path
   */
  extractServiceName(url) {
    const pathSegments = url.split('/').filter(Boolean);
    
    // Internal mesh routes: /mesh/service-name/endpoint
    if (pathSegments[0] === 'mesh' && pathSegments[1]) {
      return pathSegments[1];
    }
    
    throw new Error('Invalid internal mesh route format');
  }

  /**
   * Add mesh authentication headers to proxied requests
   */
  addMeshHeaders(proxyReq, req, res) {
    // Add internal mesh identification
    proxyReq.setHeader('X-Mesh-Network', 'leafyhealth-internal');
    proxyReq.setHeader('X-Mesh-Source', 'internal-proxy');
    
    // Forward original mesh token
    if (req.headers['x-mesh-token']) {
      proxyReq.setHeader('X-Mesh-Token', req.headers['x-mesh-token']);
    }
  }

  /**
   * Handle proxy errors
   */
  handleProxyError(err, req, res) {
    console.error('🚨 Internal proxy error:', err.message);
    
    if (!res.headersSent) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Internal Service Unavailable',
        message: 'Service mesh communication failed',
        timestamp: new Date().toISOString()
      }));
    }
  }

  /**
   * Start internal proxy server
   */
  start() {
    this.server = http.createServer((req, res) => {
      // Only allow internal mesh requests
      if (!req.url.startsWith('/mesh/')) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid mesh route' }));
        return;
      }

      // Validate mesh token
      const meshToken = req.headers['x-mesh-token'];
      if (!serviceMesh.validateMeshToken(meshToken)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid mesh authentication' }));
        return;
      }

      this.proxy(req, res);
    });

    this.server.listen(this.internalPort, '127.0.0.1', () => {
      console.log(`🔒 Internal mesh proxy running on port ${this.internalPort}`);
      console.log('🛡️ Only localhost internal communication allowed');
    });
  }

  /**
   * Stop internal proxy server
   */
  stop() {
    if (this.server) {
      this.server.close(() => {
        console.log('🔒 Internal mesh proxy stopped');
      });
    }
  }
}

module.exports = new InternalProxyServer();