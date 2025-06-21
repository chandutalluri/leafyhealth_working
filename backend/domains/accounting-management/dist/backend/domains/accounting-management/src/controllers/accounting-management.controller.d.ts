import { AccountingManagementService } from '../services/accounting-management.service';
import { CreateTransactionDto, UpdateTransactionDto, CreateExpenseDto, UpdateExpenseDto } from '../dto/accounting-management.dto';
export declare class AccountingManagementController {
    private readonly accountingManagementService;
    constructor(accountingManagementService: AccountingManagementService);
    getHealth(): {
        status: string;
        service: string;
        timestamp: string;
    };
    createTransaction(createTransactionDto: CreateTransactionDto): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            category: string;
            reference: string;
            amount: string;
            type: string;
            transactionDate: string;
        };
        message: string;
    }>;
    getTransactions(): Promise<{
        success: boolean;
        data: {
            id: number;
            description: string;
            amount: string;
            type: string;
            category: string;
            reference: string;
            transactionDate: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        count: number;
    }>;
    getTransaction(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            description: string;
            amount: string;
            type: string;
            category: string;
            reference: string;
            transactionDate: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateTransaction(id: number, updateTransactionDto: UpdateTransactionDto): Promise<{
        success: boolean;
        data: {
            id: number;
            description: string;
            amount: string;
            type: string;
            category: string;
            reference: string;
            transactionDate: string;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    deleteTransaction(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createExpense(createExpenseDto: CreateExpenseDto): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            category: string;
            amount: string;
            vendor: string;
            receiptNumber: string;
            expenseDate: string;
        };
        message: string;
    }>;
    getExpenses(): Promise<{
        success: boolean;
        data: {
            id: number;
            description: string;
            amount: string;
            category: string;
            vendor: string;
            receiptNumber: string;
            expenseDate: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        count: number;
    }>;
    getExpense(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            description: string;
            amount: string;
            category: string;
            vendor: string;
            receiptNumber: string;
            expenseDate: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateExpense(id: number, updateExpenseDto: UpdateExpenseDto): Promise<{
        success: boolean;
        data: {
            id: number;
            description: string;
            amount: string;
            category: string;
            vendor: string;
            receiptNumber: string;
            expenseDate: string;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    deleteExpense(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getProfitLossReport(): Promise<{
        success: boolean;
        data: {
            revenue: number;
            expenses: number;
            profit: number;
            profitMargin: number;
        };
    }>;
    getBalanceSheetReport(): Promise<{
        success: boolean;
        data: {
            assets: number;
            liabilities: number;
            equity: number;
        };
    }>;
}
