import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { AnalyticsController } from './controllers/analytics.controller';
import { ReportsController } from './controllers/reports.controller';
import { HealthController } from './controllers/health.controller';
import { AnalyticsService } from './services/analytics.service';
import { ReportsService } from './services/reports.service';

@Module({
  imports: [SharedAuthModule],
  controllers: [
    AnalyticsController,
    ReportsController,
    HealthController
  ],
  providers: [
    AnalyticsService,
    ReportsService
  ],
})
export class AppModule {}