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
exports.IntegrationHubController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const integration_hub_service_1 = require("../services/integration-hub.service");
const integration_hub_dto_1 = require("../dto/integration-hub.dto");
let IntegrationHubController = class IntegrationHubController {
    constructor(integrationHubService) {
        this.integrationHubService = integrationHubService;
    }
    async getHealth() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'integration-hub'
        };
    }
    async createIntegration(createIntegrationDto) {
        return this.integrationHubService.createIntegration(createIntegrationDto);
    }
    async getIntegrations() {
        return this.integrationHubService.getAllIntegrations();
    }
    async getIntegration(id) {
        return this.integrationHubService.getIntegrationById(parseInt(id));
    }
    async updateIntegration(id, updateIntegrationDto) {
        return this.integrationHubService.updateIntegration(parseInt(id), updateIntegrationDto);
    }
    async deleteIntegration(id) {
        return this.integrationHubService.deleteIntegration(parseInt(id));
    }
    async getIntegrationStatus(id) {
        return this.integrationHubService.getIntegrationStatus(parseInt(id));
    }
    async syncIntegration(id) {
        return this.integrationHubService.syncIntegration(parseInt(id));
    }
};
exports.IntegrationHubController = IntegrationHubController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegrationHubController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Post)('integrations'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new integration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Integration created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [integration_hub_dto_1.CreateIntegrationDto]),
    __metadata("design:returntype", Promise)
], IntegrationHubController.prototype, "createIntegration", null);
__decorate([
    (0, common_1.Get)('integrations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all integrations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of integrations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegrationHubController.prototype, "getIntegrations", null);
__decorate([
    (0, common_1.Get)('integrations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get integration by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Integration details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationHubController.prototype, "getIntegration", null);
__decorate([
    (0, common_1.Put)('integrations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update integration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Integration updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, integration_hub_dto_1.UpdateIntegrationDto]),
    __metadata("design:returntype", Promise)
], IntegrationHubController.prototype, "updateIntegration", null);
__decorate([
    (0, common_1.Delete)('integrations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete integration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Integration deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationHubController.prototype, "deleteIntegration", null);
__decorate([
    (0, common_1.Get)('integrations/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get integration status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Integration status' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationHubController.prototype, "getIntegrationStatus", null);
__decorate([
    (0, common_1.Post)('integrations/:id/sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync integration data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Integration sync initiated' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationHubController.prototype, "syncIntegration", null);
exports.IntegrationHubController = IntegrationHubController = __decorate([
    (0, swagger_1.ApiTags)('Integration Hub'),
    (0, common_1.Controller)('integration-hub'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [integration_hub_service_1.IntegrationHubService])
], IntegrationHubController);
//# sourceMappingURL=integration-hub.controller.js.map