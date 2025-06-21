import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// expense-monitoring service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const expense_monitoring_expenses = pgTable('expense_monitoring_expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const expense_monitoring_budgets = pgTable('expense_monitoring_budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const expense_monitoring_approvals = pgTable('expense_monitoring_approvals', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const expense_monitoring_categories = pgTable('expense_monitoring_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type expensemonitoringSchema = {
  expense_monitoring_expenses: typeof expense_monitoring_expenses;
  expense_monitoring_budgets: typeof expense_monitoring_budgets;
  expense_monitoring_approvals: typeof expense_monitoring_approvals;
  expense_monitoring_categories: typeof expense_monitoring_categories;
};