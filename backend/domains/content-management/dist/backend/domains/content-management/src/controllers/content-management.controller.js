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
exports.ContentManagementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const content_management_service_1 = require("../services/content-management.service");
const content_management_dto_1 = require("../dto/content-management.dto");
let ContentManagementController = class ContentManagementController {
    constructor(contentManagementService) {
        this.contentManagementService = contentManagementService;
    }
    async getHealth() {
        return this.contentManagementService.getHealthStatus();
    }
    async createContent(createContentDto) {
        return this.contentManagementService.createContent(createContentDto);
    }
    async getAllContent(page, limit, search, type, status) {
        return this.contentManagementService.findAllContent(page ? +page : 1, limit ? +limit : 10, search, type, status);
    }
    async getContentById(id) {
        return this.contentManagementService.findContentById(+id);
    }
    async updateContent(id, updateContentDto) {
        return this.contentManagementService.updateContent(+id, updateContentDto);
    }
    async deleteContent(id) {
        return this.contentManagementService.deleteContent(+id);
    }
    async createCategory(createCategoryDto) {
        return this.contentManagementService.createCategory(createCategoryDto);
    }
    async getAllCategories() {
        return this.contentManagementService.findAllCategories();
    }
    async getCategoryById(id) {
        return this.contentManagementService.findCategoryById(+id);
    }
    async updateCategory(id, updateCategoryDto) {
        return this.contentManagementService.updateCategory(+id, updateCategoryDto);
    }
    async deleteCategory(id) {
        return this.contentManagementService.deleteCategory(+id);
    }
};
exports.ContentManagementController = ContentManagementController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContentManagementController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Post)('content'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new content' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Content created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [content_management_dto_1.CreateContentDto]),
    __metadata("design:returntype", Promise)
], ContentManagementController.prototype, "createContent", null);
__decorate([
    (0, common_1.Get)('content'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all content' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ContentManagementController.prototype, "getAllContent", null);
__decorate([
    (0, common_1.Get)('content/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get content by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentManagementController.prototype, "getContentById", null);
__decorate([
    (0, common_1.Put)('content/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update content' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, content_management_dto_1.UpdateContentDto]),
    __metadata("design:returntype", Promise)
], ContentManagementController.prototype, "updateContent", null);
__decorate([
    (0, common_1.Delete)('content/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete content' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentManagementController.prototype, "deleteContent", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [content_management_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], ContentManagementController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContentManagementController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentManagementController.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.Put)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update category' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, content_management_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], ContentManagementController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete category' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentManagementController.prototype, "deleteCategory", null);
exports.ContentManagementController = ContentManagementController = __decorate([
    (0, swagger_1.ApiTags)('content-management'),
    (0, common_1.Controller)('content-management'),
    __metadata("design:paramtypes", [content_management_service_1.ContentManagementService])
], ContentManagementController);
//# sourceMappingURL=content-management.controller.js.map