import { pgTable, serial, varchar, text, timestamp, boolean, integer, jsonb, decimal, unique, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Subscriptions table for meal plans
export const subscriptions = pgTable('subscriptions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  planType: varchar('plan_type', { length: 50 }).notNull(), // daily, weekly, monthly
  mealType: varchar('meal_type', { length: 50 }).notNull(), // breakfast, lunch, dinner, all
  duration: integer('duration').notNull(), // days
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  deliveryTime: varchar('delivery_time', { length: 100 }).notNull(),
  branchId: varchar('branch_id', { length: 36 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('active'), // active, paused, cancelled
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: jsonb('metadata')
});

// Subscription items - what products are included
export const subscriptionItems = pgTable('subscription_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  subscriptionId: varchar('subscription_id', { length: 36 }).references(() => subscriptions.id).notNull(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  quantity: integer('quantity').notNull(),
  dayOffset: integer('day_offset').default(0), // which day in the subscription
  createdAt: timestamp('created_at').defaultNow()
});

// Delivery schedule for subscriptions
export const deliverySchedule = pgTable('delivery_schedule', {
  id: varchar('id', { length: 36 }).primaryKey(),
  subscriptionId: varchar('subscription_id', { length: 36 }).references(() => subscriptions.id).notNull(),
  deliveryDate: date('delivery_date').notNull(),
  deliveryTime: varchar('delivery_time', { length: 100 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending'), // pending, delivered, skipped
  createdAt: timestamp('created_at').defaultNow()
});