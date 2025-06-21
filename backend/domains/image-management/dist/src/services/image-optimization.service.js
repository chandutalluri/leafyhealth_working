"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageOptimizationService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let ImageOptimizationService = class ImageOptimizationService {
    constructor() {
        this.uploadsPath = (0, path_1.join)(process.cwd(), 'uploads', 'images');
    }
    async optimizeImage(inputPath, options = {}) {
        const mockBuffer = Buffer.from('optimized-image-data');
        return {
            buffer: mockBuffer,
            format: options.format || 'jpeg',
            width: options.width || 800,
            height: options.height || 600,
            size: mockBuffer.length,
        };
    }
    async createThumbnail(inputPath, size = 150) {
        return this.optimizeImage(inputPath, {
            width: size,
            height: size,
            quality: 80,
            format: 'jpeg',
        });
    }
    async createResponsiveVariants(inputPath) {
        const [thumbnail, medium, large] = await Promise.all([
            this.createThumbnail(inputPath, 150),
            this.optimizeImage(inputPath, { width: 400, height: 300 }),
            this.optimizeImage(inputPath, { width: 800, height: 600 }),
        ]);
        return { thumbnail, medium, large };
    }
    async validateImage(filePath) {
        try {
            const stats = await fs_1.promises.stat(filePath);
            return stats.isFile() && stats.size > 0;
        }
        catch {
            return false;
        }
    }
    getMimeType(filename) {
        const ext = filename.toLowerCase().split('.').pop();
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml',
        };
        return mimeTypes[ext] || 'application/octet-stream';
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
exports.ImageOptimizationService = ImageOptimizationService;
exports.ImageOptimizationService = ImageOptimizationService = __decorate([
    (0, common_1.Injectable)()
], ImageOptimizationService);
//# sourceMappingURL=image-optimization.service.js.map