export declare class HealthController {
    getHealth(): {
        status: string;
        service: string;
        timestamp: string;
        uptime: number;
        memory: NodeJS.MemoryUsage;
        environment: string;
    };
    getRoot(): {
        service: string;
        version: string;
        status: string;
        documentation: string;
    };
    getIntrospection(): {
        service: string;
        version: string;
        capabilities: string[];
        endpoints: {
            health: string;
            payments: string;
            verification: string;
            webhooks: string;
            analytics: string;
        };
        gateways: string[];
        database: string;
    };
}
