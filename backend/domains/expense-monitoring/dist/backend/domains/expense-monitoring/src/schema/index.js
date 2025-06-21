"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenses = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.expenses = (0, pg_core_1.pgTable)('expenses', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    expenseNumber: (0, pg_core_1.varchar)('expense_number', { length: 50 }).notNull(),
    title: (0, pg_core_1.varchar)('title', { length: 200 }).notNull(),
    amount: (0, pg_core_1.varchar)('amount', { length: 20 }).notNull(),
    category: (0, pg_core_1.varchar)('category', { length: 100 }).notNull(),
    expenseDate: (0, pg_core_1.varchar)('expense_date', { length: 30 }).notNull(),
    submittedBy: (0, pg_core_1.integer)('submitted_by').notNull(),
    description: (0, pg_core_1.text)('description'),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('pending'),
    rejectionReason: (0, pg_core_1.text)('rejection_reason'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
//# sourceMappingURL=index.js.map