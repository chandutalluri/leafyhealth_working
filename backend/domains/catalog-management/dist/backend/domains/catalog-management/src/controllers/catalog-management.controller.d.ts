import { CatalogManagementService } from '../services/catalog-management.service';
import { CreateCategoryDto, UpdateCategoryDto, CreateProductDto, UpdateProductDto } from '../dto/catalog-management.dto';
export declare class CatalogManagementController {
    private readonly catalogManagementService;
    constructor(catalogManagementService: CatalogManagementService);
    getHealth(): {
        status: string;
        service: string;
        timestamp: string;
    };
    createCategory(createCategoryDto: CreateCategoryDto): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    getAllCategories(): Promise<{
        success: boolean;
        data: {
            [x: string]: any;
        }[];
        count: number;
    }>;
    getCategoryHierarchy(): Promise<{
        success: boolean;
        data: any;
        count: any;
    }>;
    getCategoryById(id: number): Promise<{
        success: boolean;
        data: {
            [x: string]: any;
        };
    }>;
    updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<{
        success: boolean;
        data: {
            [x: string]: any;
        };
        message: string;
    }>;
    deleteCategory(id: number): Promise<{
        success: boolean;
        data: any;
    }>;
    createProduct(createProductDto: CreateProductDto): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            metadata: unknown;
            description: string;
            sku: string;
            barcode: string;
            categoryId: number;
            price: string;
            costPrice: string;
            weight: string;
            unit: string;
            stockQuantity: number;
            minStockLevel: number;
            maxStockLevel: number;
            isFeatured: boolean;
            taxRate: string;
            expiryDate: Date;
            batchNumber: string;
            nutritionalInfo: unknown;
            allergens: unknown;
            tags: unknown;
            images: unknown;
            createdBy: number;
        };
        message: string;
    }>;
    getAllProducts(): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            description: string;
            sku: string;
            barcode: string;
            categoryId: number;
            price: string;
            costPrice: string;
            weight: string;
            unit: string;
            stockQuantity: number;
            minStockLevel: number;
            maxStockLevel: number;
            isActive: boolean;
            isFeatured: boolean;
            taxRate: string;
            expiryDate: Date;
            batchNumber: string;
            nutritionalInfo: unknown;
            allergens: unknown;
            tags: unknown;
            images: unknown;
            metadata: unknown;
            createdBy: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        count: number;
    }>;
    searchProducts(query: string): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            description: string;
            sku: string;
            barcode: string;
            categoryId: number;
            price: string;
            costPrice: string;
            weight: string;
            unit: string;
            stockQuantity: number;
            minStockLevel: number;
            maxStockLevel: number;
            isActive: boolean;
            isFeatured: boolean;
            taxRate: string;
            expiryDate: Date;
            batchNumber: string;
            nutritionalInfo: unknown;
            allergens: unknown;
            tags: unknown;
            images: unknown;
            metadata: unknown;
            createdBy: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        count: number;
        query: string;
    }>;
    getProductsByCategory(categoryId: number): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            description: string;
            sku: string;
            barcode: string;
            categoryId: number;
            price: string;
            costPrice: string;
            weight: string;
            unit: string;
            stockQuantity: number;
            minStockLevel: number;
            maxStockLevel: number;
            isActive: boolean;
            isFeatured: boolean;
            taxRate: string;
            expiryDate: Date;
            batchNumber: string;
            nutritionalInfo: unknown;
            allergens: unknown;
            tags: unknown;
            images: unknown;
            metadata: unknown;
            createdBy: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        count: number;
        categoryId: number;
    }>;
    getProductById(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            description: string;
            sku: string;
            barcode: string;
            categoryId: number;
            price: string;
            costPrice: string;
            weight: string;
            unit: string;
            stockQuantity: number;
            minStockLevel: number;
            maxStockLevel: number;
            isActive: boolean;
            isFeatured: boolean;
            taxRate: string;
            expiryDate: Date;
            batchNumber: string;
            nutritionalInfo: unknown;
            allergens: unknown;
            tags: unknown;
            images: unknown;
            metadata: unknown;
            createdBy: number;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            description: string;
            sku: string;
            barcode: string;
            categoryId: number;
            price: string;
            costPrice: string;
            weight: string;
            unit: string;
            stockQuantity: number;
            minStockLevel: number;
            maxStockLevel: number;
            isActive: boolean;
            isFeatured: boolean;
            taxRate: string;
            expiryDate: Date;
            batchNumber: string;
            nutritionalInfo: unknown;
            allergens: unknown;
            tags: unknown;
            images: unknown;
            metadata: unknown;
            createdBy: number;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    deleteProduct(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            metadata: unknown;
            description: string;
            sku: string;
            barcode: string;
            categoryId: number;
            price: string;
            costPrice: string;
            weight: string;
            unit: string;
            stockQuantity: number;
            minStockLevel: number;
            maxStockLevel: number;
            isFeatured: boolean;
            taxRate: string;
            expiryDate: Date;
            batchNumber: string;
            nutritionalInfo: unknown;
            allergens: unknown;
            tags: unknown;
            images: unknown;
            createdBy: number;
        };
    }>;
}
