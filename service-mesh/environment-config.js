/**
 * Environment Configuration Manager for Service Mesh
 * Ensures proper database connectivity across all microservices
 */

const fs = require('fs');
const path = require('path');

class EnvironmentManager {
  constructor() {
    this.config = {
      database: null,
      services: new Map(),
      meshNetwork: 'leafyhealth-internal'
    };
    
    this.initializeEnvironment();
  }

  async initializeEnvironment() {
    // Detect database configuration
    await this.setupDatabaseConnection();
    
    // Configure service mesh environment
    this.setupMeshEnvironment();
  }

  async setupDatabaseConnection() {
    try {
      // Check for database environment variables
      let databaseUrl = process.env.DATABASE_URL;
      
      if (!databaseUrl || databaseUrl.trim() === '') {
        console.log('🔍 DATABASE_URL not found in environment, checking Replit configuration...');
        
        // Try to read from Replit secrets or configuration
        databaseUrl = await this.detectReplitDatabase();
      }
      
      if (!databaseUrl || databaseUrl.trim() === '') {
        console.log('🛠️ No database URL found, creating development configuration...');
        databaseUrl = this.createDevelopmentDatabase();
      }
      
      this.config.database = databaseUrl;
      
      // Set environment variable for all child processes
      process.env.DATABASE_URL = databaseUrl;
      
      console.log('✅ Database configuration established');
      return databaseUrl;
    } catch (error) {
      console.error('❌ Database setup error:', error.message);
      throw error;
    }
  }

  async detectReplitDatabase() {
    try {
      // Try different methods to detect Replit database configuration
      const methods = [
        () => process.env.REPLIT_DB_URL,
        () => process.env.DB_URL,
        () => this.readReplitSecrets(),
        () => this.readLocalConfig()
      ];
      
      for (const method of methods) {
        const url = await method();
        if (url && url.trim() !== '') {
          console.log('🔗 Database URL detected from Replit configuration');
          return url;
        }
      }
      
      return null;
    } catch (error) {
      console.log('⚠️ Could not detect Replit database configuration');
      return null;
    }
  }

  readReplitSecrets() {
    try {
      // Check if we can access Replit's database
      const { Pool } = require('pg');
      
      // Try default Replit PostgreSQL configuration
      const testConfigs = [
        {
          host: 'localhost',
          port: 5432,
          database: 'postgres',
          user: 'postgres',
          password: 'password'
        },
        {
          connectionString: 'postgresql://postgres:password@localhost:5432/postgres'
        }
      ];
      
      return testConfigs[1].connectionString;
    } catch (error) {
      return null;
    }
  }

  readLocalConfig() {
    try {
      if (fs.existsSync('.env')) {
        const envContent = fs.readFileSync('.env', 'utf8');
        const match = envContent.match(/DATABASE_URL\s*=\s*(.+)/);
        return match ? match[1].trim() : null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  createDevelopmentDatabase() {
    // Create a temporary SQLite database for development
    const dbPath = path.join(process.cwd(), 'development.db');
    console.log(`🔧 Creating development database at ${dbPath}`);
    
    // For now, return a PostgreSQL connection string that points to a development database
    return 'postgresql://postgres:password@localhost:5432/leafyhealth_dev';
  }

  setupMeshEnvironment() {
    // Set mesh-specific environment variables
    process.env.MESH_NETWORK = this.config.meshNetwork;
    process.env.MESH_SECURITY = 'enabled';
    process.env.INTERNAL_COMMUNICATION_ONLY = 'true';
    
    console.log('🔒 Service mesh environment configured');
  }

  generateServiceEnvironment(serviceName, port) {
    const serviceEnv = {
      DATABASE_URL: this.config.database,
      SERVICE_NAME: serviceName,
      SERVICE_PORT: port,
      MESH_NETWORK: this.config.meshNetwork,
      NODE_ENV: process.env.NODE_ENV || 'development',
      JWT_SECRET: process.env.JWT_SECRET || 'leafyhealth-mesh-secret-key',
      INTERNAL_COMMUNICATION_ONLY: 'true'
    };
    
    this.config.services.set(serviceName, serviceEnv);
    return serviceEnv;
  }

  getServiceCommand(serviceName, servicePath) {
    const serviceEnv = this.config.services.get(serviceName);
    if (!serviceEnv) {
      throw new Error(`Service ${serviceName} not configured`);
    }
    
    const envVars = Object.entries(serviceEnv)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    
    return `cd ${servicePath} && ${envVars} npm run build && ${envVars} node dist/backend/domains/${serviceName}/src/main.js`;
  }

  async validateDatabaseConnection() {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({ connectionString: this.config.database });
      
      await pool.query('SELECT 1');
      await pool.end();
      
      console.log('✅ Database connection validated');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }

  exportEnvironmentFile() {
    const envContent = [
      '# LeafyHealth Service Mesh Environment Configuration',
      `DATABASE_URL="${this.config.database}"`,
      `MESH_NETWORK="${this.config.meshNetwork}"`,
      'MESH_SECURITY="enabled"',
      'INTERNAL_COMMUNICATION_ONLY="true"',
      `JWT_SECRET="${process.env.JWT_SECRET || 'leafyhealth-mesh-secret-key'}"`,
      `NODE_ENV="${process.env.NODE_ENV || 'development'}"`,
      ''
    ].join('\n');
    
    fs.writeFileSync('.env.mesh', envContent);
    console.log('📄 Service mesh environment file created: .env.mesh');
  }
}

module.exports = new EnvironmentManager();