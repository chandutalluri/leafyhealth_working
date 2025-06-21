import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  getHealth() {
    return {
      status: 'healthy',
      service: 'company-management',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }
}