import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/leafyhealth',
  // In production, each service will have its own database:
  // connectionString: process.env.PAYMENT_PROCESSING_DATABASE_URL
});

export const db = drizzle(pool, { schema });

// Connection health check
export async function checkConnection() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function closeConnection() {
  await pool.end();
}