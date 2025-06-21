import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// shipping-delivery service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const shipping_delivery_shipments = pgTable('shipping_delivery_shipments', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const shipping_delivery_routes = pgTable('shipping_delivery_routes', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const shipping_delivery_carriers = pgTable('shipping_delivery_carriers', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const shipping_delivery_tracking = pgTable('shipping_delivery_tracking', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type shippingdeliverySchema = {
  shipping_delivery_shipments: typeof shipping_delivery_shipments;
  shipping_delivery_routes: typeof shipping_delivery_routes;
  shipping_delivery_carriers: typeof shipping_delivery_carriers;
  shipping_delivery_tracking: typeof shipping_delivery_tracking;
};