import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePaymentStatusDto {
  @ApiProperty({ 
    description: 'New payment status',
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIAL_PAID'],
    example: 'COMPLETED'
  })
  @IsString()
  paymentStatus: string;

  @ApiProperty({ description: 'Payment gateway transaction ID', required: false })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({ description: 'Gateway response data', required: false })
  @IsOptional()
  gatewayResponse?: any;

  @ApiProperty({ description: 'Payment failure reason', required: false })
  @IsOptional()
  @IsString()
  failureReason?: string;
}