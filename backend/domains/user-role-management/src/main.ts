import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
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
  return portMap[serviceName] || 3011;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // MANDATORY: Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // MANDATORY: CORS configuration
  app.enableCors({
    origin: ['http://localhost:8080', 'http://localhost:3019'],
    credentials: true,
  });

  // MANDATORY: API documentation
  const config = new DocumentBuilder()
    .setTitle('User & Role Management Service')
    .setDescription('LeafyHealth User & Role Management Domain API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3035;
  await app.listen(port);
  
  // Production logging removed - service startup handled by orchestrator
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
  console.log(`🔍 Service introspection: http://localhost:${port}/__introspect`);
}

bootstrap().catch(console.error);