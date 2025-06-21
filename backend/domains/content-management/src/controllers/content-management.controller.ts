import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContentManagementService } from '../services/content-management.service';
import { CreateContentDto, UpdateContentDto, CreateCategoryDto, UpdateCategoryDto } from '../dto/content-management.dto';

@ApiTags('content-management')
@Controller('content-management')
export class ContentManagementController {
  constructor(private readonly contentManagementService: ContentManagementService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  async getHealth() {
    return this.contentManagementService.getHealthStatus();
  }

  // Content endpoints
  @Post('content')
  @ApiOperation({ summary: 'Create new content' })
  @ApiResponse({ status: 201, description: 'Content created successfully' })
  async createContent(@Body() createContentDto: CreateContentDto) {
    return this.contentManagementService.createContent(createContentDto);
  }

  @Get('content')
  @ApiOperation({ summary: 'Get all content' })
  async getAllContent(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('status') status?: string
  ) {
    return this.contentManagementService.findAllContent(
      page ? +page : 1,
      limit ? +limit : 10,
      search,
      type,
      status
    );
  }

  @Get('content/:id')
  @ApiOperation({ summary: 'Get content by ID' })
  async getContentById(@Param('id') id: string) {
    return this.contentManagementService.findContentById(+id);
  }

  @Put('content/:id')
  @ApiOperation({ summary: 'Update content' })
  async updateContent(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentManagementService.updateContent(+id, updateContentDto);
  }

  @Delete('content/:id')
  @ApiOperation({ summary: 'Delete content' })
  async deleteContent(@Param('id') id: string) {
    return this.contentManagementService.deleteContent(+id);
  }

  // Category endpoints
  @Post('categories')
  @ApiOperation({ summary: 'Create new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.contentManagementService.createCategory(createCategoryDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  async getAllCategories() {
    return this.contentManagementService.findAllCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  async getCategoryById(@Param('id') id: string) {
    return this.contentManagementService.findCategoryById(+id);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: 'Update category' })
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.contentManagementService.updateCategory(+id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete category' })
  async deleteCategory(@Param('id') id: string) {
    return this.contentManagementService.deleteCategory(+id);
  }
}