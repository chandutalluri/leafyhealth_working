import { pgTable, serial, varchar, integer, timestamp, boolean, text, jsonb } from 'drizzle-orm/pg-core';

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }),
  mimeType: varchar('mime_type', { length: 100 }),
  size: integer('size'),
  width: integer('width'),
  height: integer('height'),
  path: varchar('path', { length: 500 }),
  entityType: varchar('entity_type', { length: 100 }),
  entityId: integer('entity_id'),
  category: varchar('category', { length: 100 }),
  description: text('description'),
  tags: text('tags'),
  isPublic: boolean('is_public').default(true),
  variants: jsonb('variants').$type<string[]>().default([]),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type ImageRecord = typeof images.$inferSelect;
export type NewImageRecord = typeof images.$inferInsert;