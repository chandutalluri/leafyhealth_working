import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEmail, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Order ID from e-commerce system' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Payment amount in rupees' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Currency code', default: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ description: 'Payment gateway', enum: ['razorpay', 'hdfc_smartgateway'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['razorpay', 'hdfc_smartgateway'])
  gateway: string;

  @ApiProperty({ description: 'Payment method ID', required: false })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @ApiProperty({ description: 'Customer email address' })
  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ description: 'Customer phone number' })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({ description: 'Return URL after payment', required: false })
  @IsOptional()
  @IsString()
  returnUrl?: string;

  @ApiProperty({ description: 'Webhook URL for payment updates', required: false })
  @IsOptional()
  @IsString()
  webhookUrl?: string;
}