"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRouteService = void 0;
const common_1 = require("@nestjs/common");
let DeliveryRouteService = class DeliveryRouteService {
    constructor() {
        this.routes = [
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
        this.nextId = 3;
    }
    async create(createRouteDto) {
        const existingRoute = this.routes.find(r => r.routeName === createRouteDto.routeName);
        if (existingRoute) {
            throw new common_1.ConflictException('Route with this name already exists');
        }
        const route = {
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
    async findAll() {
        return this.routes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async findByStatus(status) {
        return this.routes
            .filter(r => r.status === status)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async findByDriver(driverId) {
        return this.routes
            .filter(r => r.driverId === driverId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async findOne(id) {
        const route = this.routes.find(r => r.id === id);
        if (!route) {
            throw new common_1.NotFoundException('Delivery route not found');
        }
        return route;
    }
    async update(id, updateRouteDto) {
        const route = await this.findOne(id);
        if (updateRouteDto.routeName && updateRouteDto.routeName !== route.routeName) {
            const existingRoute = this.routes.find(r => r.routeName === updateRouteDto.routeName);
            if (existingRoute) {
                throw new common_1.ConflictException('Route with this name already exists');
            }
        }
        Object.assign(route, updateRouteDto, { updatedAt: new Date() });
        return route;
    }
    async remove(id) {
        const route = await this.findOne(id);
        const index = this.routes.findIndex(r => r.id === id);
        if (index > -1) {
            this.routes.splice(index, 1);
        }
    }
    async startRoute(id) {
        const route = await this.findOne(id);
        route.status = 'active';
        route.startTime = new Date();
        route.updatedAt = new Date();
        return route;
    }
    async completeRoute(id) {
        const route = await this.findOne(id);
        route.status = 'completed';
        route.endTime = new Date();
        route.updatedAt = new Date();
        return route;
    }
    async addShipmentToRoute(routeId, shipmentId) {
        const route = await this.findOne(routeId);
        if (!route.shipmentIds.includes(shipmentId)) {
            route.shipmentIds.push(shipmentId);
            route.updatedAt = new Date();
        }
        return route;
    }
    async removeShipmentFromRoute(routeId, shipmentId) {
        const route = await this.findOne(routeId);
        const index = route.shipmentIds.indexOf(shipmentId);
        if (index > -1) {
            route.shipmentIds.splice(index, 1);
            route.updatedAt = new Date();
        }
        return route;
    }
    async getRouteStatistics() {
        const stats = {};
        this.routes.forEach(route => {
            stats[route.status] = (stats[route.status] || 0) + 1;
        });
        return stats;
    }
};
exports.DeliveryRouteService = DeliveryRouteService;
exports.DeliveryRouteService = DeliveryRouteService = __decorate([
    (0, common_1.Injectable)()
], DeliveryRouteService);
//# sourceMappingURL=delivery-route.service.js.map