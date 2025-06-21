import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { db, images, ImageRecord, NewImageRecord } from './database/drizzle';
import { eq, and, desc, count, sql, ilike, gte, isNotNull } from 'drizzle-orm';

export interface ImageVariant {
  type: string;
  filename: string;
  width: number;
  height: number;
  size: number;
  quality: number;
}

@Injectable()
export class ImageManagementService {
  private readonly logger = new Logger(ImageManagementService.name);
  private readonly uploadPath = process.env.UPLOAD_DIR || 'uploads/images';
  private readonly variantPath = process.env.VARIANT_DIR || 'uploads/variants';
  private readonly tempPath = process.env.TEMP_DIR || 'uploads/temp';
  
  private readonly variants = [
    { name: 'thumbnail', width: 200, height: 200 },
    { name: 'small', width: 400, height: 400 },
    { name: 'medium', width: 800, height: 600 },
    { name: 'large', width: 1200, height: 900 }
  ];

  constructor(private configService: ConfigService) {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dirs = [this.uploadPath, this.variantPath, this.tempPath];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.logger.log(`Created directory: ${dir}`);
      }
    });
  }

  private async generateImageVariants(originalPath: string, filename: string): Promise<string[]> {
    const generatedVariants: string[] = [];
    
    try {
      const image = sharp(originalPath);
      
      for (const variant of this.variants) {
        const variantFilename = `${variant.name}-${filename}`;
        const variantPath = path.join(this.variantPath, variantFilename);
        
        await image
          .resize({
            width: variant.width,
            height: variant.height,
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 85 })
          .toFile(variantPath);
          
        generatedVariants.push(variantFilename);
        this.logger.log(`Generated variant: ${variantFilename}`);
      }
      
      return generatedVariants;
    } catch (error) {
      this.logger.error(`Error generating variants for ${filename}:`, error);
      return [];
    }
  }

  async uploadImage(file: any, uploadDto: any): Promise<any> {
    try {
      this.logger.log(`Processing upload: ${file.originalname}`);

      if (!this.isImageFile(file.originalname)) {
        throw new BadRequestException('Invalid image file type');
      }

      const fileExt = path.extname(file.originalname);
      const uniqueFilename = `${uuidv4()}${fileExt}`;
      const filePath = path.join(this.uploadPath, uniqueFilename);

      fs.writeFileSync(filePath, file.buffer);

      const image = sharp(file.buffer);
      const metadata = await image.metadata();

      const variants = await this.generateImageVariants(filePath, uniqueFilename);

      const imageRecord: NewImageRecord = {
        filename: uniqueFilename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        width: metadata.width || 0,
        height: metadata.height || 0,
        path: filePath,
        entityType: uploadDto.entityType,
        entityId: uploadDto.entityId ? parseInt(uploadDto.entityId) : null,
        category: uploadDto.category,
        description: uploadDto.description,
        tags: uploadDto.tags,
        isPublic: uploadDto.isPublic !== 'false',
        variants: variants,
        updatedAt: new Date()
      };

      const [savedImage] = await db.insert(images).values(imageRecord).returning();

      this.logger.log(`Image uploaded successfully: ${savedImage.id}`);

      return {
        success: true,
        image: savedImage,
        message: 'Image uploaded and processed successfully',
        variants: variants.length,
        serveUrl: `/api/image-management/serve/${uniqueFilename}`
      };

    } catch (error) {
      this.logger.error('Upload error:', error);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  async getImages(query: any): Promise<any> {
    try {
      const {
        page = 1,
        limit = 50,
        category,
        entityType,
        entityId,
        isPublic,
        search,
        sortBy = 'uploadedAt',
        sortOrder = 'desc'
      } = query;

      const offset = (page - 1) * limit;
      const conditions = [];

      if (category) {
        conditions.push(eq(images.category, category));
      }
      if (entityType) {
        conditions.push(eq(images.entityType, entityType));
      }
      if (entityId) {
        conditions.push(eq(images.entityId, parseInt(entityId)));
      }
      if (isPublic !== undefined) {
        conditions.push(eq(images.isPublic, isPublic === 'true'));
      }
      if (search) {
        conditions.push(ilike(images.originalName, `%${search}%`));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [imageList, [{ count: totalCount }]] = await Promise.all([
        db.select()
          .from(images)
          .where(whereClause)
          .orderBy(sortOrder === 'desc' ? desc(images[sortBy]) : images[sortBy])
          .limit(limit)
          .offset(offset),
        db.select({ count: count() })
          .from(images)
          .where(whereClause)
      ]);

      return {
        images: imageList,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      };

    } catch (error) {
      this.logger.error('Error fetching images:', error);
      throw new BadRequestException('Failed to fetch images');
    }
  }

  async getImageStats(): Promise<any> {
    try {
      const [
        [{ total }],
        [{ totalSize }],
        categories,
        entityTypes,
        recent
      ] = await Promise.all([
        db.select({ total: count() }).from(images),
        db.select({ totalSize: sql<number>`sum(${images.size})` }).from(images),
        db.select({
          category: images.category,
          count: count()
        })
          .from(images)
          .where(isNotNull(images.category))
          .groupBy(images.category),
        db.select({
          entityType: images.entityType,
          count: count()
        })
          .from(images)
          .where(isNotNull(images.entityType))
          .groupBy(images.entityType),
        db.select()
          .from(images)
          .orderBy(desc(images.uploadedAt))
          .limit(5)
      ]);

      return {
        total,
        totalSize: totalSize || 0,
        categories: categories.map(c => ({
          name: c.category,
          count: c.count
        })),
        entityTypes: entityTypes.map(e => ({
          name: e.entityType,
          count: e.count
        })),
        recent: recent.map(img => ({
          id: img.id,
          filename: img.filename,
          originalName: img.originalName,
          uploadedAt: img.uploadedAt
        }))
      };

    } catch (error) {
      this.logger.error('Error fetching image stats:', error);
      throw new BadRequestException('Failed to fetch image statistics');
    }
  }

  async getImageAnalytics(query: any): Promise<any> {
    try {
      const { period = '7d', entityType, category } = query;
      
      const days = period === '30d' ? 30 : 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const conditions = [gte(images.uploadedAt, startDate)];
      
      if (entityType) {
        conditions.push(eq(images.entityType, entityType));
      }
      if (category) {
        conditions.push(eq(images.category, category));
      }

      const analytics = await db.select({
        date: sql<string>`date(${images.uploadedAt})`,
        count: count(),
        totalSize: sql<number>`sum(${images.size})`
      })
        .from(images)
        .where(and(...conditions))
        .groupBy(sql`date(${images.uploadedAt})`)
        .orderBy(sql`date(${images.uploadedAt})`);

      return {
        period,
        analytics: analytics.map(a => ({
          date: a.date,
          uploads: a.count,
          totalSize: a.totalSize || 0
        }))
      };

    } catch (error) {
      this.logger.error('Error fetching analytics:', error);
      throw new BadRequestException('Failed to fetch analytics');
    }
  }

  async getImagesByEntity(entityType: string, entityId: number, query: any): Promise<any> {
    try {
      const { category, isPublic, limit = 50 } = query;
      
      const conditions = [
        eq(images.entityType, entityType),
        eq(images.entityId, entityId)
      ];

      if (category) {
        conditions.push(eq(images.category, category));
      }
      if (isPublic !== undefined) {
        conditions.push(eq(images.isPublic, isPublic === 'true'));
      }

      const entityImages = await db.select()
        .from(images)
        .where(and(...conditions))
        .orderBy(desc(images.uploadedAt))
        .limit(limit);

      return {
        entityType,
        entityId,
        images: entityImages
      };

    } catch (error) {
      this.logger.error('Error fetching entity images:', error);
      throw new BadRequestException('Failed to fetch entity images');
    }
  }

  async serveImage(filename: string, options: any = {}): Promise<any> {
    try {
      const { variant, quality, format } = options;
      
      let imagePath: string;
      
      if (variant && variant !== 'original') {
        const variantFilename = `${variant}-${filename}`;
        imagePath = path.join(this.variantPath, variantFilename);
        
        if (!fs.existsSync(imagePath)) {
          const originalPath = path.join(this.uploadPath, filename);
          if (fs.existsSync(originalPath)) {
            await this.generateImageVariants(originalPath, filename);
          }
        }
      } else {
        imagePath = path.join(this.uploadPath, filename);
      }

      if (!fs.existsSync(imagePath)) {
        throw new NotFoundException('Image not found');
      }

      const stats = fs.statSync(imagePath);
      const fileBuffer = fs.readFileSync(imagePath);
      
      let processedBuffer = fileBuffer;
      let mimeType = this.getMimeType(filename);

      if (quality || format) {
        const image = sharp(fileBuffer);
        
        if (quality) {
          image.jpeg({ quality: parseInt(quality) });
        }
        
        if (format === 'webp') {
          image.webp();
          mimeType = 'image/webp';
        } else if (format === 'png') {
          image.png();
          mimeType = 'image/png';
        }
        
        processedBuffer = await image.toBuffer();
      }

      return {
        buffer: processedBuffer,
        mimeType,
        size: processedBuffer.length,
        etag: `"${stats.mtime.getTime()}"`,
        lastModified: stats.mtime.toUTCString()
      };

    } catch (error) {
      this.logger.error(`Error serving image ${filename}:`, error);
      throw new NotFoundException('Image not found or processing failed');
    }
  }

  async getImageVariants(filename: string): Promise<any> {
    try {
      const [image] = await db.select()
        .from(images)
        .where(eq(images.filename, filename))
        .limit(1);

      if (!image) {
        throw new NotFoundException('Image not found');
      }

      const variants = [];
      
      for (const variant of this.variants) {
        const variantFilename = `${variant.name}-${filename}`;
        const variantPath = path.join(this.variantPath, variantFilename);
        
        if (fs.existsSync(variantPath)) {
          const stats = fs.statSync(variantPath);
          variants.push({
            type: variant.name,
            filename: variantFilename,
            width: variant.width,
            height: variant.height,
            size: stats.size,
            url: `/api/image-management/serve/${filename}?variant=${variant.name}`
          });
        }
      }

      return {
        filename,
        original: {
          width: image.width,
          height: image.height,
          size: image.size,
          url: `/api/image-management/serve/${filename}`
        },
        variants
      };

    } catch (error) {
      this.logger.error(`Error getting variants for ${filename}:`, error);
      throw new NotFoundException('Image variants not found');
    }
  }

  async getImageById(id: number): Promise<ImageRecord> {
    try {
      const [image] = await db.select()
        .from(images)
        .where(eq(images.id, id))
        .limit(1);

      if (!image) {
        throw new NotFoundException('Image not found');
      }

      return image;

    } catch (error) {
      this.logger.error(`Error fetching image ${id}:`, error);
      throw new NotFoundException('Image not found');
    }
  }

  async updateImage(id: number, updateDto: any): Promise<ImageRecord> {
    try {
      const [updatedImage] = await db.update(images)
        .set({
          ...updateDto,
          updatedAt: new Date()
        })
        .where(eq(images.id, id))
        .returning();

      if (!updatedImage) {
        throw new NotFoundException('Image not found');
      }

      return updatedImage;

    } catch (error) {
      this.logger.error(`Error updating image ${id}:`, error);
      throw new BadRequestException('Failed to update image');
    }
  }

  async deleteImage(id: number): Promise<any> {
    try {
      const [image] = await db.select()
        .from(images)
        .where(eq(images.id, id))
        .limit(1);

      if (!image) {
        throw new NotFoundException('Image not found');
      }

      const originalPath = path.join(this.uploadPath, image.filename);
      if (fs.existsSync(originalPath)) {
        fs.unlinkSync(originalPath);
      }

      if (image.variants) {
        for (const variant of image.variants) {
          const variantPath = path.join(this.variantPath, variant);
          if (fs.existsSync(variantPath)) {
            fs.unlinkSync(variantPath);
          }
        }
      }

      await db.delete(images).where(eq(images.id, id));

      return {
        success: true,
        message: 'Image deleted successfully',
        deletedId: id
      };

    } catch (error) {
      this.logger.error(`Error deleting image ${id}:`, error);
      throw new BadRequestException('Failed to delete image');
    }
  }

  async bulkDelete(ids: number[]): Promise<any> {
    try {
      const results = [];
      
      for (const id of ids) {
        try {
          const result = await this.deleteImage(id);
          results.push({ id, success: true });
        } catch (error) {
          results.push({ id, success: false, error: error.message });
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      return {
        total: ids.length,
        successful,
        failed,
        results
      };

    } catch (error) {
      this.logger.error('Error in bulk delete:', error);
      throw new BadRequestException('Bulk delete failed');
    }
  }

  async reprocessImage(id: number): Promise<any> {
    try {
      const [image] = await db.select()
        .from(images)
        .where(eq(images.id, id))
        .limit(1);

      if (!image) {
        throw new NotFoundException('Image not found');
      }

      const originalPath = path.join(this.uploadPath, image.filename);
      if (!fs.existsSync(originalPath)) {
        throw new NotFoundException('Original image file not found');
      }

      const variants = await this.generateImageVariants(originalPath, image.filename);

      await db.update(images)
        .set({
          variants,
          updatedAt: new Date()
        })
        .where(eq(images.id, id));

      return {
        success: true,
        message: 'Image reprocessed successfully',
        variants: variants.length
      };

    } catch (error) {
      this.logger.error(`Error reprocessing image ${id}:`, error);
      throw new BadRequestException('Failed to reprocess image');
    }
  }

  async createBackup(includeFiles: boolean = false): Promise<any> {
    try {
      const allImages = await db.select().from(images);
      
      const backup = {
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        totalImages: allImages.length,
        metadata: allImages
      };

      const backupFilename = `image-backup-${Date.now()}.json`;
      const backupPath = path.join(this.tempPath, backupFilename);
      
      fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

      return {
        success: true,
        message: 'Backup created successfully',
        filename: backupFilename,
        path: backupPath,
        totalImages: allImages.length,
        includeFiles
      };

    } catch (error) {
      this.logger.error('Error creating backup:', error);
      throw new BadRequestException('Failed to create backup');
    }
  }

  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
    const ext = path.extname(filename).toLowerCase();
    return imageExtensions.includes(ext);
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp',
      '.tiff': 'image/tiff'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
}