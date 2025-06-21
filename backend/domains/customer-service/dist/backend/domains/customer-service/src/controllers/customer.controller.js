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
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../../shared/auth");
const customer_service_1 = require("../services/customer.service");
const create_customer_dto_1 = require("../dto/create-customer.dto");
const update_customer_dto_1 = require("../dto/update-customer.dto");
let CustomerController = class CustomerController {
    constructor(customerService) {
        this.customerService = customerService;
    }
    async createCustomer(createCustomerDto) {
        try {
            const existingCustomer = await this.customerService.findCustomerByEmail(createCustomerDto.email);
            if (existingCustomer) {
                throw new common_1.ConflictException('Customer with this email already exists');
            }
            const customerData = {
                ...createCustomerDto,
                dateOfBirth: createCustomerDto.dateOfBirth ? new Date(createCustomerDto.dateOfBirth) : undefined
            };
            const customer = await this.customerService.createCustomer(customerData);
            return {
                success: true,
                message: 'Customer created successfully',
                data: customer
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Failed to create customer: ${error.message}`);
        }
    }
    async getAllCustomers() {
        const customers = await this.customerService.findAllCustomers();
        return {
            success: true,
            data: customers,
            count: customers.length
        };
    }
    async getCustomerStats() {
        const stats = await this.customerService.getCustomerStats();
        return {
            success: true,
            data: stats
        };
    }
    async getCustomerById(id) {
        const customer = await this.customerService.findCustomerById(id);
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return {
            success: true,
            data: customer
        };
    }
    async updateCustomer(id, updateCustomerDto) {
        const updateData = {
            ...updateCustomerDto,
            dateOfBirth: updateCustomerDto.dateOfBirth ? new Date(updateCustomerDto.dateOfBirth) : undefined
        };
        const customer = await this.customerService.updateCustomer(id, updateData);
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return {
            success: true,
            message: 'Customer updated successfully',
            data: customer
        };
    }
    async deleteCustomer(id) {
        const deleted = await this.customerService.deleteCustomer(id);
        if (!deleted) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return {
            success: true,
            message: 'Customer deleted successfully'
        };
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new customer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Customer created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Customer with email already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "createCustomer", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all customers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all customers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getAllCustomers", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getCustomerStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Customer ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getCustomerById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update customer' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Customer ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_customer_dto_1.UpdateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateCustomer", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete customer' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Customer ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "deleteCustomer", null);
exports.CustomerController = CustomerController = __decorate([
    (0, swagger_1.ApiTags)('Customers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customer_service_1.CustomerService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map