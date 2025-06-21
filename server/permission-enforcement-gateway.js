/**
 * Permission Enforcement API Gateway
 * Validates CRUD permissions before forwarding requests to microservices
 */

const http = require('http');
const url = require('url');

const PORT = 8083;

// Microservice mapping with their ports
const microserviceRoutes = {
  'identity-access': 3010,
  'user-role-management': 3011,
  'compliance-audit': 3012,
  'content-management': 3015,
  'integration-hub': 3016,
  'employee-management': 3017,
  'performance-monitor': 3014,
  'catalog-management': 3020,
  'inventory-management': 3021,
  'order-management': 3022,
  'payment-processing': 3023,
  'notification-service': 3024,
  'customer-service': 3031,
  'accounting-management': 3032,
  'analytics-reporting': 3033,
  'expense-monitoring': 3037,
  'label-design': 3039,
  'marketplace-management': 3040,
  'shipping-delivery': 3042,
  'reporting-management': 3065,
  'multi-language-management': 3050
};

// Map HTTP methods to CRUD operations
const methodToCRUD = {
  'GET': 'read',
  'POST': 'create',
  'PUT': 'update',
  'PATCH': 'update',
  'DELETE': 'delete'
};

// Get user permissions from role management service
async function getUserPermissions(userId) {
  try {
    // In production, this would validate JWT and get user's role
    // For demo, we'll use a sample user with Store Manager role
    const roleResponse = await fetch('http://localhost:8081/api/user-role-management');
    const roleData = await roleResponse.json();
    
    // Return Store Manager permissions for demo
    const storeManagerRole = roleData.data.find(role => role.name === 'Store Manager');
    return storeManagerRole ? storeManagerRole.permissions : {};
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return {};
  }
}

// Check if user has required permission for microservice operation
function hasPermission(userPermissions, microservice, operation) {
  // Super admin bypass
  if (userPermissions.all === 'all') {
    return true;
  }
  
  // Check specific microservice permissions
  const servicePermissions = userPermissions[microservice];
  if (!servicePermissions || typeof servicePermissions !== 'object') {
    return false;
  }
  
  return servicePermissions[operation] === true;
}

// Extract microservice name from URL path
function extractMicroserviceName(pathname) {
  const pathParts = pathname.split('/');
  if (pathParts[1] === 'api' && pathParts[2]) {
    // Handle paths like /api/catalog-management/products
    const serviceName = pathParts[2];
    return microserviceRoutes[serviceName] ? serviceName : null;
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (pathname === '/health') {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({ 
      status: 'healthy', 
      message: 'Permission Enforcement Gateway Active',
      timestamp: new Date().toISOString() 
    }));
    return;
  }

  // Extract microservice and required operation
  const microservice = extractMicroserviceName(pathname);
  const operation = methodToCRUD[method];

  if (!microservice) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(404);
    res.end(JSON.stringify({
      error: 'Microservice not found',
      path: pathname,
      availableServices: Object.keys(microserviceRoutes)
    }));
    return;
  }

  if (!operation) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(405);
    res.end(JSON.stringify({
      error: 'Method not allowed',
      method: method,
      allowedMethods: Object.keys(methodToCRUD)
    }));
    return;
  }

  // Get user permissions (in production, extract from JWT)
  const userId = req.headers['user-id'] || 'demo-user';
  const userPermissions = await getUserPermissions(userId);

  // Check permissions
  if (!hasPermission(userPermissions, microservice, operation)) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(403);
    res.end(JSON.stringify({
      error: 'Insufficient permissions',
      required: `${operation} access to ${microservice}`,
      userPermissions: userPermissions[microservice] || 'none',
      message: `User lacks ${operation} permission for ${microservice} microservice`
    }));
    return;
  }

  // Forward request to microservice
  const targetPort = microserviceRoutes[microservice];
  const target = `http://localhost:${targetPort}`;
  
  console.log(`✅ Permission granted: ${method} ${pathname} → ${target}`);
  console.log(`   User permissions: ${JSON.stringify(userPermissions[microservice] || {})}`);

  // Simple proxy implementation without external dependency
  const targetUrl = new URL(pathname.replace(`/api/${microservice}`, ''), target);
  
  const proxyReq = http.request({
    hostname: targetUrl.hostname,
    port: targetUrl.port,
    path: targetUrl.pathname + targetUrl.search,
    method: method,
    headers: {
      ...req.headers,
      host: targetUrl.host
    }
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error(`Proxy error to ${target}:`, err.message);
    res.writeHead(502);
    res.end(JSON.stringify({
      error: 'Bad Gateway',
      message: `Failed to connect to ${microservice} microservice`,
      target: target
    }));
  });

  req.pipe(proxyReq);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🔒 Permission Enforcement Gateway running on port ${PORT}`);
  console.log(`🛡️  Protecting ${Object.keys(microserviceRoutes).length} microservices with CRUD validation`);
  console.log(`⚡ Method mapping: ${JSON.stringify(methodToCRUD)}`);
  console.log(`🎯 Example: GET /api/catalog-management/products (requires 'read' permission)`);
  console.log(`🎯 Example: POST /api/inventory-management/items (requires 'create' permission)`);
});