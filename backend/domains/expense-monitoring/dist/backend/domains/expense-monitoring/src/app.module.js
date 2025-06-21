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
const expense_controller_1 = require("./controllers/expense.controller");
const budget_controller_1 = require("./controllers/budget.controller");
const analytics_controller_1 = require("./controllers/analytics.controller");
const health_controller_1 = require("./controllers/health.controller");
const expense_service_1 = require("./services/expense.service");
const budget_service_1 = require("./services/budget.service");
const analytics_service_1 = require("./services/analytics.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_1.SharedAuthModule, config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),],
        controllers: [
            expense_controller_1.ExpenseController,
            budget_controller_1.BudgetController,
            analytics_controller_1.AnalyticsController,
            health_controller_1.HealthController,
        ],
        providers: [
            expense_service_1.ExpenseService,
            budget_service_1.BudgetService,
            analytics_service_1.AnalyticsService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map