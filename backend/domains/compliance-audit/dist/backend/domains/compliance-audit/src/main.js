"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix('complianceaudit');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Compliance Audit API')
        .setDescription('Compliance Audit microservice')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3017;
    await app.listen(port);
    console.log(`🚀 Compliance Audit Service running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map