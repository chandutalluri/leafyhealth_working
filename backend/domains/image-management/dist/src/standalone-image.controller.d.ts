import { Response } from 'express';
import { StandaloneImageService } from './standalone-image.service';
export declare class StandaloneImageController {
    private readonly imageService;
    private readonly logger;
    constructor(imageService: StandaloneImageService);
    healthCheck(): Promise<{
        status: string;
        service: string;
        timestamp: string;
        version: string;
        features: string[];
    }>;
    uploadImage(file: any, uploadDto: any): Promise<{
        success: boolean;
        id: number;
        filename: string;
        url: string;
        thumbnailUrl: string;
        message: string;
    }>;
    uploadMultipleImages(files: any[], uploadDto: any): Promise<{
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
    getImages(query: any): Promise<{
        images: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getImageStats(): Promise<{
        totalImages: number;
        totalSize: any;
        averageSize: number;
        categoryCounts: any;
        entityTypeCounts: any;
        serviceStatus: string;
        lastUpdated: string;
    }>;
    getImagesByEntity(entityType: string, entityId: number): Promise<{
        images: any[];
        total: number;
        entityType: string;
        entityId: number;
    }>;
    serveImage(filename: string, variant?: string, res?: Response): Promise<{
        filename: string;
        variant: string;
        mimeType: string;
        served: boolean;
        timestamp: string;
    }>;
    serveImageVariant(filename: string, res?: Response): Promise<{
        filename: string;
        variant: string;
        mimeType: string;
        served: boolean;
        timestamp: string;
    }>;
    getImageById(id: number): Promise<any>;
    updateImage(id: number, updateDto: any): Promise<any>;
    deleteImage(id: number): Promise<{
        success: boolean;
        message: string;
        deletedImage: any;
    }>;
    bulkDeleteImages(ids: number[]): Promise<{
        success: boolean;
        deleted: number;
        notFound: number;
        deletedImages: any[];
        notFoundIds: any[];
    }>;
}
