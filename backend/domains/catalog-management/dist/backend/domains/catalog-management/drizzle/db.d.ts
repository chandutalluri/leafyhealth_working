import { Pool } from 'pg';
import * as schema from './schema';
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: Pool;
};
export declare function checkConnection(): Promise<boolean>;
export declare function closeConnection(): Promise<void>;
