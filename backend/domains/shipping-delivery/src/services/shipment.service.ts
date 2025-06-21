import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

@Injectable()
export class ShipmentService {
  private shipments: Shipment[] = [
    {
      id: 1,
      trackingNumber: 'TRK001',
      orderId: 1,
      customerId: 1,
      status: 'in_transit',
      estimatedDelivery: new Date('2025-06-15'),
      shippingAddress: '123 Main St, Delhi, India',
      notes: 'Fragile items',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      trackingNumber: 'TRK002',
      orderId: 2,
      customerId: 2,
      status: 'delivered',
      estimatedDelivery: new Date('2025-06-13'),
      actualDelivery: new Date('2025-06-13'),
      shippingAddress: '456 Oak Ave, Mumbai, India',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  private nextId = 3;

  async create(createShipmentDto: CreateShipmentDto): Promise<Shipment> {
    const existingShipment = this.shipments.find(s => s.trackingNumber === createShipmentDto.trackingNumber);

    if (existingShipment) {
      throw new ConflictException('Shipment with this tracking number already exists');
    }

    const shipment: Shipment = {
      id: this.nextId++,
      trackingNumber: createShipmentDto.trackingNumber,
      orderId: createShipmentDto.orderId,
      customerId: createShipmentDto.customerId,
      estimatedDelivery: new Date(createShipmentDto.estimatedDelivery),
      shippingAddress: createShipmentDto.shippingAddress,
      status: createShipmentDto.status || 'pending',
      notes: createShipmentDto.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.shipments.push(shipment);
    return shipment;
  }

  async findAll(): Promise<Shipment[]> {
    return this.shipments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByStatus(status: string): Promise<Shipment[]> {
    return this.shipments
      .filter(s => s.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByCustomer(customerId: number): Promise<Shipment[]> {
    return this.shipments
      .filter(s => s.customerId === customerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findOne(id: number): Promise<Shipment> {
    const shipment = this.shipments.find(s => s.id === id);

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return shipment;
  }

  async findByTrackingNumber(trackingNumber: string): Promise<Shipment> {
    const shipment = this.shipments.find(s => s.trackingNumber === trackingNumber);

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return shipment;
  }

  async update(id: number, updateShipmentDto: UpdateShipmentDto): Promise<Shipment> {
    const shipment = await this.findOne(id);
    
    if (updateShipmentDto.trackingNumber && updateShipmentDto.trackingNumber !== shipment.trackingNumber) {
      const existingShipment = this.shipments.find(s => s.trackingNumber === updateShipmentDto.trackingNumber);

      if (existingShipment) {
        throw new ConflictException('Shipment with this tracking number already exists');
      }
    }

    Object.assign(shipment, updateShipmentDto, { updatedAt: new Date() });
    return shipment;
  }

  async remove(id: number): Promise<void> {
    const shipment = await this.findOne(id);
    const index = this.shipments.findIndex(s => s.id === id);
    if (index > -1) {
      this.shipments.splice(index, 1);
    }
  }

  async updateStatus(id: number, status: string): Promise<Shipment> {
    const shipment = await this.findOne(id);
    shipment.status = status;
    shipment.updatedAt = new Date();
    
    if (status === 'delivered' && !shipment.actualDelivery) {
      shipment.actualDelivery = new Date();
    }
    
    return shipment;
  }

  async getShipmentStatistics(): Promise<Record<string, number>> {
    const stats: Record<string, number> = {};
    
    this.shipments.forEach(shipment => {
      stats[shipment.status] = (stats[shipment.status] || 0) + 1;
    });
    
    return stats;
  }
}