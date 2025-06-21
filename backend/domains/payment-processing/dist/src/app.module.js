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
const payment_controller_1 = require("./controllers/payment.controller");
const health_controller_1 = require("./controllers/health.controller");
const payment_service_1 = require("./services/payment.service");
const razorpay_service_1 = require("./services/razorpay.service");
const hdfc_smartgateway_service_1 = require("./services/hdfc-smartgateway.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
        ],
        controllers: [payment_controller_1.PaymentController, health_controller_1.HealthController],
        providers: [
            payment_service_1.PaymentService,
            {
                provide: razorpay_service_1.RazorpayService,
                useFactory: () => new razorpay_service_1.RazorpayService(process.env.RAZORPAY_KEY_ID || 'rzp_test_default', process.env.RAZORPAY_KEY_SECRET || 'default_secret'),
            },
            {
                provide: hdfc_smartgateway_service_1.HDFCSmartGatewayService,
                useClass: hdfc_smartgateway_service_1.HDFCSmartGatewayService,
            }
        ],
        exports: [payment_service_1.PaymentService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map