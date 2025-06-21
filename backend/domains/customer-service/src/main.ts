import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// Industry Standard Port Allocation - Backend Services: 3000 series
function getBackendPort(serviceName) {
  const portMap = {
    'identity-access': 3010,
    'user-role-management': 3011,
    'catalog-management': 3020,
    'inventory-management': 3021,
    'order-management': 3022,
    'payment-processing': 3023,
    'notification-service': 3024,
    'customer-service': 3031
  };
  return portMap[serviceName] || 3031;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Customer Service API')
    .setDescription('Customer management and service operations')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || getBackendPort('customer-service');
  await app.listen(port, '127.0.0.1');
  
  // Production logging removed - service startup handled by orchestrator
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
  console.log(`🔍 Service introspection: http://localhost:${port}/__introspect`);
}

bootstrap();