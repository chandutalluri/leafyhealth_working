"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const database_2 = require("../database");
let ReportsService = class ReportsService {
    async generateSalesReport(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const salesSummary = await database_1.db
            .select({
            totalOrders: (0, drizzle_orm_1.count)(database_2.orders.id),
            totalRevenue: (0, drizzle_orm_1.sum)(database_2.orders.totalAmount),
            averageOrderValue: (0, drizzle_orm_1.avg)(database_2.orders.totalAmount)
        })
            .from(database_2.orders)
            .where((0, drizzle_orm_1.between)(database_2.orders.createdAt, start, end));
        const dailySales = await database_1.db
            .select({
            date: (0, drizzle_orm_1.sql) `DATE(${database_2.orders.createdAt})`,
            orderCount: (0, drizzle_orm_1.count)(database_2.orders.id),
            revenue: (0, drizzle_orm_1.sum)(database_2.orders.totalAmount)
        })
            .from(database_2.orders)
            .where((0, drizzle_orm_1.between)(database_2.orders.createdAt, start, end))
            .groupBy((0, drizzle_orm_1.sql) `DATE(${database_2.orders.createdAt})`)
            .orderBy((0, drizzle_orm_1.sql) `DATE(${database_2.orders.createdAt})`);
        return {
            summary: salesSummary[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 },
            dailyBreakdown: dailySales,
            period: { startDate, endDate },
            generatedAt: new Date().toISOString()
        };
    }
    async generateCustomerReport() {
        const customerStats = await database_1.db
            .select({
            totalCustomers: (0, drizzle_orm_1.count)(database_2.customers.id),
            activeCustomers: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `CASE WHEN ${database_2.customers.isActive} = true THEN 1 END`),
            newCustomersThisMonth: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `CASE WHEN ${database_2.customers.createdAt} >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END`)
        })
            .from(database_2.customers);
        const topCustomers = await database_1.db
            .select({
            customerId: database_2.customers.id,
            customerName: (0, drizzle_orm_1.sql) `CONCAT(${database_2.customers.firstName}, ' ', ${database_2.customers.lastName})`,
            email: database_2.customers.email,
            totalSpent: (0, drizzle_orm_1.sum)(database_2.orders.totalAmount),
            orderCount: (0, drizzle_orm_1.count)(database_2.orders.id),
            lastOrderDate: (0, drizzle_orm_1.sql) `MAX(${database_2.orders.createdAt})`
        })
            .from(database_2.customers)
            .leftJoin(database_2.orders, (0, drizzle_orm_1.eq)(database_2.customers.id, database_2.orders.customerId))
            .groupBy(database_2.customers.id, database_2.customers.firstName, database_2.customers.lastName, database_2.customers.email)
            .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sum)(database_2.orders.totalAmount)))
            .limit(20);
        return {
            statistics: customerStats[0] || { totalCustomers: 0, activeCustomers: 0, newCustomersThisMonth: 0 },
            topCustomers,
            generatedAt: new Date().toISOString()
        };
    }
    async generateInventoryReport() {
        const inventoryStatus = await database_1.db
            .select({
            productId: database_2.inventory.productId,
            productName: database_2.products.name,
            categoryName: database_2.categories.name,
            currentStock: database_2.inventory.quantity,
            minThreshold: database_2.products.minStockLevel,
            stockValue: (0, drizzle_orm_1.sql) `${database_2.inventory.quantity} * ${database_2.products.price}`,
            status: (0, drizzle_orm_1.sql) `CASE 
          WHEN ${database_2.inventory.quantity} <= ${database_2.products.minStockLevel} THEN 'Low Stock'
          WHEN ${database_2.inventory.quantity} = 0 THEN 'Out of Stock'
          ELSE 'In Stock'
        END`
        })
            .from(database_2.inventory)
            .innerJoin(database_2.products, (0, drizzle_orm_1.eq)(database_2.inventory.productId, database_2.products.id))
            .leftJoin(database_2.categories, (0, drizzle_orm_1.eq)(database_2.products.categoryId, database_2.categories.id))
            .orderBy(database_2.inventory.quantity);
        const stockAlerts = inventoryStatus.filter(item => item.currentStock <= item.minThreshold);
        const totalValue = inventoryStatus.reduce((sum, item) => sum + (item.stockValue || 0), 0);
        return {
            inventoryItems: inventoryStatus,
            stockAlerts,
            summary: {
                totalProducts: inventoryStatus.length,
                lowStockItems: stockAlerts.length,
                totalInventoryValue: totalValue
            },
            generatedAt: new Date().toISOString()
        };
    }
    async generateProductPerformanceReport(period = '30d') {
        const dateFilter = this.getDateFilter(period);
        const productPerformance = await database_1.db
            .select({
            productId: database_2.orderItems.productId,
            productName: database_2.products.name,
            categoryName: database_2.categories.name,
            totalQuantitySold: (0, drizzle_orm_1.sum)(database_2.orderItems.quantity),
            totalRevenue: (0, drizzle_orm_1.sum)((0, drizzle_orm_1.sql) `${database_2.orderItems.quantity} * ${database_2.orderItems.unitPrice}`),
            averagePrice: (0, drizzle_orm_1.avg)(database_2.orderItems.unitPrice),
            orderCount: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `DISTINCT ${database_2.orderItems.orderId}`)
        })
            .from(database_2.orderItems)
            .innerJoin(database_2.products, (0, drizzle_orm_1.eq)(database_2.orderItems.productId, database_2.products.id))
            .leftJoin(database_2.categories, (0, drizzle_orm_1.eq)(database_2.products.categoryId, database_2.categories.id))
            .innerJoin(database_2.orders, (0, drizzle_orm_1.eq)(database_2.orderItems.orderId, database_2.orders.id))
            .where((0, drizzle_orm_1.sql) `${database_2.orders.createdAt} >= ${dateFilter}`)
            .groupBy(database_2.orderItems.productId, database_2.products.name, database_2.categories.name)
            .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sum)(database_2.orderItems.quantity)));
        return {
            productPerformance,
            period,
            generatedAt: new Date().toISOString()
        };
    }
    async generateFinancialReport(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const revenueData = await database_1.db
            .select({
            totalRevenue: (0, drizzle_orm_1.sum)(database_2.orders.totalAmount),
            paidOrders: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `CASE WHEN ${database_2.orders.paymentStatus} = 'paid' THEN 1 END`),
            pendingPayments: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `CASE WHEN ${database_2.orders.paymentStatus} = 'pending' THEN 1 END`),
            failedPayments: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `CASE WHEN ${database_2.orders.paymentStatus} = 'failed' THEN 1 END`)
        })
            .from(database_2.orders)
            .where((0, drizzle_orm_1.between)(database_2.orders.createdAt, start, end));
        const paymentMethods = await database_1.db
            .select({
            paymentMethod: database_2.payments.paymentMethod,
            transactionCount: (0, drizzle_orm_1.count)(database_2.payments.id),
            totalAmount: (0, drizzle_orm_1.sum)(database_2.payments.amount),
            averageAmount: (0, drizzle_orm_1.avg)(database_2.payments.amount)
        })
            .from(database_2.payments)
            .where((0, drizzle_orm_1.between)(database_2.payments.createdAt, start, end))
            .groupBy(database_2.payments.paymentMethod)
            .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sum)(database_2.payments.amount)));
        return {
            revenue: revenueData[0] || { totalRevenue: 0, paidOrders: 0, pendingPayments: 0, failedPayments: 0 },
            paymentMethods,
            period: { startDate, endDate },
            generatedAt: new Date().toISOString()
        };
    }
    async exportReportData(reportType, format = 'json', params = {}) {
        let reportData;
        switch (reportType) {
            case 'sales':
                reportData = await this.generateSalesReport(params.startDate || this.getDefaultStartDate(), params.endDate || new Date().toISOString());
                break;
            case 'customers':
                reportData = await this.generateCustomerReport();
                break;
            case 'inventory':
                reportData = await this.generateInventoryReport();
                break;
            case 'products':
                reportData = await this.generateProductPerformanceReport(params.period || '30d');
                break;
            case 'financial':
                reportData = await this.generateFinancialReport(params.startDate || this.getDefaultStartDate(), params.endDate || new Date().toISOString());
                break;
            default:
                throw new Error(`Unknown report type: ${reportType}`);
        }
        return {
            reportType,
            format,
            data: reportData,
            exportedAt: new Date().toISOString()
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
    getDefaultStartDate() {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString();
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)()
], ReportsService);
//# sourceMappingURL=reports.service.js.map