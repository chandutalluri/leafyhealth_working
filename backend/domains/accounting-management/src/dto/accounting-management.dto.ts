import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  ASSET = 'asset',
  LIABILITY = 'liability',
}

export enum ExpenseCategory {
  OFFICE_SUPPLIES = 'office_supplies',
  UTILITIES = 'utilities',
  RENT = 'rent',
  MARKETING = 'marketing',
  TRAVEL = 'travel',
  OTHER = 'other',
}

export class CreateTransactionDto {
  @ApiProperty({ description: 'Transaction description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Transaction amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: TransactionType, description: 'Transaction type' })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ description: 'Transaction category', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Reference number', required: false })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({ description: 'Transaction date', required: false })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

export class CreateExpenseDto {
  @ApiProperty({ description: 'Expense description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Expense amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: ExpenseCategory, description: 'Expense category' })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty({ description: 'Vendor name', required: false })
  @IsOptional()
  @IsString()
  vendor?: string;

  @ApiProperty({ description: 'Receipt number', required: false })
  @IsOptional()
  @IsString()
  receiptNumber?: string;

  @ApiProperty({ description: 'Expense date', required: false })
  @IsOptional()
  @IsDateString()
  expenseDate?: string;
}

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}