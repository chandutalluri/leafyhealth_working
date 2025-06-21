
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.setGlobalPrefix('contentmanagement');
  
  const config = new DocumentBuilder()
    .setTitle('Content Management API')
    .setDescription('Content Management microservice')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.PORT || 3018;
  await app.listen(port);
  console.log(`🚀 Content Management Service running on port ${port}`);
}

bootstrap();
