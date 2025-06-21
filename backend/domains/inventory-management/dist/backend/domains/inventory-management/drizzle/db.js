"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.checkConnection = checkConnection;
exports.closeConnection = closeConnection;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema = require("./schema");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/leafyhealth',
});
exports.db = (0, node_postgres_1.drizzle)(pool, { schema });
async function checkConnection() {
    try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        return true;
    }
    catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}
async function closeConnection() {
    await pool.end();
}
//# sourceMappingURL=db.js.map