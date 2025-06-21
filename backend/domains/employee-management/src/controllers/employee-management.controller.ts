import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeeManagementService } from '../services/employee-management.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dto/employee-management.dto';

@ApiTags('employee-management')
@Controller('employee-management')
export class EmployeeManagementController {
  constructor(private readonly employeeManagementService: EmployeeManagementService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  async getHealth() {
    return this.employeeManagementService.getHealthStatus();
  }

  @Post('employees')
  @ApiOperation({ summary: 'Create new employee' })
  @ApiResponse({ status: 201, description: 'Employee created successfully' })
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeManagementService.createEmployee(createEmployeeDto);
  }

  @Get('employees')
  @ApiOperation({ summary: 'Get all employees' })
  async getAllEmployees(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('department') department?: string,
    @Query('status') status?: string
  ) {
    return this.employeeManagementService.findAllEmployees(
      page ? +page : 1,
      limit ? +limit : 10
    );
  }

  @Get('employees/:id')
  @ApiOperation({ summary: 'Get employee by ID' })
  async getEmployeeById(@Param('id') id: string) {
    return this.employeeManagementService.findEmployeeById(+id);
  }

  @Put('employees/:id')
  @ApiOperation({ summary: 'Update employee' })
  async updateEmployee(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeManagementService.updateEmployee(+id, updateEmployeeDto);
  }

  @Delete('employees/:id')
  @ApiOperation({ summary: 'Delete employee' })
  async deleteEmployee(@Param('id') id: string) {
    return this.employeeManagementService.deleteEmployee(+id);
  }

  @Get('departments')
  @ApiOperation({ summary: 'Get all departments' })
  async getDepartments() {
    return this.employeeManagementService.findAllDepartments();
  }

  @Get('employees/:id/performance')
  @ApiOperation({ summary: 'Get employee performance metrics' })
  async getEmployeePerformance(@Param('id') id: string) {
    return this.employeeManagementService.getEmployeePerformance(+id);
  }
}