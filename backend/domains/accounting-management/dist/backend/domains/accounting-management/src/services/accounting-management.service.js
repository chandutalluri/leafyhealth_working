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
exports.AccountingManagementService = void 0;
const common_1 = require("@nestjs/common");
const connection_1 = require("../database/connection");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../../../../shared/schema");
let AccountingManagementService = class AccountingManagementService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async createTransaction(createTransactionDto) {
        const db = this.databaseService.getDatabase();
        const [transaction] = await db.insert(schema_1.transactions).values({
            description: createTransactionDto.description,
            amount: createTransactionDto.amount.toString(),
            type: createTransactionDto.type,
            category: createTransactionDto.category,
            reference: createTransactionDto.reference,
            transactionDate: createTransactionDto.transactionDate,
        }).returning();
        return {
            success: true,
            data: transaction,
            message: 'Transaction created successfully'
        };
    }
    async getAllTransactions() {
        const db = this.databaseService.getDatabase();
        const allTransactions = await db
            .select()
            .from(schema_1.transactions)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.transactions.createdAt));
        return {
            success: true,
            data: allTransactions,
            count: allTransactions.length
        };
    }
    async getTransactionById(id) {
        const db = this.databaseService.getDatabase();
        const [transaction] = await db
            .select()
            .from(schema_1.transactions)
            .where((0, drizzle_orm_1.eq)(schema_1.transactions.id, id));
        if (!transaction) {
            throw new common_1.NotFoundException(`Transaction with ID ${id} not found`);
        }
        return {
            success: true,
            data: transaction
        };
    }
    async updateTransaction(id, updateTransactionDto) {
        const db = this.databaseService.getDatabase();
        const updateData = {
            updatedAt: new Date(),
        };
        if (updateTransactionDto.description)
            updateData.description = updateTransactionDto.description;
        if (updateTransactionDto.amount)
            updateData.amount = updateTransactionDto.amount.toString();
        if (updateTransactionDto.type)
            updateData.type = updateTransactionDto.type;
        if (updateTransactionDto.category)
            updateData.category = updateTransactionDto.category;
        if (updateTransactionDto.reference)
            updateData.reference = updateTransactionDto.reference;
        if (updateTransactionDto.transactionDate)
            updateData.transactionDate = updateTransactionDto.transactionDate;
        const [updatedTransaction] = await db
            .update(schema_1.transactions)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.transactions.id, id))
            .returning();
        if (!updatedTransaction) {
            throw new common_1.NotFoundException(`Transaction with ID ${id} not found`);
        }
        return {
            success: true,
            data: updatedTransaction,
            message: 'Transaction updated successfully'
        };
    }
    async deleteTransaction(id) {
        const db = this.databaseService.getDatabase();
        const [deletedTransaction] = await db
            .delete(schema_1.transactions)
            .where((0, drizzle_orm_1.eq)(schema_1.transactions.id, id))
            .returning();
        if (!deletedTransaction) {
            throw new common_1.NotFoundException(`Transaction with ID ${id} not found`);
        }
        return {
            success: true,
            message: 'Transaction deleted successfully'
        };
    }
    async createExpense(createExpenseDto) {
        const db = this.databaseService.getDatabase();
        const [expense] = await db.insert(schema_1.expenses).values({
            description: createExpenseDto.description,
            amount: createExpenseDto.amount.toString(),
            category: createExpenseDto.category,
            vendor: createExpenseDto.vendor,
            receiptNumber: createExpenseDto.receiptNumber,
            expenseDate: createExpenseDto.expenseDate,
        }).returning();
        return {
            success: true,
            data: expense,
            message: 'Expense created successfully'
        };
    }
    async getAllExpenses() {
        const db = this.databaseService.getDatabase();
        const allExpenses = await db
            .select()
            .from(schema_1.expenses)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.expenses.createdAt));
        return {
            success: true,
            data: allExpenses,
            count: allExpenses.length
        };
    }
    async getExpenseById(id) {
        const db = this.databaseService.getDatabase();
        const [expense] = await db
            .select()
            .from(schema_1.expenses)
            .where((0, drizzle_orm_1.eq)(schema_1.expenses.id, id));
        if (!expense) {
            throw new common_1.NotFoundException(`Expense with ID ${id} not found`);
        }
        return {
            success: true,
            data: expense
        };
    }
    async updateExpense(id, updateExpenseDto) {
        const db = this.databaseService.getDatabase();
        const updateData = {
            updatedAt: new Date(),
        };
        if (updateExpenseDto.description)
            updateData.description = updateExpenseDto.description;
        if (updateExpenseDto.amount)
            updateData.amount = updateExpenseDto.amount.toString();
        if (updateExpenseDto.category)
            updateData.category = updateExpenseDto.category;
        if (updateExpenseDto.vendor)
            updateData.vendor = updateExpenseDto.vendor;
        if (updateExpenseDto.receiptNumber)
            updateData.receiptNumber = updateExpenseDto.receiptNumber;
        if (updateExpenseDto.expenseDate)
            updateData.expenseDate = updateExpenseDto.expenseDate;
        const [updatedExpense] = await db
            .update(schema_1.expenses)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.expenses.id, id))
            .returning();
        if (!updatedExpense) {
            throw new common_1.NotFoundException(`Expense with ID ${id} not found`);
        }
        return {
            success: true,
            data: updatedExpense,
            message: 'Expense updated successfully'
        };
    }
    async deleteExpense(id) {
        const db = this.databaseService.getDatabase();
        const [deletedExpense] = await db
            .delete(schema_1.expenses)
            .where((0, drizzle_orm_1.eq)(schema_1.expenses.id, id))
            .returning();
        if (!deletedExpense) {
            throw new common_1.NotFoundException(`Expense with ID ${id} not found`);
        }
        return {
            success: true,
            message: 'Expense deleted successfully'
        };
    }
    async getProfitLossReport() {
        const db = this.databaseService.getDatabase();
        const revenue = await db
            .select({
            total: (0, drizzle_orm_1.sql) `sum(${schema_1.transactions.amount})`
        })
            .from(schema_1.transactions)
            .where((0, drizzle_orm_1.eq)(schema_1.transactions.type, 'income'));
        const totalExpenses = await db
            .select({
            total: (0, drizzle_orm_1.sql) `sum(${schema_1.expenses.amount})`
        })
            .from(schema_1.expenses);
        const revenueAmount = revenue[0]?.total || 0;
        const expenseAmount = totalExpenses[0]?.total || 0;
        const profit = revenueAmount - expenseAmount;
        return {
            success: true,
            data: {
                revenue: revenueAmount,
                expenses: expenseAmount,
                profit,
                profitMargin: revenueAmount > 0 ? (profit / revenueAmount) * 100 : 0
            }
        };
    }
    async getBalanceSheetReport() {
        const db = this.databaseService.getDatabase();
        const assets = await db
            .select({
            total: (0, drizzle_orm_1.sql) `sum(${schema_1.transactions.amount})`
        })
            .from(schema_1.transactions)
            .where((0, drizzle_orm_1.eq)(schema_1.transactions.type, 'asset'));
        const liabilities = await db
            .select({
            total: (0, drizzle_orm_1.sql) `sum(${schema_1.transactions.amount})`
        })
            .from(schema_1.transactions)
            .where((0, drizzle_orm_1.eq)(schema_1.transactions.type, 'liability'));
        const assetsAmount = assets[0]?.total || 0;
        const liabilitiesAmount = liabilities[0]?.total || 0;
        const equity = assetsAmount - liabilitiesAmount;
        return {
            success: true,
            data: {
                assets: assetsAmount,
                liabilities: liabilitiesAmount,
                equity
            }
        };
    }
};
exports.AccountingManagementService = AccountingManagementService;
exports.AccountingManagementService = AccountingManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [connection_1.DatabaseService])
], AccountingManagementService);
//# sourceMappingURL=accounting-management.service.js.map