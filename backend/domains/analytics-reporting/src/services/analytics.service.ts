import { Injectable } from '@nestjs/common';
import { eq, sql, desc, count, sum, avg } from 'drizzle-orm';
import { db } from '../database';
import { 
  orders, 
  orderItems, 
  products, 
  customers, 
  payments, 
  inventory,
  notifications
} from '../database';

@Injectable()
export class AnalyticsService {
  async getSalesAnalytics(period: string = '30d') {
    const dateFilter = this.getDateFilter(period);
    
    // Total sales and revenue
    const salesData = await db
      .select({
        totalOrders: count(orders.id),
        totalRevenue: sum(orders.totalAmount),
        averageOrderValue: avg(orders.totalAmount)
      })
      .from(orders)
      .where(sql`${orders.createdAt} >= ${dateFilter}`);

    // Sales by day
    const dailySales = await db
      .select({
        date: sql<string>`DATE(${orders.createdAt})`,
        orderCount: count(orders.id),
        revenue: sum(orders.totalAmount)
      })
      .from(orders)
      .where(sql`${orders.createdAt} >= ${dateFilter}`)
      .groupBy(sql`DATE(${orders.createdAt})`)
      .orderBy(sql`DATE(${orders.createdAt})`);

    return {
      summary: salesData[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 },
      dailyTrends: dailySales,
      period
    };
  }

  async getCustomerAnalytics() {
    // Customer statistics
    const customerStats = await db
      .select({
        totalCustomers: count(customers.id),
        activeCustomers: count(sql`CASE WHEN ${customers.isActive} = true THEN 1 END`)
      })
      .from(customers);

    // Customer acquisition by month
    const monthlyAcquisition = await db
      .select({
        month: sql<string>`TO_CHAR(${customers.createdAt}, 'YYYY-MM')`,
        newCustomers: count(customers.id)
      })
      .from(customers)
      .groupBy(sql`TO_CHAR(${customers.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${customers.createdAt}, 'YYYY-MM')`);

    // Top customers by order value
    const topCustomers = await db
      .select({
        customerId: orders.customerId,
        customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
        totalSpent: sum(orders.totalAmount),
        orderCount: count(orders.id)
      })
      .from(orders)
      .innerJoin(customers, eq(orders.customerId, customers.id))
      .groupBy(orders.customerId, customers.firstName, customers.lastName)
      .orderBy(desc(sum(orders.totalAmount)))
      .limit(10);

    return {
      stats: customerStats[0] || { totalCustomers: 0, activeCustomers: 0 },
      monthlyAcquisition,
      topCustomers
    };
  }

  async getProductAnalytics() {
    // Best selling products
    const bestSellers = await db
      .select({
        productId: orderItems.productId,
        productName: products.name,
        totalQuantitySold: sum(orderItems.quantity),
        totalRevenue: sum(sql`${orderItems.quantity} * ${orderItems.unitPrice}`)
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .groupBy(orderItems.productId, products.name)
      .orderBy(desc(sum(orderItems.quantity)))
      .limit(10);

    // Low stock alerts
    const lowStockProducts = await db
      .select({
        productId: inventory.productId,
        productName: products.name,
        currentStock: inventory.quantity,
        minThreshold: products.minStockLevel
      })
      .from(inventory)
      .innerJoin(products, eq(inventory.productId, products.id))
      .where(sql`${inventory.quantity} <= ${products.minStockLevel}`)
      .orderBy(inventory.quantity);

    return {
      bestSellers,
      lowStockProducts
    };
  }

  async getSystemAnalytics() {
    // Recent notifications
    const notificationStats = await db
      .select({
        totalNotifications: count(notifications.id),
        pendingNotifications: count(sql`CASE WHEN ${notifications.status} = 'pending' THEN 1 END`),
        sentNotifications: count(sql`CASE WHEN ${notifications.status} = 'sent' THEN 1 END`)
      })
      .from(notifications);

    // Payment method distribution
    const paymentStats = await db
      .select({
        paymentMethod: payments.paymentMethod,
        transactionCount: count(payments.id),
        totalAmount: sum(payments.amount)
      })
      .from(payments)
      .groupBy(payments.paymentMethod)
      .orderBy(desc(count(payments.id)));

    return {
      notifications: notificationStats[0] || { totalNotifications: 0, pendingNotifications: 0, sentNotifications: 0 },
      paymentMethods: paymentStats
    };
  }

  async getDashboardMetrics() {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    // Key metrics for dashboard
    const todayOrders = await db
      .select({ count: count(orders.id) })
      .from(orders)
      .where(sql`DATE(${orders.createdAt}) = CURRENT_DATE`);

    const todayRevenue = await db
      .select({ revenue: sum(orders.totalAmount) })
      .from(orders)
      .where(sql`DATE(${orders.createdAt}) = CURRENT_DATE`);

    const totalCustomers = await db
      .select({ count: count(customers.id) })
      .from(customers);

    const pendingOrders = await db
      .select({ count: count(orders.id) })
      .from(orders)
      .where(eq(orders.orderStatus, 'PENDING'));

    return {
      todayOrders: todayOrders[0]?.count || 0,
      todayRevenue: todayRevenue[0]?.revenue || 0,
      totalCustomers: totalCustomers[0]?.count || 0,
      pendingOrders: pendingOrders[0]?.count || 0,
      timestamp: new Date().toISOString()
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
}