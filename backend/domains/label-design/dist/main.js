"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");

async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    
    app.enableCors({
        origin: true,
        credentials: true,
    });
    
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Label Design API')
        .setDescription('Label Design microservice for LeafyHealth platform')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    
    const port = process.env.SERVICE_PORT || process.env.PORT || getBackendPort('label-design');
    await app.listen(port, '0.0.0.0');
    console.log('🚀 label-design running on port 3039');
    console.log('📚 API Documentation: http://localhost:3039/api/docs');
}
bootstrap();