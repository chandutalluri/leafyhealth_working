import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '../schema';

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/leafyhealth';
const pool = new Pool({ connectionString });
const db = drizzle(pool, { schema });

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useValue: db,
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}