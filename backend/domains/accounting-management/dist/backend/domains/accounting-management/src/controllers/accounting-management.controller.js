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
exports.AccountingManagementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const accounting_management_service_1 = require("../services/accounting-management.service");
const accounting_management_dto_1 = require("../dto/accounting-management.dto");
let AccountingManagementController = class AccountingManagementController {
    constructor(accountingManagementService) {
        this.accountingManagementService = accountingManagementService;
    }
    getHealth() {
        return {
            status: 'healthy',
            service: 'accounting-management',
            timestamp: new Date().toISOString()
        };
    }
    createTransaction(createTransactionDto) {
        return this.accountingManagementService.createTransaction(createTransactionDto);
    }
    getTransactions() {
        return this.accountingManagementService.getAllTransactions();
    }
    getTransaction(id) {
        return this.accountingManagementService.getTransactionById(id);
    }
    updateTransaction(id, updateTransactionDto) {
        return this.accountingManagementService.updateTransaction(id, updateTransactionDto);
    }
    deleteTransaction(id) {
        return this.accountingManagementService.deleteTransaction(id);
    }
    createExpense(createExpenseDto) {
        return this.accountingManagementService.createExpense(createExpenseDto);
    }
    getExpenses() {
        return this.accountingManagementService.getAllExpenses();
    }
    getExpense(id) {
        return this.accountingManagementService.getExpenseById(id);
    }
    updateExpense(id, updateExpenseDto) {
        return this.accountingManagementService.updateExpense(id, updateExpenseDto);
    }
    deleteExpense(id) {
        return this.accountingManagementService.deleteExpense(id);
    }
    getProfitLossReport() {
        return this.accountingManagementService.getProfitLossReport();
    }
    getBalanceSheetReport() {
        return this.accountingManagementService.getBalanceSheetReport();
    }
};
exports.AccountingManagementController = AccountingManagementController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccountingManagementController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Post)('transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new transaction' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Transaction created successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [accounting_management_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", void 0)
], AccountingManagementController.prototype, "createTransaction", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all transactions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transactions retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccountingManagementController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)('transactions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction retrieved successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AccountingManagementController.prototype, "getTransaction", null);
__decorate([
    (0, common_1.Put)('transactions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update transaction' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, accounting_management_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", void 0)
], AccountingManagementController.prototype, "updateTransaction", null);
__decorate([
    (0, common_1.Delete)('transactions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete transaction' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AccountingManagementController.prototype, "deleteTransaction", null);
__decorate([
    (0, common_1.Post)('expenses'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new expense' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Expense created successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [accounting_management_dto_1.CreateExpenseDto]),
    __metadata("design:returntype", void 0)
], AccountingManagementController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Get)('expenses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all expenses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expenses retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccountingManagementController.prototype, "getExpenses", null);
__decorate([
    (0, common_1.Get)('expenses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get expense by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expense retrieved successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AccountingManagementController.prototype, "getExpense", null);
__decorate([
    (0, common_1.Put)('expenses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update expense' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expense updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, accounting_management_dto_1.UpdateExpenseDto]),
    __metadata("design:returntype", void 0)
], AccountingManagementController.prototype, "updateExpense", null);
__decorate([
    (0, common_1.Delete)('expenses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete expense' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expense deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AccountingManagementController.prototype, "deleteExpense", null);
__decorate([
    (0, common_1.Get)('reports/profit-loss'),
    (0, swagger_1.ApiOperation)({ summary: 'Get profit and loss report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profit and loss report retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccountingManagementController.prototype, "getProfitLossReport", null);
__decorate([
    (0, common_1.Get)('reports/balance-sheet'),
    (0, swagger_1.ApiOperation)({ summary: 'Get balance sheet report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Balance sheet report retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccountingManagementController.prototype, "getBalanceSheetReport", null);
exports.AccountingManagementController = AccountingManagementController = __decorate([
    (0, swagger_1.ApiTags)('Accounting Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('accounting-management'),
    __metadata("design:paramtypes", [accounting_management_service_1.AccountingManagementService])
], AccountingManagementController);
//# sourceMappingURL=accounting-management.controller.js.map