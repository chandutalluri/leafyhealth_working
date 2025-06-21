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
exports.LanguageController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const language_service_1 = require("../services/language.service");
const create_language_dto_1 = require("../dto/create-language.dto");
const update_language_dto_1 = require("../dto/update-language.dto");
let LanguageController = class LanguageController {
    constructor(languageService) {
        this.languageService = languageService;
    }
    create(createLanguageDto) {
        return this.languageService.create(createLanguageDto);
    }
    findAll() {
        return this.languageService.findAll();
    }
    findActive() {
        return this.languageService.findActive();
    }
    findDefault() {
        return this.languageService.findDefault();
    }
    findOne(id) {
        return this.languageService.findOne(id);
    }
    findByCode(code) {
        return this.languageService.findByCode(code);
    }
    update(id, updateLanguageDto) {
        return this.languageService.update(id, updateLanguageDto);
    }
    setAsDefault(id) {
        return this.languageService.setAsDefault(id);
    }
    remove(id) {
        return this.languageService.remove(id);
    }
};
exports.LanguageController = LanguageController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new language' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Language created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Language with this code already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_language_dto_1.CreateLanguageDto]),
    __metadata("design:returntype", Promise)
], LanguageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all languages' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all languages' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LanguageController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active languages' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of active languages' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LanguageController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('default'),
    (0, swagger_1.ApiOperation)({ summary: 'Get default language' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Default language' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No default language set' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LanguageController.prototype, "findDefault", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get language by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Language ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Language found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Language not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LanguageController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Get language by code' }),
    (0, swagger_1.ApiParam)({ name: 'code', description: 'Language code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Language found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Language not found' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LanguageController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update language' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Language ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Language updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Language not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Language with this code already exists' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_language_dto_1.UpdateLanguageDto]),
    __metadata("design:returntype", Promise)
], LanguageController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/set-default'),
    (0, swagger_1.ApiOperation)({ summary: 'Set language as default' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Language ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Language set as default' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Language not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LanguageController.prototype, "setAsDefault", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete language' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Language ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Language deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Language not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LanguageController.prototype, "remove", null);
exports.LanguageController = LanguageController = __decorate([
    (0, swagger_1.ApiTags)('languages'),
    (0, common_1.Controller)('languages'),
    __metadata("design:paramtypes", [language_service_1.LanguageService])
], LanguageController);
//# sourceMappingURL=language.controller.js.map