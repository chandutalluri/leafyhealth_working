"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.barcodeData = exports.printJobs = exports.labelBatches = exports.generatedLabels = exports.labelTemplates = exports.db = exports.pool = void 0;
const serverless_1 = require("@neondatabase/serverless");
const neon_serverless_1 = require("drizzle-orm/neon-serverless");
const ws_1 = require("ws");
const pg_core_1 = require("drizzle-orm/pg-core");
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}
exports.pool = new serverless_1.Pool({ connectionString: process.env.DATABASE_URL });
exports.db = (0, neon_serverless_1.drizzle)({ client: exports.pool });
exports.labelTemplates = (0, pg_core_1.pgTable)('label_templates', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    templateType: (0, pg_core_1.varchar)('template_type', { length: 30 }).notNull(),
    category: (0, pg_core_1.varchar)('category', { length: 50 }),
    dimensions: (0, pg_core_1.jsonb)('dimensions').notNull(),
    design: (0, pg_core_1.jsonb)('design').notNull(),
    variables: (0, pg_core_1.jsonb)('variables'),
    isDefault: (0, pg_core_1.boolean)('is_default').default(false),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdBy: (0, pg_core_1.integer)('created_by').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.generatedLabels = (0, pg_core_1.pgTable)('generated_labels', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    templateId: (0, pg_core_1.integer)('template_id').notNull(),
    labelType: (0, pg_core_1.varchar)('label_type', { length: 30 }).notNull(),
    entityType: (0, pg_core_1.varchar)('entity_type', { length: 30 }).notNull(),
    entityId: (0, pg_core_1.integer)('entity_id').notNull(),
    labelData: (0, pg_core_1.jsonb)('label_data').notNull(),
    generatedContent: (0, pg_core_1.jsonb)('generated_content'),
    fileUrl: (0, pg_core_1.varchar)('file_url', { length: 500 }),
    format: (0, pg_core_1.varchar)('format', { length: 10 }).default('pdf').notNull(),
    batchId: (0, pg_core_1.varchar)('batch_id', { length: 50 }),
    printedAt: (0, pg_core_1.timestamp)('printed_at'),
    printedBy: (0, pg_core_1.integer)('printed_by'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('generated').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.labelBatches = (0, pg_core_1.pgTable)('label_batches', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    batchNumber: (0, pg_core_1.varchar)('batch_number', { length: 30 }).unique().notNull(),
    templateId: (0, pg_core_1.integer)('template_id').notNull(),
    batchType: (0, pg_core_1.varchar)('batch_type', { length: 30 }).notNull(),
    totalLabels: (0, pg_core_1.integer)('total_labels').notNull(),
    generatedLabels: (0, pg_core_1.integer)('generated_labels').default(0),
    printedLabels: (0, pg_core_1.integer)('printed_labels').default(0),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending').notNull(),
    batchData: (0, pg_core_1.jsonb)('batch_data'),
    generatedBy: (0, pg_core_1.integer)('generated_by').notNull(),
    startedAt: (0, pg_core_1.timestamp)('started_at'),
    completedAt: (0, pg_core_1.timestamp)('completed_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.printJobs = (0, pg_core_1.pgTable)('print_jobs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    jobNumber: (0, pg_core_1.varchar)('job_number', { length: 30 }).unique().notNull(),
    printerName: (0, pg_core_1.varchar)('printer_name', { length: 100 }).notNull(),
    jobType: (0, pg_core_1.varchar)('job_type', { length: 20 }).notNull(),
    labelIds: (0, pg_core_1.jsonb)('label_ids').notNull(),
    copies: (0, pg_core_1.integer)('copies').default(1),
    paperSize: (0, pg_core_1.varchar)('paper_size', { length: 20 }),
    orientation: (0, pg_core_1.varchar)('orientation', { length: 10 }).default('portrait'),
    quality: (0, pg_core_1.varchar)('quality', { length: 20 }).default('high'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('queued').notNull(),
    submittedBy: (0, pg_core_1.integer)('submitted_by').notNull(),
    startedAt: (0, pg_core_1.timestamp)('started_at'),
    completedAt: (0, pg_core_1.timestamp)('completed_at'),
    errorMessage: (0, pg_core_1.text)('error_message'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.barcodeData = (0, pg_core_1.pgTable)('barcode_data', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    entityType: (0, pg_core_1.varchar)('entity_type', { length: 30 }).notNull(),
    entityId: (0, pg_core_1.integer)('entity_id').notNull(),
    barcodeType: (0, pg_core_1.varchar)('barcode_type', { length: 20 }).notNull(),
    barcodeValue: (0, pg_core_1.varchar)('barcode_value', { length: 200 }).notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    generatedAt: (0, pg_core_1.timestamp)('generated_at').defaultNow().notNull(),
    lastUsedAt: (0, pg_core_1.timestamp)('last_used_at'),
});
console.log('🔗 Label Design database connected to PostgreSQL');
//# sourceMappingURL=database.js.map