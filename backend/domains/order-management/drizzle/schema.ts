import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// order-management service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const order_management_orders = pgTable('order_management_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const order_management_order_items = pgTable('order_management_order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const order_management_statuses = pgTable('order_management_statuses', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const order_management_fulfillment = pgTable('order_management_fulfillment', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type ordermanagementSchema = {
  order_management_orders: typeof order_management_orders;
  order_management_order_items: typeof order_management_order_items;
  order_management_statuses: typeof order_management_statuses;
  order_management_fulfillment: typeof order_management_fulfillment;
};