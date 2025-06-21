"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentService = void 0;
const common_1 = require("@nestjs/common");
let ShipmentService = class ShipmentService {
    constructor() {
        this.shipments = [
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
        this.nextId = 3;
    }
    async create(createShipmentDto) {
        const existingShipment = this.shipments.find(s => s.trackingNumber === createShipmentDto.trackingNumber);
        if (existingShipment) {
            throw new common_1.ConflictException('Shipment with this tracking number already exists');
        }
        const shipment = {
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
    async findAll() {
        return this.shipments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async findByStatus(status) {
        return this.shipments
            .filter(s => s.status === status)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async findByCustomer(customerId) {
        return this.shipments
            .filter(s => s.customerId === customerId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async findOne(id) {
        const shipment = this.shipments.find(s => s.id === id);
        if (!shipment) {
            throw new common_1.NotFoundException('Shipment not found');
        }
        return shipment;
    }
    async findByTrackingNumber(trackingNumber) {
        const shipment = this.shipments.find(s => s.trackingNumber === trackingNumber);
        if (!shipment) {
            throw new common_1.NotFoundException('Shipment not found');
        }
        return shipment;
    }
    async update(id, updateShipmentDto) {
        const shipment = await this.findOne(id);
        if (updateShipmentDto.trackingNumber && updateShipmentDto.trackingNumber !== shipment.trackingNumber) {
            const existingShipment = this.shipments.find(s => s.trackingNumber === updateShipmentDto.trackingNumber);
            if (existingShipment) {
                throw new common_1.ConflictException('Shipment with this tracking number already exists');
            }
        }
        Object.assign(shipment, updateShipmentDto, { updatedAt: new Date() });
        return shipment;
    }
    async remove(id) {
        const shipment = await this.findOne(id);
        const index = this.shipments.findIndex(s => s.id === id);
        if (index > -1) {
            this.shipments.splice(index, 1);
        }
    }
    async updateStatus(id, status) {
        const shipment = await this.findOne(id);
        shipment.status = status;
        shipment.updatedAt = new Date();
        if (status === 'delivered' && !shipment.actualDelivery) {
            shipment.actualDelivery = new Date();
        }
        return shipment;
    }
    async getShipmentStatistics() {
        const stats = {};
        this.shipments.forEach(shipment => {
            stats[shipment.status] = (stats[shipment.status] || 0) + 1;
        });
        return stats;
    }
};
exports.ShipmentService = ShipmentService;
exports.ShipmentService = ShipmentService = __decorate([
    (0, common_1.Injectable)()
], ShipmentService);
//# sourceMappingURL=shipment.service.js.map