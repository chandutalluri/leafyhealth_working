import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth() {
    return {
      status: 'ok',
      service: 'payment-processing',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  getRoot() {
    return {
      service: 'LeafyHealth Payment Processing Service',
      version: '1.0.0',
      status: 'running',
      documentation: '/api/docs'
    };
  }

  @Get('__introspect')
  @ApiOperation({ summary: 'Service introspection' })
  getIntrospection() {
    return {
      service: 'payment-processing',
      version: '1.0.0',
      capabilities: [
        'razorpay-payments',
        'hdfc-smartgateway',
        'payment-verification',
        'refund-processing',
        'webhook-handling',
        'analytics'
      ],
      endpoints: {
        health: '/health',
        payments: '/api/payments',
        verification: '/api/payments/verify/{gateway}',
        webhooks: '/api/payments/webhook/{gateway}',
        analytics: '/api/payments/analytics'
      },
      gateways: ['razorpay', 'hdfc_smartgateway'],
      database: 'postgresql'
    };
  }
}