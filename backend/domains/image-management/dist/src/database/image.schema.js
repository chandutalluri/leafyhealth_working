"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.images = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.images = (0, pg_core_1.pgTable)('images', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    filename: (0, pg_core_1.varchar)('filename', { length: 255 }).notNull(),
    originalName: (0, pg_core_1.varchar)('original_name', { length: 255 }),
    mimeType: (0, pg_core_1.varchar)('mime_type', { length: 100 }),
    size: (0, pg_core_1.integer)('size'),
    width: (0, pg_core_1.integer)('width'),
    height: (0, pg_core_1.integer)('height'),
    path: (0, pg_core_1.varchar)('path', { length: 500 }),
    entityType: (0, pg_core_1.varchar)('entity_type', { length: 100 }),
    entityId: (0, pg_core_1.integer)('entity_id'),
    category: (0, pg_core_1.varchar)('category', { length: 100 }),
    description: (0, pg_core_1.text)('description'),
    tags: (0, pg_core_1.text)('tags'),
    isPublic: (0, pg_core_1.boolean)('is_public').default(true),
    variants: (0, pg_core_1.jsonb)('variants').$type().default([]),
    uploadedAt: (0, pg_core_1.timestamp)('uploaded_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=image.schema.js.map