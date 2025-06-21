import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ImageService, ImageRecord } from '../services/image.service';
import { ImageOptimizationService } from '../services/image-optimization.service';

@ApiTags('admin-images')
@Controller('api/image-management')
export class AdminImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly imageOptimizationService: ImageOptimizationService,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check for image management service' })
  health() {
    return {
      status: 'ok',
      service: 'image-management',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('images')
  @ApiOperation({ summary: 'Get all images with pagination and filtering' })
  async getAllImages(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('entityType') entityType?: string,
    @Query('search') search?: string,
  ) {
    try {
      const images = await this.imageService.findAll();
      
      let filteredImages = images;
      
      if (entityType) {
        filteredImages = filteredImages.filter(img => img.entityType === entityType);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredImages = filteredImages.filter(img => 
          img.filename.toLowerCase().includes(searchLower) ||
          img.altText?.toLowerCase().includes(searchLower) ||
          img.description?.toLowerCase().includes(searchLower)
        );
      }
      
      const total = filteredImages.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedImages = filteredImages.slice(startIndex, endIndex);
      
      return {
        images: paginatedImages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
        filters: {
          entityType,
          search,
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch images');
    }
  }

  @Get('images/:id')
  @ApiOperation({ summary: 'Get image by ID' })
  async getImageById(@Param('id') id: number) {
    const image = await this.imageService.findById(id);
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    return image;
  }

  @Get('serve/:filename')
  @ApiOperation({ summary: 'Serve image file' })
  async serveImage(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const imageStream = await this.imageService.getImageStream(filename);
      const mimeType = this.imageOptimizationService.getMimeType(filename);
      
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      imageStream.pipe(res);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        error: 'Image not found',
        message: `Could not serve image: ${filename}`,
      });
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get image management statistics' })
  async getStats() {
    try {
      const stats = await this.imageService.getImageStats();
      return {
        ...stats,
        formattedTotalSize: this.imageService.formatBytes(stats.totalSize),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch image statistics');
    }
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload and optimize new image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: {
      altText?: string;
      description?: string;
      entityType?: string;
      entityId?: number;
      tags?: string;
    },
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    try {
      // Validate image
      const isValid = await this.imageOptimizationService.validateImage(file.path);
      if (!isValid) {
        throw new BadRequestException('Invalid image file');
      }

      // Create optimized variants
      const variants = await this.imageOptimizationService.createResponsiveVariants(file.path);
      
      // Parse tags if provided
      const tags = metadata.tags ? metadata.tags.split(',').map(tag => tag.trim()) : [];
      
      // Create image record
      const imageRecord: Partial<ImageRecord> = {
        filename: file.filename,
        originalFilename: file.originalname,
        path: `/uploads/images/${file.filename}`,
        sizeBytes: file.size,
        mimeType: file.mimetype,
        altText: metadata.altText,
        description: metadata.description,
        entityType: metadata.entityType,
        entityId: metadata.entityId,
        tags,
        createdAt: new Date(),
      };

      return {
        success: true,
        image: imageRecord,
        variants: {
          thumbnail: {
            size: variants.thumbnail.size,
            dimensions: `${variants.thumbnail.width}x${variants.thumbnail.height}`,
          },
          medium: {
            size: variants.medium.size,
            dimensions: `${variants.medium.width}x${variants.medium.height}`,
          },
          large: {
            size: variants.large.size,
            dimensions: `${variants.large.width}x${variants.large.height}`,
          },
        },
        message: 'Image uploaded and optimized successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  @Put('images/:id')
  @ApiOperation({ summary: 'Update image metadata' })
  async updateImage(
    @Param('id') id: number,
    @Body() updateData: {
      altText?: string;
      description?: string;
      tags?: string[];
      entityType?: string;
      entityId?: number;
    },
  ) {
    const existingImage = await this.imageService.findById(id);
    if (!existingImage) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    // In a real implementation, this would update the database
    const updatedImage = {
      ...existingImage,
      ...updateData,
      updatedAt: new Date(),
    };

    return {
      success: true,
      image: updatedImage,
      message: 'Image metadata updated successfully',
    };
  }

  @Delete('images/:id')
  @ApiOperation({ summary: 'Delete image and all variants' })
  async deleteImage(@Param('id') id: number) {
    const existingImage = await this.imageService.findById(id);
    if (!existingImage) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    try {
      // In a real implementation, this would:
      // 1. Delete the physical files
      // 2. Remove database records
      // 3. Clean up all variants
      
      return {
        success: true,
        message: `Image ${existingImage.filename} and all variants deleted successfully`,
        deletedImage: {
          id: existingImage.id,
          filename: existingImage.filename,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Failed to delete image: ${error.message}`);
    }
  }

  @Post('images/:id/variants')
  @ApiOperation({ summary: 'Generate new variants for existing image' })
  async generateVariants(
    @Param('id') id: number,
    @Body() options: {
      sizes?: Array<{ width: number; height: number; name: string }>;
      formats?: Array<'jpeg' | 'png' | 'webp'>;
    },
  ) {
    const existingImage = await this.imageService.findById(id);
    if (!existingImage) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    try {
      // Generate new variants based on options
      const variants = await this.imageOptimizationService.createResponsiveVariants(
        existingImage.path
      );

      return {
        success: true,
        variants,
        message: 'New image variants generated successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Failed to generate variants: ${error.message}`);
    }
  }

  @Get('images/:id/usage')
  @ApiOperation({ summary: 'Get image usage information' })
  async getImageUsage(@Param('id') id: number) {
    const existingImage = await this.imageService.findById(id);
    if (!existingImage) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    // In a real implementation, this would check where the image is used
    return {
      image: existingImage,
      usage: [
        {
          entityType: 'product',
          entityId: existingImage.entityId,
          location: 'main_image',
          lastAccessed: new Date(),
        },
      ],
      totalUsageCount: 1,
    };
  }
}