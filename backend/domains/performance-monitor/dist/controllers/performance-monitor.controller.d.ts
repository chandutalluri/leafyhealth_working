import { PerformanceMonitorService } from '../services/performance-monitor.service';
import { CreateMetricDto, UpdateMetricDto } from '../dto/performance-monitor.dto';
export declare class PerformanceMonitorController {
    private readonly performanceMonitorService;
    constructor(performanceMonitorService: PerformanceMonitorService);
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        service: string;
    }>;
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
    getMetrics(): Promise<any[]>;
    getMetric(id: string): Promise<{
        id: number;
        serviceName: string;
        metricName: string;
        value: string;
        unit: string;
        timestamp: Date;
        tags: {};
        createdAt: Date;
    }>;
    updateMetric(id: string, updateMetricDto: UpdateMetricDto): Promise<{
        updatedAt: Date;
        serviceName?: string;
        metricName?: string;
        value?: number;
        unit?: string;
        timestamp?: Date;
        tags?: any;
        id: number;
    }>;
    deleteMetric(id: string): Promise<{
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
