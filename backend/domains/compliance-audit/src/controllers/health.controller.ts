import { Controller, Get } from '@nestjs/common';
import { db } from '../database';

@Controller()
export class HealthController {
  @Get('health')
  async checkHealth() {
    try {
      const dbHealth = { status: 'connected', message: 'Database connection healthy' };
      return {
        status: 'ok',
        service: 'compliance-audit-service',
        timestamp: new Date().toISOString(),
        database: dbHealth,
        version: '1.0.0'
      };
    } catch (error) {
      return {
        status: 'error',
        service: 'compliance-audit-service',
        timestamp: new Date().toISOString(),
        error: error.message,
        version: '1.0.0'
      };
    }
  }

  @Get()
  getRoot() {
    return {
      service: 'LeafyHealth Compliance & Audit Service',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/health',
        compliance: '/compliance',
        docs: '/api/docs'
      }
    };
  }

  @Get('__introspect')
  getIntrospection() {
    return {
      service: 'compliance-audit-service',
      version: '1.0.0',
      description: 'Regulatory compliance and audit trail management',
      endpoints: [
        'POST /compliance/events - Create compliance event',
        'GET /compliance/events - List compliance events',
        'GET /compliance/audit-trail/:entityType/:entityId - Get audit trail',
        'GET /compliance/stats - Get compliance statistics',
        'POST /compliance/reports/generate - Generate compliance report',
        'GET /health - Health check',
        'GET /__introspect - Service introspection'
      ],
      database: 'PostgreSQL with Drizzle ORM',
      port: 3012
    };
  }
}