
import { pgTable, text, uuid, timestamp, boolean, integer, decimal, varchar, jsonb } from 'drizzle-orm/pg-core';

// notification-service service schema - isolated from other services
// All tables are prefixed with service name for future database separation

export const notification_service_notifications = pgTable('notification_service_notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id'),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).default('info').notNull(), // info, warning, error, success
  channel: varchar('channel', { length: 50 }).default('web').notNull(), // web, email, sms, push
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, sent, read, failed
  priority: varchar('priority', { length: 20 }).default('normal').notNull(), // low, normal, high, urgent
  metadata: jsonb('metadata'),
  scheduledAt: timestamp('scheduled_at'),
  sentAt: timestamp('sent_at'),
  readAt: timestamp('read_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const notification_service_templates = pgTable('notification_service_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  subject: varchar('subject', { length: 200 }),
  body: text('body').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // email, sms, push, web
  variables: jsonb('variables'), // Template variables
  isActive: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const notification_service_channels = pgTable('notification_service_channels', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // email, sms, push, web
  config: jsonb('config'), // Channel-specific configuration
  isEnabled: boolean('is_enabled').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const notification_service_subscriptions = pgTable('notification_service_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull(),
  channel: varchar('channel', { length: 50 }).notNull(),
  notificationType: varchar('notification_type', { length: 50 }).notNull(),
  isSubscribed: boolean('is_subscribed').default(true),
  preferences: jsonb('preferences'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Export all tables for type inference
export type notificationserviceSchema = {
  notification_service_notifications: typeof notification_service_notifications;
  notification_service_templates: typeof notification_service_templates;
  notification_service_channels: typeof notification_service_channels;
  notification_service_subscriptions: typeof notification_service_subscriptions;
};
