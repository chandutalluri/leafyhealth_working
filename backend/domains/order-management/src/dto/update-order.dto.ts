import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({ description: 'New order status' })
  @IsString()
  orderStatus: string;

  @ApiProperty({ description: 'Status reason', required: false })
  @IsOptional()
  @IsString()
  statusReason?: string;
}

export class UpdatePaymentStatusDto {
  @ApiProperty({ description: 'New payment status' })
  @IsString()
  paymentStatus: string;
}