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
exports.CreateLabelDto = exports.LabelSize = exports.LabelType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var LabelType;
(function (LabelType) {
    LabelType["PRICE_TAG"] = "price_tag";
    LabelType["NUTRITION_LABEL"] = "nutrition_label";
    LabelType["BARCODE_LABEL"] = "barcode_label";
    LabelType["PRODUCT_LABEL"] = "product_label";
    LabelType["COMPLIANCE_LABEL"] = "compliance_label";
    LabelType["PROMOTIONAL"] = "promotional";
    LabelType["SHELF_TALKER"] = "shelf_talker";
})(LabelType || (exports.LabelType = LabelType = {}));
var LabelSize;
(function (LabelSize) {
    LabelSize["SMALL"] = "2x1";
    LabelSize["MEDIUM"] = "4x2";
    LabelSize["LARGE"] = "4x6";
    LabelSize["CUSTOM"] = "custom";
})(LabelSize || (exports.LabelSize = LabelSize = {}));
class CreateLabelDto {
}
exports.CreateLabelDto = CreateLabelDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Label name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabelDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: LabelType, description: 'Type of label' }),
    (0, class_validator_1.IsEnum)(LabelType),
    __metadata("design:type", String)
], CreateLabelDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: LabelSize, description: 'Label size' }),
    (0, class_validator_1.IsEnum)(LabelSize),
    __metadata("design:type", String)
], CreateLabelDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product ID this label is for', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLabelDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template ID to use', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLabelDto.prototype, "templateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Label content data', type: 'object', additionalProperties: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateLabelDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Language for multi-language labels', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabelDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether label requires compliance review', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateLabelDto.prototype, "requiresCompliance", void 0);
//# sourceMappingURL=create-label.dto.js.map