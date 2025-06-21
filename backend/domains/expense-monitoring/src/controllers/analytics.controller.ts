import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from '../services/analytics.service';

@ApiTags('analytics')
// Bearer auth disabled
// Auth disabled for development
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('spending-trends')
  @ApiOperation({ summary: 'Get spending trend analysis' })
  @ApiQuery({ name: 'period', required: false, description: 'Analysis period (monthly, quarterly, yearly)' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by expense category' })
  async getSpendingTrends(
    @Query('period') period: string = 'monthly',
    @Query('category') category?: string,
  ) {
    return this.analyticsService.getSpendingTrends(period, category);
  }

  @Get('budget-variance')
  @ApiOperation({ summary: 'Get budget vs actual variance analysis' })
  @ApiQuery({ name: 'year', required: true, description: 'Year for analysis' })
  @ApiQuery({ name: 'quarter', required: false, description: 'Quarter (1-4)' })
  async getBudgetVariance(
    @Query('year') year: string,
    @Query('quarter') quarter?: string,
  ) {
    return this.analyticsService.getBudgetVariance(parseInt(year), quarter ? parseInt(quarter) : undefined);
  }

  @Get('category-breakdown')
  @ApiOperation({ summary: 'Get expense breakdown by category' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  async getCategoryBreakdown(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getCategoryBreakdown(new Date(startDate), new Date(endDate));
  }

  @Get('cost-center-analysis')
  @ApiOperation({ summary: 'Get cost center performance analysis' })
  @ApiQuery({ name: 'period', required: false, description: 'Analysis period' })
  async getCostCenterAnalysis(@Query('period') period: string = 'monthly') {
    return this.analyticsService.getCostCenterAnalysis(period);
  }

  @Get('financial-forecasting')
  @ApiOperation({ summary: 'Get financial forecasting data' })
  @ApiQuery({ name: 'months', required: false, description: 'Forecast period in months' })
  async getFinancialForecasting(@Query('months') months: string = '6') {
    return this.analyticsService.getFinancialForecasting(parseInt(months));
  }

  @Get('expense-patterns')
  @ApiOperation({ summary: 'Analyze expense patterns and anomalies' })
  async getExpensePatterns() {
    return this.analyticsService.getExpensePatterns();
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get comprehensive financial dashboard data' })
  async getDashboard() {
    return this.analyticsService.getDashboard();
  }
}