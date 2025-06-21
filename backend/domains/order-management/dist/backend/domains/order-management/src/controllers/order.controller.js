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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../../shared/auth");
const order_service_1 = require("../services/order.service");
const create_order_dto_1 = require("../dto/create-order.dto");
const update_order_status_dto_1 = require("../dto/update-order-status.dto");
const update_payment_status_dto_1 = require("../dto/update-payment-status.dto");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async create(createOrderDto, req) {
        if (!req.user?.id) {
            throw new common_1.UnauthorizedException('Authentication required for order creation');
        }
        const createdBy = req.user.id;
        return this.orderService.createOrder(createOrderDto, createdBy);
    }
    async findAll() {
        return this.orderService.findAll();
    }
    async findByStatus(status) {
        return this.orderService.findByStatus(status);
    }
    async findByCustomer(customerId) {
        return this.orderService.findByCustomer(parseInt(customerId));
    }
    async findOne(id) {
        return this.orderService.findOne(parseInt(id));
    }
    async updateStatus(id, updateStatusDto, req) {
        if (!req.user?.id) {
            throw new common_1.UnauthorizedException('Authentication required for order status updates');
        }
        const changedBy = req.user.id;
        return this.orderService.updateOrderStatus(parseInt(id), updateStatusDto, changedBy);
    }
    async updatePaymentStatus(id, updatePaymentDto, req) {
        const updatedBy = req.user?.id || 1;
        return this.orderService.updatePaymentStatus(parseInt(id), updatePaymentDto, updatedBy);
    }
    async bundleOrdersForDelivery(bundleData) {
        return this.orderService.bundleOrdersForDelivery(bundleData.deliveryZone, bundleData.timeWindow);
    }
    async autoRetryFailedOrders(retryConfig) {
        return this.orderService.autoRetryFailedOrders(retryConfig.maxRetries);
    }
    async optimizeOrderRouting(id) {
        return this.orderService.optimizeOrderRouting(parseInt(id));
    }
    async handlePartialFulfillment(id, fulfillmentData) {
        return this.orderService.handlePartialFulfillment(parseInt(id), fulfillmentData.availableItems);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get orders by status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders by status retrieved successfully' }),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)('customer/:customerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get orders by customer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer orders retrieved successfully' }),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findByCustomer", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order status updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':id/payment'),
    (0, swagger_1.ApiOperation)({ summary: 'Update payment status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment status updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_payment_status_dto_1.UpdatePaymentStatusDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updatePaymentStatus", null);
__decorate([
    (0, common_1.Post)('bundle-delivery'),
    (0, swagger_1.ApiOperation)({ summary: 'Bundle orders for optimized delivery' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders bundled successfully' }),
    (0, auth_1.Roles)('admin', 'manager', 'ops'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "bundleOrdersForDelivery", null);
__decorate([
    (0, common_1.Post)('retry-failed'),
    (0, swagger_1.ApiOperation)({ summary: 'Auto-retry failed orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Failed orders processed' }),
    (0, auth_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "autoRetryFailedOrders", null);
__decorate([
    (0, common_1.Put)(':id/optimize-routing'),
    (0, swagger_1.ApiOperation)({ summary: 'Optimize order routing and fulfillment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order routing optimized' }),
    (0, auth_1.Roles)('admin', 'manager', 'ops'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "optimizeOrderRouting", null);
__decorate([
    (0, common_1.Post)(':id/partial-fulfillment'),
    (0, swagger_1.ApiOperation)({ summary: 'Handle partial order fulfillment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Partial fulfillment processed' }),
    (0, auth_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "handlePartialFulfillment", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map