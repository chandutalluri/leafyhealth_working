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
exports.PerformanceMonitorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const performance_monitor_service_1 = require("../services/performance-monitor.service");
const performance_monitor_dto_1 = require("../dto/performance-monitor.dto");
let PerformanceMonitorController = class PerformanceMonitorController {
    constructor(performanceMonitorService) {
        this.performanceMonitorService = performanceMonitorService;
    }
    async getHealth() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'performance-monitor'
        };
    }
    async createMetric(createMetricDto) {
        return this.performanceMonitorService.createMetric(createMetricDto);
    }
    async getMetrics() {
        return this.performanceMonitorService.getAllMetrics();
    }
    async getMetric(id) {
        return this.performanceMonitorService.getMetricById(parseInt(id));
    }
    async updateMetric(id, updateMetricDto) {
        return this.performanceMonitorService.updateMetric(parseInt(id), updateMetricDto);
    }
    async deleteMetric(id) {
        return this.performanceMonitorService.deleteMetric(parseInt(id));
    }
    async getServiceMetrics(serviceName) {
        return this.performanceMonitorService.getServiceMetrics(serviceName);
    }
    async getDashboardOverview() {
        return this.performanceMonitorService.getDashboardOverview();
    }
    async createAlert(alertData) {
        return this.performanceMonitorService.createAlert(alertData);
    }
};
exports.PerformanceMonitorController = PerformanceMonitorController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceMonitorController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Post)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new performance metric' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Metric created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [performance_monitor_dto_1.CreateMetricDto]),
    __metadata("design:returntype", Promise)
], PerformanceMonitorController.prototype, "createMetric", null);
__decorate([
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all performance metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceMonitorController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('metrics/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get metric by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Metric details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceMonitorController.prototype, "getMetric", null);
__decorate([
    (0, common_1.Put)('metrics/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update metric' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Metric updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, performance_monitor_dto_1.UpdateMetricDto]),
    __metadata("design:returntype", Promise)
], PerformanceMonitorController.prototype, "updateMetric", null);
__decorate([
    (0, common_1.Delete)('metrics/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete metric' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Metric deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceMonitorController.prototype, "deleteMetric", null);
__decorate([
    (0, common_1.Get)('metrics/service/:serviceName'),
    (0, swagger_1.ApiOperation)({ summary: 'Get metrics for specific service' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service metrics' }),
    __param(0, (0, common_1.Param)('serviceName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceMonitorController.prototype, "getServiceMetrics", null);
__decorate([
    (0, common_1.Get)('dashboard/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get performance dashboard overview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceMonitorController.prototype, "getDashboardOverview", null);
__decorate([
    (0, common_1.Post)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Create performance alert' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Alert created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PerformanceMonitorController.prototype, "createAlert", null);
exports.PerformanceMonitorController = PerformanceMonitorController = __decorate([
    (0, swagger_1.ApiTags)('Performance Monitor'),
    (0, common_1.Controller)('performance-monitor'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [performance_monitor_service_1.PerformanceMonitorService])
], PerformanceMonitorController);
//# sourceMappingURL=performance-monitor.controller.js.map