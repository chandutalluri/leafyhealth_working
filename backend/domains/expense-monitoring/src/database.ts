import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  integer,
  boolean,
  jsonb,
  decimal,
  date
} from 'drizzle-orm/pg-core';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool });

// Expenses Table
export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  expenseNumber: varchar('expense_number', { length: 20 }).unique().notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  subcategory: varchar('subcategory', { length: 50 }),
  expenseDate: date('expense_date').notNull(),
  submittedBy: integer('submitted_by').notNull(),
  approvedBy: integer('approved_by'),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, approved, rejected, paid
  paymentMethod: varchar('payment_method', { length: 30 }),
  vendor: varchar('vendor', { length: 100 }),
  receiptUrl: varchar('receipt_url', { length: 500 }),
  tags: jsonb('tags'),
  metadata: jsonb('metadata'),
  approvedAt: timestamp('approved_at'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Expense Categories Table
export const expenseCategories = pgTable('expense_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 20 }).unique().notNull(),
  description: text('description'),
  parentId: integer('parent_id'),
  budgetLimit: decimal('budget_limit', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').default(true),
  requiresApproval: boolean('requires_approval').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Budget Allocations Table
export const budgetAllocations = pgTable('budget_allocations', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').notNull(),
  department: varchar('department', { length: 50 }),
  period: varchar('period', { length: 20 }).notNull(), // monthly, quarterly, annual
  budgetAmount: decimal('budget_amount', { precision: 12, scale: 2 }).notNull(),
  spentAmount: decimal('spent_amount', { precision: 12, scale: 2 }).default('0'),
  remainingAmount: decimal('remaining_amount', { precision: 12, scale: 2 }),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Expense Reports Table
export const expenseReports = pgTable('expense_reports', {
  id: serial('id').primaryKey(),
  reportNumber: varchar('report_number', { length: 20 }).unique().notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  reportType: varchar('report_type', { length: 30 }).notNull(), // monthly, quarterly, annual, custom
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }),
  status: varchar('status', { length: 20 }).default('draft').notNull(),
  generatedBy: integer('generated_by').notNull(),
  reportData: jsonb('report_data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

// Vendors Table
export const vendors = pgTable('vendors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  code: varchar('code', { length: 20 }).unique(),
  email: varchar('email', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  taxId: varchar('tax_id', { length: 50 }),
  paymentTerms: varchar('payment_terms', { length: 50 }),
  category: varchar('category', { length: 50 }),
  isActive: boolean('is_active').default(true),
  totalSpent: decimal('total_spent', { precision: 12, scale: 2 }).default('0'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;
export type ExpenseCategory = typeof expenseCategories.$inferSelect;
export type InsertExpenseCategory = typeof expenseCategories.$inferInsert;
export type BudgetAllocation = typeof budgetAllocations.$inferSelect;
export type InsertBudgetAllocation = typeof budgetAllocations.$inferInsert;

console.log('🔗 Expense Monitoring database connected to PostgreSQL');