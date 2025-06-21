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
var PaymentController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payment_service_1 = require("../services/payment.service");
let PaymentController = PaymentController_1 = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
        this.logger = new common_1.Logger(PaymentController_1.name);
    }
    async createRazorpayPayment(paymentData) {
        this.logger.log(`Creating Razorpay payment for order: ${paymentData.orderId}`);
        return await this.paymentService.createRazorpayPayment(paymentData);
    }
    async verifyRazorpayPayment(verifyDto) {
        this.logger.log(`Verifying Razorpay payment: ${verifyDto.razorpay_payment_id}`);
        return await this.paymentService.verifyRazorpayPayment(verifyDto);
    }
    async createHDFCPayment(paymentData) {
        this.logger.log(`Creating HDFC payment for order: ${paymentData.orderId}`);
        return await this.paymentService.createHDFCPayment(paymentData);
    }
    async verifyHDFCPayment(verifyDto) {
        this.logger.log(`Verifying HDFC payment response`);
        return await this.paymentService.verifyHDFCPayment(verifyDto);
    }
    async refundPayment(refundDto) {
        this.logger.log(`Processing refund for payment: ${refundDto.payment_id}`);
        return await this.paymentService.refundPayment(refundDto);
    }
    async handleWebhook(gateway, webhookData) {
        this.logger.log(`Received webhook from ${gateway}`);
        return await this.paymentService.handleWebhook(webhookData, gateway);
    }
    async testRazorpay() {
        const testPayment = {
            amount: 100,
            currency: 'INR',
            orderId: `test_order_${Date.now()}`,
            customerEmail: 'test@example.com',
            customerPhone: '9999999999',
            userId: 'test_user_123',
            description: 'Test payment for integration'
        };
        const result = await this.paymentService.createRazorpayPayment(testPayment);
        this.logger.log('Razorpay test completed');
        return {
            message: 'Razorpay test completed successfully',
            result: result
        };
    }
    async testHDFC() {
        const testPayment = {
            amount: 100,
            currency: 'INR',
            orderId: `test_hdfc_order_${Date.now()}`,
            customerEmail: 'test@example.com',
            customerPhone: '9999999999',
            userId: 'test_user_123',
            returnUrl: 'http://localhost:3000/payment/success',
            cancelUrl: 'http://localhost:3000/payment/cancel'
        };
        const result = await this.paymentService.createHDFCPayment(testPayment);
        this.logger.log('HDFC test completed');
        return {
            message: 'HDFC test completed successfully',
            result: result
        };
    }
    getHealth() {
        return {
            status: 'healthy',
            service: 'payment-processing',
            timestamp: new Date().toISOString(),
            razorpay: 'configured',
            hdfc: 'configured'
        };
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('razorpay/create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Razorpay payment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Payment created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createRazorpayPayment", null);
__decorate([
    (0, common_1.Post)('razorpay/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Razorpay payment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment verified successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "verifyRazorpayPayment", null);
__decorate([
    (0, common_1.Post)('hdfc/create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create HDFC payment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'HDFC payment created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createHDFCPayment", null);
__decorate([
    (0, common_1.Post)('hdfc/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify HDFC payment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'HDFC payment verified successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "verifyHDFCPayment", null);
__decorate([
    (0, common_1.Post)('refund'),
    (0, swagger_1.ApiOperation)({ summary: 'Process payment refund' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Refund processed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "refundPayment", null);
__decorate([
    (0, common_1.Post)('webhook/:gateway'),
    (0, swagger_1.ApiOperation)({ summary: 'Handle payment gateway webhooks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed successfully' }),
    __param(0, (0, common_1.Param)('gateway')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Get)('test/razorpay'),
    (0, swagger_1.ApiOperation)({ summary: 'Test Razorpay integration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test completed' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "testRazorpay", null);
__decorate([
    (0, common_1.Get)('test/hdfc'),
    (0, swagger_1.ApiOperation)({ summary: 'Test HDFC integration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test completed' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "testHDFC", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "getHealth", null);
exports.PaymentController = PaymentController = PaymentController_1 = __decorate([
    (0, swagger_1.ApiTags)('payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map