import { Module } from '@nestjs/common';
import { ReportingManagementController } from './controllers/reporting-management.controller';
import { ReportingManagementService } from './services/reporting-management.service';

@Module({
  imports: [],
  controllers: [ReportingManagementController],
  providers: [ReportingManagementService],
})
export class AppModule {}
