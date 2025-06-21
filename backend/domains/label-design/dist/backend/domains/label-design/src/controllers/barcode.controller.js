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
exports.BarcodeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../../shared/auth");
const barcode_service_1 = require("../services/barcode.service");
const create_barcode_dto_1 = require("../dto/create-barcode.dto");
let BarcodeController = class BarcodeController {
    constructor(barcodeService) {
        this.barcodeService = barcodeService;
    }
    async generateBarcode(createBarcodeDto) {
        return this.barcodeService.generateBarcode(createBarcodeDto);
    }
    async getBarcodes(type, productId) {
        return this.barcodeService.getBarcodes({ type, productId });
    }
    async getBarcodeById(id) {
        return this.barcodeService.getBarcodeById(id);
    }
    async downloadBarcode(id) {
        return this.barcodeService.downloadBarcode(id);
    }
    async getBarcodeStats() {
        return this.barcodeService.getBarcodeStats();
    }
};
exports.BarcodeController = BarcodeController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a new barcode' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Barcode generated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_barcode_dto_1.CreateBarcodeDto]),
    __metadata("design:returntype", Promise)
], BarcodeController.prototype, "generateBarcode", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all barcodes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of barcodes' }),
    (0, swagger_1.ApiQuery)({ name: 'type', enum: create_barcode_dto_1.BarcodeType, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: Number, required: false }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], BarcodeController.prototype, "getBarcodes", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get barcode by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Barcode details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BarcodeController.prototype, "getBarcodeById", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Download barcode file' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Barcode file' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BarcodeController.prototype, "downloadBarcode", null);
__decorate([
    (0, common_1.Get)('stats/generation'),
    (0, swagger_1.ApiOperation)({ summary: 'Get barcode generation statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Barcode generation stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BarcodeController.prototype, "getBarcodeStats", null);
exports.BarcodeController = BarcodeController = __decorate([
    (0, swagger_1.ApiTags)('barcodes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Controller)('barcodes'),
    __metadata("design:paramtypes", [barcode_service_1.BarcodeService])
], BarcodeController);
//# sourceMappingURL=barcode.controller.js.map