"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analytics_reporting_charts = exports.analytics_reporting_dashboards = exports.analytics_reporting_metrics = exports.analytics_reporting_reports = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.analytics_reporting_reports = (0, pg_core_1.pgTable)('analytics_reporting_reports', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.analytics_reporting_metrics = (0, pg_core_1.pgTable)('analytics_reporting_metrics', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.analytics_reporting_dashboards = (0, pg_core_1.pgTable)('analytics_reporting_dashboards', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.analytics_reporting_charts = (0, pg_core_1.pgTable)('analytics_reporting_charts', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map