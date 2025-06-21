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
exports.LabelController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../../shared/auth");
const label_service_1 = require("../services/label.service");
const create_label_dto_1 = require("../dto/create-label.dto");
let LabelController = class LabelController {
    constructor(labelService) {
        this.labelService = labelService;
    }
    async createLabel(createLabelDto) {
        return this.labelService.createLabel(createLabelDto);
    }
    async getLabels(type, productId) {
        return this.labelService.getLabels({ type, productId });
    }
    async getLabelById(id) {
        return this.labelService.getLabelById(id);
    }
    async generatePreview(id) {
        return this.labelService.generatePreview(id);
    }
    async getLabelStats() {
        return this.labelService.getLabelStats();
    }
};
exports.LabelController = LabelController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new label' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Label created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_label_dto_1.CreateLabelDto]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "createLabel", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all labels' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of labels' }),
    (0, swagger_1.ApiQuery)({ name: 'type', enum: create_label_dto_1.LabelType, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: Number, required: false }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getLabels", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get label by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Label details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getLabelById", null);
__decorate([
    (0, common_1.Get)(':id/preview'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate label preview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Label preview URL' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "generatePreview", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get label statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Label statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getLabelStats", null);
exports.LabelController = LabelController = __decorate([
    (0, swagger_1.ApiTags)('labels'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Controller)('labels'),
    __metadata("design:paramtypes", [label_service_1.LabelService])
], LabelController);
//# sourceMappingURL=label.controller.js.map