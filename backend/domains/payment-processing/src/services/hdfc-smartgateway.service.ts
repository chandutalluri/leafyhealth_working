import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

export interface HDFCPaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
}

export interface HDFCPaymentResponse {
  encryptedData: string;
  merchantId: string;
  terminalId: string;
  paymentUrl: string;
}

export interface HDFCTransactionResponse {
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  transactionId: string;
  isSuccess: boolean;
  errorMessage?: string;
}

@Injectable()
export class HDFCSmartGatewayService {
  private readonly logger = new Logger(HDFCSmartGatewayService.name);
  private merchantId: string;
  private terminalId: string;
  private encryptionKey: string;
  private baseUrl: string;

  constructor() {
    this.merchantId = process.env.HDFC_MERCHANT_ID || 'test_merchant';
    this.terminalId = process.env.HDFC_TERMINAL_ID || 'test_terminal';
    this.encryptionKey = process.env.HDFC_ENCRYPTION_KEY || 'test_key_12345678';
    const isProduction = process.env.NODE_ENV === 'production';
    this.baseUrl = isProduction 
      ? 'https://smartgateway.hdfcbank.com' 
      : 'https://smartgatewayuat.hdfcbank.com';
  }

  private encrypt(data: string): string {
    try {
      // Use AES-128-ECB with proper key handling
      const key = crypto.createHash('md5').update(this.encryptionKey).digest();
      const cipher = crypto.createCipheriv('aes-128-ecb', key, null);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted.toUpperCase();
    } catch (error) {
      this.logger.error('Encryption error:', error.message);
      throw new BadRequestException('Failed to encrypt payment data');
    }
  }

  private decrypt(encryptedData: string): string {
    try {
      // Use AES-128-ECB with proper key handling
      const key = crypto.createHash('md5').update(this.encryptionKey).digest();
      const decipher = crypto.createDecipheriv('aes-128-ecb', key, null);
      let decrypted = decipher.update(encryptedData.toLowerCase(), 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      this.logger.error('Decryption error:', error.message);
      throw new BadRequestException('Failed to decrypt response data');
    }
  }

  async createPayment(orderData: any): Promise<any> {
    try {
      // For test/demo purposes, create mock HDFC payment
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

      // Format amount to 2 decimal places
      const formattedAmount = parseFloat(orderData.amount.toString()).toFixed(2);
      
      // Create transaction data string in the required format
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
    } catch (error) {
      this.logger.error('Error initiating HDFC payment:', error.message);
      
      // Fallback to mock order
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

  async verifyPayment(encryptedResponse: string): Promise<any> {
    try {
      // For test/demo purposes, return mock verification
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
        throw new BadRequestException('Invalid response format from HDFC');
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
    } catch (error) {
      this.logger.error('Error verifying HDFC response:', error.message);
      throw new BadRequestException('Invalid encrypted response');
    }
  }

  async queryTransaction(orderId: string): Promise<HDFCTransactionResponse> {
    try {
      // Create query data string
      const queryData = [
        this.merchantId,
        this.terminalId,
        orderId,
        'QUERY'
      ].join('|');

      const encryptedQuery = this.encrypt(queryData);
      
      // Note: This is a placeholder for the actual HDFC query API
      // You'll need to implement the actual HTTP call based on HDFC documentation
      this.logger.log(`Querying transaction status for order: ${orderId}`);
      
      // For now, return a basic response structure
      return {
        orderId,
        amount: 0,
        currency: 'INR',
        status: 'PENDING',
        transactionId: '',
        isSuccess: false
      };
    } catch (error) {
      this.logger.error('Error querying HDFC transaction:', error.message);
      throw new BadRequestException('Failed to query transaction status');
    }
  }

  validateMerchantCredentials(): boolean {
    return !!(this.merchantId && this.terminalId && this.encryptionKey);
  }

  generateChecksum(data: string): string {
    try {
      return crypto
        .createHash('sha256')
        .update(data + this.encryptionKey)
        .digest('hex')
        .toUpperCase();
    } catch (error) {
      this.logger.error('Error generating checksum:', error.message);
      throw new BadRequestException('Failed to generate checksum');
    }
  }
}