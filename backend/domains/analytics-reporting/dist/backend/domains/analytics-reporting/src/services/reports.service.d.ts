export declare class ReportsService {
    generateSalesReport(startDate: string, endDate: string): Promise<{
        summary: any;
        dailyBreakdown: any;
        period: {
            startDate: string;
            endDate: string;
        };
        generatedAt: string;
    }>;
    generateCustomerReport(): Promise<{
        statistics: any;
        topCustomers: any;
        generatedAt: string;
    }>;
    generateInventoryReport(): Promise<{
        inventoryItems: any;
        stockAlerts: any;
        summary: {
            totalProducts: any;
            lowStockItems: any;
            totalInventoryValue: any;
        };
        generatedAt: string;
    }>;
    generateProductPerformanceReport(period?: string): Promise<{
        productPerformance: any;
        period: string;
        generatedAt: string;
    }>;
    generateFinancialReport(startDate: string, endDate: string): Promise<{
        revenue: any;
        paymentMethods: any;
        period: {
            startDate: string;
            endDate: string;
        };
        generatedAt: string;
    }>;
    exportReportData(reportType: string, format?: string, params?: any): Promise<{
        reportType: "products" | "inventory" | "customers" | "sales" | "financial";
        format: string;
        data: any;
        exportedAt: string;
    }>;
    private getDateFilter;
    private getDefaultStartDate;
}
