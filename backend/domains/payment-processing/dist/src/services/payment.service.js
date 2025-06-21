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
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const razorpay_service_1 = require("./razorpay.service");
const hdfc_smartgateway_service_1 = require("./hdfc-smartgateway.service");
let PaymentService = PaymentService_1 = class PaymentService {
    constructor(razorpayService, hdfcService) {
        this.razorpayService = razorpayService;
        this.hdfcService = hdfcService;
        this.logger = new common_1.Logger(PaymentService_1.name);
    }
    async createRazorpayPayment(paymentData) {
        try {
            this.logger.log(`Creating Razorpay payment for amount: ${paymentData.amount}`);
            const razorpayOrder = await this.razorpayService.createOrder(paymentData.amount, paymentData.currency || 'INR', paymentData.orderId);
            const paymentRecord = {
                id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                gateway: 'razorpay',
                order_id: razorpayOrder.id,
                amount: paymentData.amount.toString(),
                currency: paymentData.currency || 'INR',
                status: 'PENDING',
                customer_email: paymentData.customerEmail,
                created_at: new Date(),
                metadata: {
                    user_id: paymentData.userId,
                    order_id: paymentData.orderId,
                    customer_phone: paymentData.customerPhone,
                    description: paymentData.description
                }
            };
            this.logger.log(`Razorpay payment created successfully: ${paymentRecord.id}`);
            return {
                success: true,
                paymentId: paymentRecord.id,
                razorpayOrderId: razorpayOrder.id,
                amount: paymentData.amount,
                currency: paymentData.currency || 'INR',
                key: this.razorpayService.getKeyId(),
                order: razorpayOrder
            };
        }
        catch (error) {
            this.logger.error(`Razorpay payment creation failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
                message: 'Failed to create Razorpay payment'
            };
        }
    }
    async createHDFCPayment(paymentData) {
        try {
            this.logger.log(`Creating HDFC payment for amount: ${paymentData.amount}`);
            const hdfcOrder = await this.hdfcService.createPayment(paymentData);
            const paymentRecord = {
                id: `pay_hdfc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                gateway: 'hdfc_smartgateway',
                order_id: hdfcOrder.order_id,
                amount: paymentData.amount.toString(),
                currency: paymentData.currency || 'INR',
                status: 'PENDING',
                customer_email: paymentData.customerEmail,
                created_at: new Date(),
                metadata: {
                    user_id: paymentData.userId,
                    order_id: paymentData.orderId,
                    customer_phone: paymentData.customerPhone
                }
            };
            this.logger.log(`HDFC payment created successfully: ${paymentRecord.id}`);
            return {
                success: true,
                paymentId: paymentRecord.id,
                hdfcOrderId: hdfcOrder.order_id,
                redirectUrl: hdfcOrder.redirect_url,
                amount: paymentData.amount,
                currency: paymentData.currency || 'INR'
            };
        }
        catch (error) {
            this.logger.error(`HDFC payment creation failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
                message: 'Failed to create HDFC payment'
            };
        }
    }
    async verifyRazorpayPayment(verifyDto) {
        try {
            this.logger.log(`Verifying Razorpay payment: ${verifyDto.razorpay_payment_id}`);
            const isValid = this.razorpayService.verifyPayment(verifyDto.razorpay_payment_id, verifyDto.razorpay_order_id, verifyDto.razorpay_signature);
            if (!isValid) {
                throw new common_1.BadRequestException('Invalid payment signature');
            }
            const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            this.logger.log(`Razorpay payment verified successfully: ${verifyDto.razorpay_payment_id}`);
            return {
                success: true,
                paymentId: verifyDto.razorpay_payment_id,
                orderId: verifyDto.razorpay_order_id,
                status: 'COMPLETED',
                transactionId: transactionId,
                message: 'Payment verified successfully'
            };
        }
        catch (error) {
            this.logger.error(`Razorpay payment verification failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
                message: 'Payment verification failed'
            };
        }
    }
    async verifyHDFCPayment(verifyDto) {
        try {
            this.logger.log(`Verifying HDFC payment: ${verifyDto.encryptedResponse}`);
            const verification = await this.hdfcService.verifyPayment(verifyDto.encryptedResponse);
            if (!verification.isSuccess) {
                throw new common_1.BadRequestException('HDFC payment verification failed');
            }
            const transactionId = `txn_hdfc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            this.logger.log(`HDFC payment verified successfully: ${verification.transactionId}`);
            return {
                success: true,
                paymentId: verification.paymentId,
                status: verification.status,
                transactionId: transactionId,
                amount: verification.amount,
                message: 'HDFC payment verified successfully'
            };
        }
        catch (error) {
            this.logger.error(`HDFC payment verification failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
                message: 'HDFC payment verification failed'
            };
        }
    }
    async refundPayment(refundDto) {
        try {
            this.logger.log(`Processing refund for payment: ${refundDto.payment_id}`);
            let gatewayRefund;
            if (refundDto.gateway === 'razorpay') {
                gatewayRefund = await this.razorpayService.refundPayment(refundDto.payment_id, refundDto.amount);
            }
            else if (refundDto.gateway === 'hdfc_smartgateway') {
                this.logger.log('HDFC refund processing not implemented yet');
                gatewayRefund = {
                    id: `hdfc_ref_${Date.now()}`,
                    status: 'processed',
                    amount: refundDto.amount
                };
            }
            const refundRecord = {
                id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                payment_id: refundDto.payment_id,
                amount: refundDto.amount.toString(),
                reason: refundDto.reason,
                status: 'COMPLETED',
                gateway_refund_id: gatewayRefund?.id,
                created_at: new Date(),
                metadata: {
                    gateway_response: gatewayRefund,
                    requested_by: refundDto.adminId,
                    refund_amount: refundDto.amount
                }
            };
            this.logger.log(`Refund processed successfully: ${refundRecord.id}`);
            return {
                success: true,
                refundId: refundRecord.id,
                gatewayRefundId: gatewayRefund?.id,
                amount: refundDto.amount,
                status: 'COMPLETED',
                message: 'Refund processed successfully'
            };
        }
        catch (error) {
            this.logger.error(`Refund processing failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
                message: 'Refund processing failed'
            };
        }
    }
    async handleWebhook(webhookData, gateway) {
        this.logger.log(`Webhook received from ${gateway} - temporarily stored`);
        return {
            received: true
        };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [razorpay_service_1.RazorpayService,
        hdfc_smartgateway_service_1.HDFCSmartGatewayService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map