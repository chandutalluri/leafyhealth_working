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
exports.BudgetController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../../shared/auth");
const budget_service_1 = require("../services/budget.service");
const create_budget_dto_1 = require("../dto/create-budget.dto");
const update_budget_dto_1 = require("../dto/update-budget.dto");
let BudgetController = class BudgetController {
    constructor(budgetService) {
        this.budgetService = budgetService;
    }
    async createBudget(createBudgetDto) {
        return this.budgetService.createBudget(createBudgetDto);
    }
    async getBudgets(status, period) {
        return this.budgetService.getBudgets({ status, period });
    }
    async getActiveBudgets() {
        return this.budgetService.getActiveBudgets();
    }
    async getBudgetAlerts() {
        return this.budgetService.getBudgetAlerts();
    }
    async getBudgetUtilization() {
        return this.budgetService.getBudgetUtilization();
    }
    async getBudgetVarianceReport(year, quarter) {
        return this.budgetService.getBudgetVarianceReport(parseInt(year), quarter ? parseInt(quarter) : undefined);
    }
    async getBudgetById(id) {
        return this.budgetService.getBudgetById(+id);
    }
    async getBudgetSpending(id) {
        return this.budgetService.getBudgetSpending(+id);
    }
    async updateBudget(id, updateBudgetDto) {
        return this.budgetService.updateBudget(+id, updateBudgetDto);
    }
    async activateBudget(id) {
        return this.budgetService.activateBudget(+id);
    }
    async deactivateBudget(id) {
        return this.budgetService.deactivateBudget(+id);
    }
    async deleteBudget(id) {
        return this.budgetService.deleteBudget(+id);
    }
};
exports.BudgetController = BudgetController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new budget' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Budget created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_budget_dto_1.CreateBudgetDto]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "createBudget", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all budgets with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by budget status' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, description: 'Filter by budget period' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getBudgets", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active budgets' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getActiveBudgets", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get budget alerts and warnings' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getBudgetAlerts", null);
__decorate([
    (0, common_1.Get)('utilization'),
    (0, swagger_1.ApiOperation)({ summary: 'Get budget utilization analysis' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getBudgetUtilization", null);
__decorate([
    (0, common_1.Get)('variance-report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get budget variance report' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, description: 'Year for variance analysis' }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, description: 'Quarter (1-4)' }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getBudgetVarianceReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get budget by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Budget ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getBudgetById", null);
__decorate([
    (0, common_1.Get)(':id/spending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed budget spending analysis' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Budget ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getBudgetSpending", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update budget by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Budget ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_budget_dto_1.UpdateBudgetDto]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "updateBudget", null);
__decorate([
    (0, common_1.Put)(':id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate a budget' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Budget ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "activateBudget", null);
__decorate([
    (0, common_1.Put)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a budget' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Budget ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "deactivateBudget", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete budget by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Budget ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "deleteBudget", null);
exports.BudgetController = BudgetController = __decorate([
    (0, swagger_1.ApiTags)('budgets'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Controller)('budgets'),
    __metadata("design:paramtypes", [budget_service_1.BudgetService])
], BudgetController);
//# sourceMappingURL=budget.controller.js.map