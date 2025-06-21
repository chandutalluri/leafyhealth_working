import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { ComplianceController } from './controllers/compliance.controller';
import { HealthController } from './controllers/health.controller';
import { ComplianceService } from './services/compliance.service';

@Module({
  imports: [SharedAuthModule],
  controllers: [ComplianceController, HealthController],
  providers: [ComplianceService],
})
export class AppModule {}