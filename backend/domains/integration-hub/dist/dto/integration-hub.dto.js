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
exports.UpdateIntegrationDto = exports.CreateIntegrationDto = exports.IntegrationType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var IntegrationType;
(function (IntegrationType) {
    IntegrationType["API"] = "api";
    IntegrationType["WEBHOOK"] = "webhook";
    IntegrationType["DATABASE"] = "database";
    IntegrationType["FILE_SYNC"] = "file_sync";
    IntegrationType["MESSAGING"] = "messaging";
})(IntegrationType || (exports.IntegrationType = IntegrationType = {}));
class CreateIntegrationDto {
}
exports.CreateIntegrationDto = CreateIntegrationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Integration name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntegrationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Integration type', enum: IntegrationType }),
    (0, class_validator_1.IsEnum)(IntegrationType),
    __metadata("design:type", String)
], CreateIntegrationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Integration endpoint URL' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntegrationDto.prototype, "endpoint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'API key for authentication', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntegrationDto.prototype, "apiKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Integration configuration', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateIntegrationDto.prototype, "configuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether integration is active', required: false, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateIntegrationDto.prototype, "isActive", void 0);
class UpdateIntegrationDto extends (0, swagger_1.PartialType)(CreateIntegrationDto) {
}
exports.UpdateIntegrationDto = UpdateIntegrationDto;
//# sourceMappingURL=integration-hub.dto.js.map