import { ContentManagementService } from '../services/content-management.service';
import { CreateContentDto, UpdateContentDto, CreateCategoryDto, UpdateCategoryDto } from '../dto/content-management.dto';
export declare class ContentManagementController {
    private readonly contentManagementService;
    constructor(contentManagementService: ContentManagementService);
    getHealth(): Promise<{
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
    getAllContent(page?: string, limit?: string, search?: string, type?: string, status?: string): Promise<{
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
    getContentById(id: string): Promise<{
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
    updateContent(id: string, updateContentDto: UpdateContentDto): Promise<{
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
    deleteContent(id: string): Promise<{
        message: string;
    }>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<any>;
    getAllCategories(): Promise<{
        [x: string]: any;
    }[]>;
    getCategoryById(id: string): Promise<{
        [x: string]: any;
    }>;
    updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        [x: string]: any;
    }>;
    deleteCategory(id: string): Promise<{
        message: string;
    }>;
}
