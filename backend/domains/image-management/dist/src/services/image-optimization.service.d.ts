export interface OptimizationOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
}
export interface OptimizedImage {
    buffer: Buffer;
    format: string;
    width: number;
    height: number;
    size: number;
}
export declare class ImageOptimizationService {
    private readonly uploadsPath;
    optimizeImage(inputPath: string, options?: OptimizationOptions): Promise<OptimizedImage>;
    createThumbnail(inputPath: string, size?: number): Promise<OptimizedImage>;
    createResponsiveVariants(inputPath: string): Promise<{
        thumbnail: OptimizedImage;
        medium: OptimizedImage;
        large: OptimizedImage;
    }>;
    validateImage(filePath: string): Promise<boolean>;
    getMimeType(filename: string): string;
    formatBytes(bytes: number): string;
}
