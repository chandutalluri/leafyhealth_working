"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.image_management_transformations = exports.image_management_metadata = exports.image_management_albums = exports.image_management_images = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.image_management_images = (0, pg_core_1.pgTable)('image_management_images', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.image_management_albums = (0, pg_core_1.pgTable)('image_management_albums', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.image_management_metadata = (0, pg_core_1.pgTable)('image_management_metadata', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.image_management_transformations = (0, pg_core_1.pgTable)('image_management_transformations', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map