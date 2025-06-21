import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// reporting-management service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const reporting_management_reports = pgTable('reporting_management_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const reporting_management_schedules = pgTable('reporting_management_schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const reporting_management_exports = pgTable('reporting_management_exports', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const reporting_management_recipients = pgTable('reporting_management_recipients', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type reportingmanagementSchema = {
  reporting_management_reports: typeof reporting_management_reports;
  reporting_management_schedules: typeof reporting_management_schedules;
  reporting_management_exports: typeof reporting_management_exports;
  reporting_management_recipients: typeof reporting_management_recipients;
};