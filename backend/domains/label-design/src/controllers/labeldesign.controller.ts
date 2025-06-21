import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LabeldesignService } from '../services/labeldesign.service';

@ApiTags('label-design')
@Controller('label-design')
export class LabeldesignController {
  constructor(private readonly labeldesignService: LabeldesignService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async getHealth() {
    return this.labeldesignService.getHealth();
  }

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'Items retrieved successfully' })
  async getAll() {
    return this.labeldesignService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully' })
  async getById(@Param('id') id: string) {
    return this.labeldesignService.getById(parseInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create new item' })
  @ApiResponse({ status: 201, description: 'Item created successfully' })
  async create(@Body() data: any) {
    return this.labeldesignService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update item' })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.labeldesignService.update(parseInt(id), data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete item' })
  @ApiResponse({ status: 200, description: 'Item deleted successfully' })
  async delete(@Param('id') id: string) {
    return this.labeldesignService.delete(parseInt(id));
  }
}