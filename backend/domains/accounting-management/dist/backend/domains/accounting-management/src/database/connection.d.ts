export declare class DatabaseService {
    private db;
    private pool;
    constructor();
    getDatabase(): import("drizzle-orm/node-postgres").NodePgDatabase<Record<string, unknown>> & {
        $client: import("drizzle-orm/node-postgres").NodePgClient;
    };
    closeConnection(): Promise<void>;
}
