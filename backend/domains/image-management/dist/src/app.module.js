"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const image_service_1 = require("./services/image.service");
const image_optimization_service_1 = require("./services/image-optimization.service");
const admin_image_controller_1 = require("./controllers/admin-image.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            platform_express_1.MulterModule.register({
                dest: './uploads/temp',
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', '..', '..', 'uploads'),
                serveRoot: '/uploads',
            }),
        ],
        controllers: [admin_image_controller_1.AdminImageController],
        providers: [image_service_1.ImageService, image_optimization_service_1.ImageOptimizationService],
        exports: [image_service_1.ImageService, image_optimization_service_1.ImageOptimizationService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map