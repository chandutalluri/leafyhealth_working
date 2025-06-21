import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from '../dto/update-payment-status.dto';
export declare class OrderService {
    createOrder(createOrderDto: CreateOrderDto, createdBy: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    findAll(): Promise<{
        success: boolean;
        data: any;
        total: any;
    }>;
    findByStatus(status: string): Promise<{
        success: boolean;
        data: any;
        total: any;
    }>;
    findByCustomer(customerId: number): Promise<{
        success: boolean;
        data: any;
        total: any;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: any;
    }>;
    updateOrderStatus(id: number, updateStatusDto: UpdateOrderStatusDto, updatedBy: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    updatePaymentStatus(id: number, updatePaymentDto: UpdatePaymentStatusDto, updatedBy: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    private handleInventoryStatusChange;
    getOrderAnalytics(): Promise<{
        success: boolean;
        data: {
            overview: any;
            statusBreakdown: any;
            dailyTrends: any;
            topProducts: any;
        };
    }>;
    bundleOrdersForDelivery(deliveryZone: string, timeWindow?: number): Promise<{
        success: boolean;
        message: string;
        data: {
            eligibleOrders: any;
            bundleId?: undefined;
            orders?: undefined;
            estimatedSavings?: undefined;
        };
    } | {
        success: boolean;
        message: string;
        data: {
            bundleId: string;
            orders: any;
            estimatedSavings: {
                individualCost: number;
                bundledCost: number;
                savings: number;
                savingsPercentage: string;
            };
            eligibleOrders?: undefined;
        };
    }>;
    autoRetryFailedOrders(maxRetries?: number): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
    optimizeOrderRouting(orderId: number): Promise<{
        success: boolean;
        message: string;
        data: {
            order: any;
            optimization: {
                centerId: string;
                centerName: string;
                score: number;
                estimatedTime: string;
                factors: string[];
            };
        };
    }>;
    handlePartialFulfillment(orderId: number, availableItems: any[]): Promise<{
        success: boolean;
        message: string;
        data: {
            originalOrder: any;
            partialOrder: any;
            fulfillmentPercentage: string;
        };
    }>;
    private retryOrderProcessing;
    private calculateBundleSavings;
    private findOptimalFulfillmentCenter;
    private processInventoryDeduction;
    private releaseReservedInventory;
}
