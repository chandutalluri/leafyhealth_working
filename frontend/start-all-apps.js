const { spawn } = require('child_process');
const path = require('path');

// Application configurations
const apps = [
  { name: 'Ecommerce Web', path: 'apps/ecommerce-web', port: 3000 },
  { name: 'Mobile Commerce', path: 'apps/ecommerce-mobile', port: 3001 },
  { name: 'Admin Portal', path: 'apps/admin-portal', port: 3002 },
  { name: 'Super Admin', path: 'apps/super-admin', port: 3003 },
  { name: 'Operations Dashboard', path: 'apps/ops-delivery', port: 3004 }
];

const processes = [];

function startApp(app) {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Starting ${app.name} on port ${app.port}...`);
    
    const appPath = path.join(__dirname, app.path);
    const childProcess = spawn('npm', ['run', 'dev'], {
      cwd: appPath,
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'development' }
    });

    let started = false;
    let output = '';

    childProcess.stdout.on('data', (data) => {
      const str = data.toString();
      output += str;
      
      if (str.includes('Ready in') && !started) {
        started = true;
        console.log(`✅ ${app.name} ready on port ${app.port}`);
        resolve(childProcess);
      }
    });

    childProcess.stderr.on('data', (data) => {
      console.error(`${app.name} error: ${data}`);
    });

    childProcess.on('error', (error) => {
      console.error(`Failed to start ${app.name}: ${error}`);
      reject(error);
    });

    childProcess.on('exit', (code) => {
      if (code !== 0 && !started) {
        console.error(`${app.name} exited with code ${code}`);
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    processes.push(childProcess);

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!started) {
        console.error(`${app.name} startup timeout`);
        childProcess.kill();
        reject(new Error('Startup timeout'));
      }
    }, 30000);
  });
}

async function startAllApps() {
  console.log('🌟 Starting LeafyHealth Frontend Platform - 5 Applications');
  
  try {
    // Start all applications concurrently
    const promises = apps.map(app => startApp(app));
    await Promise.all(promises);
    
    console.log('\n✅ All 5 applications are running:');
    apps.forEach(app => {
      console.log(`   ${app.name}: http://localhost:${app.port}`);
    });
    console.log('\n🎉 LeafyHealth Frontend Platform is fully operational!');
    
  } catch (error) {
    console.error('Failed to start all applications:', error);
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('Shutting down all applications...');
  processes.forEach(p => p.kill());
});

process.on('SIGINT', () => {
  console.log('Shutting down all applications...');
  processes.forEach(p => p.kill());
  process.exit(0);
});

startAllApps();