export declare class CreateCategoryDto {
    name: string;
    description?: string;
    parentId?: number;
    imageUrl?: string;
}
export declare class UpdateCategoryDto {
    name?: string;
    description?: string;
    parentId?: number;
    imageUrl?: string;
    isActive?: boolean;
}
export declare class CreateProductDto {
    name: string;
    description?: string;
    sku: string;
    price: number;
    costPrice?: number;
    categoryId: number;
    tags?: string[];
    images?: string[];
    unit?: string;
    weight?: number;
    barcode?: string;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    sku?: string;
    price?: number;
    costPrice?: number;
    categoryId?: number;
    tags?: string[];
    images?: string[];
    unit?: string;
    weight?: number;
    barcode?: string;
    isActive?: boolean;
}
