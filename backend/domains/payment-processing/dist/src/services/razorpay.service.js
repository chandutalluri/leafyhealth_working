"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RazorpayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const axios_1 = __importDefault(require("axios"));
let RazorpayService = RazorpayService_1 = class RazorpayService {
    constructor(keyId, keySecret) {
        this.logger = new common_1.Logger(RazorpayService_1.name);
        this.baseUrl = 'https://api.razorpay.com/v1';
        this.keyId = keyId || process.env.RAZORPAY_KEY_ID || 'rzp_test_default';
        this.keySecret = keySecret || process.env.RAZORPAY_KEY_SECRET || 'default_secret';
    }
    validateCredentials() {
        if (!this.keyId || !this.keySecret) {
            this.logger.warn('Razorpay credentials not provided, using defaults');
        }
    }
    getKeyId() {
        return this.keyId;
    }
    getAuthHeader() {
        const credentials = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
        return `Basic ${credentials}`;
    }
    async createOrder(amount, currency = 'INR', orderId) {
        try {
            const options = {
                amount: Math.round(amount * 100),
                currency,
                receipt: orderId,
                notes: {
                    order_id: orderId,
                    created_by: 'leafyhealth_platform'
                }
            };
            const response = await axios_1.default.post(`${this.baseUrl}/orders`, options, {
                headers: {
                    'Authorization': this.getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            });
            this.logger.log(`Razorpay order created: ${response.data.id}`);
            return response.data;
        }
        catch (error) {
            this.logger.error('Error creating Razorpay order:', error.response?.data || error.message);
            throw new common_1.BadRequestException('Failed to create payment order');
        }
    }
    verifyPayment(paymentId, orderId, signature, webhookSecret) {
        try {
            const secret = webhookSecret || this.keySecret;
            const hmac = crypto.createHmac('sha256', secret);
            hmac.update(orderId + '|' + paymentId);
            const generated_signature = hmac.digest('hex');
            const isValid = generated_signature === signature;
            this.logger.log(`Payment verification result: ${isValid} for payment ${paymentId}`);
            return isValid;
        }
        catch (error) {
            this.logger.error('Error verifying payment:', error.message);
            return false;
        }
    }
    async capturePayment(paymentId, amount) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/payments/${paymentId}/capture`, { amount: Math.round(amount * 100) }, {
                headers: {
                    'Authorization': this.getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            });
            this.logger.log(`Payment captured: ${paymentId}`);
            return response.data;
        }
        catch (error) {
            this.logger.error('Error capturing payment:', error.response?.data || error.message);
            throw new common_1.BadRequestException('Failed to capture payment');
        }
    }
    async refundPayment(paymentId, amount) {
        try {
            const refundData = amount
                ? { amount: Math.round(amount * 100) }
                : {};
            const response = await axios_1.default.post(`${this.baseUrl}/payments/${paymentId}/refund`, refundData, {
                headers: {
                    'Authorization': this.getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            });
            this.logger.log(`Refund processed: ${response.data.id} for payment ${paymentId}`);
            return response.data;
        }
        catch (error) {
            this.logger.error('Error processing refund:', error.response?.data || error.message);
            throw new common_1.BadRequestException('Failed to process refund');
        }
    }
    async getPayment(paymentId) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/payments/${paymentId}`, {
                headers: {
                    'Authorization': this.getAuthHeader()
                }
            });
            return response.data;
        }
        catch (error) {
            this.logger.error('Error fetching payment:', error.response?.data || error.message);
            throw new common_1.BadRequestException('Failed to fetch payment details');
        }
    }
    verifyWebhookSignature(payload, signature, secret) {
        try {
            const expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(payload)
                .digest('hex');
            return expectedSignature === signature;
        }
        catch (error) {
            this.logger.error('Error verifying webhook signature:', error.message);
            return false;
        }
    }
};
exports.RazorpayService = RazorpayService;
exports.RazorpayService = RazorpayService = RazorpayService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String, String])
], RazorpayService);
//# sourceMappingURL=razorpay.service.js.map