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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../../shared/auth");
const analytics_service_1 = require("../services/analytics.service");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getSalesAnalytics(period) {
        return this.analyticsService.getSalesAnalytics(period);
    }
    async getCustomerAnalytics() {
        return this.analyticsService.getCustomerAnalytics();
    }
    async getProductAnalytics() {
        return this.analyticsService.getProductAnalytics();
    }
    async getSystemAnalytics() {
        return this.analyticsService.getSystemAnalytics();
    }
    async getDashboardMetrics() {
        return this.analyticsService.getDashboardMetrics();
    }
    getIntrospection() {
        return {
            service: 'Analytics Service',
            version: '1.0.0',
            capabilities: [
                'Sales Analytics',
                'Customer Analytics',
                'Product Analytics',
                'System Analytics',
                'Dashboard Metrics'
            ],
            endpoints: {
                'GET /analytics/sales': 'Sales analytics with period filter',
                'GET /analytics/customers': 'Customer analytics and statistics',
                'GET /analytics/products': 'Product performance analytics',
                'GET /analytics/system': 'System-wide analytics',
                'GET /analytics/dashboard': 'Dashboard summary metrics'
            },
            database: 'Connected to PostgreSQL',
            timestamp: new Date().toISOString()
        };
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('sales'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sales analytics' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, description: 'Time period (7d, 30d, 90d, 1y)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sales analytics data' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSalesAnalytics", null);
__decorate([
    (0, common_1.Get)('customers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer analytics data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCustomerAnalytics", null);
__decorate([
    (0, common_1.Get)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product analytics data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getProductAnalytics", null);
__decorate([
    (0, common_1.Get)('system'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System analytics data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSystemAnalytics", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboardMetrics", null);
__decorate([
    (0, common_1.Get)('__introspect'),
    (0, swagger_1.ApiOperation)({ summary: 'Service introspection' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service capabilities and endpoints' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getIntrospection", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map