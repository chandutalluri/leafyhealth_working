import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';
export interface Shipment {
    id: number;
    trackingNumber: string;
    orderId: number;
    customerId: number;
    status: string;
    estimatedDelivery: Date;
    actualDelivery?: Date;
    shippingAddress: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ShipmentService {
    private shipments;
    private nextId;
    create(createShipmentDto: CreateShipmentDto): Promise<Shipment>;
    findAll(): Promise<Shipment[]>;
    findByStatus(status: string): Promise<Shipment[]>;
    findByCustomer(customerId: number): Promise<Shipment[]>;
    findOne(id: number): Promise<Shipment>;
    findByTrackingNumber(trackingNumber: string): Promise<Shipment>;
    update(id: number, updateShipmentDto: UpdateShipmentDto): Promise<Shipment>;
    remove(id: number): Promise<void>;
    updateStatus(id: number, status: string): Promise<Shipment>;
    getShipmentStatistics(): Promise<Record<string, number>>;
}
