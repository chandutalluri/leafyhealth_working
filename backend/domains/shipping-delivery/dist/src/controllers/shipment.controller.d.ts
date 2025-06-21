import { ShipmentService, Shipment } from '../services/shipment.service';
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';
export declare class ShipmentController {
    private readonly shipmentService;
    constructor(shipmentService: ShipmentService);
    create(createShipmentDto: CreateShipmentDto): Promise<Shipment>;
    findAll(status?: string, customerId?: string): Promise<Shipment[]>;
    getStatistics(): Promise<Record<string, number>>;
    findOne(id: number): Promise<Shipment>;
    update(id: number, updateShipmentDto: UpdateShipmentDto): Promise<Shipment>;
    remove(id: number): Promise<void>;
}
