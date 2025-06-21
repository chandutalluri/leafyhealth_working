"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notification_service_subscriptions = exports.notification_service_channels = exports.notification_service_templates = exports.notification_service_notifications = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.notification_service_notifications = (0, pg_core_1.pgTable)('notification_service_notifications', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.notification_service_templates = (0, pg_core_1.pgTable)('notification_service_templates', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.notification_service_channels = (0, pg_core_1.pgTable)('notification_service_channels', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.notification_service_subscriptions = (0, pg_core_1.pgTable)('notification_service_subscriptions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map