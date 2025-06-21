import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PerformanceMonitorController } from './controllers/performance-monitor.controller';
import { PerformanceMonitorService } from './services/performance-monitor.service';
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
  controllers: [PerformanceMonitorController],
  providers: [PerformanceMonitorService],
})
export class AppModule {}