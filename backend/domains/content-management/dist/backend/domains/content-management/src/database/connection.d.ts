import { Pool } from 'pg';
import * as schema from '../../../../../shared/schema';
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: Pool;
};
