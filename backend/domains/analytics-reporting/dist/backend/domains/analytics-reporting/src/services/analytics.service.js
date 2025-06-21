"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const database_2 = require("../database");
let AnalyticsService = class AnalyticsService {
    async getSalesAnalytics(period = '30d') {
        const dateFilter = this.getDateFilter(period);
        const salesData = await database_1.db
            .select({
            totalOrders: (0, drizzle_orm_1.count)(database_2.orders.id),
            totalRevenue: (0, drizzle_orm_1.sum)(database_2.orders.totalAmount),
            averageOrderValue: (0, drizzle_orm_1.avg)(database_2.orders.totalAmount)
        })
            .from(database_2.orders)
            .where((0, drizzle_orm_1.sql) `${database_2.orders.createdAt} >= ${dateFilter}`);
        const dailySales = await database_1.db
            .select({
            date: (0, drizzle_orm_1.sql) `DATE(${database_2.orders.createdAt})`,
            orderCount: (0, drizzle_orm_1.count)(database_2.orders.id),
            revenue: (0, drizzle_orm_1.sum)(database_2.orders.totalAmount)
        })
            .from(database_2.orders)
            .where((0, drizzle_orm_1.sql) `${database_2.orders.createdAt} >= ${dateFilter}`)
            .groupBy((0, drizzle_orm_1.sql) `DATE(${database_2.orders.createdAt})`)
            .orderBy((0, drizzle_orm_1.sql) `DATE(${database_2.orders.createdAt})`);
        return {
            summary: salesData[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 },
            dailyTrends: dailySales,
            period
        };
    }
    async getCustomerAnalytics() {
        const customerStats = await database_1.db
            .select({
            totalCustomers: (0, drizzle_orm_1.count)(database_2.customers.id),
            activeCustomers: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `CASE WHEN ${database_2.customers.isActive} = true THEN 1 END`)
        })
            .from(database_2.customers);
        const monthlyAcquisition = await database_1.db
            .select({
            month: (0, drizzle_orm_1.sql) `TO_CHAR(${database_2.customers.createdAt}, 'YYYY-MM')`,
            newCustomers: (0, drizzle_orm_1.count)(database_2.customers.id)
        })
            .from(database_2.customers)
            .groupBy((0, drizzle_orm_1.sql) `TO_CHAR(${database_2.customers.createdAt}, 'YYYY-MM')`)
            .orderBy((0, drizzle_orm_1.sql) `TO_CHAR(${database_2.customers.createdAt}, 'YYYY-MM')`);
        const topCustomers = await database_1.db
            .select({
            customerId: database_2.orders.customerId,
            customerName: (0, drizzle_orm_1.sql) `CONCAT(${database_2.customers.firstName}, ' ', ${database_2.customers.lastName})`,
            totalSpent: (0, drizzle_orm_1.sum)(database_2.orders.totalAmount),
            orderCount: (0, drizzle_orm_1.count)(database_2.orders.id)
        })
            .from(database_2.orders)
            .innerJoin(database_2.customers, (0, drizzle_orm_1.eq)(database_2.orders.customerId, database_2.customers.id))
            .groupBy(database_2.orders.customerId, database_2.customers.firstName, database_2.customers.lastName)
            .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sum)(database_2.orders.totalAmount)))
            .limit(10);
        return {
            stats: customerStats[0] || { totalCustomers: 0, activeCustomers: 0 },
            monthlyAcquisition,
            topCustomers
        };
    }
    async getProductAnalytics() {
        const bestSellers = await database_1.db
            .select({
            productId: database_2.orderItems.productId,
            productName: database_2.products.name,
            totalQuantitySold: (0, drizzle_orm_1.sum)(database_2.orderItems.quantity),
            totalRevenue: (0, drizzle_orm_1.sum)((0, drizzle_orm_1.sql) `${database_2.orderItems.quantity} * ${database_2.orderItems.unitPrice}`)
        })
            .from(database_2.orderItems)
            .innerJoin(database_2.products, (0, drizzle_orm_1.eq)(database_2.orderItems.productId, database_2.products.id))
            .groupBy(database_2.orderItems.productId, database_2.products.name)
            .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sum)(database_2.orderItems.quantity)))
            .limit(10);
        const lowStockProducts = await database_1.db
            .select({
            productId: database_2.inventory.productId,
            productName: database_2.products.name,
            currentStock: database_2.inventory.quantity,
            minThreshold: database_2.products.minStockLevel
        })
            .from(database_2.inventory)
            .innerJoin(database_2.products, (0, drizzle_orm_1.eq)(database_2.inventory.productId, database_2.products.id))
            .where((0, drizzle_orm_1.sql) `${database_2.inventory.quantity} <= ${database_2.products.minStockLevel}`)
            .orderBy(database_2.inventory.quantity);
        return {
            bestSellers,
            lowStockProducts
        };
    }
    async getSystemAnalytics() {
        const notificationStats = await database_1.db
            .select({
            totalNotifications: (0, drizzle_orm_1.count)(database_2.notifications.id),
            pendingNotifications: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `CASE WHEN ${database_2.notifications.status} = 'pending' THEN 1 END`),
            sentNotifications: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `CASE WHEN ${database_2.notifications.status} = 'sent' THEN 1 END`)
        })
            .from(database_2.notifications);
        const paymentStats = await database_1.db
            .select({
            paymentMethod: database_2.payments.paymentMethod,
            transactionCount: (0, drizzle_orm_1.count)(database_2.payments.id),
            totalAmount: (0, drizzle_orm_1.sum)(database_2.payments.amount)
        })
            .from(database_2.payments)
            .groupBy(database_2.payments.paymentMethod)
            .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.count)(database_2.payments.id)));
        return {
            notifications: notificationStats[0] || { totalNotifications: 0, pendingNotifications: 0, sentNotifications: 0 },
            paymentMethods: paymentStats
        };
    }
    async getDashboardMetrics() {
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const todayOrders = await database_1.db
            .select({ count: (0, drizzle_orm_1.count)(database_2.orders.id) })
            .from(database_2.orders)
            .where((0, drizzle_orm_1.sql) `DATE(${database_2.orders.createdAt}) = CURRENT_DATE`);
        const todayRevenue = await database_1.db
            .select({ revenue: (0, drizzle_orm_1.sum)(database_2.orders.totalAmount) })
            .from(database_2.orders)
            .where((0, drizzle_orm_1.sql) `DATE(${database_2.orders.createdAt}) = CURRENT_DATE`);
        const totalCustomers = await database_1.db
            .select({ count: (0, drizzle_orm_1.count)(database_2.customers.id) })
            .from(database_2.customers);
        const pendingOrders = await database_1.db
            .select({ count: (0, drizzle_orm_1.count)(database_2.orders.id) })
            .from(database_2.orders)
            .where((0, drizzle_orm_1.eq)(database_2.orders.orderStatus, 'PENDING'));
        return {
            todayOrders: todayOrders[0]?.count || 0,
            todayRevenue: todayRevenue[0]?.revenue || 0,
            totalCustomers: totalCustomers[0]?.count || 0,
            pendingOrders: pendingOrders[0]?.count || 0,
            timestamp: new Date().toISOString()
        };
    }
    getDateFilter(period) {
        const now = new Date();
        switch (period) {
            case '7d':
                return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            case '30d':
                return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            case '90d':
                return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            case '1y':
                return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            default:
                return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)()
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map