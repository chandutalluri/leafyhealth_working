import { IsNotEmpty, IsOptional, IsString, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({ description: 'Quantity' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Unit price' })
  @IsNotEmpty()
  @IsString()
  unitPrice: string;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Customer ID', required: false })
  @IsOptional()
  @IsNumber()
  customerId?: number;

  @ApiProperty({ description: 'Customer name' })
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Customer email' })
  @IsNotEmpty()
  @IsString()
  customerEmail: string;

  @ApiProperty({ description: 'Customer phone', required: false })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({ description: 'Order type', required: false })
  @IsOptional()
  @IsString()
  orderType?: string;

  @ApiProperty({ description: 'Shipping address', required: false })
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @ApiProperty({ description: 'Billing address', required: false })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiProperty({ description: 'Special instructions', required: false })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiProperty({ description: 'Promo code', required: false })
  @IsOptional()
  @IsString()
  promoCode?: string;

  @ApiProperty({ description: 'Order items', type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}