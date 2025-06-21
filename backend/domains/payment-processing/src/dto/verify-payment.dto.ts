import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyRazorpayPaymentDto {
  @ApiProperty({ description: 'Razorpay payment ID' })
  @IsNotEmpty()
  @IsString()
  razorpay_payment_id: string;

  @ApiProperty({ description: 'Razorpay order ID' })
  @IsNotEmpty()
  @IsString()
  razorpay_order_id: string;

  @ApiProperty({ description: 'Razorpay signature' })
  @IsNotEmpty()
  @IsString()
  razorpay_signature: string;
}

export class VerifyHDFCPaymentDto {
  @ApiProperty({ description: 'HDFC encrypted response data' })
  @IsNotEmpty()
  @IsString()
  encryptedResponse: string;
}