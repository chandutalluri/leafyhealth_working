import { Pool } from 'pg';
export declare class DatabaseConnection {
    private static instance;
    private pool;
    private db;
    private isConnected;
    private constructor();
    static getInstance(): DatabaseConnection;
    private initializeConnection;
    getDatabase(): any;
    getPool(): Pool;
    isHealthy(): boolean;
    healthCheck(): Promise<{
        status: string;
        environment: string;
        timestamp: string;
        poolStats: {
            total: number;
            idle: number;
            waiting: number;
        };
    }>;
    close(): Promise<void>;
}
export declare const databaseConnection: DatabaseConnection;
export declare const db: any;
export * from '../schema';
