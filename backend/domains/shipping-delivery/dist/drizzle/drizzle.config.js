"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    schema: './schema.ts',
    out: './migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/leafyhealth',
    },
    tablesFilter: ['shipping_delivery_*'],
};
//# sourceMappingURL=drizzle.config.js.map