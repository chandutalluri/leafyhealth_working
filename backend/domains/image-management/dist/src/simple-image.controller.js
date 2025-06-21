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
var SimpleImageController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleImageController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let SimpleImageController = SimpleImageController_1 = class SimpleImageController {
    constructor() {
        this.logger = new common_1.Logger(SimpleImageController_1.name);
    }
    async healthCheck() {
        return {
            status: 'healthy',
            service: 'Image Management Service',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
    }
    async getImages() {
        this.logger.log('Getting images');
        return {
            images: [],
            total: 0,
            message: 'Image Management Service is operational'
        };
    }
    async uploadImage(uploadData) {
        this.logger.log('Upload request received');
        return {
            success: true,
            message: 'Upload endpoint is operational',
            filename: 'example-image.jpg',
            url: '/images/serve/example-image.jpg'
        };
    }
    async getStats() {
        return {
            totalImages: 0,
            totalSize: 0,
            variants: 0,
            service: 'operational'
        };
    }
};
exports.SimpleImageController = SimpleImageController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SimpleImageController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all images' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Images retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SimpleImageController.prototype, "getImages", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload image' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Image uploaded successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SimpleImageController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get image statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SimpleImageController.prototype, "getStats", null);
exports.SimpleImageController = SimpleImageController = SimpleImageController_1 = __decorate([
    (0, swagger_1.ApiTags)('Image Management'),
    (0, common_1.Controller)('images')
], SimpleImageController);
//# sourceMappingURL=simple-image.controller.js.map