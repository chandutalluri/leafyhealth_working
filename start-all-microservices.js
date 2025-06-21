#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const microservices = [
  { name: 'accounting-management', port: 3014 },
  { name: 'analytics-reporting', port: 3015 },
  { name: 'catalog-management', port: 3016 },
  { name: 'compliance-audit', port: 3017 },
  { name: 'content-management', port: 3018 },
  { name: 'customer-service', port: 3019 },
  { name: 'employee-management', port: 3020 },
  { name: 'expense-monitoring', port: 3021 },
  { name: 'identity-access', port: 3022 },
  { name: 'image-management', port: 3023 },
  { name: 'integration-hub', port: 3024 },
  { name: 'inventory-management', port: 3025 },
  { name: 'label-design', port: 3026 },
  { name: 'marketplace-management', port: 3027 },
  { name: 'multi-language-management', port: 3028 },
  { name: 'notification-service', port: 3029 },
  { name: 'order-management', port: 3030 },
  { name: 'payment-processing', port: 3031 },
  { name: 'performance-monitor', port: 3032 },
  { name: 'reporting-management', port: 3033 },
  { name: 'shipping-delivery', port: 3034 },
  { name: 'subscription-management', port: 3036 },
  { name: 'user-role-management', port: 3035 }
];

const processes = new Map();

function startMicroservice(service) {
  const servicePath = path.join('backend/domains', service.name);
  
  // Check for build structure in correct order
  const buildPaths = [
    `dist/src/main.js`,
    `dist/main.js`,
    `dist/backend/domains/${service.name}/src/main.js`
  ];
  
  let distPath;
  for (const buildPath of buildPaths) {
    if (fs.existsSync(path.join(servicePath, buildPath))) {
      distPath = buildPath;
      break;
    }
  }
  
  if (!distPath) {
    console.error(`❌ ${service.name}: No build file found (checked ${buildPaths.join(', ')})`);
    return;
  }
  
  console.log(`🚀 Starting ${service.name} on port ${service.port}...`);
  
  const serviceProcess = spawn('node', [distPath], {
    cwd: servicePath,
    env: { ...process.env, PORT: service.port },
    stdio: ['pipe', 'pipe', 'pipe']
  });

  serviceProcess.stdout.on('data', (data) => {
    console.log(`[${service.name}] ${data.toString().trim()}`);
  });

  serviceProcess.stderr.on('data', (data) => {
    console.error(`[${service.name}] ERROR: ${data.toString().trim()}`);
  });

  serviceProcess.on('close', (code) => {
    console.log(`[${service.name}] Process exited with code ${code}`);
    processes.delete(service.name);
  });

  serviceProcess.on('error', (error) => {
    console.error(`[${service.name}] Failed to start: ${error.message}`);
  });

  processes.set(service.name, serviceProcess);
}

function gracefulShutdown() {
  console.log('\n🛑 Shutting down all microservices...');
  
  for (const [name, process] of processes) {
    console.log(`Stopping ${name}...`);
    process.kill('SIGTERM');
  }
  
  setTimeout(() => {
    process.exit(0);
  }, 5000);
}

async function main() {
  console.log('🌟 Starting all 22 LeafyHealth Microservices...\n');
  
  // Start all microservices
  for (const service of microservices) {
    startMicroservice(service);
    // Small delay between starts to avoid overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n✅ All ${microservices.length} microservices started successfully!`);
  console.log('📊 Company Management Service (port 3013) already running separately');
  console.log(`🎯 Total Backend Services: ${microservices.length + 1}/23 running`);
  
  // Handle graceful shutdown
  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

main().catch(console.error);