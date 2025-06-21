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
    getHealth() {
        return {
            status: 'ok',
            service: 'payment-processing',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            environment: process.env.NODE_ENV || 'development'
        };
    }
    getRoot() {
        return {
            service: 'LeafyHealth Payment Processing Service',
            version: '1.0.0',
            status: 'running',
            documentation: '/api/docs'
        };
    }
    getIntrospection() {
        return {
            service: 'payment-processing',
            version: '1.0.0',
            capabilities: [
                'razorpay-payments',
                'hdfc-smartgateway',
                'payment-verification',
                'refund-processing',
                'webhook-handling',
                'analytics'
            ],
            endpoints: {
                health: '/health',
                payments: '/api/payments',
                verification: '/api/payments/verify/{gateway}',
                webhooks: '/api/payments/webhook/{gateway}',
                analytics: '/api/payments/analytics'
            },
            gateways: ['razorpay', 'hdfc_smartgateway'],
            database: 'postgresql'
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Root endpoint' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getRoot", null);
__decorate([
    (0, common_1.Get)('__introspect'),
    (0, swagger_1.ApiOperation)({ summary: 'Service introspection' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getIntrospection", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)()
], HealthController);
//# sourceMappingURL=health.controller.js.map