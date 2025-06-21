import { CreateDeliveryRouteDto } from '../dto/create-delivery-route.dto';
import { UpdateDeliveryRouteDto } from '../dto/update-delivery-route.dto';
export interface DeliveryRoute {
    id: number;
    routeName: string;
    driverId: number;
    vehicleId: number;
    status: string;
    startTime?: Date;
    endTime?: Date;
    totalDistance?: number;
    estimatedDuration?: number;
    shipmentIds: number[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class DeliveryRouteService {
    private routes;
    private nextId;
    create(createRouteDto: CreateDeliveryRouteDto): Promise<DeliveryRoute>;
    findAll(): Promise<DeliveryRoute[]>;
    findByStatus(status: string): Promise<DeliveryRoute[]>;
    findByDriver(driverId: number): Promise<DeliveryRoute[]>;
    findOne(id: number): Promise<DeliveryRoute>;
    update(id: number, updateRouteDto: UpdateDeliveryRouteDto): Promise<DeliveryRoute>;
    remove(id: number): Promise<void>;
    startRoute(id: number): Promise<DeliveryRoute>;
    completeRoute(id: number): Promise<DeliveryRoute>;
    addShipmentToRoute(routeId: number, shipmentId: number): Promise<DeliveryRoute>;
    removeShipmentFromRoute(routeId: number, shipmentId: number): Promise<DeliveryRoute>;
    getRouteStatistics(): Promise<Record<string, number>>;
}
