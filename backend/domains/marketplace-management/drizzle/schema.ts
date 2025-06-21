import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// marketplace-management service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const marketplace_management_vendors = pgTable('marketplace_management_vendors', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const marketplace_management_listings = pgTable('marketplace_management_listings', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const marketplace_management_commissions = pgTable('marketplace_management_commissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const marketplace_management_payouts = pgTable('marketplace_management_payouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type marketplacemanagementSchema = {
  marketplace_management_vendors: typeof marketplace_management_vendors;
  marketplace_management_listings: typeof marketplace_management_listings;
  marketplace_management_commissions: typeof marketplace_management_commissions;
  marketplace_management_payouts: typeof marketplace_management_payouts;
};