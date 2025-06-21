import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// multi-language-management service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const multi_language_management_languages = pgTable('multi_language_management_languages', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const multi_language_management_translations = pgTable('multi_language_management_translations', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const multi_language_management_locales = pgTable('multi_language_management_locales', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const multi_language_management_content = pgTable('multi_language_management_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type multilanguagemanagementSchema = {
  multi_language_management_languages: typeof multi_language_management_languages;
  multi_language_management_translations: typeof multi_language_management_translations;
  multi_language_management_locales: typeof multi_language_management_locales;
  multi_language_management_content: typeof multi_language_management_content;
};