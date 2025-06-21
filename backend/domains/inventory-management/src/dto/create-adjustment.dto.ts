import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdjustmentDto {
  @ApiProperty({ description: 'Product ID' })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({ description: 'New quantity' })
  @IsNotEmpty()
  @IsNumber()
  newQuantity: number;

  @ApiProperty({ description: 'Adjustment reason' })
  @IsNotEmpty()
  @IsString()
  adjustmentReason: string;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}