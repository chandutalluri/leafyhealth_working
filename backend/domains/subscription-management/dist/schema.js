"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliverySchedule = exports.subscriptionItems = exports.subscriptions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.subscriptions = (0, pg_core_1.pgTable)('subscriptions', {
    id: (0, pg_core_1.varchar)('id', { length: 36 }).primaryKey(),
    userId: (0, pg_core_1.varchar)('user_id', { length: 36 }).notNull(),
    planType: (0, pg_core_1.varchar)('plan_type', { length: 50 }).notNull(),
    mealType: (0, pg_core_1.varchar)('meal_type', { length: 50 }).notNull(),
    duration: (0, pg_core_1.integer)('duration').notNull(),
    startDate: (0, pg_core_1.date)('start_date').notNull(),
    endDate: (0, pg_core_1.date)('end_date').notNull(),
    deliveryTime: (0, pg_core_1.varchar)('delivery_time', { length: 100 }).notNull(),
    branchId: (0, pg_core_1.varchar)('branch_id', { length: 36 }).notNull(),
    totalPrice: (0, pg_core_1.decimal)('total_price', { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
    metadata: (0, pg_core_1.jsonb)('metadata')
});
exports.subscriptionItems = (0, pg_core_1.pgTable)('subscription_items', {
    id: (0, pg_core_1.varchar)('id', { length: 36 }).primaryKey(),
    subscriptionId: (0, pg_core_1.varchar)('subscription_id', { length: 36 }).references(() => exports.subscriptions.id).notNull(),
    productId: (0, pg_core_1.varchar)('product_id', { length: 36 }).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    dayOffset: (0, pg_core_1.integer)('day_offset').default(0),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.deliverySchedule = (0, pg_core_1.pgTable)('delivery_schedule', {
    id: (0, pg_core_1.varchar)('id', { length: 36 }).primaryKey(),
    subscriptionId: (0, pg_core_1.varchar)('subscription_id', { length: 36 }).references(() => exports.subscriptions.id).notNull(),
    deliveryDate: (0, pg_core_1.date)('delivery_date').notNull(),
    deliveryTime: (0, pg_core_1.varchar)('delivery_time', { length: 100 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
//# sourceMappingURL=schema.js.map