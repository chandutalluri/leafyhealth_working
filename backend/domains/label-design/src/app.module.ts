import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { ConfigModule } from '@nestjs/config';
import { LabelController } from './controllers/label.controller';
import { TemplateController } from './controllers/template.controller';
import { BarcodeController } from './controllers/barcode.controller';
import { PrintController } from './controllers/print.controller';
import { ComplianceController } from './controllers/compliance.controller';
import { HealthController } from './controllers/health.controller';
import { LabelService } from './services/label.service';
import { TemplateService } from './services/template.service';
import { BarcodeService } from './services/barcode.service';
import { PrintService } from './services/print.service';
import { ComplianceService } from './services/compliance.service';

@Module({
  imports: [SharedAuthModule, ConfigModule.forRoot({
      isGlobal: true,
    }),],
  controllers: [
    LabelController,
    TemplateController,
    BarcodeController,
    PrintController,
    ComplianceController,
    HealthController,
  ],
  providers: [
    LabelService,
    TemplateService,
    BarcodeService,
    PrintService,
    ComplianceService,
  ],
})
export class AppModule {}