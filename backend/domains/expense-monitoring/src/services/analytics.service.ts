import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  
  async getSpendingTrends(period: string, category?: string) {
    // Mock spending trend data
    const baseData = [
      { period: '2024-01', amount: 15500, transactions: 45 },
      { period: '2024-02', amount: 18200, transactions: 52 },
      { period: '2024-03', amount: 16800, transactions: 48 },
      { period: '2024-04', amount: 19500, transactions: 58 },
      { period: '2024-05', amount: 17200, transactions: 51 }
    ];

    const trendAnalysis = this.calculateTrendAnalysis(baseData);

    return {
      period,
      category: category || 'all',
      data: baseData,
      analysis: {
        ...trendAnalysis,
        averageMonthlySpend: baseData.reduce((sum, item) => sum + item.amount, 0) / baseData.length,
        averageTransactionsPerMonth: baseData.reduce((sum, item) => sum + item.transactions, 0) / baseData.length,
        highestSpendMonth: baseData.reduce((prev, current) => prev.amount > current.amount ? prev : current),
        lowestSpendMonth: baseData.reduce((prev, current) => prev.amount < current.amount ? prev : current)
      },
      forecast: this.generateForecast(baseData, 3)
    };
  }

  async getBudgetVariance(year: number, quarter?: number) {
    const mockVarianceData = [
      {
        costCenter: 'Marketing',
        budgeted: 25000,
        actual: 23500,
        variance: -1500,
        variancePercentage: -6.0
      },
      {
        costCenter: 'IT',
        budgeted: 30000,
        actual: 32500,
        variance: 2500,
        variancePercentage: 8.3
      },
      {
        costCenter: 'Operations',
        budgeted: 15000,
        actual: 14200,
        variance: -800,
        variancePercentage: -5.3
      },
      {
        costCenter: 'Sales',
        budgeted: 20000,
        actual: 21800,
        variance: 1800,
        variancePercentage: 9.0
      }
    ];

    return {
      period: { year, quarter },
      data: mockVarianceData,
      summary: {
        totalBudgeted: mockVarianceData.reduce((sum, item) => sum + item.budgeted, 0),
        totalActual: mockVarianceData.reduce((sum, item) => sum + item.actual, 0),
        totalVariance: mockVarianceData.reduce((sum, item) => sum + item.variance, 0),
        averageVariancePercentage: mockVarianceData.reduce((sum, item) => sum + item.variancePercentage, 0) / mockVarianceData.length,
        overBudgetCenters: mockVarianceData.filter(item => item.variance > 0).length,
        underBudgetCenters: mockVarianceData.filter(item => item.variance < 0).length
      }
    };
  }

  async getCategoryBreakdown(startDate: Date, endDate: Date) {
    const mockCategoryData = [
      { category: 'office_supplies', amount: 5420, percentage: 18.5, transactions: 24 },
      { category: 'software', amount: 8900, percentage: 30.4, transactions: 12 },
      { category: 'travel', amount: 4200, percentage: 14.3, transactions: 8 },
      { category: 'marketing', amount: 6800, percentage: 23.2, transactions: 15 },
      { category: 'utilities', amount: 2100, percentage: 7.2, transactions: 6 },
      { category: 'meals', amount: 1850, percentage: 6.3, transactions: 18 }
    ];

    const totalAmount = mockCategoryData.reduce((sum, item) => sum + item.amount, 0);

    return {
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      },
      totalAmount,
      totalTransactions: mockCategoryData.reduce((sum, item) => sum + item.transactions, 0),
      categoryBreakdown: mockCategoryData,
      insights: {
        topCategory: mockCategoryData.reduce((prev, current) => prev.amount > current.amount ? prev : current),
        mostFrequent: mockCategoryData.reduce((prev, current) => prev.transactions > current.transactions ? prev : current),
        averageTransactionSize: mockCategoryData.map(cat => ({
          category: cat.category,
          avgSize: cat.amount / cat.transactions
        }))
      }
    };
  }

  async getCostCenterAnalysis(period: string) {
    const mockCostCenterData = [
      {
        costCenter: 'Marketing',
        totalSpend: 23500,
        budgetAllocated: 25000,
        utilizationRate: 94.0,
        efficiency: 'high',
        topExpenseCategory: 'marketing',
        employeeCount: 8,
        spendPerEmployee: 2937.50
      },
      {
        costCenter: 'IT',
        totalSpend: 32500,
        budgetAllocated: 30000,
        utilizationRate: 108.3,
        efficiency: 'over_budget',
        topExpenseCategory: 'software',
        employeeCount: 12,
        spendPerEmployee: 2708.33
      },
      {
        costCenter: 'Operations',
        totalSpend: 14200,
        budgetAllocated: 15000,
        utilizationRate: 94.7,
        efficiency: 'optimal',
        topExpenseCategory: 'office_supplies',
        employeeCount: 15,
        spendPerEmployee: 946.67
      },
      {
        costCenter: 'Sales',
        totalSpend: 21800,
        budgetAllocated: 20000,
        utilizationRate: 109.0,
        efficiency: 'over_budget',
        topExpenseCategory: 'travel',
        employeeCount: 10,
        spendPerEmployee: 2180.00
      }
    ];

    return {
      period,
      data: mockCostCenterData,
      benchmarks: {
        averageUtilizationRate: mockCostCenterData.reduce((sum, cc) => sum + cc.utilizationRate, 0) / mockCostCenterData.length,
        averageSpendPerEmployee: mockCostCenterData.reduce((sum, cc) => sum + cc.spendPerEmployee, 0) / mockCostCenterData.length,
        mostEfficientCenter: mockCostCenterData.find(cc => cc.efficiency === 'optimal'),
        highestSpendPerEmployee: mockCostCenterData.reduce((prev, current) => prev.spendPerEmployee > current.spendPerEmployee ? prev : current)
      }
    };
  }

  async getFinancialForecasting(months: number) {
    const historicalData = [
      { month: '2024-01', actual: 15500 },
      { month: '2024-02', actual: 18200 },
      { month: '2024-03', actual: 16800 },
      { month: '2024-04', actual: 19500 },
      { month: '2024-05', actual: 17200 }
    ];

    const forecast = this.generateDetailedForecast(historicalData, months);

    return {
      forecastPeriod: `${months} months`,
      historicalData,
      forecast,
      confidence: {
        level: 78,
        factors: [
          'Historical trend consistency',
          'Seasonal variations',
          'Market conditions',
          'Business growth projections'
        ]
      },
      scenarios: {
        conservative: forecast.map(f => ({ ...f, amount: f.amount * 0.9 })),
        optimistic: forecast.map(f => ({ ...f, amount: f.amount * 1.15 })),
        realistic: forecast
      }
    };
  }

  async getExpensePatterns() {
    return {
      patterns: {
        weeklyPattern: {
          monday: 18.5,
          tuesday: 22.1,
          wednesday: 19.8,
          thursday: 20.2,
          friday: 19.4
        },
        monthlyPattern: {
          earlyMonth: 35.2,
          midMonth: 28.6,
          endMonth: 36.2
        },
        seasonalTrends: {
          Q1: 23.1,
          Q2: 26.8,
          Q3: 24.5,
          Q4: 25.6
        }
      },
      anomalies: [
        {
          date: '2024-01-15',
          amount: 5500,
          expected: 1200,
          deviation: 358.3,
          category: 'equipment',
          description: 'Unusual large equipment purchase'
        },
        {
          date: '2024-02-28',
          amount: 3200,
          expected: 800,
          deviation: 300.0,
          category: 'software',
          description: 'Emergency software license acquisition'
        }
      ],
      insights: {
        mostExpensiveDay: 'End of month',
        costliestCategory: 'software',
        peakSpendingTime: 'Mid-quarter',
        recommendedReviewPeriod: 'weekly'
      }
    };
  }

  async getDashboard() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    return {
      overview: {
        totalSpend: 87500,
        monthlyBudget: 95000,
        budgetUtilization: 92.1,
        remainingBudget: 7500,
        projectedOverrun: 0,
        status: 'on_track'
      },
      currentMonth: {
        month: currentMonth,
        year: currentYear,
        spend: 17200,
        budget: 19000,
        utilizationRate: 90.5,
        daysRemaining: 30 - currentDate.getDate(),
        averageDailySpend: 573.33
      },
      alerts: [
        {
          type: 'warning',
          message: 'Marketing budget at 94% utilization',
          priority: 'medium',
          actionRequired: true
        },
        {
          type: 'info',
          message: 'Q2 budget planning due next week',
          priority: 'low',
          actionRequired: false
        }
      ],
      topCategories: [
        { category: 'software', amount: 26700, percentage: 30.5 },
        { category: 'marketing', amount: 20300, percentage: 23.2 },
        { category: 'office_supplies', amount: 16200, percentage: 18.5 },
        { category: 'travel', amount: 12600, percentage: 14.4 },
        { category: 'utilities', amount: 11700, percentage: 13.4 }
      ],
      recentTransactions: [
        { date: '2024-01-25', description: 'Adobe Creative Suite License', amount: 1200, category: 'software' },
        { date: '2024-01-24', description: 'Office Supplies Bulk Order', amount: 450, category: 'office_supplies' },
        { date: '2024-01-23', description: 'Client Meeting Lunch', amount: 85, category: 'meals' }
      ],
      insights: {
        spendingTrend: 'increasing',
        trendPercentage: 8.3,
        costOptimizationOpportunity: 15000,
        recommendedActions: [
          'Review software subscription utilization',
          'Negotiate better rates with office supply vendors',
          'Implement stricter meal expense policies'
        ]
      }
    };
  }

  private calculateTrendAnalysis(data: any[]) {
    if (data.length < 2) return { trend: 'insufficient_data' };

    const amounts = data.map(d => d.amount);
    const avgGrowth = ((amounts[amounts.length - 1] - amounts[0]) / amounts[0]) * 100;
    
    return {
      trend: avgGrowth > 5 ? 'increasing' : avgGrowth < -5 ? 'decreasing' : 'stable',
      growthRate: avgGrowth,
      volatility: this.calculateVolatility(amounts)
    };
  }

  private calculateVolatility(amounts: number[]): number {
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length;
    return Math.sqrt(variance) / mean * 100; // Coefficient of variation as percentage
  }

  private generateForecast(historicalData: any[], months: number) {
    const lastAmount = historicalData[historicalData.length - 1].amount;
    const trend = this.calculateTrendAnalysis(historicalData).growthRate / 100;
    
    return Array.from({ length: months }, (_, i) => {
      const forecastMonth = new Date();
      forecastMonth.setMonth(forecastMonth.getMonth() + i + 1);
      
      return {
        period: forecastMonth.toISOString().slice(0, 7),
        amount: Math.round(lastAmount * (1 + trend) ** (i + 1)),
        confidence: Math.max(90 - (i * 5), 60) // Decreasing confidence over time
      };
    });
  }

  private generateDetailedForecast(historicalData: any[], months: number) {
    const amounts = historicalData.map(d => d.actual);
    const avgGrowth = this.calculateTrendAnalysis(historicalData).growthRate / 100;
    const lastAmount = amounts[amounts.length - 1];
    
    return Array.from({ length: months }, (_, i) => {
      const forecastMonth = new Date();
      forecastMonth.setMonth(forecastMonth.getMonth() + i + 1);
      
      const baseAmount = lastAmount * (1 + avgGrowth) ** (i + 1);
      const seasonalAdjustment = this.getSeasonalAdjustment(forecastMonth.getMonth());
      
      return {
        month: forecastMonth.toISOString().slice(0, 7),
        amount: Math.round(baseAmount * seasonalAdjustment),
        confidence: Math.max(85 - (i * 3), 55),
        components: {
          base: Math.round(baseAmount),
          seasonal: Math.round(baseAmount * (seasonalAdjustment - 1)),
          trend: Math.round(baseAmount * avgGrowth)
        }
      };
    });
  }

  private getSeasonalAdjustment(month: number): number {
    // Mock seasonal adjustments (0 = January, 11 = December)
    const seasonalFactors = [
      1.05, 0.95, 1.10, 1.08, 0.98, 1.02, // Jan-Jun
      0.92, 0.88, 1.15, 1.12, 1.08, 1.25  // Jul-Dec
    ];
    return seasonalFactors[month] || 1.0;
  }
}