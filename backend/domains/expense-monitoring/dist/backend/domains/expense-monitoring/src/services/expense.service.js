"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema_1 = require("../schema");
const drizzle_orm_1 = require("drizzle-orm");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const db = (0, node_postgres_1.drizzle)(pool);
let ExpenseService = class ExpenseService {
    async createExpense(createExpenseDto) {
        const [expense] = await db.insert(schema_1.expenses).values({
            expenseNumber: `EXP-${Date.now()}`,
            title: createExpenseDto.title,
            amount: createExpenseDto.amount,
            category: createExpenseDto.category,
            expenseDate: createExpenseDto.expenseDate || new Date().toISOString(),
            submittedBy: createExpenseDto.submittedBy || 1,
            description: createExpenseDto.description,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        }).returning();
        return expense;
    }
    async getExpenses(filters = {}) {
        return await this.getAllExpenses(filters.status, filters.category);
    }
    async getAllExpenses(status, category) {
        let query = db.select().from(schema_1.expenses).orderBy((0, drizzle_orm_1.desc)(schema_1.expenses.createdAt));
        return await query;
    }
    async getExpensesByCategory(category) {
        return await db.select().from(schema_1.expenses).where((0, drizzle_orm_1.eq)(schema_1.expenses.category, category));
    }
    async getExpensesByDateRange(startDate, endDate) {
        return await db.select().from(schema_1.expenses)
            .where((0, drizzle_orm_1.between)(schema_1.expenses.expenseDate, startDate.toISOString(), endDate.toISOString()));
    }
    async getPendingExpenses() {
        return await db.select().from(schema_1.expenses).where((0, drizzle_orm_1.eq)(schema_1.expenses.status, 'pending'));
    }
    async getMonthlyExpenseSummary(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const monthlyExpenses = await this.getExpensesByDateRange(startDate, endDate);
        return {
            totalExpenses: monthlyExpenses.length,
            totalAmount: monthlyExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0),
            byCategory: monthlyExpenses.reduce((acc, exp) => {
                acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
                return acc;
            }, {})
        };
    }
    async updateExpense(id, updateExpenseDto) {
        const [expense] = await db.update(schema_1.expenses)
            .set({ ...updateExpenseDto, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.expenses.id, id))
            .returning();
        return expense;
    }
    async approveExpense(id) {
        return await this.updateExpense(id, { status: 'approved' });
    }
    async rejectExpense(id, reason) {
        return await this.updateExpense(id, { status: 'rejected', rejectionReason: reason });
    }
    async deleteExpense(id) {
        await db.delete(schema_1.expenses).where((0, drizzle_orm_1.eq)(schema_1.expenses.id, id));
        return { message: 'Expense deleted successfully' };
    }
    async getExpenseById(id) {
        const [expense] = await db.select().from(schema_1.expenses)
            .where((0, drizzle_orm_1.eq)(schema_1.expenses.id, id));
        return expense;
    }
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = __decorate([
    (0, common_1.Injectable)()
], ExpenseService);
//# sourceMappingURL=expense.service.js.map