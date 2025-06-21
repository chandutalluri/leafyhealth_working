import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export interface RazorpayPayment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  captured: boolean;
  created_at: number;
}

@Injectable()
export class RazorpayService {
  private readonly logger = new Logger(RazorpayService.name);
  private keyId: string;
  private keySecret: string;
  private baseUrl: string = 'https://api.razorpay.com/v1';

  constructor(keyId?: string, keySecret?: string) {
    this.keyId = keyId || process.env.RAZORPAY_KEY_ID || 'rzp_test_default';
    this.keySecret = keySecret || process.env.RAZORPAY_KEY_SECRET || 'default_secret';
  }

  private validateCredentials() {
    if (!this.keyId || !this.keySecret) {
      this.logger.warn('Razorpay credentials not provided, using defaults');
    }
  }

  getKeyId(): string {
    return this.keyId;
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
    return `Basic ${credentials}`;
  }

  async createOrder(amount: number, currency: string = 'INR', orderId: string): Promise<RazorpayOrder> {
    try {
      const options = {
        amount: Math.round(amount * 100), // Amount in paise
        currency,
        receipt: orderId,
        notes: {
          order_id: orderId,
          created_by: 'leafyhealth_platform'
        }
      };

      const response = await axios.post(
        `${this.baseUrl}/orders`,
        options,
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );

      this.logger.log(`Razorpay order created: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error creating Razorpay order:', error.response?.data || error.message);
      throw new BadRequestException('Failed to create payment order');
    }
  }

  verifyPayment(paymentId: string, orderId: string, signature: string, webhookSecret?: string): boolean {
    try {
      const secret = webhookSecret || this.keySecret;
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(orderId + '|' + paymentId);
      const generated_signature = hmac.digest('hex');
      
      const isValid = generated_signature === signature;
      this.logger.log(`Payment verification result: ${isValid} for payment ${paymentId}`);
      return isValid;
    } catch (error) {
      this.logger.error('Error verifying payment:', error.message);
      return false;
    }
  }

  async capturePayment(paymentId: string, amount: number): Promise<RazorpayPayment> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/payments/${paymentId}/capture`,
        { amount: Math.round(amount * 100) },
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );

      this.logger.log(`Payment captured: ${paymentId}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error capturing payment:', error.response?.data || error.message);
      throw new BadRequestException('Failed to capture payment');
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<any> {
    try {
      const refundData = amount 
        ? { amount: Math.round(amount * 100) } 
        : {}; // Full refund if amount not specified

      const response = await axios.post(
        `${this.baseUrl}/payments/${paymentId}/refund`,
        refundData,
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );

      this.logger.log(`Refund processed: ${response.data.id} for payment ${paymentId}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error processing refund:', error.response?.data || error.message);
      throw new BadRequestException('Failed to process refund');
    }
  }

  async getPayment(paymentId: string): Promise<RazorpayPayment> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/payments/${paymentId}`,
        {
          headers: {
            'Authorization': this.getAuthHeader()
          }
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching payment:', error.response?.data || error.message);
      throw new BadRequestException('Failed to fetch payment details');
    }
  }

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      this.logger.error('Error verifying webhook signature:', error.message);
      return false;
    }
  }
}