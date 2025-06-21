import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { LabelService } from '../services/label.service';
import { CreateLabelDto, LabelType } from '../dto/create-label.dto';

@ApiTags('labels')
// Bearer auth disabled
// Auth disabled for development
@Controller('labels')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new label' })
  @ApiResponse({ status: 201, description: 'Label created successfully' })
  async createLabel(@Body() createLabelDto: CreateLabelDto) {
    return this.labelService.createLabel(createLabelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all labels' })
  @ApiResponse({ status: 200, description: 'List of labels' })
  @ApiQuery({ name: 'type', enum: LabelType, required: false })
  @ApiQuery({ name: 'productId', type: Number, required: false })
  async getLabels(
    @Query('type') type?: LabelType,
    @Query('productId') productId?: number,
  ) {
    return this.labelService.getLabels({ type, productId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get label by ID' })
  @ApiResponse({ status: 200, description: 'Label details' })
  async getLabelById(@Param('id') id: number) {
    return this.labelService.getLabelById(id);
  }

  @Get(':id/preview')
  @ApiOperation({ summary: 'Generate label preview' })
  @ApiResponse({ status: 200, description: 'Label preview URL' })
  async generatePreview(@Param('id') id: number) {
    return this.labelService.generatePreview(id);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get label statistics' })
  @ApiResponse({ status: 200, description: 'Label statistics' })
  async getLabelStats() {
    return this.labelService.getLabelStats();
  }
}