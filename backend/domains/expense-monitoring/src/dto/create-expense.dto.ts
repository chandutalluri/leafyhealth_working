import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ExpenseCategory {
  OFFICE_SUPPLIES = 'office_supplies',
  TRAVEL = 'travel',
  MARKETING = 'marketing',
  SOFTWARE = 'software',
  UTILITIES = 'utilities',
  RENT = 'rent',
  MEALS = 'meals',
  EQUIPMENT = 'equipment',
  PROFESSIONAL_SERVICES = 'professional_services',
  TRAINING = 'training',
  OTHER = 'other'
}

export enum ExpenseStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid'
}

export class CreateExpenseDto {
  @ApiProperty({ description: 'Expense title/description' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Expense amount', example: 150.00 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ enum: ExpenseCategory, description: 'Expense category' })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty({ description: 'Expense date', example: '2024-01-15' })
  @IsDateString()
  expenseDate: string;

  @ApiProperty({ description: 'Vendor/supplier name', required: false })
  @IsOptional()
  @IsString()
  vendor?: string;

  @ApiProperty({ description: 'Cost center or department', required: false })
  @IsOptional()
  @IsString()
  costCenter?: string;

  @ApiProperty({ description: 'Project or campaign reference', required: false })
  @IsOptional()
  @IsString()
  projectCode?: string;

  @ApiProperty({ description: 'Receipt URL or file path', required: false })
  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Submitting employee ID', required: false })
  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @ApiProperty({ enum: ExpenseStatus, description: 'Expense status', required: false })
  @IsOptional()
  @IsEnum(ExpenseStatus)
  status?: ExpenseStatus;
}