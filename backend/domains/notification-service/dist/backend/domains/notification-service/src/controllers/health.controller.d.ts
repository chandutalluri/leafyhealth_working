export declare class HealthController {
    health(): {
        status: string;
        service: string;
        timestamp: string;
        uptime: number;
    };
    root(): {
        service: string;
        version: string;
        status: string;
        endpoints: {
            health: string;
            notifications: string;
            documentation: string;
        };
    };
}
