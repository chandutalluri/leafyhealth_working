"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataProtectionRecords = exports.complianceReports = exports.policyViolations = exports.auditLogs = exports.complianceEvents = exports.db = exports.pool = void 0;
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
exports.complianceEvents = (0, pg_core_1.pgTable)('compliance_events', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    eventType: (0, pg_core_1.varchar)('event_type', { length: 50 }).notNull(),
    entityType: (0, pg_core_1.varchar)('entity_type', { length: 50 }).notNull(),
    entityId: (0, pg_core_1.integer)('entity_id').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    severity: (0, pg_core_1.varchar)('severity', { length: 20 }).default('medium').notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending').notNull(),
    detectedAt: (0, pg_core_1.timestamp)('detected_at').defaultNow().notNull(),
    resolvedAt: (0, pg_core_1.timestamp)('resolved_at'),
    assignedTo: (0, pg_core_1.integer)('assigned_to'),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    actionTaken: (0, pg_core_1.text)('action_taken'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id'),
    action: (0, pg_core_1.varchar)('action', { length: 100 }).notNull(),
    resource: (0, pg_core_1.varchar)('resource', { length: 100 }).notNull(),
    resourceId: (0, pg_core_1.varchar)('resource_id', { length: 50 }),
    oldValues: (0, pg_core_1.jsonb)('old_values'),
    newValues: (0, pg_core_1.jsonb)('new_values'),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 45 }),
    userAgent: (0, pg_core_1.text)('user_agent'),
    sessionId: (0, pg_core_1.varchar)('session_id', { length: 100 }),
    success: (0, pg_core_1.boolean)('success').default(true),
    errorMessage: (0, pg_core_1.text)('error_message'),
    timestamp: (0, pg_core_1.timestamp)('timestamp').defaultNow().notNull(),
});
exports.policyViolations = (0, pg_core_1.pgTable)('policy_violations', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    policyId: (0, pg_core_1.varchar)('policy_id', { length: 50 }).notNull(),
    policyName: (0, pg_core_1.varchar)('policy_name', { length: 200 }).notNull(),
    violationType: (0, pg_core_1.varchar)('violation_type', { length: 50 }).notNull(),
    userId: (0, pg_core_1.integer)('user_id'),
    description: (0, pg_core_1.text)('description').notNull(),
    severity: (0, pg_core_1.varchar)('severity', { length: 20 }).notNull(),
    autoDetected: (0, pg_core_1.boolean)('auto_detected').default(true),
    reportedBy: (0, pg_core_1.integer)('reported_by'),
    evidence: (0, pg_core_1.jsonb)('evidence'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('open').notNull(),
    resolutionNotes: (0, pg_core_1.text)('resolution_notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    resolvedAt: (0, pg_core_1.timestamp)('resolved_at'),
});
exports.complianceReports = (0, pg_core_1.pgTable)('compliance_reports', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    reportType: (0, pg_core_1.varchar)('report_type', { length: 50 }).notNull(),
    title: (0, pg_core_1.varchar)('title', { length: 200 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    periodStart: (0, pg_core_1.timestamp)('period_start').notNull(),
    periodEnd: (0, pg_core_1.timestamp)('period_end').notNull(),
    generatedBy: (0, pg_core_1.integer)('generated_by').notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('draft').notNull(),
    findings: (0, pg_core_1.jsonb)('findings'),
    recommendations: (0, pg_core_1.jsonb)('recommendations'),
    riskScore: (0, pg_core_1.decimal)('risk_score', { precision: 3, scale: 2 }),
    reportData: (0, pg_core_1.jsonb)('report_data'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    completedAt: (0, pg_core_1.timestamp)('completed_at'),
});
exports.dataProtectionRecords = (0, pg_core_1.pgTable)('data_protection_records', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    dataType: (0, pg_core_1.varchar)('data_type', { length: 50 }).notNull(),
    dataSubject: (0, pg_core_1.varchar)('data_subject', { length: 100 }).notNull(),
    processingPurpose: (0, pg_core_1.varchar)('processing_purpose', { length: 200 }).notNull(),
    legalBasis: (0, pg_core_1.varchar)('legal_basis', { length: 100 }).notNull(),
    retentionPeriod: (0, pg_core_1.integer)('retention_period'),
    dataLocation: (0, pg_core_1.varchar)('data_location', { length: 100 }),
    encryptionStatus: (0, pg_core_1.boolean)('encryption_status').default(true),
    accessControls: (0, pg_core_1.jsonb)('access_controls'),
    lastAccessed: (0, pg_core_1.timestamp)('last_accessed'),
    scheduledDeletion: (0, pg_core_1.timestamp)('scheduled_deletion'),
    consentRecorded: (0, pg_core_1.boolean)('consent_recorded').default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
console.log('🔗 Compliance Audit database connected to PostgreSQL');
//# sourceMappingURL=database.js.map