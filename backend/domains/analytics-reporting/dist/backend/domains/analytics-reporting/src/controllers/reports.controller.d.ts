import { ReportsService } from '../services/reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generateSalesReport(startDate?: string, endDate?: string): Promise<{
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
    generateFinancialReport(startDate?: string, endDate?: string): Promise<{
        revenue: any;
        paymentMethods: any;
        period: {
            startDate: string;
            endDate: string;
        };
        generatedAt: string;
    }>;
    exportReport(type: string, format?: string, startDate?: string, endDate?: string, period?: string): Promise<{
        reportType: "products" | "inventory" | "customers" | "sales" | "financial";
        format: string;
        data: any;
        exportedAt: string;
    }>;
    getIntrospection(): {
        service: string;
        version: string;
        capabilities: string[];
        endpoints: {
            'GET /reports/sales': string;
            'GET /reports/customers': string;
            'GET /reports/inventory': string;
            'GET /reports/products': string;
            'GET /reports/financial': string;
            'GET /reports/export': string;
        };
        database: string;
        timestamp: string;
    };
    private getDefaultStartDate;
}
