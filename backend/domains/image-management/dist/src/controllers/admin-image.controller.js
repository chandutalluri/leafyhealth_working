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
exports.AdminImageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const image_service_1 = require("../services/image.service");
const image_optimization_service_1 = require("../services/image-optimization.service");
let AdminImageController = class AdminImageController {
    constructor(imageService, imageOptimizationService) {
        this.imageService = imageService;
        this.imageOptimizationService = imageOptimizationService;
    }
    health() {
        return {
            status: 'ok',
            service: 'image-management',
            timestamp: new Date().toISOString(),
        };
    }
    async getAllImages(page = 1, limit = 10, entityType, search) {
        try {
            const images = await this.imageService.findAll();
            let filteredImages = images;
            if (entityType) {
                filteredImages = filteredImages.filter(img => img.entityType === entityType);
            }
            if (search) {
                const searchLower = search.toLowerCase();
                filteredImages = filteredImages.filter(img => img.filename.toLowerCase().includes(searchLower) ||
                    img.altText?.toLowerCase().includes(searchLower) ||
                    img.description?.toLowerCase().includes(searchLower));
            }
            const total = filteredImages.length;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedImages = filteredImages.slice(startIndex, endIndex);
            return {
                images: paginatedImages,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: limit,
                },
                filters: {
                    entityType,
                    search,
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch images');
        }
    }
    async getImageById(id) {
        const image = await this.imageService.findById(id);
        if (!image) {
            throw new common_1.NotFoundException(`Image with ID ${id} not found`);
        }
        return image;
    }
    async serveImage(filename, res) {
        try {
            const imageStream = await this.imageService.getImageStream(filename);
            const mimeType = this.imageOptimizationService.getMimeType(filename);
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            res.setHeader('Access-Control-Allow-Origin', '*');
            imageStream.pipe(res);
        }
        catch (error) {
            res.status(common_1.HttpStatus.NOT_FOUND).json({
                error: 'Image not found',
                message: `Could not serve image: ${filename}`,
            });
        }
    }
    async getStats() {
        try {
            const stats = await this.imageService.getImageStats();
            return {
                ...stats,
                formattedTotalSize: this.imageService.formatBytes(stats.totalSize),
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch image statistics');
        }
    }
    async uploadImage(file, metadata) {
        if (!file) {
            throw new common_1.BadRequestException('No image file provided');
        }
        try {
            const isValid = await this.imageOptimizationService.validateImage(file.path);
            if (!isValid) {
                throw new common_1.BadRequestException('Invalid image file');
            }
            const variants = await this.imageOptimizationService.createResponsiveVariants(file.path);
            const tags = metadata.tags ? metadata.tags.split(',').map(tag => tag.trim()) : [];
            const imageRecord = {
                filename: file.filename,
                originalFilename: file.originalname,
                path: `/uploads/images/${file.filename}`,
                sizeBytes: file.size,
                mimeType: file.mimetype,
                altText: metadata.altText,
                description: metadata.description,
                entityType: metadata.entityType,
                entityId: metadata.entityId,
                tags,
                createdAt: new Date(),
            };
            return {
                success: true,
                image: imageRecord,
                variants: {
                    thumbnail: {
                        size: variants.thumbnail.size,
                        dimensions: `${variants.thumbnail.width}x${variants.thumbnail.height}`,
                    },
                    medium: {
                        size: variants.medium.size,
                        dimensions: `${variants.medium.width}x${variants.medium.height}`,
                    },
                    large: {
                        size: variants.large.size,
                        dimensions: `${variants.large.width}x${variants.large.height}`,
                    },
                },
                message: 'Image uploaded and optimized successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to upload image: ${error.message}`);
        }
    }
    async updateImage(id, updateData) {
        const existingImage = await this.imageService.findById(id);
        if (!existingImage) {
            throw new common_1.NotFoundException(`Image with ID ${id} not found`);
        }
        const updatedImage = {
            ...existingImage,
            ...updateData,
            updatedAt: new Date(),
        };
        return {
            success: true,
            image: updatedImage,
            message: 'Image metadata updated successfully',
        };
    }
    async deleteImage(id) {
        const existingImage = await this.imageService.findById(id);
        if (!existingImage) {
            throw new common_1.NotFoundException(`Image with ID ${id} not found`);
        }
        try {
            return {
                success: true,
                message: `Image ${existingImage.filename} and all variants deleted successfully`,
                deletedImage: {
                    id: existingImage.id,
                    filename: existingImage.filename,
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to delete image: ${error.message}`);
        }
    }
    async generateVariants(id, options) {
        const existingImage = await this.imageService.findById(id);
        if (!existingImage) {
            throw new common_1.NotFoundException(`Image with ID ${id} not found`);
        }
        try {
            const variants = await this.imageOptimizationService.createResponsiveVariants(existingImage.path);
            return {
                success: true,
                variants,
                message: 'New image variants generated successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to generate variants: ${error.message}`);
        }
    }
    async getImageUsage(id) {
        const existingImage = await this.imageService.findById(id);
        if (!existingImage) {
            throw new common_1.NotFoundException(`Image with ID ${id} not found`);
        }
        return {
            image: existingImage,
            usage: [
                {
                    entityType: 'product',
                    entityId: existingImage.entityId,
                    location: 'main_image',
                    lastAccessed: new Date(),
                },
            ],
            totalUsageCount: 1,
        };
    }
};
exports.AdminImageController = AdminImageController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check for image management service' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminImageController.prototype, "health", null);
__decorate([
    (0, common_1.Get)('images'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all images with pagination and filtering' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('entityType')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminImageController.prototype, "getAllImages", null);
__decorate([
    (0, common_1.Get)('images/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get image by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminImageController.prototype, "getImageById", null);
__decorate([
    (0, common_1.Get)('serve/:filename'),
    (0, swagger_1.ApiOperation)({ summary: 'Serve image file' }),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminImageController.prototype, "serveImage", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get image management statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminImageController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload and optimize new image' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminImageController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Put)('images/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update image metadata' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminImageController.prototype, "updateImage", null);
__decorate([
    (0, common_1.Delete)('images/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete image and all variants' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminImageController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Post)('images/:id/variants'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate new variants for existing image' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminImageController.prototype, "generateVariants", null);
__decorate([
    (0, common_1.Get)('images/:id/usage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get image usage information' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminImageController.prototype, "getImageUsage", null);
exports.AdminImageController = AdminImageController = __decorate([
    (0, swagger_1.ApiTags)('admin-images'),
    (0, common_1.Controller)('api/image-management'),
    __metadata("design:paramtypes", [image_service_1.ImageService,
        image_optimization_service_1.ImageOptimizationService])
], AdminImageController);
//# sourceMappingURL=admin-image.controller.js.map