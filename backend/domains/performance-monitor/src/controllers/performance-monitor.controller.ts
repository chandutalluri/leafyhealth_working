import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PerformanceMonitorService } from '../services/performance-monitor.service';
import { CreateMetricDto, UpdateMetricDto } from '../dto/performance-monitor.dto';

@ApiTags('Performance Monitor')
@Controller('performance-monitor')
// Auth disabled for development
// Bearer auth disabled
export class PerformanceMonitorController {
  constructor(private readonly performanceMonitorService: PerformanceMonitorService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'performance-monitor'
    };
  }

  @Post('metrics')
  @ApiOperation({ summary: 'Create new performance metric' })
  @ApiResponse({ status: 201, description: 'Metric created successfully' })
  async createMetric(@Body() createMetricDto: CreateMetricDto) {
    return this.performanceMonitorService.createMetric(createMetricDto);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get all performance metrics' })
  @ApiResponse({ status: 200, description: 'List of metrics' })
  async getMetrics() {
    return this.performanceMonitorService.getAllMetrics();
  }

  @Get('metrics/:id')
  @ApiOperation({ summary: 'Get metric by ID' })
  @ApiResponse({ status: 200, description: 'Metric details' })
  async getMetric(@Param('id') id: string) {
    return this.performanceMonitorService.getMetricById(parseInt(id));
  }

  @Put('metrics/:id')
  @ApiOperation({ summary: 'Update metric' })
  @ApiResponse({ status: 200, description: 'Metric updated successfully' })
  async updateMetric(
    @Param('id') id: string,
    @Body() updateMetricDto: UpdateMetricDto
  ) {
    return this.performanceMonitorService.updateMetric(parseInt(id), updateMetricDto);
  }

  @Delete('metrics/:id')
  @ApiOperation({ summary: 'Delete metric' })
  @ApiResponse({ status: 200, description: 'Metric deleted successfully' })
  async deleteMetric(@Param('id') id: string) {
    return this.performanceMonitorService.deleteMetric(parseInt(id));
  }

  @Get('metrics/service/:serviceName')
  @ApiOperation({ summary: 'Get metrics for specific service' })
  @ApiResponse({ status: 200, description: 'Service metrics' })
  async getServiceMetrics(@Param('serviceName') serviceName: string) {
    return this.performanceMonitorService.getServiceMetrics(serviceName);
  }

  @Get('dashboard/overview')
  @ApiOperation({ summary: 'Get performance dashboard overview' })
  @ApiResponse({ status: 200, description: 'Dashboard data' })
  async getDashboardOverview() {
    return this.performanceMonitorService.getDashboardOverview();
  }

  @Post('alerts')
  @ApiOperation({ summary: 'Create performance alert' })
  @ApiResponse({ status: 201, description: 'Alert created successfully' })
  async createAlert(@Body() alertData: any) {
    return this.performanceMonitorService.createAlert(alertData);
  }
}