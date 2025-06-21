import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ImageManagementController } from './image-management.controller';
import { ImageManagementService } from './image-management.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import * as multer from 'multer';
import * as path from 'path';
import { existsSync, mkdirSync } from 'fs';

// Ensure upload directories exist
const uploadPaths = ['uploads', 'uploads/images', 'uploads/variants', 'uploads/temp'];
uploadPaths.forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
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
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 10
      }
    }),
    DatabaseModule,
    AuthModule
  ],
  controllers: [ImageManagementController],
  providers: [ImageManagementService],
  exports: [ImageManagementService]
})
export class ImageManagementModule {}