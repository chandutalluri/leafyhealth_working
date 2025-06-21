import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  integer,
  boolean,
  jsonb,
  decimal
} from 'drizzle-orm/pg-core';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool });

// Label Templates Table
export const labelTemplates = pgTable('label_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  templateType: varchar('template_type', { length: 30 }).notNull(), // product, shipping, barcode, qr_code
  category: varchar('category', { length: 50 }),
  dimensions: jsonb('dimensions').notNull(), // width, height, units
  design: jsonb('design').notNull(), // layout, fonts, colors, elements
  variables: jsonb('variables'), // dynamic fields
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
  createdBy: integer('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Generated Labels Table
export const generatedLabels = pgTable('generated_labels', {
  id: serial('id').primaryKey(),
  templateId: integer('template_id').notNull(),
  labelType: varchar('label_type', { length: 30 }).notNull(),
  entityType: varchar('entity_type', { length: 30 }).notNull(), // product, order, shipment
  entityId: integer('entity_id').notNull(),
  labelData: jsonb('label_data').notNull(),
  generatedContent: jsonb('generated_content'),
  fileUrl: varchar('file_url', { length: 500 }),
  format: varchar('format', { length: 10 }).default('pdf').notNull(), // pdf, png, svg
  batchId: varchar('batch_id', { length: 50 }),
  printedAt: timestamp('printed_at'),
  printedBy: integer('printed_by'),
  status: varchar('status', { length: 20 }).default('generated').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Label Batches Table
export const labelBatches = pgTable('label_batches', {
  id: serial('id').primaryKey(),
  batchNumber: varchar('batch_number', { length: 30 }).unique().notNull(),
  templateId: integer('template_id').notNull(),
  batchType: varchar('batch_type', { length: 30 }).notNull(),
  totalLabels: integer('total_labels').notNull(),
  generatedLabels: integer('generated_labels').default(0),
  printedLabels: integer('printed_labels').default(0),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  batchData: jsonb('batch_data'),
  generatedBy: integer('generated_by').notNull(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Print Jobs Table
export const printJobs = pgTable('print_jobs', {
  id: serial('id').primaryKey(),
  jobNumber: varchar('job_number', { length: 30 }).unique().notNull(),
  printerName: varchar('printer_name', { length: 100 }).notNull(),
  jobType: varchar('job_type', { length: 20 }).notNull(), // single, batch
  labelIds: jsonb('label_ids').notNull(),
  copies: integer('copies').default(1),
  paperSize: varchar('paper_size', { length: 20 }),
  orientation: varchar('orientation', { length: 10 }).default('portrait'),
  quality: varchar('quality', { length: 20 }).default('high'),
  status: varchar('status', { length: 20 }).default('queued').notNull(),
  submittedBy: integer('submitted_by').notNull(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Barcode Data Table
export const barcodeData = pgTable('barcode_data', {
  id: serial('id').primaryKey(),
  entityType: varchar('entity_type', { length: 30 }).notNull(), // product, order, shipment
  entityId: integer('entity_id').notNull(),
  barcodeType: varchar('barcode_type', { length: 20 }).notNull(), // code128, qr_code, ean13
  barcodeValue: varchar('barcode_value', { length: 200 }).notNull(),
  isActive: boolean('is_active').default(true),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at'),
});

export type LabelTemplate = typeof labelTemplates.$inferSelect;
export type InsertLabelTemplate = typeof labelTemplates.$inferInsert;
export type GeneratedLabel = typeof generatedLabels.$inferSelect;
export type InsertGeneratedLabel = typeof generatedLabels.$inferInsert;
export type LabelBatch = typeof labelBatches.$inferSelect;
export type InsertLabelBatch = typeof labelBatches.$inferInsert;

console.log('🔗 Label Design database connected to PostgreSQL');