import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefundPaymentDto {
  @ApiProperty({ description: 'Payment ID to refund' })
  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @ApiProperty({ description: 'Refund amount (optional, defaults to full amount)', required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ description: 'Reason for refund' })
  @IsNotEmpty()
  @IsString()
  reason: string;
}