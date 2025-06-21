export declare class SimpleImageController {
    private readonly logger;
    healthCheck(): Promise<{
        status: string;
        service: string;
        timestamp: string;
        version: string;
    }>;
    getImages(): Promise<{
        images: any[];
        total: number;
        message: string;
    }>;
    uploadImage(uploadData: any): Promise<{
        success: boolean;
        message: string;
        filename: string;
        url: string;
    }>;
    getStats(): Promise<{
        totalImages: number;
        totalSize: number;
        variants: number;
        service: string;
    }>;
}
