export declare class HealthController {
    checkHealth(): Promise<{
        status: string;
        service: string;
        timestamp: string;
        database: {
            status: string;
            message: string;
        };
        version: string;
        error?: undefined;
    } | {
        status: string;
        service: string;
        timestamp: string;
        error: any;
        version: string;
        database?: undefined;
    }>;
    getRoot(): {
        service: string;
        version: string;
        status: string;
        endpoints: {
            health: string;
            compliance: string;
            docs: string;
        };
    };
    getIntrospection(): {
        service: string;
        version: string;
        description: string;
        endpoints: string[];
        database: string;
        port: number;
    };
}
