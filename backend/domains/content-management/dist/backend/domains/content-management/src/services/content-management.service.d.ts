import { db } from '../database/connection';
import { CreateContentDto, UpdateContentDto, CreateCategoryDto, UpdateCategoryDto } from '../dto/content-management.dto';
export declare class ContentManagementService {
    private database;
    constructor(database: typeof db);
    getHealthStatus(): Promise<{
        status: string;
        timestamp: string;
        service: string;
    }>;
    createContent(createContentDto: CreateContentDto): Promise<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: unknown;
        type: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        publishedAt: Date;
        authorId: number;
    }>;
    findAllContent(page?: number, limit?: number, search?: string, type?: string, status?: string): Promise<{
        data: {
            id: number;
            title: string;
            slug: string;
            type: string;
            content: string;
            excerpt: string;
            status: string;
            publishedAt: Date;
            metadata: unknown;
            authorId: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findContentById(id: number): Promise<{
        id: number;
        title: string;
        slug: string;
        type: string;
        content: string;
        excerpt: string;
        status: string;
        publishedAt: Date;
        metadata: unknown;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateContent(id: number, updateContentDto: UpdateContentDto): Promise<{
        id: number;
        title: string;
        slug: string;
        type: string;
        content: string;
        excerpt: string;
        status: string;
        publishedAt: Date;
        metadata: unknown;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteContent(id: number): Promise<{
        message: string;
    }>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<any>;
    findAllCategories(): Promise<{
        [x: string]: any;
    }[]>;
    findCategoryById(id: number): Promise<{
        [x: string]: any;
    }>;
    updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<{
        [x: string]: any;
    }>;
    deleteCategory(id: number): Promise<{
        message: string;
    }>;
}
