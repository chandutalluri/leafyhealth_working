/**
 * Direct Image Management Service
 * Handles all image operations with proper serving functionality
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

class DirectImageService {
  constructor() {
    this.app = express();
    this.port = 8080;
    this.imageDatabase = new Map();
    this.setupPaths();
    this.setupMiddleware();
    this.setupImageRoutes();
    this.setupMicroserviceRoutes();
    this.loadExistingImages();
  }

  setupPaths() {
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.imagesDir = path.join(this.uploadsDir, 'images');
    
    [this.uploadsDir, this.imagesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  setupMiddleware() {
    this.app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));
  }

  setupImageRoutes() {
    // Health check
    this.app.get('/api/image-management/health', (req, res) => {
      res.json({
        status: 'healthy',
        service: 'Direct Image Management',
        timestamp: new Date().toISOString(),
        totalImages: this.imageDatabase.size
      });
    });

    // Upload endpoint
    this.app.post('/api/image-management/upload', (req, res) => {
      try {
        const { file, originalName, category = 'general', entityType = 'general' } = req.body;

        if (!file || !originalName) {
          return res.status(400).json({ error: 'File data and originalName required' });
        }

        // Parse base64 data
        let fileBuffer;
        let mimeType = 'image/png';

        if (file.startsWith('data:')) {
          const matches = file.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            mimeType = matches[1];
            fileBuffer = Buffer.from(matches[2], 'base64');
          } else {
            return res.status(400).json({ error: 'Invalid base64 format' });
          }
        } else {
          fileBuffer = Buffer.from(file, 'base64');
        }

        // Validate file size
        if (fileBuffer.length > 2 * 1024 * 1024) {
          return res.status(400).json({ error: 'File too large (max 2MB)' });
        }

        // Generate filename
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substr(2, 9);
        const extension = path.extname(originalName) || '.png';
        const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const baseFilename = path.parse(safeName).name;
        const filename = `${baseFilename}_${timestamp}_${randomId}${extension}`;

        // Save file
        const filePath = path.join(this.imagesDir, filename);
        fs.writeFileSync(filePath, fileBuffer);

        // Create record
        const imageRecord = {
          id: randomId,
          filename,
          originalName,
          filePath,
          size: fileBuffer.length,
          mimeType,
          category,
          entityType,
          uploadedAt: new Date().toISOString(),
          url: `/api/image-management/serve/${filename}`
        };

        this.imageDatabase.set(randomId, imageRecord);

        console.log(`✅ Image uploaded: ${filename} (${this.formatBytes(fileBuffer.length)})`);

        res.json({
          success: true,
          message: 'Image uploaded successfully',
          image: imageRecord
        });

      } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed: ' + error.message });
      }
    });

    // Serve images - CRITICAL ENDPOINT
    this.app.get('/api/image-management/serve/:filename', (req, res) => {
      try {
        const filename = req.params.filename;
        const filePath = path.join(this.imagesDir, filename);

        if (!fs.existsSync(filePath)) {
          console.log(`❌ File not found: ${filePath}`);
          return res.status(404).json({ error: 'Image not found', filename });
        }

        const stats = fs.statSync(filePath);
        const ext = path.extname(filename).toLowerCase();
        
        const mimeTypes = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.bmp': 'image/bmp',
          '.svg': 'image/svg+xml'
        };
        
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Access-Control-Allow-Origin', '*');

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);

        console.log(`📸 Served: ${filename} (${contentType})`);

      } catch (error) {
        console.error('Serve error:', error);
        res.status(500).json({ error: 'Failed to serve image' });
      }
    });

    // List images
    this.app.get('/api/image-management', (req, res) => {
      try {
        const { category, entityType, limit } = req.query;
        let images = Array.from(this.imageDatabase.values());

        if (category) {
          images = images.filter(img => img.category === category);
        }
        if (entityType) {
          images = images.filter(img => img.entityType === entityType);
        }
        if (limit) {
          images = images.slice(0, parseInt(limit));
        }

        images.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        res.json({ images });
      } catch (error) {
        console.error('List error:', error);
        res.status(500).json({ error: 'Failed to list images' });
      }
    });

    // Statistics
    this.app.get('/api/image-management/stats', (req, res) => {
      try {
        const images = Array.from(this.imageDatabase.values());
        const totalSize = images.reduce((sum, img) => sum + img.size, 0);

        res.json({
          overview: {
            totalImages: images.length,
            totalSize,
            totalSizeFormatted: this.formatBytes(totalSize)
          },
          breakdown: {
            categories: this.getCategoryBreakdown(images),
            entityTypes: this.getEntityTypeBreakdown(images)
          }
        });
      } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
      }
    });

    // Delete image
    this.app.delete('/api/image-management/:id', (req, res) => {
      try {
        const imageId = req.params.id;
        const image = this.imageDatabase.get(imageId);

        if (!image) {
          return res.status(404).json({ error: 'Image not found' });
        }

        if (fs.existsSync(image.filePath)) {
          fs.unlinkSync(image.filePath);
        }

        this.imageDatabase.delete(imageId);
        res.json({ success: true, message: 'Image deleted successfully' });
      } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete image' });
      }
    });
  }

  setupMicroserviceRoutes() {
    // Simple health and status endpoints
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        service: 'Direct Image Service',
        timestamp: new Date().toISOString(),
        images: this.imageDatabase.size
      });
    });

    this.app.get('/api/status', (req, res) => {
      res.json({
        service: 'operational',
        imageManagement: 'active',
        totalImages: this.imageDatabase.size
      });
    });

    // Company management proxy
    this.app.get('/api/company-management/companies', async (req, res) => {
      try {
        const axios = require('axios');
        const response = await axios.get('http://localhost:3013/company-management/companies');
        res.json(response.data);
      } catch (error) {
        res.status(503).json({ error: 'Company management service unavailable' });
      }
    });
  }

  loadExistingImages() {
    try {
      if (fs.existsSync(this.imagesDir)) {
        const files = fs.readdirSync(this.imagesDir);
        
        files.forEach(filename => {
          const filePath = path.join(this.imagesDir, filename);
          const stats = fs.statSync(filePath);
          
          if (stats.isFile()) {
            const id = Math.random().toString(36).substr(2, 9);
            
            const imageRecord = {
              id,
              filename,
              originalName: filename,
              filePath,
              size: stats.size,
              mimeType: this.getMimeTypeFromExtension(filename),
              category: 'existing',
              entityType: 'general',
              uploadedAt: stats.birthtime.toISOString(),
              url: `/api/image-management/serve/${filename}`
            };
            
            this.imageDatabase.set(id, imageRecord);
          }
        });

        console.log(`📚 Loaded ${this.imageDatabase.size} existing images`);
      }
    } catch (error) {
      console.error('Error loading existing images:', error);
    }
  }

  getMimeTypeFromExtension(filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp',
      '.svg': 'image/svg+xml'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getCategoryBreakdown(images) {
    const categories = {};
    images.forEach(img => {
      categories[img.category] = (categories[img.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, count]) => ({ name, count }));
  }

  getEntityTypeBreakdown(images) {
    const entityTypes = {};
    images.forEach(img => {
      entityTypes[img.entityType] = (entityTypes[img.entityType] || 0) + 1;
    });
    return Object.entries(entityTypes).map(([name, count]) => ({ name, count }));
  }

  start() {
    const server = this.app.listen(this.port, '0.0.0.0', () => {
      console.log(`🚀 Direct Image Service running on port ${this.port}`);
      console.log(`📚 Health: http://localhost:${this.port}/api/image-management/health`);
      console.log(`📤 Upload: http://localhost:${this.port}/api/image-management/upload`);
      console.log(`📷 Serve: http://localhost:${this.port}/api/image-management/serve/:filename`);
      console.log(`📊 Stats: http://localhost:${this.port}/api/image-management/stats`);
      console.log(`📁 Images: ${this.imagesDir}`);
      console.log(`💾 Database: ${this.imageDatabase.size} images loaded`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
      if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${this.port} is already in use`);
        process.exit(1);
      }
    });

    return server;
  }
}

// Start the service
const service = new DirectImageService();
service.start();