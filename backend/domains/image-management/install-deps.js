const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing image management dependencies...');

try {
  // Check if node_modules exists
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('Creating node_modules directory...');
    fs.mkdirSync(nodeModulesPath, { recursive: true });
  }

  // Install dependencies
  const deps = ['express', 'multer', 'sharp', 'uuid', 'mime-types'];
  
  for (const dep of deps) {
    try {
      console.log(`Installing ${dep}...`);
      execSync(`npm install ${dep}`, { 
        cwd: __dirname,
        stdio: 'inherit'
      });
    } catch (error) {
      console.log(`Skipping ${dep} - may already be available globally`);
    }
  }

  console.log('Dependencies installation completed');
  
  // Test the server
  console.log('Starting image management service...');
  require('./server.js');
  
} catch (error) {
  console.error('Installation error:', error.message);
  // Try to start anyway with global dependencies
  console.log('Attempting to start with global dependencies...');
  require('./server.js');
}