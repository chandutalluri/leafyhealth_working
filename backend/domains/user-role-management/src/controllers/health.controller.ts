import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class HealthController {
  
  @Get('health')
  @ApiOperation({ summary: 'Service health check' })
  async getHealth() {
    const checks = await Promise.allSettled([
      this.checkMemory(),
    ]);

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'user-role-management-service',
      port: process.env.USER_SERVICE_PORT || 3020,
      version: '1.0.0',
      checks: {
        memory: checks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    const hasUnhealthy = Object.values(health.checks).includes('unhealthy');
    if (hasUnhealthy) {
      health.status = 'unhealthy';
    }

    return health;
  }

  @Get()
  root() {
    return {
      service: 'LeafyHealth User & Role Management Service',
      message: 'User management service is running',
      endpoints: {
        health: '/health',
        docs: '/api/docs',
        introspect: '/__introspect',
        users: '/users',
        roles: '/roles'
      }
    };
  }

  private async checkMemory(): Promise<boolean> {
    const usage = process.memoryUsage();
    const maxHeap = 1024 * 1024 * 1024; // 1GB limit
    return usage.heapUsed < maxHeap;
  }
}