
// Use standardized database connection
export { db, databaseConnection } from '../../../../shared/database/connection';

// Import the notification service schema
export * from '../drizzle/schema';

// Import specific tables for easier access
export { 
  notification_service_notifications as notifications,
  notification_service_templates as notificationTemplates,
  notification_service_channels as notificationChannels,
  notification_service_subscriptions as notificationPreferences 
} from '../drizzle/schema';

// Define types for easier use
export type Notification = typeof notification_service_notifications.$inferSelect;
export type InsertNotification = typeof notification_service_notifications.$inferInsert;

console.log('🔗 Database connected to PostgreSQL');
console.log('📊 Notification Service schema loaded');
// Database connection established via shared connection pool
