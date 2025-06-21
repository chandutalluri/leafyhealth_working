import { Controller, Post, Get, Body, Param, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('razorpay/create')
  @ApiOperation({ summary: 'Create Razorpay payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  async createRazorpayPayment(@Body() paymentData: any) {
    this.logger.log(`Creating Razorpay payment for order: ${paymentData.orderId}`);
    return await this.paymentService.createRazorpayPayment(paymentData);
  }

  @Post('razorpay/verify')
  @ApiOperation({ summary: 'Verify Razorpay payment' })
  @ApiResponse({ status: 200, description: 'Payment verified successfully' })
  async verifyRazorpayPayment(@Body() verifyDto: any) {
    this.logger.log(`Verifying Razorpay payment: ${verifyDto.razorpay_payment_id}`);
    return await this.paymentService.verifyRazorpayPayment(verifyDto);
  }

  @Post('hdfc/create')
  @ApiOperation({ summary: 'Create HDFC payment' })
  @ApiResponse({ status: 201, description: 'HDFC payment created successfully' })
  async createHDFCPayment(@Body() paymentData: any) {
    this.logger.log(`Creating HDFC payment for order: ${paymentData.orderId}`);
    return await this.paymentService.createHDFCPayment(paymentData);
  }

  @Post('hdfc/verify')
  @ApiOperation({ summary: 'Verify HDFC payment' })
  @ApiResponse({ status: 200, description: 'HDFC payment verified successfully' })
  async verifyHDFCPayment(@Body() verifyDto: any) {
    this.logger.log(`Verifying HDFC payment response`);
    return await this.paymentService.verifyHDFCPayment(verifyDto);
  }

  @Post('refund')
  @ApiOperation({ summary: 'Process payment refund' })
  @ApiResponse({ status: 200, description: 'Refund processed successfully' })
  async refundPayment(@Body() refundDto: any) {
    this.logger.log(`Processing refund for payment: ${refundDto.payment_id}`);
    return await this.paymentService.refundPayment(refundDto);
  }

  @Post('webhook/:gateway')
  @ApiOperation({ summary: 'Handle payment gateway webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleWebhook(@Param('gateway') gateway: string, @Body() webhookData: any) {
    this.logger.log(`Received webhook from ${gateway}`);
    return await this.paymentService.handleWebhook(webhookData, gateway);
  }

  @Get('test/razorpay')
  @ApiOperation({ summary: 'Test Razorpay integration' })
  @ApiResponse({ status: 200, description: 'Test completed' })
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

  @Get('test/hdfc')
  @ApiOperation({ summary: 'Test HDFC integration' })
  @ApiResponse({ status: 200, description: 'Test completed' })
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

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'healthy',
      service: 'payment-processing',
      timestamp: new Date().toISOString(),
      razorpay: 'configured',
      hdfc: 'configured'
    };
  }
}