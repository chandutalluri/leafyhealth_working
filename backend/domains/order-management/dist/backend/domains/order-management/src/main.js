"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: ['http://localhost:8080', 'http://localhost:3030'],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('LeafyHealth Order Management Service')
        .setDescription('Order processing and management API')
        .setVersion('1.0')
        .addTag('orders')
        .addTag('health')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3030;
    await app.listen(port);
    console.log(`🚀 Order Management Service running on port ${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`🔍 Service introspection: http://localhost:${port}/__introspect`);
}
bootstrap();
//# sourceMappingURL=main.js.map