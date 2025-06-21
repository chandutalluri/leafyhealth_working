import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Singleton database connection with proper pooling
class DatabaseManager {
  private static instance: DatabaseManager;
  private pool: Pool;
  private db: any;

  private constructor() {
    this.pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 3, // Further reduced to handle 19 microservices
      min: 1,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });
    this.db = drizzle({ client: this.pool, schema });
    
    // Handle connection events
    this.pool.on('error', (err) => {
      console.error('Database connection error:', err);
    });
    
    this.pool.on('connect', () => {
      console.log('Database connection established');
    });
    
    this.pool.on('remove', () => {
      console.log('Database connection removed from pool');
    });
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public getDb() {
    return this.db;
  }

  public getPool() {
    return this.pool;
  }

  public async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

const dbManager = DatabaseManager.getInstance();
export const pool = dbManager.getPool();
export const db = dbManager.getDb();
