import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { InventoryController } from './controllers/inventory.controller';
import { HealthController } from './controllers/health.controller';
import { InventoryService } from './services/inventory.service';

@Module({
  imports: [SharedAuthModule],
  controllers: [InventoryController, HealthController],
  providers: [InventoryService],
})
export class AppModule {}