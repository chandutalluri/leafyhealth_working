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
exports.ComplianceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../../shared/auth");
const compliance_service_1 = require("../services/compliance.service");
let ComplianceController = class ComplianceController {
    constructor(complianceService) {
        this.complianceService = complianceService;
    }
    async validateLabelCompliance(labelId) {
        return this.complianceService.validateLabelCompliance(labelId);
    }
    async getComplianceRequirements() {
        return this.complianceService.getComplianceRequirements();
    }
    async getNutritionTemplate() {
        return this.complianceService.getNutritionTemplate();
    }
    async checkAllergenCompliance(data) {
        return this.complianceService.checkAllergenCompliance(data.productId, data.allergens);
    }
    async getCertifications() {
        return this.complianceService.getCertifications();
    }
    async getComplianceStats() {
        return this.complianceService.getComplianceStats();
    }
};
exports.ComplianceController = ComplianceController;
__decorate([
    (0, common_1.Post)('validate/:labelId'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate label compliance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Compliance validation result' }),
    __param(0, (0, common_1.Param)('labelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "validateLabelCompliance", null);
__decorate([
    (0, common_1.Get)('requirements'),
    (0, swagger_1.ApiOperation)({ summary: 'Get compliance requirements' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of compliance requirements' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getComplianceRequirements", null);
__decorate([
    (0, common_1.Get)('nutrition/template'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nutrition label template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nutrition label template' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getNutritionTemplate", null);
__decorate([
    (0, common_1.Post)('allergen/check'),
    (0, swagger_1.ApiOperation)({ summary: 'Check allergen compliance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allergen compliance check result' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "checkAllergenCompliance", null);
__decorate([
    (0, common_1.Get)('certifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available certifications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of certifications' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getCertifications", null);
__decorate([
    (0, common_1.Get)('stats/compliance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get compliance statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Compliance statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getComplianceStats", null);
exports.ComplianceController = ComplianceController = __decorate([
    (0, swagger_1.ApiTags)('compliance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Controller)('compliance'),
    __metadata("design:paramtypes", [compliance_service_1.ComplianceService])
], ComplianceController);
//# sourceMappingURL=compliance.controller.js.map