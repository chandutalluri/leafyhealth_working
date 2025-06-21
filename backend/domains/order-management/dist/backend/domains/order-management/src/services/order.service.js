"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../database");
const drizzle_orm_1 = require("drizzle-orm");
let OrderService = class OrderService {
    async createOrder(createOrderDto, createdBy) {
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const [order] = await database_1.db.insert(database_1.orders).values({
            ...createOrderDto,
            orderNumber,
            createdBy,
            orderDate: new Date(),
            orderStatus: 'PENDING',
            paymentStatus: 'PENDING'
        }).returning();
        if (createOrderDto.items && createOrderDto.items.length > 0) {
            await database_1.db.insert(database_1.orderItems).values(createOrderDto.items.map(item => ({
                orderId: order.id,
                ...item
            })));
        }
        await database_1.db.insert(database_1.orderStatusHistory).values({
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
        const allOrders = await database_1.db
            .select()
            .from(database_1.orders)
            .orderBy((0, drizzle_orm_1.desc)(database_1.orders.createdAt));
        return {
            success: true,
            data: allOrders,
            total: allOrders.length
        };
    }
    async findByStatus(status) {
        const ordersByStatus = await database_1.db
            .select()
            .from(database_1.orders)
            .where((0, drizzle_orm_1.eq)(database_1.orders.orderStatus, status))
            .orderBy((0, drizzle_orm_1.desc)(database_1.orders.createdAt));
        return {
            success: true,
            data: ordersByStatus,
            total: ordersByStatus.length
        };
    }
    async findByCustomer(customerId) {
        const customerOrders = await database_1.db
            .select()
            .from(database_1.orders)
            .where((0, drizzle_orm_1.eq)(database_1.orders.customerId, customerId))
            .orderBy((0, drizzle_orm_1.desc)(database_1.orders.createdAt));
        return {
            success: true,
            data: customerOrders,
            total: customerOrders.length
        };
    }
    async findOne(id) {
        const [order] = await database_1.db
            .select()
            .from(database_1.orders)
            .where((0, drizzle_orm_1.eq)(database_1.orders.id, id));
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        const items = await database_1.db
            .select()
            .from(database_1.orderItems)
            .where((0, drizzle_orm_1.eq)(database_1.orderItems.orderId, id));
        const statusHistory = await database_1.db
            .select()
            .from(database_1.orderStatusHistory)
            .where((0, drizzle_orm_1.eq)(database_1.orderStatusHistory.orderId, id))
            .orderBy((0, drizzle_orm_1.desc)(database_1.orderStatusHistory.changedAt));
        return {
            success: true,
            data: {
                ...order,
                items,
                statusHistory
            }
        };
    }
    async updateOrderStatus(id, updateStatusDto, updatedBy) {
        const [order] = await database_1.db
            .select()
            .from(database_1.orders)
            .where((0, drizzle_orm_1.eq)(database_1.orders.id, id));
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        const previousStatus = order.orderStatus;
        const [updatedOrder] = await database_1.db
            .update(database_1.orders)
            .set({
            orderStatus: updateStatusDto.orderStatus,
            updatedBy,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(database_1.orders.id, id))
            .returning();
        await database_1.db.insert(database_1.orderStatusHistory).values({
            orderId: id,
            newStatus: updateStatusDto.orderStatus,
            statusReason: updateStatusDto.reason || `Status changed to ${updateStatusDto.orderStatus}`,
            changedBy: updatedBy,
            changedAt: new Date()
        });
        await this.handleInventoryStatusChange(id, previousStatus, updateStatusDto.orderStatus);
        return {
            success: true,
            message: `Order status updated from ${previousStatus} to ${updateStatusDto.orderStatus}`,
            data: updatedOrder
        };
    }
    async updatePaymentStatus(id, updatePaymentDto, updatedBy) {
        const [order] = await database_1.db
            .select()
            .from(database_1.orders)
            .where((0, drizzle_orm_1.eq)(database_1.orders.id, id));
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        const [updatedOrder] = await database_1.db
            .update(database_1.orders)
            .set({
            paymentStatus: updatePaymentDto.paymentStatus,
            paymentTransactionId: updatePaymentDto.transactionId,
            updatedBy,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(database_1.orders.id, id))
            .returning();
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
    async handleInventoryStatusChange(orderId, previousStatus, newStatus) {
        const items = await database_1.db
            .select()
            .from(database_1.orderItems)
            .where((0, drizzle_orm_1.eq)(database_1.orderItems.orderId, orderId));
        if (previousStatus === 'PENDING' && newStatus === 'CONFIRMED') {
            await this.processInventoryDeduction(orderId);
        }
        else if (previousStatus === 'CONFIRMED' && newStatus === 'CANCELLED') {
            await this.releaseReservedInventory(orderId);
        }
    }
    async getOrderAnalytics() {
        const orderStats = await database_1.db
            .select({
            totalOrders: (0, drizzle_orm_1.count)(database_1.orders.id),
            totalRevenue: (0, drizzle_orm_1.sum)(database_1.orders.totalAmount),
            pendingOrders: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `case when ${database_1.orders.orderStatus} = 'PENDING' then 1 end`),
            completedOrders: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `case when ${database_1.orders.orderStatus} = 'DELIVERED' then 1 end`)
        })
            .from(database_1.orders);
        const ordersByStatus = await database_1.db
            .select({
            status: database_1.orders.orderStatus,
            count: (0, drizzle_orm_1.count)(database_1.orders.id),
            revenue: (0, drizzle_orm_1.sum)(database_1.orders.totalAmount)
        })
            .from(database_1.orders)
            .groupBy(database_1.orders.orderStatus);
        const dailyTrends = await database_1.db
            .select({
            date: (0, drizzle_orm_1.sql) `date(${database_1.orders.createdAt})`,
            orderCount: (0, drizzle_orm_1.count)(database_1.orders.id),
            revenue: (0, drizzle_orm_1.sum)(database_1.orders.totalAmount)
        })
            .from(database_1.orders)
            .where((0, drizzle_orm_1.sql) `${database_1.orders.createdAt} >= current_date - interval '30 days'`)
            .groupBy((0, drizzle_orm_1.sql) `date(${database_1.orders.createdAt})`)
            .orderBy((0, drizzle_orm_1.sql) `date(${database_1.orders.createdAt})`);
        const topProducts = await database_1.db
            .select({
            productId: database_1.orderItems.productId,
            productName: database_1.orderItems.productName,
            totalQuantity: (0, drizzle_orm_1.sum)(database_1.orderItems.quantity),
            totalRevenue: (0, drizzle_orm_1.sum)((0, drizzle_orm_1.sql) `${database_1.orderItems.quantity} * ${database_1.orderItems.unitPrice}`)
        })
            .from(database_1.orderItems)
            .groupBy(database_1.orderItems.productId, database_1.orderItems.productName)
            .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sum)(database_1.orderItems.quantity)))
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
    async bundleOrdersForDelivery(deliveryZone, timeWindow = 2) {
        const eligibleOrders = await database_1.db
            .select()
            .from(database_1.orders)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(database_1.orders.orderStatus, 'CONFIRMED'), deliveryZone ? (0, drizzle_orm_1.sql) `delivery_address LIKE ${`%${deliveryZone}%`}` : (0, drizzle_orm_1.sql) `1=1`, (0, drizzle_orm_1.sql) `${database_1.orders.createdAt} >= current_timestamp - interval '${timeWindow} hours'`))
            .orderBy(database_1.orders.createdAt);
        if (eligibleOrders.length < 2) {
            return {
                success: false,
                message: 'Not enough orders found for bundling',
                data: { eligibleOrders: eligibleOrders.length }
            };
        }
        const bundleId = `BUNDLE-${Date.now()}`;
        const bundledOrders = eligibleOrders.slice(0, 5);
        await database_1.db
            .update(database_1.orders)
            .set({
            deliveryBundle: bundleId,
            orderStatus: 'BUNDLED',
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.sql) `${database_1.orders.id} = ANY(${bundledOrders.map(o => o.id)})`);
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
        const failedOrders = await database_1.db
            .select()
            .from(database_1.orders)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(database_1.orders.orderStatus, 'FAILED'), (0, drizzle_orm_1.sql) `COALESCE(retry_count, 0) < ${maxRetries}`, (0, drizzle_orm_1.sql) `${database_1.orders.updatedAt} <= current_timestamp - interval '30 minutes'`));
        const retryResults = [];
        for (const order of failedOrders) {
            try {
                const retryResult = await this.retryOrderProcessing(order.id);
                retryResults.push({
                    orderId: order.id,
                    status: 'success',
                    result: retryResult
                });
            }
            catch (error) {
                await database_1.db
                    .update(database_1.orders)
                    .set({
                    retryCount: (0, drizzle_orm_1.sql) `COALESCE(retry_count, 0) + 1`,
                    lastRetryAt: new Date(),
                    updatedAt: new Date()
                })
                    .where((0, drizzle_orm_1.eq)(database_1.orders.id, order.id));
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
    async optimizeOrderRouting(orderId) {
        const [order] = await database_1.db
            .select()
            .from(database_1.orders)
            .where((0, drizzle_orm_1.eq)(database_1.orders.id, orderId));
        if (!order) {
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        }
        const items = await database_1.db
            .select()
            .from(database_1.orderItems)
            .where((0, drizzle_orm_1.eq)(database_1.orderItems.orderId, orderId));
        const optimalLocation = await this.findOptimalFulfillmentCenter(order.deliveryAddress, items);
        const [updatedOrder] = await database_1.db
            .update(database_1.orders)
            .set({
            fulfillmentCenter: optimalLocation.centerId,
            estimatedDeliveryTime: optimalLocation.estimatedTime,
            routingScore: optimalLocation.score,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(database_1.orders.id, orderId))
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
    async handlePartialFulfillment(orderId, availableItems) {
        const [order] = await database_1.db
            .select()
            .from(database_1.orders)
            .where((0, drizzle_orm_1.eq)(database_1.orders.id, orderId));
        if (!order) {
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        }
        const partialValue = availableItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const [partialOrder] = await database_1.db.insert(database_1.orders).values({
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
        await database_1.db
            .update(database_1.orders)
            .set({
            orderStatus: 'PARTIALLY_FULFILLED',
            partialOrderId: partialOrder.id,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(database_1.orders.id, orderId));
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
    async retryOrderProcessing(orderId) {
        const [order] = await database_1.db
            .select()
            .from(database_1.orders)
            .where((0, drizzle_orm_1.eq)(database_1.orders.id, orderId));
        if (order.paymentStatus === 'FAILED') {
            console.log(`Retrying payment for order ${orderId}`);
        }
        const items = await database_1.db
            .select()
            .from(database_1.orderItems)
            .where((0, drizzle_orm_1.eq)(database_1.orderItems.orderId, orderId));
        await database_1.db
            .update(database_1.orders)
            .set({
            orderStatus: 'PROCESSING',
            retryCount: (0, drizzle_orm_1.sql) `COALESCE(retry_count, 0) + 1`,
            lastRetryAt: new Date(),
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(database_1.orders.id, orderId));
        return { retried: true, timestamp: new Date() };
    }
    calculateBundleSavings(orders) {
        const individualDeliveryCost = orders.length * 50;
        const bundledDeliveryCost = 50 + (orders.length - 1) * 10;
        return {
            individualCost: individualDeliveryCost,
            bundledCost: bundledDeliveryCost,
            savings: individualDeliveryCost - bundledDeliveryCost,
            savingsPercentage: ((individualDeliveryCost - bundledDeliveryCost) / individualDeliveryCost * 100).toFixed(2)
        };
    }
    async findOptimalFulfillmentCenter(deliveryAddress, items) {
        const centers = [
            { id: 'CENTER_A', name: 'Main Warehouse', score: 0.8, estimatedTime: '2-3 hours' },
            { id: 'CENTER_B', name: 'City Center', score: 0.9, estimatedTime: '1-2 hours' },
            { id: 'CENTER_C', name: 'Suburban Hub', score: 0.7, estimatedTime: '3-4 hours' }
        ];
        const optimal = centers.reduce((best, current) => current.score > best.score ? current : best);
        return {
            centerId: optimal.id,
            centerName: optimal.name,
            score: optimal.score,
            estimatedTime: optimal.estimatedTime,
            factors: ['inventory_availability', 'delivery_distance', 'center_capacity']
        };
    }
    async processInventoryDeduction(orderId) {
        const items = await database_1.db
            .select()
            .from(database_1.orderItems)
            .where((0, drizzle_orm_1.eq)(database_1.orderItems.orderId, orderId));
        console.log(`Processing inventory deduction for order ${orderId}:`, items);
    }
    async releaseReservedInventory(orderId) {
        const items = await database_1.db
            .select()
            .from(database_1.orderItems)
            .where((0, drizzle_orm_1.eq)(database_1.orderItems.orderId, orderId));
        console.log(`Releasing reserved inventory for order ${orderId}:`, items);
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)()
], OrderService);
//# sourceMappingURL=order.service.js.map