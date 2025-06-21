"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.company_management_departments = exports.company_management_branches = exports.company_management_companies = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.company_management_companies = (0, pg_core_1.pgTable)('company_management_companies', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.company_management_branches = (0, pg_core_1.pgTable)('company_management_branches', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.company_management_departments = (0, pg_core_1.pgTable)('company_management_departments', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map