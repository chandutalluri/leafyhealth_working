"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventory_management_movements = exports.inventory_management_warehouses = exports.inventory_management_stock = exports.inventory_management_items = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.inventory_management_items = (0, pg_core_1.pgTable)('inventory_management_items', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.inventory_management_stock = (0, pg_core_1.pgTable)('inventory_management_stock', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.inventory_management_warehouses = (0, pg_core_1.pgTable)('inventory_management_warehouses', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.inventory_management_movements = (0, pg_core_1.pgTable)('inventory_management_movements', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map