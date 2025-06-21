import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { CustomerController } from './controllers/customer.controller';
import { CustomerAddressController } from './controllers/customer-address.controller';
import { HealthController } from './controllers/health.controller';
import { CustomerService } from './services/customer.service';
import { CustomerAddressService } from './services/customer-address.service';

@Module({
  imports: [SharedAuthModule],
  controllers: [
    CustomerController,
    CustomerAddressController,
    HealthController
  ],
  providers: [
    CustomerService,
    CustomerAddressService
  ],
})
export class AppModule {}