import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// accounting-management service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const accounting_management_accounts = pgTable('accounting_management_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const accounting_management_transactions = pgTable('accounting_management_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const accounting_management_invoices = pgTable('accounting_management_invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const accounting_management_payments = pgTable('accounting_management_payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type accountingmanagementSchema = {
  accounting_management_accounts: typeof accounting_management_accounts;
  accounting_management_transactions: typeof accounting_management_transactions;
  accounting_management_invoices: typeof accounting_management_invoices;
  accounting_management_payments: typeof accounting_management_payments;
};