"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogManagementService = void 0;
const common_1 = require("@nestjs/common");
const connection_1 = require("../database/connection");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../../../../shared/schema");
let CatalogManagementService = class CatalogManagementService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async createCategory(createCategoryDto) {
        const db = this.databaseService.getDatabase();
        const result = await db.insert(schema_1.categories).values({
            name: createCategoryDto.name,
            description: createCategoryDto.description,
            parentId: createCategoryDto.parentId,
            imageUrl: createCategoryDto.imageUrl,
        }).returning();
        return {
            success: true,
            data: result[0],
            message: 'Category created successfully'
        };
    }
    async getAllCategories() {
        const db = this.databaseService.getDatabase();
        const allCategories = await db.select().from(schema_1.categories).orderBy((0, drizzle_orm_1.desc)(schema_1.categories.createdAt));
        return {
            success: true,
            data: allCategories,
            count: allCategories.length
        };
    }
    async getCategoryById(id) {
        const db = this.databaseService.getDatabase();
        const [category] = await db.select().from(schema_1.categories).where((0, drizzle_orm_1.eq)(schema_1.categories.id, id));
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return {
            success: true,
            data: category
        };
    }
    async updateCategory(id, updateCategoryDto) {
        const db = this.databaseService.getDatabase();
        const updateData = {
            updatedAt: new Date(),
        };
        if (updateCategoryDto.name)
            updateData.name = updateCategoryDto.name;
        if (updateCategoryDto.description)
            updateData.description = updateCategoryDto.description;
        if (updateCategoryDto.parentId)
            updateData.parentId = updateCategoryDto.parentId;
        if (updateCategoryDto.imageUrl)
            updateData.imageUrl = updateCategoryDto.imageUrl;
        if (updateCategoryDto.isActive !== undefined)
            updateData.isActive = updateCategoryDto.isActive;
        const [updatedCategory] = await db
            .update(schema_1.categories)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.categories.id, id))
            .returning();
        if (!updatedCategory) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return {
            success: true,
            data: updatedCategory,
            message: 'Category updated successfully'
        };
    }
    async deleteCategory(id) {
        const db = this.databaseService.getDatabase();
        const deletedResult = await db
            .delete(schema_1.categories)
            .where((0, drizzle_orm_1.eq)(schema_1.categories.id, id))
            .returning();
        const deletedCategory = deletedResult[0];
        if (!deletedCategory) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return {
            success: true,
            data: deletedCategory
        };
    }
    async createProduct(createProductDto) {
        const db = this.databaseService.getDatabase();
        const [product] = await db.insert(schema_1.products).values({
            name: createProductDto.name,
            description: createProductDto.description,
            sku: createProductDto.sku,
            price: createProductDto.price.toString(),
            costPrice: createProductDto.costPrice?.toString(),
            categoryId: createProductDto.categoryId,
            tags: createProductDto.tags,
            images: createProductDto.images,
            unit: createProductDto.unit,
            weight: createProductDto.weight?.toString(),
            barcode: createProductDto.barcode,
        }).returning();
        return {
            success: true,
            data: product,
            message: 'Product created successfully'
        };
    }
    async getAllProducts() {
        const db = this.databaseService.getDatabase();
        const allProducts = await db.select().from(schema_1.products).orderBy((0, drizzle_orm_1.desc)(schema_1.products.createdAt));
        return {
            success: true,
            data: allProducts,
            count: allProducts.length
        };
    }
    async getProductById(id) {
        const db = this.databaseService.getDatabase();
        const [product] = await db.select().from(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.id, id));
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return {
            success: true,
            data: product
        };
    }
    async updateProduct(id, updateProductDto) {
        const db = this.databaseService.getDatabase();
        const updateData = {
            updatedAt: new Date(),
        };
        if (updateProductDto.name)
            updateData.name = updateProductDto.name;
        if (updateProductDto.description)
            updateData.description = updateProductDto.description;
        if (updateProductDto.sku)
            updateData.sku = updateProductDto.sku;
        if (updateProductDto.price)
            updateData.price = updateProductDto.price.toString();
        if (updateProductDto.costPrice)
            updateData.costPrice = updateProductDto.costPrice.toString();
        if (updateProductDto.categoryId)
            updateData.categoryId = updateProductDto.categoryId;
        if (updateProductDto.tags)
            updateData.tags = updateProductDto.tags;
        if (updateProductDto.images)
            updateData.images = updateProductDto.images;
        if (updateProductDto.unit)
            updateData.unit = updateProductDto.unit;
        if (updateProductDto.weight)
            updateData.weight = updateProductDto.weight;
        if (updateProductDto.barcode)
            updateData.barcode = updateProductDto.barcode;
        if (updateProductDto.isActive !== undefined)
            updateData.isActive = updateProductDto.isActive;
        const [updatedProduct] = await db
            .update(schema_1.products)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.products.id, id))
            .returning();
        if (!updatedProduct) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return {
            success: true,
            data: updatedProduct,
            message: 'Product updated successfully'
        };
    }
    async deleteProduct(id) {
        const db = this.databaseService.getDatabase();
        const [deletedProduct] = await db
            .delete(schema_1.products)
            .where((0, drizzle_orm_1.eq)(schema_1.products.id, id))
            .returning();
        if (!deletedProduct) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return {
            success: true,
            data: deletedProduct
        };
    }
    async searchProducts(query) {
        const db = this.databaseService.getDatabase();
        const searchResults = await db
            .select()
            .from(schema_1.products)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.like)(schema_1.products.name, `%${query}%`), (0, drizzle_orm_1.eq)(schema_1.products.isActive, true)))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.products.createdAt));
        return {
            success: true,
            data: searchResults,
            count: searchResults.length,
            query
        };
    }
    async getProductsByCategory(categoryId) {
        const db = this.databaseService.getDatabase();
        const categoryProducts = await db
            .select()
            .from(schema_1.products)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.products.categoryId, categoryId), (0, drizzle_orm_1.eq)(schema_1.products.isActive, true)))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.products.createdAt));
        return {
            success: true,
            data: categoryProducts,
            count: categoryProducts.length,
            categoryId
        };
    }
    async getCategoryHierarchy() {
        const db = this.databaseService.getDatabase();
        const rootCategories = await db
            .select()
            .from(schema_1.categories)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schema_1.categories.parentId), (0, drizzle_orm_1.eq)(schema_1.categories.isActive, true)))
            .orderBy(schema_1.categories.name);
        const allCategories = await db
            .select()
            .from(schema_1.categories)
            .where((0, drizzle_orm_1.eq)(schema_1.categories.isActive, true))
            .orderBy(schema_1.categories.name);
        const buildCategoryTree = (parentId) => {
            return allCategories
                .filter(cat => cat.parentId === parentId)
                .map(cat => ({
                ...cat,
                children: buildCategoryTree(cat.id)
            }));
        };
        const categoryTree = buildCategoryTree(null);
        return {
            success: true,
            data: categoryTree,
            count: categoryTree.length
        };
    }
};
exports.CatalogManagementService = CatalogManagementService;
exports.CatalogManagementService = CatalogManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [connection_1.DatabaseService])
], CatalogManagementService);
//# sourceMappingURL=catalog-management.service.js.map