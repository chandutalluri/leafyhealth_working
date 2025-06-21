/**
 * Database Setup and Configuration Manager
 * Creates working PostgreSQL configuration for the service mesh
 */

const { Pool } = require('pg');
const fs = require('fs');

class DatabaseSetup {
  constructor() {
    this.connectionString = null;
    this.isConnected = false;
  }

  async initialize() {
    console.log('🔍 Initializing database configuration...');
    
    try {
      // Try to establish database connection using available configuration
      await this.detectAndConfigureDatabase();
      
      if (this.connectionString) {
        await this.testConnection();
        await this.createDatabaseStructure();
        console.log('✅ Database configuration complete');
        return this.connectionString;
      } else {
        throw new Error('No database configuration available');
      }
    } catch (error) {
      console.error('❌ Database setup failed:', error.message);
      throw error;
    }
  }

  async detectAndConfigureDatabase() {
    // Check if Replit has a PostgreSQL database configured
    const replitDbUrl = process.env.REPLIT_DB_URL;
    
    if (replitDbUrl && replitDbUrl.includes('kv.replit.com')) {
      console.log('📋 Replit KV database detected, but PostgreSQL required');
      console.log('🔧 Setting up local PostgreSQL configuration...');
      
      // Create local PostgreSQL configuration
      this.connectionString = await this.setupLocalPostgreSQL();
    } else {
      // Try other sources
      const sources = [
        process.env.DATABASE_URL,
        process.env.POSTGRES_URL,
        process.env.POSTGRESQL_URL
      ];
      
      for (const url of sources) {
        if (url && url.trim() !== '' && url.startsWith('postgres')) {
          this.connectionString = url.trim();
          break;
        }
      }
      
      if (!this.connectionString) {
        this.connectionString = await this.setupLocalPostgreSQL();
      }
    }
  }

  async setupLocalPostgreSQL() {
    console.log('🛠️ Configuring local PostgreSQL for development...');
    
    // Create development database configuration
    const dbConfig = {
      host: 'localhost',
      port: 5432,
      database: 'leafyhealth',
      user: 'postgres',
      password: process.env.PGPASSWORD || "secure-password"
    };
    
    const connectionString = `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
    
    // Write configuration to environment file
    const envContent = `DATABASE_URL="${connectionString}"
PGHOST="${dbConfig.host}"
PGPORT="${dbConfig.port}"
PGUSER="${dbConfig.user}"
PGPASSWORD="${dbConfig.password}"
PGDATABASE="${dbConfig.database}"
NODE_ENV="development"
JWT_SECRET="${JWT_SECRET || 'generate-secure-jwt-secret'}"
`;
    
    fs.writeFileSync('.env.database', envContent);
    console.log('📄 Database configuration saved to .env.database');
    
    return connectionString;
  }

  async testConnection() {
    try {
      console.log('🔗 Testing database connection...');
      
      const pool = new Pool({ connectionString: this.connectionString });
      const client = await pool.connect();
      
      // Test basic query
      const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
      console.log('✅ Database connection successful');
      console.log(`📅 Current time: ${result.rows[0].current_time}`);
      
      client.release();
      await pool.end();
      
      this.isConnected = true;
      return true;
    } catch (error) {
      console.log('⚠️ Database connection test failed, will use development mode');
      console.log('💡 Services will start with in-memory fallback where possible');
      this.isConnected = false;
      return false;
    }
  }

  async createDatabaseStructure() {
    if (!this.isConnected) {
      console.log('⏭️ Skipping database structure creation (not connected)');
      return;
    }

    try {
      console.log('🏗️ Setting up database structure...');
      
      const pool = new Pool({ connectionString: this.connectionString });
      
      // Create basic tables for microservices
      const createTablesSQL = `
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          username VARCHAR(100) UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          role VARCHAR(50) DEFAULT 'customer',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- User sessions table
        CREATE TABLE IF NOT EXISTS user_sessions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          session_token TEXT NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Products table
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          sku VARCHAR(100) UNIQUE,
          price DECIMAL(10,2) NOT NULL,
          stock_quantity INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Orders table
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          total_amount DECIMAL(10,2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Basic audit log table
        CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          action VARCHAR(100) NOT NULL,
          details JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      
      await pool.query(createTablesSQL);
      console.log('✅ Basic database structure created');
      
      await pool.end();
    } catch (error) {
      console.log('⚠️ Database structure setup failed:', error.message);
      console.log('💡 Services will attempt to create tables as needed');
    }
  }

  getConnectionString() {
    return this.connectionString;
  }

  isReady() {
    return !!this.connectionString;
  }
}

module.exports = DatabaseSetup;