"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProcessingSchema = exports.payment_processing_webhooks = exports.payment_processing_refunds = exports.payment_processing_transactions = exports.payment_processing_payments = exports.payment_processing_methods = exports.payment_processing_gateway_credentials = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.payment_processing_gateway_credentials = (0, pg_core_1.pgTable)('payment_processing_gateway_credentials', {
    id: (0, pg_core_1.varchar)('id').primaryKey(),
    gateway_name: (0, pg_core_1.varchar)('gateway_name').notNull(),
    api_key_id: (0, pg_core_1.varchar)('api_key_id').notNull(),
    api_secret: (0, pg_core_1.text)('api_secret').notNull(),
    merchant_id: (0, pg_core_1.varchar)('merchant_id'),
    terminal_id: (0, pg_core_1.varchar)('terminal_id'),
    encryption_key: (0, pg_core_1.text)('encryption_key'),
    environment: (0, pg_core_1.varchar)('environment').default('sandbox'),
    is_active: (0, pg_core_1.boolean)('is_active').default(true),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.payment_processing_methods = (0, pg_core_1.pgTable)('payment_processing_methods', {
    id: (0, pg_core_1.varchar)('id').primaryKey(),
    method_name: (0, pg_core_1.varchar)('method_name').notNull(),
    gateway: (0, pg_core_1.varchar)('gateway').notNull(),
    is_active: (0, pg_core_1.boolean)('is_active').default(true),
    configuration: (0, pg_core_1.jsonb)('configuration'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.payment_processing_payments = (0, pg_core_1.pgTable)('payment_processing_payments', {
    id: (0, pg_core_1.varchar)('id').primaryKey(),
    order_id: (0, pg_core_1.varchar)('order_id').notNull(),
    user_id: (0, pg_core_1.varchar)('user_id').notNull(),
    amount: (0, pg_core_1.decimal)('amount', { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)('currency').default('INR'),
    gateway: (0, pg_core_1.varchar)('gateway').notNull(),
    gateway_payment_id: (0, pg_core_1.varchar)('gateway_payment_id'),
    gateway_order_id: (0, pg_core_1.varchar)('gateway_order_id'),
    customer_email: (0, pg_core_1.varchar)('customer_email'),
    status: (0, pg_core_1.varchar)('status').default('pending'),
    payment_method: (0, pg_core_1.varchar)('payment_method'),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.payment_processing_transactions = (0, pg_core_1.pgTable)('payment_processing_transactions', {
    id: (0, pg_core_1.varchar)('id').primaryKey(),
    payment_id: (0, pg_core_1.varchar)('payment_id').notNull(),
    transaction_type: (0, pg_core_1.varchar)('transaction_type').notNull(),
    amount: (0, pg_core_1.decimal)('amount', { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)('status').notNull(),
    gateway_transaction_id: (0, pg_core_1.varchar)('gateway_transaction_id'),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.payment_processing_refunds = (0, pg_core_1.pgTable)('payment_processing_refunds', {
    id: (0, pg_core_1.varchar)('id').primaryKey(),
    payment_id: (0, pg_core_1.varchar)('payment_id').notNull(),
    amount: (0, pg_core_1.decimal)('amount', { precision: 10, scale: 2 }).notNull(),
    reason: (0, pg_core_1.text)('reason'),
    status: (0, pg_core_1.varchar)('status').default('pending'),
    gateway_refund_id: (0, pg_core_1.varchar)('gateway_refund_id'),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.payment_processing_webhooks = (0, pg_core_1.pgTable)('payment_processing_webhooks', {
    id: (0, pg_core_1.varchar)('id').primaryKey(),
    gateway: (0, pg_core_1.varchar)('gateway').notNull(),
    gateway_event_id: (0, pg_core_1.varchar)('gateway_event_id'),
    event_type: (0, pg_core_1.varchar)('event_type').notNull(),
    payload: (0, pg_core_1.jsonb)('payload').notNull(),
    signature: (0, pg_core_1.text)('signature'),
    processed: (0, pg_core_1.boolean)('processed').default(false),
    processed_at: (0, pg_core_1.timestamp)('processed_at'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.PaymentProcessingSchema = {
    payment_processing_gateway_credentials: exports.payment_processing_gateway_credentials,
    payment_processing_methods: exports.payment_processing_methods,
    payment_processing_payments: exports.payment_processing_payments,
    payment_processing_transactions: exports.payment_processing_transactions,
    payment_processing_refunds: exports.payment_processing_refunds,
    payment_processing_webhooks: exports.payment_processing_webhooks
};
//# sourceMappingURL=schema.js.map