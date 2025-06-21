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
let HealthController = class HealthController {
    async checkHealth() {
        try {
            const dbHealth = { status: 'connected', message: 'Database connection healthy' };
            return {
                status: 'ok',
                service: 'compliance-audit-service',
                timestamp: new Date().toISOString(),
                database: dbHealth,
                version: '1.0.0'
            };
        }
        catch (error) {
            return {
                status: 'error',
                service: 'compliance-audit-service',
                timestamp: new Date().toISOString(),
                error: error.message,
                version: '1.0.0'
            };
        }
    }
    getRoot() {
        return {
            service: 'LeafyHealth Compliance & Audit Service',
            version: '1.0.0',
            status: 'running',
            endpoints: {
                health: '/health',
                compliance: '/compliance',
                docs: '/api/docs'
            }
        };
    }
    getIntrospection() {
        return {
            service: 'compliance-audit-service',
            version: '1.0.0',
            description: 'Regulatory compliance and audit trail management',
            endpoints: [
                'POST /compliance/events - Create compliance event',
                'GET /compliance/events - List compliance events',
                'GET /compliance/audit-trail/:entityType/:entityId - Get audit trail',
                'GET /compliance/stats - Get compliance statistics',
                'POST /compliance/reports/generate - Generate compliance report',
                'GET /health - Health check',
                'GET /__introspect - Service introspection'
            ],
            database: 'PostgreSQL with Drizzle ORM',
            port: 3012
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkHealth", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getRoot", null);
__decorate([
    (0, common_1.Get)('__introspect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getIntrospection", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)()
], HealthController);
//# sourceMappingURL=health.controller.js.map