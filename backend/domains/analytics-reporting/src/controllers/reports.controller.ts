import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from '../services/reports.service';

@ApiTags('Reports')
// Bearer auth disabled
// Auth disabled for development
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @ApiOperation({ summary: 'Generate sales report' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Sales report data' })
  async generateSalesReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate || this.getDefaultStartDate();
    const end = endDate || new Date().toISOString();
    return this.reportsService.generateSalesReport(start, end);
  }

  @Get('customers')
  @ApiOperation({ summary: 'Generate customer report' })
  @ApiResponse({ status: 200, description: 'Customer report data' })
  async generateCustomerReport() {
    return this.reportsService.generateCustomerReport();
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Generate inventory report' })
  @ApiResponse({ status: 200, description: 'Inventory report data' })
  async generateInventoryReport() {
    return this.reportsService.generateInventoryReport();
  }

  @Get('products')
  @ApiOperation({ summary: 'Generate product performance report' })
  @ApiQuery({ name: 'period', required: false, description: 'Time period (7d, 30d, 90d, 1y)' })
  @ApiResponse({ status: 200, description: 'Product performance report' })
  async generateProductPerformanceReport(@Query('period') period?: string) {
    return this.reportsService.generateProductPerformanceReport(period);
  }

  @Get('financial')
  @ApiOperation({ summary: 'Generate financial report' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Financial report data' })
  async generateFinancialReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate || this.getDefaultStartDate();
    const end = endDate || new Date().toISOString();
    return this.reportsService.generateFinancialReport(start, end);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export report data' })
  @ApiQuery({ name: 'type', required: true, description: 'Report type (sales, customers, inventory, products, financial)' })
  @ApiQuery({ name: 'format', required: false, description: 'Export format (json, csv)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for time-based reports' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for time-based reports' })
  @ApiQuery({ name: 'period', required: false, description: 'Period for product reports' })
  @ApiResponse({ status: 200, description: 'Exported report data' })
  async exportReport(
    @Query('type') type: string,
    @Query('format') format?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('period') period?: string
  ) {
    const params = {
      startDate,
      endDate,
      period
    };
    return this.reportsService.exportReportData(type, format, params);
  }

  @Get('__introspect')
  @ApiOperation({ summary: 'Service introspection' })
  @ApiResponse({ status: 200, description: 'Service capabilities and endpoints' })
  getIntrospection() {
    return {
      service: 'Reports Service',
      version: '1.0.0',
      capabilities: [
        'Sales Reports',
        'Customer Reports',
        'Inventory Reports',
        'Product Performance Reports',
        'Financial Reports',
        'Data Export'
      ],
      endpoints: {
        'GET /reports/sales': 'Sales report with date range',
        'GET /reports/customers': 'Customer analytics report',
        'GET /reports/inventory': 'Current inventory status report',
        'GET /reports/products': 'Product performance report',
        'GET /reports/financial': 'Financial report with payment breakdown',
        'GET /reports/export': 'Export reports in various formats'
      },
      database: 'Connected to PostgreSQL',
      timestamp: new Date().toISOString()
    };
  }

  private getDefaultStartDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString();
  }
}