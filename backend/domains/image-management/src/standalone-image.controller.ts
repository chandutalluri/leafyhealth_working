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
  Logger
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { StandaloneImageService } from './standalone-image.service';

@ApiTags('Image Management')
@Controller('images')
export class StandaloneImageController {
  private readonly logger = new Logger(StandaloneImageController.name);

  constructor(private readonly imageService: StandaloneImageService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async healthCheck() {
    return {
      status: 'healthy',
      service: 'Image Management Service',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      features: [
        'Image upload and processing',
        'Image variant generation',
        'Image serving and delivery',
        'Statistics and analytics',
        'CRUD operations'
      ]
    };
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload single image with automatic variant generation' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: any,
    @Body() uploadDto: any
  ) {
    this.logger.log(`Upload request: ${file?.originalname || 'no file'}`);
    return await this.imageService.uploadImage(file, uploadDto);
  }

  @Post('upload/multiple')
  @ApiOperation({ summary: 'Upload multiple images' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadMultipleImages(
    @UploadedFiles() files: any[],
    @Body() uploadDto: any
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
  @ApiOperation({ summary: 'Get images with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Images retrieved successfully' })
  async getImages(@Query() query: any) {
    return await this.imageService.getImages(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get image statistics' })
  @ApiResponse({ status: 200, description: 'Image statistics retrieved' })
  async getImageStats() {
    return await this.imageService.getImageStats();
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'Get images by entity' })
  @ApiResponse({ status: 200, description: 'Entity images retrieved' })
  async getImagesByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId', ParseIntPipe) entityId: number
  ) {
    return await this.imageService.getImagesByEntity(entityType, entityId);
  }

  @Get('serve/:filename')
  @ApiOperation({ summary: 'Serve image file' })
  @ApiResponse({ status: 200, description: 'Image file served' })
  async serveImage(
    @Param('filename') filename: string,
    @Query('variant') variant?: string,
    @Res({ passthrough: true }) res?: Response
  ) {
    try {
      const result = await this.imageService.serveImage(filename, variant);
      
      if (res) {
        res.set({
          'Content-Type': result.mimeType || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000',
          'ETag': `"${Date.now()}"`
        });
      }

      return result;
      
    } catch (error) {
      this.logger.error(`Error serving image ${filename}:`, error);
      throw error;
    }
  }

  @Get('variants/:filename')
  @ApiOperation({ summary: 'Serve image variant' })
  @ApiResponse({ status: 200, description: 'Image variant served' })
  async serveImageVariant(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res?: Response
  ) {
    return await this.serveImage(filename, 'variant', res);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get image by ID' })
  @ApiResponse({ status: 200, description: 'Image retrieved successfully' })
  async getImageById(@Param('id', ParseIntPipe) id: number) {
    return await this.imageService.getImageById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update image metadata' })
  @ApiResponse({ status: 200, description: 'Image updated successfully' })
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: any
  ) {
    return await this.imageService.updateImage(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete image and all variants' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    return await this.imageService.deleteImage(id);
  }

  @Delete('bulk')
  @ApiOperation({ summary: 'Delete multiple images' })
  @ApiResponse({ status: 200, description: 'Images deleted successfully' })
  async bulkDeleteImages(@Body('ids') ids: number[]) {
    return await this.imageService.bulkDelete(ids);
  }
}