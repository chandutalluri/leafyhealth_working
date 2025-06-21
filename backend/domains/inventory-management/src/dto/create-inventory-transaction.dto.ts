import { IsNotEmpty, IsNumber, IsOptional, IsString, IsIn, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryTransactionDto {
  @ApiProperty({ description: 'Product ID' })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({ description: 'Transaction type', enum: ['IN', 'OUT', 'ADJUSTMENT'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['IN', 'OUT', 'ADJUSTMENT'])
  transactionType: string;

  @ApiProperty({ description: 'Quantity change' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Unit cost', required: false })
  @IsOptional()
  @IsString()
  unitCost?: string;

  @ApiProperty({ description: 'Reference (PO, SO, etc.)', required: false })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}