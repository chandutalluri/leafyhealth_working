"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: true,
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe());
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Labeldesign Service')
            .setDescription('Labeldesign management endpoints')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
        const port = process.env.PORT || 3026;
        await app.listen(port);
        console.log(`🚀 Labeldesign Service running on port ${port}`);
        console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    }
    catch (error) {
        console.error(`❌ Failed to start label-design service:`, error);
        process.exit(1);
    }
}
bootstrap().catch(err => {
    console.error(`❌ label-design bootstrap error:`, err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map