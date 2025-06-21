import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: Pool;
  private db: any;
  private isConnected: boolean = false;

  private constructor() {
    this.initializeConnection();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private initializeConnection(): void {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL must be set');
    }
    
    console.log('🔗 Database connected to PostgreSQL');

    // Configure connection pool with optimized settings
    this.pool = new Pool({
      connectionString,
      max: 20, // Maximum number of connections
      min: 2, // Minimum number of connections
      idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
      connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
      statement_timeout: 30000, // Terminate any statement that takes more than 30 seconds
      query_timeout: 30000, // Terminate any query that takes more than 30 seconds
    });

    // Initialize Drizzle with the connection pool
    this.db = drizzle(this.pool, { schema });

    // Handle connection events
    this.pool.on('connect', () => {
      this.isConnected = true;
      console.log('✅ Database connection established');
    });

    this.pool.on('error', (err) => {
      console.error('❌ Database connection error:', err);
      this.isConnected = false;
    });

    this.pool.on('remove', () => {
      console.log('🔄 Database connection removed from pool');
    });
  }

  public getDatabase() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public isHealthy(): boolean {
    return this.isConnected && this.pool.totalCount > 0;
  }

  public async healthCheck(): Promise<{ 
    status: string; 
    environment: string; 
    timestamp: string;
    poolStats: {
      total: number;
      idle: number;
      waiting: number;
    }
  }> {
    try {
      const result = await this.db.execute('SELECT 1 as health_check');
      const environment = process.env.NODE_ENV || 'development';
      
      return {
        status: 'healthy',
        environment,
        timestamp: new Date().toISOString(),
        poolStats: {
          total: this.pool.totalCount,
          idle: this.pool.idleCount,
          waiting: this.pool.waitingCount
        }
      };
    } catch (error) {
      console.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        poolStats: {
          total: 0,
          idle: 0,
          waiting: 0
        }
      };
    }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      console.log('🔒 Database connection pool closed');
    }
  }
}

// Export singleton instance
export const databaseConnection = DatabaseConnection.getInstance();
export const db = databaseConnection.getDatabase();
export * from '../schema';