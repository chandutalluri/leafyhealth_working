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
    health() {
        return {
            status: 'ok',
            service: 'expense-monitoring-service',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: '1.0.0',
        };
    }
    root() {
        return {
            service: 'LeafyHealth Expense Monitoring & Budget Control Service',
            version: '1.0.0',
            status: 'operational',
            endpoints: {
                health: '/health',
                docs: '/api/docs',
                introspect: '/__introspect',
            },
        };
    }
    introspect() {
        return {
            service: 'expense-monitoring-service',
            version: '1.0.0',
            description: 'Expense Monitoring & Budget Control Service',
            capabilities: [
                'expense-tracking',
                'budget-management',
                'cost-analytics',
                'spending-insights',
                'budget-alerts',
                'expense-categorization',
                'financial-reporting',
                'variance-analysis'
            ],
            endpoints: {
                expenses: {
                    'POST /expenses': 'Create new expense',
                    'GET /expenses': 'Get all expenses',
                    'GET /expenses/category/:category': 'Get expenses by category',
                    'GET /expenses/date-range': 'Get expenses in date range',
                    'GET /expenses/:id': 'Get expense details',
                    'PUT /expenses/:id': 'Update expense',
                    'DELETE /expenses/:id': 'Delete expense'
                },
                budgets: {
                    'POST /budgets': 'Create new budget',
                    'GET /budgets': 'Get all budgets',
                    'GET /budgets/active': 'Get active budgets',
                    'GET /budgets/:id': 'Get budget details',
                    'PUT /budgets/:id': 'Update budget',
                    'DELETE /budgets/:id': 'Delete budget'
                },
                analytics: {
                    'GET /analytics/spending-trends': 'Get spending trend analysis',
                    'GET /analytics/budget-variance': 'Get budget vs actual variance',
                    'GET /analytics/category-breakdown': 'Get expense breakdown by category',
                    'GET /analytics/cost-center-analysis': 'Get cost center performance',
                    'GET /analytics/dashboard': 'Get financial dashboard data'
                }
            },
            database: {
                connected: true,
                tables: ['expenses', 'budgets', 'expense_categories', 'budget_alerts']
            },
            features: [
                'Real-time expense tracking',
                'Multi-level budget hierarchies',
                'Automated budget alerts',
                'Advanced cost analytics',
                'Spending pattern recognition',
                'Financial forecasting',
                'Expense approval workflows',
                'Integration with accounting systems'
            ]
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
    __metadata("design:returntype", void 0)
], HealthController.prototype, "health", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Root endpoint' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "root", null);
__decorate([
    (0, common_1.Get)('__introspect'),
    (0, swagger_1.ApiOperation)({ summary: 'Service introspection' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "introspect", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)()
], HealthController);
//# sourceMappingURL=health.controller.js.map