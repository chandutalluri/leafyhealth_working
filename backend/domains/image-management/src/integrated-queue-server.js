const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { IdempotentImageProcessor, SimpleQueueManager } = require('./queue-processor');
const { CloudflareCDNIntegration } = require('./cdn-integration');

const PORT = 3070;

// Initialize components
const queueManager = new SimpleQueueManager();
const imageProcessor = new IdempotentImageProcessor({
  storageDir: path.join(__dirname, 'storage'),
  cdn: {
    cdnDomain: process.env.CDN_DOMAIN,
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN
  }
});
const cdnIntegration = new CloudflareCDNIntegration();

// Storage directories
const storageDir = path.join(__dirname, 'storage');
const originalDir = path.join(storageDir, 'original');
const variantsDir = path.join(storageDir, 'variants');
const tempDir = path.join(storageDir, 'temp');
const placeholdersDir = path.join(storageDir, 'placeholders');

[originalDir, variantsDir, tempDir, placeholdersDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create placeholder images
const createPlaceholderImages = () => {
  const placeholders = [
    'placeholder-photo.jpg',
    'placeholder-image.png', 
    'placeholder-animated.gif',
    'placeholder-modern.webp',
    'placeholder-generic.jpg'
  ];

  // Simple 1x1 pixel image data for each format
  const pixelData = {
    jpg: Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46]),
    png: Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    gif: Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]),
    webp: Buffer.from([0x52, 0x49, 0x46, 0x46])
  };

  placeholders.forEach(placeholder => {
    const placeholderPath = path.join(placeholdersDir, placeholder);
    if (!fs.existsSync(placeholderPath)) {
      const ext = path.extname(placeholder).slice(1);
      const data = pixelData[ext] || pixelData.jpg;
      fs.writeFileSync(placeholderPath, data);
    }
  });
};

// Image variant configurations
const VARIANTS = {
  thumb: { width: 150, height: 150, quality: 75, format: 'jpeg' },
  sm: { width: 320, height: 240, quality: 80, format: 'jpeg' },
  md: { width: 640, height: 480, quality: 85, format: 'jpeg' },
  lg: { width: 1024, height: 768, quality: 90, format: 'jpeg' },
  xl: { width: 1920, height: 1080, quality: 95, format: 'jpeg' },
  webp_sm: { width: 320, height: 240, quality: 80, format: 'webp' },
  webp_md: { width: 640, height: 480, quality: 85, format: 'webp' },
  webp_lg: { width: 1024, height: 768, quality: 90, format: 'webp' }
};

// Analytics and metrics
const analytics = {
  uploads: 0,
  downloads: 0,
  queuedJobs: 0,
  processedJobs: 0,
  failedJobs: 0,
  cacheHits: 0,
  cacheMisses: 0,
  cdnPurges: 0,
  startTime: Date.now()
};

// Queue worker for background processing
class QueueWorker {
  constructor() {
    this.isRunning = false;
    this.processingCount = 0;
    this.maxConcurrency = 3;
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('🔄 Queue worker started');
    this.processLoop();
  }

  async stop() {
    this.isRunning = false;
    console.log('🛑 Queue worker stopped');
  }

  async processLoop() {
    while (this.isRunning) {
      try {
        if (this.processingCount < this.maxConcurrency) {
          const job = await queueManager.getNextJob('image-processing');
          if (job) {
            this.processJob(job);
          } else {
            await this.delay(1000); // No jobs, wait 1 second
          }
        } else {
          await this.delay(500); // Max concurrency reached, wait
        }
      } catch (error) {
        console.error('Queue processing error:', error);
        await this.delay(5000); // Error recovery delay
      }
    }
  }

  async processJob(job) {
    this.processingCount++;
    console.log(`📦 Processing job ${job.id}: ${job.data.type}`);

    try {
      let result;
      
      switch (job.data.type) {
        case 'generate-variants':
          result = await this.processVariantGeneration(job.data);
          break;
        case 'cdn-invalidate':
          result = await this.processCDNInvalidation(job.data);
          break;
        default:
          throw new Error(`Unknown job type: ${job.data.type}`);
      }

      await queueManager.completeJob(job);
      analytics.processedJobs++;
      console.log(`✅ Job ${job.id} completed`);
      
    } catch (error) {
      console.error(`❌ Job ${job.id} failed:`, error);
      await queueManager.failJob(job, error.message);
      analytics.failedJobs++;
    } finally {
      this.processingCount--;
    }
  }

  async processVariantGeneration(jobData) {
    const { imageId, originalPath, variants } = jobData;
    return await imageProcessor.processBatchVariants(imageId, originalPath, variants);
  }

  async processCDNInvalidation(jobData) {
    const { imageId, variants } = jobData;
    return await cdnIntegration.invalidateImageCache(imageId, variants);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize worker
const worker = new QueueWorker();

// Enhanced multipart parser
function parseMultipartData(data, boundary) {
  const parts = data.split(`--${boundary}`);
  const files = [];
  
  for (const part of parts) {
    if (part.includes('Content-Disposition: form-data') && part.includes('filename=')) {
      const lines = part.split('\r\n');
      let filename = '';
      let contentType = 'application/octet-stream';
      let dataStart = -1;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('filename=')) {
          const match = line.match(/filename="([^"]*)"/);
          if (match) filename = match[1];
        }
        if (line.includes('Content-Type:')) {
          contentType = line.split('Content-Type: ')[1].trim();
        }
        if (line === '' && dataStart === -1) {
          dataStart = i + 1;
          break;
        }
      }
      
      if (filename && dataStart > -1) {
        const fileData = lines.slice(dataStart, -1).join('\r\n');
        const buffer = Buffer.from(fileData, 'binary');
        
        // Validate file type and size
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(contentType) && buffer.length <= 10 * 1024 * 1024) {
          files.push({
            filename,
            contentType,
            buffer,
            size: buffer.length
          });
        }
      }
    }
  }
  
  return files;
}

// Process image upload with queue integration
async function processImageWithQueue(fileBuffer, originalName) {
  const fileId = uuidv4();
  const ext = path.extname(originalName).toLowerCase();
  const baseName = path.parse(originalName).name.replace(/[^a-zA-Z0-9-_]/g, '');
  const originalFilename = `${fileId}_${baseName}${ext}`;
  const originalPath = path.join(originalDir, originalFilename);
  
  // Save original immediately
  fs.writeFileSync(originalPath, fileBuffer);
  const stats = fs.statSync(originalPath);
  analytics.uploads++;

  // Queue variant generation job
  const variantJob = await queueManager.addJob('image-processing', {
    type: 'generate-variants',
    imageId: fileId,
    originalPath,
    variants: VARIANTS,
    priority: 1
  });

  // Queue CDN invalidation job (lower priority)
  const cdnJob = await queueManager.addJob('image-processing', {
    type: 'cdn-invalidate', 
    imageId: fileId,
    variants: Object.keys(VARIANTS),
    priority: 0
  }, { delay: 5000 }); // Delay to allow variants to be generated first

  analytics.queuedJobs += 2;

  return {
    id: fileId,
    filename: originalFilename,
    originalName,
    url: cdnIntegration.generateCDNUrl(originalFilename),
    fallbackUrl: cdnIntegration.generateFallbackUrl(originalFilename),
    size: stats.size,
    status: 'processing',
    jobs: {
      variants: variantJob.id,
      cdn: cdnJob.id
    },
    metadata: {
      uploaded: new Date().toISOString(),
      expectedVariants: Object.keys(VARIANTS).length
    }
  };
}

// Enhanced statistics
function getEnhancedStats() {
  try {
    const originalFiles = fs.readdirSync(originalDir);
    const variantFiles = fs.readdirSync(variantsDir);
    const processingStats = imageProcessor.getProcessingStats();
    
    let totalSize = 0;
    let totalVariantSize = 0;
    
    originalFiles.forEach(file => {
      totalSize += fs.statSync(path.join(originalDir, file)).size;
    });
    
    variantFiles.forEach(file => {
      totalVariantSize += fs.statSync(path.join(variantsDir, file)).size;
    });

    const uptime = Date.now() - analytics.startTime;
    
    return {
      images: {
        total: originalFiles.length,
        variants: variantFiles.length,
        totalSize: totalSize,
        variantSize: totalVariantSize,
        formattedSize: (totalSize / (1024 * 1024)).toFixed(2) + ' MB',
        formattedVariantSize: (totalVariantSize / (1024 * 1024)).toFixed(2) + ' MB'
      },
      queue: {
        queuedJobs: analytics.queuedJobs,
        processedJobs: analytics.processedJobs,
        failedJobs: analytics.failedJobs,
        processingCount: worker.processingCount,
        isRunning: worker.isRunning
      },
      processing: processingStats,
      performance: {
        uploads: analytics.uploads,
        downloads: analytics.downloads,
        cacheHits: analytics.cacheHits,
        cacheMisses: analytics.cacheMisses,
        cdnPurges: analytics.cdnPurges,
        uptime: Math.floor(uptime / 1000) + 's'
      },
      cdn: {
        enabled: cdnIntegration.enabled,
        domain: cdnIntegration.cdnDomain
      },
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    return {
      error: 'Failed to calculate statistics',
      queue: { isRunning: worker.isRunning }
    };
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check with comprehensive status
  if (pathname === '/health' && req.method === 'GET') {
    const stats = getEnhancedStats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'Integrated Queue-Based Image Management Service',
      version: '4.0.0',
      port: PORT,
      timestamp: new Date().toISOString(),
      features: [
        'idempotent-queue-processing',
        'cdn-integration',
        'fallback-handling',
        'cache-invalidation',
        'background-workers'
      ],
      stats
    }));
    return;
  }

  // Enhanced statistics endpoint
  if (pathname === '/images/stats' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getEnhancedStats()));
    return;
  }

  // Queue management endpoints
  if (pathname === '/queue/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      isRunning: worker.isRunning,
      processingCount: worker.processingCount,
      maxConcurrency: worker.maxConcurrency,
      queuedJobs: analytics.queuedJobs,
      processedJobs: analytics.processedJobs,
      failedJobs: analytics.failedJobs
    }));
    return;
  }

  if (pathname === '/queue/cleanup' && req.method === 'POST') {
    const cleaned = imageProcessor.cleanupExpiredLocks();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ cleaned }));
    return;
  }

  // Image serving with fallback support
  if (pathname.startsWith('/images/serve/') && req.method === 'GET') {
    const filename = pathname.split('/images/serve/')[1];
    const filePath = path.join(originalDir, filename);
    
    if (!fs.existsSync(filePath)) {
      // Serve fallback image
      const fallbackPath = path.join(placeholdersDir, cdnIntegration.getPlaceholderForType(filename));
      if (fs.existsSync(fallbackPath)) {
        analytics.cacheMisses++;
        const stats = fs.statSync(fallbackPath);
        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Content-Length': stats.size,
          'Cache-Control': 'public, max-age=86400', // 1 day for fallbacks
          'X-Fallback': 'true'
        });
        fs.createReadStream(fallbackPath).pipe(res);
        return;
      }
      
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Image not found' }));
      return;
    }
    
    const stats = fs.statSync(filePath);
    analytics.downloads++;
    analytics.cacheHits++;
    
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    
    const headers = cdnIntegration.cacheHeaders.images;
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Content-Length': stats.size,
      ...headers,
      'ETag': `"${stats.mtime.getTime()}-${stats.size}"`
    });
    
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Variant serving with fallback
  if (pathname.startsWith('/images/variants/') && req.method === 'GET') {
    const filename = pathname.split('/images/variants/')[1];
    const filePath = path.join(variantsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      // Serve fallback variant or original
      const baseFilename = filename.split('_')[0] + '_' + filename.split('_')[1];
      const originalPath = path.join(originalDir, baseFilename + path.extname(filename));
      
      if (fs.existsSync(originalPath)) {
        analytics.cacheMisses++;
        const stats = fs.statSync(originalPath);
        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Content-Length': stats.size,
          'Cache-Control': 'public, max-age=3600',
          'X-Fallback': 'original'
        });
        fs.createReadStream(originalPath).pipe(res);
        return;
      }
      
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Variant not found' }));
      return;
    }
    
    const stats = fs.statSync(filePath);
    analytics.downloads++;
    analytics.cacheHits++;
    
    const headers = cdnIntegration.cacheHeaders.variants;
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': stats.size,
      ...headers
    });
    
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Enhanced upload with queue integration
  if (pathname === '/images/upload' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString('binary');
    });
    
    req.on('end', async () => {
      try {
        const contentType = req.headers['content-type'] || '';
        
        if (contentType.includes('multipart/form-data')) {
          const boundary = contentType.split('boundary=')[1];
          const files = parseMultipartData(body, boundary);
          
          if (files.length === 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No valid files provided' }));
            return;
          }
          
          const results = [];
          
          for (const file of files) {
            try {
              const result = await processImageWithQueue(file.buffer, file.filename);
              results.push(result);
              console.log(`📤 Queued processing for: ${result.id} - ${file.filename}`);
            } catch (error) {
              console.error(`Failed to queue ${file.filename}:`, error);
              results.push({
                filename: file.filename,
                error: error.message
              });
            }
          }
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            total: files.length,
            successful: results.filter(r => !r.error).length,
            failed: results.filter(r => r.error).length,
            results,
            processing: {
              queueEnabled: true,
              expectedVariants: Object.keys(VARIANTS).length,
              cdnEnabled: cdnIntegration.enabled
            }
          }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid content type' }));
        }
      } catch (error) {
        console.error('Upload error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to process upload' }));
      }
    });
    return;
  }

  // CDN management endpoints
  if (pathname === '/cdn/purge' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { urls, imageId } = JSON.parse(body);
        let result;
        
        if (imageId) {
          result = await cdnIntegration.invalidateImageCache(imageId, Object.keys(VARIANTS));
        } else if (urls) {
          result = await cdnIntegration.purgeCache(urls);
        } else {
          throw new Error('Either urls or imageId required');
        }
        
        analytics.cdnPurges++;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // API documentation
  if (pathname === '/api/docs' && req.method === 'GET') {
    const docs = {
      service: 'Integrated Queue-Based Image Management API',
      version: '4.0.0',
      endpoints: {
        'POST /images/upload': 'Upload images with queue-based processing',
        'GET /images/serve/:filename': 'Serve images with fallback support',
        'GET /images/variants/:filename': 'Serve variants with fallback to original',
        'GET /images/stats': 'Comprehensive statistics and metrics',
        'GET /queue/status': 'Queue processing status',
        'POST /queue/cleanup': 'Clean expired locks',
        'POST /cdn/purge': 'Purge CDN cache',
        'GET /health': 'Service health with queue status',
        'GET /api/docs': 'This documentation'
      },
      features: [
        'Idempotent queue processing',
        'Fallback image handling',
        'CDN integration with cache invalidation',
        'Background variant generation',
        'Concurrent worker processing',
        'Lock-based concurrency control'
      ],
      queueTypes: {
        'generate-variants': 'Process image variants in background',
        'cdn-invalidate': 'Invalidate CDN cache for updated images'
      }
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(docs, null, 2));
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Server startup
server.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Integrated Queue-Based Image Management Service v4.0 running on port ${PORT}`);
  console.log(`📊 Features: Idempotent Processing, CDN Integration, Fallback Handling`);
  console.log(`🔄 Queue Management: Background processing with ${worker.maxConcurrency} workers`);
  console.log(`🌐 CDN Integration: ${cdnIntegration.enabled ? 'Enabled' : 'Disabled'}`);
  
  // Initialize placeholder images and start worker
  createPlaceholderImages();
  await worker.start();
  
  console.log(`🔗 Upload: http://localhost:${PORT}/images/upload`);
  console.log(`🖼️  Serve: http://localhost:${PORT}/images/serve/:filename`);
  console.log(`🎨 Variants: http://localhost:${PORT}/images/variants/:filename`);
  console.log(`📊 Stats: http://localhost:${PORT}/images/stats`);
  console.log(`🔄 Queue: http://localhost:${PORT}/queue/status`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down gracefully...');
  await worker.stop();
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});