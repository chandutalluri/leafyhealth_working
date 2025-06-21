import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// image-management service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const image_management_images = pgTable('image_management_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const image_management_albums = pgTable('image_management_albums', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const image_management_metadata = pgTable('image_management_metadata', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const image_management_transformations = pgTable('image_management_transformations', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type imagemanagementSchema = {
  image_management_images: typeof image_management_images;
  image_management_albums: typeof image_management_albums;
  image_management_metadata: typeof image_management_metadata;
  image_management_transformations: typeof image_management_transformations;
};