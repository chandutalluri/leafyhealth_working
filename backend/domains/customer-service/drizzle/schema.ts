import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// customer-service service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const customer_service_tickets = pgTable('customer_service_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const customer_service_conversations = pgTable('customer_service_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const customer_service_agents = pgTable('customer_service_agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const customer_service_knowledge_base = pgTable('customer_service_knowledge_base', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type customerserviceSchema = {
  customer_service_tickets: typeof customer_service_tickets;
  customer_service_conversations: typeof customer_service_conversations;
  customer_service_agents: typeof customer_service_agents;
  customer_service_knowledge_base: typeof customer_service_knowledge_base;
};