import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'ok',
      service: 'analytics-reporting-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'Service information' })
  getRoot() {
    return {
      service: 'Analytics & Reporting Service',
      version: '1.0.0',
      description: 'Business analytics and reporting operations',
      endpoints: {
        health: '/health',
        docs: '/api/docs',
        analytics: '/analytics',
        reports: '/reports'
      }
    };
  }
}