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
exports.CreateLanguageDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateLanguageDto {
}
exports.CreateLanguageDto = CreateLanguageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'en', description: 'Language code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 10),
    __metadata("design:type", String)
], CreateLanguageDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'English', description: 'Language name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateLanguageDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'English', description: 'Native name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateLanguageDto.prototype, "nativeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Is language active', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateLanguageDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'Is default language', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateLanguageDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ltr', description: 'Text direction', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLanguageDto.prototype, "direction", void 0);
//# sourceMappingURL=create-language.dto.js.map