"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const fs_2 = require("fs");
let ImageService = class ImageService {
    constructor() {
        this.uploadsPath = (0, path_1.join)(process.cwd(), 'uploads', 'images');
    }
    async findAll() {
        return [
            {
                id: 1,
                filename: 'organic-spinach-1.jpg',
                originalFilename: 'organic-spinach-1.jpg',
                path: '/uploads/images/products/organic-spinach-1.jpg',
                sizeBytes: 45620,
                mimeType: 'image/jpeg',
                width: 800,
                height: 600,
                altText: 'Fresh Organic Spinach Leaves',
                description: 'Premium organic baby spinach with vibrant green leaves',
                tags: ['organic', 'spinach', 'leafy-greens'],
                entityType: 'product',
                entityId: 1,
                uploadedBy: 1,
                createdAt: new Date(),
            },
            {
                id: 2,
                filename: 'red-bell-peppers-2.jpg',
                originalFilename: 'red-bell-peppers-2.jpg',
                path: '/uploads/images/products/red-bell-peppers-2.jpg',
                sizeBytes: 52340,
                mimeType: 'image/jpeg',
                width: 800,
                height: 600,
                altText: 'Sweet Red Bell Peppers',
                description: 'Crisp red bell peppers perfect for cooking',
                tags: ['peppers', 'vegetables', 'red'],
                entityType: 'product',
                entityId: 2,
                uploadedBy: 1,
                createdAt: new Date(),
            },
        ];
    }
    async findById(id) {
        const images = await this.findAll();
        return images.find(img => img.id === id) || null;
    }
    async findByFilename(filename) {
        const images = await this.findAll();
        return images.find(img => img.filename === filename) || null;
    }
    async getImageStream(filename) {
        const imagePath = (0, path_1.join)(this.uploadsPath, 'products', filename);
        try {
            await fs_1.promises.access(imagePath);
            return (0, fs_2.createReadStream)(imagePath);
        }
        catch (error) {
            const placeholderPath = (0, path_1.join)(this.uploadsPath, 'products', 'thumbnails', 'placeholder.svg');
            return (0, fs_2.createReadStream)(placeholderPath);
        }
    }
    async getImageStats() {
        const images = await this.findAll();
        return {
            total: images.length,
            totalSize: images.reduce((sum, img) => sum + img.sizeBytes, 0),
            byCategory: this.getCategoryBreakdown(images),
            byEntityType: this.getEntityTypeBreakdown(images),
            recent: images.slice(-5),
        };
    }
    getCategoryBreakdown(images) {
        const categories = {};
        images.forEach(img => {
            if (img.tags) {
                img.tags.forEach(tag => {
                    categories[tag] = (categories[tag] || 0) + 1;
                });
            }
        });
        return categories;
    }
    getEntityTypeBreakdown(images) {
        const entityTypes = {};
        images.forEach(img => {
            if (img.entityType) {
                entityTypes[img.entityType] = (entityTypes[img.entityType] || 0) + 1;
            }
        });
        return entityTypes;
    }
    formatBytes(bytes) {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};
exports.ImageService = ImageService;
exports.ImageService = ImageService = __decorate([
    (0, common_1.Injectable)()
], ImageService);
//# sourceMappingURL=image.service.js.map