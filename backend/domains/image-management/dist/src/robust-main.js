"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const standalone_app_module_1 = require("./standalone-app.module");
const net = require("net");
async function checkPortAvailable(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(port, '0.0.0.0', () => {
            server.close(() => resolve(true));
        });
        server.on('error', () => resolve(false));
    });
}
async function bootstrap() {
    const port = parseInt(process.env.PORT || '3070');
    console.log(`Starting Image Management Service on port ${port}...`);
    const isPortAvailable = await checkPortAvailable(port);
    if (!isPortAvailable) {
        console.error(`Port ${port} is already in use!`);
        process.exit(1);
    }
    try {
        const app = await core_1.NestFactory.create(standalone_app_module_1.StandaloneAppModule, {
            logger: ['error', 'warn', 'log'],
        });
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
        await app.listen(port, '0.0.0.0');
        setTimeout(async () => {
            try {
                const response = await fetch(`http://localhost:${port}/images/health`);
                if (response.ok) {
                    console.log(`✅ Service verified operational at http://localhost:${port}`);
                }
                else {
                    console.error(`❌ Service health check failed: ${response.status}`);
                }
            }
            catch (error) {
                console.error(`❌ Service verification failed:`, error.message);
            }
        }, 1000);
        console.log(`🖼️  Image Management Service running on port ${port}`);
        console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
        console.log(`🔗 Upload endpoint: http://localhost:${port}/images/upload`);
        console.log(`🖼️  Serve endpoint: http://localhost:${port}/images/serve/:filename`);
        console.log(`❤️  Health check: http://localhost:${port}/images/health`);
    }
    catch (error) {
        console.error('Failed to start Image Management Service:', error);
        process.exit(1);
    }
}
process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});
bootstrap();
//# sourceMappingURL=robust-main.js.map