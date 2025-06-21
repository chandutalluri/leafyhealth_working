import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete, 
  Param, 
  Query, 
  Body, 
  UploadedFile, 
  UploadedFiles,
  UseInterceptors, 
  ParseIntPipe,
  Res,
  Logger,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ImageManagementService } from './image-management.service';

@ApiTags('Image Management')
@Controller('api/image-management')
// Bearer auth disabled
export class ImageManagementController {
  private readonly logger = new Logger(ImageManagementController.name);

  constructor(private readonly imageService: ImageManagementService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async healthCheck() {
    return {
      status: 'healthy',
      service: 'Image Management Service',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      port: process.env.PORT || 3070,
      features: [
        'Image upload and processing',
        'Image variant generation',
        'Image serving and delivery',
        'Statistics and analytics',
        'CRUD operations',
        'Entity-based image management',
        'Bulk operations',
        'Advanced filtering'
      ]
    };
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload single image with automatic processing' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @UseInterceptors(FileInterceptor('file'))
  // Auth disabled for development
  async uploadImage(
    @UploadedFile() file: any,
    @Body() uploadDto: {
      entityType?: string;
      entityId?: number;
      category?: string;
      description?: string;
      tags?: string;
      isPublic?: boolean;
    }
  ) {
    this.logger.log(`Upload request: ${file?.originalname || 'no file'}`);
    
    if (!file) {
      return { error: 'No file provided' };
    }

    return await this.imageService.uploadImage(file, uploadDto);
  }

  @Post('upload/multiple')
  @ApiOperation({ summary: 'Upload multiple images with batch processing' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
  @UseInterceptors(FilesInterceptor('files', 10))
  // Auth disabled for development
  async uploadMultipleImages(
    @UploadedFiles() files: any[],
    @Body() uploadDto: {
      entityType?: string;
      entityId?: number;
      category?: string;
      description?: string;
      tags?: string;
      isPublic?: boolean;
    }
  ) {
    this.logger.log(`Multiple upload request: ${files?.length || 0} files`);
    
    if (!files || files.length === 0) {
      return { error: 'No files provided' };
    }

    const results = [];
    for (const file of files) {
      try {
        const result = await this.imageService.uploadImage(file, uploadDto);
        results.push(result);
      } catch (error) {
        this.logger.error(`Failed to upload ${file.originalname}:`, error);
        results.push({ 
          filename: file.originalname, 
          error: error.message 
        });
      }
    }

    return {
      total: files.length,
      successful: results.filter(r => !r.error).length,
      failed: results.filter(r => r.error).length,
      results
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get images with advanced filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Images retrieved successfully' })
  async getImages(@Query() query: {
    page?: number;
    limit?: number;
    category?: string;
    entityType?: string;
    entityId?: number;
    isPublic?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    return await this.imageService.getImages(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get comprehensive image statistics' })
  @ApiResponse({ status: 200, description: 'Image statistics retrieved' })
  async getImageStats() {
    return await this.imageService.getImageStats();
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get image analytics and insights' })
  @ApiResponse({ status: 200, description: 'Image analytics retrieved' })
  async getImageAnalytics(@Query() query: {
    period?: string;
    entityType?: string;
    category?: string;
  }) {
    return await this.imageService.getImageAnalytics(query);
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'Get images by entity with filtering' })
  @ApiResponse({ status: 200, description: 'Entity images retrieved' })
  async getImagesByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId', ParseIntPipe) entityId: number,
    @Query() query: {
      category?: string;
      isPublic?: boolean;
      limit?: number;
    }
  ) {
    return await this.imageService.getImagesByEntity(entityType, entityId, query);
  }

  @Get('serve/:filename')
  @ApiOperation({ summary: 'Serve optimized image file' })
  @ApiResponse({ status: 200, description: 'Image file served' })
  async serveImage(
    @Param('filename') filename: string,
    @Query('variant') variant?: string,
    @Query('quality') quality?: number,
    @Query('format') format?: string,
    @Res({ passthrough: true }) res?: Response
  ) {
    try {
      const result = await this.imageService.serveImage(filename, {
        variant,
        quality,
        format
      });
      
      if (res) {
        res.set({
          'Content-Type': result.mimeType || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000',
          'ETag': `"${result.etag}"`,
          'Last-Modified': result.lastModified,
          'Content-Length': result.size?.toString()
        });
      }

      return result;
      
    } catch (error) {
      this.logger.error(`Error serving image ${filename}:`, error);
      throw error;
    }
  }

  @Get('variants/:filename')
  @ApiOperation({ summary: 'Get available image variants' })
  @ApiResponse({ status: 200, description: 'Image variants listed' })
  async getImageVariants(@Param('filename') filename: string) {
    return await this.imageService.getImageVariants(filename);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get image details by ID' })
  @ApiResponse({ status: 200, description: 'Image retrieved successfully' })
  async getImageById(@Param('id', ParseIntPipe) id: number) {
    return await this.imageService.getImageById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update image metadata and properties' })
  @ApiResponse({ status: 200, description: 'Image updated successfully' })
  // Auth disabled for development
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: {
      description?: string;
      category?: string;
      tags?: string;
      isPublic?: boolean;
      entityType?: string;
      entityId?: number;
    }
  ) {
    return await this.imageService.updateImage(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete image and all variants' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  // Auth disabled for development
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    return await this.imageService.deleteImage(id);
  }

  @Delete('bulk')
  @ApiOperation({ summary: 'Bulk delete multiple images' })
  @ApiResponse({ status: 200, description: 'Images deleted successfully' })
  // Auth disabled for development
  async bulkDeleteImages(@Body('ids') ids: number[]) {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return { error: 'Invalid or empty IDs array' };
    }

    return await this.imageService.bulkDelete(ids);
  }

  @Post('process/:id')
  @ApiOperation({ summary: 'Reprocess image variants' })
  @ApiResponse({ status: 200, description: 'Image reprocessed successfully' })
  // Auth disabled for development
  async reprocessImage(@Param('id', ParseIntPipe) id: number) {
    return await this.imageService.reprocessImage(id);
  }

  @Get('backup/create')
  @ApiOperation({ summary: 'Create backup of image data' })
  @ApiResponse({ status: 200, description: 'Backup created successfully' })
  // Auth disabled for development
  async createBackup(@Query('includeFiles') includeFiles?: boolean) {
    return await this.imageService.createBackup(includeFiles);
  }
}