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
const auth_1 = require("../../../../shared/auth");
const config_1 = require("@nestjs/config");
const notification_controller_1 = require("./controllers/notification.controller");
const health_controller_1 = require("./controllers/health.controller");
const notification_service_1 = require("./services/notification.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_1.SharedAuthModule, config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),],
        controllers: [notification_controller_1.NotificationController, health_controller_1.HealthController],
        providers: [notification_service_1.NotificationService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map