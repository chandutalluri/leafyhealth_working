import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for all origins
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe with detailed error reporting
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false, // Allow extra properties for Indian compliance fields
    validationError: {
      target: true,
      value: true,
    },
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Accounting Management API')
    .setDescription('Core accounting and financial management system for LeafyHealth platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3014;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Accounting Management Service running on port ${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();