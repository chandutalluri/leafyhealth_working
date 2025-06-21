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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogManagementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const catalog_management_service_1 = require("../services/catalog-management.service");
const catalog_management_dto_1 = require("../dto/catalog-management.dto");
let CatalogManagementController = class CatalogManagementController {
    constructor(catalogManagementService) {
        this.catalogManagementService = catalogManagementService;
    }
    getHealth() {
        return {
            status: 'ok',
            service: 'catalog-management',
            timestamp: new Date().toISOString()
        };
    }
    async createCategory(createCategoryDto) {
        return this.catalogManagementService.createCategory(createCategoryDto);
    }
    async getAllCategories() {
        return this.catalogManagementService.getAllCategories();
    }
    async getCategoryHierarchy() {
        return this.catalogManagementService.getCategoryHierarchy();
    }
    async getCategoryById(id) {
        return this.catalogManagementService.getCategoryById(id);
    }
    async updateCategory(id, updateCategoryDto) {
        return this.catalogManagementService.updateCategory(id, updateCategoryDto);
    }
    async deleteCategory(id) {
        return this.catalogManagementService.deleteCategory(id);
    }
    async createProduct(createProductDto) {
        return this.catalogManagementService.createProduct(createProductDto);
    }
    async getAllProducts() {
        return this.catalogManagementService.getAllProducts();
    }
    async searchProducts(query) {
        return this.catalogManagementService.searchProducts(query);
    }
    async getProductsByCategory(categoryId) {
        return this.catalogManagementService.getProductsByCategory(categoryId);
    }
    async getProductById(id) {
        return this.catalogManagementService.getProductById(id);
    }
    async updateProduct(id, updateProductDto) {
        return this.catalogManagementService.updateProduct(id, updateProductDto);
    }
    async deleteProduct(id) {
        return this.catalogManagementService.deleteProduct(id);
    }
};
exports.CatalogManagementController = CatalogManagementController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogManagementController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_management_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CatalogManagementController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogManagementController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)('categories/hierarchy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category hierarchy tree' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category hierarchy retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogManagementController.prototype, "getCategoryHierarchy", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category retrieved successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogManagementController.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.Put)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update category by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category updated successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, catalog_management_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], CatalogManagementController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete category by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category deleted successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogManagementController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Post)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product created successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_management_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], CatalogManagementController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Products retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogManagementController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)('products/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search products by name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Products search completed' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogManagementController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Get)('products/category/:categoryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get products by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Products by category retrieved successfully' }),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogManagementController.prototype, "getProductsByCategory", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product retrieved successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogManagementController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Put)('products/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update product by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product updated successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, catalog_management_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], CatalogManagementController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('products/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete product by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product deleted successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogManagementController.prototype, "deleteProduct", null);
exports.CatalogManagementController = CatalogManagementController = __decorate([
    (0, swagger_1.ApiTags)('catalog-management'),
    (0, common_1.Controller)('catalog-management'),
    __metadata("design:paramtypes", [catalog_management_service_1.CatalogManagementService])
], CatalogManagementController);
//# sourceMappingURL=catalog-management.controller.js.map