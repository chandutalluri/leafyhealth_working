import { DeliveryRouteService, DeliveryRoute } from '../services/delivery-route.service';
import { CreateDeliveryRouteDto } from '../dto/create-delivery-route.dto';
import { UpdateDeliveryRouteDto } from '../dto/update-delivery-route.dto';
export declare class DeliveryRouteController {
    private readonly routeService;
    constructor(routeService: DeliveryRouteService);
    create(createRouteDto: CreateDeliveryRouteDto): Promise<DeliveryRoute>;
    findAll(status?: string, driverId?: string): Promise<DeliveryRoute[]>;
    getStatistics(): Promise<Record<string, number>>;
    findOne(id: number): Promise<DeliveryRoute>;
    update(id: number, updateRouteDto: UpdateDeliveryRouteDto): Promise<DeliveryRoute>;
    remove(id: number): Promise<void>;
}
