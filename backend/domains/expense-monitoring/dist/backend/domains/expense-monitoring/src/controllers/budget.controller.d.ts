import { BudgetService } from '../services/budget.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
export declare class BudgetController {
    private readonly budgetService;
    constructor(budgetService: BudgetService);
    createBudget(createBudgetDto: CreateBudgetDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getBudgets(status?: string, period?: string): Promise<{
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
    getBudgetVarianceReport(year: string, quarter?: string): Promise<{
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
    getBudgetById(id: string): Promise<{
        data: any;
    }>;
    getBudgetSpending(id: string): Promise<{
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
    updateBudget(id: string, updateBudgetDto: UpdateBudgetDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    activateBudget(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    deactivateBudget(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    deleteBudget(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
