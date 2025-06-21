import { Pool } from 'pg';
import * as schema from "../entities/company-management.entity";
export declare const pool: Pool;
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: Pool;
};
