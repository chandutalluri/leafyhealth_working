import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportingManagementService } from '../services/reporting-management.service';

@ApiTags('reporting-management')
@Controller('reporting-management')
export class ReportingManagementController {
  constructor(private readonly reportingManagementService: ReportingManagementService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return this.reportingManagementService.getHealth();
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  async findAll(@Query() query: any) {
    return this.reportingManagementService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create new report' })
  async create(@Body() body: any) {
    return this.reportingManagementService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific report' })
  async findOne(@Param('id') id: string) {
    return this.reportingManagementService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update report' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.reportingManagementService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete report' })
  async remove(@Param('id') id: string) {
    return this.reportingManagementService.remove(id);
  }

}