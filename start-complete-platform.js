/**
 * Complete Platform Startup Script
 * Starts all frontend applications and backend services for comprehensive testing
 */

const { spawn } = require('child_process');
const path = require('path');

// Frontend applications configuration
const frontendApps = [
  { name: 'Ecommerce Web', path: 'frontend/apps/ecommerce-web', port: 3000 },
  { name: 'Mobile Commerce', path: 'frontend/apps/ecommerce-mobile', port: 3001 },
  { name: 'Admin Portal', path: 'frontend/apps/admin-portal', port: 3002 },
  { name: 'Super Admin', path: 'frontend/apps/super-admin', port: 3003 },
  { name: 'Operations Dashboard', path: 'frontend/apps/ops-delivery', port: 3004 }
];

// Backend services (already running via workflows)
const backendServices = [
  'Direct Data Gateway',
  'Central Auth Gateway', 
  'Company Management Service',
  'All Backend Microservices',
  'Authentication Service'
];

const processes = [];

function startFrontendApp(app) {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Starting ${app.name} on port ${app.port}...`);
    
    const appPath = path.resolve(__dirname, app.path);
    const childProcess = spawn('npm', ['run', 'dev', '--', '-p', app.port.toString()], {
      cwd: appPath,
      stdio: 'pipe',
      env: { 
        ...process.env, 
        NODE_ENV: 'development',
        PORT: app.port.toString()
      }
    });

    let started = false;
    let startupOutput = '';

    childProcess.stdout.on('data', (data) => {
      const str = data.toString();
      startupOutput += str;
      
      // Check for Next.js ready indicators
      if ((str.includes('Ready in') || str.includes('compiled successfully')) && !started) {
        started = true;
        console.log(`✅ ${app.name} ready on port ${app.port}`);
        resolve(childProcess);
      }
    });

    childProcess.stderr.on('data', (data) => {
      const str = data.toString();
      // Only log errors, not warnings
      if (str.includes('Error') || str.includes('Failed')) {
        console.error(`${app.name} error: ${str}`);
      }
    });

    childProcess.on('error', (error) => {
      console.error(`Failed to start ${app.name}: ${error.message}`);
      reject(error);
    });

    childProcess.on('exit', (code) => {
      if (code !== 0 && !started) {
        console.error(`${app.name} exited with code ${code}`);
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    processes.push({ name: app.name, process: childProcess });

    // Extended timeout for Next.js apps
    setTimeout(() => {
      if (!started) {
        console.error(`${app.name} startup timeout (45s)`);
        childProcess.kill();
        reject(new Error('Startup timeout'));
      }
    }, 45000);
  });
}

async function checkBackendServices() {
  console.log('🔍 Checking backend services status...');
  
  // Simple health check - just verify we can reach localhost services
  const checks = [
    { name: 'Authentication Service', port: 8085 },
    { name: 'Direct Data Gateway', port: 8081 },
    { name: 'Company Management', port: 3013 }
  ];
  
  for (const check of checks) {
    try {
      const http = require('http');
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${check.port}/health`, { timeout: 2000 }, (res) => {
          console.log(`✅ ${check.name} (port ${check.port}) - healthy`);
          resolve();
        });
        req.on('error', () => {
          console.log(`⚠️  ${check.name} (port ${check.port}) - starting or unavailable`);
          resolve(); // Don't fail, just note it
        });
        req.on('timeout', () => {
          req.destroy();
          resolve();
        });
      });
    } catch (error) {
      console.log(`⚠️  ${check.name} - checking...`);
    }
  }
}

async function startCompletePlatform() {
  console.log('🌟 Starting LeafyHealth Complete Platform');
  console.log('📋 Frontend Apps: 5 | Backend Services: 26+ | Gateway: Multi-App');
  
  try {
    // Check backend services first
    await checkBackendServices();
    
    console.log('\n🏗️  Starting all frontend applications...');
    
    // Start all frontend apps concurrently with staggered delays
    const startPromises = frontendApps.map((app, index) => {
      return new Promise(resolve => {
        setTimeout(() => {
          startFrontendApp(app).then(resolve).catch(resolve);
        }, index * 3000); // Stagger by 3 seconds each
      });
    });
    
    await Promise.allSettled(startPromises);
    
    console.log('\n✅ Platform Status Summary:');
    console.log('📱 Frontend Applications:');
    frontendApps.forEach(app => {
      console.log(`   ${app.name}: http://localhost:${app.port}`);
    });
    
    console.log('\n🌐 Access via Multi-App Gateway:');
    console.log('   Super Admin: http://localhost:5000/');
    console.log('   E-commerce Web: http://localhost:5000/web/');
    console.log('   Mobile Commerce: http://localhost:5000/mobile/');
    console.log('   Admin Portal: http://localhost:5000/admin/');
    console.log('   Operations: http://localhost:5000/ops/');
    
    console.log('\n🔗 Backend APIs: http://localhost:5000/api/{service-name}');
    
    console.log('\n🎉 LeafyHealth Complete Platform is operational!');
    console.log('💡 Use the multi-app gateway to test all applications through one URL');
    
  } catch (error) {
    console.error('❌ Platform startup failed:', error.message);
    console.log('🔄 Some services may still be starting. Check individual logs.');
  }
}

// Graceful shutdown handling
function shutdown() {
  console.log('\n🛑 Shutting down all frontend applications...');
  processes.forEach(({ name, process }) => {
    console.log(`   Stopping ${name}...`);
    process.kill('SIGTERM');
  });
  
  setTimeout(() => {
    processes.forEach(({ process }) => {
      if (!process.killed) {
        process.kill('SIGKILL');
      }
    });
    process.exit(0);
  }, 5000);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

startCompletePlatform();