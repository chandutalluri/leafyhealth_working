import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './image.schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export { images } from './image.schema';
export type { ImageRecord, NewImageRecord } from './image.schema';