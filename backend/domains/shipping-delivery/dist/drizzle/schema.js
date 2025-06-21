"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipping_delivery_tracking = exports.shipping_delivery_carriers = exports.shipping_delivery_routes = exports.shipping_delivery_shipments = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.shipping_delivery_shipments = (0, pg_core_1.pgTable)('shipping_delivery_shipments', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.shipping_delivery_routes = (0, pg_core_1.pgTable)('shipping_delivery_routes', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.shipping_delivery_carriers = (0, pg_core_1.pgTable)('shipping_delivery_carriers', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.shipping_delivery_tracking = (0, pg_core_1.pgTable)('shipping_delivery_tracking', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map