import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from '../dto/update-payment-status.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(createOrderDto: CreateOrderDto, req: any): Promise<{
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
    findByCustomer(customerId: string): Promise<{
        success: boolean;
        data: any;
        total: any;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    updatePaymentStatus(id: string, updatePaymentDto: UpdatePaymentStatusDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    bundleOrdersForDelivery(bundleData: {
        deliveryZone: string;
        timeWindow?: number;
    }): Promise<{
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
    autoRetryFailedOrders(retryConfig: {
        maxRetries?: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
    optimizeOrderRouting(id: string): Promise<{
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
    handlePartialFulfillment(id: string, fulfillmentData: {
        availableItems: any[];
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            originalOrder: any;
            partialOrder: any;
            fulfillmentPercentage: string;
        };
    }>;
}
