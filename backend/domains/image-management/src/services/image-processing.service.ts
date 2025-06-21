import { Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';

export interface ImageVariantConfig {
  width: number;
  height?: number;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
  suffix: string;
}

export interface ProcessedImage {
  variant: string;
  path: string;
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
  quality: number;
}

@Injectable()
export class ImageProcessingService {
  private readonly logger = new Logger(ImageProcessingService.name);
  private readonly baseUrl = process.env.BASE_URL || 'http://localhost:3070';
  
  // Image variant configurations
  private readonly variants: Record<string, ImageVariantConfig> = {
    sm: { width: 320, quality: 80, format: 'jpeg', suffix: '_sm' },
    md: { width: 640, quality: 85, format: 'jpeg', suffix: '_md' },
    lg: { width: 1024, quality: 90, format: 'jpeg', suffix: '_lg' },
    xl: { width: 1920, quality: 95, format: 'jpeg', suffix: '_xl' },
    webp_sm: { width: 320, quality: 80, format: 'webp', suffix: '_sm' },
    webp_md: { width: 640, quality: 85, format: 'webp', suffix: '_md' },
    webp_lg: { width: 1024, quality: 90, format: 'webp', suffix: '_lg' },
    webp_xl: { width: 1920, quality: 95, format: 'webp', suffix: '_xl' }
  };

  async processImage(
    tempFilePath: string,
    originalName: string,
    options: {
      generateWebP?: boolean;
      generateThumbnails?: boolean;
      category?: string;
    } = {}
  ): Promise<{
    original: ProcessedImage;
    variants: ProcessedImage[];
    thumbnailUrl?: string;
  }> {
    const { generateWebP = true, generateThumbnails = true } = options;
    
    try {
      // Generate unique filename
      const fileHash = await this.generateFileHash(tempFilePath);
      const ext = path.extname(originalName).toLowerCase();
      const baseName = path.basename(originalName, ext);
      const uniqueFileName = `${fileHash}_${baseName}`;

      // Create storage directories
      const storageDir = path.join(process.cwd(), 'backend/domains/image-management/src/storage');
      const originalDir = path.join(storageDir, 'images/original');
      const variantsDir = path.join(storageDir, 'images/variants');

      await fs.mkdir(originalDir, { recursive: true });
      await fs.mkdir(variantsDir, { recursive: true });

      // Get original image metadata
      const imageInfo = await sharp(tempFilePath).metadata();
      
      // Process original image
      const originalPath = path.join(originalDir, `${uniqueFileName}${ext}`);
      await fs.copyFile(tempFilePath, originalPath);
      
      const originalStats = await fs.stat(originalPath);
      const original: ProcessedImage = {
        variant: 'original',
        path: originalPath,
        url: `${this.baseUrl}/images/serve/${uniqueFileName}${ext}`,
        width: imageInfo.width || 0,
        height: imageInfo.height || 0,
        size: originalStats.size,
        format: imageInfo.format || 'jpeg',
        quality: 100
      };

      // Generate variants
      const variants: ProcessedImage[] = [];
      const variantsToGenerate = generateWebP 
        ? Object.keys(this.variants)
        : Object.keys(this.variants).filter(key => !key.startsWith('webp_'));

      for (const variantKey of variantsToGenerate) {
        if (!generateThumbnails && variantKey.includes('sm')) continue;
        
        const config = this.variants[variantKey];
        const variantFileName = `${uniqueFileName}${config.suffix}.${config.format}`;
        const variantPath = path.join(variantsDir, variantFileName);

        const processedImage = await sharp(tempFilePath)
          .resize(config.width, config.height, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .toFormat(config.format, { quality: config.quality })
          .toFile(variantPath);

        const variantStats = await fs.stat(variantPath);
        variants.push({
          variant: variantKey,
          path: variantPath,
          url: `${this.baseUrl}/images/variants/${variantFileName}`,
          width: processedImage.width,
          height: processedImage.height,
          size: variantStats.size,
          format: config.format,
          quality: config.quality
        });
      }

      // Generate thumbnail URL (use smallest variant)
      const thumbnailVariant = variants.find(v => v.variant === 'sm' || v.variant === 'webp_sm');
      const thumbnailUrl = thumbnailVariant?.url;

      // Cleanup temp file
      await fs.unlink(tempFilePath).catch(() => {});

      this.logger.log(`Processed image: ${originalName} -> ${uniqueFileName} (${variants.length} variants)`);

      return {
        original,
        variants,
        thumbnailUrl
      };

    } catch (error) {
      this.logger.error(`Error processing image ${originalName}:`, error);
      // Cleanup temp file on error
      await fs.unlink(tempFilePath).catch(() => {});
      throw error;
    }
  }

  async deleteImage(imagePath: string, variants: any[] = []): Promise<void> {
    try {
      // Delete original
      await fs.unlink(imagePath).catch(() => {});
      
      // Delete variants
      for (const variant of variants) {
        if (variant.path) {
          await fs.unlink(variant.path).catch(() => {});
        }
      }
      
      this.logger.log(`Deleted image and variants: ${imagePath}`);
    } catch (error) {
      this.logger.error(`Error deleting image ${imagePath}:`, error);
    }
  }

  async getImageDimensions(filePath: string): Promise<{ width: number; height: number }> {
    try {
      const metadata = await sharp(filePath).metadata();
      return {
        width: metadata.width || 0,
        height: metadata.height || 0
      };
    } catch (error) {
      this.logger.error(`Error getting image dimensions:`, error);
      return { width: 0, height: 0 };
    }
  }

  private async generateFileHash(filePath: string): Promise<string> {
    const buffer = await fs.readFile(filePath);
    return crypto.createHash('md5').update(buffer).digest('hex').substring(0, 8);
  }

  async optimizeImage(filePath: string, options: {
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
    width?: number;
    height?: number;
  } = {}): Promise<string> {
    const {
      quality = 85,
      format = 'jpeg',
      width,
      height
    } = options;

    const outputPath = filePath.replace(path.extname(filePath), `_optimized.${format}`);
    
    let pipeline = sharp(filePath);
    
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    await pipeline
      .toFormat(format, { quality })
      .toFile(outputPath);
    
    return outputPath;
  }
}