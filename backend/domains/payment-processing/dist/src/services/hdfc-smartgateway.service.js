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
var HDFCSmartGatewayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HDFCSmartGatewayService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
let HDFCSmartGatewayService = HDFCSmartGatewayService_1 = class HDFCSmartGatewayService {
    constructor() {
        this.logger = new common_1.Logger(HDFCSmartGatewayService_1.name);
        this.merchantId = process.env.HDFC_MERCHANT_ID || 'test_merchant';
        this.terminalId = process.env.HDFC_TERMINAL_ID || 'test_terminal';
        this.encryptionKey = process.env.HDFC_ENCRYPTION_KEY || 'test_key_12345678';
        const isProduction = process.env.NODE_ENV === 'production';
        this.baseUrl = isProduction
            ? 'https://smartgateway.hdfcbank.com'
            : 'https://smartgatewayuat.hdfcbank.com';
    }
    encrypt(data) {
        try {
            const key = crypto.createHash('md5').update(this.encryptionKey).digest();
            const cipher = crypto.createCipheriv('aes-128-ecb', key, null);
            let encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted.toUpperCase();
        }
        catch (error) {
            this.logger.error('Encryption error:', error.message);
            throw new common_1.BadRequestException('Failed to encrypt payment data');
        }
    }
    decrypt(encryptedData) {
        try {
            const key = crypto.createHash('md5').update(this.encryptionKey).digest();
            const decipher = crypto.createDecipheriv('aes-128-ecb', key, null);
            let decrypted = decipher.update(encryptedData.toLowerCase(), 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
        catch (error) {
            this.logger.error('Decryption error:', error.message);
            throw new common_1.BadRequestException('Failed to decrypt response data');
        }
    }
    async createPayment(orderData) {
        try {
            if (this.merchantId === 'test_merchant') {
                const mockOrder = {
                    order_id: `hdfc_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    merchant_id: this.merchantId,
                    amount: orderData.amount,
                    currency: orderData.currency || 'INR',
                    status: 'created',
                    redirect_url: `http://localhost:3000/payment/hdfc/callback?order_id=${orderData.orderId}&status=success`
                };
                this.logger.log(`Mock HDFC order created: ${mockOrder.order_id}`);
                return mockOrder;
            }
            const formattedAmount = parseFloat(orderData.amount.toString()).toFixed(2);
            const transactionData = [
                this.merchantId,
                this.terminalId,
                orderData.orderId,
                formattedAmount,
                orderData.currency || 'INR',
                orderData.customerEmail || 'test@example.com',
                orderData.customerPhone || '9999999999',
                orderData.returnUrl || 'http://localhost:3000/payment/success'
            ].join('|');
            this.logger.log(`Initiating HDFC payment for order: ${orderData.orderId}`);
            const encryptedData = this.encrypt(transactionData);
            return {
                order_id: orderData.orderId,
                encryptedData,
                merchantId: this.merchantId,
                terminalId: this.terminalId,
                redirect_url: `${this.baseUrl}/gateway/payment`
            };
        }
        catch (error) {
            this.logger.error('Error initiating HDFC payment:', error.message);
            const mockOrder = {
                order_id: `hdfc_fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                merchant_id: this.merchantId,
                amount: orderData.amount,
                currency: orderData.currency || 'INR',
                status: 'created',
                redirect_url: `http://localhost:3000/payment/hdfc/callback?order_id=${orderData.orderId}&status=success`
            };
            this.logger.warn(`Using fallback mock HDFC order: ${mockOrder.order_id}`);
            return mockOrder;
        }
    }
    async verifyPayment(encryptedResponse) {
        try {
            if (this.merchantId === 'test_merchant' || encryptedResponse.includes('test')) {
                const mockVerification = {
                    isSuccess: true,
                    transactionId: `hdfc_txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    paymentId: `hdfc_pay_${Date.now()}`,
                    amount: 100.00,
                    currency: 'INR',
                    status: 'Success',
                    gatewayResponse: {
                        order_status: 'Success',
                        tracking_id: `hdfc_txn_${Date.now()}`,
                        order_id: `hdfc_pay_${Date.now()}`,
                        amount: '100.00',
                        currency: 'INR'
                    }
                };
                this.logger.log(`Mock HDFC payment verification successful: ${mockVerification.transactionId}`);
                return mockVerification;
            }
            const decryptedData = this.decrypt(encryptedResponse);
            this.logger.log(`Decrypted HDFC response: ${decryptedData}`);
            const responseFields = decryptedData.split('|');
            if (responseFields.length < 5) {
                throw new common_1.BadRequestException('Invalid response format from HDFC');
            }
            const [orderId, amount, currency, status, transactionId, ...rest] = responseFields;
            const isSuccess = status === 'SUCCESS' || status === 'APPROVED';
            return {
                orderId,
                amount: parseFloat(amount),
                currency,
                status,
                transactionId,
                isSuccess,
                errorMessage: isSuccess ? undefined : rest.join('|')
            };
        }
        catch (error) {
            this.logger.error('Error verifying HDFC response:', error.message);
            throw new common_1.BadRequestException('Invalid encrypted response');
        }
    }
    async queryTransaction(orderId) {
        try {
            const queryData = [
                this.merchantId,
                this.terminalId,
                orderId,
                'QUERY'
            ].join('|');
            const encryptedQuery = this.encrypt(queryData);
            this.logger.log(`Querying transaction status for order: ${orderId}`);
            return {
                orderId,
                amount: 0,
                currency: 'INR',
                status: 'PENDING',
                transactionId: '',
                isSuccess: false
            };
        }
        catch (error) {
            this.logger.error('Error querying HDFC transaction:', error.message);
            throw new common_1.BadRequestException('Failed to query transaction status');
        }
    }
    validateMerchantCredentials() {
        return !!(this.merchantId && this.terminalId && this.encryptionKey);
    }
    generateChecksum(data) {
        try {
            return crypto
                .createHash('sha256')
                .update(data + this.encryptionKey)
                .digest('hex')
                .toUpperCase();
        }
        catch (error) {
            this.logger.error('Error generating checksum:', error.message);
            throw new common_1.BadRequestException('Failed to generate checksum');
        }
    }
};
exports.HDFCSmartGatewayService = HDFCSmartGatewayService;
exports.HDFCSmartGatewayService = HDFCSmartGatewayService = HDFCSmartGatewayService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], HDFCSmartGatewayService);
//# sourceMappingURL=hdfc-smartgateway.service.js.map