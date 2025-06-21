"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ImageManagementService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageManagementService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = require("fs");
const path = require("path");
const sharp_1 = require("sharp");
const uuid_1 = require("uuid");
const drizzle_1 = require("./database/drizzle");
const drizzle_orm_1 = require("drizzle-orm");
let ImageManagementService = ImageManagementService_1 = class ImageManagementService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(ImageManagementService_1.name);
        this.uploadPath = process.env.UPLOAD_DIR || 'uploads/images';
        this.variantPath = process.env.VARIANT_DIR || 'uploads/variants';
        this.tempPath = process.env.TEMP_DIR || 'uploads/temp';
        this.variants = [
            { name: 'thumbnail', width: 200, height: 200 },
            { name: 'small', width: 400, height: 400 },
            { name: 'medium', width: 800, height: 600 },
            { name: 'large', width: 1200, height: 900 }
        ];
        this.ensureDirectories();
    }
    ensureDirectories() {
        const dirs = [this.uploadPath, this.variantPath, this.tempPath];
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                this.logger.log(`Created directory: ${dir}`);
            }
        });
    }
    async generateImageVariants(originalPath, filename) {
        const generatedVariants = [];
        try {
            const image = (0, sharp_1.default)(originalPath);
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
        }
        catch (error) {
            this.logger.error(`Error generating variants for ${filename}:`, error);
            return [];
        }
    }
    async uploadImage(file, uploadDto) {
        try {
            this.logger.log(`Processing upload: ${file.originalname}`);
            if (!this.isImageFile(file.originalname)) {
                throw new common_1.BadRequestException('Invalid image file type');
            }
            const fileExt = path.extname(file.originalname);
            const uniqueFilename = `${(0, uuid_1.v4)()}${fileExt}`;
            const filePath = path.join(this.uploadPath, uniqueFilename);
            fs.writeFileSync(filePath, file.buffer);
            const image = (0, sharp_1.default)(file.buffer);
            const metadata = await image.metadata();
            const variants = await this.generateImageVariants(filePath, uniqueFilename);
            const imageRecord = {
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
            const [savedImage] = await drizzle_1.db.insert(drizzle_1.images).values(imageRecord).returning();
            this.logger.log(`Image uploaded successfully: ${savedImage.id}`);
            return {
                success: true,
                image: savedImage,
                message: 'Image uploaded and processed successfully',
                variants: variants.length,
                serveUrl: `/api/image-management/serve/${uniqueFilename}`
            };
        }
        catch (error) {
            this.logger.error('Upload error:', error);
            throw new common_1.BadRequestException(`Upload failed: ${error.message}`);
        }
    }
    async getImages(query) {
        try {
            const { page = 1, limit = 50, category, entityType, entityId, isPublic, search, sortBy = 'uploadedAt', sortOrder = 'desc' } = query;
            const offset = (page - 1) * limit;
            const conditions = [];
            if (category) {
                conditions.push((0, drizzle_orm_1.eq)(drizzle_1.images.category, category));
            }
            if (entityType) {
                conditions.push((0, drizzle_orm_1.eq)(drizzle_1.images.entityType, entityType));
            }
            if (entityId) {
                conditions.push((0, drizzle_orm_1.eq)(drizzle_1.images.entityId, parseInt(entityId)));
            }
            if (isPublic !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(drizzle_1.images.isPublic, isPublic === 'true'));
            }
            if (search) {
                conditions.push((0, drizzle_orm_1.ilike)(drizzle_1.images.originalName, `%${search}%`));
            }
            const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
            const [imageList, [{ count: totalCount }]] = await Promise.all([
                drizzle_1.db.select()
                    .from(drizzle_1.images)
                    .where(whereClause)
                    .orderBy(sortOrder === 'desc' ? (0, drizzle_orm_1.desc)(drizzle_1.images[sortBy]) : drizzle_1.images[sortBy])
                    .limit(limit)
                    .offset(offset),
                drizzle_1.db.select({ count: (0, drizzle_orm_1.count)() })
                    .from(drizzle_1.images)
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
        }
        catch (error) {
            this.logger.error('Error fetching images:', error);
            throw new common_1.BadRequestException('Failed to fetch images');
        }
    }
    async getImageStats() {
        try {
            const [[{ total }], [{ totalSize }], categories, entityTypes, recent] = await Promise.all([
                drizzle_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(drizzle_1.images),
                drizzle_1.db.select({ totalSize: (0, drizzle_orm_1.sql) `sum(${drizzle_1.images.size})` }).from(drizzle_1.images),
                drizzle_1.db.select({
                    category: drizzle_1.images.category,
                    count: (0, drizzle_orm_1.count)()
                })
                    .from(drizzle_1.images)
                    .where((0, drizzle_orm_1.isNotNull)(drizzle_1.images.category))
                    .groupBy(drizzle_1.images.category),
                drizzle_1.db.select({
                    entityType: drizzle_1.images.entityType,
                    count: (0, drizzle_orm_1.count)()
                })
                    .from(drizzle_1.images)
                    .where((0, drizzle_orm_1.isNotNull)(drizzle_1.images.entityType))
                    .groupBy(drizzle_1.images.entityType),
                drizzle_1.db.select()
                    .from(drizzle_1.images)
                    .orderBy((0, drizzle_orm_1.desc)(drizzle_1.images.uploadedAt))
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
        }
        catch (error) {
            this.logger.error('Error fetching image stats:', error);
            throw new common_1.BadRequestException('Failed to fetch image statistics');
        }
    }
    async getImageAnalytics(query) {
        try {
            const { period = '7d', entityType, category } = query;
            const days = period === '30d' ? 30 : 7;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const conditions = [(0, drizzle_orm_1.gte)(drizzle_1.images.uploadedAt, startDate)];
            if (entityType) {
                conditions.push((0, drizzle_orm_1.eq)(drizzle_1.images.entityType, entityType));
            }
            if (category) {
                conditions.push((0, drizzle_orm_1.eq)(drizzle_1.images.category, category));
            }
            const analytics = await drizzle_1.db.select({
                date: (0, drizzle_orm_1.sql) `date(${drizzle_1.images.uploadedAt})`,
                count: (0, drizzle_orm_1.count)(),
                totalSize: (0, drizzle_orm_1.sql) `sum(${drizzle_1.images.size})`
            })
                .from(drizzle_1.images)
                .where((0, drizzle_orm_1.and)(...conditions))
                .groupBy((0, drizzle_orm_1.sql) `date(${drizzle_1.images.uploadedAt})`)
                .orderBy((0, drizzle_orm_1.sql) `date(${drizzle_1.images.uploadedAt})`);
            return {
                period,
                analytics: analytics.map(a => ({
                    date: a.date,
                    uploads: a.count,
                    totalSize: a.totalSize || 0
                }))
            };
        }
        catch (error) {
            this.logger.error('Error fetching analytics:', error);
            throw new common_1.BadRequestException('Failed to fetch analytics');
        }
    }
    async getImagesByEntity(entityType, entityId, query) {
        try {
            const { category, isPublic, limit = 50 } = query;
            const conditions = [
                (0, drizzle_orm_1.eq)(drizzle_1.images.entityType, entityType),
                (0, drizzle_orm_1.eq)(drizzle_1.images.entityId, entityId)
            ];
            if (category) {
                conditions.push((0, drizzle_orm_1.eq)(drizzle_1.images.category, category));
            }
            if (isPublic !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(drizzle_1.images.isPublic, isPublic === 'true'));
            }
            const entityImages = await drizzle_1.db.select()
                .from(drizzle_1.images)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(drizzle_1.images.uploadedAt))
                .limit(limit);
            return {
                entityType,
                entityId,
                images: entityImages
            };
        }
        catch (error) {
            this.logger.error('Error fetching entity images:', error);
            throw new common_1.BadRequestException('Failed to fetch entity images');
        }
    }
    async serveImage(filename, options = {}) {
        try {
            const { variant, quality, format } = options;
            let imagePath;
            if (variant && variant !== 'original') {
                const variantFilename = `${variant}-${filename}`;
                imagePath = path.join(this.variantPath, variantFilename);
                if (!fs.existsSync(imagePath)) {
                    const originalPath = path.join(this.uploadPath, filename);
                    if (fs.existsSync(originalPath)) {
                        await this.generateImageVariants(originalPath, filename);
                    }
                }
            }
            else {
                imagePath = path.join(this.uploadPath, filename);
            }
            if (!fs.existsSync(imagePath)) {
                throw new common_1.NotFoundException('Image not found');
            }
            const stats = fs.statSync(imagePath);
            const fileBuffer = fs.readFileSync(imagePath);
            let processedBuffer = fileBuffer;
            let mimeType = this.getMimeType(filename);
            if (quality || format) {
                const image = (0, sharp_1.default)(fileBuffer);
                if (quality) {
                    image.jpeg({ quality: parseInt(quality) });
                }
                if (format === 'webp') {
                    image.webp();
                    mimeType = 'image/webp';
                }
                else if (format === 'png') {
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
        }
        catch (error) {
            this.logger.error(`Error serving image ${filename}:`, error);
            throw new common_1.NotFoundException('Image not found or processing failed');
        }
    }
    async getImageVariants(filename) {
        try {
            const [image] = await drizzle_1.db.select()
                .from(drizzle_1.images)
                .where((0, drizzle_orm_1.eq)(drizzle_1.images.filename, filename))
                .limit(1);
            if (!image) {
                throw new common_1.NotFoundException('Image not found');
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
        }
        catch (error) {
            this.logger.error(`Error getting variants for ${filename}:`, error);
            throw new common_1.NotFoundException('Image variants not found');
        }
    }
    async getImageById(id) {
        try {
            const [image] = await drizzle_1.db.select()
                .from(drizzle_1.images)
                .where((0, drizzle_orm_1.eq)(drizzle_1.images.id, id))
                .limit(1);
            if (!image) {
                throw new common_1.NotFoundException('Image not found');
            }
            return image;
        }
        catch (error) {
            this.logger.error(`Error fetching image ${id}:`, error);
            throw new common_1.NotFoundException('Image not found');
        }
    }
    async updateImage(id, updateDto) {
        try {
            const [updatedImage] = await drizzle_1.db.update(drizzle_1.images)
                .set({
                ...updateDto,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(drizzle_1.images.id, id))
                .returning();
            if (!updatedImage) {
                throw new common_1.NotFoundException('Image not found');
            }
            return updatedImage;
        }
        catch (error) {
            this.logger.error(`Error updating image ${id}:`, error);
            throw new common_1.BadRequestException('Failed to update image');
        }
    }
    async deleteImage(id) {
        try {
            const [image] = await drizzle_1.db.select()
                .from(drizzle_1.images)
                .where((0, drizzle_orm_1.eq)(drizzle_1.images.id, id))
                .limit(1);
            if (!image) {
                throw new common_1.NotFoundException('Image not found');
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
            await drizzle_1.db.delete(drizzle_1.images).where((0, drizzle_orm_1.eq)(drizzle_1.images.id, id));
            return {
                success: true,
                message: 'Image deleted successfully',
                deletedId: id
            };
        }
        catch (error) {
            this.logger.error(`Error deleting image ${id}:`, error);
            throw new common_1.BadRequestException('Failed to delete image');
        }
    }
    async bulkDelete(ids) {
        try {
            const results = [];
            for (const id of ids) {
                try {
                    const result = await this.deleteImage(id);
                    results.push({ id, success: true });
                }
                catch (error) {
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
        }
        catch (error) {
            this.logger.error('Error in bulk delete:', error);
            throw new common_1.BadRequestException('Bulk delete failed');
        }
    }
    async reprocessImage(id) {
        try {
            const [image] = await drizzle_1.db.select()
                .from(drizzle_1.images)
                .where((0, drizzle_orm_1.eq)(drizzle_1.images.id, id))
                .limit(1);
            if (!image) {
                throw new common_1.NotFoundException('Image not found');
            }
            const originalPath = path.join(this.uploadPath, image.filename);
            if (!fs.existsSync(originalPath)) {
                throw new common_1.NotFoundException('Original image file not found');
            }
            const variants = await this.generateImageVariants(originalPath, image.filename);
            await drizzle_1.db.update(drizzle_1.images)
                .set({
                variants,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(drizzle_1.images.id, id));
            return {
                success: true,
                message: 'Image reprocessed successfully',
                variants: variants.length
            };
        }
        catch (error) {
            this.logger.error(`Error reprocessing image ${id}:`, error);
            throw new common_1.BadRequestException('Failed to reprocess image');
        }
    }
    async createBackup(includeFiles = false) {
        try {
            const allImages = await drizzle_1.db.select().from(drizzle_1.images);
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
        }
        catch (error) {
            this.logger.error('Error creating backup:', error);
            throw new common_1.BadRequestException('Failed to create backup');
        }
    }
    isImageFile(filename) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
        const ext = path.extname(filename).toLowerCase();
        return imageExtensions.includes(ext);
    }
    getMimeType(filename) {
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
};
exports.ImageManagementService = ImageManagementService;
exports.ImageManagementService = ImageManagementService = ImageManagementService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ImageManagementService);
//# sourceMappingURL=image-management.service.js.map