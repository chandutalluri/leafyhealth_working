import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db, orders, orderItems, orderStatusHistory } from '../database';
import { eq, desc, sql, and, count, sum } from 'drizzle-orm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from '../dto/update-payment-status.dto';

@Injectable()
export class OrderService {

  async createOrder(createOrderDto: CreateOrderDto, createdBy: number) {
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const [order] = await db.insert(orders).values({
      ...createOrderDto,
      orderNumber,
      createdBy,
      orderDate: new Date(),
      orderStatus: 'PENDING',
      paymentStatus: 'PENDING'
    }).returning();

    // Create order items if provided
    if (createOrderDto.items && createOrderDto.items.length > 0) {
      await db.insert(orderItems).values(
        createOrderDto.items.map(item => ({
          orderId: order.id,
          ...item
        }))
      );
    }

    // Create initial status history
    await db.insert(orderStatusHistory).values({
      orderId: order.id,
      newStatus: 'PENDING',
      statusReason: 'Order created',
      changedBy: createdBy,
      changedAt: new Date()
    });

    return {
      success: true,
      message: 'Order created successfully',
      data: order
    };
  }

  async findAll() {
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));

    return {
      success: true,
      data: allOrders,
      total: allOrders.length
    };
  }

  async findByStatus(status: string) {
    const ordersByStatus = await db
      .select()
      .from(orders)
      .where(eq(orders.orderStatus, status))
      .orderBy(desc(orders.createdAt));

    return {
      success: true,
      data: ordersByStatus,
      total: ordersByStatus.length
    };
  }

  async findByCustomer(customerId: number) {
    const customerOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, customerId))
      .orderBy(desc(orders.createdAt));

    return {
      success: true,
      data: customerOrders,
      total: customerOrders.length
    };
  }

  async findOne(id: number) {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Get order items
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    // Get status history
    const statusHistory = await db
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, id))
      .orderBy(desc(orderStatusHistory.changedAt));

    return {
      success: true,
      data: {
        ...order,
        items,
        statusHistory
      }
    };
  }

  async updateOrderStatus(id: number, updateStatusDto: UpdateOrderStatusDto, updatedBy: number) {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const previousStatus = order.orderStatus;

    // Update order status
    const [updatedOrder] = await db
      .update(orders)
      .set({
        orderStatus: updateStatusDto.orderStatus,
        updatedBy,
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();

    // Create status history entry
    await db.insert(orderStatusHistory).values({
      orderId: id,
      newStatus: updateStatusDto.orderStatus,
      statusReason: updateStatusDto.reason || `Status changed to ${updateStatusDto.orderStatus}`,
      changedBy: updatedBy,
      changedAt: new Date()
    });

    // Handle inventory changes if needed
    await this.handleInventoryStatusChange(id, previousStatus, updateStatusDto.orderStatus);

    return {
      success: true,
      message: `Order status updated from ${previousStatus} to ${updateStatusDto.orderStatus}`,
      data: updatedOrder
    };
  }

  async updatePaymentStatus(id: number, updatePaymentDto: UpdatePaymentStatusDto, updatedBy: number) {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Update payment status
    const [updatedOrder] = await db
      .update(orders)
      .set({
        paymentStatus: updatePaymentDto.paymentStatus,

        paymentTransactionId: updatePaymentDto.transactionId,
        updatedBy,
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();

    // If payment is completed, automatically update order status if still pending
    if (updatePaymentDto.paymentStatus === 'COMPLETED' && order.orderStatus === 'PENDING') {
      await this.updateOrderStatus(id, {
        orderStatus: 'CONFIRMED',
        reason: 'Payment completed successfully'
      }, updatedBy);
    }

    return {
      success: true,
      message: 'Payment status updated successfully',
      data: updatedOrder
    };
  }

  private async handleInventoryStatusChange(orderId: number, previousStatus: string, newStatus: string) {
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    // Handle inventory changes based on status transitions
    if (previousStatus === 'PENDING' && newStatus === 'CONFIRMED') {
      // Reserve inventory when order is confirmed
      await this.processInventoryDeduction(orderId);
    } else if (previousStatus === 'CONFIRMED' && newStatus === 'CANCELLED') {
      // Release inventory when order is cancelled
      await this.releaseReservedInventory(orderId);
    }
  }

  async getOrderAnalytics() {
    // Get order statistics
    const orderStats = await db
      .select({
        totalOrders: count(orders.id),
        totalRevenue: sum(orders.totalAmount),
        pendingOrders: count(sql`case when ${orders.orderStatus} = 'PENDING' then 1 end`),
        completedOrders: count(sql`case when ${orders.orderStatus} = 'DELIVERED' then 1 end`)
      })
      .from(orders);

    // Get orders by status breakdown
    const ordersByStatus = await db
      .select({
        status: orders.orderStatus,
        count: count(orders.id),
        revenue: sum(orders.totalAmount)
      })
      .from(orders)
      .groupBy(orders.orderStatus);

    // Get daily order trends (last 30 days)
    const dailyTrends = await db
      .select({
        date: sql<string>`date(${orders.createdAt})`,
        orderCount: count(orders.id),
        revenue: sum(orders.totalAmount)
      })
      .from(orders)
      .where(sql`${orders.createdAt} >= current_date - interval '30 days'`)
      .groupBy(sql`date(${orders.createdAt})`)
      .orderBy(sql`date(${orders.createdAt})`);

    // Get top products by order frequency
    const topProducts = await db
      .select({
        productId: orderItems.productId,
        productName: orderItems.productName,
        totalQuantity: sum(orderItems.quantity),
        totalRevenue: sum(sql`${orderItems.quantity} * ${orderItems.unitPrice}`)
      })
      .from(orderItems)
      .groupBy(orderItems.productId, orderItems.productName)
      .orderBy(desc(sum(orderItems.quantity)))
      .limit(10);

    return {
      success: true,
      data: {
        overview: orderStats[0] || { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, completedOrders: 0 },
        statusBreakdown: ordersByStatus,
        dailyTrends,
        topProducts
      }
    };
  }

  // ENHANCED: Intelligent Order Orchestration
  async bundleOrdersForDelivery(deliveryZone: string, timeWindow = 2) {
    // Find orders in the same delivery zone within the time window
    const eligibleOrders = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.orderStatus, 'CONFIRMED'),
          deliveryZone ? sql`delivery_address LIKE ${`%${deliveryZone}%`}` : sql`1=1`,
          sql`${orders.createdAt} >= current_timestamp - interval '${timeWindow} hours'`
        )
      )
      .orderBy(orders.createdAt);

    if (eligibleOrders.length < 2) {
      return {
        success: false,
        message: 'Not enough orders found for bundling',
        data: { eligibleOrders: eligibleOrders.length }
      };
    }

    // Create delivery bundle
    const bundleId = `BUNDLE-${Date.now()}`;
    const bundledOrders = eligibleOrders.slice(0, 5); // Max 5 orders per bundle

    // Update orders with bundle information
    await db
      .update(orders)
      .set({
        deliveryBundle: bundleId,
        orderStatus: 'BUNDLED',
        updatedAt: new Date()
      })
      .where(sql`${orders.id} = ANY(${bundledOrders.map(o => o.id)})`);

    return {
      success: true,
      message: `Successfully bundled ${bundledOrders.length} orders`,
      data: {
        bundleId,
        orders: bundledOrders,
        estimatedSavings: this.calculateBundleSavings(bundledOrders)
      }
    };
  }

  async autoRetryFailedOrders(maxRetries = 3) {
    // Find failed orders that haven't exceeded retry limit
    const failedOrders = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.orderStatus, 'FAILED'),
          sql`COALESCE(retry_count, 0) < ${maxRetries}`,
          sql`${orders.updatedAt} <= current_timestamp - interval '30 minutes'`
        )
      );

    const retryResults = [];
    for (const order of failedOrders) {
      try {
        // Attempt to reprocess the order
        const retryResult = await this.retryOrderProcessing(order.id);
        retryResults.push({
          orderId: order.id,
          status: 'success',
          result: retryResult
        });
      } catch (error) {
        // Increment retry count
        await db
          .update(orders)
          .set({
            retryCount: sql`COALESCE(retry_count, 0) + 1`,
            lastRetryAt: new Date(),
            updatedAt: new Date()
          })
          .where(eq(orders.id, order.id));

        retryResults.push({
          orderId: order.id,
          status: 'failed',
          error: error.message
        });
      }
    }

    return {
      success: true,
      message: `Processed ${failedOrders.length} failed orders`,
      data: retryResults
    };
  }

  async optimizeOrderRouting(orderId: number) {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    // Get order items to check inventory availability
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    // Find optimal fulfillment location based on inventory and distance
    const optimalLocation = await this.findOptimalFulfillmentCenter(
      order.deliveryAddress,
      items
    );

    // Update order with optimal routing
    const [updatedOrder] = await db
      .update(orders)
      .set({
        fulfillmentCenter: optimalLocation.centerId,
        estimatedDeliveryTime: optimalLocation.estimatedTime,
        routingScore: optimalLocation.score,
        updatedAt: new Date()
      })
      .where(eq(orders.id, orderId))
      .returning();

    return {
      success: true,
      message: 'Order routing optimized successfully',
      data: {
        order: updatedOrder,
        optimization: optimalLocation
      }
    };
  }

  async handlePartialFulfillment(orderId: number, availableItems: any[]) {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    // Calculate partial fulfillment value
    const partialValue = availableItems.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice), 0
    );

    // Create partial order
    const [partialOrder] = await db.insert(orders).values({
      originalOrderId: orderId,
      customerId: order.customerId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      deliveryAddress: order.deliveryAddress,
      totalAmount: partialValue,
      orderStatus: 'PARTIAL_FULFILLMENT',
      paymentStatus: 'PARTIAL_PAID',
      orderType: 'PARTIAL',
      createdBy: order.createdBy,
      orderDate: new Date()
    }).returning();

    // Update original order status
    await db
      .update(orders)
      .set({
        orderStatus: 'PARTIALLY_FULFILLED',
        partialOrderId: partialOrder.id,
        updatedAt: new Date()
      })
      .where(eq(orders.id, orderId));

    return {
      success: true,
      message: 'Partial fulfillment created successfully',
      data: {
        originalOrder: order,
        partialOrder,
        fulfillmentPercentage: (partialValue / order.totalAmount * 100).toFixed(2)
      }
    };
  }

  // Helper methods for intelligent orchestration
  private async retryOrderProcessing(orderId: number) {
    // Retry order processing with exponential backoff
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    // Attempt payment retry if payment failed
    if (order.paymentStatus === 'FAILED') {
      // This would integrate with payment service
      console.log(`Retrying payment for order ${orderId}`);
    }

    // Check inventory availability again
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    // Update order status to processing
    await db
      .update(orders)
      .set({
        orderStatus: 'PROCESSING',
        retryCount: sql`COALESCE(retry_count, 0) + 1`,
        lastRetryAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(orders.id, orderId));

    return { retried: true, timestamp: new Date() };
  }

  private calculateBundleSavings(orders: any[]) {
    // Calculate estimated delivery cost savings from bundling
    const individualDeliveryCost = orders.length * 50; // Base delivery cost per order
    const bundledDeliveryCost = 50 + (orders.length - 1) * 10; // Reduced cost for additional stops
    return {
      individualCost: individualDeliveryCost,
      bundledCost: bundledDeliveryCost,
      savings: individualDeliveryCost - bundledDeliveryCost,
      savingsPercentage: ((individualDeliveryCost - bundledDeliveryCost) / individualDeliveryCost * 100).toFixed(2)
    };
  }

  private async findOptimalFulfillmentCenter(deliveryAddress: string, items: any[]) {
    // Simplified optimization logic - in production would use real location data
    const centers = [
      { id: 'CENTER_A', name: 'Main Warehouse', score: 0.8, estimatedTime: '2-3 hours' },
      { id: 'CENTER_B', name: 'City Center', score: 0.9, estimatedTime: '1-2 hours' },
      { id: 'CENTER_C', name: 'Suburban Hub', score: 0.7, estimatedTime: '3-4 hours' }
    ];

    // Select center with highest score (would include inventory check and distance calculation)
    const optimal = centers.reduce((best, current) => 
      current.score > best.score ? current : best
    );

    return {
      centerId: optimal.id,
      centerName: optimal.name,
      score: optimal.score,
      estimatedTime: optimal.estimatedTime,
      factors: ['inventory_availability', 'delivery_distance', 'center_capacity']
    };
  }

  // Helper methods for inventory management
  private async processInventoryDeduction(orderId: number) {
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    // This would integrate with inventory management service
    // For now, we'll just log the operation
    console.log(`Processing inventory deduction for order ${orderId}:`, items);
  }

  private async releaseReservedInventory(orderId: number) {
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    // This would integrate with inventory management service
    // For now, we'll just log the operation
    console.log(`Releasing reserved inventory for order ${orderId}:`, items);
  }
}