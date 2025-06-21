import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

@Injectable()
export class DeliveryRouteService {
  private routes: DeliveryRoute[] = [
    {
      id: 1,
      routeName: 'Delhi North Route',
      driverId: 1,
      vehicleId: 1,
      status: 'active',
      startTime: new Date(),
      totalDistance: 25.5,
      estimatedDuration: 120,
      shipmentIds: [1],
      notes: 'Heavy traffic expected',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      routeName: 'Mumbai Central Route',
      driverId: 2,
      vehicleId: 2,
      status: 'completed',
      startTime: new Date('2025-06-13T08:00:00'),
      endTime: new Date('2025-06-13T12:00:00'),
      totalDistance: 18.2,
      estimatedDuration: 90,
      shipmentIds: [2],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  private nextId = 3;

  async create(createRouteDto: CreateDeliveryRouteDto): Promise<DeliveryRoute> {
    const existingRoute = this.routes.find(r => r.routeName === createRouteDto.routeName);

    if (existingRoute) {
      throw new ConflictException('Route with this name already exists');
    }

    const route: DeliveryRoute = {
      id: this.nextId++,
      ...createRouteDto,
      status: createRouteDto.status || 'planned',
      shipmentIds: createRouteDto.shipmentIds || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.routes.push(route);
    return route;
  }

  async findAll(): Promise<DeliveryRoute[]> {
    return this.routes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByStatus(status: string): Promise<DeliveryRoute[]> {
    return this.routes
      .filter(r => r.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByDriver(driverId: number): Promise<DeliveryRoute[]> {
    return this.routes
      .filter(r => r.driverId === driverId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findOne(id: number): Promise<DeliveryRoute> {
    const route = this.routes.find(r => r.id === id);

    if (!route) {
      throw new NotFoundException('Delivery route not found');
    }

    return route;
  }

  async update(id: number, updateRouteDto: UpdateDeliveryRouteDto): Promise<DeliveryRoute> {
    const route = await this.findOne(id);
    
    if (updateRouteDto.routeName && updateRouteDto.routeName !== route.routeName) {
      const existingRoute = this.routes.find(r => r.routeName === updateRouteDto.routeName);

      if (existingRoute) {
        throw new ConflictException('Route with this name already exists');
      }
    }

    Object.assign(route, updateRouteDto, { updatedAt: new Date() });
    return route;
  }

  async remove(id: number): Promise<void> {
    const route = await this.findOne(id);
    const index = this.routes.findIndex(r => r.id === id);
    if (index > -1) {
      this.routes.splice(index, 1);
    }
  }

  async startRoute(id: number): Promise<DeliveryRoute> {
    const route = await this.findOne(id);
    route.status = 'active';
    route.startTime = new Date();
    route.updatedAt = new Date();
    return route;
  }

  async completeRoute(id: number): Promise<DeliveryRoute> {
    const route = await this.findOne(id);
    route.status = 'completed';
    route.endTime = new Date();
    route.updatedAt = new Date();
    return route;
  }

  async addShipmentToRoute(routeId: number, shipmentId: number): Promise<DeliveryRoute> {
    const route = await this.findOne(routeId);
    
    if (!route.shipmentIds.includes(shipmentId)) {
      route.shipmentIds.push(shipmentId);
      route.updatedAt = new Date();
    }
    
    return route;
  }

  async removeShipmentFromRoute(routeId: number, shipmentId: number): Promise<DeliveryRoute> {
    const route = await this.findOne(routeId);
    const index = route.shipmentIds.indexOf(shipmentId);
    
    if (index > -1) {
      route.shipmentIds.splice(index, 1);
      route.updatedAt = new Date();
    }
    
    return route;
  }

  async getRouteStatistics(): Promise<Record<string, number>> {
    const stats: Record<string, number> = {};
    
    this.routes.forEach(route => {
      stats[route.status] = (stats[route.status] || 0) + 1;
    });
    
    return stats;
  }
}