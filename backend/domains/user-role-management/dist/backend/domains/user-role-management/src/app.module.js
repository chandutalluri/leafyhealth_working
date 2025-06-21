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
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const health_controller_1 = require("./controllers/health.controller");
const introspect_controller_1 = require("./controllers/introspect.controller");
const user_controller_1 = require("./controllers/user.controller");
const user_service_1 = require("./services/user.service");
const event_handler_service_1 = require("./services/event-handler.service");
const auth_service_1 = require("./services/auth.service");
const auth_guard_1 = require("./guards/auth.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_1.SharedAuthModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-super-secure-jwt-secret',
                signOptions: { expiresIn: '24h' },
            }),],
        controllers: [
            health_controller_1.HealthController,
            introspect_controller_1.IntrospectController,
            user_controller_1.UserController,
        ],
        providers: [
            user_service_1.UserService,
            event_handler_service_1.EventHandlerService,
            auth_service_1.AuthService,
            auth_guard_1.AuthGuard,
        ],
        exports: [
            user_service_1.UserService,
            event_handler_service_1.EventHandlerService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map