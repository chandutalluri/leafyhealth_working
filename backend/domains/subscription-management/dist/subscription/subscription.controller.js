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
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const subscription_service_1 = require("./subscription.service");
const subscription_dto_1 = require("./dto/subscription.dto");
let SubscriptionController = class SubscriptionController {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async createSubscription(createSubscriptionDto) {
        return this.subscriptionService.createSubscription(createSubscriptionDto);
    }
    async getAllSubscriptions(userId, status) {
        return this.subscriptionService.getAllSubscriptions(userId, status);
    }
    async getActiveSubscriptions(userId) {
        return this.subscriptionService.getActiveSubscriptions(userId);
    }
    async getSubscriptionPlans() {
        return this.subscriptionService.getSubscriptionPlans();
    }
    async getSubscriptionById(id) {
        return this.subscriptionService.getSubscriptionById(id);
    }
    async updateSubscription(id, updateSubscriptionDto) {
        return this.subscriptionService.updateSubscription(id, updateSubscriptionDto);
    }
    async pauseSubscription(id) {
        return this.subscriptionService.pauseSubscription(id);
    }
    async resumeSubscription(id) {
        return this.subscriptionService.resumeSubscription(id);
    }
    async cancelSubscription(id) {
        return this.subscriptionService.cancelSubscription(id);
    }
    async getDeliverySchedule(id) {
        return this.subscriptionService.getDeliverySchedule(id);
    }
    async generateDeliverySchedule(id) {
        return this.subscriptionService.generateDeliverySchedule(id);
    }
    getHealth() {
        return {
            status: 'healthy',
            service: 'subscription-management',
            timestamp: new Date().toISOString(),
        };
    }
};
exports.SubscriptionController = SubscriptionController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new subscription' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Subscription created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_dto_1.CreateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "createSubscription", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all subscriptions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscriptions retrieved successfully' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getAllSubscriptions", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active subscriptions for user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active subscriptions retrieved' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getActiveSubscriptions", null);
__decorate([
    (0, common_1.Get)('plans'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available subscription plans' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription plans retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getSubscriptionPlans", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subscription by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getSubscriptionById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update subscription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subscription_dto_1.UpdateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.Put)(':id/pause'),
    (0, swagger_1.ApiOperation)({ summary: 'Pause subscription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription paused successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "pauseSubscription", null);
__decorate([
    (0, common_1.Put)(':id/resume'),
    (0, swagger_1.ApiOperation)({ summary: 'Resume subscription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription resumed successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "resumeSubscription", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel subscription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription cancelled successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "cancelSubscription", null);
__decorate([
    (0, common_1.Get)(':id/schedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Get delivery schedule for subscription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Delivery schedule retrieved' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getDeliverySchedule", null);
__decorate([
    (0, common_1.Post)(':id/schedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate delivery schedule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Delivery schedule generated' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "generateDeliverySchedule", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "getHealth", null);
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, swagger_1.ApiTags)('subscriptions'),
    (0, common_1.Controller)('api/subscriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService])
], SubscriptionController);
//# sourceMappingURL=subscription.controller.js.map