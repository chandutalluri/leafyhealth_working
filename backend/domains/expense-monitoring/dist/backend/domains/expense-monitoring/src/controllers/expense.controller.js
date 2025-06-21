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
exports.ExpenseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../../shared/auth");
const expense_service_1 = require("../services/expense.service");
const create_expense_dto_1 = require("../dto/create-expense.dto");
const update_expense_dto_1 = require("../dto/update-expense.dto");
let ExpenseController = class ExpenseController {
    constructor(expenseService) {
        this.expenseService = expenseService;
    }
    async createExpense(createExpenseDto) {
        return this.expenseService.createExpense(createExpenseDto);
    }
    async getExpenses(page = '1', limit = '20', status) {
        return this.expenseService.getExpenses({
            page: parseInt(page),
            limit: parseInt(limit),
            status,
        });
    }
    async getExpensesByCategory(category) {
        return this.expenseService.getExpensesByCategory(category);
    }
    async getExpensesByDateRange(startDate, endDate) {
        return this.expenseService.getExpensesByDateRange(new Date(startDate), new Date(endDate));
    }
    async getPendingExpenses() {
        return this.expenseService.getPendingExpenses();
    }
    async getMonthlyExpenseSummary(year, month) {
        return this.expenseService.getMonthlyExpenseSummary(parseInt(year), parseInt(month));
    }
    async getExpenseById(id) {
        return this.expenseService.getExpenseById(parseInt(id));
    }
    async updateExpense(id, updateExpenseDto) {
        return this.expenseService.updateExpense(parseInt(id), updateExpenseDto);
    }
    async approveExpense(id) {
        return this.expenseService.approveExpense(parseInt(id));
    }
    async rejectExpense(id, reason) {
        return this.expenseService.rejectExpense(parseInt(id), reason);
    }
    async deleteExpense(id) {
        return this.expenseService.deleteExpense(parseInt(id));
    }
};
exports.ExpenseController = ExpenseController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new expense record' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Expense created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_expense_dto_1.CreateExpenseDto]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all expenses with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Expense status filter' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getExpenses", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get expenses by category' }),
    (0, swagger_1.ApiParam)({ name: 'category', description: 'Expense category' }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getExpensesByCategory", null);
__decorate([
    (0, common_1.Get)('date-range'),
    (0, swagger_1.ApiOperation)({ summary: 'Get expenses within date range' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getExpensesByDateRange", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending expenses requiring approval' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getPendingExpenses", null);
__decorate([
    (0, common_1.Get)('monthly-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly expense summary' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, description: 'Year (YYYY)' }),
    (0, swagger_1.ApiQuery)({ name: 'month', required: true, description: 'Month (1-12)' }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getMonthlyExpenseSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get expense details by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Expense ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getExpenseById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update expense record' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Expense ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_expense_dto_1.UpdateExpenseDto]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "updateExpense", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve expense' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Expense ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "approveExpense", null);
__decorate([
    (0, common_1.Put)(':id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject expense' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Expense ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "rejectExpense", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete expense record' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Expense ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "deleteExpense", null);
exports.ExpenseController = ExpenseController = __decorate([
    (0, swagger_1.ApiTags)('expenses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Controller)('expenses'),
    __metadata("design:paramtypes", [expense_service_1.ExpenseService])
], ExpenseController);
//# sourceMappingURL=expense.controller.js.map