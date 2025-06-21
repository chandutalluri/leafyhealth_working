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
    async getHealth() {
        const checks = await Promise.allSettled([
            this.checkMemory(),
        ]);
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'user-role-management-service',
            port: process.env.USER_SERVICE_PORT || 3020,
            version: '1.0.0',
            checks: {
                memory: checks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
            },
            uptime: process.uptime(),
            memory: process.memoryUsage(),
        };
        const hasUnhealthy = Object.values(health.checks).includes('unhealthy');
        if (hasUnhealthy) {
            health.status = 'unhealthy';
        }
        return health;
    }
    root() {
        return {
            service: 'LeafyHealth User & Role Management Service',
            message: 'User management service is running',
            endpoints: {
                health: '/health',
                docs: '/api/docs',
                introspect: '/__introspect',
                users: '/users',
                roles: '/roles'
            }
        };
    }
    async checkMemory() {
        const usage = process.memoryUsage();
        const maxHeap = 1024 * 1024 * 1024;
        return usage.heapUsed < maxHeap;
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Service health check' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "root", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)()
], HealthController);
//# sourceMappingURL=health.controller.js.map