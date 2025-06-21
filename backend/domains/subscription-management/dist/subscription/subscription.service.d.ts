import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../schema';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
export declare class SubscriptionService {
    private readonly db;
    constructor(db: PostgresJsDatabase<typeof schema>);
    createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<{
        success: boolean;
        data: {
            duration: number;
            id: string;
            userId: string;
            planType: string;
            mealType: string;
            startDate: string;
            endDate: string;
            deliveryTime: string;
            branchId: string;
            totalPrice: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: unknown;
        };
        message: string;
    }>;
    getAllSubscriptions(userId?: string, status?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            userId: string;
            planType: string;
            mealType: string;
            duration: number;
            startDate: string;
            endDate: string;
            deliveryTime: string;
            branchId: string;
            totalPrice: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: unknown;
        }[];
        count: number;
    }>;
    getActiveSubscriptions(userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            userId: string;
            planType: string;
            mealType: string;
            duration: number;
            startDate: string;
            endDate: string;
            deliveryTime: string;
            branchId: string;
            totalPrice: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: unknown;
        }[];
        count: number;
    }>;
    getSubscriptionPlans(): Promise<{
        success: boolean;
        data: ({
            id: string;
            name: string;
            mealType: string;
            duration: number;
            price: number;
            description: string;
            deliveryTime: string;
            items: string[];
            discount?: undefined;
        } | {
            id: string;
            name: string;
            mealType: string;
            duration: number;
            price: number;
            description: string;
            deliveryTime: string;
            discount: string;
            items: string[];
        })[];
    }>;
    getSubscriptionById(id: string): Promise<{
        success: boolean;
        data: {
            items: {
                id: string;
                subscriptionId: string;
                productId: string;
                quantity: number;
                dayOffset: number;
                createdAt: Date;
            }[];
            id: string;
            userId: string;
            planType: string;
            mealType: string;
            duration: number;
            startDate: string;
            endDate: string;
            deliveryTime: string;
            branchId: string;
            totalPrice: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: unknown;
        };
    }>;
    updateSubscription(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<{
        success: boolean;
        data: {
            id: string;
            userId: string;
            planType: string;
            mealType: string;
            duration: number;
            startDate: string;
            endDate: string;
            deliveryTime: string;
            branchId: string;
            totalPrice: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: unknown;
        };
        message: string;
    }>;
    pauseSubscription(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            userId: string;
            planType: string;
            mealType: string;
            duration: number;
            startDate: string;
            endDate: string;
            deliveryTime: string;
            branchId: string;
            totalPrice: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: unknown;
        };
        message: string;
    }>;
    resumeSubscription(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            userId: string;
            planType: string;
            mealType: string;
            duration: number;
            startDate: string;
            endDate: string;
            deliveryTime: string;
            branchId: string;
            totalPrice: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: unknown;
        };
        message: string;
    }>;
    cancelSubscription(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            userId: string;
            planType: string;
            mealType: string;
            duration: number;
            startDate: string;
            endDate: string;
            deliveryTime: string;
            branchId: string;
            totalPrice: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: unknown;
        };
        message: string;
    }>;
    private updateSubscriptionStatus;
    getDeliverySchedule(subscriptionId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            subscriptionId: string;
            deliveryDate: string;
            deliveryTime: string;
            status: string;
            createdAt: Date;
        }[];
    }>;
    generateDeliverySchedule(subscriptionId: string): Promise<{
        success: boolean;
        data: any[];
        message: string;
    }>;
    private calculateEndDate;
}
