import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS
    app.enableCors({
      origin: true,
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe());

    // Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('Labeldesign Service')
      .setDescription('Labeldesign management endpoints')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3026;
    await app.listen(port);
    console.log(`🚀 Labeldesign Service running on port ${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  } catch (error) {
    console.error(`❌ Failed to start label-design service:`, error);
    process.exit(1);
  }
}

bootstrap().catch(err => {
  console.error(`❌ label-design bootstrap error:`, err);
  process.exit(1);
});