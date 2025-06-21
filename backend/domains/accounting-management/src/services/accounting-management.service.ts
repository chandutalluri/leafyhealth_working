import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/connection';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  CreateExpenseDto,
  UpdateExpenseDto,
} from '../dto/accounting-management.dto';
import { eq, desc, sql } from 'drizzle-orm';
import { transactions, expenses } from '../../../../../shared/schema';

@Injectable()
export class AccountingManagementService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Transaction Methods
  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const db = this.databaseService.getDatabase();
    
    const [transaction] = await db.insert(transactions).values({
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
      .from(transactions)
      .orderBy(desc(transactions.createdAt));

    return {
      success: true,
      data: allTransactions,
      count: allTransactions.length
    };
  }

  async getTransactionById(id: number) {
    const db = this.databaseService.getDatabase();
    
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return {
      success: true,
      data: transaction
    };
  }

  async updateTransaction(id: number, updateTransactionDto: UpdateTransactionDto) {
    const db = this.databaseService.getDatabase();
    
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (updateTransactionDto.description) updateData.description = updateTransactionDto.description;
    if (updateTransactionDto.amount) updateData.amount = updateTransactionDto.amount.toString();
    if (updateTransactionDto.type) updateData.type = updateTransactionDto.type;
    if (updateTransactionDto.category) updateData.category = updateTransactionDto.category;
    if (updateTransactionDto.reference) updateData.reference = updateTransactionDto.reference;
    if (updateTransactionDto.transactionDate) updateData.transactionDate = updateTransactionDto.transactionDate;
    
    const [updatedTransaction] = await db
      .update(transactions)
      .set(updateData)
      .where(eq(transactions.id, id))
      .returning();

    if (!updatedTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return {
      success: true,
      data: updatedTransaction,
      message: 'Transaction updated successfully'
    };
  }

  async deleteTransaction(id: number) {
    const db = this.databaseService.getDatabase();
    
    const [deletedTransaction] = await db
      .delete(transactions)
      .where(eq(transactions.id, id))
      .returning();

    if (!deletedTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return {
      success: true,
      message: 'Transaction deleted successfully'
    };
  }

  // Expense Methods
  async createExpense(createExpenseDto: CreateExpenseDto) {
    const db = this.databaseService.getDatabase();
    
    const [expense] = await db.insert(expenses).values({
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
      .from(expenses)
      .orderBy(desc(expenses.createdAt));

    return {
      success: true,
      data: allExpenses,
      count: allExpenses.length
    };
  }

  async getExpenseById(id: number) {
    const db = this.databaseService.getDatabase();
    
    const [expense] = await db
      .select()
      .from(expenses)
      .where(eq(expenses.id, id));

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return {
      success: true,
      data: expense
    };
  }

  async updateExpense(id: number, updateExpenseDto: UpdateExpenseDto) {
    const db = this.databaseService.getDatabase();
    
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (updateExpenseDto.description) updateData.description = updateExpenseDto.description;
    if (updateExpenseDto.amount) updateData.amount = updateExpenseDto.amount.toString();
    if (updateExpenseDto.category) updateData.category = updateExpenseDto.category;
    if (updateExpenseDto.vendor) updateData.vendor = updateExpenseDto.vendor;
    if (updateExpenseDto.receiptNumber) updateData.receiptNumber = updateExpenseDto.receiptNumber;
    if (updateExpenseDto.expenseDate) updateData.expenseDate = updateExpenseDto.expenseDate;
    
    const [updatedExpense] = await db
      .update(expenses)
      .set(updateData)
      .where(eq(expenses.id, id))
      .returning();

    if (!updatedExpense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return {
      success: true,
      data: updatedExpense,
      message: 'Expense updated successfully'
    };
  }

  async deleteExpense(id: number) {
    const db = this.databaseService.getDatabase();
    
    const [deletedExpense] = await db
      .delete(expenses)
      .where(eq(expenses.id, id))
      .returning();

    if (!deletedExpense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return {
      success: true,
      message: 'Expense deleted successfully'
    };
  }

  // Report Methods
  async getProfitLossReport() {
    const db = this.databaseService.getDatabase();
    
    const revenue = await db
      .select({ 
        total: sql<number>`sum(${transactions.amount})` 
      })
      .from(transactions)
      .where(eq(transactions.type, 'income'));

    const totalExpenses = await db
      .select({ 
        total: sql<number>`sum(${expenses.amount})` 
      })
      .from(expenses);

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
        total: sql<number>`sum(${transactions.amount})` 
      })
      .from(transactions)
      .where(eq(transactions.type, 'asset'));

    const liabilities = await db
      .select({ 
        total: sql<number>`sum(${transactions.amount})` 
      })
      .from(transactions)
      .where(eq(transactions.type, 'liability'));

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
}