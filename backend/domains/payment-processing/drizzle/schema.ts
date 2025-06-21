import { pgTable, varchar, text, decimal, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

// Payment gateway credentials
export const payment_processing_gateway_credentials = pgTable('payment_processing_gateway_credentials', {
  id: varchar('id').primaryKey(),
  gateway_name: varchar('gateway_name').notNull(),
  api_key_id: varchar('api_key_id').notNull(),
  api_secret: text('api_secret').notNull(),
  merchant_id: varchar('merchant_id'),
  terminal_id: varchar('terminal_id'),
  encryption_key: text('encryption_key'),
  environment: varchar('environment').default('sandbox'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

// Payment methods
export const payment_processing_methods = pgTable('payment_processing_methods', {
  id: varchar('id').primaryKey(),
  method_name: varchar('method_name').notNull(),
  gateway: varchar('gateway').notNull(),
  is_active: boolean('is_active').default(true),
  configuration: jsonb('configuration'),
  created_at: timestamp('created_at').defaultNow()
});

// Payments
export const payment_processing_payments = pgTable('payment_processing_payments', {
  id: varchar('id').primaryKey(),
  order_id: varchar('order_id').notNull(),
  user_id: varchar('user_id').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency').default('INR'),
  gateway: varchar('gateway').notNull(),
  gateway_payment_id: varchar('gateway_payment_id'),
  gateway_order_id: varchar('gateway_order_id'),
  customer_email: varchar('customer_email'),
  status: varchar('status').default('pending'),
  payment_method: varchar('payment_method'),
  metadata: jsonb('metadata'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

// Transactions
export const payment_processing_transactions = pgTable('payment_processing_transactions', {
  id: varchar('id').primaryKey(),
  payment_id: varchar('payment_id').notNull(),
  transaction_type: varchar('transaction_type').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status').notNull(),
  gateway_transaction_id: varchar('gateway_transaction_id'),
  metadata: jsonb('metadata'),
  created_at: timestamp('created_at').defaultNow()
});

// Refunds
export const payment_processing_refunds = pgTable('payment_processing_refunds', {
  id: varchar('id').primaryKey(),
  payment_id: varchar('payment_id').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  reason: text('reason'),
  status: varchar('status').default('pending'),
  gateway_refund_id: varchar('gateway_refund_id'),
  metadata: jsonb('metadata'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

// Webhooks
export const payment_processing_webhooks = pgTable('payment_processing_webhooks', {
  id: varchar('id').primaryKey(),
  gateway: varchar('gateway').notNull(),
  gateway_event_id: varchar('gateway_event_id'),
  event_type: varchar('event_type').notNull(),
  payload: jsonb('payload').notNull(),
  signature: text('signature'),
  processed: boolean('processed').default(false),
  processed_at: timestamp('processed_at'),
  created_at: timestamp('created_at').defaultNow()
});

export const PaymentProcessingSchema = {
  payment_processing_gateway_credentials,
  payment_processing_methods,
  payment_processing_payments,
  payment_processing_transactions,
  payment_processing_refunds,
  payment_processing_webhooks
};