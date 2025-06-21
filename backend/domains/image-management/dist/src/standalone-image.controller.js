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
var StandaloneImageController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandaloneImageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const standalone_image_service_1 = require("./standalone-image.service");
let StandaloneImageController = StandaloneImageController_1 = class StandaloneImageController {
    constructor(imageService) {
        this.imageService = imageService;
        this.logger = new common_1.Logger(StandaloneImageController_1.name);
    }
    async healthCheck() {
        return {
            status: 'healthy',
            service: 'Image Management Service',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            features: [
                'Image upload and processing',
                'Image variant generation',
                'Image serving and delivery',
                'Statistics and analytics',
                'CRUD operations'
            ]
        };
    }
    async uploadImage(file, uploadDto) {
        this.logger.log(`Upload request: ${file?.originalname || 'no file'}`);
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
    async getImagesByEntity(entityType, entityId) {
        return await this.imageService.getImagesByEntity(entityType, entityId);
    }
    async serveImage(filename, variant, res) {
        try {
            const result = await this.imageService.serveImage(filename, variant);
            if (res) {
                res.set({
                    'Content-Type': result.mimeType || 'image/jpeg',
                    'Cache-Control': 'public, max-age=31536000',
                    'ETag': `"${Date.now()}"`
                });
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Error serving image ${filename}:`, error);
            throw error;
        }
    }
    async serveImageVariant(filename, res) {
        return await this.serveImage(filename, 'variant', res);
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
        return await this.imageService.bulkDelete(ids);
    }
};
exports.StandaloneImageController = StandaloneImageController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StandaloneImageController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload single image with automatic variant generation' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Image uploaded successfully' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StandaloneImageController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('upload/multiple'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple images' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Images uploaded successfully' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], StandaloneImageController.prototype, "uploadMultipleImages", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get images with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Images retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StandaloneImageController.prototype, "getImages", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get image statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image statistics retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StandaloneImageController.prototype, "getImageStats", null);
__decorate([
    (0, common_1.Get)('entity/:entityType/:entityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get images by entity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Entity images retrieved' }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], StandaloneImageController.prototype, "getImagesByEntity", null);
__decorate([
    (0, common_1.Get)('serve/:filename'),
    (0, swagger_1.ApiOperation)({ summary: 'Serve image file' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image file served' }),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Query)('variant')),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], StandaloneImageController.prototype, "serveImage", null);
__decorate([
    (0, common_1.Get)('variants/:filename'),
    (0, swagger_1.ApiOperation)({ summary: 'Serve image variant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image variant served' }),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StandaloneImageController.prototype, "serveImageVariant", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get image by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image retrieved successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StandaloneImageController.prototype, "getImageById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update image metadata' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StandaloneImageController.prototype, "updateImage", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete image and all variants' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StandaloneImageController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Delete)('bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete multiple images' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Images deleted successfully' }),
    __param(0, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], StandaloneImageController.prototype, "bulkDeleteImages", null);
exports.StandaloneImageController = StandaloneImageController = StandaloneImageController_1 = __decorate([
    (0, swagger_1.ApiTags)('Image Management'),
    (0, common_1.Controller)('images'),
    __metadata("design:paramtypes", [standalone_image_service_1.StandaloneImageService])
], StandaloneImageController);
//# sourceMappingURL=standalone-image.controller.js.map