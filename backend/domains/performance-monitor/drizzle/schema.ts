import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// performance-monitor service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const performance_monitor_metrics = pgTable('performance_monitor_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const performance_monitor_alerts = pgTable('performance_monitor_alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const performance_monitor_thresholds = pgTable('performance_monitor_thresholds', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const performance_monitor_incidents = pgTable('performance_monitor_incidents', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type performancemonitorSchema = {
  performance_monitor_metrics: typeof performance_monitor_metrics;
  performance_monitor_alerts: typeof performance_monitor_alerts;
  performance_monitor_thresholds: typeof performance_monitor_thresholds;
  performance_monitor_incidents: typeof performance_monitor_incidents;
};