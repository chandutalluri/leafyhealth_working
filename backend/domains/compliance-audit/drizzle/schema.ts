import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// compliance-audit service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const compliance_audit_audits = pgTable('compliance_audit_audits', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const compliance_audit_compliance_checks = pgTable('compliance_audit_compliance_checks', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const compliance_audit_violations = pgTable('compliance_audit_violations', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const compliance_audit_reports = pgTable('compliance_audit_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type complianceauditSchema = {
  compliance_audit_audits: typeof compliance_audit_audits;
  compliance_audit_compliance_checks: typeof compliance_audit_compliance_checks;
  compliance_audit_violations: typeof compliance_audit_violations;
  compliance_audit_reports: typeof compliance_audit_reports;
};