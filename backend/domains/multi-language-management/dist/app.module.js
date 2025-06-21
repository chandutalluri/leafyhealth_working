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
const language_controller_1 = require("./controllers/language.controller");
const translation_controller_1 = require("./controllers/translation.controller");
const language_service_1 = require("./services/language.service");
const translation_service_1 = require("./services/translation.service");
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
        controllers: [language_controller_1.LanguageController, translation_controller_1.TranslationController],
        providers: [language_service_1.LanguageService, translation_service_1.TranslationService],
        exports: [language_service_1.LanguageService, translation_service_1.TranslationService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map