"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.databaseConnection = exports.DatabaseConnection = void 0;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema = require("../schema");
class DatabaseConnection {
    constructor() {
        this.isConnected = false;
        this.initializeConnection();
    }
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    initializeConnection() {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error('DATABASE_URL must be set');
        }
        console.log('🔗 Database connected to PostgreSQL');
        this.pool = new pg_1.Pool({
            connectionString,
            max: 20,
            min: 2,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
            statement_timeout: 30000,
            query_timeout: 30000,
        });
        this.db = (0, node_postgres_1.drizzle)(this.pool, { schema });
        this.pool.on('connect', () => {
            this.isConnected = true;
            console.log('✅ Database connection established');
        });
        this.pool.on('error', (err) => {
            console.error('❌ Database connection error:', err);
            this.isConnected = false;
        });
        this.pool.on('remove', () => {
            console.log('🔄 Database connection removed from pool');
        });
    }
    getDatabase() {
        if (!this.db) {
            throw new Error('Database not initialized');
        }
        return this.db;
    }
    getPool() {
        return this.pool;
    }
    isHealthy() {
        return this.isConnected && this.pool.totalCount > 0;
    }
    async healthCheck() {
        try {
            const result = await this.db.execute('SELECT 1 as health_check');
            const environment = process.env.NODE_ENV || 'development';
            return {
                status: 'healthy',
                environment,
                timestamp: new Date().toISOString(),
                poolStats: {
                    total: this.pool.totalCount,
                    idle: this.pool.idleCount,
                    waiting: this.pool.waitingCount
                }
            };
        }
        catch (error) {
            console.error('Database health check failed:', error);
            return {
                status: 'unhealthy',
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString(),
                poolStats: {
                    total: 0,
                    idle: 0,
                    waiting: 0
                }
            };
        }
    }
    async close() {
        if (this.pool) {
            await this.pool.end();
            console.log('🔒 Database connection pool closed');
        }
    }
}
exports.DatabaseConnection = DatabaseConnection;
exports.databaseConnection = DatabaseConnection.getInstance();
exports.db = exports.databaseConnection.getDatabase();
__exportStar(require("../schema"), exports);
//# sourceMappingURL=connection.js.map