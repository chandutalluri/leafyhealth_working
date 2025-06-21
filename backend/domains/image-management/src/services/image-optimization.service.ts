import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface OptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface OptimizedImage {
  buffer: Buffer;
  format: string;
  width: number;
  height: number;
  size: number;
}

@Injectable()
export class ImageOptimizationService {
  private readonly uploadsPath = join(process.cwd(), 'uploads', 'images');

  async optimizeImage(
    inputPath: string,
    options: OptimizationOptions = {}
  ): Promise<OptimizedImage> {
    // For now, return a mock optimization result
    // In a real implementation, you would use Sharp or similar
    const mockBuffer = Buffer.from('optimized-image-data');
    
    return {
      buffer: mockBuffer,
      format: options.format || 'jpeg',
      width: options.width || 800,
      height: options.height || 600,
      size: mockBuffer.length,
    };
  }

  async createThumbnail(
    inputPath: string,
    size: number = 150
  ): Promise<OptimizedImage> {
    return this.optimizeImage(inputPath, {
      width: size,
      height: size,
      quality: 80,
      format: 'jpeg',
    });
  }

  async createResponsiveVariants(inputPath: string): Promise<{
    thumbnail: OptimizedImage;
    medium: OptimizedImage;
    large: OptimizedImage;
  }> {
    const [thumbnail, medium, large] = await Promise.all([
      this.createThumbnail(inputPath, 150),
      this.optimizeImage(inputPath, { width: 400, height: 300 }),
      this.optimizeImage(inputPath, { width: 800, height: 600 }),
    ]);

    return { thumbnail, medium, large };
  }

  async validateImage(filePath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(filePath);
      return stats.isFile() && stats.size > 0;
    } catch {
      return false;
    }
  }

  getMimeType(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}