"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const standalone_app_module_1 = require("./standalone-app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(standalone_app_module_1.StandaloneAppModule);
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
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('LeafyHealth Image Management API')
        .setDescription('Self-hosted image management service with variants and CDN integration')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
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
//# sourceMappingURL=standalone-main.js.map