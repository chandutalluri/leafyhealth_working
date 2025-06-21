import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from '../services/analytics.service';

@ApiTags('Analytics')
// Bearer auth disabled
// Auth disabled for development
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sales')
  @ApiOperation({ summary: 'Get sales analytics' })
  @ApiQuery({ name: 'period', required: false, description: 'Time period (7d, 30d, 90d, 1y)' })
  @ApiResponse({ status: 200, description: 'Sales analytics data' })
  async getSalesAnalytics(@Query('period') period?: string) {
    return this.analyticsService.getSalesAnalytics(period);
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get customer analytics' })
  @ApiResponse({ status: 200, description: 'Customer analytics data' })
  async getCustomerAnalytics() {
    return this.analyticsService.getCustomerAnalytics();
  }

  @Get('products')
  @ApiOperation({ summary: 'Get product analytics' })
  @ApiResponse({ status: 200, description: 'Product analytics data' })
  async getProductAnalytics() {
    return this.analyticsService.getProductAnalytics();
  }

  @Get('system')
  @ApiOperation({ summary: 'Get system analytics' })
  @ApiResponse({ status: 200, description: 'System analytics data' })
  async getSystemAnalytics() {
    return this.analyticsService.getSystemAnalytics();
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard metrics' })
  @ApiResponse({ status: 200, description: 'Dashboard metrics' })
  async getDashboardMetrics() {
    return this.analyticsService.getDashboardMetrics();
  }

  @Get('__introspect')
  @ApiOperation({ summary: 'Service introspection' })
  @ApiResponse({ status: 200, description: 'Service capabilities and endpoints' })
  getIntrospection() {
    return {
      service: 'Analytics Service',
      version: '1.0.0',
      capabilities: [
        'Sales Analytics',
        'Customer Analytics', 
        'Product Analytics',
        'System Analytics',
        'Dashboard Metrics'
      ],
      endpoints: {
        'GET /analytics/sales': 'Sales analytics with period filter',
        'GET /analytics/customers': 'Customer analytics and statistics',
        'GET /analytics/products': 'Product performance analytics',
        'GET /analytics/system': 'System-wide analytics',
        'GET /analytics/dashboard': 'Dashboard summary metrics'
      },
      database: 'Connected to PostgreSQL',
      timestamp: new Date().toISOString()
    };
  }
}