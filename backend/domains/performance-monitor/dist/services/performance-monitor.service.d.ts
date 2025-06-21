import { db } from '../database/connection';
import { CreateMetricDto, UpdateMetricDto } from '../dto/performance-monitor.dto';
export declare class PerformanceMonitorService {
    private database;
    constructor(database: typeof db);
    createMetric(createMetricDto: CreateMetricDto): Promise<{
        id: number;
        serviceName: string;
        metricName: string;
        value: string;
        unit: string;
        timestamp: Date;
        tags: any;
        createdAt: Date;
    }>;
    getAllMetrics(): Promise<any[]>;
    getMetricById(id: number): Promise<{
        id: number;
        serviceName: string;
        metricName: string;
        value: string;
        unit: string;
        timestamp: Date;
        tags: {};
        createdAt: Date;
    }>;
    updateMetric(id: number, updateMetricDto: UpdateMetricDto): Promise<{
        updatedAt: Date;
        serviceName?: string;
        metricName?: string;
        value?: number;
        unit?: string;
        timestamp?: Date;
        tags?: any;
        id: number;
    }>;
    deleteMetric(id: number): Promise<{
        message: string;
        deletedMetric: {
            id: number;
            serviceName: string;
        };
    }>;
    getServiceMetrics(serviceName: string): Promise<any[]>;
    getDashboardOverview(): Promise<{
        totalMetrics: number;
        recentMetrics: any[];
        services: string[];
        lastUpdated: string;
    }>;
    createAlert(alertData: any): Promise<{
        message: string;
        alertId: string;
        alertData: any;
        timestamp: string;
    }>;
}
