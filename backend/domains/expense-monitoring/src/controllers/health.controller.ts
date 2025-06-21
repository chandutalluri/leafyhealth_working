import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  health() {
    return {
      status: 'ok',
      service: 'expense-monitoring-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  root() {
    return {
      service: 'LeafyHealth Expense Monitoring & Budget Control Service',
      version: '1.0.0',
      status: 'operational',
      endpoints: {
        health: '/health',
        docs: '/api/docs',
        introspect: '/__introspect',
      },
    };
  }

  @Get('__introspect')
  @ApiOperation({ summary: 'Service introspection' })
  introspect() {
    return {
      service: 'expense-monitoring-service',
      version: '1.0.0',
      description: 'Expense Monitoring & Budget Control Service',
      capabilities: [
        'expense-tracking',
        'budget-management',
        'cost-analytics',
        'spending-insights',
        'budget-alerts',
        'expense-categorization',
        'financial-reporting',
        'variance-analysis'
      ],
      endpoints: {
        expenses: {
          'POST /expenses': 'Create new expense',
          'GET /expenses': 'Get all expenses',
          'GET /expenses/category/:category': 'Get expenses by category',
          'GET /expenses/date-range': 'Get expenses in date range',
          'GET /expenses/:id': 'Get expense details',
          'PUT /expenses/:id': 'Update expense',
          'DELETE /expenses/:id': 'Delete expense'
        },
        budgets: {
          'POST /budgets': 'Create new budget',
          'GET /budgets': 'Get all budgets',
          'GET /budgets/active': 'Get active budgets',
          'GET /budgets/:id': 'Get budget details',
          'PUT /budgets/:id': 'Update budget',
          'DELETE /budgets/:id': 'Delete budget'
        },
        analytics: {
          'GET /analytics/spending-trends': 'Get spending trend analysis',
          'GET /analytics/budget-variance': 'Get budget vs actual variance',
          'GET /analytics/category-breakdown': 'Get expense breakdown by category',
          'GET /analytics/cost-center-analysis': 'Get cost center performance',
          'GET /analytics/dashboard': 'Get financial dashboard data'
        }
      },
      database: {
        connected: true,
        tables: ['expenses', 'budgets', 'expense_categories', 'budget_alerts']
      },
      features: [
        'Real-time expense tracking',
        'Multi-level budget hierarchies',
        'Automated budget alerts',
        'Advanced cost analytics',
        'Spending pattern recognition',
        'Financial forecasting',
        'Expense approval workflows',
        'Integration with accounting systems'
      ]
    };
  }
}