import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Service Discovery')
// Bearer auth disabled
// Auth disabled for development
@Controller()
export class IntrospectController {
  
  @Get('__introspect')
  @ApiOperation({ summary: 'Service introspection and capabilities' })
  getIntrospection() {
    return {
      service: {
        name: 'user-role-management-service',
        domain: 'user-role-management',
        version: '1.0.0',
        port: process.env.USER_SERVICE_PORT || 3020,
        environment: process.env.NODE_ENV || 'development',
      },
      capabilities: [
        'health-monitoring',
        'api-documented',
        'user-management',
        'role-assignment',
        'permission-control',
        'team-organization'
      ],
      endpoints: {
        health: '/health',
        docs: '/api/docs',
        introspect: '/__introspect',
        api: '/users',
      },
      dependencies: [
        'JWT Authentication',
      ],
      events: {
        published: [
          'user.created',
          'user.updated',
          'user.deleted',
          'role.assigned',
          'permission.granted'
        ],
        subscribed: [
          'user.authenticated',
          'system.shutdown',
        ],
      },
      monitoring: {
        metrics: 'enabled',
        logging: 'structured',
        tracing: 'distributed',
      },
    };
  }
}