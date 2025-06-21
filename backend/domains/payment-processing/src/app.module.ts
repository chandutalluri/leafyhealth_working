import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './controllers/payment.controller';
import { HealthController } from './controllers/health.controller';
import { PaymentService } from './services/payment.service';
import { RazorpayService } from './services/razorpay.service';
import { HDFCSmartGatewayService } from './services/hdfc-smartgateway.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [PaymentController, HealthController],
  providers: [
    PaymentService, 
    {
      provide: RazorpayService,
      useFactory: () => new RazorpayService(
        process.env.RAZORPAY_KEY_ID || 'rzp_test_default',
        process.env.RAZORPAY_KEY_SECRET || 'default_secret'
      ),
    },
    {
      provide: HDFCSmartGatewayService,
      useClass: HDFCSmartGatewayService,
    }
  ],
  exports: [PaymentService],
})
export class AppModule {}