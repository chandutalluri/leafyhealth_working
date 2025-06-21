export declare class AnalyticsService {
    getSpendingTrends(period: string, category?: string): Promise<{
        period: string;
        category: string;
        data: {
            period: string;
            amount: number;
            transactions: number;
        }[];
        analysis: {
            averageMonthlySpend: number;
            averageTransactionsPerMonth: number;
            highestSpendMonth: {
                period: string;
                amount: number;
                transactions: number;
            };
            lowestSpendMonth: {
                period: string;
                amount: number;
                transactions: number;
            };
            trend: string;
            growthRate?: undefined;
            volatility?: undefined;
        } | {
            averageMonthlySpend: number;
            averageTransactionsPerMonth: number;
            highestSpendMonth: {
                period: string;
                amount: number;
                transactions: number;
            };
            lowestSpendMonth: {
                period: string;
                amount: number;
                transactions: number;
            };
            trend: string;
            growthRate: number;
            volatility: number;
        };
        forecast: {
            period: string;
            amount: number;
            confidence: number;
        }[];
    }>;
    getBudgetVariance(year: number, quarter?: number): Promise<{
        period: {
            year: number;
            quarter: number;
        };
        data: {
            costCenter: string;
            budgeted: number;
            actual: number;
            variance: number;
            variancePercentage: number;
        }[];
        summary: {
            totalBudgeted: number;
            totalActual: number;
            totalVariance: number;
            averageVariancePercentage: number;
            overBudgetCenters: number;
            underBudgetCenters: number;
        };
    }>;
    getCategoryBreakdown(startDate: Date, endDate: Date): Promise<{
        dateRange: {
            start: string;
            end: string;
        };
        totalAmount: number;
        totalTransactions: number;
        categoryBreakdown: {
            category: string;
            amount: number;
            percentage: number;
            transactions: number;
        }[];
        insights: {
            topCategory: {
                category: string;
                amount: number;
                percentage: number;
                transactions: number;
            };
            mostFrequent: {
                category: string;
                amount: number;
                percentage: number;
                transactions: number;
            };
            averageTransactionSize: {
                category: string;
                avgSize: number;
            }[];
        };
    }>;
    getCostCenterAnalysis(period: string): Promise<{
        period: string;
        data: {
            costCenter: string;
            totalSpend: number;
            budgetAllocated: number;
            utilizationRate: number;
            efficiency: string;
            topExpenseCategory: string;
            employeeCount: number;
            spendPerEmployee: number;
        }[];
        benchmarks: {
            averageUtilizationRate: number;
            averageSpendPerEmployee: number;
            mostEfficientCenter: {
                costCenter: string;
                totalSpend: number;
                budgetAllocated: number;
                utilizationRate: number;
                efficiency: string;
                topExpenseCategory: string;
                employeeCount: number;
                spendPerEmployee: number;
            };
            highestSpendPerEmployee: {
                costCenter: string;
                totalSpend: number;
                budgetAllocated: number;
                utilizationRate: number;
                efficiency: string;
                topExpenseCategory: string;
                employeeCount: number;
                spendPerEmployee: number;
            };
        };
    }>;
    getFinancialForecasting(months: number): Promise<{
        forecastPeriod: string;
        historicalData: {
            month: string;
            actual: number;
        }[];
        forecast: {
            month: string;
            amount: number;
            confidence: number;
            components: {
                base: number;
                seasonal: number;
                trend: number;
            };
        }[];
        confidence: {
            level: number;
            factors: string[];
        };
        scenarios: {
            conservative: {
                amount: number;
                month: string;
                confidence: number;
                components: {
                    base: number;
                    seasonal: number;
                    trend: number;
                };
            }[];
            optimistic: {
                amount: number;
                month: string;
                confidence: number;
                components: {
                    base: number;
                    seasonal: number;
                    trend: number;
                };
            }[];
            realistic: {
                month: string;
                amount: number;
                confidence: number;
                components: {
                    base: number;
                    seasonal: number;
                    trend: number;
                };
            }[];
        };
    }>;
    getExpensePatterns(): Promise<{
        patterns: {
            weeklyPattern: {
                monday: number;
                tuesday: number;
                wednesday: number;
                thursday: number;
                friday: number;
            };
            monthlyPattern: {
                earlyMonth: number;
                midMonth: number;
                endMonth: number;
            };
            seasonalTrends: {
                Q1: number;
                Q2: number;
                Q3: number;
                Q4: number;
            };
        };
        anomalies: {
            date: string;
            amount: number;
            expected: number;
            deviation: number;
            category: string;
            description: string;
        }[];
        insights: {
            mostExpensiveDay: string;
            costliestCategory: string;
            peakSpendingTime: string;
            recommendedReviewPeriod: string;
        };
    }>;
    getDashboard(): Promise<{
        overview: {
            totalSpend: number;
            monthlyBudget: number;
            budgetUtilization: number;
            remainingBudget: number;
            projectedOverrun: number;
            status: string;
        };
        currentMonth: {
            month: number;
            year: number;
            spend: number;
            budget: number;
            utilizationRate: number;
            daysRemaining: number;
            averageDailySpend: number;
        };
        alerts: {
            type: string;
            message: string;
            priority: string;
            actionRequired: boolean;
        }[];
        topCategories: {
            category: string;
            amount: number;
            percentage: number;
        }[];
        recentTransactions: {
            date: string;
            description: string;
            amount: number;
            category: string;
        }[];
        insights: {
            spendingTrend: string;
            trendPercentage: number;
            costOptimizationOpportunity: number;
            recommendedActions: string[];
        };
    }>;
    private calculateTrendAnalysis;
    private calculateVolatility;
    private generateForecast;
    private generateDetailedForecast;
    private getSeasonalAdjustment;
}
