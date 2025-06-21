import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './controllers/notification.controller';
import { HealthController } from './controllers/health.controller';
import { NotificationService } from './services/notification.service';

@Module({
  imports: [SharedAuthModule, ConfigModule.forRoot({
      isGlobal: true,
    }),],
  controllers: [NotificationController, HealthController],
  providers: [NotificationService],
})
export class AppModule {}