"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const path = require('path');
const getBackendPort = (service) => {
    const ports = {
        'expense-monitoring': 3037
    };
    return ports[service] || 3037;
};
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.useGlobalFilters({
            catch(exception, host) {
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
        app.enableCors({
            origin: ['http://localhost:3030', 'http://localhost:8080'],
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            transform: true,
            whitelist: true,
        }));
        const config = new swagger_1.DocumentBuilder()
            .setTitle('LeafyHealth Expense Monitoring & Budget Control API')
            .setDescription('Comprehensive expense tracking, budget management, and financial analytics')
            .setVersion('1.0')
            .addTag('expenses')
            .addTag('budgets')
            .addTag('analytics')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
        const port = process.env.PORT || getBackendPort('expense-monitoring');
        await app.listen(port, '127.0.0.1');
        console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
        console.log(`🏥 Health check: http://localhost:${port}/health`);
        console.log(`🔍 Service introspection: http://localhost:${port}/__introspect`);
        setInterval(() => {
        }, 30000);
        process.on('SIGTERM', () => {
            console.log('Expense Monitoring Service shutting down gracefully');
            process.exit(0);
        });
        process.on('SIGINT', () => {
            console.log('Expense Monitoring Service shutting down gracefully');
            process.exit(0);
        });
    }
    catch (error) {
        console.error('❌ Failed to start Expense Monitoring Service:', error);
        process.exit(1);
    }
}
bootstrap().catch(err => {
    console.error('Failed to start Expense Monitoring Service:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map