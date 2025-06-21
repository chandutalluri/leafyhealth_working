import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// label-design service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const label_design_labels = pgTable('label_design_labels', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const label_design_templates = pgTable('label_design_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const label_design_fonts = pgTable('label_design_fonts', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const label_design_barcodes = pgTable('label_design_barcodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type labeldesignSchema = {
  label_design_labels: typeof label_design_labels;
  label_design_templates: typeof label_design_templates;
  label_design_fonts: typeof label_design_fonts;
  label_design_barcodes: typeof label_design_barcodes;
};