"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendors = exports.expenseReports = exports.budgetAllocations = exports.expenseCategories = exports.expenses = exports.db = exports.pool = void 0;
const serverless_1 = require("@neondatabase/serverless");
const neon_serverless_1 = require("drizzle-orm/neon-serverless");
const ws_1 = require("ws");
const pg_core_1 = require("drizzle-orm/pg-core");
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}
exports.pool = new serverless_1.Pool({ connectionString: process.env.DATABASE_URL });
exports.db = (0, neon_serverless_1.drizzle)({ client: exports.pool });
exports.expenses = (0, pg_core_1.pgTable)('expenses', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    expenseNumber: (0, pg_core_1.varchar)('expense_number', { length: 20 }).unique().notNull(),
    title: (0, pg_core_1.varchar)('title', { length: 200 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    amount: (0, pg_core_1.decimal)('amount', { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)('currency', { length: 3 }).default('USD').notNull(),
    category: (0, pg_core_1.varchar)('category', { length: 50 }).notNull(),
    subcategory: (0, pg_core_1.varchar)('subcategory', { length: 50 }),
    expenseDate: (0, pg_core_1.date)('expense_date').notNull(),
    submittedBy: (0, pg_core_1.integer)('submitted_by').notNull(),
    approvedBy: (0, pg_core_1.integer)('approved_by'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending').notNull(),
    paymentMethod: (0, pg_core_1.varchar)('payment_method', { length: 30 }),
    vendor: (0, pg_core_1.varchar)('vendor', { length: 100 }),
    receiptUrl: (0, pg_core_1.varchar)('receipt_url', { length: 500 }),
    tags: (0, pg_core_1.jsonb)('tags'),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    approvedAt: (0, pg_core_1.timestamp)('approved_at'),
    paidAt: (0, pg_core_1.timestamp)('paid_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.expenseCategories = (0, pg_core_1.pgTable)('expense_categories', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    code: (0, pg_core_1.varchar)('code', { length: 20 }).unique().notNull(),
    description: (0, pg_core_1.text)('description'),
    parentId: (0, pg_core_1.integer)('parent_id'),
    budgetLimit: (0, pg_core_1.decimal)('budget_limit', { precision: 10, scale: 2 }),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    requiresApproval: (0, pg_core_1.boolean)('requires_approval').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.budgetAllocations = (0, pg_core_1.pgTable)('budget_allocations', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    categoryId: (0, pg_core_1.integer)('category_id').notNull(),
    department: (0, pg_core_1.varchar)('department', { length: 50 }),
    period: (0, pg_core_1.varchar)('period', { length: 20 }).notNull(),
    budgetAmount: (0, pg_core_1.decimal)('budget_amount', { precision: 12, scale: 2 }).notNull(),
    spentAmount: (0, pg_core_1.decimal)('spent_amount', { precision: 12, scale: 2 }).default('0'),
    remainingAmount: (0, pg_core_1.decimal)('remaining_amount', { precision: 12, scale: 2 }),
    startDate: (0, pg_core_1.date)('start_date').notNull(),
    endDate: (0, pg_core_1.date)('end_date').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.expenseReports = (0, pg_core_1.pgTable)('expense_reports', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    reportNumber: (0, pg_core_1.varchar)('report_number', { length: 20 }).unique().notNull(),
    title: (0, pg_core_1.varchar)('title', { length: 200 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    reportType: (0, pg_core_1.varchar)('report_type', { length: 30 }).notNull(),
    periodStart: (0, pg_core_1.date)('period_start').notNull(),
    periodEnd: (0, pg_core_1.date)('period_end').notNull(),
    totalAmount: (0, pg_core_1.decimal)('total_amount', { precision: 12, scale: 2 }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('draft').notNull(),
    generatedBy: (0, pg_core_1.integer)('generated_by').notNull(),
    reportData: (0, pg_core_1.jsonb)('report_data'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    completedAt: (0, pg_core_1.timestamp)('completed_at'),
});
exports.vendors = (0, pg_core_1.pgTable)('vendors', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 200 }).notNull(),
    code: (0, pg_core_1.varchar)('code', { length: 20 }).unique(),
    email: (0, pg_core_1.varchar)('email', { length: 100 }),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    address: (0, pg_core_1.text)('address'),
    taxId: (0, pg_core_1.varchar)('tax_id', { length: 50 }),
    paymentTerms: (0, pg_core_1.varchar)('payment_terms', { length: 50 }),
    category: (0, pg_core_1.varchar)('category', { length: 50 }),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    totalSpent: (0, pg_core_1.decimal)('total_spent', { precision: 12, scale: 2 }).default('0'),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
console.log('🔗 Expense Monitoring database connected to PostgreSQL');
//# sourceMappingURL=database.js.map