import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ImageService } from './services/image.service';
import { ImageOptimizationService } from './services/image-optimization.service';
import { AdminImageController } from './controllers/admin-image.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './uploads/temp',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AdminImageController],
  providers: [ImageService, ImageOptimizationService],
  exports: [ImageService, ImageOptimizationService],
})
export class AppModule {}