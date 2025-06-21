
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.setGlobalPrefix('complianceaudit');
  
  const config = new DocumentBuilder()
    .setTitle('Compliance Audit API')
    .setDescription('Compliance Audit microservice')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.PORT || 3017;
  await app.listen(port);
  console.log(`🚀 Compliance Audit Service running on port ${port}`);
}

bootstrap();
