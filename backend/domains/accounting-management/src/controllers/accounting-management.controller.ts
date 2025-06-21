import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  HttpStatus, 
  HttpCode,
  ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AccountingManagementService } from '../services/accounting-management.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  CreateExpenseDto,
  UpdateExpenseDto,
} from '../dto/accounting-management.dto';

@ApiTags('Accounting Management')
// Bearer auth disabled
@Controller('accounting-management')
export class AccountingManagementController {
  constructor(private readonly accountingManagementService: AccountingManagementService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return { 
      status: 'healthy', 
      service: 'accounting-management',
      timestamp: new Date().toISOString()
    };
  }

  // Transaction Endpoints
  @Post('transactions')
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  @HttpCode(HttpStatus.CREATED)
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.accountingManagementService.createTransaction(createTransactionDto);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  getTransactions() {
    return this.accountingManagementService.getAllTransactions();
  }

  @Get('transactions/:id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction retrieved successfully' })
  getTransaction(@Param('id', ParseIntPipe) id: number) {
    return this.accountingManagementService.getTransactionById(id);
  }

  @Put('transactions/:id')
  @ApiOperation({ summary: 'Update transaction' })
  @ApiResponse({ status: 200, description: 'Transaction updated successfully' })
  updateTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto
  ) {
    return this.accountingManagementService.updateTransaction(id, updateTransactionDto);
  }

  @Delete('transactions/:id')
  @ApiOperation({ summary: 'Delete transaction' })
  @ApiResponse({ status: 200, description: 'Transaction deleted successfully' })
  deleteTransaction(@Param('id', ParseIntPipe) id: number) {
    return this.accountingManagementService.deleteTransaction(id);
  }

  // Expense Endpoints
  @Post('expenses')
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense created successfully' })
  @HttpCode(HttpStatus.CREATED)
  createExpense(@Body() createExpenseDto: CreateExpenseDto) {
    return this.accountingManagementService.createExpense(createExpenseDto);
  }

  @Get('expenses')
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiResponse({ status: 200, description: 'Expenses retrieved successfully' })
  getExpenses() {
    return this.accountingManagementService.getAllExpenses();
  }

  @Get('expenses/:id')
  @ApiOperation({ summary: 'Get expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense retrieved successfully' })
  getExpense(@Param('id', ParseIntPipe) id: number) {
    return this.accountingManagementService.getExpenseById(id);
  }

  @Put('expenses/:id')
  @ApiOperation({ summary: 'Update expense' })
  @ApiResponse({ status: 200, description: 'Expense updated successfully' })
  updateExpense(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto
  ) {
    return this.accountingManagementService.updateExpense(id, updateExpenseDto);
  }

  @Delete('expenses/:id')
  @ApiOperation({ summary: 'Delete expense' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully' })
  deleteExpense(@Param('id', ParseIntPipe) id: number) {
    return this.accountingManagementService.deleteExpense(id);
  }

  // Reports Endpoints
  @Get('reports/profit-loss')
  @ApiOperation({ summary: 'Get profit and loss report' })
  @ApiResponse({ status: 200, description: 'Profit and loss report retrieved successfully' })
  getProfitLossReport() {
    return this.accountingManagementService.getProfitLossReport();
  }

  @Get('reports/balance-sheet')
  @ApiOperation({ summary: 'Get balance sheet report' })
  @ApiResponse({ status: 200, description: 'Balance sheet report retrieved successfully' })
  getBalanceSheetReport() {
    return this.accountingManagementService.getBalanceSheetReport();
  }
}