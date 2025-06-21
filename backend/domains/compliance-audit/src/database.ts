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

// Compliance Events Table
export const complianceEvents = pgTable('compliance_events', {
  id: serial('id').primaryKey(),
  eventType: varchar('event_type', { length: 50 }).notNull(), // data_access, policy_violation, audit_trail
  entityType: varchar('entity_type', { length: 50 }).notNull(), // user, order, payment, product
  entityId: integer('entity_id').notNull(),
  description: text('description').notNull(),
  severity: varchar('severity', { length: 20 }).default('medium').notNull(), // low, medium, high, critical
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, investigating, resolved, dismissed
  detectedAt: timestamp('detected_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
  assignedTo: integer('assigned_to'),
  metadata: jsonb('metadata'),
  actionTaken: text('action_taken'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Audit Logs Table
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'),
  action: varchar('action', { length: 100 }).notNull(),
  resource: varchar('resource', { length: 100 }).notNull(),
  resourceId: varchar('resource_id', { length: 50 }),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  sessionId: varchar('session_id', { length: 100 }),
  success: boolean('success').default(true),
  errorMessage: text('error_message'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Policy Violations Table
export const policyViolations = pgTable('policy_violations', {
  id: serial('id').primaryKey(),
  policyId: varchar('policy_id', { length: 50 }).notNull(),
  policyName: varchar('policy_name', { length: 200 }).notNull(),
  violationType: varchar('violation_type', { length: 50 }).notNull(),
  userId: integer('user_id'),
  description: text('description').notNull(),
  severity: varchar('severity', { length: 20 }).notNull(),
  autoDetected: boolean('auto_detected').default(true),
  reportedBy: integer('reported_by'),
  evidence: jsonb('evidence'),
  status: varchar('status', { length: 20 }).default('open').notNull(),
  resolutionNotes: text('resolution_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
});

// Compliance Reports Table
export const complianceReports = pgTable('compliance_reports', {
  id: serial('id').primaryKey(),
  reportType: varchar('report_type', { length: 50 }).notNull(), // gdpr, security, financial
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  generatedBy: integer('generated_by').notNull(),
  status: varchar('status', { length: 20 }).default('draft').notNull(),
  findings: jsonb('findings'),
  recommendations: jsonb('recommendations'),
  riskScore: decimal('risk_score', { precision: 3, scale: 2 }),
  reportData: jsonb('report_data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

// Data Protection Records
export const dataProtectionRecords = pgTable('data_protection_records', {
  id: serial('id').primaryKey(),
  dataType: varchar('data_type', { length: 50 }).notNull(), // personal, financial, health
  dataSubject: varchar('data_subject', { length: 100 }).notNull(),
  processingPurpose: varchar('processing_purpose', { length: 200 }).notNull(),
  legalBasis: varchar('legal_basis', { length: 100 }).notNull(),
  retentionPeriod: integer('retention_period'), // days
  dataLocation: varchar('data_location', { length: 100 }),
  encryptionStatus: boolean('encryption_status').default(true),
  accessControls: jsonb('access_controls'),
  lastAccessed: timestamp('last_accessed'),
  scheduledDeletion: timestamp('scheduled_deletion'),
  consentRecorded: boolean('consent_recorded').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type ComplianceEvent = typeof complianceEvents.$inferSelect;
export type InsertComplianceEvent = typeof complianceEvents.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
export type PolicyViolation = typeof policyViolations.$inferSelect;
export type InsertPolicyViolation = typeof policyViolations.$inferInsert;
export type ComplianceReport = typeof complianceReports.$inferSelect;
export type InsertComplianceReport = typeof complianceReports.$inferInsert;

console.log('🔗 Compliance Audit database connected to PostgreSQL');