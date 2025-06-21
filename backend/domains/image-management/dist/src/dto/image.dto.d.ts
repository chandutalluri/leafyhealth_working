export declare class CreateImageDto {
    altText: string;
    description?: string;
    category?: string;
    tags?: string[];
    entityType?: string;
    entityId?: number;
    isPublic?: boolean;
    isFeatured?: boolean;
    seoAltText?: string;
    metadata?: Record<string, any>;
}
export declare class UpdateImageDto {
    altText?: string;
    description?: string;
    category?: string;
    tags?: string[];
    isPublic?: boolean;
    isFeatured?: boolean;
    seoAltText?: string;
    metadata?: Record<string, any>;
    optimizedSizes?: Record<string, any>;
}
export declare class ImageQueryDto {
    page?: number;
    limit?: number;
    category?: string;
    entityType?: string;
    entityId?: number;
    search?: string;
    isFeatured?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
