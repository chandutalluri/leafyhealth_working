import { IsString, IsNumber, IsOptional, IsArray, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubscriptionItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity' })
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({ description: 'Day offset for delivery' })
  @IsOptional()
  @IsNumber()
  dayOffset?: number;
}

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Plan type', example: 'daily' })
  @IsString()
  planType: string;

  @ApiProperty({ description: 'Meal type', example: 'breakfast' })
  @IsString()
  mealType: string;

  @ApiProperty({ description: 'Duration in days' })
  @IsNumber()
  duration: number;

  @ApiProperty({ description: 'Start date' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Delivery time slot' })
  @IsString()
  deliveryTime: string;

  @ApiProperty({ description: 'Branch ID' })
  @IsUUID()
  branchId: string;

  @ApiProperty({ description: 'Total price' })
  @IsNumber()
  totalPrice: number;

  @ApiPropertyOptional({ description: 'Subscription items', type: [CreateSubscriptionItemDto] })
  @IsOptional()
  @IsArray()
  items?: CreateSubscriptionItemDto[];
}

export class UpdateSubscriptionDto {
  @ApiPropertyOptional({ description: 'Plan type' })
  @IsOptional()
  @IsString()
  planType?: string;

  @ApiPropertyOptional({ description: 'Meal type' })
  @IsOptional()
  @IsString()
  mealType?: string;

  @ApiPropertyOptional({ description: 'Duration in days' })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({ description: 'Delivery time slot' })
  @IsOptional()
  @IsString()
  deliveryTime?: string;

  @ApiPropertyOptional({ description: 'Total price' })
  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @ApiPropertyOptional({ description: 'Status' })
  @IsOptional()
  @IsString()
  status?: string;
}