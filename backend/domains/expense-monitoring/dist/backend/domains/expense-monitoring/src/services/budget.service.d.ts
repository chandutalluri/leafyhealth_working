import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
export declare class BudgetService {
    private budgets;
    createBudget(createBudgetDto: CreateBudgetDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getBudgets(filters: {
        status?: string;
        period?: string;
    }): Promise<{
        data: any[];
        summary: {
            totalBudgets: number;
            totalAllocated: any;
            totalSpent: any;
            averageUtilization: number;
        };
    }>;
    getActiveBudgets(): Promise<{
        activeBudgets: number;
        data: any[];
    }>;
    getBudgetAlerts(): Promise<{
        totalAlerts: number;
        criticalAlerts: number;
        warningAlerts: number;
        alerts: {
            budgetId: any;
            budgetName: any;
            type: string;
            severity: string;
            message: string;
            utilizationPercentage: number;
            amount: any;
            spent: any;
            remaining: number;
            createdAt: string;
        }[];
    }>;
    getBudgetUtilization(): Promise<{
        data: {
            id: any;
            name: any;
            costCenter: any;
            period: any;
            allocated: any;
            spent: any;
            remaining: number;
            utilizationPercentage: number;
            status: any;
            performance: string;
            projectedSpend: number;
        }[];
        overall: {
            totalAllocated: any;
            totalSpent: any;
            averageUtilization: number;
            budgetsOverThreshold: number;
        };
    }>;
    getBudgetVarianceReport(year: number, quarter?: number): Promise<{
        period: {
            year: number;
            quarter: number;
        };
        data: {
            budgetId: any;
            budgetName: any;
            costCenter: any;
            allocated: any;
            actual: any;
            variance: number;
            variancePercentage: number;
            status: string;
        }[];
        summary: {
            totalBudgets: number;
            totalVariance: number;
            averageVariance: number;
            overBudgetCount: number;
            underBudgetCount: number;
        };
    }>;
    getBudgetById(id: number): Promise<{
        data: any;
    }>;
    getBudgetSpending(id: number): Promise<{
        budgetId: number;
        budgetName: any;
        totalAllocated: any;
        totalSpent: any;
        spendingHistory: {
            date: string;
            amount: number;
            cumulative: number;
        }[];
        categoryBreakdown: {};
        monthlyTrend: {
            month: string;
            budgeted: number;
            actual: number;
        }[];
    }>;
    updateBudget(id: number, updateBudgetDto: UpdateBudgetDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    activateBudget(id: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    deactivateBudget(id: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    deleteBudget(id: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    private calculateDaysRemaining;
    private getBudgetPerformance;
    private calculateProjectedSpend;
    private generateSpendingHistory;
    private generateCategorySpending;
    private generateMonthlyTrend;
}
