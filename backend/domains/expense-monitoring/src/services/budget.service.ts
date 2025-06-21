import { Injectable } from '@nestjs/common';
import { CreateBudgetDto, BudgetStatus } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';

@Injectable()
export class BudgetService {
  private budgets: any[] = [
    {
      id: 1,
      name: 'Q1 2024 Marketing Budget',
      amount: 25000.00,
      spent: 18500.00,
      period: 'quarterly',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      costCenter: 'Marketing',
      categories: ['marketing', 'software', 'travel'],
      status: 'active',
      alertThreshold: 80,
      ownerId: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Annual IT Infrastructure',
      amount: 120000.00,
      spent: 45000.00,
      period: 'yearly',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      costCenter: 'IT',
      categories: ['software', 'equipment'],
      status: 'active',
      alertThreshold: 75,
      ownerId: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 3,
      name: 'Monthly Office Operations',
      amount: 5000.00,
      spent: 3200.00,
      period: 'monthly',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      costCenter: 'Administration',
      categories: ['office_supplies', 'utilities'],
      status: 'active',
      alertThreshold: 90,
      ownerId: 3,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  async createBudget(createBudgetDto: CreateBudgetDto) {
    const newBudget = {
      id: this.budgets.length + 1,
      ...createBudgetDto,
      spent: 0,
      status: createBudgetDto.status || BudgetStatus.DRAFT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as any;

    this.budgets.push(newBudget);

    return {
      success: true,
      message: 'Budget created successfully',
      data: newBudget
    };
  }

  async getBudgets(filters: { status?: string; period?: string }) {
    let filteredBudgets = [...this.budgets];

    if (filters.status) {
      filteredBudgets = filteredBudgets.filter(budget => budget.status === filters.status);
    }

    if (filters.period) {
      filteredBudgets = filteredBudgets.filter(budget => budget.period === filters.period);
    }

    // Calculate utilization percentage for each budget
    const budgetsWithUtilization = filteredBudgets.map(budget => ({
      ...budget,
      utilizationPercentage: (budget.spent / budget.amount) * 100,
      remaining: budget.amount - budget.spent,
      isOverBudget: budget.spent > budget.amount,
      alertTriggered: (budget.spent / budget.amount) * 100 >= budget.alertThreshold
    }));

    return {
      data: budgetsWithUtilization,
      summary: {
        totalBudgets: filteredBudgets.length,
        totalAllocated: filteredBudgets.reduce((sum, budget) => sum + budget.amount, 0),
        totalSpent: filteredBudgets.reduce((sum, budget) => sum + budget.spent, 0),
        averageUtilization: filteredBudgets.length > 0 ? 
          filteredBudgets.reduce((sum, budget) => sum + (budget.spent / budget.amount), 0) / filteredBudgets.length * 100 : 0
      }
    };
  }

  async getActiveBudgets() {
    const activeBudgets = this.budgets.filter(budget => budget.status === 'active');
    
    return {
      activeBudgets: activeBudgets.length,
      data: activeBudgets.map(budget => ({
        ...budget,
        utilizationPercentage: (budget.spent / budget.amount) * 100,
        remaining: budget.amount - budget.spent,
        daysRemaining: this.calculateDaysRemaining(budget.endDate)
      }))
    };
  }

  async getBudgetAlerts() {
    const alerts = this.budgets
      .filter(budget => budget.status === 'active')
      .map(budget => {
        const utilizationPercentage = (budget.spent / budget.amount) * 100;
        const isOverBudget = budget.spent > budget.amount;
        const alertTriggered = utilizationPercentage >= budget.alertThreshold;

        if (isOverBudget || alertTriggered) {
          return {
            budgetId: budget.id,
            budgetName: budget.name,
            type: isOverBudget ? 'over_budget' : 'threshold_exceeded',
            severity: isOverBudget ? 'critical' : 'warning',
            message: isOverBudget 
              ? `Budget exceeded by $${(budget.spent - budget.amount).toFixed(2)}`
              : `Budget utilization at ${utilizationPercentage.toFixed(1)}% (threshold: ${budget.alertThreshold}%)`,
            utilizationPercentage,
            amount: budget.amount,
            spent: budget.spent,
            remaining: budget.amount - budget.spent,
            createdAt: new Date().toISOString()
          };
        }
        return null;
      })
      .filter(alert => alert !== null);

    return {
      totalAlerts: alerts.length,
      criticalAlerts: alerts.filter(alert => alert.severity === 'critical').length,
      warningAlerts: alerts.filter(alert => alert.severity === 'warning').length,
      alerts
    };
  }

  async getBudgetUtilization() {
    const utilization = this.budgets.map(budget => {
      const utilizationPercentage = (budget.spent / budget.amount) * 100;
      
      return {
        id: budget.id,
        name: budget.name,
        costCenter: budget.costCenter,
        period: budget.period,
        allocated: budget.amount,
        spent: budget.spent,
        remaining: budget.amount - budget.spent,
        utilizationPercentage,
        status: budget.status,
        performance: this.getBudgetPerformance(utilizationPercentage, budget.alertThreshold),
        projectedSpend: this.calculateProjectedSpend(budget)
      };
    });

    return {
      data: utilization,
      overall: {
        totalAllocated: this.budgets.reduce((sum, budget) => sum + budget.amount, 0),
        totalSpent: this.budgets.reduce((sum, budget) => sum + budget.spent, 0),
        averageUtilization: utilization.reduce((sum, budget) => sum + budget.utilizationPercentage, 0) / utilization.length,
        budgetsOverThreshold: utilization.filter(budget => budget.utilizationPercentage >= 80).length
      }
    };
  }

  async getBudgetVarianceReport(year: number, quarter?: number) {
    let filteredBudgets = this.budgets.filter(budget => {
      const budgetYear = new Date(budget.startDate).getFullYear();
      return budgetYear === year;
    });

    if (quarter) {
      filteredBudgets = filteredBudgets.filter(budget => {
        const budgetQuarter = Math.ceil((new Date(budget.startDate).getMonth() + 1) / 3);
        return budgetQuarter === quarter;
      });
    }

    const variance = filteredBudgets.map(budget => {
      const variance = budget.spent - budget.amount;
      const variancePercentage = (variance / budget.amount) * 100;
      
      return {
        budgetId: budget.id,
        budgetName: budget.name,
        costCenter: budget.costCenter,
        allocated: budget.amount,
        actual: budget.spent,
        variance,
        variancePercentage,
        status: variance > 0 ? 'over_budget' : variance < 0 ? 'under_budget' : 'on_target'
      };
    });

    return {
      period: { year, quarter },
      data: variance,
      summary: {
        totalBudgets: variance.length,
        totalVariance: variance.reduce((sum, budget) => sum + budget.variance, 0),
        averageVariance: variance.length > 0 ? variance.reduce((sum, budget) => sum + budget.variancePercentage, 0) / variance.length : 0,
        overBudgetCount: variance.filter(budget => budget.variance > 0).length,
        underBudgetCount: variance.filter(budget => budget.variance < 0).length
      }
    };
  }

  async getBudgetById(id: number) {
    const budget = this.budgets.find(budget => budget.id === id);
    
    if (!budget) {
      throw new Error('Budget not found');
    }

    const utilizationPercentage = (budget.spent / budget.amount) * 100;

    return {
      data: {
        ...budget,
        utilizationPercentage,
        remaining: budget.amount - budget.spent,
        daysRemaining: this.calculateDaysRemaining(budget.endDate),
        performance: this.getBudgetPerformance(utilizationPercentage, budget.alertThreshold),
        projectedSpend: this.calculateProjectedSpend(budget)
      }
    };
  }

  async getBudgetSpending(id: number) {
    const budget = this.budgets.find(budget => budget.id === id);
    
    if (!budget) {
      throw new Error('Budget not found');
    }

    // Mock spending history - in real implementation, this would come from expense data
    const spendingHistory = this.generateSpendingHistory(budget);

    return {
      budgetId: id,
      budgetName: budget.name,
      totalAllocated: budget.amount,
      totalSpent: budget.spent,
      spendingHistory,
      categoryBreakdown: this.generateCategorySpending(budget),
      monthlyTrend: this.generateMonthlyTrend(budget)
    };
  }

  async updateBudget(id: number, updateBudgetDto: UpdateBudgetDto) {
    const budgetIndex = this.budgets.findIndex(budget => budget.id === id);
    
    if (budgetIndex === -1) {
      throw new Error('Budget not found');
    }

    this.budgets[budgetIndex] = {
      ...this.budgets[budgetIndex],
      ...updateBudgetDto,
      updatedAt: new Date().toISOString()
    } as any;

    return {
      success: true,
      message: 'Budget updated successfully',
      data: this.budgets[budgetIndex]
    };
  }

  async activateBudget(id: number) {
    const budgetIndex = this.budgets.findIndex(budget => budget.id === id);
    
    if (budgetIndex === -1) {
      throw new Error('Budget not found');
    }

    this.budgets[budgetIndex].status = 'active';
    (this.budgets[budgetIndex] as any).updatedAt = new Date().toISOString();

    return {
      success: true,
      message: 'Budget activated successfully',
      data: this.budgets[budgetIndex]
    };
  }

  async deactivateBudget(id: number) {
    const budgetIndex = this.budgets.findIndex(budget => budget.id === id);
    
    if (budgetIndex === -1) {
      throw new Error('Budget not found');
    }

    this.budgets[budgetIndex].status = 'inactive';
    (this.budgets[budgetIndex] as any).updatedAt = new Date().toISOString();

    return {
      success: true,
      message: 'Budget deactivated successfully',
      data: this.budgets[budgetIndex]
    };
  }

  async deleteBudget(id: number) {
    const budgetIndex = this.budgets.findIndex(budget => budget.id === id);
    
    if (budgetIndex === -1) {
      throw new Error('Budget not found');
    }

    const deletedBudget = this.budgets.splice(budgetIndex, 1)[0];

    return {
      success: true,
      message: 'Budget deleted successfully',
      data: deletedBudget
    };
  }

  private calculateDaysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const now = new Date();
    const timeDiff = end.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  private getBudgetPerformance(utilizationPercentage: number, threshold: number): string {
    if (utilizationPercentage > 100) return 'over_budget';
    if (utilizationPercentage >= threshold) return 'at_risk';
    if (utilizationPercentage >= threshold * 0.7) return 'on_track';
    return 'under_utilized';
  }

  private calculateProjectedSpend(budget: any): number {
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate);
    const now = new Date();
    
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    const daysPassed = (now.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    
    if (daysPassed <= 0) return 0;
    if (daysPassed >= totalDays) return budget.spent;
    
    const dailySpendRate = budget.spent / daysPassed;
    return dailySpendRate * totalDays;
  }

  private generateSpendingHistory(budget: any) {
    // Mock data - in real implementation, aggregate actual expense data
    return [
      { date: '2024-01-01', amount: 5000, cumulative: 5000 },
      { date: '2024-01-15', amount: 7500, cumulative: 12500 },
      { date: '2024-02-01', amount: 6000, cumulative: 18500 }
    ];
  }

  private generateCategorySpending(budget: any) {
    // Mock data based on budget categories
    const mockSpending = {};
    budget.categories?.forEach((category, index) => {
      mockSpending[category] = (budget.spent / budget.categories.length) * (1 + (index * 0.2));
    });
    return mockSpending;
  }

  private generateMonthlyTrend(budget: any) {
    // Mock monthly spending trend
    return [
      { month: 'January', budgeted: budget.amount / 12, actual: budget.spent * 0.4 },
      { month: 'February', budgeted: budget.amount / 12, actual: budget.spent * 0.6 }
    ];
  }
}