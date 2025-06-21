export interface ImageRecord {
    id: number;
    filename: string;
    originalFilename: string;
    path: string;
    sizeBytes: number;
    mimeType: string;
    width?: number;
    height?: number;
    altText?: string;
    description?: string;
    tags?: string[];
    entityType?: string;
    entityId?: number;
    uploadedBy?: number;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class ImageService {
    private readonly uploadsPath;
    findAll(): Promise<ImageRecord[]>;
    findById(id: number): Promise<ImageRecord | null>;
    findByFilename(filename: string): Promise<ImageRecord | null>;
    getImageStream(filename: string): Promise<import("fs").ReadStream>;
    getImageStats(): Promise<{
        total: number;
        totalSize: number;
        byCategory: {};
        byEntityType: {};
        recent: ImageRecord[];
    }>;
    private getCategoryBreakdown;
    private getEntityTypeBreakdown;
    formatBytes(bytes: number): string;
}
