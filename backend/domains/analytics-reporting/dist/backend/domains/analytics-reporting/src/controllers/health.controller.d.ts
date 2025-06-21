export declare class HealthController {
    getHealth(): {
        status: string;
        service: string;
        timestamp: string;
        uptime: number;
    };
    getRoot(): {
        service: string;
        version: string;
        description: string;
        endpoints: {
            health: string;
            docs: string;
            analytics: string;
            reports: string;
        };
    };
}
