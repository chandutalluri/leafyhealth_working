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
exports.CustomerAddressController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../../shared/auth");
const customer_address_service_1 = require("../services/customer-address.service");
const create_customer_address_dto_1 = require("../dto/create-customer-address.dto");
const update_customer_address_dto_1 = require("../dto/update-customer-address.dto");
let CustomerAddressController = class CustomerAddressController {
    constructor(customerAddressService) {
        this.customerAddressService = customerAddressService;
    }
    async createAddress(customerId, createAddressDto) {
        const addressData = {
            ...createAddressDto,
            userId: customerId,
            pincode: createAddressDto.postalCode
        };
        const address = await this.customerAddressService.createAddress(addressData);
        return {
            success: true,
            message: 'Address created successfully',
            data: address
        };
    }
    async getCustomerAddresses(customerId) {
        const addresses = await this.customerAddressService.findAddressesByCustomerId(customerId);
        return {
            success: true,
            data: addresses,
            count: addresses.length
        };
    }
    async getAddressById(addressId) {
        const address = await this.customerAddressService.findAddressById(addressId);
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        return {
            success: true,
            data: address
        };
    }
    async updateAddress(addressId, updateAddressDto) {
        const address = await this.customerAddressService.updateAddress(addressId, updateAddressDto);
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        return {
            success: true,
            message: 'Address updated successfully',
            data: address
        };
    }
    async setDefaultAddress(customerId, addressId) {
        await this.customerAddressService.setDefaultAddress(customerId, addressId);
        return {
            success: true,
            message: 'Default address set successfully'
        };
    }
    async deleteAddress(addressId) {
        const deleted = await this.customerAddressService.deleteAddress(addressId);
        if (!deleted) {
            throw new common_1.NotFoundException('Address not found');
        }
        return {
            success: true,
            message: 'Address deleted successfully'
        };
    }
};
exports.CustomerAddressController = CustomerAddressController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new address for customer' }),
    (0, swagger_1.ApiParam)({ name: 'customerId', description: 'Customer ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Address created successfully' }),
    __param(0, (0, common_1.Param)('customerId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_customer_address_dto_1.CreateCustomerAddressDto]),
    __metadata("design:returntype", Promise)
], CustomerAddressController.prototype, "createAddress", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all addresses for customer' }),
    (0, swagger_1.ApiParam)({ name: 'customerId', description: 'Customer ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of customer addresses' }),
    __param(0, (0, common_1.Param)('customerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerAddressController.prototype, "getCustomerAddresses", null);
__decorate([
    (0, common_1.Get)(':addressId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific address' }),
    (0, swagger_1.ApiParam)({ name: 'customerId', description: 'Customer ID' }),
    (0, swagger_1.ApiParam)({ name: 'addressId', description: 'Address ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Address details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Address not found' }),
    __param(0, (0, common_1.Param)('addressId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerAddressController.prototype, "getAddressById", null);
__decorate([
    (0, common_1.Put)(':addressId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update address' }),
    (0, swagger_1.ApiParam)({ name: 'customerId', description: 'Customer ID' }),
    (0, swagger_1.ApiParam)({ name: 'addressId', description: 'Address ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Address updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Address not found' }),
    __param(0, (0, common_1.Param)('addressId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_customer_address_dto_1.UpdateCustomerAddressDto]),
    __metadata("design:returntype", Promise)
], CustomerAddressController.prototype, "updateAddress", null);
__decorate([
    (0, common_1.Put)(':addressId/default'),
    (0, swagger_1.ApiOperation)({ summary: 'Set address as default' }),
    (0, swagger_1.ApiParam)({ name: 'customerId', description: 'Customer ID' }),
    (0, swagger_1.ApiParam)({ name: 'addressId', description: 'Address ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Default address set successfully' }),
    __param(0, (0, common_1.Param)('customerId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('addressId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], CustomerAddressController.prototype, "setDefaultAddress", null);
__decorate([
    (0, common_1.Delete)(':addressId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete address' }),
    (0, swagger_1.ApiParam)({ name: 'customerId', description: 'Customer ID' }),
    (0, swagger_1.ApiParam)({ name: 'addressId', description: 'Address ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Address deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Address not found' }),
    __param(0, (0, common_1.Param)('addressId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerAddressController.prototype, "deleteAddress", null);
exports.CustomerAddressController = CustomerAddressController = __decorate([
    (0, swagger_1.ApiTags)('Customer Addresses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Controller)('customers/:customerId/addresses'),
    __metadata("design:paramtypes", [customer_address_service_1.CustomerAddressService])
], CustomerAddressController);
//# sourceMappingURL=customer-address.controller.js.map