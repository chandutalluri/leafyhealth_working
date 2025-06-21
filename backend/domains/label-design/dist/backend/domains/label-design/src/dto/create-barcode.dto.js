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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBarcodeDto = exports.BarcodeFormat = exports.BarcodeType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var BarcodeType;
(function (BarcodeType) {
    BarcodeType["UPC_A"] = "upc_a";
    BarcodeType["EAN_13"] = "ean_13";
    BarcodeType["CODE_128"] = "code_128";
    BarcodeType["QR_CODE"] = "qr_code";
    BarcodeType["DATA_MATRIX"] = "data_matrix";
    BarcodeType["PDF417"] = "pdf417";
})(BarcodeType || (exports.BarcodeType = BarcodeType = {}));
var BarcodeFormat;
(function (BarcodeFormat) {
    BarcodeFormat["PNG"] = "png";
    BarcodeFormat["SVG"] = "svg";
    BarcodeFormat["PDF"] = "pdf";
})(BarcodeFormat || (exports.BarcodeFormat = BarcodeFormat = {}));
class CreateBarcodeDto {
}
exports.CreateBarcodeDto = CreateBarcodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Barcode data/content' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBarcodeDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: BarcodeType, description: 'Type of barcode' }),
    (0, class_validator_1.IsEnum)(BarcodeType),
    __metadata("design:type", String)
], CreateBarcodeDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: BarcodeFormat, description: 'Output format' }),
    (0, class_validator_1.IsEnum)(BarcodeFormat),
    __metadata("design:type", String)
], CreateBarcodeDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product ID this barcode is for', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBarcodeDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Barcode width in pixels', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBarcodeDto.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Barcode height in pixels', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBarcodeDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Display text below barcode', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBarcodeDto.prototype, "displayText", void 0);
//# sourceMappingURL=create-barcode.dto.js.map