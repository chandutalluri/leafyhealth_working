
const http = require('http');

async function testApiConnection() {
  console.log('🔍 Testing API Gateway Connection...\n');

  const endpoints = [
    { name: 'Health Check', path: '/health' },
    { name: 'Products API', path: '/api/products?limit=5' },
    { name: 'Categories API', path: '/api/categories?limit=5' },
    { name: 'Branches API', path: '/api/branches?limit=5' }
  ];

  const baseUrl = 'http://localhost:8081';

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint.path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name}: OK (${response.status})`);
        console.log(`   Data preview:`, JSON.stringify(data).substring(0, 100) + '...\n');
      } else {
        console.log(`❌ ${endpoint.name}: Failed (${response.status})`);
        const text = await response.text();
        console.log(`   Error:`, text.substring(0, 100) + '...\n');
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Connection failed`);
      console.log(`   Error:`, error.message + '\n');
    }
  }

  console.log('📊 Test completed. Check the Direct Data Gateway is running on port 8081');
}

// Check if we can use fetch (Node 18+) or need to import
if (typeof fetch === 'undefined') {
  console.log('Installing node-fetch for Node.js compatibility...');
  require('child_process').execSync('npm install node-fetch@2', { stdio: 'inherit' });
  global.fetch = require('node-fetch');
}

testApiConnection().catch(console.error);
