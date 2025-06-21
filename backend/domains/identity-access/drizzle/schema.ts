import { pgTable, text, uuid, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

// identity-access service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const identity_access_users = pgTable('identity_access_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const identity_access_roles = pgTable('identity_access_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const identity_access_permissions = pgTable('identity_access_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

export const identity_access_sessions = pgTable('identity_access_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  // Add service-specific fields here
});

// Export all tables for type inference
export type identityaccessSchema = {
  identity_access_users: typeof identity_access_users;
  identity_access_roles: typeof identity_access_roles;
  identity_access_permissions: typeof identity_access_permissions;
  identity_access_sessions: typeof identity_access_sessions;
};