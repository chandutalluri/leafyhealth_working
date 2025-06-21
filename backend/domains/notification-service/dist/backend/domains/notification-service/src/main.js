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
    return portMap[serviceName] || 3024;
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('LeafyHealth Notification Service')
        .setDescription('Notification management and delivery system')
        .setVersion('1.0')
        .addTag('notifications')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || getBackendPort('notification-service');
    await app.listen(port, '127.0.0.1');
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`🔍 Service introspection: http://localhost:${port}/__introspect`);
}
bootstrap();
//# sourceMappingURL=main.js.map