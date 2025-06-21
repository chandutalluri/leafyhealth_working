"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarcodeService = void 0;
const common_1 = require("@nestjs/common");
const create_barcode_dto_1 = require("../dto/create-barcode.dto");
let BarcodeService = class BarcodeService {
    async generateBarcode(createBarcodeDto) {
        const barcodeId = Math.floor(Math.random() * 1000) + 1;
        return {
            id: barcodeId,
            data: createBarcodeDto.data,
            type: createBarcodeDto.type,
            format: createBarcodeDto.format,
            productId: createBarcodeDto.productId,
            width: createBarcodeDto.width || this.getDefaultWidth(createBarcodeDto.type),
            height: createBarcodeDto.height || this.getDefaultHeight(createBarcodeDto.type),
            displayText: createBarcodeDto.displayText,
            fileUrl: `https://barcodes.leafyhealth.com/${barcodeId}.${createBarcodeDto.format}`,
            createdAt: new Date().toISOString(),
            isValid: this.validateBarcodeData(createBarcodeDto.data, createBarcodeDto.type),
        };
    }
    async getBarcodes(filters) {
        const baseBarcodes = [
            {
                id: 1,
                data: '123456789012',
                type: create_barcode_dto_1.BarcodeType.UPC_A,
                format: 'PNG',
                productId: 101,
                width: 200,
                height: 60,
                displayText: '123456789012',
                fileUrl: 'https://barcodes.leafyhealth.com/1.png',
                createdAt: '2024-01-15T10:00:00Z',
                isValid: true,
            },
            {
                id: 2,
                data: '1234567890123',
                type: create_barcode_dto_1.BarcodeType.EAN_13,
                format: 'SVG',
                productId: 102,
                width: 180,
                height: 50,
                displayText: '1234567890123',
                fileUrl: 'https://barcodes.leafyhealth.com/2.svg',
                createdAt: '2024-01-16T14:30:00Z',
                isValid: true,
            },
            {
                id: 3,
                data: 'https://leafyhealth.com/product/103',
                type: create_barcode_dto_1.BarcodeType.QR_CODE,
                format: 'PNG',
                productId: 103,
                width: 100,
                height: 100,
                fileUrl: 'https://barcodes.leafyhealth.com/3.png',
                createdAt: '2024-01-17T09:15:00Z',
                isValid: true,
            },
        ];
        let filteredBarcodes = baseBarcodes;
        if (filters.type) {
            filteredBarcodes = filteredBarcodes.filter(barcode => barcode.type === filters.type);
        }
        if (filters.productId) {
            filteredBarcodes = filteredBarcodes.filter(barcode => barcode.productId === filters.productId);
        }
        return filteredBarcodes;
    }
    async getBarcodeById(id) {
        return {
            id,
            data: '1234567890123',
            type: create_barcode_dto_1.BarcodeType.EAN_13,
            format: 'PNG',
            productId: 101,
            width: 180,
            height: 50,
            displayText: '1234567890123',
            fileUrl: `https://barcodes.leafyhealth.com/${id}.png`,
            createdAt: '2024-01-15T10:00:00Z',
            isValid: true,
            metadata: {
                checkDigit: '3',
                countryCode: '123',
                manufacturerCode: '456789',
                productCode: '01234',
            },
        };
    }
    async downloadBarcode(id) {
        return {
            barcodeId: id,
            downloadUrl: `https://barcodes.leafyhealth.com/${id}/download`,
            contentType: 'image/png',
            filename: `barcode-${id}.png`,
            size: 15420,
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
        };
    }
    async getBarcodeStats() {
        return {
            totalBarcodes: 89,
            byType: {
                upc_a: 23,
                ean_13: 31,
                code_128: 15,
                qr_code: 12,
                data_matrix: 5,
                pdf417: 3,
            },
            byFormat: {
                png: 52,
                svg: 24,
                pdf: 13,
            },
            recentActivity: {
                generatedToday: 5,
                downloadedToday: 18,
                mostUsedType: 'EAN-13',
            },
            validation: {
                validBarcodes: 87,
                invalidBarcodes: 2,
                validationRate: 97.8,
            },
        };
    }
    getDefaultWidth(type) {
        const widths = {
            [create_barcode_dto_1.BarcodeType.UPC_A]: 200,
            [create_barcode_dto_1.BarcodeType.EAN_13]: 180,
            [create_barcode_dto_1.BarcodeType.CODE_128]: 150,
            [create_barcode_dto_1.BarcodeType.QR_CODE]: 100,
            [create_barcode_dto_1.BarcodeType.DATA_MATRIX]: 80,
            [create_barcode_dto_1.BarcodeType.PDF417]: 120,
        };
        return widths[type] || 150;
    }
    getDefaultHeight(type) {
        const heights = {
            [create_barcode_dto_1.BarcodeType.UPC_A]: 60,
            [create_barcode_dto_1.BarcodeType.EAN_13]: 50,
            [create_barcode_dto_1.BarcodeType.CODE_128]: 40,
            [create_barcode_dto_1.BarcodeType.QR_CODE]: 100,
            [create_barcode_dto_1.BarcodeType.DATA_MATRIX]: 80,
            [create_barcode_dto_1.BarcodeType.PDF417]: 60,
        };
        return heights[type] || 50;
    }
    validateBarcodeData(data, type) {
        switch (type) {
            case create_barcode_dto_1.BarcodeType.UPC_A:
                return /^\d{12}$/.test(data);
            case create_barcode_dto_1.BarcodeType.EAN_13:
                return /^\d{13}$/.test(data);
            case create_barcode_dto_1.BarcodeType.CODE_128:
                return data.length > 0 && data.length <= 80;
            case create_barcode_dto_1.BarcodeType.QR_CODE:
                return data.length > 0 && data.length <= 2953;
            case create_barcode_dto_1.BarcodeType.DATA_MATRIX:
                return data.length > 0 && data.length <= 2335;
            case create_barcode_dto_1.BarcodeType.PDF417:
                return data.length > 0 && data.length <= 1850;
            default:
                return true;
        }
    }
};
exports.BarcodeService = BarcodeService;
exports.BarcodeService = BarcodeService = __decorate([
    (0, common_1.Injectable)()
], BarcodeService);
//# sourceMappingURL=barcode.service.js.map