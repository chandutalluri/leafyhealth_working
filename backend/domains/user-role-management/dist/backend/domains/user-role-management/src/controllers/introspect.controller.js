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
exports.IntrospectController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../../shared/auth");
let IntrospectController = class IntrospectController {
    getIntrospection() {
        return {
            service: {
                name: 'user-role-management-service',
                domain: 'user-role-management',
                version: '1.0.0',
                port: process.env.USER_SERVICE_PORT || 3020,
                environment: process.env.NODE_ENV || 'development',
            },
            capabilities: [
                'health-monitoring',
                'api-documented',
                'user-management',
                'role-assignment',
                'permission-control',
                'team-organization'
            ],
            endpoints: {
                health: '/health',
                docs: '/api/docs',
                introspect: '/__introspect',
                api: '/users',
            },
            dependencies: [
                'JWT Authentication',
            ],
            events: {
                published: [
                    'user.created',
                    'user.updated',
                    'user.deleted',
                    'role.assigned',
                    'permission.granted'
                ],
                subscribed: [
                    'user.authenticated',
                    'system.shutdown',
                ],
            },
            monitoring: {
                metrics: 'enabled',
                logging: 'structured',
                tracing: 'distributed',
            },
        };
    }
};
exports.IntrospectController = IntrospectController;
__decorate([
    (0, common_1.Get)('__introspect'),
    (0, swagger_1.ApiOperation)({ summary: 'Service introspection and capabilities' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntrospectController.prototype, "getIntrospection", null);
exports.IntrospectController = IntrospectController = __decorate([
    (0, swagger_1.ApiTags)('Service Discovery'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Controller)()
], IntrospectController);
//# sourceMappingURL=introspect.controller.js.map