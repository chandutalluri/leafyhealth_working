"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const labelTemplates = (0, pg_core_1.pgTable)('label_templates', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 200 }).notNull(),
    templateType: (0, pg_core_1.varchar)('template_type', { length: 100 }).notNull(),
    content: (0, pg_core_1.text)('content').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
const generatedLabels = (0, pg_core_1.pgTable)('generated_labels', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    templateId: (0, pg_core_1.serial)('template_id').notNull(),
    content: (0, pg_core_1.text)('content').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
const printJobs = (0, pg_core_1.pgTable)('print_jobs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    labelId: (0, pg_core_1.serial)('label_id').notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('pending'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const db = (0, node_postgres_1.drizzle)(pool);
let LabelService = class LabelService {
    async createLabel(createLabelDto) {
        const [label] = await db.insert(labelTemplates).values({
            name: createLabelDto.name,
            templateType: createLabelDto.type,
            content: createLabelDto.content,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }).returning();
        return label;
    }
    async getLabels(filters = {}) {
        if (filters.type) {
            return await db.select().from(labelTemplates)
                .where((0, drizzle_orm_1.eq)(labelTemplates.templateType, filters.type));
        }
        return await db.select().from(labelTemplates);
    }
    async getLabelById(id) {
        const [label] = await db.select().from(labelTemplates)
            .where((0, drizzle_orm_1.eq)(labelTemplates.id, id));
        return label;
    }
    async generatePreview(id) {
        const label = await this.getLabelById(id);
        if (!label)
            throw new Error('Label not found');
        return {
            id: label.id,
            preview: label.content,
            type: label.templateType
        };
    }
    async getLabelStats() {
        const totalLabels = await db.select().from(labelTemplates);
        const totalGenerated = await db.select().from(generatedLabels);
        return {
            totalTemplates: totalLabels.length,
            totalGenerated: totalGenerated.length,
            activeTemplates: totalLabels.filter(l => l.isActive).length
        };
    }
};
exports.LabelService = LabelService;
exports.LabelService = LabelService = __decorate([
    (0, common_1.Injectable)()
], LabelService);
//# sourceMappingURL=label.service.js.map