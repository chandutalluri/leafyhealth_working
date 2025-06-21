export declare class StandaloneImageService {
    private readonly logger;
    private readonly imagesData;
    private idCounter;
    uploadImage(file: any, uploadData?: any): Promise<{
        success: boolean;
        id: number;
        filename: string;
        url: string;
        thumbnailUrl: string;
        message: string;
    }>;
    getImages(query?: any): Promise<{
        images: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getImageById(id: number): Promise<any>;
    getImagesByEntity(entityType: string, entityId: number): Promise<{
        images: any[];
        total: number;
        entityType: string;
        entityId: number;
    }>;
    serveImage(filename: string, variant?: string): Promise<{
        filename: string;
        variant: string;
        mimeType: string;
        served: boolean;
        timestamp: string;
    }>;
    updateImage(id: number, updateData: any): Promise<any>;
    deleteImage(id: number): Promise<{
        success: boolean;
        message: string;
        deletedImage: any;
    }>;
    bulkDelete(ids: number[]): Promise<{
        success: boolean;
        deleted: number;
        notFound: number;
        deletedImages: any[];
        notFoundIds: any[];
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
}
