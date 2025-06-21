"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employee_management_performance = exports.employee_management_departments = exports.employee_management_positions = exports.employee_management_employees = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.employee_management_employees = (0, pg_core_1.pgTable)('employee_management_employees', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.employee_management_positions = (0, pg_core_1.pgTable)('employee_management_positions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.employee_management_departments = (0, pg_core_1.pgTable)('employee_management_departments', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.employee_management_performance = (0, pg_core_1.pgTable)('employee_management_performance', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map