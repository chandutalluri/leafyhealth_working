
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';

@Controller()
class HealthController {
  @Get('health')
  getHealth() {
    return { 
      status: 'ok', 
      service: 'marketplace-management',
      timestamp: new Date().toISOString()
    };
  }
  
  @Get()
  getInfo() {
    return {
      name: 'marketplace-management',
      version: '1.0.0',
      status: 'operational'
    };
  }
}

@Module({
  controllers: [HealthController]
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 3027;
  await app.listen(port);
  console.log(`🚀 MarketplaceManagement Service running on port ${port}`);
}

bootstrap();
