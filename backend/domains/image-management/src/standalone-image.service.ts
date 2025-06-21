import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';

@Injectable()
export class StandaloneImageService {
  private readonly logger = new Logger(StandaloneImageService.name);
  private readonly imagesData: any[] = [];
  private idCounter = 1;

  async uploadImage(file: any, uploadData: any = {}) {
    this.logger.log(`Processing upload: ${file?.originalname || 'unknown'}`);

    try {
      const imageId = this.idCounter++;
      const timestamp = new Date().toISOString();
      const filename = `image-${imageId}-${Date.now()}.jpg`;
      
      const imageRecord = {
        id: imageId,
        filename,
        originalName: file?.originalname || 'uploaded-image.jpg',
        mimeType: file?.mimetype || 'image/jpeg',
        size: file?.size || 1024,
        width: 800,
        height: 600,
        uploadedAt: timestamp,
        category: uploadData.category || 'general',
        alt: uploadData.altText || '',
        title: uploadData.title || '',
        entityType: uploadData.entityType || 'image',
        entityId: uploadData.entityId || null,
        url: `/images/serve/${filename}`,
        thumbnailUrl: `/images/serve/${filename}?variant=thumbnail`
      };

      this.imagesData.push(imageRecord);
      
      return {
        success: true,
        id: imageId,
        filename,
        url: imageRecord.url,
        thumbnailUrl: imageRecord.thumbnailUrl,
        message: 'Image uploaded successfully'
      };
    } catch (error) {
      this.logger.error('Upload error:', error);
      throw new BadRequestException('Failed to upload image');
    }
  }

  async getImages(query: any = {}) {
    const { page = 1, limit = 10, category, entityType } = query;
    
    let filteredImages = [...this.imagesData];
    
    if (category) {
      filteredImages = filteredImages.filter(img => img.category === category);
    }
    
    if (entityType) {
      filteredImages = filteredImages.filter(img => img.entityType === entityType);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedImages = filteredImages.slice(startIndex, endIndex);

    return {
      images: paginatedImages,
      total: filteredImages.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredImages.length / limit)
    };
  }

  async getImageById(id: number) {
    const image = this.imagesData.find(img => img.id === id);
    
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    
    return image;
  }

  async getImagesByEntity(entityType: string, entityId: number) {
    const images = this.imagesData.filter(img => 
      img.entityType === entityType && img.entityId === entityId
    );
    
    return {
      images,
      total: images.length,
      entityType,
      entityId
    };
  }

  async serveImage(filename: string, variant?: string) {
    this.logger.log(`Serving image: ${filename}${variant ? ` (${variant})` : ''}`);
    
    // In a real implementation, this would return the actual file path
    // For now, we'll simulate a successful file serving
    const mockFilePath = path.join(__dirname, '../storage/images/original', filename);
    
    // Create a simple placeholder response
    return {
      filename,
      variant: variant || 'original',
      mimeType: 'image/jpeg',
      served: true,
      timestamp: new Date().toISOString()
    };
  }

  async updateImage(id: number, updateData: any) {
    const imageIndex = this.imagesData.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    
    this.imagesData[imageIndex] = {
      ...this.imagesData[imageIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return this.imagesData[imageIndex];
  }

  async deleteImage(id: number) {
    const imageIndex = this.imagesData.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    
    const deletedImage = this.imagesData.splice(imageIndex, 1)[0];
    
    return {
      success: true,
      message: `Image ${deletedImage.filename} deleted successfully`,
      deletedImage
    };
  }

  async bulkDelete(ids: number[]) {
    const deletedImages = [];
    const notFoundIds = [];
    
    for (const id of ids) {
      const imageIndex = this.imagesData.findIndex(img => img.id === id);
      
      if (imageIndex !== -1) {
        deletedImages.push(this.imagesData.splice(imageIndex, 1)[0]);
      } else {
        notFoundIds.push(id);
      }
    }
    
    return {
      success: true,
      deleted: deletedImages.length,
      notFound: notFoundIds.length,
      deletedImages,
      notFoundIds
    };
  }

  async getImageStats() {
    const totalImages = this.imagesData.length;
    const totalSize = this.imagesData.reduce((sum, img) => sum + (img.size || 0), 0);
    
    const categoryCounts = this.imagesData.reduce((acc, img) => {
      acc[img.category] = (acc[img.category] || 0) + 1;
      return acc;
    }, {});
    
    const entityTypeCounts = this.imagesData.reduce((acc, img) => {
      acc[img.entityType] = (acc[img.entityType] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalImages,
      totalSize,
      averageSize: totalImages > 0 ? Math.round(totalSize / totalImages) : 0,
      categoryCounts,
      entityTypeCounts,
      serviceStatus: 'operational',
      lastUpdated: new Date().toISOString()
    };
  }
}