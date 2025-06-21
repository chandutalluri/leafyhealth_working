import { ConfigService } from '@nestjs/config';
import { ImageRecord } from './database/drizzle';
export interface ImageVariant {
    type: string;
    filename: string;
    width: number;
    height: number;
    size: number;
    quality: number;
}
export declare class ImageManagementService {
    private configService;
    private readonly logger;
    private readonly uploadPath;
    private readonly variantPath;
    private readonly tempPath;
    private readonly variants;
    constructor(configService: ConfigService);
    private ensureDirectories;
    private generateImageVariants;
    uploadImage(file: any, uploadDto: any): Promise<any>;
    getImages(query: any): Promise<any>;
    getImageStats(): Promise<any>;
    getImageAnalytics(query: any): Promise<any>;
    getImagesByEntity(entityType: string, entityId: number, query: any): Promise<any>;
    serveImage(filename: string, options?: any): Promise<any>;
    getImageVariants(filename: string): Promise<any>;
    getImageById(id: number): Promise<ImageRecord>;
    updateImage(id: number, updateDto: any): Promise<ImageRecord>;
    deleteImage(id: number): Promise<any>;
    bulkDelete(ids: number[]): Promise<any>;
    reprocessImage(id: number): Promise<any>;
    createBackup(includeFiles?: boolean): Promise<any>;
    private isImageFile;
    private getMimeType;
}
