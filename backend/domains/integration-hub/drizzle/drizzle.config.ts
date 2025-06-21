import type { Config } from 'drizzle-kit';

export default {
  schema: './schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/leafyhealth',
  },
  // Service-specific migration prefix
  tablesFilter: ['integration_hub_*'],
} satisfies Config;