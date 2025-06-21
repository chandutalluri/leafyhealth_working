"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalog_management_variants = exports.catalog_management_attributes = exports.catalog_management_products = exports.catalog_management_categories = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.catalog_management_categories = (0, pg_core_1.pgTable)('catalog_management_categories', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.catalog_management_products = (0, pg_core_1.pgTable)('catalog_management_products', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.catalog_management_attributes = (0, pg_core_1.pgTable)('catalog_management_attributes', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.catalog_management_variants = (0, pg_core_1.pgTable)('catalog_management_variants', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map