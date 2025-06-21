import { Injectable } from '@nestjs/common';
import { eq, sql, desc, count, sum, avg, between } from 'drizzle-orm';
import { db } from '../database';
import { 
  orders, 
  orderItems, 
  products, 
  customers, 
  payments, 
  inventory,
  categories
} from '../database';

@Injectable()
export class ReportsService {
  async generateSalesReport(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Sales summary
    const salesSummary = await db
      .select({
        totalOrders: count(orders.id),
        totalRevenue: sum(orders.totalAmount),
        averageOrderValue: avg(orders.totalAmount)
      })
      .from(orders)
      .where(between(orders.createdAt, start, end));

    // Daily sales breakdown
    const dailySales = await db
      .select({
        date: sql<string>`DATE(${orders.createdAt})`,
        orderCount: count(orders.id),
        revenue: sum(orders.totalAmount)
      })
      .from(orders)
      .where(between(orders.createdAt, start, end))
      .groupBy(sql`DATE(${orders.createdAt})`)
      .orderBy(sql`DATE(${orders.createdAt})`);

    return {
      summary: salesSummary[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 },
      dailyBreakdown: dailySales,
      period: { startDate, endDate },
      generatedAt: new Date().toISOString()
    };
  }

  async generateCustomerReport() {
    // Customer demographics
    const customerStats = await db
      .select({
        totalCustomers: count(customers.id),
        activeCustomers: count(sql`CASE WHEN ${customers.isActive} = true THEN 1 END`),
        newCustomersThisMonth: count(sql`CASE WHEN ${customers.createdAt} >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END`)
      })
      .from(customers);

    // Top customers by spending
    const topCustomers = await db
      .select({
        customerId: customers.id,
        customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
        email: customers.email,
        totalSpent: sum(orders.totalAmount),
        orderCount: count(orders.id),
        lastOrderDate: sql<Date>`MAX(${orders.createdAt})`
      })
      .from(customers)
      .leftJoin(orders, eq(customers.id, orders.customerId))
      .groupBy(customers.id, customers.firstName, customers.lastName, customers.email)
      .orderBy(desc(sum(orders.totalAmount)))
      .limit(20);

    return {
      statistics: customerStats[0] || { totalCustomers: 0, activeCustomers: 0, newCustomersThisMonth: 0 },
      topCustomers,
      generatedAt: new Date().toISOString()
    };
  }

  async generateInventoryReport() {
    // Current inventory status
    const inventoryStatus = await db
      .select({
        productId: inventory.productId,
        productName: products.name,
        categoryName: categories.name,
        currentStock: inventory.quantity,
        minThreshold: products.minStockLevel,
        stockValue: sql<number>`${inventory.quantity} * ${products.price}`,
        status: sql<string>`CASE 
          WHEN ${inventory.quantity} <= ${products.minStockLevel} THEN 'Low Stock'
          WHEN ${inventory.quantity} = 0 THEN 'Out of Stock'
          ELSE 'In Stock'
        END`
      })
      .from(inventory)
      .innerJoin(products, eq(inventory.productId, products.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(inventory.quantity);

    // Stock alerts
    const stockAlerts = inventoryStatus.filter(item => 
      item.currentStock <= item.minThreshold
    );

    // Total inventory value
    const totalValue = inventoryStatus.reduce((sum, item) => 
      sum + (item.stockValue || 0), 0
    );

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

  async generateProductPerformanceReport(period: string = '30d') {
    const dateFilter = this.getDateFilter(period);

    // Best selling products
    const productPerformance = await db
      .select({
        productId: orderItems.productId,
        productName: products.name,
        categoryName: categories.name,
        totalQuantitySold: sum(orderItems.quantity),
        totalRevenue: sum(sql`${orderItems.quantity} * ${orderItems.unitPrice}`),
        averagePrice: avg(orderItems.unitPrice),
        orderCount: count(sql`DISTINCT ${orderItems.orderId}`)
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(sql`${orders.createdAt} >= ${dateFilter}`)
      .groupBy(orderItems.productId, products.name, categories.name)
      .orderBy(desc(sum(orderItems.quantity)));

    return {
      productPerformance,
      period,
      generatedAt: new Date().toISOString()
    };
  }

  async generateFinancialReport(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Revenue breakdown
    const revenueData = await db
      .select({
        totalRevenue: sum(orders.totalAmount),
        paidOrders: count(sql`CASE WHEN ${orders.paymentStatus} = 'paid' THEN 1 END`),
        pendingPayments: count(sql`CASE WHEN ${orders.paymentStatus} = 'pending' THEN 1 END`),
        failedPayments: count(sql`CASE WHEN ${orders.paymentStatus} = 'failed' THEN 1 END`)
      })
      .from(orders)
      .where(between(orders.createdAt, start, end));

    // Payment method breakdown
    const paymentMethods = await db
      .select({
        paymentMethod: payments.paymentMethod,
        transactionCount: count(payments.id),
        totalAmount: sum(payments.amount),
        averageAmount: avg(payments.amount)
      })
      .from(payments)
      .where(between(payments.createdAt, start, end))
      .groupBy(payments.paymentMethod)
      .orderBy(desc(sum(payments.amount)));

    return {
      revenue: revenueData[0] || { totalRevenue: 0, paidOrders: 0, pendingPayments: 0, failedPayments: 0 },
      paymentMethods,
      period: { startDate, endDate },
      generatedAt: new Date().toISOString()
    };
  }

  async exportReportData(reportType: string, format: string = 'json', params: any = {}) {
    let reportData;

    switch (reportType) {
      case 'sales':
        reportData = await this.generateSalesReport(
          params.startDate || this.getDefaultStartDate(),
          params.endDate || new Date().toISOString()
        );
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
        reportData = await this.generateFinancialReport(
          params.startDate || this.getDefaultStartDate(),
          params.endDate || new Date().toISOString()
        );
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

  private getDateFilter(period: string): Date {
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

  private getDefaultStartDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString();
  }
}