import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsPositive, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BudgetPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export enum BudgetStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired'
}

export class CreateBudgetDto {
  @ApiProperty({ description: 'Budget name/title' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Budget amount', example: 50000.00 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ enum: BudgetPeriod, description: 'Budget period' })
  @IsEnum(BudgetPeriod)
  period: BudgetPeriod;

  @ApiProperty({ description: 'Budget start date', example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Budget end date', example: '2024-12-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Cost center or department', required: false })
  @IsOptional()
  @IsString()
  costCenter?: string;

  @ApiProperty({ description: 'Applicable expense categories', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({ description: 'Budget description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Alert threshold percentage (0-100)', required: false, example: 80 })
  @IsOptional()
  @IsNumber()
  alertThreshold?: number;

  @ApiProperty({ description: 'Budget owner/manager ID', required: false })
  @IsOptional()
  @IsNumber()
  ownerId?: number;

  @ApiProperty({ enum: BudgetStatus, description: 'Budget status', required: false })
  @IsOptional()
  @IsEnum(BudgetStatus)
  status?: BudgetStatus;
}