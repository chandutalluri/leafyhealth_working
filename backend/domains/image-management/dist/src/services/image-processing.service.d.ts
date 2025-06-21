export interface ImageVariantConfig {
    width: number;
    height?: number;
    quality: number;
    format: 'jpeg' | 'png' | 'webp';
    suffix: string;
}
export interface ProcessedImage {
    variant: string;
    path: string;
    url: string;
    width: number;
    height: number;
    size: number;
    format: string;
    quality: number;
}
export declare class ImageProcessingService {
    private readonly logger;
    private readonly baseUrl;
    private readonly variants;
    processImage(tempFilePath: string, originalName: string, options?: {
        generateWebP?: boolean;
        generateThumbnails?: boolean;
        category?: string;
    }): Promise<{
        original: ProcessedImage;
        variants: ProcessedImage[];
        thumbnailUrl?: string;
    }>;
    deleteImage(imagePath: string, variants?: any[]): Promise<void>;
    getImageDimensions(filePath: string): Promise<{
        width: number;
        height: number;
    }>;
    private generateFileHash;
    optimizeImage(filePath: string, options?: {
        quality?: number;
        format?: 'jpeg' | 'png' | 'webp';
        width?: number;
        height?: number;
    }): Promise<string>;
}
