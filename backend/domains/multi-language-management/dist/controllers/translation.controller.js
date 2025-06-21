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
exports.TranslationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const translation_service_1 = require("../services/translation.service");
const create_translation_dto_1 = require("../dto/create-translation.dto");
const update_translation_dto_1 = require("../dto/update-translation.dto");
let TranslationController = class TranslationController {
    constructor(translationService) {
        this.translationService = translationService;
    }
    create(createTranslationDto) {
        return this.translationService.create(createTranslationDto);
    }
    bulkCreate(translations) {
        return this.translationService.bulkCreate(translations);
    }
    findAll(languageId, namespace) {
        if (languageId && namespace) {
            return this.translationService.findByNamespace(namespace, parseInt(languageId));
        }
        if (languageId) {
            return this.translationService.findByLanguage(parseInt(languageId));
        }
        if (namespace) {
            return this.translationService.findByNamespace(namespace);
        }
        return this.translationService.findAll();
    }
    findByLanguageCode(languageCode) {
        return this.translationService.findByLanguageCode(languageCode);
    }
    getKeyValuePairs(languageCode, namespace) {
        return this.translationService.getTranslationsAsKeyValue(languageCode, namespace);
    }
    findOne(id) {
        return this.translationService.findOne(id);
    }
    findByKey(key, languageId) {
        return this.translationService.findByKey(key, languageId);
    }
    update(id, updateTranslationDto) {
        return this.translationService.update(id, updateTranslationDto);
    }
    remove(id) {
        return this.translationService.remove(id);
    }
};
exports.TranslationController = TranslationController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new translation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Translation created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Translation for this key and language already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_translation_dto_1.CreateTranslationDto]),
    __metadata("design:returntype", Promise)
], TranslationController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Create multiple translations' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Translations created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TranslationController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all translations' }),
    (0, swagger_1.ApiQuery)({ name: 'languageId', required: false, description: 'Filter by language ID' }),
    (0, swagger_1.ApiQuery)({ name: 'namespace', required: false, description: 'Filter by namespace' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of translations' }),
    __param(0, (0, common_1.Query)('languageId')),
    __param(1, (0, common_1.Query)('namespace')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TranslationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('language/:languageCode'),
    (0, swagger_1.ApiOperation)({ summary: 'Get translations by language code' }),
    (0, swagger_1.ApiParam)({ name: 'languageCode', description: 'Language code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Translations for the language' }),
    __param(0, (0, common_1.Param)('languageCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TranslationController.prototype, "findByLanguageCode", null);
__decorate([
    (0, common_1.Get)('language/:languageCode/keyvalue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get translations as key-value pairs' }),
    (0, swagger_1.ApiParam)({ name: 'languageCode', description: 'Language code' }),
    (0, swagger_1.ApiQuery)({ name: 'namespace', required: false, description: 'Filter by namespace' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Translations as key-value pairs' }),
    __param(0, (0, common_1.Param)('languageCode')),
    __param(1, (0, common_1.Query)('namespace')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TranslationController.prototype, "getKeyValuePairs", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get translation by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Translation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Translation found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Translation not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TranslationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('key/:key/language/:languageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get translation by key and language' }),
    (0, swagger_1.ApiParam)({ name: 'key', description: 'Translation key' }),
    (0, swagger_1.ApiParam)({ name: 'languageId', description: 'Language ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Translation found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Translation not found' }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Param)('languageId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], TranslationController.prototype, "findByKey", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update translation' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Translation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Translation updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Translation not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Translation for this key and language already exists' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_translation_dto_1.UpdateTranslationDto]),
    __metadata("design:returntype", Promise)
], TranslationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete translation' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Translation ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Translation deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Translation not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TranslationController.prototype, "remove", null);
exports.TranslationController = TranslationController = __decorate([
    (0, swagger_1.ApiTags)('translations'),
    (0, common_1.Controller)('translations'),
    __metadata("design:paramtypes", [translation_service_1.TranslationService])
], TranslationController);
//# sourceMappingURL=translation.controller.js.map