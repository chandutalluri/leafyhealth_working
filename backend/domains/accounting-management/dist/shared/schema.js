"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customers = exports.notificationPreferencesRelations = exports.notificationsRelations = exports.notificationPreferences = exports.notificationTemplates = exports.notifications = exports.paymentAttemptsRelations = exports.refundsRelations = exports.paymentMethodsRelations = exports.paymentsRelations = exports.paymentAttempts = exports.refunds = exports.paymentMethods = exports.payments = exports.orderStatusHistoryRelations = exports.orderItemsRelations = exports.ordersRelations = exports.orderStatusHistory = exports.orderItems = exports.orders = exports.inventoryAdjustmentsRelations = exports.stockAlertsRelations = exports.inventoryTransactionsRelations = exports.inventoryAdjustments = exports.stockAlerts = exports.inventoryTransactions = exports.inventoryRelations = exports.cartItemsRelations = exports.productsRelations = exports.categoriesRelations = exports.cartItems = exports.inventory = exports.products = exports.categories = exports.locationLogsRelations = exports.branchProductsRelations = exports.branchesRelations = exports.locationLogs = exports.branchProducts = exports.branches = exports.auditLogsRelations = exports.userRolesRelations = exports.rolesRelations = exports.userSessionsRelations = exports.usersRelations = exports.auditLogs = exports.userRoles = exports.roles = exports.userSessions = exports.users = void 0;
exports.loyaltyProgramsRelations = exports.posTransactionItemsRelations = exports.posTransactionsRelations = exports.printJobsRelations = exports.labelTemplatesRelations = exports.journalEntryLinesRelations = exports.journalEntriesRelations = exports.chartOfAccountsRelations = exports.payrollRelations = exports.attendanceRelations = exports.employeesRelations = exports.mediaAssets = exports.contentItems = exports.loyaltyPoints = exports.loyaltyPrograms = exports.posTransactionItems = exports.posTransactions = exports.posTerminals = exports.printJobs = exports.labelTemplates = exports.journalEntryLines = exports.journalEntries = exports.chartOfAccounts = exports.payroll = exports.attendance = exports.employees = exports.vendorPayoutsRelations = exports.vendorProductsRelations = exports.vendorsRelations = exports.vendorPayouts = exports.vendorProducts = exports.vendors = exports.imageVariantsRelations = exports.imagesRelations = exports.imageVariants = exports.images = exports.routeShipmentsRelations = exports.deliveryRoutesRelations = exports.trackingEventsRelations = exports.shipmentsRelations = exports.carriers = exports.routeShipments = exports.deliveryRoutes = exports.trackingEvents = exports.shipments = exports.customerPreferencesRelations = exports.customerAddressesRelations = exports.customersRelations = exports.customerPreferences = exports.customerAddresses = void 0;
exports.expensesRelations = exports.transactionsRelations = exports.expenses = exports.transactions = exports.userBranchAssignmentsRelations = exports.enhancedBranchesRelations = exports.companiesRelations = exports.userBranchAssignments = exports.enhancedBranches = exports.companies = exports.mediaAssetsRelations = exports.contentItemsRelations = exports.loyaltyPointsRelations = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    username: (0, pg_core_1.varchar)('username', { length: 100 }).unique(),
    password: (0, pg_core_1.text)('password').notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    role: (0, pg_core_1.varchar)('role', { length: 50 }).default('user'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active'),
    assignedApp: (0, pg_core_1.varchar)('assigned_app', { length: 50 }),
    department: (0, pg_core_1.varchar)('department', { length: 100 }),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    emailVerified: (0, pg_core_1.boolean)('email_verified').default(false),
    lastLogin: (0, pg_core_1.timestamp)('last_login'),
    preferredBranchId: (0, pg_core_1.integer)('preferred_branch_id'),
    currentBranchId: (0, pg_core_1.integer)('current_branch_id'),
    lastKnownLatitude: (0, pg_core_1.decimal)('last_known_latitude', { precision: 10, scale: 8 }),
    lastKnownLongitude: (0, pg_core_1.decimal)('last_known_longitude', { precision: 11, scale: 8 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
    metadata: (0, pg_core_1.jsonb)('metadata')
});
exports.userSessions = (0, pg_core_1.pgTable)('user_sessions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id'),
    sessionToken: (0, pg_core_1.text)('session_token').notNull().unique(),
    refreshToken: (0, pg_core_1.text)('refresh_token').notNull().unique(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 45 }),
    userAgent: (0, pg_core_1.text)('user_agent'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.roles = (0, pg_core_1.pgTable)('roles', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 50 }).notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    permissions: (0, pg_core_1.jsonb)('permissions'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.userRoles = (0, pg_core_1.pgTable)('user_roles', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    roleId: (0, pg_core_1.integer)('role_id').references(() => exports.roles.id).notNull(),
    assignedBy: (0, pg_core_1.integer)('assigned_by').references(() => exports.users.id),
    assignedAt: (0, pg_core_1.timestamp)('assigned_at').defaultNow(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true)
});
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    action: (0, pg_core_1.varchar)('action', { length: 100 }).notNull(),
    resource: (0, pg_core_1.varchar)('resource', { length: 100 }),
    resourceId: (0, pg_core_1.varchar)('resource_id', { length: 100 }),
    details: (0, pg_core_1.jsonb)('details'),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 45 }),
    userAgent: (0, pg_core_1.text)('user_agent'),
    timestamp: (0, pg_core_1.timestamp)('timestamp').defaultNow()
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    sessions: many(exports.userSessions),
    roleAssignments: many(exports.userRoles),
    auditLogs: many(exports.auditLogs)
}));
exports.userSessionsRelations = (0, drizzle_orm_1.relations)(exports.userSessions, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.userSessions.userId],
        references: [exports.users.id]
    })
}));
exports.rolesRelations = (0, drizzle_orm_1.relations)(exports.roles, ({ many }) => ({
    userAssignments: many(exports.userRoles)
}));
exports.userRolesRelations = (0, drizzle_orm_1.relations)(exports.userRoles, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.userRoles.userId],
        references: [exports.users.id]
    }),
    role: one(exports.roles, {
        fields: [exports.userRoles.roleId],
        references: [exports.roles.id]
    }),
    assignedByUser: one(exports.users, {
        fields: [exports.userRoles.assignedBy],
        references: [exports.users.id]
    })
}));
exports.auditLogsRelations = (0, drizzle_orm_1.relations)(exports.auditLogs, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.auditLogs.userId],
        references: [exports.users.id]
    })
}));
exports.branches = (0, pg_core_1.pgTable)('branches', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    code: (0, pg_core_1.varchar)('code', { length: 50 }).unique().notNull(),
    address: (0, pg_core_1.text)('address').notNull(),
    latitude: (0, pg_core_1.decimal)('latitude', { precision: 10, scale: 8 }).notNull(),
    longitude: (0, pg_core_1.decimal)('longitude', { precision: 11, scale: 8 }).notNull(),
    servicePolygon: (0, pg_core_1.jsonb)('service_polygon').notNull(),
    contactPhone: (0, pg_core_1.varchar)('contact_phone', { length: 20 }),
    contactEmail: (0, pg_core_1.varchar)('contact_email', { length: 255 }),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    operatingHours: (0, pg_core_1.jsonb)('operating_hours'),
    deliveryRadius: (0, pg_core_1.integer)('delivery_radius').default(10),
    minimumOrderAmount: (0, pg_core_1.decimal)('minimum_order_amount', { precision: 10, scale: 2 }).default('0'),
    deliveryFee: (0, pg_core_1.decimal)('delivery_fee', { precision: 10, scale: 2 }).default('0'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.branchProducts = (0, pg_core_1.pgTable)('branch_products', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id).notNull(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    stockQuantity: (0, pg_core_1.integer)('stock_quantity').default(0),
    price: (0, pg_core_1.decimal)('price', { precision: 10, scale: 2 }).notNull(),
    discountedPrice: (0, pg_core_1.decimal)('discounted_price', { precision: 10, scale: 2 }),
    isAvailable: (0, pg_core_1.boolean)('is_available').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.locationLogs = (0, pg_core_1.pgTable)('location_logs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    sessionId: (0, pg_core_1.integer)('session_id').references(() => exports.userSessions.id),
    latitude: (0, pg_core_1.decimal)('latitude', { precision: 10, scale: 8 }),
    longitude: (0, pg_core_1.decimal)('longitude', { precision: 11, scale: 8 }),
    accuracy: (0, pg_core_1.integer)('accuracy'),
    detectionMethod: (0, pg_core_1.varchar)('detection_method', { length: 50 }),
    branchFound: (0, pg_core_1.integer)('branch_found').references(() => exports.branches.id),
    isServiceable: (0, pg_core_1.boolean)('is_serviceable').default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.branchesRelations = (0, drizzle_orm_1.relations)(exports.branches, ({ many }) => ({
    products: many(exports.branchProducts),
    users: many(exports.users),
    sessions: many(exports.userSessions),
    locationLogs: many(exports.locationLogs),
}));
exports.branchProductsRelations = (0, drizzle_orm_1.relations)(exports.branchProducts, ({ one }) => ({
    branch: one(exports.branches, {
        fields: [exports.branchProducts.branchId],
        references: [exports.branches.id],
    }),
    product: one(exports.products, {
        fields: [exports.branchProducts.productId],
        references: [exports.products.id],
    }),
}));
exports.locationLogsRelations = (0, drizzle_orm_1.relations)(exports.locationLogs, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.locationLogs.userId],
        references: [exports.users.id],
    }),
    session: one(exports.userSessions, {
        fields: [exports.locationLogs.sessionId],
        references: [exports.userSessions.id],
    }),
    branch: one(exports.branches, {
        fields: [exports.locationLogs.branchFound],
        references: [exports.branches.id],
    }),
}));
exports.categories = (0, pg_core_1.pgTable)('categories', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    parentId: (0, pg_core_1.integer)('parent_id').references(() => exports.categories.id),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    sortOrder: (0, pg_core_1.integer)('sort_order').default(0),
    imageUrl: (0, pg_core_1.varchar)('image_url', { length: 500 }),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.products = (0, pg_core_1.pgTable)('products', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    sku: (0, pg_core_1.varchar)('sku', { length: 100 }).unique().notNull(),
    barcode: (0, pg_core_1.varchar)('barcode', { length: 100 }),
    categoryId: (0, pg_core_1.integer)('category_id').references(() => exports.categories.id),
    price: (0, pg_core_1.varchar)('price', { length: 20 }).notNull(),
    costPrice: (0, pg_core_1.varchar)('cost_price', { length: 20 }),
    weight: (0, pg_core_1.varchar)('weight', { length: 20 }),
    unit: (0, pg_core_1.varchar)('unit', { length: 50 }).default('piece'),
    stockQuantity: (0, pg_core_1.integer)('stock_quantity').default(0),
    minStockLevel: (0, pg_core_1.integer)('min_stock_level').default(0),
    maxStockLevel: (0, pg_core_1.integer)('max_stock_level').default(1000),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    isFeatured: (0, pg_core_1.boolean)('is_featured').default(false),
    taxRate: (0, pg_core_1.varchar)('tax_rate', { length: 10 }).default('0'),
    expiryDate: (0, pg_core_1.timestamp)('expiry_date'),
    batchNumber: (0, pg_core_1.varchar)('batch_number', { length: 100 }),
    nutritionalInfo: (0, pg_core_1.jsonb)('nutritional_info'),
    allergens: (0, pg_core_1.jsonb)('allergens'),
    tags: (0, pg_core_1.jsonb)('tags'),
    images: (0, pg_core_1.jsonb)('images'),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.inventory = (0, pg_core_1.pgTable)('inventory', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    reservedQuantity: (0, pg_core_1.integer)('reserved_quantity').default(0),
    location: (0, pg_core_1.varchar)('location', { length: 100 }),
    batchNumber: (0, pg_core_1.varchar)('batch_number', { length: 100 }),
    expiryDate: (0, pg_core_1.timestamp)('expiry_date'),
    costPrice: (0, pg_core_1.varchar)('cost_price', { length: 20 }),
    lastUpdated: (0, pg_core_1.timestamp)('last_updated').defaultNow(),
    updatedBy: (0, pg_core_1.integer)('updated_by').references(() => exports.users.id)
});
exports.cartItems = (0, pg_core_1.pgTable)('cart_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    addedAt: (0, pg_core_1.timestamp)('added_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.categoriesRelations = (0, drizzle_orm_1.relations)(exports.categories, ({ one, many }) => ({
    parent: one(exports.categories, {
        fields: [exports.categories.parentId],
        references: [exports.categories.id]
    }),
    children: many(exports.categories),
    products: many(exports.products)
}));
exports.productsRelations = (0, drizzle_orm_1.relations)(exports.products, ({ one, many }) => ({
    category: one(exports.categories, {
        fields: [exports.products.categoryId],
        references: [exports.categories.id]
    }),
    createdByUser: one(exports.users, {
        fields: [exports.products.createdBy],
        references: [exports.users.id]
    }),
    inventory: many(exports.inventory),
    cartItems: many(exports.cartItems)
}));
exports.cartItemsRelations = (0, drizzle_orm_1.relations)(exports.cartItems, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.cartItems.userId],
        references: [exports.users.id]
    }),
    product: one(exports.products, {
        fields: [exports.cartItems.productId],
        references: [exports.products.id]
    }),
    branch: one(exports.branches, {
        fields: [exports.cartItems.branchId],
        references: [exports.branches.id]
    })
}));
exports.inventoryRelations = (0, drizzle_orm_1.relations)(exports.inventory, ({ one }) => ({
    product: one(exports.products, {
        fields: [exports.inventory.productId],
        references: [exports.products.id]
    }),
    updatedByUser: one(exports.users, {
        fields: [exports.inventory.updatedBy],
        references: [exports.users.id]
    })
}));
exports.inventoryTransactions = (0, pg_core_1.pgTable)('inventory_transactions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    productId: (0, pg_core_1.integer)('product_id').notNull().references(() => exports.products.id),
    transactionType: (0, pg_core_1.varchar)('transaction_type', { length: 50 }).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    unitCost: (0, pg_core_1.decimal)('unit_cost', { precision: 10, scale: 2 }),
    reference: (0, pg_core_1.varchar)('reference', { length: 255 }),
    notes: (0, pg_core_1.text)('notes'),
    performedBy: (0, pg_core_1.integer)('performed_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull()
});
exports.stockAlerts = (0, pg_core_1.pgTable)('stock_alerts', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    productId: (0, pg_core_1.integer)('product_id').notNull().references(() => exports.products.id),
    alertType: (0, pg_core_1.varchar)('alert_type', { length: 50 }).notNull(),
    threshold: (0, pg_core_1.integer)('threshold'),
    currentStock: (0, pg_core_1.integer)('current_stock'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    acknowledgedBy: (0, pg_core_1.integer)('acknowledged_by').references(() => exports.users.id),
    acknowledgedAt: (0, pg_core_1.timestamp)('acknowledged_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull()
});
exports.inventoryAdjustments = (0, pg_core_1.pgTable)('inventory_adjustments', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    productId: (0, pg_core_1.integer)('product_id').notNull().references(() => exports.products.id),
    oldQuantity: (0, pg_core_1.integer)('old_quantity').notNull(),
    newQuantity: (0, pg_core_1.integer)('new_quantity').notNull(),
    adjustmentReason: (0, pg_core_1.varchar)('adjustment_reason', { length: 100 }).notNull(),
    notes: (0, pg_core_1.text)('notes'),
    approvedBy: (0, pg_core_1.integer)('approved_by').references(() => exports.users.id),
    performedBy: (0, pg_core_1.integer)('performed_by').notNull().references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull()
});
exports.inventoryTransactionsRelations = (0, drizzle_orm_1.relations)(exports.inventoryTransactions, ({ one }) => ({
    product: one(exports.products, {
        fields: [exports.inventoryTransactions.productId],
        references: [exports.products.id]
    }),
    performer: one(exports.users, {
        fields: [exports.inventoryTransactions.performedBy],
        references: [exports.users.id]
    })
}));
exports.stockAlertsRelations = (0, drizzle_orm_1.relations)(exports.stockAlerts, ({ one }) => ({
    product: one(exports.products, {
        fields: [exports.stockAlerts.productId],
        references: [exports.products.id]
    }),
    acknowledgedByUser: one(exports.users, {
        fields: [exports.stockAlerts.acknowledgedBy],
        references: [exports.users.id]
    })
}));
exports.inventoryAdjustmentsRelations = (0, drizzle_orm_1.relations)(exports.inventoryAdjustments, ({ one }) => ({
    product: one(exports.products, {
        fields: [exports.inventoryAdjustments.productId],
        references: [exports.products.id]
    }),
    approver: one(exports.users, {
        fields: [exports.inventoryAdjustments.approvedBy],
        references: [exports.users.id]
    }),
    performer: one(exports.users, {
        fields: [exports.inventoryAdjustments.performedBy],
        references: [exports.users.id]
    })
}));
exports.orders = (0, pg_core_1.pgTable)('orders', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    orderNumber: (0, pg_core_1.varchar)('order_number', { length: 50 }).notNull().unique(),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.users.id),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    customerName: (0, pg_core_1.varchar)('customer_name', { length: 100 }),
    customerEmail: (0, pg_core_1.varchar)('customer_email', { length: 100 }),
    customerPhone: (0, pg_core_1.varchar)('customer_phone', { length: 20 }),
    orderStatus: (0, pg_core_1.varchar)('order_status', { length: 20 }).notNull().default('PENDING'),
    paymentStatus: (0, pg_core_1.varchar)('payment_status', { length: 20 }).notNull().default('PENDING'),
    orderType: (0, pg_core_1.varchar)('order_type', { length: 20 }).notNull().default('ONLINE'),
    totalAmount: (0, pg_core_1.decimal)('total_amount', { precision: 10, scale: 2 }).notNull(),
    discountAmount: (0, pg_core_1.decimal)('discount_amount', { precision: 10, scale: 2 }).default('0'),
    taxAmount: (0, pg_core_1.decimal)('tax_amount', { precision: 10, scale: 2 }).default('0'),
    shippingAmount: (0, pg_core_1.decimal)('shipping_amount', { precision: 10, scale: 2 }).default('0'),
    currency: (0, pg_core_1.varchar)('currency', { length: 3 }).default('INR').notNull(),
    stripePaymentIntentId: (0, pg_core_1.varchar)('stripe_payment_intent_id', { length: 255 }),
    orderDate: (0, pg_core_1.timestamp)('order_date').defaultNow().notNull(),
    requiredDate: (0, pg_core_1.timestamp)('required_date'),
    shippedDate: (0, pg_core_1.timestamp)('shipped_date'),
    deliveryDate: (0, pg_core_1.timestamp)('delivery_date'),
    shippingAddress: (0, pg_core_1.jsonb)('shipping_address'),
    billingAddress: (0, pg_core_1.jsonb)('billing_address'),
    specialInstructions: (0, pg_core_1.text)('special_instructions'),
    promoCode: (0, pg_core_1.varchar)('promo_code', { length: 50 }),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.orderItems = (0, pg_core_1.pgTable)('order_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    orderId: (0, pg_core_1.integer)('order_id').references(() => exports.orders.id).notNull(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    productName: (0, pg_core_1.varchar)('product_name', { length: 200 }).notNull(),
    productSku: (0, pg_core_1.varchar)('product_sku', { length: 100 }),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    unitPrice: (0, pg_core_1.varchar)('unit_price', { length: 20 }).notNull(),
    totalPrice: (0, pg_core_1.varchar)('total_price', { length: 20 }).notNull(),
    discountAmount: (0, pg_core_1.varchar)('discount_amount', { length: 20 }).default('0'),
    notes: (0, pg_core_1.text)('notes')
});
exports.orderStatusHistory = (0, pg_core_1.pgTable)('order_status_history', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    orderId: (0, pg_core_1.integer)('order_id').references(() => exports.orders.id).notNull(),
    previousStatus: (0, pg_core_1.varchar)('previous_status', { length: 20 }),
    newStatus: (0, pg_core_1.varchar)('new_status', { length: 20 }).notNull(),
    statusReason: (0, pg_core_1.varchar)('status_reason', { length: 200 }),
    changedBy: (0, pg_core_1.integer)('changed_by').references(() => exports.users.id),
    changedAt: (0, pg_core_1.timestamp)('changed_at').defaultNow().notNull()
});
exports.ordersRelations = (0, drizzle_orm_1.relations)(exports.orders, ({ one, many }) => ({
    customer: one(exports.users, {
        fields: [exports.orders.customerId],
        references: [exports.users.id]
    }),
    createdByUser: one(exports.users, {
        fields: [exports.orders.createdBy],
        references: [exports.users.id]
    }),
    orderItems: many(exports.orderItems),
    statusHistory: many(exports.orderStatusHistory)
}));
exports.orderItemsRelations = (0, drizzle_orm_1.relations)(exports.orderItems, ({ one }) => ({
    order: one(exports.orders, {
        fields: [exports.orderItems.orderId],
        references: [exports.orders.id]
    }),
    product: one(exports.products, {
        fields: [exports.orderItems.productId],
        references: [exports.products.id]
    })
}));
exports.orderStatusHistoryRelations = (0, drizzle_orm_1.relations)(exports.orderStatusHistory, ({ one }) => ({
    order: one(exports.orders, {
        fields: [exports.orderStatusHistory.orderId],
        references: [exports.orders.id]
    }),
    changedByUser: one(exports.users, {
        fields: [exports.orderStatusHistory.changedBy],
        references: [exports.users.id]
    })
}));
exports.payments = (0, pg_core_1.pgTable)('payments', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    orderId: (0, pg_core_1.integer)('order_id').references(() => exports.orders.id),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.users.id),
    amount: (0, pg_core_1.decimal)('amount', { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)('currency', { length: 3 }).default('INR'),
    paymentMethod: (0, pg_core_1.varchar)('payment_method', { length: 50 }).notNull(),
    paymentStatus: (0, pg_core_1.varchar)('payment_status', { length: 20 }).default('pending'),
    transactionId: (0, pg_core_1.varchar)('transaction_id', { length: 100 }),
    gatewayReference: (0, pg_core_1.varchar)('gateway_reference', { length: 100 }),
    gatewayResponse: (0, pg_core_1.text)('gateway_response'),
    processedAt: (0, pg_core_1.timestamp)('processed_at'),
    failureReason: (0, pg_core_1.text)('failure_reason'),
    metadata: (0, pg_core_1.text)('metadata'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    updatedBy: (0, pg_core_1.integer)('updated_by').references(() => exports.users.id)
});
exports.paymentMethods = (0, pg_core_1.pgTable)('payment_methods', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.users.id),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    provider: (0, pg_core_1.varchar)('provider', { length: 50 }).notNull(),
    externalId: (0, pg_core_1.varchar)('external_id', { length: 100 }).notNull(),
    isDefault: (0, pg_core_1.boolean)('is_default').default(false),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    lastFour: (0, pg_core_1.varchar)('last_four', { length: 4 }),
    expiryMonth: (0, pg_core_1.integer)('expiry_month'),
    expiryYear: (0, pg_core_1.integer)('expiry_year'),
    cardBrand: (0, pg_core_1.varchar)('card_brand', { length: 20 }),
    billingAddress: (0, pg_core_1.text)('billing_address'),
    metadata: (0, pg_core_1.text)('metadata'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.refunds = (0, pg_core_1.pgTable)('refunds', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    paymentId: (0, pg_core_1.integer)('payment_id').references(() => exports.payments.id),
    amount: (0, pg_core_1.decimal)('amount', { precision: 10, scale: 2 }).notNull(),
    reason: (0, pg_core_1.varchar)('reason', { length: 100 }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending'),
    gatewayRefundId: (0, pg_core_1.varchar)('gateway_refund_id', { length: 100 }),
    processedAt: (0, pg_core_1.timestamp)('processed_at'),
    failureReason: (0, pg_core_1.text)('failure_reason'),
    metadata: (0, pg_core_1.text)('metadata'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    updatedBy: (0, pg_core_1.integer)('updated_by').references(() => exports.users.id)
});
exports.paymentAttempts = (0, pg_core_1.pgTable)('payment_attempts', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    paymentId: (0, pg_core_1.integer)('payment_id').references(() => exports.payments.id),
    attemptNumber: (0, pg_core_1.integer)('attempt_number').notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull(),
    gatewayResponse: (0, pg_core_1.text)('gateway_response'),
    errorCode: (0, pg_core_1.varchar)('error_code', { length: 50 }),
    errorMessage: (0, pg_core_1.text)('error_message'),
    processingTime: (0, pg_core_1.integer)('processing_time'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.paymentsRelations = (0, drizzle_orm_1.relations)(exports.payments, ({ one, many }) => ({
    order: one(exports.orders, { fields: [exports.payments.orderId], references: [exports.orders.id] }),
    customer: one(exports.users, { fields: [exports.payments.customerId], references: [exports.users.id] }),
    createdByUser: one(exports.users, { fields: [exports.payments.createdBy], references: [exports.users.id] }),
    updatedByUser: one(exports.users, { fields: [exports.payments.updatedBy], references: [exports.users.id] }),
    refunds: many(exports.refunds),
    attempts: many(exports.paymentAttempts)
}));
exports.paymentMethodsRelations = (0, drizzle_orm_1.relations)(exports.paymentMethods, ({ one }) => ({
    customer: one(exports.users, { fields: [exports.paymentMethods.customerId], references: [exports.users.id] })
}));
exports.refundsRelations = (0, drizzle_orm_1.relations)(exports.refunds, ({ one }) => ({
    payment: one(exports.payments, { fields: [exports.refunds.paymentId], references: [exports.payments.id] }),
    createdByUser: one(exports.users, { fields: [exports.refunds.createdBy], references: [exports.users.id] }),
    updatedByUser: one(exports.users, { fields: [exports.refunds.updatedBy], references: [exports.users.id] })
}));
exports.paymentAttemptsRelations = (0, drizzle_orm_1.relations)(exports.paymentAttempts, ({ one }) => ({
    payment: one(exports.payments, { fields: [exports.paymentAttempts.paymentId], references: [exports.payments.id] })
}));
exports.notifications = (0, pg_core_1.pgTable)('notifications', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    channel: (0, pg_core_1.varchar)('channel', { length: 50 }).notNull(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    data: (0, pg_core_1.jsonb)('data'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull().default('pending'),
    priority: (0, pg_core_1.varchar)('priority', { length: 20 }).notNull().default('normal'),
    scheduledAt: (0, pg_core_1.timestamp)('scheduled_at'),
    sentAt: (0, pg_core_1.timestamp)('sent_at'),
    readAt: (0, pg_core_1.timestamp)('read_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull()
});
exports.notificationTemplates = (0, pg_core_1.pgTable)('notification_templates', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull().unique(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    channel: (0, pg_core_1.varchar)('channel', { length: 50 }).notNull(),
    subject: (0, pg_core_1.varchar)('subject', { length: 255 }),
    template: (0, pg_core_1.text)('template').notNull(),
    variables: (0, pg_core_1.jsonb)('variables'),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull()
});
exports.notificationPreferences = (0, pg_core_1.pgTable)('notification_preferences', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    channel: (0, pg_core_1.varchar)('channel', { length: 50 }).notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    enabled: (0, pg_core_1.boolean)('enabled').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull()
});
exports.notificationsRelations = (0, drizzle_orm_1.relations)(exports.notifications, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.notifications.userId],
        references: [exports.users.id]
    })
}));
exports.notificationPreferencesRelations = (0, drizzle_orm_1.relations)(exports.notificationPreferences, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.notificationPreferences.userId],
        references: [exports.users.id]
    })
}));
exports.customers = (0, pg_core_1.pgTable)('customers', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }).notNull(),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    dateOfBirth: (0, pg_core_1.timestamp)('date_of_birth'),
    gender: (0, pg_core_1.varchar)('gender', { length: 10 }),
    profilePicture: (0, pg_core_1.text)('profile_picture'),
    preferredLanguage: (0, pg_core_1.varchar)('preferred_language', { length: 10 }).default('en'),
    timezone: (0, pg_core_1.varchar)('timezone', { length: 50 }).default('UTC'),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull()
});
exports.customerAddresses = (0, pg_core_1.pgTable)('customer_addresses', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).default('home').notNull(),
    addressLine1: (0, pg_core_1.varchar)('address_line1', { length: 255 }).notNull(),
    addressLine2: (0, pg_core_1.varchar)('address_line2', { length: 255 }),
    city: (0, pg_core_1.varchar)('city', { length: 100 }).notNull(),
    state: (0, pg_core_1.varchar)('state', { length: 100 }).notNull(),
    pincode: (0, pg_core_1.varchar)('pincode', { length: 10 }).notNull(),
    landmark: (0, pg_core_1.varchar)('landmark', { length: 255 }),
    latitude: (0, pg_core_1.decimal)('latitude', { precision: 10, scale: 8 }),
    longitude: (0, pg_core_1.decimal)('longitude', { precision: 11, scale: 8 }),
    isDefault: (0, pg_core_1.boolean)('is_default').default(false),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.customerPreferences = (0, pg_core_1.pgTable)('customer_preferences', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.customers.id).notNull(),
    category: (0, pg_core_1.varchar)('category', { length: 50 }).notNull(),
    key: (0, pg_core_1.varchar)('key', { length: 100 }).notNull(),
    value: (0, pg_core_1.text)('value').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull()
});
exports.customersRelations = (0, drizzle_orm_1.relations)(exports.customers, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.customers.userId],
        references: [exports.users.id]
    }),
    addresses: many(exports.customerAddresses),
    preferences: many(exports.customerPreferences)
}));
exports.customerAddressesRelations = (0, drizzle_orm_1.relations)(exports.customerAddresses, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.customerAddresses.userId],
        references: [exports.users.id]
    })
}));
exports.customerPreferencesRelations = (0, drizzle_orm_1.relations)(exports.customerPreferences, ({ one }) => ({
    customer: one(exports.customers, {
        fields: [exports.customerPreferences.customerId],
        references: [exports.customers.id]
    })
}));
exports.shipments = (0, pg_core_1.pgTable)('shipments', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    orderId: (0, pg_core_1.integer)('order_id').references(() => exports.orders.id),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.customers.id),
    trackingNumber: (0, pg_core_1.varchar)('tracking_number', { length: 100 }).unique(),
    carrier: (0, pg_core_1.varchar)('carrier', { length: 50 }),
    shippingMethod: (0, pg_core_1.varchar)('shipping_method', { length: 50 }),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('pending'),
    estimatedDeliveryDate: (0, pg_core_1.timestamp)('estimated_delivery_date'),
    actualDeliveryDate: (0, pg_core_1.timestamp)('actual_delivery_date'),
    shippingAddress: (0, pg_core_1.text)('shipping_address'),
    shippingCost: (0, pg_core_1.decimal)('shipping_cost', { precision: 10, scale: 2 }),
    weight: (0, pg_core_1.decimal)('weight', { precision: 8, scale: 2 }),
    dimensions: (0, pg_core_1.varchar)('dimensions', { length: 100 }),
    notes: (0, pg_core_1.text)('notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.trackingEvents = (0, pg_core_1.pgTable)('tracking_events', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    shipmentId: (0, pg_core_1.integer)('shipment_id').references(() => exports.shipments.id),
    status: (0, pg_core_1.varchar)('status', { length: 50 }),
    location: (0, pg_core_1.varchar)('location', { length: 200 }),
    description: (0, pg_core_1.text)('description'),
    timestamp: (0, pg_core_1.timestamp)('timestamp'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.deliveryRoutes = (0, pg_core_1.pgTable)('delivery_routes', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    routeName: (0, pg_core_1.varchar)('route_name', { length: 100 }),
    driverId: (0, pg_core_1.integer)('driver_id'),
    vehicleId: (0, pg_core_1.varchar)('vehicle_id', { length: 50 }),
    startLocation: (0, pg_core_1.varchar)('start_location', { length: 200 }),
    endLocation: (0, pg_core_1.varchar)('end_location', { length: 200 }),
    estimatedDuration: (0, pg_core_1.integer)('estimated_duration'),
    actualDuration: (0, pg_core_1.integer)('actual_duration'),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('planned'),
    date: (0, pg_core_1.varchar)('date', { length: 20 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.routeShipments = (0, pg_core_1.pgTable)('route_shipments', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    routeId: (0, pg_core_1.integer)('route_id').references(() => exports.deliveryRoutes.id),
    shipmentId: (0, pg_core_1.integer)('shipment_id').references(() => exports.shipments.id),
    deliveryOrder: (0, pg_core_1.integer)('delivery_order'),
    estimatedDeliveryTime: (0, pg_core_1.timestamp)('estimated_delivery_time'),
    actualDeliveryTime: (0, pg_core_1.timestamp)('actual_delivery_time'),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('pending'),
    notes: (0, pg_core_1.text)('notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.carriers = (0, pg_core_1.pgTable)('carriers', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }),
    code: (0, pg_core_1.varchar)('code', { length: 20 }).unique(),
    apiEndpoint: (0, pg_core_1.varchar)('api_endpoint', { length: 255 }),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    supportedServices: (0, pg_core_1.text)('supported_services'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.shipmentsRelations = (0, drizzle_orm_1.relations)(exports.shipments, ({ one, many }) => ({
    order: one(exports.orders, {
        fields: [exports.shipments.orderId],
        references: [exports.orders.id]
    }),
    customer: one(exports.customers, {
        fields: [exports.shipments.customerId],
        references: [exports.customers.id]
    }),
    trackingEvents: many(exports.trackingEvents),
    routeShipments: many(exports.routeShipments)
}));
exports.trackingEventsRelations = (0, drizzle_orm_1.relations)(exports.trackingEvents, ({ one }) => ({
    shipment: one(exports.shipments, {
        fields: [exports.trackingEvents.shipmentId],
        references: [exports.shipments.id]
    })
}));
exports.deliveryRoutesRelations = (0, drizzle_orm_1.relations)(exports.deliveryRoutes, ({ many }) => ({
    routeShipments: many(exports.routeShipments)
}));
exports.routeShipmentsRelations = (0, drizzle_orm_1.relations)(exports.routeShipments, ({ one }) => ({
    route: one(exports.deliveryRoutes, {
        fields: [exports.routeShipments.routeId],
        references: [exports.deliveryRoutes.id]
    }),
    shipment: one(exports.shipments, {
        fields: [exports.routeShipments.shipmentId],
        references: [exports.shipments.id]
    })
}));
exports.images = (0, pg_core_1.pgTable)('images', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    filename: (0, pg_core_1.varchar)('filename', { length: 255 }).notNull(),
    originalName: (0, pg_core_1.varchar)('original_name', { length: 255 }).notNull(),
    mimeType: (0, pg_core_1.varchar)('mime_type', { length: 100 }).notNull(),
    size: (0, pg_core_1.integer)('size').notNull(),
    width: (0, pg_core_1.integer)('width'),
    height: (0, pg_core_1.integer)('height'),
    path: (0, pg_core_1.varchar)('path', { length: 500 }).notNull(),
    url: (0, pg_core_1.varchar)('url', { length: 500 }).notNull(),
    thumbnailUrl: (0, pg_core_1.varchar)('thumbnail_url', { length: 500 }),
    altText: (0, pg_core_1.varchar)('alt_text', { length: 255 }),
    title: (0, pg_core_1.varchar)('title', { length: 255 }),
    category: (0, pg_core_1.varchar)('category', { length: 50 }).default('general'),
    entityType: (0, pg_core_1.varchar)('entity_type', { length: 50 }),
    entityId: (0, pg_core_1.integer)('entity_id'),
    variants: (0, pg_core_1.jsonb)('variants'),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    uploadedBy: (0, pg_core_1.integer)('uploaded_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull()
});
exports.imageVariants = (0, pg_core_1.pgTable)('image_variants', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    imageId: (0, pg_core_1.integer)('image_id').references(() => exports.images.id).notNull(),
    variant: (0, pg_core_1.varchar)('variant', { length: 50 }).notNull(),
    width: (0, pg_core_1.integer)('width'),
    height: (0, pg_core_1.integer)('height'),
    size: (0, pg_core_1.integer)('size').notNull(),
    path: (0, pg_core_1.varchar)('path', { length: 500 }).notNull(),
    url: (0, pg_core_1.varchar)('url', { length: 500 }).notNull(),
    format: (0, pg_core_1.varchar)('format', { length: 20 }).notNull(),
    quality: (0, pg_core_1.integer)('quality').default(85),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull()
});
exports.imagesRelations = (0, drizzle_orm_1.relations)(exports.images, ({ one, many }) => ({
    uploadedByUser: one(exports.users, {
        fields: [exports.images.uploadedBy],
        references: [exports.users.id]
    }),
    variants: many(exports.imageVariants)
}));
exports.imageVariantsRelations = (0, drizzle_orm_1.relations)(exports.imageVariants, ({ one }) => ({
    image: one(exports.images, {
        fields: [exports.imageVariants.imageId],
        references: [exports.images.id]
    })
}));
exports.vendors = (0, pg_core_1.pgTable)('vendors', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    businessName: (0, pg_core_1.varchar)('business_name', { length: 255 }).notNull(),
    contactEmail: (0, pg_core_1.varchar)('contact_email', { length: 255 }).notNull().unique(),
    contactPhone: (0, pg_core_1.varchar)('contact_phone', { length: 50 }),
    businessAddress: (0, pg_core_1.text)('business_address'),
    licenseNumber: (0, pg_core_1.varchar)('license_number', { length: 100 }),
    taxId: (0, pg_core_1.varchar)('tax_id', { length: 100 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    website: (0, pg_core_1.varchar)('website', { length: 255 }),
    categories: (0, pg_core_1.text)('categories'),
    commissionRate: (0, pg_core_1.decimal)('commission_rate', { precision: 5, scale: 2 }).notNull(),
    isVerified: (0, pg_core_1.boolean)('is_verified').default(false),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    verifiedAt: (0, pg_core_1.timestamp)('verified_at'),
    verifiedBy: (0, pg_core_1.integer)('verified_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    updatedBy: (0, pg_core_1.integer)('updated_by').references(() => exports.users.id)
});
exports.vendorProducts = (0, pg_core_1.pgTable)('vendor_products', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    vendorId: (0, pg_core_1.integer)('vendor_id').references(() => exports.vendors.id),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id),
    vendorSku: (0, pg_core_1.varchar)('vendor_sku', { length: 100 }),
    vendorPrice: (0, pg_core_1.decimal)('vendor_price', { precision: 10, scale: 2 }).notNull(),
    commission: (0, pg_core_1.decimal)('commission', { precision: 10, scale: 2 }),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.vendorPayouts = (0, pg_core_1.pgTable)('vendor_payouts', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    vendorId: (0, pg_core_1.integer)('vendor_id').references(() => exports.vendors.id),
    amount: (0, pg_core_1.decimal)('amount', { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)('currency', { length: 3 }).default('INR'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending'),
    paymentMethod: (0, pg_core_1.varchar)('payment_method', { length: 50 }),
    transactionId: (0, pg_core_1.varchar)('transaction_id', { length: 100 }),
    periodStart: (0, pg_core_1.timestamp)('period_start'),
    periodEnd: (0, pg_core_1.timestamp)('period_end'),
    processedAt: (0, pg_core_1.timestamp)('processed_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id)
});
exports.vendorsRelations = (0, drizzle_orm_1.relations)(exports.vendors, ({ one, many }) => ({
    verifiedByUser: one(exports.users, {
        fields: [exports.vendors.verifiedBy],
        references: [exports.users.id]
    }),
    createdByUser: one(exports.users, {
        fields: [exports.vendors.createdBy],
        references: [exports.users.id]
    }),
    vendorProducts: many(exports.vendorProducts),
    vendorPayouts: many(exports.vendorPayouts)
}));
exports.vendorProductsRelations = (0, drizzle_orm_1.relations)(exports.vendorProducts, ({ one }) => ({
    vendor: one(exports.vendors, {
        fields: [exports.vendorProducts.vendorId],
        references: [exports.vendors.id]
    }),
    product: one(exports.products, {
        fields: [exports.vendorProducts.productId],
        references: [exports.products.id]
    })
}));
exports.vendorPayoutsRelations = (0, drizzle_orm_1.relations)(exports.vendorPayouts, ({ one }) => ({
    vendor: one(exports.vendors, {
        fields: [exports.vendorPayouts.vendorId],
        references: [exports.vendors.id]
    }),
    createdByUser: one(exports.users, {
        fields: [exports.vendorPayouts.createdBy],
        references: [exports.users.id]
    })
}));
exports.employees = (0, pg_core_1.pgTable)('employees', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    employeeId: (0, pg_core_1.varchar)('employee_id', { length: 50 }).unique().notNull(),
    department: (0, pg_core_1.varchar)('department', { length: 100 }),
    position: (0, pg_core_1.varchar)('position', { length: 100 }),
    salary: (0, pg_core_1.decimal)('salary', { precision: 10, scale: 2 }),
    hourlyRate: (0, pg_core_1.decimal)('hourly_rate', { precision: 8, scale: 2 }),
    hireDate: (0, pg_core_1.date)('hire_date'),
    terminationDate: (0, pg_core_1.date)('termination_date'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active'),
    managerId: (0, pg_core_1.integer)('manager_id').references(() => exports.users.id),
    workLocation: (0, pg_core_1.varchar)('work_location', { length: 100 }),
    emergencyContact: (0, pg_core_1.jsonb)('emergency_contact'),
    benefits: (0, pg_core_1.jsonb)('benefits'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.attendance = (0, pg_core_1.pgTable)('attendance', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    employeeId: (0, pg_core_1.integer)('employee_id').references(() => exports.employees.id).notNull(),
    date: (0, pg_core_1.date)('date').notNull(),
    clockIn: (0, pg_core_1.timestamp)('clock_in'),
    clockOut: (0, pg_core_1.timestamp)('clock_out'),
    breakStart: (0, pg_core_1.timestamp)('break_start'),
    breakEnd: (0, pg_core_1.timestamp)('break_end'),
    totalHours: (0, pg_core_1.decimal)('total_hours', { precision: 4, scale: 2 }),
    overtimeHours: (0, pg_core_1.decimal)('overtime_hours', { precision: 4, scale: 2 }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('present'),
    notes: (0, pg_core_1.text)('notes'),
    approvedBy: (0, pg_core_1.integer)('approved_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.payroll = (0, pg_core_1.pgTable)('payroll', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    employeeId: (0, pg_core_1.integer)('employee_id').references(() => exports.employees.id).notNull(),
    payPeriodStart: (0, pg_core_1.date)('pay_period_start').notNull(),
    payPeriodEnd: (0, pg_core_1.date)('pay_period_end').notNull(),
    regularHours: (0, pg_core_1.decimal)('regular_hours', { precision: 6, scale: 2 }),
    overtimeHours: (0, pg_core_1.decimal)('overtime_hours', { precision: 6, scale: 2 }),
    grossPay: (0, pg_core_1.decimal)('gross_pay', { precision: 10, scale: 2 }),
    deductions: (0, pg_core_1.jsonb)('deductions'),
    taxes: (0, pg_core_1.jsonb)('taxes'),
    netPay: (0, pg_core_1.decimal)('net_pay', { precision: 10, scale: 2 }),
    payDate: (0, pg_core_1.date)('pay_date'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending'),
    processedBy: (0, pg_core_1.integer)('processed_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.chartOfAccounts = (0, pg_core_1.pgTable)('chart_of_accounts', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    accountCode: (0, pg_core_1.varchar)('account_code', { length: 20 }).unique().notNull(),
    accountName: (0, pg_core_1.varchar)('account_name', { length: 100 }).notNull(),
    accountType: (0, pg_core_1.varchar)('account_type', { length: 50 }).notNull(),
    parentAccountId: (0, pg_core_1.integer)('parent_account_id').references(() => exports.chartOfAccounts.id),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    description: (0, pg_core_1.text)('description'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.journalEntries = (0, pg_core_1.pgTable)('journal_entries', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    entryNumber: (0, pg_core_1.varchar)('entry_number', { length: 50 }).unique().notNull(),
    date: (0, pg_core_1.date)('date').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    reference: (0, pg_core_1.varchar)('reference', { length: 100 }),
    totalDebit: (0, pg_core_1.decimal)('total_debit', { precision: 15, scale: 2 }),
    totalCredit: (0, pg_core_1.decimal)('total_credit', { precision: 15, scale: 2 }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending'),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    approvedBy: (0, pg_core_1.integer)('approved_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.journalEntryLines = (0, pg_core_1.pgTable)('journal_entry_lines', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    journalEntryId: (0, pg_core_1.integer)('journal_entry_id').references(() => exports.journalEntries.id).notNull(),
    accountId: (0, pg_core_1.integer)('account_id').references(() => exports.chartOfAccounts.id).notNull(),
    description: (0, pg_core_1.text)('description'),
    debitAmount: (0, pg_core_1.decimal)('debit_amount', { precision: 15, scale: 2 }).default('0'),
    creditAmount: (0, pg_core_1.decimal)('credit_amount', { precision: 15, scale: 2 }).default('0'),
    lineNumber: (0, pg_core_1.integer)('line_number').notNull()
});
exports.labelTemplates = (0, pg_core_1.pgTable)('label_templates', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    dimensions: (0, pg_core_1.jsonb)('dimensions'),
    layout: (0, pg_core_1.jsonb)('layout'),
    regulations: (0, pg_core_1.jsonb)('regulations'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.printJobs = (0, pg_core_1.pgTable)('print_jobs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    jobNumber: (0, pg_core_1.varchar)('job_number', { length: 50 }).unique().notNull(),
    templateId: (0, pg_core_1.integer)('template_id').references(() => exports.labelTemplates.id),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    printerName: (0, pg_core_1.varchar)('printer_name', { length: 100 }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('queued'),
    printData: (0, pg_core_1.jsonb)('print_data'),
    startedAt: (0, pg_core_1.timestamp)('started_at'),
    completedAt: (0, pg_core_1.timestamp)('completed_at'),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.posTerminals = (0, pg_core_1.pgTable)('pos_terminals', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    terminalId: (0, pg_core_1.varchar)('terminal_id', { length: 50 }).unique().notNull(),
    location: (0, pg_core_1.varchar)('location', { length: 100 }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active'),
    lastSyncAt: (0, pg_core_1.timestamp)('last_sync_at'),
    configuration: (0, pg_core_1.jsonb)('configuration'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.posTransactions = (0, pg_core_1.pgTable)('pos_transactions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    transactionId: (0, pg_core_1.varchar)('transaction_id', { length: 50 }).unique().notNull(),
    terminalId: (0, pg_core_1.integer)('terminal_id').references(() => exports.posTerminals.id),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.customers.id),
    cashierId: (0, pg_core_1.integer)('cashier_id').references(() => exports.users.id),
    subtotal: (0, pg_core_1.decimal)('subtotal', { precision: 10, scale: 2 }),
    taxAmount: (0, pg_core_1.decimal)('tax_amount', { precision: 10, scale: 2 }),
    discountAmount: (0, pg_core_1.decimal)('discount_amount', { precision: 10, scale: 2 }),
    totalAmount: (0, pg_core_1.decimal)('total_amount', { precision: 10, scale: 2 }),
    paymentMethod: (0, pg_core_1.varchar)('payment_method', { length: 50 }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('completed'),
    transactionDate: (0, pg_core_1.timestamp)('transaction_date').defaultNow(),
    receiptNumber: (0, pg_core_1.varchar)('receipt_number', { length: 50 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.posTransactionItems = (0, pg_core_1.pgTable)('pos_transaction_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    transactionId: (0, pg_core_1.integer)('transaction_id').references(() => exports.posTransactions.id).notNull(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    quantity: (0, pg_core_1.decimal)('quantity', { precision: 8, scale: 3 }),
    unitPrice: (0, pg_core_1.decimal)('unit_price', { precision: 10, scale: 2 }),
    lineTotal: (0, pg_core_1.decimal)('line_total', { precision: 10, scale: 2 }),
    discountAmount: (0, pg_core_1.decimal)('discount_amount', { precision: 10, scale: 2 }).default('0'),
    lineNumber: (0, pg_core_1.integer)('line_number').notNull()
});
exports.loyaltyPrograms = (0, pg_core_1.pgTable)('loyalty_programs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    rules: (0, pg_core_1.jsonb)('rules'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    startDate: (0, pg_core_1.date)('start_date'),
    endDate: (0, pg_core_1.date)('end_date'),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.loyaltyPoints = (0, pg_core_1.pgTable)('loyalty_points', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.customers.id).notNull(),
    programId: (0, pg_core_1.integer)('program_id').references(() => exports.loyaltyPrograms.id).notNull(),
    points: (0, pg_core_1.integer)('points').notNull(),
    transactionType: (0, pg_core_1.varchar)('transaction_type', { length: 20 }).notNull(),
    referenceId: (0, pg_core_1.integer)('reference_id'),
    description: (0, pg_core_1.text)('description'),
    expiresAt: (0, pg_core_1.timestamp)('expires_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.contentItems = (0, pg_core_1.pgTable)('content_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.varchar)('title', { length: 200 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 200 }).unique(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    content: (0, pg_core_1.text)('content'),
    excerpt: (0, pg_core_1.text)('excerpt'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('draft'),
    publishedAt: (0, pg_core_1.timestamp)('published_at'),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    authorId: (0, pg_core_1.integer)('author_id').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.mediaAssets = (0, pg_core_1.pgTable)('media_assets', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    filename: (0, pg_core_1.varchar)('filename', { length: 255 }).notNull(),
    originalName: (0, pg_core_1.varchar)('original_name', { length: 255 }),
    mimeType: (0, pg_core_1.varchar)('mime_type', { length: 100 }),
    fileSize: (0, pg_core_1.integer)('file_size'),
    dimensions: (0, pg_core_1.jsonb)('dimensions'),
    url: (0, pg_core_1.text)('url'),
    storageProvider: (0, pg_core_1.varchar)('storage_provider', { length: 50 }).default('local'),
    uploadedBy: (0, pg_core_1.integer)('uploaded_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.employeesRelations = (0, drizzle_orm_1.relations)(exports.employees, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.employees.userId],
        references: [exports.users.id]
    }),
    manager: one(exports.users, {
        fields: [exports.employees.managerId],
        references: [exports.users.id]
    }),
    attendance: many(exports.attendance),
    payroll: many(exports.payroll)
}));
exports.attendanceRelations = (0, drizzle_orm_1.relations)(exports.attendance, ({ one }) => ({
    employee: one(exports.employees, {
        fields: [exports.attendance.employeeId],
        references: [exports.employees.id]
    }),
    approvedBy: one(exports.users, {
        fields: [exports.attendance.approvedBy],
        references: [exports.users.id]
    })
}));
exports.payrollRelations = (0, drizzle_orm_1.relations)(exports.payroll, ({ one }) => ({
    employee: one(exports.employees, {
        fields: [exports.payroll.employeeId],
        references: [exports.employees.id]
    }),
    processedBy: one(exports.users, {
        fields: [exports.payroll.processedBy],
        references: [exports.users.id]
    })
}));
exports.chartOfAccountsRelations = (0, drizzle_orm_1.relations)(exports.chartOfAccounts, ({ one, many }) => ({
    parentAccount: one(exports.chartOfAccounts, {
        fields: [exports.chartOfAccounts.parentAccountId],
        references: [exports.chartOfAccounts.id]
    }),
    journalEntryLines: many(exports.journalEntryLines)
}));
exports.journalEntriesRelations = (0, drizzle_orm_1.relations)(exports.journalEntries, ({ one, many }) => ({
    createdBy: one(exports.users, {
        fields: [exports.journalEntries.createdBy],
        references: [exports.users.id]
    }),
    approvedBy: one(exports.users, {
        fields: [exports.journalEntries.approvedBy],
        references: [exports.users.id]
    }),
    journalEntryLines: many(exports.journalEntryLines)
}));
exports.journalEntryLinesRelations = (0, drizzle_orm_1.relations)(exports.journalEntryLines, ({ one }) => ({
    journalEntry: one(exports.journalEntries, {
        fields: [exports.journalEntryLines.journalEntryId],
        references: [exports.journalEntries.id]
    }),
    account: one(exports.chartOfAccounts, {
        fields: [exports.journalEntryLines.accountId],
        references: [exports.chartOfAccounts.id]
    })
}));
exports.labelTemplatesRelations = (0, drizzle_orm_1.relations)(exports.labelTemplates, ({ one, many }) => ({
    createdBy: one(exports.users, {
        fields: [exports.labelTemplates.createdBy],
        references: [exports.users.id]
    }),
    printJobs: many(exports.printJobs)
}));
exports.printJobsRelations = (0, drizzle_orm_1.relations)(exports.printJobs, ({ one }) => ({
    template: one(exports.labelTemplates, {
        fields: [exports.printJobs.templateId],
        references: [exports.labelTemplates.id]
    }),
    product: one(exports.products, {
        fields: [exports.printJobs.productId],
        references: [exports.products.id]
    }),
    createdBy: one(exports.users, {
        fields: [exports.printJobs.createdBy],
        references: [exports.users.id]
    })
}));
exports.posTransactionsRelations = (0, drizzle_orm_1.relations)(exports.posTransactions, ({ one, many }) => ({
    terminal: one(exports.posTerminals, {
        fields: [exports.posTransactions.terminalId],
        references: [exports.posTerminals.id]
    }),
    customer: one(exports.customers, {
        fields: [exports.posTransactions.customerId],
        references: [exports.customers.id]
    }),
    cashier: one(exports.users, {
        fields: [exports.posTransactions.cashierId],
        references: [exports.users.id]
    }),
    items: many(exports.posTransactionItems)
}));
exports.posTransactionItemsRelations = (0, drizzle_orm_1.relations)(exports.posTransactionItems, ({ one }) => ({
    transaction: one(exports.posTransactions, {
        fields: [exports.posTransactionItems.transactionId],
        references: [exports.posTransactions.id]
    }),
    product: one(exports.products, {
        fields: [exports.posTransactionItems.productId],
        references: [exports.products.id]
    })
}));
exports.loyaltyProgramsRelations = (0, drizzle_orm_1.relations)(exports.loyaltyPrograms, ({ one, many }) => ({
    createdBy: one(exports.users, {
        fields: [exports.loyaltyPrograms.createdBy],
        references: [exports.users.id]
    }),
    loyaltyPoints: many(exports.loyaltyPoints)
}));
exports.loyaltyPointsRelations = (0, drizzle_orm_1.relations)(exports.loyaltyPoints, ({ one }) => ({
    customer: one(exports.customers, {
        fields: [exports.loyaltyPoints.customerId],
        references: [exports.customers.id]
    }),
    program: one(exports.loyaltyPrograms, {
        fields: [exports.loyaltyPoints.programId],
        references: [exports.loyaltyPrograms.id]
    })
}));
exports.contentItemsRelations = (0, drizzle_orm_1.relations)(exports.contentItems, ({ one }) => ({
    author: one(exports.users, {
        fields: [exports.contentItems.authorId],
        references: [exports.users.id]
    })
}));
exports.mediaAssetsRelations = (0, drizzle_orm_1.relations)(exports.mediaAssets, ({ one }) => ({
    uploadedBy: one(exports.users, {
        fields: [exports.mediaAssets.uploadedBy],
        references: [exports.users.id]
    })
}));
exports.companies = (0, pg_core_1.pgTable)('companies', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    website: (0, pg_core_1.varchar)('website', { length: 255 }),
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    phone: (0, pg_core_1.varchar)('phone', { length: 50 }),
    address: (0, pg_core_1.text)('address'),
    logoUrl: (0, pg_core_1.varchar)('logo_url', { length: 500 }),
    primaryColor: (0, pg_core_1.varchar)('primary_color', { length: 7 }).default('#6366f1'),
    secondaryColor: (0, pg_core_1.varchar)('secondary_color', { length: 7 }).default('#8b5cf6'),
    accentColor: (0, pg_core_1.varchar)('accent_color', { length: 7 }).default('#06b6d4'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.enhancedBranches = (0, pg_core_1.pgTable)('enhanced_branches', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    companyId: (0, pg_core_1.integer)('company_id').notNull().references(() => exports.companies.id),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    address: (0, pg_core_1.text)('address').notNull(),
    latitude: (0, pg_core_1.decimal)('latitude', { precision: 10, scale: 8 }),
    longitude: (0, pg_core_1.decimal)('longitude', { precision: 11, scale: 8 }),
    language: (0, pg_core_1.varchar)('language', { length: 10 }).default('en'),
    phone: (0, pg_core_1.varchar)('phone', { length: 50 }),
    whatsappNumber: (0, pg_core_1.varchar)('whatsapp_number', { length: 50 }),
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    managerName: (0, pg_core_1.varchar)('manager_name', { length: 255 }),
    operatingHours: (0, pg_core_1.jsonb)('operating_hours'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.userBranchAssignments = (0, pg_core_1.pgTable)('user_branch_assignments', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').notNull().references(() => exports.users.id),
    branchId: (0, pg_core_1.integer)('branch_id').notNull().references(() => exports.enhancedBranches.id),
    roleInBranch: (0, pg_core_1.varchar)('role_in_branch', { length: 50 }).notNull(),
    permissions: (0, pg_core_1.jsonb)('permissions').default('[]'),
    assignedAt: (0, pg_core_1.timestamp)('assigned_at').defaultNow(),
    assignedBy: (0, pg_core_1.integer)('assigned_by').references(() => exports.users.id),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull().default('active'),
});
exports.companiesRelations = (0, drizzle_orm_1.relations)(exports.companies, ({ many }) => ({
    branches: many(exports.enhancedBranches),
    userAssignments: many(exports.userBranchAssignments)
}));
exports.enhancedBranchesRelations = (0, drizzle_orm_1.relations)(exports.enhancedBranches, ({ one, many }) => ({
    company: one(exports.companies, {
        fields: [exports.enhancedBranches.companyId],
        references: [exports.companies.id],
    }),
    userAssignments: many(exports.userBranchAssignments),
}));
exports.userBranchAssignmentsRelations = (0, drizzle_orm_1.relations)(exports.userBranchAssignments, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.userBranchAssignments.userId],
        references: [exports.users.id],
    }),
    branch: one(exports.enhancedBranches, {
        fields: [exports.userBranchAssignments.branchId],
        references: [exports.enhancedBranches.id],
    }),
    assignedByUser: one(exports.users, {
        fields: [exports.userBranchAssignments.assignedBy],
        references: [exports.users.id],
    }),
}));
exports.transactions = (0, pg_core_1.pgTable)('transactions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    description: (0, pg_core_1.varchar)('description', { length: 255 }).notNull(),
    amount: (0, pg_core_1.decimal)('amount', { precision: 12, scale: 2 }).notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 20 }).notNull(),
    category: (0, pg_core_1.varchar)('category', { length: 100 }),
    reference: (0, pg_core_1.varchar)('reference', { length: 100 }),
    transactionDate: (0, pg_core_1.date)('transaction_date'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull()
});
exports.expenses = (0, pg_core_1.pgTable)('expenses', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    description: (0, pg_core_1.varchar)('description', { length: 255 }).notNull(),
    amount: (0, pg_core_1.decimal)('amount', { precision: 12, scale: 2 }).notNull(),
    category: (0, pg_core_1.varchar)('category', { length: 50 }).notNull(),
    vendor: (0, pg_core_1.varchar)('vendor', { length: 255 }),
    receiptNumber: (0, pg_core_1.varchar)('receipt_number', { length: 100 }),
    expenseDate: (0, pg_core_1.date)('expense_date'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull()
});
exports.transactionsRelations = (0, drizzle_orm_1.relations)(exports.transactions, ({ one }) => ({}));
exports.expensesRelations = (0, drizzle_orm_1.relations)(exports.expenses, ({ one }) => ({}));
//# sourceMappingURL=schema.js.map