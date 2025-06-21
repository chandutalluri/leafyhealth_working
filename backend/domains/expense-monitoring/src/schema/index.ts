import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  expenseNumber: varchar('expense_number', { length: 50 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  amount: varchar('amount', { length: 20 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  expenseDate: varchar('expense_date', { length: 30 }).notNull(),
  submittedBy: integer('submitted_by').notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('pending'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});