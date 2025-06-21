import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'notification-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  @Get()
  root() {
    return {
      service: 'LeafyHealth Notification Service',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/health',
        notifications: '/notifications',
        documentation: '/api/docs'
      }
    };
  }
}