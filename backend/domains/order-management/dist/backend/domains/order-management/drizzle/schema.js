"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.order_management_fulfillment = exports.order_management_statuses = exports.order_management_order_items = exports.order_management_orders = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.order_management_orders = (0, pg_core_1.pgTable)('order_management_orders', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.order_management_order_items = (0, pg_core_1.pgTable)('order_management_order_items', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.order_management_statuses = (0, pg_core_1.pgTable)('order_management_statuses', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.order_management_fulfillment = (0, pg_core_1.pgTable)('order_management_fulfillment', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map