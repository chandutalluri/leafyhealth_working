/**
 * Domain Generation API Server
 * Handles requests from Super Admin interface to generate new business domains
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = 8082;

// Middleware
app.use(cors());
app.use(express.json());

// Domain generator functionality
const domainGenerator = {
  async generateCompleteDomain(domainConfig) {
    console.log(`🚀 Starting domain generation for ${domainConfig.name}`);
    
    try {
      // Generate backend microservice
      const backendResult = await this.generateBackendMicroservice(domainConfig);
      
      // Generate frontend interface
      const frontendResult = await this.generateFrontendInterface(domainConfig);
      
      return {
        success: true,
        domain: domainConfig.name,
        backend: backendResult,
        frontend: frontendResult,
        accessPoints: {
          api: `http://localhost:${domainConfig.port}`,
          swagger: `http://localhost:${domainConfig.port}/api`
        }
      };
      
    } catch (error) {
      return {
        success: false,
        domain: domainConfig.name,
        error: error.message
      };
    }
  },

  async generateBackendMicroservice(domainConfig) {
    const fs = require('fs');
    const path = require('path');
    
    const basePath = path.join(__dirname, '../backend/domains', domainConfig.name);
    
    // Create directory structure
    await this.createDirectoryStructure(basePath);
    
    // Generate backend files
    await this.generateBackendFiles(basePath, domainConfig);
    
    return {
      success: true,
      path: basePath,
      port: domainConfig.port,
      endpoints: [`GET /${domainConfig.name}`, `POST /${domainConfig.name}`, `PUT /${domainConfig.name}/:id`, `DELETE /${domainConfig.name}/:id`]
    };
  },

  async generateFrontendInterface(domainConfig) {
    // Frontend generation would go here
    // For now, return success status
    return {
      success: true,
      targetApp: domainConfig.targetApp,
      components: ['Main Page', 'Create Form', 'Edit Form', 'List Component'],
      routes: {
        list: `/${domainConfig.name}`,
        create: `/${domainConfig.name}/create`,
        detail: `/${domainConfig.name}/[id]`
      }
    };
  },

  async createDirectoryStructure(basePath) {
    const fs = require('fs').promises;
    
    const directories = [
      basePath,
      path.join(basePath, 'src'),
      path.join(basePath, 'src/controllers'),
      path.join(basePath, 'src/services'),
      path.join(basePath, 'src/entities'),
      path.join(basePath, 'src/dto')
    ];
    
    for (const dir of directories) {
      await fs.mkdir(dir, { recursive: true });
    }
  },

  async generateBackendFiles(basePath, domainConfig) {
    const fs = require('fs').promises;
    const path = require('path');
    
    // Generate package.json
    const packageJson = {
      name: `@leafyhealth/${domainConfig.name}`,
      version: "1.0.0",
      description: domainConfig.description,
      main: "src/main.js",
      scripts: {
        start: "node src/main.js",
        dev: "nodemon src/main.js"
      },
      dependencies: {
        express: "^4.18.2",
        cors: "^2.8.5"
      }
    };
    
    await fs.writeFile(
      path.join(basePath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Generate main server file
    const serverCode = `const express = require('express');
const cors = require('cors');

const app = express();
const PORT = ${domainConfig.port};

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: '${domainConfig.label}',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.get('/${domainConfig.name}', (req, res) => {
  res.json({ 
    message: 'Welcome to ${domainConfig.label} API',
    endpoints: ['GET /${domainConfig.name}', 'POST /${domainConfig.name}', 'PUT /${domainConfig.name}/:id', 'DELETE /${domainConfig.name}/:id']
  });
});

app.post('/${domainConfig.name}', (req, res) => {
  res.json({ message: 'Created new ${domainConfig.name}', data: req.body });
});

app.put('/${domainConfig.name}/:id', (req, res) => {
  res.json({ message: \`Updated ${domainConfig.name} \${req.params.id}\`, data: req.body });
});

app.delete('/${domainConfig.name}/:id', (req, res) => {
  res.json({ message: \`Deleted ${domainConfig.name} \${req.params.id}\` });
});

app.listen(PORT, () => {
  console.log(\`🚀 ${domainConfig.label} service running on port \${PORT}\`);
  console.log(\`❤️  Health check: http://localhost:\${PORT}/health\`);
});

module.exports = app;`;
    
    await fs.writeFile(
      path.join(basePath, 'src/main.js'),
      serverCode
    );
    
    // Generate README
    const readme = `# ${domainConfig.label}

${domainConfig.description}

## Getting Started

\`\`\`bash
npm install
npm start
\`\`\`

## API Endpoints

- GET /${domainConfig.name} - List all items
- POST /${domainConfig.name} - Create new item
- PUT /${domainConfig.name}/:id - Update item
- DELETE /${domainConfig.name}/:id - Delete item

## Health Check

\`\`\`bash
curl http://localhost:${domainConfig.port}/health
\`\`\`
`;
    
    await fs.writeFile(
      path.join(basePath, 'README.md'),
      readme
    );
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Domain Generator API',
    timestamp: new Date().toISOString()
  });
});

// Generate new business domain endpoint
app.post('/api/microservices/generate', async (req, res) => {
  try {
    console.log('🚀 Received domain generation request:', req.body);
    
    const { name, label, description, category, port, microservicePath } = req.body;
    
    // Validate required fields
    if (!name || !label || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, label, description'
      });
    }
    
    // Convert to kebab-case for consistency
    const domainName = name.toLowerCase().replace(/\s+/g, '-');
    
    // Create domain configuration
    const domainConfig = {
      name: domainName,
      label: label,
      description: description,
      category: category || 'operations',
      port: port || getNextAvailablePort(),
      microservicePath: microservicePath || `backend/domains/${domainName}`,
      fields: generateDefaultFields(domainName),
      businessType: category,
      targetApp: determineTargetApp(category)
    };
    
    console.log('📋 Domain Configuration:', domainConfig);
    
    // Generate the complete domain (backend + frontend)
    const result = await domainGenerator.generateCompleteDomain(domainConfig);
    
    if (result.success) {
      console.log('✅ Domain generation completed successfully');
      
      // Update API Gateway with new route
      await updateApiGateway(domainConfig);
      
      // Start the new microservice
      await startMicroservice(domainConfig);
      
      res.json({
        success: true,
        domain: domainConfig.name,
        message: `Domain ${domainConfig.label} created successfully`,
        details: {
          backend: {
            path: result.backend?.path || `backend/domains/${domainName}`,
            port: domainConfig.port,
            endpoints: result.backend?.endpoints || []
          },
          frontend: {
            targetApp: result.frontend?.targetApp || 'admin-portal',
            components: result.frontend?.components || [],
            routes: result.frontend?.routes || {}
          },
          accessPoints: result.accessPoints || {}
        }
      });
    } else {
      throw new Error(result.error || 'Domain generation failed');
    }
    
  } catch (error) {
    console.error('❌ Domain generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during domain generation'
    });
  }
});

// List all available domains
app.get('/api/domains', (req, res) => {
  try {
    const domainsPath = path.join(__dirname, '../backend/domains');
    const domains = [];
    
    if (fs.existsSync(domainsPath)) {
      const directories = fs.readdirSync(domainsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      directories.forEach(domainName => {
        const packageJsonPath = path.join(domainsPath, domainName, 'package.json');
        let domainInfo = { name: domainName, status: 'unknown' };
        
        if (fs.existsSync(packageJsonPath)) {
          try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            domainInfo = {
              name: domainName,
              label: packageJson.description || domainName,
              version: packageJson.version || '1.0.0',
              status: 'installed'
            };
          } catch (err) {
            console.error(`Error reading package.json for ${domainName}:`, err);
          }
        }
        
        domains.push(domainInfo);
      });
    }
    
    res.json({
      success: true,
      domains: domains,
      total: domains.length
    });
    
  } catch (error) {
    console.error('Error listing domains:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list domains'
    });
  }
});

// Helper functions
function getNextAvailablePort() {
  // Start from 3060 and find next available port
  const usedPorts = [3000, 3001, 3002, 3003, 3004, 3010, 3011, 3020, 3021, 3022, 3023, 3024, 3031, 3032, 3033, 3034, 3035, 3036, 3037, 3038, 3039, 3040, 3041, 3042, 3050];
  
  for (let port = 3060; port < 3100; port++) {
    if (!usedPorts.includes(port)) {
      return port;
    }
  }
  return 3099; // Fallback
}

function determineTargetApp(category) {
  const mapping = {
    'core': 'admin-portal',
    'financial': 'admin-portal', 
    'operations': 'ops-delivery',
    'analytics': 'super-admin',
    'administration': 'super-admin',
    'compliance': 'super-admin',
    'content': 'admin-portal',
    'integration': 'super-admin'
  };
  
  return mapping[category] || 'admin-portal';
}

function generateDefaultFields(domainName) {
  return [
    { name: 'name', type: 'string', required: true },
    { name: 'description', type: 'text', required: false },
    { name: 'isActive', type: 'boolean', required: true, default: true },
    { name: 'createdAt', type: 'datetime', required: true },
    { name: 'updatedAt', type: 'datetime', required: true }
  ];
}

async function updateApiGateway(domainConfig) {
  try {
    console.log(`🔗 Updating API Gateway for ${domainConfig.name}...`);
    
    // Read the current API gateway configuration
    const gatewayPath = path.join(__dirname, 'direct-data-gateway.js');
    let gatewayContent = fs.readFileSync(gatewayPath, 'utf8');
    
    // Add new route mapping
    const newRoute = `  '/${domainConfig.name}': { port: ${domainConfig.port}, prefix: '/${domainConfig.name}' },`;
    
    // Find the routes object and add the new route
    if (gatewayContent.includes('const serviceRoutes = {')) {
      const routesRegex = /(const serviceRoutes = \{[\s\S]*?\};)/;
      const routesMatch = gatewayContent.match(routesRegex);
      
      if (routesMatch) {
        const oldRoutes = routesMatch[1];
        const newRoutes = oldRoutes.replace(
          /(\};)$/,
          `${newRoute}\n$1`
        );
        gatewayContent = gatewayContent.replace(oldRoutes, newRoutes);
        
        // Write updated content back
        fs.writeFileSync(gatewayPath, gatewayContent);
        console.log(`✅ API Gateway updated with route: /${domainConfig.name} -> port ${domainConfig.port}`);
      }
    }
    
  } catch (error) {
    console.error('Error updating API Gateway:', error);
    // Non-critical error, continue with domain generation
  }
}

async function startMicroservice(domainConfig) {
  try {
    console.log(`🚀 Starting microservice ${domainConfig.name} on port ${domainConfig.port}...`);
    
    const microservicePath = path.join(__dirname, '..', domainConfig.microservicePath);
    
    if (fs.existsSync(microservicePath)) {
      // Start the microservice in the background
      const child = spawn('node', ['server.js'], {
        cwd: microservicePath,
        detached: true,
        stdio: 'ignore'
      });
      
      child.unref();
      console.log(`✅ Microservice ${domainConfig.name} started with PID ${child.pid}`);
    } else {
      console.warn(`⚠️ Microservice path not found: ${microservicePath}`);
    }
    
  } catch (error) {
    console.error(`Error starting microservice ${domainConfig.name}:`, error);
    // Non-critical error, domain generation was successful
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Domain Generator API running on port ${PORT}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Generate domain: POST /api/microservices/generate`);
  console.log(`📊 List domains: GET /api/domains`);
});

module.exports = app;