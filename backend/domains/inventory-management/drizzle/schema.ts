import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// inventory-management service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const inventory_management_items = pgTable('inventory_management_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const inventory_management_stock = pgTable('inventory_management_stock', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const inventory_management_warehouses = pgTable('inventory_management_warehouses', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const inventory_management_movements = pgTable('inventory_management_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type inventorymanagementSchema = {
  inventory_management_items: typeof inventory_management_items;
  inventory_management_stock: typeof inventory_management_stock;
  inventory_management_warehouses: typeof inventory_management_warehouses;
  inventory_management_movements: typeof inventory_management_movements;
};