
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/leafyhealth_db';

// Create the postgres client
const client = postgres(connectionString);

// Create the drizzle instance
export const db = drizzle(client);

export default db;
