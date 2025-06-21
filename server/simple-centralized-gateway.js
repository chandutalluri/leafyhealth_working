/**
 * Simplified Centralized API Gateway
 * Routes all frontend requests to appropriate microservices
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');

const app = express();
const PORT = process.env.GATEWAY_PORT || 8080;

// Security and middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002',
    'http://localhost:3003', 'http://localhost:5000'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Microservice registry
const SERVICES = {
  'auth': 'http://localhost:3020',
  'company': 'http://localhost:3021',
  'catalog': 'http://localhost:3022',
  'orders': 'http://localhost:3023',
  'customers': 'http://localhost:3024',
  'inventory': 'http://localhost:3025',
  'payments': 'http://localhost:3026',
  'shipping': 'http://localhost:3027',
  'employees': 'http://localhost:3028',
  'analytics': 'http://localhost:3029',
  'images': 'http://localhost:3030',
  'notifications': 'http://localhost:3031'
};

// Token validation
async function validateToken(token) {
  try {
    const response = await axios.post('http://localhost:3020/auth/validate-token', {
      token: token
    }, { timeout: 5000 });
    return response.data;
  } catch (error) {
    return { valid: false, error: 'Token validation failed' };
  }
}

// Authentication middleware
async function authenticate(req, res, next) {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const validation = await validateToken(token);
  
  if (!validation.valid) {
    return res.status(401).json({ error: validation.error || 'Invalid token' });
  }

  req.user = validation.user;
  next();
}

// Main proxy handler
app.use('/api/:service/*', async (req, res) => {
  const serviceName = req.params.service;
  const serviceUrl = SERVICES[serviceName];
  
  if (!serviceUrl) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const path = req.originalUrl.replace(`/api/${serviceName}`, '');
  const targetUrl = `${serviceUrl}${path}`;
  
  try {
    const config = {
      method: req.method,
      url: targetUrl,
      headers: {
        ...req.headers,
        host: undefined
      },
      timeout: 30000
    };

    // Add user context if authenticated
    if (req.user) {
      config.headers['X-User-ID'] = req.user.id;
      config.headers['X-User-Role'] = req.user.role;
      config.headers['X-Branch-ID'] = req.user.branch_id;
    }

    // Add body for write operations
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      config.data = req.body;
    }

    const response = await axios(config);
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error(`Gateway error for ${serviceName}:`, error.message);
    
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(502).json({
        error: 'Service unavailable',
        service: serviceName
      });
    }
  }
});

// Health check
app.get('/health', async (req, res) => {
  const healthChecks = await Promise.allSettled(
    Object.entries(SERVICES).map(async ([name, url]) => {
      try {
        await axios.get(`${url}/health`, { timeout: 2000 });
        return { service: name, status: 'healthy' };
      } catch {
        return { service: name, status: 'unhealthy' };
      }
    })
  );

  const results = healthChecks.map(result => result.value);
  const healthy = results.filter(r => r.status === 'healthy').length;
  
  res.json({
    status: healthy === results.length ? 'healthy' : 'degraded',
    services: results,
    summary: `${healthy}/${results.length} services healthy`
  });
});

// Service registry
app.get('/registry', (req, res) => {
  res.json({
    services: Object.keys(SERVICES),
    endpoints: SERVICES
  });
});

// Start gateway
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Centralized API Gateway running on port ${PORT}`);
  console.log(`📊 Managing ${Object.keys(SERVICES).length} microservices`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  
  Object.entries(SERVICES).forEach(([name, url]) => {
    console.log(`   /api/${name} → ${url}`);
  });
});

module.exports = app;