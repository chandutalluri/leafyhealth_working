import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// content-management service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const content_management_content = pgTable('content_management_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const content_management_media = pgTable('content_management_media', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const content_management_templates = pgTable('content_management_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const content_management_revisions = pgTable('content_management_revisions', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type contentmanagementSchema = {
  content_management_content: typeof content_management_content;
  content_management_media: typeof content_management_media;
  content_management_templates: typeof content_management_templates;
  content_management_revisions: typeof content_management_revisions;
};