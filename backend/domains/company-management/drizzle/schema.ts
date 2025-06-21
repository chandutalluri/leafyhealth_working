import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// company-management service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const company_management_companies = pgTable('company_management_companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const company_management_branches = pgTable('company_management_branches', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const company_management_departments = pgTable('company_management_departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type companymanagementSchema = {
  company_management_companies: typeof company_management_companies;
  company_management_branches: typeof company_management_branches;
  company_management_departments: typeof company_management_departments;
};