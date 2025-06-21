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
var ImageManagementController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageManagementController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const image_management_service_1 = require("./image-management.service");
let ImageManagementController = ImageManagementController_1 = class ImageManagementController {
    constructor(imageService) {
        this.imageService = imageService;
        this.logger = new common_1.Logger(ImageManagementController_1.name);
    }
    async healthCheck() {
        return {
            status: 'healthy',
            service: 'Image Management Service',
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            port: process.env.PORT || 3070,
            features: [
                'Image upload and processing',
                'Image variant generation',
                'Image serving and delivery',
                'Statistics and analytics',
                'CRUD operations',
                'Entity-based image management',
                'Bulk operations',
                'Advanced filtering'
            ]
        };
    }
    async uploadImage(file, uploadDto) {
        this.logger.log(`Upload request: ${file?.originalname || 'no file'}`);
        if (!file) {
            return { error: 'No file provided' };
        }
        return await this.imageService.uploadImage(file, uploadDto);
    }
    async uploadMultipleImages(files, uploadDto) {
        this.logger.log(`Multiple upload request: ${files?.length || 0} files`);
        if (!files || files.length === 0) {
            return { error: 'No files provided' };
        }
        const results = [];
        for (const file of files) {
            try {
                const result = await this.imageService.uploadImage(file, uploadDto);
                results.push(result);
            }
            catch (error) {
                this.logger.error(`Failed to upload ${file.originalname}:`, error);
                results.push({
                    filename: file.originalname,
                    error: error.message
                });
            }
        }
        return {
            total: files.length,
            successful: results.filter(r => !r.error).length,
            failed: results.filter(r => r.error).length,
            results
        };
    }
    async getImages(query) {
        return await this.imageService.getImages(query);
    }
    async getImageStats() {
        return await this.imageService.getImageStats();
    }
    async getImageAnalytics(query) {
        return await this.imageService.getImageAnalytics(query);
    }
    async getImagesByEntity(entityType, entityId, query) {
        return await this.imageService.getImagesByEntity(entityType, entityId, query);
    }
    async serveImage(filename, variant, quality, format, res) {
        try {
            const result = await this.imageService.serveImage(filename, {
                variant,
                quality,
                format
            });
            if (res) {
                res.set({
                    'Content-Type': result.mimeType || 'image/jpeg',
                    'Cache-Control': 'public, max-age=31536000',
                    'ETag': `"${result.etag}"`,
                    'Last-Modified': result.lastModified,
                    'Content-Length': result.size?.toString()
                });
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Error serving image ${filename}:`, error);
            throw error;
        }
    }
    async getImageVariants(filename) {
        return await this.imageService.getImageVariants(filename);
    }
    async getImageById(id) {
        return await this.imageService.getImageById(id);
    }
    async updateImage(id, updateDto) {
        return await this.imageService.updateImage(id, updateDto);
    }
    async deleteImage(id) {
        return await this.imageService.deleteImage(id);
    }
    async bulkDeleteImages(ids) {
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return { error: 'Invalid or empty IDs array' };
        }
        return await this.imageService.bulkDelete(ids);
    }
    async reprocessImage(id) {
        return await this.imageService.reprocessImage(id);
    }
    async createBackup(includeFiles) {
        return await this.imageService.createBackup(includeFiles);
    }
};
exports.ImageManagementController = ImageManagementController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload single image with automatic processing' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Image uploaded successfully' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('upload/multiple'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple images with batch processing' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Images uploaded successfully' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "uploadMultipleImages", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get images with advanced filtering and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Images retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "getImages", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive image statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image statistics retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "getImageStats", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get image analytics and insights' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image analytics retrieved' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "getImageAnalytics", null);
__decorate([
    (0, common_1.Get)('entity/:entityType/:entityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get images by entity with filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Entity images retrieved' }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "getImagesByEntity", null);
__decorate([
    (0, common_1.Get)('serve/:filename'),
    (0, swagger_1.ApiOperation)({ summary: 'Serve optimized image file' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image file served' }),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Query)('variant')),
    __param(2, (0, common_1.Query)('quality')),
    __param(3, (0, common_1.Query)('format')),
    __param(4, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "serveImage", null);
__decorate([
    (0, common_1.Get)('variants/:filename'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available image variants' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image variants listed' }),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "getImageVariants", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get image details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image retrieved successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "getImageById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update image metadata and properties' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "updateImage", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete image and all variants' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Delete)('bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk delete multiple images' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Images deleted successfully' }),
    __param(0, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "bulkDeleteImages", null);
__decorate([
    (0, common_1.Post)('process/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Reprocess image variants' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image reprocessed successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "reprocessImage", null);
__decorate([
    (0, common_1.Get)('backup/create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create backup of image data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup created successfully' }),
    __param(0, (0, common_1.Query)('includeFiles')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], ImageManagementController.prototype, "createBackup", null);
exports.ImageManagementController = ImageManagementController = ImageManagementController_1 = __decorate([
    (0, swagger_1.ApiTags)('Image Management'),
    (0, common_1.Controller)('api/image-management'),
    __metadata("design:paramtypes", [image_management_service_1.ImageManagementService])
], ImageManagementController);
//# sourceMappingURL=image-management.controller.js.map