import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// employee-management service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const employee_management_employees = pgTable('employee_management_employees', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const employee_management_positions = pgTable('employee_management_positions', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const employee_management_departments = pgTable('employee_management_departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const employee_management_performance = pgTable('employee_management_performance', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type employeemanagementSchema = {
  employee_management_employees: typeof employee_management_employees;
  employee_management_positions: typeof employee_management_positions;
  employee_management_departments: typeof employee_management_departments;
  employee_management_performance: typeof employee_management_performance;
};