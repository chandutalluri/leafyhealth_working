import { Response } from 'express';
import { ImageManagementService } from './image-management.service';
export declare class ImageManagementController {
    private readonly imageService;
    private readonly logger;
    constructor(imageService: ImageManagementService);
    healthCheck(): Promise<{
        status: string;
        service: string;
        timestamp: string;
        version: string;
        port: string | number;
        features: string[];
    }>;
    uploadImage(file: any, uploadDto: {
        entityType?: string;
        entityId?: number;
        category?: string;
        description?: string;
        tags?: string;
        isPublic?: boolean;
    }): Promise<any>;
    uploadMultipleImages(files: any[], uploadDto: {
        entityType?: string;
        entityId?: number;
        category?: string;
        description?: string;
        tags?: string;
        isPublic?: boolean;
    }): Promise<{
        error: string;
        total?: undefined;
        successful?: undefined;
        failed?: undefined;
        results?: undefined;
    } | {
        total: number;
        successful: number;
        failed: number;
        results: any[];
        error?: undefined;
    }>;
    getImages(query: {
        page?: number;
        limit?: number;
        category?: string;
        entityType?: string;
        entityId?: number;
        isPublic?: boolean;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<any>;
    getImageStats(): Promise<any>;
    getImageAnalytics(query: {
        period?: string;
        entityType?: string;
        category?: string;
    }): Promise<any>;
    getImagesByEntity(entityType: string, entityId: number, query: {
        category?: string;
        isPublic?: boolean;
        limit?: number;
    }): Promise<any>;
    serveImage(filename: string, variant?: string, quality?: number, format?: string, res?: Response): Promise<any>;
    getImageVariants(filename: string): Promise<any>;
    getImageById(id: number): Promise<{
        id: number;
        size: number;
        width: number;
        height: number;
        tags: string;
        description: string;
        entityType: string;
        filename: string;
        path: string;
        mimeType: string;
        entityId: number;
        updatedAt: Date;
        originalName: string;
        category: string;
        isPublic: boolean;
        variants: string[];
        uploadedAt: Date;
    }>;
    updateImage(id: number, updateDto: {
        description?: string;
        category?: string;
        tags?: string;
        isPublic?: boolean;
        entityType?: string;
        entityId?: number;
    }): Promise<{
        id: number;
        size: number;
        width: number;
        height: number;
        tags: string;
        description: string;
        entityType: string;
        filename: string;
        path: string;
        mimeType: string;
        entityId: number;
        updatedAt: Date;
        originalName: string;
        category: string;
        isPublic: boolean;
        variants: string[];
        uploadedAt: Date;
    }>;
    deleteImage(id: number): Promise<any>;
    bulkDeleteImages(ids: number[]): Promise<any>;
    reprocessImage(id: number): Promise<any>;
    createBackup(includeFiles?: boolean): Promise<any>;
}
