import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// user-role-management service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const user_role_management_users = pgTable('user_role_management_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const user_role_management_roles = pgTable('user_role_management_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const user_role_management_permissions = pgTable('user_role_management_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const user_role_management_assignments = pgTable('user_role_management_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type userrolemanagementSchema = {
  user_role_management_users: typeof user_role_management_users;
  user_role_management_roles: typeof user_role_management_roles;
  user_role_management_permissions: typeof user_role_management_permissions;
  user_role_management_assignments: typeof user_role_management_assignments;
};