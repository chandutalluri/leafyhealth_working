import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { BudgetService } from '../services/budget.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';

@ApiTags('budgets')
// Bearer auth disabled
// Auth disabled for development
@Controller('budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new budget' })
  @ApiResponse({ status: 201, description: 'Budget created successfully' })
  async createBudget(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetService.createBudget(createBudgetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all budgets with optional filters' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by budget status' })
  @ApiQuery({ name: 'period', required: false, description: 'Filter by budget period' })
  async getBudgets(
    @Query('status') status?: string,
    @Query('period') period?: string,
  ) {
    return this.budgetService.getBudgets({ status, period });
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active budgets' })
  async getActiveBudgets() {
    return this.budgetService.getActiveBudgets();
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get budget alerts and warnings' })
  async getBudgetAlerts() {
    return this.budgetService.getBudgetAlerts();
  }

  @Get('utilization')
  @ApiOperation({ summary: 'Get budget utilization analysis' })
  async getBudgetUtilization() {
    return this.budgetService.getBudgetUtilization();
  }

  @Get('variance-report')
  @ApiOperation({ summary: 'Get budget variance report' })
  @ApiQuery({ name: 'year', required: true, description: 'Year for variance analysis' })
  @ApiQuery({ name: 'quarter', required: false, description: 'Quarter (1-4)' })
  async getBudgetVarianceReport(
    @Query('year') year: string,
    @Query('quarter') quarter?: string,
  ) {
    return this.budgetService.getBudgetVarianceReport(parseInt(year), quarter ? parseInt(quarter) : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get budget by ID' })
  @ApiParam({ name: 'id', description: 'Budget ID' })
  async getBudgetById(@Param('id') id: string) {
    return this.budgetService.getBudgetById(+id);
  }

  @Get(':id/spending')
  @ApiOperation({ summary: 'Get detailed budget spending analysis' })
  @ApiParam({ name: 'id', description: 'Budget ID' })
  async getBudgetSpending(@Param('id') id: string) {
    return this.budgetService.getBudgetSpending(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update budget by ID' })
  @ApiParam({ name: 'id', description: 'Budget ID' })
  async updateBudget(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetService.updateBudget(+id, updateBudgetDto);
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Activate a budget' })
  @ApiParam({ name: 'id', description: 'Budget ID' })
  async activateBudget(@Param('id') id: string) {
    return this.budgetService.activateBudget(+id);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a budget' })
  @ApiParam({ name: 'id', description: 'Budget ID' })
  async deactivateBudget(@Param('id') id: string) {
    return this.budgetService.deactivateBudget(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete budget by ID' })
  @ApiParam({ name: 'id', description: 'Budget ID' })
  async deleteBudget(@Param('id') id: string) {
    return this.budgetService.deleteBudget(+id);
  }
}