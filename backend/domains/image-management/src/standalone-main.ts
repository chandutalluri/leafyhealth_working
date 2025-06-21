import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { StandaloneAppModule } from './standalone-app.module';

async function bootstrap() {
  const app = await NestFactory.create(StandaloneAppModule);
  
  // Enable CORS for frontend integration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:8080',
      /\.replit\.dev$/,
      /\.replit\.app$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('LeafyHealth Image Management API')
    .setDescription('Self-hosted image management service with variants and CDN integration')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3070;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🖼️  Image Management Service running on port ${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🔗 Upload endpoint: http://localhost:${port}/images/upload`);
  console.log(`🖼️  Serve endpoint: http://localhost:${port}/images/serve/:filename`);
  console.log(`❤️  Health check: http://localhost:${port}/images/health`);
}

bootstrap().catch(err => {
  console.error('Failed to start Image Management Service:', err);
  process.exit(1);
});