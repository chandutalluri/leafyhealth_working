"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageVariants = exports.images = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.images = (0, pg_core_1.pgTable)('images', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    filename: (0, pg_core_1.varchar)('filename', { length: 255 }).notNull(),
    originalName: (0, pg_core_1.varchar)('original_name', { length: 255 }).notNull(),
    mimeType: (0, pg_core_1.varchar)('mime_type', { length: 100 }).notNull(),
    size: (0, pg_core_1.integer)('size').notNull(),
    width: (0, pg_core_1.integer)('width'),
    height: (0, pg_core_1.integer)('height'),
    entityType: (0, pg_core_1.varchar)('entity_type', { length: 50 }),
    entityId: (0, pg_core_1.integer)('entity_id'),
    alt: (0, pg_core_1.text)('alt'),
    title: (0, pg_core_1.text)('title'),
    uploadedBy: (0, pg_core_1.integer)('uploaded_by'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.imageVariants = (0, pg_core_1.pgTable)('image_variants', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    imageId: (0, pg_core_1.integer)('image_id').notNull().references(() => exports.images.id),
    variantName: (0, pg_core_1.varchar)('variant_name', { length: 50 }).notNull(),
    filename: (0, pg_core_1.varchar)('filename', { length: 255 }).notNull(),
    width: (0, pg_core_1.integer)('width').notNull(),
    height: (0, pg_core_1.integer)('height').notNull(),
    size: (0, pg_core_1.integer)('size').notNull(),
    format: (0, pg_core_1.varchar)('format', { length: 10 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
//# sourceMappingURL=schema.js.map