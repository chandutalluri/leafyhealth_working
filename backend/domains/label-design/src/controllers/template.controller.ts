import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { TemplateService } from '../services/template.service';
import { CreateTemplateDto, TemplateCategory } from '../dto/create-template.dto';
import { LabelType } from '../dto/create-label.dto';

@ApiTags('templates')
// Bearer auth disabled
// Auth disabled for development
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  async createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templateService.createTemplate(createTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all templates' })
  @ApiResponse({ status: 200, description: 'List of templates' })
  @ApiQuery({ name: 'category', enum: TemplateCategory, required: false })
  @ApiQuery({ name: 'labelType', enum: LabelType, required: false })
  async getTemplates(
    @Query('category') category?: TemplateCategory,
    @Query('labelType') labelType?: LabelType,
  ) {
    return this.templateService.getTemplates({ category, labelType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  @ApiResponse({ status: 200, description: 'Template details' })
  async getTemplateById(@Param('id') id: number) {
    return this.templateService.getTemplateById(id);
  }

  @Get(':id/preview')
  @ApiOperation({ summary: 'Generate template preview' })
  @ApiResponse({ status: 200, description: 'Template preview URL' })
  async generatePreview(@Param('id') id: number) {
    return this.templateService.generatePreview(id);
  }

  @Get('stats/usage')
  @ApiOperation({ summary: 'Get template usage statistics' })
  @ApiResponse({ status: 200, description: 'Template usage stats' })
  async getTemplateStats() {
    return this.templateService.getTemplateStats();
  }
}