"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageManagementModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const image_management_controller_1 = require("./image-management.controller");
const image_management_service_1 = require("./image-management.service");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./auth/auth.module");
const multer = require("multer");
const path = require("path");
const fs_1 = require("fs");
const uploadPaths = ['uploads', 'uploads/images', 'uploads/variants', 'uploads/temp'];
uploadPaths.forEach(dir => {
    if (!(0, fs_1.existsSync)(dir)) {
        (0, fs_1.mkdirSync)(dir, { recursive: true });
    }
});
let ImageManagementModule = class ImageManagementModule {
};
exports.ImageManagementModule = ImageManagementModule;
exports.ImageManagementModule = ImageManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            platform_express_1.MulterModule.register({
                storage: multer.diskStorage({
                    destination: (req, file, cb) => {
                        cb(null, 'uploads/images');
                    },
                    filename: (req, file, cb) => {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                        const ext = path.extname(file.originalname);
                        cb(null, `image-${uniqueSuffix}${ext}`);
                    }
                }),
                fileFilter: (req, file, cb) => {
                    const allowedTypes = /jpeg|jpg|png|gif|webp/;
                    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
                    const mimetype = allowedTypes.test(file.mimetype);
                    if (extname && mimetype) {
                        return cb(null, true);
                    }
                    else {
                        cb(new Error('Only image files are allowed!'), false);
                    }
                },
                limits: {
                    fileSize: 10 * 1024 * 1024,
                    files: 10
                }
            }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule
        ],
        controllers: [image_management_controller_1.ImageManagementController],
        providers: [image_management_service_1.ImageManagementService],
        exports: [image_management_service_1.ImageManagementService]
    })
], ImageManagementModule);
//# sourceMappingURL=image-management.module.js.map