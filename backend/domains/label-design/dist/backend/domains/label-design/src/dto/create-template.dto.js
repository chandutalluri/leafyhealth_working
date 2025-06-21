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
exports.CreateTemplateDto = exports.TemplateCategory = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const create_label_dto_1 = require("./create-label.dto");
var TemplateCategory;
(function (TemplateCategory) {
    TemplateCategory["STANDARD"] = "standard";
    TemplateCategory["PREMIUM"] = "premium";
    TemplateCategory["ORGANIC"] = "organic";
    TemplateCategory["SALE"] = "sale";
    TemplateCategory["SEASONAL"] = "seasonal";
    TemplateCategory["CUSTOM"] = "custom";
})(TemplateCategory || (exports.TemplateCategory = TemplateCategory = {}));
class CreateTemplateDto {
}
exports.CreateTemplateDto = CreateTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template description', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: create_label_dto_1.LabelType, description: 'Label type this template is for' }),
    (0, class_validator_1.IsEnum)(create_label_dto_1.LabelType),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "labelType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: create_label_dto_1.LabelSize, description: 'Template size' }),
    (0, class_validator_1.IsEnum)(create_label_dto_1.LabelSize),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TemplateCategory, description: 'Template category' }),
    (0, class_validator_1.IsEnum)(TemplateCategory),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template design data', type: 'object', additionalProperties: true }),
    __metadata("design:type", Object)
], CreateTemplateDto.prototype, "design", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Variable fields in template', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTemplateDto.prototype, "variableFields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether template is active', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTemplateDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Preview image URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "previewUrl", void 0);
//# sourceMappingURL=create-template.dto.js.map