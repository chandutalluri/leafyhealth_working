import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const path = require('path');
// Port configuration simplified for NestJS compliance
const getBackendPort = (service: string) => {
  const ports = {
    'expense-monitoring': 3037
  };
  return ports[service] || 3037;
};

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Global error filter for JSON responses
    app.useGlobalFilters({
      catch(exception: any, host: any) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus ? exception.getStatus() : 500;

        response.status(status).json({
          statusCode: status,
          message: exception.message || 'Internal server error',
          timestamp: new Date().toISOString(),
          service: 'expense-monitoring'
        });
      }
    });

    // Enable CORS
    app.enableCors({
      origin: ['http://localhost:3030', 'http://localhost:8080'],
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
    }));

    // Swagger API documentation
    const config = new DocumentBuilder()
      .setTitle('LeafyHealth Expense Monitoring & Budget Control API')
      .setDescription('Comprehensive expense tracking, budget management, and financial analytics')
      .setVersion('1.0')
      .addTag('expenses')
      .addTag('budgets')
      .addTag('analytics')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || getBackendPort('expense-monitoring');
    await app.listen(port, '127.0.0.1');
    // Production logging removed - service startup handled by orchestrator
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`🔍 Service introspection: http://localhost:${port}/__introspect`);

    // Keep process alive
    setInterval(() => {
      // Keep alive
    }, 30000);

    // Graceful shutdown handlers
    process.on('SIGTERM', () => {
      console.log('Expense Monitoring Service shutting down gracefully');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('Expense Monitoring Service shutting down gracefully');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to start Expense Monitoring Service:', error);
    process.exit(1);
  }
}
bootstrap().catch(err => {
  console.error('Failed to start Expense Monitoring Service:', err);
  process.exit(1);
});