/**
 * Unified Multi-Application Gateway
 * Single port (5000) serving all frontend applications and backend APIs
 * Eliminates port conflicts and provides clean unified access
 */

const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const querystring = require('querystring');
const { spawn } = require('child_process');
const httpProxy = require('http-proxy-middleware');

const PORT = process.env.GATEWAY_PORT || 5000;

// Enhanced error handling for EPIPE and connection errors
process.on('uncaughtException', (err) => {
  if (err.code === 'EPIPE' || err.errno === -32) {
    console.log('⚠️  Handled EPIPE error - client disconnected');
    return;
  }
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  if (reason && (reason.code === 'EPIPE' || reason.errno === -32)) {
    console.log('⚠️  Handled EPIPE rejection - client disconnected');
    return;
  }
  console.error('Unhandled Rejection:', reason);
});

// Internal frontend application processes
const frontendProcesses = new Map();

// Frontend application configurations - served internally
const FRONTEND_APPS = {
  'super-admin': { 
    port: 3003, 
    basePath: '/', 
    dir: 'frontend/apps/super-admin',
    cmd: 'npm',
    args: ['run', 'dev', '--', '--port', '3003', '--hostname', '127.0.0.1']
  },
  'ecommerce-web': {
    port: 3000,
    basePath: '/customer',
    dir: 'frontend/apps/ecommerce-web',
    cmd: 'npm',
    args: ['run', 'dev', '--', '--port', '3000', '--hostname', '127.0.0.1']
  },
  'ecommerce-mobile': {
    port: 3001,
    basePath: '/mobile',
    dir: 'frontend/apps/ecommerce-mobile',
    cmd: 'npm',
    args: ['run', 'dev', '--', '--port', '3001', '--hostname', '127.0.0.1']
  },
  'admin-portal': {
    port: 3002,
    basePath: '/admin',
    dir: 'frontend/apps/admin-portal',
    cmd: 'npm',
    args: ['run', 'dev', '--', '--port', '3002', '--hostname', '127.0.0.1']
  },
  'ops-delivery': {
    port: 3004,
    basePath: '/ops',
    dir: 'frontend/apps/ops-delivery',
    cmd: 'npm',
    args: ['run', 'dev', '--', '--port', '3004', '--hostname', '127.0.0.1']
  }
};

// Backend microservices registry - LOCALHOST ONLY FOR SECURITY
const SERVICES = {
  'auth': { port: 8085, url: 'http://127.0.0.1:8085' },
  'identity-access': { port: 3020, url: 'http://127.0.0.1:3020' },
  'user-role-management': { port: 3035, url: 'http://127.0.0.1:3035' },
  'company-management': { port: 3013, url: 'http://127.0.0.1:3013' },
  'catalog-management': { port: 3022, url: 'http://127.0.0.1:3022' },
  'inventory-management': { port: 3025, url: 'http://127.0.0.1:3025' },
  'order-management': { port: 3030, url: 'http://127.0.0.1:3030' },
  'payment-processing': { port: 3031, url: 'http://127.0.0.1:3031' },
  'shipping-delivery': { port: 3034, url: 'http://127.0.0.1:3034' },
  'customer-service': { port: 3024, url: 'http://127.0.0.1:3024' },
  'notification-service': { port: 3032, url: 'http://127.0.0.1:3032' },
  'employee-management': { port: 3028, url: 'http://127.0.0.1:3028' },
  'accounting-management': { port: 3014, url: 'http://127.0.0.1:3014' },
  'expense-monitoring': { port: 3021, url: 'http://127.0.0.1:3021' },
  'analytics-reporting': { port: 3015, url: 'http://127.0.0.1:3015' },
  'performance-monitor': { port: 3029, url: 'http://127.0.0.1:3029' },
  'reporting-management': { port: 3033, url: 'http://127.0.0.1:3033' },
  'content-management': { port: 3017, url: 'http://127.0.0.1:3017' },
  'image-management': { port: 3023, url: 'http://127.0.0.1:3023' },
  'label-design': { port: 3027, url: 'http://127.0.0.1:3027' },
  'marketplace-management': { port: 3036, url: 'http://127.0.0.1:3036' },
  'subscription-management': { port: 3036, url: 'http://127.0.0.1:3036' },
  'multi-language-management': { port: 3019, url: 'http://127.0.0.1:3019' },
  'compliance-audit': { port: 3016, url: 'http://127.0.0.1:3016' },
  'integration-hub': { port: 3018, url: 'http://127.0.0.1:3018' },
  'direct-data': { port: 8081, url: 'http://127.0.0.1:8081' }
};

// Start frontend applications internally
function startFrontendApp(appName, config) {
  if (frontendProcesses.has(appName)) {
    console.log(`📱 Frontend app ${appName} already running`);
    return;
  }

  console.log(`🚀 Starting ${appName} frontend on port ${config.port}`);
  
  const childProcess = spawn(config.cmd, config.args, {
    cwd: config.dir,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { 
      ...process.env, 
      PORT: config.port,
      NODE_ENV: 'development',
      NEXT_TELEMETRY_DISABLED: '1'
    }
  });

  childProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log(`[${appName}] ${output}`);
    
    // Check if the app is ready
    if (output.includes('Ready in') || output.includes('compiled successfully')) {
      console.log(`✅ ${appName} is ready and accessible through gateway`);
    }
  });

  childProcess.stderr.on('data', (data) => {
    console.error(`[${appName}] ${data.toString().trim()}`);
  });

  childProcess.on('exit', (code) => {
    console.log(`[${appName}] Process exited with code ${code}`);
    frontendProcesses.delete(appName);
    
    // Restart the process if it exits unexpectedly
    if (code !== 0 && code !== null) {
      console.log(`🔄 Restarting ${appName} frontend after unexpected exit...`);
      setTimeout(() => {
        startFrontendApp(appName, config);
      }, 3000);
    }
  });

  childProcess.on('error', (err) => {
    console.error(`[${appName}] Failed to start:`, err.message);
    frontendProcesses.delete(appName);
  });

  frontendProcesses.set(appName, childProcess);
}

// Health check for services
async function checkServiceHealth(port) {
  return new Promise((resolve) => {
    const req = http.request(`http://localhost:${port}/`, { timeout: 5000 }, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// Initialize all frontend applications with health monitoring
async function initializeFrontendApps() {
  console.log('🎯 Initializing all 5 frontend applications...');
  
  for (const [appName, config] of Object.entries(FRONTEND_APPS)) {
    if (!frontendProcesses.has(appName)) {
      console.log(`🚀 Starting ${appName} frontend on port ${config.port}`);
      startFrontendApp(appName, config);
      
      // Stagger startup to avoid resource conflicts
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log(`📱 Frontend app ${appName} already running`);
    }
  }
  
  // Verify all services after startup
  setTimeout(async () => {
    for (const [appName, config] of Object.entries(FRONTEND_APPS)) {
      const isHealthy = await checkServiceHealth(config.port);
      if (isHealthy) {
        console.log(`✅ ${appName} health check passed - ${config.basePath}`);
      } else {
        console.log(`⚠️  ${appName} health check failed, retrying...`);
        startFrontendApp(appName, config);
      }
    }
  }, 10000);
}

function setCorsHeaders(res, origin) {
  // Allow all Replit domains and localhost
  if (origin && (origin.includes('.replit.dev') || origin.includes('.replit.app') || origin.includes('localhost'))) {
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
  // Development-friendly security headers for Replit environment
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'no-referrer');
  
  // Development-friendly CSP that allows Next.js hot reload and webpack
  res.setHeader('Content-Security-Policy', 
    "default-src 'self' 'unsafe-eval' 'unsafe-inline' *.replit.dev *.replit.app data: blob: ws: wss:;" +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.replit.dev *.replit.app;" +
    "style-src 'self' 'unsafe-inline' *.replit.dev *.replit.app;" +
    "img-src 'self' data: https: *.replit.dev *.replit.app;" +
    "font-src 'self' data: https: *.replit.dev *.replit.app;" +
    "connect-src 'self' ws: wss: *.replit.dev *.replit.app;" +
    "frame-src 'self' *.replit.dev *.replit.app"
  );
}

function sendJSON(res, statusCode, data, origin = null) {
  setCorsHeaders(res, origin);
  setSecurityHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function proxyRequest(req, res, targetPort, targetPath, requestBody = null) {
  // Ensure proper path formatting with leading slash
  const formattedPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
  const targetUrl = `http://localhost:${targetPort}${formattedPath}`;
  
  console.log(`🔗 Proxying ${req.method} ${req.url} → ${targetUrl}`);
  
  const options = {
    method: req.method,
    headers: {
      ...req.headers,
      host: `localhost:${targetPort}`,
      'x-forwarded-for': req.connection.remoteAddress,
      'x-forwarded-proto': req.headers['x-forwarded-proto'] || 'http',
      'x-gateway-routed': 'true'
    },
    timeout: 30000
  };

  const proxyReq = http.request(targetUrl, options, (proxyRes) => {
    setCorsHeaders(res, req.headers.origin);
    setSecurityHeaders(res);
    
    // Enhanced connection error handling
    proxyRes.on('error', (err) => {
      if (err.code === 'EPIPE' || err.errno === -32) {
        console.log('⚠️  Client disconnected during response');
        return;
      }
      console.error('Proxy response error:', err.message);
    });
    
    // Forward response headers while filtering sensitive ones
    const responseHeaders = { ...proxyRes.headers };
    delete responseHeaders['x-powered-by'];
    delete responseHeaders['server'];
    
    if (!res.headersSent) {
      res.writeHead(proxyRes.statusCode, responseHeaders);
    }
    
    // Safe pipe with error handling
    proxyRes.pipe(res, { end: true }).on('error', (err) => {
      if (err.code === 'EPIPE' || err.errno === -32) {
        console.log('⚠️  Client disconnected during pipe');
        return;
      }
      console.error('Pipe error:', err.message);
    });
  });

  proxyReq.on('error', async (err) => {
    // Handle EPIPE errors gracefully
    if (err.code === 'EPIPE' || err.errno === -32) {
      console.log('⚠️  Client disconnected during request');
      return;
    }
    
    console.error(`Proxy error to ${targetUrl}:`, err.message);
    
    // Check if response is already sent
    if (res.headersSent) {
      return;
    }
    
    // Check if it's a frontend service and restart if needed
    const frontendApp = Object.entries(FRONTEND_APPS).find(([name, config]) => config.port === targetPort);
    if (frontendApp) {
      const [appName, appConfig] = frontendApp;
      console.log(`🔄 ${appName} service unavailable, attempting restart...`);
      setTimeout(() => {
        startFrontendApp(appName, appConfig);
      }, 1000);
    }
    
    // For API services, check if they're starting up and wait briefly
    if (targetPort >= 3000 && targetPort <= 8999) {
      // Wait a moment and retry once for starting services
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const retryReq = http.request(targetUrl, { ...options, timeout: 5000 }, (retryRes) => {
          setCorsHeaders(res, req.headers.origin);
          setSecurityHeaders(res);
          const responseHeaders = { ...retryRes.headers };
          delete responseHeaders['x-powered-by'];
          delete responseHeaders['server'];
          res.writeHead(retryRes.statusCode, responseHeaders);
          retryRes.pipe(res, { end: true });
        });
        
        retryReq.on('error', () => {
          sendJSON(res, 502, { 
            error: 'Service temporarily unavailable', 
            message: 'The requested service is starting up. Please try again in a moment.',
            retry: true
          }, req.headers.origin);
        });
        
        if (requestBody) {
          retryReq.write(requestBody);
        }
        retryReq.end();
        
      } catch (retryError) {
        sendJSON(res, 502, { 
          error: 'Service temporarily unavailable', 
          message: 'The requested service is starting up. Please try again in a moment.',
          retry: true
        }, req.headers.origin);
      }
    } else {
      sendJSON(res, 502, { 
        error: 'Service temporarily unavailable', 
        message: 'The requested service is starting up. Please try again in a moment.',
        retry: true
      }, req.headers.origin);
    }
  });

  proxyReq.on('timeout', () => {
    console.error(`Proxy timeout to ${targetUrl}`);
    proxyReq.destroy();
    
    // Check if response is already sent
    if (res.headersSent) {
      return;
    }
    
    sendJSON(res, 504, { error: 'Gateway timeout' }, req.headers.origin);
  });

  // Handle request socket errors
  req.on('error', (err) => {
    if (err.code === 'EPIPE' || err.errno === -32) {
      console.log('⚠️  Client disconnected during request processing');
      return;
    }
    console.error('Request error:', err.message);
  });

  res.on('error', (err) => {
    if (err.code === 'EPIPE' || err.errno === -32) {
      console.log('⚠️  Client disconnected during response');
      return;
    }
    console.error('Response error:', err.message);
  });

  if (requestBody) {
    proxyReq.write(requestBody);
  }
  
  proxyReq.end();
}

async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const origin = req.headers.origin;

  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname} - Origin: ${origin || 'None'}`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res, origin);
    setSecurityHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  // API routes - proxy to backend microservices
  if (pathname.startsWith('/api/')) {
    const requestBody = req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' 
      ? await parseRequestBody(req) : null;

    // Route specific API endpoints to appropriate services
    if (pathname.startsWith('/api/auth/') || pathname === '/api/auth') {
      const authPath = pathname.replace('/api/auth', '') || '/';
      proxyRequest(req, res, 8085, authPath, requestBody);
      return;
    }
    
    if (pathname.startsWith('/api/company-management')) {
      const companyPath = pathname.replace('/api', '');
      proxyRequest(req, res, 3013, companyPath, requestBody);
      return;
    }
    
    if (pathname.startsWith('/api/direct-data/') || pathname === '/api/direct-data') {
      proxyRequest(req, res, 8081, pathname.replace('/api/direct-data', ''), requestBody);
      return;
    }

    // Route all other API requests to the Direct Data Gateway which consolidates most data
    proxyRequest(req, res, 8081, pathname, requestBody);
    return;
  }

  // Frontend routes - multi-app routing based on path prefix
  // Handle specific route patterns
  if (pathname.startsWith('/customer')) {
    const ecommerceWebConfig = FRONTEND_APPS['ecommerce-web'];
    const internalPath = pathname === '/customer' ? '/' : pathname.substring('/customer'.length);
    proxyRequest(req, res, ecommerceWebConfig.port, internalPath);
    return;
  }
  
  if (pathname.startsWith('/mobile')) {
    const ecommerceMobileConfig = FRONTEND_APPS['ecommerce-mobile'];
    const internalPath = pathname === '/mobile' ? '/' : pathname.substring('/mobile'.length);
    proxyRequest(req, res, ecommerceMobileConfig.port, internalPath);
    return;
  }
  
  if (pathname.startsWith('/admin')) {
    const adminPortalConfig = FRONTEND_APPS['admin-portal'];
    const internalPath = pathname === '/admin' ? '/' : pathname.substring('/admin'.length);
    proxyRequest(req, res, adminPortalConfig.port, internalPath);
    return;
  }
  
  if (pathname.startsWith('/ops')) {
    const opsDeliveryConfig = FRONTEND_APPS['ops-delivery'];
    const internalPath = pathname === '/ops' ? '/' : pathname.substring('/ops'.length);
    proxyRequest(req, res, opsDeliveryConfig.port, internalPath);
    return;
  }

  // Default to super-admin for root path and unmatched paths
  if (pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/login') || pathname.startsWith('/dashboard')) {
    const superAdminConfig = FRONTEND_APPS['super-admin'];
    if (superAdminConfig) {
      proxyRequest(req, res, superAdminConfig.port, pathname);
      return;
    }
  }

  // Fallback 404
  sendJSON(res, 404, { error: 'Route not found', path: pathname }, origin);
}

function parseRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', () => {
      resolve('');
    });
  });
}

// WebSocket upgrade handler for Next.js HMR across all frontend apps
function handleUpgrade(request, socket, head) {
  const { pathname } = url.parse(request.url);
  
  if (pathname === '/_next/webpack-hmr') {
    // Default to super-admin for root level HMR
    proxyWebSocket(request, socket, 3003, pathname);
    return;
  }
  
  // Handle WebSocket upgrades for specific app paths
  for (const [appName, appConfig] of Object.entries(FRONTEND_APPS)) {
    if (pathname.startsWith(appConfig.basePath + '/_next/webpack-hmr')) {
      proxyWebSocket(request, socket, appConfig.port, '/_next/webpack-hmr');
      return;
    }
  }
  
  socket.destroy();
}

function proxyWebSocket(request, socket, targetPort, targetPath) {
  const proxyReq = http.request({
    hostname: '127.0.0.1',
    port: targetPort,
    path: targetPath,
    method: 'GET',
    headers: {
      ...request.headers,
      'upgrade': 'websocket',
      'connection': 'upgrade'
    }
  });
  
  proxyReq.on('upgrade', (res, proxySocket, proxyHead) => {
    socket.write('HTTP/1.1 101 Switching Protocols\r\n' +
                 'Upgrade: websocket\r\n' +
                 'Connection: upgrade\r\n' +
                 '\r\n');
    
    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });
  
  proxyReq.on('error', (err) => {
    console.log(`WebSocket proxy error for port ${targetPort}:`, err.message);
    socket.destroy();
  });
  
  proxyReq.end();
}

// Start the unified gateway
const server = http.createServer(handleRequest);

// Add WebSocket upgrade support
server.on('upgrade', handleUpgrade);

server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Production Gateway running on port', PORT);
  console.log('🔒 Security: Only port', PORT, 'externally accessible');
  console.log('🌐 All services proxied through localhost');
  console.log('📊 Managing', Object.keys(SERVICES).length, 'microservices');
  console.log('🏥 Health: http://localhost:' + PORT + '/api/auth/health');
  console.log('🌐 Frontend Applications:');
  
  for (const [name, config] of Object.entries(FRONTEND_APPS)) {
    console.log(`   ${name}: http://localhost:${PORT}${config.basePath} → :${config.port}`);
  }
  
  console.log('📡 API Service Mappings:');
  for (const [name, service] of Object.entries(SERVICES)) {
    console.log(`   /api/${name} → ${service.url}`);
  }

  // Initialize frontend applications
  setTimeout(() => {
    initializeFrontendApps();
  }, 2000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down unified gateway...');
  
  // Stop all frontend processes
  for (const [appName, childProcess] of frontendProcesses) {
    console.log(`📱 Stopping ${appName}...`);
    childProcess.kill('SIGTERM');
  }
  
  server.close(() => {
    console.log('✅ Unified gateway stopped');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  process.emit('SIGTERM');
});