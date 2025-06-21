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
exports.TemplateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../../shared/auth");
const template_service_1 = require("../services/template.service");
const create_template_dto_1 = require("../dto/create-template.dto");
const create_label_dto_1 = require("../dto/create-label.dto");
let TemplateController = class TemplateController {
    constructor(templateService) {
        this.templateService = templateService;
    }
    async createTemplate(createTemplateDto) {
        return this.templateService.createTemplate(createTemplateDto);
    }
    async getTemplates(category, labelType) {
        return this.templateService.getTemplates({ category, labelType });
    }
    async getTemplateById(id) {
        return this.templateService.getTemplateById(id);
    }
    async generatePreview(id) {
        return this.templateService.generatePreview(id);
    }
    async getTemplateStats() {
        return this.templateService.getTemplateStats();
    }
};
exports.TemplateController = TemplateController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Template created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_template_dto_1.CreateTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all templates' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of templates' }),
    (0, swagger_1.ApiQuery)({ name: 'category', enum: create_template_dto_1.TemplateCategory, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'labelType', enum: create_label_dto_1.LabelType, required: false }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('labelType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get template by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "getTemplateById", null);
__decorate([
    (0, common_1.Get)(':id/preview'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate template preview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template preview URL' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "generatePreview", null);
__decorate([
    (0, common_1.Get)('stats/usage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get template usage statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template usage stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "getTemplateStats", null);
exports.TemplateController = TemplateController = __decorate([
    (0, swagger_1.ApiTags)('templates'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Controller)('templates'),
    __metadata("design:paramtypes", [template_service_1.TemplateService])
], TemplateController);
//# sourceMappingURL=template.controller.js.map