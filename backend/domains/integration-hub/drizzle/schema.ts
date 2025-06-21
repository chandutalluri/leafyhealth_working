import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// integration-hub service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const integration_hub_integrations = pgTable('integration_hub_integrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const integration_hub_webhooks = pgTable('integration_hub_webhooks', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const integration_hub_api_keys = pgTable('integration_hub_api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const integration_hub_logs = pgTable('integration_hub_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type integrationhubSchema = {
  integration_hub_integrations: typeof integration_hub_integrations;
  integration_hub_webhooks: typeof integration_hub_webhooks;
  integration_hub_api_keys: typeof integration_hub_api_keys;
  integration_hub_logs: typeof integration_hub_logs;
};