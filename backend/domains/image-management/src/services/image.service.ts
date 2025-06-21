import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { createReadStream } from 'fs';

export interface ImageRecord {
  id: number;
  filename: string;
  originalFilename: string;
  path: string;
  sizeBytes: number;
  mimeType: string;
  width?: number;
  height?: number;
  altText?: string;
  description?: string;
  tags?: string[];
  entityType?: string;
  entityId?: number;
  uploadedBy?: number;
  createdAt: Date;
  updatedAt?: Date;
}

@Injectable()
export class ImageService {
  private readonly uploadsPath = join(process.cwd(), 'uploads', 'images');

  async findAll(): Promise<ImageRecord[]> {
    // In a real application, this would query the database
    // For now, return mock data that matches our database structure
    return [
      {
        id: 1,
        filename: 'organic-spinach-1.jpg',
        originalFilename: 'organic-spinach-1.jpg',
        path: '/uploads/images/products/organic-spinach-1.jpg',
        sizeBytes: 45620,
        mimeType: 'image/jpeg',
        width: 800,
        height: 600,
        altText: 'Fresh Organic Spinach Leaves',
        description: 'Premium organic baby spinach with vibrant green leaves',
        tags: ['organic', 'spinach', 'leafy-greens'],
        entityType: 'product',
        entityId: 1,
        uploadedBy: 1,
        createdAt: new Date(),
      },
      {
        id: 2,
        filename: 'red-bell-peppers-2.jpg',
        originalFilename: 'red-bell-peppers-2.jpg',
        path: '/uploads/images/products/red-bell-peppers-2.jpg',
        sizeBytes: 52340,
        mimeType: 'image/jpeg',
        width: 800,
        height: 600,
        altText: 'Sweet Red Bell Peppers',
        description: 'Crisp red bell peppers perfect for cooking',
        tags: ['peppers', 'vegetables', 'red'],
        entityType: 'product',
        entityId: 2,
        uploadedBy: 1,
        createdAt: new Date(),
      },
    ];
  }

  async findById(id: number): Promise<ImageRecord | null> {
    const images = await this.findAll();
    return images.find(img => img.id === id) || null;
  }

  async findByFilename(filename: string): Promise<ImageRecord | null> {
    const images = await this.findAll();
    return images.find(img => img.filename === filename) || null;
  }

  async getImageStream(filename: string) {
    const imagePath = join(this.uploadsPath, 'products', filename);
    
    try {
      await fs.access(imagePath);
      return createReadStream(imagePath);
    } catch (error) {
      // Return a placeholder SVG if image not found
      const placeholderPath = join(this.uploadsPath, 'products', 'thumbnails', 'placeholder.svg');
      return createReadStream(placeholderPath);
    }
  }

  async getImageStats() {
    const images = await this.findAll();
    
    return {
      total: images.length,
      totalSize: images.reduce((sum, img) => sum + img.sizeBytes, 0),
      byCategory: this.getCategoryBreakdown(images),
      byEntityType: this.getEntityTypeBreakdown(images),
      recent: images.slice(-5),
    };
  }

  private getCategoryBreakdown(images: ImageRecord[]) {
    const categories = {};
    images.forEach(img => {
      if (img.tags) {
        img.tags.forEach(tag => {
          categories[tag] = (categories[tag] || 0) + 1;
        });
      }
    });
    return categories;
  }

  private getEntityTypeBreakdown(images: ImageRecord[]) {
    const entityTypes = {};
    images.forEach(img => {
      if (img.entityType) {
        entityTypes[img.entityType] = (entityTypes[img.entityType] || 0) + 1;
      }
    });
    return entityTypes;
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}