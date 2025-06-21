"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shipment_service_1 = require("../services/shipment.service");
const create_shipment_dto_1 = require("../dto/create-shipment.dto");
const update_shipment_dto_1 = require("../dto/update-shipment.dto");
let ShipmentController = class ShipmentController {
    constructor(shipmentService) {
        this.shipmentService = shipmentService;
    }
    create(createShipmentDto) {
        return this.shipmentService.create(createShipmentDto);
    }
    findAll(status, customerId) {
        if (status)
            return this.shipmentService.findByStatus(status);
        if (customerId)
            return this.shipmentService.findByCustomer(parseInt(customerId));
        return this.shipmentService.findAll();
    }
    getStatistics() {
        return this.shipmentService.getShipmentStatistics();
    }
    findOne(id) {
        return this.shipmentService.findOne(id);
    }
    update(id, updateShipmentDto) {
        return this.shipmentService.update(id, updateShipmentDto);
    }
    remove(id) {
        return this.shipmentService.remove(id);
    }
};
exports.ShipmentController = ShipmentController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new shipment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Shipment created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_shipment_dto_1.CreateShipmentDto]),
    __metadata("design:returntype", Promise)
], ShipmentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all shipments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of shipments' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ShipmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get shipment statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Shipment statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShipmentController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a shipment by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Shipment found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ShipmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a shipment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Shipment updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_shipment_dto_1.UpdateShipmentDto]),
    __metadata("design:returntype", Promise)
], ShipmentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a shipment' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Shipment deleted successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ShipmentController.prototype, "remove", null);
exports.ShipmentController = ShipmentController = __decorate([
    (0, swagger_1.ApiTags)('shipments'),
    (0, common_1.Controller)('shipments'),
    __metadata("design:paramtypes", [shipment_service_1.ShipmentService])
], ShipmentController);
//# sourceMappingURL=shipment.controller.js.map