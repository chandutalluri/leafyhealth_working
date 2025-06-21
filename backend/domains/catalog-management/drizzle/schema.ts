import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// catalog-management service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const catalog_management_categories = pgTable('catalog_management_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const catalog_management_products = pgTable('catalog_management_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const catalog_management_attributes = pgTable('catalog_management_attributes', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const catalog_management_variants = pgTable('catalog_management_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type catalogmanagementSchema = {
  catalog_management_categories: typeof catalog_management_categories;
  catalog_management_products: typeof catalog_management_products;
  catalog_management_attributes: typeof catalog_management_attributes;
  catalog_management_variants: typeof catalog_management_variants;
};