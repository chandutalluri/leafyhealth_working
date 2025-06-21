import { pgTable, serial, varchar, text, timestamp, boolean, integer, jsonb, decimal, unique, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table for authentication and user management
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }).unique(),
  password: text('password').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('user'),
  status: varchar('status', { length: 20 }).default('active'),
  assignedApp: varchar('assigned_app', { length: 50 }),
  department: varchar('department', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  isActive: boolean('is_active').default(true),
  emailVerified: boolean('email_verified').default(false),
  lastLogin: timestamp('last_login'),
  preferredBranchId: integer('preferred_branch_id'),
  currentBranchId: integer('current_branch_id'),
  lastKnownLatitude: decimal('last_known_latitude', { precision: 10, scale: 8 }),
  lastKnownLongitude: decimal('last_known_longitude', { precision: 11, scale: 8 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: jsonb('metadata')
});

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

// User sessions for authentication
export const userSessions = pgTable('user_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  branchId: integer('branch_id'),
  sessionToken: text('session_token').notNull().unique(),
  refreshToken: text('refresh_token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Roles and permissions for RBAC
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  permissions: jsonb('permissions'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Food delivery specific tables will be handled by existing product catalog schema

// User role assignments
export const userRoles = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  roleId: integer('role_id').references(() => roles.id).notNull(),
  assignedBy: integer('assigned_by').references(() => users.id),
  assignedAt: timestamp('assigned_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true)
});

// Audit logs for security and compliance
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  resource: varchar('resource', { length: 100 }),
  resourceId: varchar('resource_id', { length: 100 }),
  details: jsonb('details'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp').defaultNow()
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(userSessions),
  roleAssignments: many(userRoles),
  auditLogs: many(auditLogs)
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id]
  })
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userAssignments: many(userRoles)
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id]
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id]
  }),
  assignedByUser: one(users, {
    fields: [userRoles.assignedBy],
    references: [users.id]
  })
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id]
  })
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = typeof userSessions.$inferInsert;
export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;
export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = typeof userRoles.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

// ============================================
// BRANCH MANAGEMENT DOMAIN
// ============================================

// Branch management with polygon service areas
export const branches = pgTable('branches', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).unique().notNull(),
  address: text('address').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
  servicePolygon: jsonb('service_polygon').notNull(), // GeoJSON polygon
  contactPhone: varchar('contact_phone', { length: 20 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  isActive: boolean('is_active').default(true),
  operatingHours: jsonb('operating_hours'), // Store daily hours
  deliveryRadius: integer('delivery_radius').default(10), // km
  minimumOrderAmount: decimal('minimum_order_amount', { precision: 10, scale: 2 }).default('0'),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Branch-specific product inventory
export const branchProducts = pgTable('branch_products', {
  id: serial('id').primaryKey(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  stockQuantity: integer('stock_quantity').default(0),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  discountedPrice: decimal('discounted_price', { precision: 10, scale: 2 }),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Location detection logs
export const locationLogs = pgTable('location_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  sessionId: integer('session_id').references(() => userSessions.id),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  accuracy: integer('accuracy'), // meters
  detectionMethod: varchar('detection_method', { length: 50 }), // 'gps', 'ip', 'manual'
  branchFound: integer('branch_found').references(() => branches.id),
  isServiceable: boolean('is_serviceable').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Branch Relations
export const branchesRelations = relations(branches, ({ many }) => ({
  products: many(branchProducts),
  users: many(users),
  sessions: many(userSessions),
  locationLogs: many(locationLogs),
}));

export const branchProductsRelations = relations(branchProducts, ({ one }) => ({
  branch: one(branches, {
    fields: [branchProducts.branchId],
    references: [branches.id],
  }),
  product: one(products, {
    fields: [branchProducts.productId],
    references: [products.id],
  }),
}));

export const locationLogsRelations = relations(locationLogs, ({ one }) => ({
  user: one(users, {
    fields: [locationLogs.userId],
    references: [users.id],
  }),
  session: one(userSessions, {
    fields: [locationLogs.sessionId],
    references: [userSessions.id],
  }),
  branch: one(branches, {
    fields: [locationLogs.branchFound],
    references: [branches.id],
  }),
}));

// Branch Types
export type Branch = typeof branches.$inferSelect;
export type InsertBranch = typeof branches.$inferInsert;
export type BranchProduct = typeof branchProducts.$inferSelect;
export type InsertBranchProduct = typeof branchProducts.$inferInsert;
export type LocationLog = typeof locationLogs.$inferSelect;
export type InsertLocationLog = typeof locationLogs.$inferInsert;

// Product Catalog Tables
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  parentId: integer('parent_id').references(() => categories.id),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  imageUrl: varchar('image_url', { length: 500 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  sku: varchar('sku', { length: 100 }).unique().notNull(),
  barcode: varchar('barcode', { length: 100 }),
  categoryId: integer('category_id').references(() => categories.id),
  price: varchar('price', { length: 20 }).notNull(),
  costPrice: varchar('cost_price', { length: 20 }),
  weight: varchar('weight', { length: 20 }),
  unit: varchar('unit', { length: 50 }).default('piece'),
  stockQuantity: integer('stock_quantity').default(0),
  minStockLevel: integer('min_stock_level').default(0),
  maxStockLevel: integer('max_stock_level').default(1000),
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
  taxRate: varchar('tax_rate', { length: 10 }).default('0'),
  expiryDate: timestamp('expiry_date'),
  batchNumber: varchar('batch_number', { length: 100 }),
  nutritionalInfo: jsonb('nutritional_info'),
  allergens: jsonb('allergens'),
  tags: jsonb('tags'),
  images: jsonb('images'),
  metadata: jsonb('metadata'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  reservedQuantity: integer('reserved_quantity').default(0),
  location: varchar('location', { length: 100 }),
  batchNumber: varchar('batch_number', { length: 100 }),
  expiryDate: timestamp('expiry_date'),
  costPrice: varchar('cost_price', { length: 20 }),
  lastUpdated: timestamp('last_updated').defaultNow(),
  updatedBy: integer('updated_by').references(() => users.id)
});

// Cart items table for shopping cart persistence
export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  quantity: integer('quantity').notNull(),
  addedAt: timestamp('added_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Relations
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id]
  }),
  children: many(categories),
  products: many(products)
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id]
  }),
  createdByUser: one(users, {
    fields: [products.createdBy],
    references: [users.id]
  }),
  inventory: many(inventory),
  cartItems: many(cartItems)
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id]
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id]
  }),
  branch: one(branches, {
    fields: [cartItems.branchId],
    references: [branches.id]
  })
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id]
  }),
  updatedByUser: one(users, {
    fields: [inventory.updatedBy],
    references: [users.id]
  })
}));

// Types
export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = typeof inventory.$inferInsert;

// Inventory Management Tables
export const inventoryTransactions = pgTable('inventory_transactions', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id),
  transactionType: varchar('transaction_type', { length: 50 }).notNull(), // 'IN', 'OUT', 'ADJUSTMENT'
  quantity: integer('quantity').notNull(),
  unitCost: decimal('unit_cost', { precision: 10, scale: 2 }),
  reference: varchar('reference', { length: 255 }), // Purchase order, sale order, etc.
  notes: text('notes'),
  performedBy: integer('performed_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const stockAlerts = pgTable('stock_alerts', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id),
  alertType: varchar('alert_type', { length: 50 }).notNull(), // 'LOW_STOCK', 'OUT_OF_STOCK', 'OVERSTOCK'
  threshold: integer('threshold'),
  currentStock: integer('current_stock'),
  isActive: boolean('is_active').default(true),
  acknowledgedBy: integer('acknowledged_by').references(() => users.id),
  acknowledgedAt: timestamp('acknowledged_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const inventoryAdjustments = pgTable('inventory_adjustments', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id),
  oldQuantity: integer('old_quantity').notNull(),
  newQuantity: integer('new_quantity').notNull(),
  adjustmentReason: varchar('adjustment_reason', { length: 100 }).notNull(),
  notes: text('notes'),
  approvedBy: integer('approved_by').references(() => users.id),
  performedBy: integer('performed_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Relations for inventory tables
export const inventoryTransactionsRelations = relations(inventoryTransactions, ({ one }) => ({
  product: one(products, {
    fields: [inventoryTransactions.productId],
    references: [products.id]
  }),
  performer: one(users, {
    fields: [inventoryTransactions.performedBy],
    references: [users.id]
  })
}));

export const stockAlertsRelations = relations(stockAlerts, ({ one }) => ({
  product: one(products, {
    fields: [stockAlerts.productId],
    references: [products.id]
  }),
  acknowledgedByUser: one(users, {
    fields: [stockAlerts.acknowledgedBy],
    references: [users.id]
  })
}));

export const inventoryAdjustmentsRelations = relations(inventoryAdjustments, ({ one }) => ({
  product: one(products, {
    fields: [inventoryAdjustments.productId],
    references: [products.id]
  }),
  approver: one(users, {
    fields: [inventoryAdjustments.approvedBy],
    references: [users.id]
  }),
  performer: one(users, {
    fields: [inventoryAdjustments.performedBy],
    references: [users.id]
  })
}));

// Export types for inventory tables
export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;
export type InsertInventoryTransaction = typeof inventoryTransactions.$inferInsert;
export type StockAlert = typeof stockAlerts.$inferSelect;
export type InsertStockAlert = typeof stockAlerts.$inferInsert;
export type InventoryAdjustment = typeof inventoryAdjustments.$inferSelect;
export type InsertInventoryAdjustment = typeof inventoryAdjustments.$inferInsert;

// ============================================
// ORDER MANAGEMENT DOMAIN
// ============================================

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  customerId: integer('customer_id').references(() => users.id),
  branchId: integer('branch_id').references(() => branches.id),
  customerName: varchar('customer_name', { length: 100 }),
  customerEmail: varchar('customer_email', { length: 100 }),
  customerPhone: varchar('customer_phone', { length: 20 }),
  deliveryAddress: text('delivery_address'),
  orderStatus: varchar('order_status', { length: 20 }).notNull().default('PENDING'),
  paymentStatus: varchar('payment_status', { length: 20 }).notNull().default('PENDING'),
  orderType: varchar('order_type', { length: 20 }).notNull().default('ONLINE'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0'),
  shippingAmount: decimal('shipping_amount', { precision: 10, scale: 2 }).default('0'),
  currency: varchar('currency', { length: 3 }).default('INR').notNull(),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  orderDate: timestamp('order_date').defaultNow().notNull(),
  requiredDate: timestamp('required_date'),
  shippedDate: timestamp('shipped_date'),
  deliveryDate: timestamp('delivery_date'),
  shippingAddress: jsonb('shipping_address'),
  billingAddress: jsonb('billing_address'),
  specialInstructions: text('special_instructions'),
  deliveryBundle: varchar('delivery_bundle', { length: 100 }),
  retryCount: integer('retry_count').default(0),
  lastRetryAt: timestamp('last_retry_at'),
  originalOrderId: integer('original_order_id'),
  partialOrderId: integer('partial_order_id'),
  fulfillmentCenter: varchar('fulfillment_center', { length: 100 }),
  estimatedDeliveryTime: varchar('estimated_delivery_time', { length: 50 }),
  routingScore: decimal('routing_score', { precision: 3, scale: 2 }),
  promoCode: varchar('promo_code', { length: 50 }),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  productName: varchar('product_name', { length: 200 }).notNull(),
  productSku: varchar('product_sku', { length: 100 }),
  quantity: integer('quantity').notNull(),
  unitPrice: varchar('unit_price', { length: 20 }).notNull(),
  totalPrice: varchar('total_price', { length: 20 }).notNull(),
  discountAmount: varchar('discount_amount', { length: 20 }).default('0'),
  notes: text('notes')
});

export const orderStatusHistory = pgTable('order_status_history', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  previousStatus: varchar('previous_status', { length: 20 }),
  newStatus: varchar('new_status', { length: 20 }).notNull(),
  statusReason: varchar('status_reason', { length: 200 }),
  changedBy: integer('changed_by').references(() => users.id),
  changedAt: timestamp('changed_at').defaultNow().notNull()
});

// Relations for order tables
export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id]
  }),
  createdByUser: one(users, {
    fields: [orders.createdBy],
    references: [users.id]
  }),
  orderItems: many(orderItems),
  statusHistory: many(orderStatusHistory)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  order: one(orders, {
    fields: [orderStatusHistory.orderId],
    references: [orders.id]
  }),
  changedByUser: one(users, {
    fields: [orderStatusHistory.changedBy],
    references: [users.id]
  })
}));

// Export types for order tables
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;
export type InsertOrderStatusHistory = typeof orderStatusHistory.$inferInsert;

// Payment Processing Tables
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id),
  customerId: integer('customer_id').references(() => users.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('INR'),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(), // card, bank_transfer, digital_wallet
  paymentStatus: varchar('payment_status', { length: 20 }).default('pending'), // pending, processing, completed, failed, refunded
  transactionId: varchar('transaction_id', { length: 100 }),
  gatewayReference: varchar('gateway_reference', { length: 100 }),
  gatewayResponse: text('gateway_response'),
  processedAt: timestamp('processed_at'),
  failureReason: text('failure_reason'),
  metadata: text('metadata'), // JSON string for additional data
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdBy: integer('created_by').references(() => users.id),
  updatedBy: integer('updated_by').references(() => users.id)
});

export const paymentMethods = pgTable('payment_methods', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(), // credit_card, debit_card, bank_account, digital_wallet
  provider: varchar('provider', { length: 50 }).notNull(), // stripe, paypal, etc.
  externalId: varchar('external_id', { length: 100 }).notNull(), // provider's payment method ID
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
  lastFour: varchar('last_four', { length: 4 }),
  expiryMonth: integer('expiry_month'),
  expiryYear: integer('expiry_year'),
  cardBrand: varchar('card_brand', { length: 20 }),
  billingAddress: text('billing_address'), // JSON string
  metadata: text('metadata'), // JSON string for additional data
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const refunds = pgTable('refunds', {
  id: serial('id').primaryKey(),
  paymentId: integer('payment_id').references(() => payments.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  reason: varchar('reason', { length: 100 }),
  status: varchar('status', { length: 20 }).default('pending'), // pending, processing, completed, failed
  gatewayRefundId: varchar('gateway_refund_id', { length: 100 }),
  processedAt: timestamp('processed_at'),
  failureReason: text('failure_reason'),
  metadata: text('metadata'), // JSON string
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdBy: integer('created_by').references(() => users.id),
  updatedBy: integer('updated_by').references(() => users.id)
});

export const paymentAttempts = pgTable('payment_attempts', {
  id: serial('id').primaryKey(),
  paymentId: integer('payment_id').references(() => payments.id),
  attemptNumber: integer('attempt_number').notNull(),
  status: varchar('status', { length: 20 }).notNull(), // started, processing, completed, failed
  gatewayResponse: text('gateway_response'),
  errorCode: varchar('error_code', { length: 50 }),
  errorMessage: text('error_message'),
  processingTime: integer('processing_time'), // in milliseconds
  createdAt: timestamp('created_at').defaultNow()
});

// Payment Relations
export const paymentsRelations = relations(payments, ({ one, many }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
  customer: one(users, { fields: [payments.customerId], references: [users.id] }),
  createdByUser: one(users, { fields: [payments.createdBy], references: [users.id] }),
  updatedByUser: one(users, { fields: [payments.updatedBy], references: [users.id] }),
  refunds: many(refunds),
  attempts: many(paymentAttempts)
}));

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  customer: one(users, { fields: [paymentMethods.customerId], references: [users.id] })
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
  payment: one(payments, { fields: [refunds.paymentId], references: [payments.id] }),
  createdByUser: one(users, { fields: [refunds.createdBy], references: [users.id] }),
  updatedByUser: one(users, { fields: [refunds.updatedBy], references: [users.id] })
}));

export const paymentAttemptsRelations = relations(paymentAttempts, ({ one }) => ({
  payment: one(payments, { fields: [paymentAttempts.paymentId], references: [payments.id] })
}));

// Payment Types
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = typeof paymentMethods.$inferInsert;
export type Refund = typeof refunds.$inferSelect;
export type InsertRefund = typeof refunds.$inferInsert;
export type PaymentAttempt = typeof paymentAttempts.$inferSelect;
export type InsertPaymentAttempt = typeof paymentAttempts.$inferInsert;

// =====================================
// NOTIFICATION MANAGEMENT SCHEMA
// =====================================

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(), // email, sms, push, in_app
  channel: varchar('channel', { length: 50 }).notNull(), // order, payment, inventory, system
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  data: jsonb('data'), // Additional notification data
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, sent, failed, read
  priority: varchar('priority', { length: 20 }).notNull().default('normal'), // low, normal, high, urgent
  scheduledAt: timestamp('scheduled_at'),
  sentAt: timestamp('sent_at'),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const notificationTemplates = pgTable('notification_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  type: varchar('type', { length: 50 }).notNull(), // email, sms, push, in_app
  channel: varchar('channel', { length: 50 }).notNull(),
  subject: varchar('subject', { length: 255 }),
  template: text('template').notNull(),
  variables: jsonb('variables'), // Template variables schema
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const notificationPreferences = pgTable('notification_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  channel: varchar('channel', { length: 50 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Notification Relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  })
}));

export const notificationPreferencesRelations = relations(notificationPreferences, ({ one }) => ({
  user: one(users, {
    fields: [notificationPreferences.userId],
    references: [users.id]
  })
}));

// Notification Types
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
export type NotificationTemplate = typeof notificationTemplates.$inferSelect;
export type InsertNotificationTemplate = typeof notificationTemplates.$inferInsert;
export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;

// =====================================
// CUSTOMER MANAGEMENT SCHEMA
// =====================================

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  dateOfBirth: timestamp('date_of_birth'),
  gender: varchar('gender', { length: 10 }),
  profilePicture: text('profile_picture'),
  preferredLanguage: varchar('preferred_language', { length: 10 }).default('en'),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});



export const customerAddresses = pgTable('customer_addresses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 50 }).default('home').notNull(), // home, office, other
  addressLine1: varchar('address_line1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  pincode: varchar('pincode', { length: 10 }).notNull(),
  landmark: varchar('landmark', { length: 255 }),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const customerPreferences = pgTable('customer_preferences', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // notifications, dietary, delivery
  key: varchar('key', { length: 100 }).notNull(),
  value: text('value').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Customer Relations
export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id]
  }),
  addresses: many(customerAddresses),
  preferences: many(customerPreferences)
}));

export const customerAddressesRelations = relations(customerAddresses, ({ one }) => ({
  user: one(users, {
    fields: [customerAddresses.userId],
    references: [users.id]
  })
}));

export const customerPreferencesRelations = relations(customerPreferences, ({ one }) => ({
  customer: one(customers, {
    fields: [customerPreferences.customerId],
    references: [customers.id]
  })
}));

// Customer Types
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;
export type CustomerAddress = typeof customerAddresses.$inferSelect;
export type InsertCustomerAddress = typeof customerAddresses.$inferInsert;
export type CustomerPreference = typeof customerPreferences.$inferSelect;
export type InsertCustomerPreference = typeof customerPreferences.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

// Shipping & Delivery Service Tables
export const shipments = pgTable('shipments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id),
  customerId: integer('customer_id').references(() => customers.id),
  trackingNumber: varchar('tracking_number', { length: 100 }).unique(),
  carrier: varchar('carrier', { length: 50 }),
  shippingMethod: varchar('shipping_method', { length: 50 }),
  status: varchar('status', { length: 50 }).default('pending'),
  estimatedDeliveryDate: timestamp('estimated_delivery_date'),
  actualDeliveryDate: timestamp('actual_delivery_date'),
  shippingAddress: text('shipping_address'),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }),
  weight: decimal('weight', { precision: 8, scale: 2 }),
  dimensions: varchar('dimensions', { length: 100 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const trackingEvents = pgTable('tracking_events', {
  id: serial('id').primaryKey(),
  shipmentId: integer('shipment_id').references(() => shipments.id),
  status: varchar('status', { length: 50 }),
  location: varchar('location', { length: 200 }),
  description: text('description'),
  timestamp: timestamp('timestamp'),
  createdAt: timestamp('created_at').defaultNow()
});

export const deliveryRoutes = pgTable('delivery_routes', {
  id: serial('id').primaryKey(),
  routeName: varchar('route_name', { length: 100 }),
  driverId: integer('driver_id'),
  vehicleId: varchar('vehicle_id', { length: 50 }),
  startLocation: varchar('start_location', { length: 200 }),
  endLocation: varchar('end_location', { length: 200 }),
  estimatedDuration: integer('estimated_duration'),
  actualDuration: integer('actual_duration'),
  status: varchar('status', { length: 50 }).default('planned'),
  date: varchar('date', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const routeShipments = pgTable('route_shipments', {
  id: serial('id').primaryKey(),
  routeId: integer('route_id').references(() => deliveryRoutes.id),
  shipmentId: integer('shipment_id').references(() => shipments.id),
  deliveryOrder: integer('delivery_order'),
  estimatedDeliveryTime: timestamp('estimated_delivery_time'),
  actualDeliveryTime: timestamp('actual_delivery_time'),
  status: varchar('status', { length: 50 }).default('pending'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow()
});

export const carriers = pgTable('carriers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  code: varchar('code', { length: 20 }).unique(),
  apiEndpoint: varchar('api_endpoint', { length: 255 }),
  isActive: boolean('is_active').default(true),
  supportedServices: text('supported_services'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Relations
export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  order: one(orders, {
    fields: [shipments.orderId],
    references: [orders.id]
  }),
  customer: one(customers, {
    fields: [shipments.customerId],
    references: [customers.id]
  }),
  trackingEvents: many(trackingEvents),
  routeShipments: many(routeShipments)
}));

export const trackingEventsRelations = relations(trackingEvents, ({ one }) => ({
  shipment: one(shipments, {
    fields: [trackingEvents.shipmentId],
    references: [shipments.id]
  })
}));

export const deliveryRoutesRelations = relations(deliveryRoutes, ({ many }) => ({
  routeShipments: many(routeShipments)
}));

export const routeShipmentsRelations = relations(routeShipments, ({ one }) => ({
  route: one(deliveryRoutes, {
    fields: [routeShipments.routeId],
    references: [deliveryRoutes.id]
  }),
  shipment: one(shipments, {
    fields: [routeShipments.shipmentId],
    references: [shipments.id]
  })
}));

// Type exports
export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = typeof shipments.$inferInsert;
export type TrackingEvent = typeof trackingEvents.$inferSelect;
export type InsertTrackingEvent = typeof trackingEvents.$inferInsert;
export type DeliveryRoute = typeof deliveryRoutes.$inferSelect;
export type InsertDeliveryRoute = typeof deliveryRoutes.$inferInsert;
export type RouteShipment = typeof routeShipments.$inferSelect;
export type InsertRouteShipment = typeof routeShipments.$inferInsert;
export type Carrier = typeof carriers.$inferSelect;
export type InsertCarrier = typeof carriers.$inferInsert;

// =====================================
// IMAGE MANAGEMENT SCHEMA
// =====================================

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  width: integer('width'),
  height: integer('height'),
  path: varchar('path', { length: 500 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  altText: varchar('alt_text', { length: 255 }),
  title: varchar('title', { length: 255 }),
  category: varchar('category', { length: 50 }).default('general'), // product, category, banner, profile, general
  entityType: varchar('entity_type', { length: 50 }), // product, category, user, etc.
  entityId: integer('entity_id'), // ID of the related entity
  variants: jsonb('variants'), // Store different sizes/formats
  metadata: jsonb('metadata'), // Additional image metadata
  isActive: boolean('is_active').default(true),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const imageVariants = pgTable('image_variants', {
  id: serial('id').primaryKey(),
  imageId: integer('image_id').references(() => images.id).notNull(),
  variant: varchar('variant', { length: 50 }).notNull(), // sm, md, lg, xl, webp, original
  width: integer('width'),
  height: integer('height'),
  size: integer('size').notNull(),
  path: varchar('path', { length: 500 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  format: varchar('format', { length: 20 }).notNull(), // jpeg, png, webp
  quality: integer('quality').default(85),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Image Relations
export const imagesRelations = relations(images, ({ one, many }) => ({
  uploadedByUser: one(users, {
    fields: [images.uploadedBy],
    references: [users.id]
  }),
  variants: many(imageVariants)
}));

export const imageVariantsRelations = relations(imageVariants, ({ one }) => ({
  image: one(images, {
    fields: [imageVariants.imageId],
    references: [images.id]
  })
}));

// Image Types
export type Image = typeof images.$inferSelect;
export type InsertImage = typeof images.$inferInsert;
export type ImageVariant = typeof imageVariants.$inferSelect;
export type InsertImageVariant = typeof imageVariants.$inferInsert;

// Marketplace Management Tables
export const vendors = pgTable('vendors', {
  id: serial('id').primaryKey(),
  businessName: varchar('business_name', { length: 255 }).notNull(),
  contactEmail: varchar('contact_email', { length: 255 }).notNull().unique(),
  contactPhone: varchar('contact_phone', { length: 50 }),
  businessAddress: text('business_address'),
  licenseNumber: varchar('license_number', { length: 100 }),
  taxId: varchar('tax_id', { length: 100 }).notNull(),
  description: text('description'),
  website: varchar('website', { length: 255 }),
  categories: text('categories'), // JSON array of category strings
  commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).notNull(),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  verifiedAt: timestamp('verified_at'),
  verifiedBy: integer('verified_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdBy: integer('created_by').references(() => users.id),
  updatedBy: integer('updated_by').references(() => users.id)
});

export const vendorProducts = pgTable('vendor_products', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id').references(() => vendors.id),
  productId: integer('product_id').references(() => products.id),
  vendorSku: varchar('vendor_sku', { length: 100 }),
  vendorPrice: decimal('vendor_price', { precision: 10, scale: 2 }).notNull(),
  commission: decimal('commission', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const vendorPayouts = pgTable('vendor_payouts', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id').references(() => vendors.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('INR'),
  status: varchar('status', { length: 20 }).default('pending'), // pending, processing, completed, failed
  paymentMethod: varchar('payment_method', { length: 50 }),
  transactionId: varchar('transaction_id', { length: 100 }),
  periodStart: timestamp('period_start'),
  periodEnd: timestamp('period_end'),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdBy: integer('created_by').references(() => users.id)
});

// Relations for Marketplace Management
export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  verifiedByUser: one(users, {
    fields: [vendors.verifiedBy],
    references: [users.id]
  }),
  createdByUser: one(users, {
    fields: [vendors.createdBy],
    references: [users.id]
  }),
  vendorProducts: many(vendorProducts),
  vendorPayouts: many(vendorPayouts)
}));

export const vendorProductsRelations = relations(vendorProducts, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorProducts.vendorId],
    references: [vendors.id]
  }),
  product: one(products, {
    fields: [vendorProducts.productId],
    references: [products.id]
  })
}));

export const vendorPayoutsRelations = relations(vendorPayouts, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorPayouts.vendorId],
    references: [vendors.id]
  }),
  createdByUser: one(users, {
    fields: [vendorPayouts.createdBy],
    references: [users.id]
  })
}));

export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof vendors.$inferInsert;
export type VendorProduct = typeof vendorProducts.$inferSelect;
export type InsertVendorProduct = typeof vendorProducts.$inferInsert;
export type VendorPayout = typeof vendorPayouts.$inferSelect;
export type InsertVendorPayout = typeof vendorPayouts.$inferInsert;

// Employee Management Tables
export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  employeeId: varchar('employee_id', { length: 50 }).unique().notNull(),
  department: varchar('department', { length: 100 }),
  position: varchar('position', { length: 100 }),
  salary: decimal('salary', { precision: 10, scale: 2 }),
  hourlyRate: decimal('hourly_rate', { precision: 8, scale: 2 }),
  hireDate: date('hire_date'),
  terminationDate: date('termination_date'),
  status: varchar('status', { length: 20 }).default('active'), // active, inactive, terminated
  managerId: integer('manager_id').references(() => users.id),
  workLocation: varchar('work_location', { length: 100 }),
  emergencyContact: jsonb('emergency_contact'),
  benefits: jsonb('benefits'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id).notNull(),
  date: date('date').notNull(),
  clockIn: timestamp('clock_in'),
  clockOut: timestamp('clock_out'),
  breakStart: timestamp('break_start'),
  breakEnd: timestamp('break_end'),
  totalHours: decimal('total_hours', { precision: 4, scale: 2 }),
  overtimeHours: decimal('overtime_hours', { precision: 4, scale: 2 }),
  status: varchar('status', { length: 20 }).default('present'), // present, absent, late, sick, vacation
  notes: text('notes'),
  approvedBy: integer('approved_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow()
});

export const payroll = pgTable('payroll', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id).notNull(),
  payPeriodStart: date('pay_period_start').notNull(),
  payPeriodEnd: date('pay_period_end').notNull(),
  regularHours: decimal('regular_hours', { precision: 6, scale: 2 }),
  overtimeHours: decimal('overtime_hours', { precision: 6, scale: 2 }),
  grossPay: decimal('gross_pay', { precision: 10, scale: 2 }),
  deductions: jsonb('deductions'),
  taxes: jsonb('taxes'),
  netPay: decimal('net_pay', { precision: 10, scale: 2 }),
  payDate: date('pay_date'),
  status: varchar('status', { length: 20 }).default('pending'), // pending, approved, paid
  processedBy: integer('processed_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow()
});

// Advanced Accounting Tables
export const chartOfAccounts = pgTable('chart_of_accounts', {
  id: serial('id').primaryKey(),
  accountCode: varchar('account_code', { length: 20 }).unique().notNull(),
  accountName: varchar('account_name', { length: 100 }).notNull(),
  accountType: varchar('account_type', { length: 50 }).notNull(), // asset, liability, equity, revenue, expense
  parentAccountId: integer('parent_account_id').references(() => chartOfAccounts.id),
  isActive: boolean('is_active').default(true),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const journalEntries = pgTable('journal_entries', {
  id: serial('id').primaryKey(),
  entryNumber: varchar('entry_number', { length: 50 }).unique().notNull(),
  date: date('date').notNull(),
  description: text('description').notNull(),
  reference: varchar('reference', { length: 100 }),
  totalDebit: decimal('total_debit', { precision: 15, scale: 2 }),
  totalCredit: decimal('total_credit', { precision: 15, scale: 2 }),
  status: varchar('status', { length: 20 }).default('pending'), // pending, posted, reversed
  createdBy: integer('created_by').references(() => users.id),
  approvedBy: integer('approved_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow()
});

export const journalEntryLines = pgTable('journal_entry_lines', {
  id: serial('id').primaryKey(),
  journalEntryId: integer('journal_entry_id').references(() => journalEntries.id).notNull(),
  accountId: integer('account_id').references(() => chartOfAccounts.id).notNull(),
  description: text('description'),
  debitAmount: decimal('debit_amount', { precision: 15, scale: 2 }).default('0'),
  creditAmount: decimal('credit_amount', { precision: 15, scale: 2 }).default('0'),
  lineNumber: integer('line_number').notNull()
});

// Label Design and Print Management Tables
export const labelTemplates = pgTable('label_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // product, nutrition, barcode, custom
  dimensions: jsonb('dimensions'), // width, height, units
  layout: jsonb('layout'), // field positions, fonts, styles
  regulations: jsonb('regulations'), // compliance requirements
  isActive: boolean('is_active').default(true),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const printJobs = pgTable('print_jobs', {
  id: serial('id').primaryKey(),
  jobNumber: varchar('job_number', { length: 50 }).unique().notNull(),
  templateId: integer('template_id').references(() => labelTemplates.id),
  productId: integer('product_id').references(() => products.id),
  quantity: integer('quantity').notNull(),
  printerName: varchar('printer_name', { length: 100 }),
  status: varchar('status', { length: 20 }).default('queued'), // queued, printing, completed, failed
  printData: jsonb('print_data'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow()
});

// POS and Transaction Tables
export const posTerminals = pgTable('pos_terminals', {
  id: serial('id').primaryKey(),
  terminalId: varchar('terminal_id', { length: 50 }).unique().notNull(),
  location: varchar('location', { length: 100 }),
  status: varchar('status', { length: 20 }).default('active'), // active, inactive, maintenance
  lastSyncAt: timestamp('last_sync_at'),
  configuration: jsonb('configuration'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const posTransactions = pgTable('pos_transactions', {
  id: serial('id').primaryKey(),
  transactionId: varchar('transaction_id', { length: 50 }).unique().notNull(),
  terminalId: integer('terminal_id').references(() => posTerminals.id),
  customerId: integer('customer_id').references(() => customers.id),
  cashierId: integer('cashier_id').references(() => users.id),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  paymentMethod: varchar('payment_method', { length: 50 }),
  status: varchar('status', { length: 20 }).default('completed'), // pending, completed, voided, refunded
  transactionDate: timestamp('transaction_date').defaultNow(),
  receiptNumber: varchar('receipt_number', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow()
});

export const posTransactionItems = pgTable('pos_transaction_items', {
  id: serial('id').primaryKey(),
  transactionId: integer('transaction_id').references(() => posTransactions.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: decimal('quantity', { precision: 8, scale: 3 }),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }),
  lineTotal: decimal('line_total', { precision: 10, scale: 2 }),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
  lineNumber: integer('line_number').notNull()
});

// Loyalty Program Tables
export const loyaltyPrograms = pgTable('loyalty_programs', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // points, cashback, tier
  rules: jsonb('rules'), // earning and redemption rules
  isActive: boolean('is_active').default(true),
  startDate: date('start_date'),
  endDate: date('end_date'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const loyaltyPoints = pgTable('loyalty_points', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  programId: integer('program_id').references(() => loyaltyPrograms.id).notNull(),
  points: integer('points').notNull(),
  transactionType: varchar('transaction_type', { length: 20 }).notNull(), // earned, redeemed, expired
  referenceId: integer('reference_id'), // reference to order or transaction
  description: text('description'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow()
});

// Content Management Tables
export const contentItems = pgTable('content_items', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).unique(),
  type: varchar('type', { length: 50 }).notNull(), // article, page, banner, product_description
  content: text('content'),
  excerpt: text('excerpt'),
  status: varchar('status', { length: 20 }).default('draft'), // draft, published, archived
  publishedAt: timestamp('published_at'),
  metadata: jsonb('metadata'), // SEO, tags, categories
  authorId: integer('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const mediaAssets = pgTable('media_assets', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }),
  mimeType: varchar('mime_type', { length: 100 }),
  fileSize: integer('file_size'),
  dimensions: jsonb('dimensions'), // width, height for images
  url: text('url'),
  storageProvider: varchar('storage_provider', { length: 50 }).default('local'),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow()
});

// Relations for Employee Management
export const employeesRelations = relations(employees, ({ one, many }) => ({
  user: one(users, {
    fields: [employees.userId],
    references: [users.id]
  }),
  manager: one(users, {
    fields: [employees.managerId],
    references: [users.id]
  }),
  attendance: many(attendance),
  payroll: many(payroll)
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(employees, {
    fields: [attendance.employeeId],
    references: [employees.id]
  }),
  approvedBy: one(users, {
    fields: [attendance.approvedBy],
    references: [users.id]
  })
}));

export const payrollRelations = relations(payroll, ({ one }) => ({
  employee: one(employees, {
    fields: [payroll.employeeId],
    references: [employees.id]
  }),
  processedBy: one(users, {
    fields: [payroll.processedBy],
    references: [users.id]
  })
}));

// Relations for Accounting
export const chartOfAccountsRelations = relations(chartOfAccounts, ({ one, many }) => ({
  parentAccount: one(chartOfAccounts, {
    fields: [chartOfAccounts.parentAccountId],
    references: [chartOfAccounts.id]
  }),
  journalEntryLines: many(journalEntryLines)
}));

export const journalEntriesRelations = relations(journalEntries, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [journalEntries.createdBy],
    references: [users.id]
  }),
  approvedBy: one(users, {
    fields: [journalEntries.approvedBy],
    references: [users.id]
  }),
  journalEntryLines: many(journalEntryLines)
}));

export const journalEntryLinesRelations = relations(journalEntryLines, ({ one }) => ({
  journalEntry: one(journalEntries, {
    fields: [journalEntryLines.journalEntryId],
    references: [journalEntries.id]
  }),
  account: one(chartOfAccounts, {
    fields: [journalEntryLines.accountId],
    references: [chartOfAccounts.id]
  })
}));

// Relations for Label Design
export const labelTemplatesRelations = relations(labelTemplates, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [labelTemplates.createdBy],
    references: [users.id]
  }),
  printJobs: many(printJobs)
}));

export const printJobsRelations = relations(printJobs, ({ one }) => ({
  template: one(labelTemplates, {
    fields: [printJobs.templateId],
    references: [labelTemplates.id]
  }),
  product: one(products, {
    fields: [printJobs.productId],
    references: [products.id]
  }),
  createdBy: one(users, {
    fields: [printJobs.createdBy],
    references: [users.id]
  })
}));

// Relations for POS
export const posTransactionsRelations = relations(posTransactions, ({ one, many }) => ({
  terminal: one(posTerminals, {
    fields: [posTransactions.terminalId],
    references: [posTerminals.id]
  }),
  customer: one(customers, {
    fields: [posTransactions.customerId],
    references: [customers.id]
  }),
  cashier: one(users, {
    fields: [posTransactions.cashierId],
    references: [users.id]
  }),
  items: many(posTransactionItems)
}));

export const posTransactionItemsRelations = relations(posTransactionItems, ({ one }) => ({
  transaction: one(posTransactions, {
    fields: [posTransactionItems.transactionId],
    references: [posTransactions.id]
  }),
  product: one(products, {
    fields: [posTransactionItems.productId],
    references: [products.id]
  })
}));

// Relations for Loyalty
export const loyaltyProgramsRelations = relations(loyaltyPrograms, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [loyaltyPrograms.createdBy],
    references: [users.id]
  }),
  loyaltyPoints: many(loyaltyPoints)
}));

export const loyaltyPointsRelations = relations(loyaltyPoints, ({ one }) => ({
  customer: one(customers, {
    fields: [loyaltyPoints.customerId],
    references: [customers.id]
  }),
  program: one(loyaltyPrograms, {
    fields: [loyaltyPoints.programId],
    references: [loyaltyPrograms.id]
  })
}));

// Relations for Content Management
export const contentItemsRelations = relations(contentItems, ({ one }) => ({
  author: one(users, {
    fields: [contentItems.authorId],
    references: [users.id]
  })
}));

export const mediaAssetsRelations = relations(mediaAssets, ({ one }) => ({
  uploadedBy: one(users, {
    fields: [mediaAssets.uploadedBy],
    references: [users.id]
  })
}));

// Type exports for new tables
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = typeof attendance.$inferInsert;
export type Payroll = typeof payroll.$inferSelect;
export type InsertPayroll = typeof payroll.$inferInsert;

export type ChartOfAccounts = typeof chartOfAccounts.$inferSelect;
export type InsertChartOfAccounts = typeof chartOfAccounts.$inferInsert;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;
export type JournalEntryLine = typeof journalEntryLines.$inferSelect;
export type InsertJournalEntryLine = typeof journalEntryLines.$inferInsert;

export type LabelTemplate = typeof labelTemplates.$inferSelect;
export type InsertLabelTemplate = typeof labelTemplates.$inferInsert;
export type PrintJob = typeof printJobs.$inferSelect;
export type InsertPrintJob = typeof printJobs.$inferInsert;

export type PosTerminal = typeof posTerminals.$inferSelect;
export type InsertPosTerminal = typeof posTerminals.$inferInsert;
export type PosTransaction = typeof posTransactions.$inferSelect;
export type InsertPosTransaction = typeof posTransactions.$inferInsert;
export type PosTransactionItem = typeof posTransactionItems.$inferSelect;
export type InsertPosTransactionItem = typeof posTransactionItems.$inferInsert;

export type LoyaltyProgram = typeof loyaltyPrograms.$inferSelect;
export type InsertLoyaltyProgram = typeof loyaltyPrograms.$inferInsert;
export type LoyaltyPoint = typeof loyaltyPoints.$inferSelect;
export type InsertLoyaltyPoint = typeof loyaltyPoints.$inferInsert;

export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = typeof contentItems.$inferInsert;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type InsertMediaAsset = typeof mediaAssets.$inferInsert;

// ============================================
// COMPANY & BRAND MANAGEMENT SYSTEM
// ============================================

// Companies table - Single company system
export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  website: varchar('website', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  logoUrl: varchar('logo_url', { length: 500 }),
  primaryColor: varchar('primary_color', { length: 7 }).default('#6366f1'),
  secondaryColor: varchar('secondary_color', { length: 7 }).default('#8b5cf6'),
  accentColor: varchar('accent_color', { length: 7 }).default('#06b6d4'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Enhanced branches table - directly under company (no separate brands)
export const enhancedBranches = pgTable('enhanced_branches', {
  id: serial('id').primaryKey(),
  companyId: integer('company_id').notNull().references(() => companies.id),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  language: varchar('language', { length: 10 }).default('en'),
  phone: varchar('phone', { length: 50 }),
  whatsappNumber: varchar('whatsapp_number', { length: 50 }),
  email: varchar('email', { length: 255 }),
  managerName: varchar('manager_name', { length: 255 }),
  operatingHours: jsonb('operating_hours'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// User-Branch assignments for multi-branch access
export const userBranchAssignments = pgTable('user_branch_assignments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  branchId: integer('branch_id').notNull().references(() => enhancedBranches.id),
  roleInBranch: varchar('role_in_branch', { length: 50 }).notNull(),
  permissions: jsonb('permissions').default('[]'),
  assignedAt: timestamp('assigned_at').defaultNow(),
  assignedBy: integer('assigned_by').references(() => users.id),
  status: varchar('status', { length: 20 }).notNull().default('active'),
});

// Company Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  branches: many(enhancedBranches),
  userAssignments: many(userBranchAssignments)
}));

// Enhanced Branch Relations
export const enhancedBranchesRelations = relations(enhancedBranches, ({ one, many }) => ({
  company: one(companies, {
    fields: [enhancedBranches.companyId],
    references: [companies.id],
  }),
  userAssignments: many(userBranchAssignments),
}));

// User Branch Assignment Relations
export const userBranchAssignmentsRelations = relations(userBranchAssignments, ({ one }) => ({
  user: one(users, {
    fields: [userBranchAssignments.userId],
    references: [users.id],
  }),
  branch: one(enhancedBranches, {
    fields: [userBranchAssignments.branchId],
    references: [enhancedBranches.id],
  }),
  assignedByUser: one(users, {
    fields: [userBranchAssignments.assignedBy],
    references: [users.id],
  }),
}));

// Accounting Management Tables
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  description: varchar('description', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'income', 'expense', 'asset', 'liability'
  category: varchar('category', { length: 100 }),
  reference: varchar('reference', { length: 100 }),
  transactionDate: date('transaction_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  description: varchar('description', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // 'office_supplies', 'utilities', 'rent', etc.
  vendor: varchar('vendor', { length: 255 }),
  receiptNumber: varchar('receipt_number', { length: 100 }),
  expenseDate: date('expense_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Accounting Relations
export const transactionsRelations = relations(transactions, ({ one }) => ({}));
export const expensesRelations = relations(expenses, ({ one }) => ({}));

// Company & Branch Types
export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;
export type EnhancedBranch = typeof enhancedBranches.$inferSelect;
export type InsertEnhancedBranch = typeof enhancedBranches.$inferInsert;
export type UserBranchAssignment = typeof userBranchAssignments.$inferSelect;

// Accounting Types
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;
export type InsertUserBranchAssignment = typeof userBranchAssignments.$inferInsert;