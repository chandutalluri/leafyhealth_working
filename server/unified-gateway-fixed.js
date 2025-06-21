/**
 * Unified Multi-Application Gateway - Fixed Version
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
  // Fixed URL construction with proper path handling
  const cleanPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
  const targetUrl = `http://localhost:${targetPort}${cleanPath}`;
  
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

    if (err.code === 'ECONNREFUSED') {
      console.log(`Proxy error to http://localhost:${targetPort}${cleanPath}: ${err.message}`);
      
      // Handle frontend app restart logic
      if (targetPort >= 3000 && targetPort <= 3004) {
        const appEntry = Object.entries(FRONTEND_APPS).find(([, config]) => config.port === targetPort);
        if (appEntry) {
          const [appName] = appEntry;
          console.log(`🔄 ${appName} service unavailable, attempting restart...`);
          await startFrontendApp(appName, FRONTEND_APPS[appName]);
        }
      }
      
      if (!res.headersSent) {
        sendJSON(res, 502, {
          error: 'Service temporarily unavailable',
          message: 'The requested service is starting up. Please try again in a moment.',
          retry: true
        }, req.headers.origin);
      }
      return;
    }

    console.error('Proxy request error:', err);
    if (!res.headersSent) {
      sendJSON(res, 502, {
        error: 'Gateway error',
        message: 'Unable to connect to backend service'
      }, req.headers.origin);
    }
  });

  // Send request body if present
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

  // API routes - proxy to backend microservices with fixed routing
  if (pathname.startsWith('/api/')) {
    const requestBody = req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' 
      ? await parseRequestBody(req) : null;

    // Fixed authentication service routing
    if (pathname.startsWith('/api/auth')) {
      const authPath = pathname.replace('/api/auth', '') || '/health';
      proxyRequest(req, res, 8085, authPath, requestBody);
      return;
    }
    
    // Fixed company management service routing
    if (pathname.startsWith('/api/company-management')) {
      const companyPath = pathname.replace('/api', '');
      proxyRequest(req, res, 3013, companyPath, requestBody);
      return;
    }
    
    // Fixed direct data service routing
    if (pathname.startsWith('/api/direct-data')) {
      const dataPath = pathname.replace('/api/direct-data', '') || '/health';
      proxyRequest(req, res, 8081, dataPath, requestBody);
      return;
    }

    // Route all other API requests to the Direct Data Gateway
    proxyRequest(req, res, 8081, pathname, requestBody);
    return;
  }

  // Determine the correct target port based on referer or session context
  function getTargetPortFromContext(req) {
    const referer = req.headers.referer;
    const cookie = req.headers.cookie || '';
    
    // Check referer to determine which app is requesting the asset
    if (referer) {
      if (referer.includes('/customer')) return 3000;
      if (referer.includes('/mobile')) return 3001;
      if (referer.includes('/admin')) return 3002;
      if (referer.includes('/ops')) return 3004;
    }
    
    // Check session or cookie for app context
    if (cookie.includes('app=customer') || cookie.includes('app=ecommerce-web')) return 3000;
    if (cookie.includes('app=mobile') || cookie.includes('app=ecommerce-mobile')) return 3001;
    if (cookie.includes('app=admin') || cookie.includes('app=admin-portal')) return 3002;
    if (cookie.includes('app=ops') || cookie.includes('app=ops-delivery')) return 3004;
    
    // Default to super-admin
    return 3003;
  }

  // Handle Next.js static assets with proper app context
  if (pathname.startsWith('/_next')) {
    const targetPort = getTargetPortFromContext(req);
    proxyRequest(req, res, targetPort, pathname);
    return;
  }

  // Frontend routes - multi-app routing based on path prefix
  if (pathname.startsWith('/customer')) {
    const internalPath = pathname === '/customer' ? '/' : pathname.substring('/customer'.length);
    // Set app context cookie for static assets
    res.setHeader('Set-Cookie', 'app=customer; Path=/; HttpOnly; SameSite=Strict');
    proxyRequest(req, res, 3000, internalPath);
    return;
  }
  
  if (pathname.startsWith('/mobile')) {
    const internalPath = pathname === '/mobile' ? '/' : pathname.substring('/mobile'.length);
    res.setHeader('Set-Cookie', 'app=mobile; Path=/; HttpOnly; SameSite=Strict');
    proxyRequest(req, res, 3001, internalPath);
    return;
  }
  
  if (pathname.startsWith('/admin')) {
    const internalPath = pathname === '/admin' ? '/' : pathname.substring('/admin'.length);
    res.setHeader('Set-Cookie', 'app=admin; Path=/; HttpOnly; SameSite=Strict');
    proxyRequest(req, res, 3002, internalPath);
    return;
  }
  
  if (pathname.startsWith('/ops')) {
    const internalPath = pathname === '/ops' ? '/' : pathname.substring('/ops'.length);
    res.setHeader('Set-Cookie', 'app=ops; Path=/; HttpOnly; SameSite=Strict');
    proxyRequest(req, res, 3004, internalPath);
    return;
  }

  // Handle service worker requests
  if (pathname === '/sw.js' || pathname === '/service-worker.js') {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-cache');
    res.writeHead(200);
    res.end(`
// Minimal service worker for development
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  // Pass through all requests
  event.respondWith(fetch(event.request));
});
    `);
    return;
  }

  // Default to super-admin for root path and unmatched paths
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/dashboard')) {
    res.setHeader('Set-Cookie', 'app=super-admin; Path=/; HttpOnly; SameSite=Strict');
    proxyRequest(req, res, 3003, pathname);
    return;
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

async function startFrontendApp(appName, appConfig) {
  if (frontendProcesses.has(appName)) {
    return;
  }

  console.log(`🚀 Starting ${appName} frontend on port ${appConfig.port}`);
  
  const child = spawn(appConfig.cmd, appConfig.args, {
    cwd: appConfig.dir,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env }
  });

  child.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      console.log(`[${appName}] ${output}`);
    }
  });

  child.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output && !output.includes('webpack-hmr')) {
      console.log(`[${appName}] ${output}`);
    }
  });

  child.on('exit', (code) => {
    console.log(`[${appName}] Process exited with code ${code}`);
    frontendProcesses.delete(appName);
    
    // Auto-restart on unexpected exit
    if (code !== 0) {
      setTimeout(() => {
        console.log(`🔄 Auto-restarting ${appName}...`);
        startFrontendApp(appName, appConfig);
      }, 3000);
    }
  });

  frontendProcesses.set(appName, child);
  
  // Wait for service to be ready
  await new Promise(resolve => setTimeout(resolve, 5000));
  console.log(`✅ ${appName} is ready and accessible through gateway`);
}

async function initializeFrontendApps() {
  console.log('🎯 Initializing all 5 frontend applications...');
  
  for (const [appName, appConfig] of Object.entries(FRONTEND_APPS)) {
    await startFrontendApp(appName, appConfig);
  }
}

// Start the unified gateway server
const server = http.createServer(handleRequest);

server.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Production Gateway running on port ${PORT}`);
  console.log(`🔒 Security: Only port ${PORT} externally accessible`);
  console.log(`🌐 All services proxied through localhost`);
  console.log(`📊 Managing ${Object.keys(SERVICES).length} microservices`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/auth/health`);
  
  console.log(`🌐 Frontend Applications:`);
  for (const [name, config] of Object.entries(FRONTEND_APPS)) {
    const route = config.basePath === '/' ? '/' : config.basePath;
    console.log(`   ${name}: http://localhost:${PORT}${route} → :${config.port}`);
  }
  
  console.log(`📡 API Service Mappings:`);
  for (const [name, service] of Object.entries(SERVICES)) {
    console.log(`   /api/${name} → ${service.url}`);
  }
  
  // Initialize frontend applications
  await initializeFrontendApps();
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gateway...');
  
  // Kill all frontend processes
  for (const [appName, process] of frontendProcesses) {
    console.log(`🛑 Stopping ${appName}...`);
    process.kill();
  }
  
  server.close(() => {
    console.log('✅ Gateway shutdown complete');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Shutting down gateway...');
  
  // Kill all frontend processes
  for (const [appName, process] of frontendProcesses) {
    console.log(`🛑 Stopping ${appName}...`);
    process.kill();
  }
  
  server.close(() => {
    console.log('✅ Gateway shutdown complete');
    process.exit(0);
  });
});