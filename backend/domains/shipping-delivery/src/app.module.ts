import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShipmentController } from './controllers/shipment.controller';
import { DeliveryRouteController } from './controllers/delivery-route.controller';
import { ShipmentService } from './services/shipment.service';
import { DeliveryRouteService } from './services/delivery-route.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ShipmentController, DeliveryRouteController],
  providers: [ShipmentService, DeliveryRouteService],
  exports: [ShipmentService, DeliveryRouteService],
})
export class AppModule {}