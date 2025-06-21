export declare class HealthController {
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        service: string;
        port: string | number;
        version: string;
        checks: {
            memory: string;
        };
        uptime: number;
        memory: NodeJS.MemoryUsage;
    }>;
    root(): {
        service: string;
        message: string;
        endpoints: {
            health: string;
            docs: string;
            introspect: string;
            users: string;
            roles: string;
        };
    };
    private checkMemory;
}
