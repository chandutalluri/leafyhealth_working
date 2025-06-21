export declare class AnalyticsService {
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
    private getDateFilter;
}
