import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async healthCheck() {
    return {
      status: 'ok',
      service: 'label-design-print-management-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'Service information' })
  async getRoot() {
    return {
      service: 'LeafyHealth Label Design & Print Management Service',
      version: '1.0.0',
      documentation: '/api/docs',
      health: '/health',
    };
  }

  @Get('__introspect')
  @ApiOperation({ summary: 'Service introspection' })
  @ApiResponse({ status: 200, description: 'Service capabilities and endpoints' })
  async introspect() {
    return {
      service: 'label-design-print-management-service',
      version: '1.0.0',
      capabilities: [
        'Label Design & Templates',
        'Barcode & QR Code Generation',
        'Food Safety Compliance Labeling',
        'Multi-language Label Support',
        'Print Queue Management',
        'Batch Printing Operations',
        'Nutritional Information Labels',
        'Promotional Price Tags',
      ],
      endpoints: {
        labels: '/labels',
        templates: '/templates',
        barcodes: '/barcodes',
        printing: '/print',
        compliance: '/compliance',
        health: '/health',
        docs: '/api/docs',
      },
      port: 3018,
    };
  }
}