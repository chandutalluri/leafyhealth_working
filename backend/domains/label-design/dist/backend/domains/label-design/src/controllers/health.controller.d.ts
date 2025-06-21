export declare class HealthController {
    healthCheck(): Promise<{
        status: string;
        service: string;
        timestamp: string;
        uptime: number;
        version: string;
    }>;
    getRoot(): Promise<{
        service: string;
        version: string;
        documentation: string;
        health: string;
    }>;
    introspect(): Promise<{
        service: string;
        version: string;
        capabilities: string[];
        endpoints: {
            labels: string;
            templates: string;
            barcodes: string;
            printing: string;
            compliance: string;
            health: string;
            docs: string;
        };
        port: number;
    }>;
}
