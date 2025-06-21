#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const apps = [
  { name: 'Mobile Commerce', dir: 'ecommerce-mobile', port: 3001 },
  { name: 'Super Admin', dir: 'super-admin', port: 3003 },
  { name: 'Operations Dashboard', dir: 'ops-delivery', port: 3004 }
];

function startApp(app) {
  console.log(`🚀 Starting ${app.name} on port ${app.port}...`);
  
  const appDir = path.join(__dirname, 'apps', app.dir);
  const child = spawn('npm', ['run', 'dev'], {
    cwd: appDir,
    stdio: 'pipe',
    env: { ...process.env, PORT: app.port }
  });

  child.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Ready')) {
      console.log(`✅ ${app.name} ready on port ${app.port}`);
    }
    process.stdout.write(`[${app.name}] ${output}`);
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(`[${app.name}] ${data}`);
  });

  child.on('close', (code) => {
    console.log(`❌ ${app.name} exited with code ${code}`);
  });

  return child;
}

async function startAllRemainingApps() {
  console.log('🌟 Starting remaining LeafyHealth Frontend Applications');
  
  const processes = apps.map(startApp);
  
  // Keep the process alive
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down all applications...');
    processes.forEach(child => child.kill());
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down all applications...');
    processes.forEach(child => child.kill());
    process.exit(0);
  });
  
  // Wait for all processes to start and remain running
  return new Promise((resolve, reject) => {
    let readyCount = 0;
    
    processes.forEach((child, index) => {
      child.on('close', (code) => {
        if (code !== 0) {
          console.log(`❌ ${apps[index].name} exited with code ${code}`);
          reject(new Error(`${apps[index].name} failed with code ${code}`));
        }
      });
      
      child.stdout.on('data', (data) => {
        if (data.toString().includes('Ready')) {
          readyCount++;
          if (readyCount === apps.length) {
            console.log('✅ All remaining frontend applications started successfully');
            // Don't resolve - keep running
          }
        }
      });
    });
    
    // Keep alive interval
    setInterval(() => {
      // Ping to keep process active
    }, 30000);
  });
}

startAllRemainingApps().catch(console.error);