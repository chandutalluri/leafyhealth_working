"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentManagementService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const connection_1 = require("../database/connection");
const schema_1 = require("../../../../../shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
let ContentManagementService = class ContentManagementService {
    constructor(database) {
        this.database = database;
    }
    async getHealthStatus() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'content-management'
        };
    }
    async createContent(createContentDto) {
        const metadata = {
            categoryId: createContentDto.categoryId,
            tags: createContentDto.tags,
            metaDescription: createContentDto.metaDescription
        };
        const result = await connection_1.db.insert(schema_1.contentItems).values({
            title: createContentDto.title,
            content: createContentDto.content,
            type: createContentDto.type,
            status: createContentDto.status || 'draft',
            authorId: createContentDto.authorId,
            metadata: metadata,
            publishedAt: createContentDto.status === 'published' ? new Date() : null
        }).returning();
        return result[0];
    }
    async findAllContent(page = 1, limit = 10, search, type, status) {
        const conditions = [];
        if (search) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema_1.contentItems.title, `%${search}%`), (0, drizzle_orm_1.ilike)(schema_1.contentItems.content, `%${search}%`)));
        }
        if (type) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.contentItems.type, type));
        }
        if (status) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.contentItems.status, status));
        }
        const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        const offset = (page - 1) * limit;
        const results = whereClause
            ? await connection_1.db.select().from(schema_1.contentItems).where(whereClause).limit(limit).offset(offset)
            : await connection_1.db.select().from(schema_1.contentItems).limit(limit).offset(offset);
        const totalCount = whereClause
            ? await connection_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.contentItems).where(whereClause)
            : await connection_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.contentItems);
        return {
            data: results,
            pagination: {
                page,
                limit,
                total: totalCount[0].count,
                pages: Math.ceil(totalCount[0].count / limit)
            }
        };
    }
    async findContentById(id) {
        const result = await connection_1.db.select().from(schema_1.contentItems).where((0, drizzle_orm_1.eq)(schema_1.contentItems.id, id));
        if (result.length === 0) {
            throw new common_1.NotFoundException(`Content with ID ${id} not found`);
        }
        return result[0];
    }
    async updateContent(id, updateContentDto) {
        const existingContent = await this.findContentById(id);
        const updateData = { ...updateContentDto };
        if (updateContentDto.status === 'published' && existingContent.status !== 'published') {
            updateData.publishedAt = new Date();
        }
        const result = await connection_1.db.update(schema_1.contentItems)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.contentItems.id, id))
            .returning();
        return result[0];
    }
    async deleteContent(id) {
        await this.findContentById(id);
        await connection_1.db.delete(schema_1.contentItems).where((0, drizzle_orm_1.eq)(schema_1.contentItems.id, id));
        return { message: 'Content deleted successfully' };
    }
    async createCategory(createCategoryDto) {
        const result = await connection_1.db.insert(schema_1.categories).values({
            name: createCategoryDto.name,
            description: createCategoryDto.description,
            slug: createCategoryDto.slug,
            parentId: createCategoryDto.parentId
        }).returning();
        return result[0];
    }
    async findAllCategories() {
        return await connection_1.db.select().from(schema_1.categories);
    }
    async findCategoryById(id) {
        const result = await connection_1.db.select().from(schema_1.categories).where((0, drizzle_orm_1.eq)(schema_1.categories.id, id));
        if (result.length === 0) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return result[0];
    }
    async updateCategory(id, updateCategoryDto) {
        await this.findCategoryById(id);
        const result = await connection_1.db.update(schema_1.categories)
            .set(updateCategoryDto)
            .where((0, drizzle_orm_1.eq)(schema_1.categories.id, id))
            .returning();
        return result[0];
    }
    async deleteCategory(id) {
        await this.findCategoryById(id);
        await connection_1.db.delete(schema_1.categories).where((0, drizzle_orm_1.eq)(schema_1.categories.id, id));
        return { message: 'Category deleted successfully' };
    }
};
exports.ContentManagementService = ContentManagementService;
exports.ContentManagementService = ContentManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [Object])
], ContentManagementService);
//# sourceMappingURL=content-management.service.js.map