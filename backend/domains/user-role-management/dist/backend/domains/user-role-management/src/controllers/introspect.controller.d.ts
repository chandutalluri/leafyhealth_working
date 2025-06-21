export declare class IntrospectController {
    getIntrospection(): {
        service: {
            name: string;
            domain: string;
            version: string;
            port: string | number;
            environment: string;
        };
        capabilities: string[];
        endpoints: {
            health: string;
            docs: string;
            introspect: string;
            api: string;
        };
        dependencies: string[];
        events: {
            published: string[];
            subscribed: string[];
        };
        monitoring: {
            metrics: string;
            logging: string;
            tracing: string;
        };
    };
}
