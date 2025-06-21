import { pgTable, serial, varchar, integer, timestamp, boolean, text } from 'drizzle-orm/pg-core';

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  width: integer('width'),
  height: integer('height'),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: integer('entity_id'),
  alt: text('alt'),
  title: text('title'),
  uploadedBy: integer('uploaded_by'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const imageVariants = pgTable('image_variants', {
  id: serial('id').primaryKey(),
  imageId: integer('image_id').notNull().references(() => images.id),
  variantName: varchar('variant_name', { length: 50 }).notNull(),
  filename: varchar('filename', { length: 255 }).notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  size: integer('size').notNull(),
  format: varchar('format', { length: 10 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export type InsertImage = typeof images.$inferInsert;
export type SelectImage = typeof images.$inferSelect;
export type InsertImageVariant = typeof imageVariants.$inferInsert;
export type SelectImageVariant = typeof imageVariants.$inferSelect;