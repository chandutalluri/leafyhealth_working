import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { expenses } from '../schema';
import { eq, desc, between, and } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

@Injectable()
export class ExpenseService {
  async createExpense(createExpenseDto: any) {
    const [expense] = await db.insert(expenses).values({
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

  async getExpenses(filters: any = {}) {
    return await this.getAllExpenses(filters.status, filters.category);
  }

  async getAllExpenses(status?: string, category?: string) {
    let query = db.select().from(expenses).orderBy(desc(expenses.createdAt));
    return await query;
  }

  async getExpensesByCategory(category: string) {
    return await db.select().from(expenses).where(eq(expenses.category, category));
  }

  async getExpensesByDateRange(startDate: Date, endDate: Date) {
    return await db.select().from(expenses)
      .where(between(expenses.expenseDate, startDate.toISOString(), endDate.toISOString()));
  }

  async getPendingExpenses() {
    return await db.select().from(expenses).where(eq(expenses.status, 'pending'));
  }

  async getMonthlyExpenseSummary(year: number, month: number) {
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

  async updateExpense(id: number, updateExpenseDto: any) {
    const [expense] = await db.update(expenses)
      .set({ ...updateExpenseDto, updatedAt: new Date() })
      .where(eq(expenses.id, id))
      .returning();
    
    return expense;
  }

  async approveExpense(id: number) {
    return await this.updateExpense(id, { status: 'approved' });
  }

  async rejectExpense(id: number, reason: string) {
    return await this.updateExpense(id, { status: 'rejected', rejectionReason: reason });
  }

  async deleteExpense(id: number) {
    await db.delete(expenses).where(eq(expenses.id, id));
    return { message: 'Expense deleted successfully' };
  }

  async getExpenseById(id: number) {
    const [expense] = await db.select().from(expenses)
      .where(eq(expenses.id, id));
    
    return expense;
  }
}