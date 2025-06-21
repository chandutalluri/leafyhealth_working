"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
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
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: ['http://localhost:8080', 'http://localhost:3019'],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('User & Role Management Service')
        .setDescription('LeafyHealth User & Role Management Domain API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3035;
    await app.listen(port);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`🔍 Service introspection: http://localhost:${port}/__introspect`);
}
bootstrap().catch(console.error);
//# sourceMappingURL=main.js.map