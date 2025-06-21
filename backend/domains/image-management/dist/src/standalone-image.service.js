"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StandaloneImageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandaloneImageService = void 0;
const common_1 = require("@nestjs/common");
const path = require("path");
let StandaloneImageService = StandaloneImageService_1 = class StandaloneImageService {
    constructor() {
        this.logger = new common_1.Logger(StandaloneImageService_1.name);
        this.imagesData = [];
        this.idCounter = 1;
    }
    async uploadImage(file, uploadData = {}) {
        this.logger.log(`Processing upload: ${file?.originalname || 'unknown'}`);
        try {
            const imageId = this.idCounter++;
            const timestamp = new Date().toISOString();
            const filename = `image-${imageId}-${Date.now()}.jpg`;
            const imageRecord = {
                id: imageId,
                filename,
                originalName: file?.originalname || 'uploaded-image.jpg',
                mimeType: file?.mimetype || 'image/jpeg',
                size: file?.size || 1024,
                width: 800,
                height: 600,
                uploadedAt: timestamp,
                category: uploadData.category || 'general',
                alt: uploadData.altText || '',
                title: uploadData.title || '',
                entityType: uploadData.entityType || 'image',
                entityId: uploadData.entityId || null,
                url: `/images/serve/${filename}`,
                thumbnailUrl: `/images/serve/${filename}?variant=thumbnail`
            };
            this.imagesData.push(imageRecord);
            return {
                success: true,
                id: imageId,
                filename,
                url: imageRecord.url,
                thumbnailUrl: imageRecord.thumbnailUrl,
                message: 'Image uploaded successfully'
            };
        }
        catch (error) {
            this.logger.error('Upload error:', error);
            throw new common_1.BadRequestException('Failed to upload image');
        }
    }
    async getImages(query = {}) {
        const { page = 1, limit = 10, category, entityType } = query;
        let filteredImages = [...this.imagesData];
        if (category) {
            filteredImages = filteredImages.filter(img => img.category === category);
        }
        if (entityType) {
            filteredImages = filteredImages.filter(img => img.entityType === entityType);
        }
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedImages = filteredImages.slice(startIndex, endIndex);
        return {
            images: paginatedImages,
            total: filteredImages.length,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(filteredImages.length / limit)
        };
    }
    async getImageById(id) {
        const image = this.imagesData.find(img => img.id === id);
        if (!image) {
            throw new common_1.NotFoundException(`Image with ID ${id} not found`);
        }
        return image;
    }
    async getImagesByEntity(entityType, entityId) {
        const images = this.imagesData.filter(img => img.entityType === entityType && img.entityId === entityId);
        return {
            images,
            total: images.length,
            entityType,
            entityId
        };
    }
    async serveImage(filename, variant) {
        this.logger.log(`Serving image: ${filename}${variant ? ` (${variant})` : ''}`);
        const mockFilePath = path.join(__dirname, '../storage/images/original', filename);
        return {
            filename,
            variant: variant || 'original',
            mimeType: 'image/jpeg',
            served: true,
            timestamp: new Date().toISOString()
        };
    }
    async updateImage(id, updateData) {
        const imageIndex = this.imagesData.findIndex(img => img.id === id);
        if (imageIndex === -1) {
            throw new common_1.NotFoundException(`Image with ID ${id} not found`);
        }
        this.imagesData[imageIndex] = {
            ...this.imagesData[imageIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        return this.imagesData[imageIndex];
    }
    async deleteImage(id) {
        const imageIndex = this.imagesData.findIndex(img => img.id === id);
        if (imageIndex === -1) {
            throw new common_1.NotFoundException(`Image with ID ${id} not found`);
        }
        const deletedImage = this.imagesData.splice(imageIndex, 1)[0];
        return {
            success: true,
            message: `Image ${deletedImage.filename} deleted successfully`,
            deletedImage
        };
    }
    async bulkDelete(ids) {
        const deletedImages = [];
        const notFoundIds = [];
        for (const id of ids) {
            const imageIndex = this.imagesData.findIndex(img => img.id === id);
            if (imageIndex !== -1) {
                deletedImages.push(this.imagesData.splice(imageIndex, 1)[0]);
            }
            else {
                notFoundIds.push(id);
            }
        }
        return {
            success: true,
            deleted: deletedImages.length,
            notFound: notFoundIds.length,
            deletedImages,
            notFoundIds
        };
    }
    async getImageStats() {
        const totalImages = this.imagesData.length;
        const totalSize = this.imagesData.reduce((sum, img) => sum + (img.size || 0), 0);
        const categoryCounts = this.imagesData.reduce((acc, img) => {
            acc[img.category] = (acc[img.category] || 0) + 1;
            return acc;
        }, {});
        const entityTypeCounts = this.imagesData.reduce((acc, img) => {
            acc[img.entityType] = (acc[img.entityType] || 0) + 1;
            return acc;
        }, {});
        return {
            totalImages,
            totalSize,
            averageSize: totalImages > 0 ? Math.round(totalSize / totalImages) : 0,
            categoryCounts,
            entityTypeCounts,
            serviceStatus: 'operational',
            lastUpdated: new Date().toISOString()
        };
    }
};
exports.StandaloneImageService = StandaloneImageService;
exports.StandaloneImageService = StandaloneImageService = StandaloneImageService_1 = __decorate([
    (0, common_1.Injectable)()
], StandaloneImageService);
//# sourceMappingURL=standalone-image.service.js.map