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
exports.DeliveryRouteController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const delivery_route_service_1 = require("../services/delivery-route.service");
const create_delivery_route_dto_1 = require("../dto/create-delivery-route.dto");
const update_delivery_route_dto_1 = require("../dto/update-delivery-route.dto");
let DeliveryRouteController = class DeliveryRouteController {
    constructor(routeService) {
        this.routeService = routeService;
    }
    create(createRouteDto) {
        return this.routeService.create(createRouteDto);
    }
    findAll(status, driverId) {
        if (status)
            return this.routeService.findByStatus(status);
        if (driverId)
            return this.routeService.findByDriver(parseInt(driverId));
        return this.routeService.findAll();
    }
    getStatistics() {
        return this.routeService.getRouteStatistics();
    }
    findOne(id) {
        return this.routeService.findOne(id);
    }
    update(id, updateRouteDto) {
        return this.routeService.update(id, updateRouteDto);
    }
    remove(id) {
        return this.routeService.remove(id);
    }
};
exports.DeliveryRouteController = DeliveryRouteController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new delivery route' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Route created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_delivery_route_dto_1.CreateDeliveryRouteDto]),
    __metadata("design:returntype", Promise)
], DeliveryRouteController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all delivery routes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of delivery routes' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DeliveryRouteController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get route statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Route statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DeliveryRouteController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a delivery route by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Route found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DeliveryRouteController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a delivery route' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Route updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_delivery_route_dto_1.UpdateDeliveryRouteDto]),
    __metadata("design:returntype", Promise)
], DeliveryRouteController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a delivery route' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Route deleted successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DeliveryRouteController.prototype, "remove", null);
exports.DeliveryRouteController = DeliveryRouteController = __decorate([
    (0, swagger_1.ApiTags)('delivery-routes'),
    (0, common_1.Controller)('delivery-routes'),
    __metadata("design:paramtypes", [delivery_route_service_1.DeliveryRouteService])
], DeliveryRouteController);
//# sourceMappingURL=delivery-route.controller.js.map