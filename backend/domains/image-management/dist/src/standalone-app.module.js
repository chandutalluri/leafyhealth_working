"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandaloneAppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const standalone_image_controller_1 = require("./standalone-image.controller");
const standalone_image_service_1 = require("./standalone-image.service");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
let StandaloneAppModule = class StandaloneAppModule {
};
exports.StandaloneAppModule = StandaloneAppModule;
exports.StandaloneAppModule = StandaloneAppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.local']
            }),
            platform_express_1.MulterModule.registerAsync({
                useFactory: () => {
                    const uploadsDir = path.join(process.cwd(), 'backend/domains/image-management/src/storage');
                    const dirs = [
                        path.join(uploadsDir, 'images/original'),
                        path.join(uploadsDir, 'images/variants'),
                        path.join(uploadsDir, 'temp')
                    ];
                    dirs.forEach(dir => {
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir, { recursive: true });
                        }
                    });
                    return {
                        storage: multer.diskStorage({
                            destination: (req, file, cb) => {
                                cb(null, path.join(uploadsDir, 'temp'));
                            },
                            filename: (req, file, cb) => {
                                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                                cb(null, `${uniqueSuffix}-${file.originalname}`);
                            }
                        }),
                        limits: {
                            fileSize: 10 * 1024 * 1024,
                            files: 5
                        },
                        fileFilter: (req, file, cb) => {
                            const allowedMimes = [
                                'image/jpeg',
                                'image/jpg',
                                'image/png',
                                'image/gif',
                                'image/webp'
                            ];
                            if (allowedMimes.includes(file.mimetype)) {
                                cb(null, true);
                            }
                            else {
                                cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
                            }
                        }
                    };
                }
            })
        ],
        controllers: [standalone_image_controller_1.StandaloneImageController],
        providers: [standalone_image_service_1.StandaloneImageService],
        exports: [standalone_image_service_1.StandaloneImageService]
    })
], StandaloneAppModule);
//# sourceMappingURL=standalone-app.module.js.map