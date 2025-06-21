export declare class HealthController {
    health(): {
        status: string;
        service: string;
        timestamp: string;
        uptime: number;
        version: string;
    };
    root(): {
        service: string;
        version: string;
        status: string;
        endpoints: {
            health: string;
            docs: string;
            introspect: string;
        };
    };
    introspect(): {
        service: string;
        version: string;
        description: string;
        capabilities: string[];
        endpoints: {
            expenses: {
                'POST /expenses': string;
                'GET /expenses': string;
                'GET /expenses/category/:category': string;
                'GET /expenses/date-range': string;
                'GET /expenses/:id': string;
                'PUT /expenses/:id': string;
                'DELETE /expenses/:id': string;
            };
            budgets: {
                'POST /budgets': string;
                'GET /budgets': string;
                'GET /budgets/active': string;
                'GET /budgets/:id': string;
                'PUT /budgets/:id': string;
                'DELETE /budgets/:id': string;
            };
            analytics: {
                'GET /analytics/spending-trends': string;
                'GET /analytics/budget-variance': string;
                'GET /analytics/category-breakdown': string;
                'GET /analytics/cost-center-analysis': string;
                'GET /analytics/dashboard': string;
            };
        };
        database: {
            connected: boolean;
            tables: string[];
        };
        features: string[];
    };
}
