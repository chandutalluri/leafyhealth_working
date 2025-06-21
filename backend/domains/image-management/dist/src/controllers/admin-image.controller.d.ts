import { Response } from 'express';
import { ImageService, ImageRecord } from '../services/image.service';
import { ImageOptimizationService } from '../services/image-optimization.service';
export declare class AdminImageController {
    private readonly imageService;
    private readonly imageOptimizationService;
    constructor(imageService: ImageService, imageOptimizationService: ImageOptimizationService);
    health(): {
        status: string;
        service: string;
        timestamp: string;
    };
    getAllImages(page?: number, limit?: number, entityType?: string, search?: string): Promise<{
        images: ImageRecord[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
        filters: {
            entityType: string;
            search: string;
        };
    }>;
    getImageById(id: number): Promise<ImageRecord>;
    serveImage(filename: string, res: Response): Promise<void>;
    getStats(): Promise<{
        formattedTotalSize: string;
        timestamp: string;
        total: number;
        totalSize: number;
        byCategory: {};
        byEntityType: {};
        recent: ImageRecord[];
    }>;
    uploadImage(file: Express.Multer.File, metadata: {
        altText?: string;
        description?: string;
        entityType?: string;
        entityId?: number;
        tags?: string;
    }): Promise<{
        success: boolean;
        image: Partial<ImageRecord>;
        variants: {
            thumbnail: {
                size: number;
                dimensions: string;
            };
            medium: {
                size: number;
                dimensions: string;
            };
            large: {
                size: number;
                dimensions: string;
            };
        };
        message: string;
    }>;
    updateImage(id: number, updateData: {
        altText?: string;
        description?: string;
        tags?: string[];
        entityType?: string;
        entityId?: number;
    }): Promise<{
        success: boolean;
        image: {
            updatedAt: Date;
            altText?: string;
            description?: string;
            tags?: string[];
            entityType?: string;
            entityId?: number;
            id: number;
            filename: string;
            originalFilename: string;
            path: string;
            sizeBytes: number;
            mimeType: string;
            width?: number;
            height?: number;
            uploadedBy?: number;
            createdAt: Date;
        };
        message: string;
    }>;
    deleteImage(id: number): Promise<{
        success: boolean;
        message: string;
        deletedImage: {
            id: number;
            filename: string;
        };
    }>;
    generateVariants(id: number, options: {
        sizes?: Array<{
            width: number;
            height: number;
            name: string;
        }>;
        formats?: Array<'jpeg' | 'png' | 'webp'>;
    }): Promise<{
        success: boolean;
        variants: {
            thumbnail: import("../services/image-optimization.service").OptimizedImage;
            medium: import("../services/image-optimization.service").OptimizedImage;
            large: import("../services/image-optimization.service").OptimizedImage;
        };
        message: string;
    }>;
    getImageUsage(id: number): Promise<{
        image: ImageRecord;
        usage: {
            entityType: string;
            entityId: number;
            location: string;
            lastAccessed: Date;
        }[];
        totalUsageCount: number;
    }>;
}
