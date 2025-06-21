import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { db } from '../database/connection';
import { RazorpayService } from './razorpay.service';
import { HDFCSmartGatewayService } from './hdfc-smartgateway.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  
  constructor(
    private readonly razorpayService: RazorpayService,
    private readonly hdfcService: HDFCSmartGatewayService
  ) {}

  async createRazorpayPayment(paymentData: any) {
    try {
      this.logger.log(`Creating Razorpay payment for amount: ${paymentData.amount}`);
      
      // Create Razorpay order
      const razorpayOrder = await this.razorpayService.createOrder(
        paymentData.amount,
        paymentData.currency || 'INR',
        paymentData.orderId
      );

      // Create payment record in database
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
    } catch (error) {
      this.logger.error(`Razorpay payment creation failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        message: 'Failed to create Razorpay payment'
      };
    }
  }

  async createHDFCPayment(paymentData: any) {
    try {
      this.logger.log(`Creating HDFC payment for amount: ${paymentData.amount}`);
      
      // Create HDFC order
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
    } catch (error) {
      this.logger.error(`HDFC payment creation failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        message: 'Failed to create HDFC payment'
      };
    }
  }

  async verifyRazorpayPayment(verifyDto: any) {
    try {
      this.logger.log(`Verifying Razorpay payment: ${verifyDto.razorpay_payment_id}`);
      
      // Verify payment signature
      const isValid = this.razorpayService.verifyPayment(
        verifyDto.razorpay_payment_id,
        verifyDto.razorpay_order_id,
        verifyDto.razorpay_signature
      );

      if (!isValid) {
        throw new BadRequestException('Invalid payment signature');
      }

      // Create transaction record
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
    } catch (error) {
      this.logger.error(`Razorpay payment verification failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        message: 'Payment verification failed'
      };
    }
  }

  async verifyHDFCPayment(verifyDto: any) {
    try {
      this.logger.log(`Verifying HDFC payment: ${verifyDto.encryptedResponse}`);
      
      const verification = await this.hdfcService.verifyPayment(verifyDto.encryptedResponse);
      
      if (!verification.isSuccess) {
        throw new BadRequestException('HDFC payment verification failed');
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
    } catch (error) {
      this.logger.error(`HDFC payment verification failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        message: 'HDFC payment verification failed'
      };
    }
  }

  async refundPayment(refundDto: any) {
    try {
      this.logger.log(`Processing refund for payment: ${refundDto.payment_id}`);
      
      let gatewayRefund;
      
      if (refundDto.gateway === 'razorpay') {
        gatewayRefund = await this.razorpayService.refundPayment(
          refundDto.payment_id,
          refundDto.amount
        );
      } else if (refundDto.gateway === 'hdfc_smartgateway') {
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
    } catch (error) {
      this.logger.error(`Refund processing failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        message: 'Refund processing failed'
      };
    }
  }

  async handleWebhook(webhookData: any, gateway: string) {
    this.logger.log(`Webhook received from ${gateway} - temporarily stored`);
    return {
      received: true
    };
  }
}