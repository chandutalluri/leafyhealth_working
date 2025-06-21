import { AnalyticsService } from '../services/analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getSalesAnalytics(period?: string): Promise<{
        summary: any;
        dailyTrends: any;
        period: string;
    }>;
    getCustomerAnalytics(): Promise<{
        stats: any;
        monthlyAcquisition: any;
        topCustomers: any;
    }>;
    getProductAnalytics(): Promise<{
        bestSellers: any;
        lowStockProducts: any;
    }>;
    getSystemAnalytics(): Promise<{
        notifications: any;
        paymentMethods: any;
    }>;
    getDashboardMetrics(): Promise<{
        todayOrders: any;
        todayRevenue: any;
        totalCustomers: any;
        pendingOrders: any;
        timestamp: string;
    }>;
    getIntrospection(): {
        service: string;
        version: string;
        capabilities: string[];
        endpoints: {
            'GET /analytics/sales': string;
            'GET /analytics/customers': string;
            'GET /analytics/products': string;
            'GET /analytics/system': string;
            'GET /analytics/dashboard': string;
        };
        database: string;
        timestamp: string;
    };
}
