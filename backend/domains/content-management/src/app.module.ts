import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContentManagementController } from './controllers/content-management.controller';
import { ContentManagementService } from './services/content-management.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [ContentManagementController],
  providers: [ContentManagementService],
})
export class AppModule {}