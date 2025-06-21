import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { db } from '../database/connection';
import { contentItems, categories } from '../../../../../shared/schema';
import { CreateContentDto, UpdateContentDto, CreateCategoryDto, UpdateCategoryDto } from '../dto/content-management.dto';
import { eq, and, or, ilike, sql } from 'drizzle-orm';

@Injectable()
export class ContentManagementService {
  constructor(@Inject('DATABASE_CONNECTION') private database: typeof db) {}

  async getHealthStatus() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'content-management'
    };
  }

  // Content methods
  async createContent(createContentDto: CreateContentDto) {
    const metadata = {
      categoryId: createContentDto.categoryId,
      tags: createContentDto.tags,
      metaDescription: createContentDto.metaDescription
    };

    const result = await db.insert(contentItems).values({
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

  async findAllContent(page: number = 1, limit: number = 10, search?: string, type?: string, status?: string) {
    // Build dynamic filters
    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(contentItems.title, `%${search}%`),
          ilike(contentItems.content, `%${search}%`)
        )
      );
    }
    if (type) {
      conditions.push(eq(contentItems.type, type));
    }
    if (status) {
      conditions.push(eq(contentItems.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (page - 1) * limit;
    
    const results = whereClause 
      ? await db.select().from(contentItems).where(whereClause).limit(limit).offset(offset)
      : await db.select().from(contentItems).limit(limit).offset(offset);
    
    const totalCount = whereClause
      ? await db.select({ count: sql<number>`count(*)` }).from(contentItems).where(whereClause)
      : await db.select({ count: sql<number>`count(*)` }).from(contentItems);

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

  async findContentById(id: number) {
    const result = await db.select().from(contentItems).where(eq(contentItems.id, id));
    if (result.length === 0) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return result[0];
  }

  async updateContent(id: number, updateContentDto: UpdateContentDto) {
    const existingContent = await this.findContentById(id);
    
    const updateData: any = { ...updateContentDto };
    if (updateContentDto.status === 'published' && existingContent.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    const result = await db.update(contentItems)
      .set(updateData)
      .where(eq(contentItems.id, id))
      .returning();

    return result[0];
  }

  async deleteContent(id: number) {
    await this.findContentById(id); // Verify exists
    
    await db.delete(contentItems).where(eq(contentItems.id, id));
    return { message: 'Content deleted successfully' };
  }

  // Category methods
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const result = await db.insert(categories).values({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
      slug: createCategoryDto.slug,
      parentId: createCategoryDto.parentId
    }).returning();

    return result[0];
  }

  async findAllCategories() {
    return await db.select().from(categories);
  }

  async findCategoryById(id: number) {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    if (result.length === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return result[0];
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findCategoryById(id); // Verify exists
    
    const result = await db.update(categories)
      .set(updateCategoryDto)
      .where(eq(categories.id, id))
      .returning();

    return result[0];
  }

  async deleteCategory(id: number) {
    await this.findCategoryById(id); // Verify exists
    
    await db.delete(categories).where(eq(categories.id, id));
    return { message: 'Category deleted successfully' };
  }
}