import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { StandaloneImageController } from './standalone-image.controller';
import { StandaloneImageService } from './standalone-image.service';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local']
    }),
    MulterModule.registerAsync({
      useFactory: () => {
        // Ensure upload directories exist
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
            fileSize: 10 * 1024 * 1024, // 10MB limit
            files: 5 // Max 5 files per upload
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
            } else {
              cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
            }
          }
        };
      }
    })
  ],
  controllers: [StandaloneImageController],
  providers: [StandaloneImageService],
  exports: [StandaloneImageService]
})
export class StandaloneAppModule {}