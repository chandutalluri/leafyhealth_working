import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// analytics-reporting service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const analytics_reporting_reports = pgTable('analytics_reporting_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const analytics_reporting_metrics = pgTable('analytics_reporting_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const analytics_reporting_dashboards = pgTable('analytics_reporting_dashboards', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const analytics_reporting_charts = pgTable('analytics_reporting_charts', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type analyticsreportingSchema = {
  analytics_reporting_reports: typeof analytics_reporting_reports;
  analytics_reporting_metrics: typeof analytics_reporting_metrics;
  analytics_reporting_dashboards: typeof analytics_reporting_dashboards;
  analytics_reporting_charts: typeof analytics_reporting_charts;
};