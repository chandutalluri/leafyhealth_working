"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enhancedBranches = exports.companies = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.companies = (0, pg_core_1.pgTable)('companies', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    website: (0, pg_core_1.varchar)('website', { length: 255 }),
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    phone: (0, pg_core_1.varchar)('phone', { length: 50 }),
    address: (0, pg_core_1.text)('address'),
    logoUrl: (0, pg_core_1.varchar)('logo_url', { length: 500 }),
    primaryColor: (0, pg_core_1.varchar)('primary_color', { length: 7 }).default('#6366f1'),
    secondaryColor: (0, pg_core_1.varchar)('secondary_color', { length: 7 }).default('#8b5cf6'),
    accentColor: (0, pg_core_1.varchar)('accent_color', { length: 7 }).default('#06b6d4'),
    gstNumber: (0, pg_core_1.varchar)('gst_number', { length: 15 }),
    fssaiLicense: (0, pg_core_1.varchar)('fssai_license', { length: 20 }),
    panNumber: (0, pg_core_1.varchar)('pan_number', { length: 10 }),
    cinNumber: (0, pg_core_1.varchar)('cin_number', { length: 21 }),
    msmeRegistration: (0, pg_core_1.varchar)('msme_registration', { length: 20 }),
    tradeLicense: (0, pg_core_1.varchar)('trade_license', { length: 20 }),
    establishmentYear: (0, pg_core_1.integer)('establishment_year'),
    businessCategory: (0, pg_core_1.varchar)('business_category', { length: 100 }),
    complianceDetails: (0, pg_core_1.jsonb)('compliance_details'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.enhancedBranches = (0, pg_core_1.pgTable)('enhanced_branches', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    companyId: (0, pg_core_1.uuid)('company_id').notNull().references(() => exports.companies.id),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    address: (0, pg_core_1.text)('address').notNull(),
    latitude: (0, pg_core_1.varchar)('latitude', { length: 20 }),
    longitude: (0, pg_core_1.varchar)('longitude', { length: 20 }),
    language: (0, pg_core_1.varchar)('language', { length: 10 }).default('en'),
    phone: (0, pg_core_1.varchar)('phone', { length: 50 }),
    whatsappNumber: (0, pg_core_1.varchar)('whatsapp_number', { length: 50 }),
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    managerName: (0, pg_core_1.varchar)('manager_name', { length: 255 }),
    operatingHours: (0, pg_core_1.jsonb)('operating_hours'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
//# sourceMappingURL=company-management.entity.js.map