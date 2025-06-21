import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';

@ApiTags('expenses')
// Bearer auth disabled
// Auth disabled for development
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense record' })
  @ApiResponse({ status: 201, description: 'Expense created successfully' })
  async createExpense(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.createExpense(createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses with optional filters' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, description: 'Expense status filter' })
  async getExpenses(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('status') status?: string,
  ) {
    return this.expenseService.getExpenses({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
    });
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get expenses by category' })
  @ApiParam({ name: 'category', description: 'Expense category' })
  async getExpensesByCategory(@Param('category') category: string) {
    return this.expenseService.getExpensesByCategory(category);
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Get expenses within date range' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  async getExpensesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.expenseService.getExpensesByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending expenses requiring approval' })
  async getPendingExpenses() {
    return this.expenseService.getPendingExpenses();
  }

  @Get('monthly-summary')
  @ApiOperation({ summary: 'Get monthly expense summary' })
  @ApiQuery({ name: 'year', required: true, description: 'Year (YYYY)' })
  @ApiQuery({ name: 'month', required: true, description: 'Month (1-12)' })
  async getMonthlyExpenseSummary(
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.expenseService.getMonthlyExpenseSummary(parseInt(year), parseInt(month));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense details by ID' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  async getExpenseById(@Param('id') id: string) {
    return this.expenseService.getExpenseById(parseInt(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update expense record' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  async updateExpense(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expenseService.updateExpense(parseInt(id), updateExpenseDto);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve expense' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  async approveExpense(@Param('id') id: string) {
    return this.expenseService.approveExpense(parseInt(id));
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject expense' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  async rejectExpense(@Param('id') id: string, @Body('reason') reason: string) {
    return this.expenseService.rejectExpense(parseInt(id), reason);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense record' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  async deleteExpense(@Param('id') id: string) {
    return this.expenseService.deleteExpense(parseInt(id));
  }
}