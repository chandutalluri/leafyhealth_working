import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb, integer } from 'drizzle-orm/pg-core';

// Companies table - Single company system  
export const companies = pgTable('companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  website: varchar('website', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  logoUrl: varchar('logo_url', { length: 500 }),
  primaryColor: varchar('primary_color', { length: 7 }).default('#6366f1'),
  secondaryColor: varchar('secondary_color', { length: 7 }).default('#8b5cf6'),
  accentColor: varchar('accent_color', { length: 7 }).default('#06b6d4'),
  gstNumber: varchar('gst_number', { length: 15 }),
  fssaiLicense: varchar('fssai_license', { length: 20 }),
  panNumber: varchar('pan_number', { length: 10 }),
  cinNumber: varchar('cin_number', { length: 21 }),
  msmeRegistration: varchar('msme_registration', { length: 20 }),
  tradeLicense: varchar('trade_license', { length: 20 }),
  establishmentYear: integer('establishment_year'),
  businessCategory: varchar('business_category', { length: 100 }),
  complianceDetails: jsonb('compliance_details'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Enhanced branches table - directly under company (no separate brands)
export const enhancedBranches = pgTable('enhanced_branches', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').notNull().references(() => companies.id),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  latitude: varchar('latitude', { length: 20 }),
  longitude: varchar('longitude', { length: 20 }),
  language: varchar('language', { length: 10 }).default('en'),
  phone: varchar('phone', { length: 50 }),
  whatsappNumber: varchar('whatsapp_number', { length: 50 }),
  email: varchar('email', { length: 255 }),
  managerName: varchar('manager_name', { length: 255 }),
  operatingHours: jsonb('operating_hours'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Types
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type Branch = typeof enhancedBranches.$inferSelect;
export type NewBranch = typeof enhancedBranches.$inferInsert;