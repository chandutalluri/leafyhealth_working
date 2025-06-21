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
    async getSpendingTrends(period = 'monthly', category) {
        return this.analyticsService.getSpendingTrends(period, category);
    }
    async getBudgetVariance(year, quarter) {
        return this.analyticsService.getBudgetVariance(parseInt(year), quarter ? parseInt(quarter) : undefined);
    }
    async getCategoryBreakdown(startDate, endDate) {
        return this.analyticsService.getCategoryBreakdown(new Date(startDate), new Date(endDate));
    }
    async getCostCenterAnalysis(period = 'monthly') {
        return this.analyticsService.getCostCenterAnalysis(period);
    }
    async getFinancialForecasting(months = '6') {
        return this.analyticsService.getFinancialForecasting(parseInt(months));
    }
    async getExpensePatterns() {
        return this.analyticsService.getExpensePatterns();
    }
    async getDashboard() {
        return this.analyticsService.getDashboard();
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('spending-trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get spending trend analysis' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, description: 'Analysis period (monthly, quarterly, yearly)' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Filter by expense category' }),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSpendingTrends", null);
__decorate([
    (0, common_1.Get)('budget-variance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get budget vs actual variance analysis' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, description: 'Year for analysis' }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, description: 'Quarter (1-4)' }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getBudgetVariance", null);
__decorate([
    (0, common_1.Get)('category-breakdown'),
    (0, swagger_1.ApiOperation)({ summary: 'Get expense breakdown by category' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCategoryBreakdown", null);
__decorate([
    (0, common_1.Get)('cost-center-analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cost center performance analysis' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, description: 'Analysis period' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCostCenterAnalysis", null);
__decorate([
    (0, common_1.Get)('financial-forecasting'),
    (0, swagger_1.ApiOperation)({ summary: 'Get financial forecasting data' }),
    (0, swagger_1.ApiQuery)({ name: 'months', required: false, description: 'Forecast period in months' }),
    __param(0, (0, common_1.Query)('months')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getFinancialForecasting", null);
__decorate([
    (0, common_1.Get)('expense-patterns'),
    (0, swagger_1.ApiOperation)({ summary: 'Analyze expense patterns and anomalies' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getExpensePatterns", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive financial dashboard data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboard", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map