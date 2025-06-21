import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  health() {
    return {
      status: 'ok',
      service: 'inventory-management-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'Service information' })
  root() {
    return {
      service: 'LeafyHealth Inventory Management Service',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/health',
        inventory: '/inventory',
        documentation: '/api/docs'
      }
    };
  }
}