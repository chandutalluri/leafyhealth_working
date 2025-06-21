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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let HealthController = class HealthController {
    async healthCheck() {
        return {
            status: 'ok',
            service: 'label-design-print-management-service',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: '1.0.0',
        };
    }
    async getRoot() {
        return {
            service: 'LeafyHealth Label Design & Print Management Service',
            version: '1.0.0',
            documentation: '/api/docs',
            health: '/health',
        };
    }
    async introspect() {
        return {
            service: 'label-design-print-management-service',
            version: '1.0.0',
            capabilities: [
                'Label Design & Templates',
                'Barcode & QR Code Generation',
                'Food Safety Compliance Labeling',
                'Multi-language Label Support',
                'Print Queue Management',
                'Batch Printing Operations',
                'Nutritional Information Labels',
                'Promotional Price Tags',
            ],
            endpoints: {
                labels: '/labels',
                templates: '/templates',
                barcodes: '/barcodes',
                printing: '/print',
                compliance: '/compliance',
                health: '/health',
                docs: '/api/docs',
            },
            port: 3018,
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Root endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getRoot", null);
__decorate([
    (0, common_1.Get)('__introspect'),
    (0, swagger_1.ApiOperation)({ summary: 'Service introspection' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service capabilities and endpoints' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "introspect", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)()
], HealthController);
//# sourceMappingURL=health.controller.js.map