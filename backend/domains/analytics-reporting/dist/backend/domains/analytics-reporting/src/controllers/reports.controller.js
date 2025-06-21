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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../../shared/auth");
const reports_service_1 = require("../services/reports.service");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async generateSalesReport(startDate, endDate) {
        const start = startDate || this.getDefaultStartDate();
        const end = endDate || new Date().toISOString();
        return this.reportsService.generateSalesReport(start, end);
    }
    async generateCustomerReport() {
        return this.reportsService.generateCustomerReport();
    }
    async generateInventoryReport() {
        return this.reportsService.generateInventoryReport();
    }
    async generateProductPerformanceReport(period) {
        return this.reportsService.generateProductPerformanceReport(period);
    }
    async generateFinancialReport(startDate, endDate) {
        const start = startDate || this.getDefaultStartDate();
        const end = endDate || new Date().toISOString();
        return this.reportsService.generateFinancialReport(start, end);
    }
    async exportReport(type, format, startDate, endDate, period) {
        const params = {
            startDate,
            endDate,
            period
        };
        return this.reportsService.exportReportData(type, format, params);
    }
    getIntrospection() {
        return {
            service: 'Reports Service',
            version: '1.0.0',
            capabilities: [
                'Sales Reports',
                'Customer Reports',
                'Inventory Reports',
                'Product Performance Reports',
                'Financial Reports',
                'Data Export'
            ],
            endpoints: {
                'GET /reports/sales': 'Sales report with date range',
                'GET /reports/customers': 'Customer analytics report',
                'GET /reports/inventory': 'Current inventory status report',
                'GET /reports/products': 'Product performance report',
                'GET /reports/financial': 'Financial report with payment breakdown',
                'GET /reports/export': 'Export reports in various formats'
            },
            database: 'Connected to PostgreSQL',
            timestamp: new Date().toISOString()
        };
    }
    getDefaultStartDate() {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString();
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('sales'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate sales report' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sales report data' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "generateSalesReport", null);
__decorate([
    (0, common_1.Get)('customers'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate customer report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer report data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "generateCustomerReport", null);
__decorate([
    (0, common_1.Get)('inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate inventory report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory report data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "generateInventoryReport", null);
__decorate([
    (0, common_1.Get)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate product performance report' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, description: 'Time period (7d, 30d, 90d, 1y)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product performance report' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "generateProductPerformanceReport", null);
__decorate([
    (0, common_1.Get)('financial'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate financial report' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Financial report data' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "generateFinancialReport", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export report data' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: true, description: 'Report type (sales, customers, inventory, products, financial)' }),
    (0, swagger_1.ApiQuery)({ name: 'format', required: false, description: 'Export format (json, csv)' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Start date for time-based reports' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'End date for time-based reports' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, description: 'Period for product reports' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exported report data' }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('format')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportReport", null);
__decorate([
    (0, common_1.Get)('__introspect'),
    (0, swagger_1.ApiOperation)({ summary: 'Service introspection' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service capabilities and endpoints' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getIntrospection", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map