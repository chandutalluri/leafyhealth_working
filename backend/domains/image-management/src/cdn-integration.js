const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

class CloudflareCDNIntegration {
  constructor(options = {}) {
    this.zoneId = options.zoneId || process.env.CLOUDFLARE_ZONE_ID;
    this.apiToken = options.apiToken || process.env.CLOUDFLARE_API_TOKEN;
    this.cdnDomain = options.cdnDomain || process.env.CDN_DOMAIN || 'cdn.leafyhealth.com';
    this.baseUrl = `http://localhost:3070`;
    this.enabled = !!(this.zoneId && this.apiToken);
    this.fallbackImage = options.fallbackImage || '/images/placeholder.jpg';
    this.cacheHeaders = this.setupCacheHeaders();
  }

  // Setup optimized cache headers for different content types
  setupCacheHeaders() {
    return {
      images: {
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
        'Vary': 'Accept-Encoding',
        'X-Content-Type-Options': 'nosniff'
      },
      variants: {
        'Cache-Control': 'public, max-age=2592000, stale-while-revalidate=86400', // 30 days
        'Vary': 'Accept-Encoding, Accept',
        'X-Content-Type-Options': 'nosniff'
      },
      api: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60', // 5 minutes
        'Vary': 'Accept-Encoding'
      }
    };
  }

  // Generate versioned CDN URLs for cache invalidation
  generateCDNUrl(filename, variant = null, version = null) {
    const timestamp = version || Date.now();
    const versionedFilename = version ? `${filename}?v=${timestamp}` : filename;
    
    if (!this.enabled) {
      return variant 
        ? `${this.baseUrl}/images/variants/${versionedFilename}`
        : `${this.baseUrl}/images/serve/${versionedFilename}`;
    }

    const basePath = variant ? 'variants' : 'serve';
    return `https://${this.cdnDomain}/images/${basePath}/${versionedFilename}`;
  }

  // Generate fallback URLs with placeholder handling
  generateFallbackUrl(filename, variant = null) {
    const placeholderFilename = this.getPlaceholderForType(filename);
    return this.generateCDNUrl(placeholderFilename, variant);
  }

  // Get appropriate placeholder based on file type
  getPlaceholderForType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const placeholders = {
      '.jpg': 'placeholder-photo.jpg',
      '.jpeg': 'placeholder-photo.jpg', 
      '.png': 'placeholder-image.png',
      '.gif': 'placeholder-animated.gif',
      '.webp': 'placeholder-modern.webp',
      'default': 'placeholder-generic.jpg'
    };
    
    return placeholders[ext] || placeholders.default;
  }

  // Advanced cache invalidation with batch processing
  async purgeCache(urls, options = {}) {
    if (!this.enabled) {
      console.log('CDN not configured, skipping cache purge');
      return { success: true, message: 'CDN disabled' };
    }

    const urlArray = Array.isArray(urls) ? urls : [urls];
    const batchSize = options.batchSize || 30; // Cloudflare limit
    const results = [];

    // Process in batches to respect API limits
    for (let i = 0; i < urlArray.length; i += batchSize) {
      const batch = urlArray.slice(i, i + batchSize);
      try {
        const result = await this.purgeCacheBatch(batch, options);
        results.push(result);
        
        // Rate limiting delay between batches
        if (i + batchSize < urlArray.length) {
          await this.delay(1000);
        }
      } catch (error) {
        results.push({ success: false, error: error.message, batch });
      }
    }

    return {
      success: results.every(r => r.success),
      totalBatches: results.length,
      results
    };
  }

  // Purge single batch with retry logic
  async purgeCacheBatch(urls, options = {}) {
    const purgeData = JSON.stringify({
      files: urls,
      tags: options.tags || []
    });

    const requestOptions = {
      hostname: 'api.cloudflare.com',
      port: 443,
      path: `/client/v4/zones/${this.zoneId}/purge_cache`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(purgeData)
      }
    };

    const maxRetries = options.retries || 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.makeCloudflareRequest(requestOptions, purgeData);
        return result;
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          await this.delay(attempt * 1000); // Exponential backoff
        }
      }
    }

    throw lastError;
  }

  // Make HTTP request to Cloudflare API
  makeCloudflareRequest(options, data) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => responseData += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(responseData);
            if (response.success) {
              resolve(response);
            } else {
              reject(new Error(`Cloudflare API error: ${JSON.stringify(response.errors)}`));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      if (data) {
        req.write(data);
      }
      req.end();
    });
  }

  // Smart cache invalidation for image updates
  async invalidateImageCache(imageId, variants = []) {
    const urlsToInvalidate = [];
    
    // Original image URL
    urlsToInvalidate.push(`https://${this.cdnDomain}/images/serve/${imageId}*`);
    
    // All variant URLs
    for (const variant of variants) {
      urlsToInvalidate.push(`https://${this.cdnDomain}/images/variants/${imageId}_${variant}*`);
    }
    
    return this.purgeCache(urlsToInvalidate, { tags: [`image:${imageId}`] });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get CDN analytics
  async getAnalytics(startDate, endDate) {
    if (!this.enabled) {
      return { 
        success: false, 
        message: 'CDN not configured',
        data: { requests: 0, bandwidth: 0, cacheHitRate: 0 }
      };
    }

    const params = new URLSearchParams({
      since: startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      until: endDate || new Date().toISOString(),
      dimensions: 'datetime',
      metrics: 'requests,bytes,cachedRequests'
    });

    const options = {
      hostname: 'api.cloudflare.com',
      port: 443,
      path: `/client/v4/zones/${this.zoneId}/analytics/dashboard?${params}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.end();
    });
  }
}

// Advanced image optimization utilities
class ImageOptimizer {
  constructor() {
    this.compressionSettings = {
      jpeg: { quality: 85, progressive: true },
      png: { compressionLevel: 6, adaptiveFiltering: true },
      webp: { quality: 85, effort: 4 }
    };
  }

  // Calculate optimal compression settings based on image characteristics
  getOptimalSettings(imageInfo) {
    const { width, height, format, size } = imageInfo;
    const pixels = width * height;
    
    // Adjust quality based on image size and type
    let quality = 85;
    if (pixels > 2000000) quality = 80; // Large images
    if (pixels < 50000) quality = 95;   // Small images
    
    // Adjust for file size
    if (size > 2 * 1024 * 1024) quality -= 5; // Files > 2MB
    
    return {
      ...this.compressionSettings[format.toLowerCase()],
      quality: Math.max(60, Math.min(95, quality))
    };
  }

  // Generate WebP variants for better compression
  shouldGenerateWebP(originalFormat) {
    return ['jpeg', 'jpg', 'png'].includes(originalFormat.toLowerCase());
  }
}

// Backup and sync utilities
class BackupManager {
  constructor(options = {}) {
    this.backupPath = options.backupPath || path.join(process.cwd(), 'backups');
    this.retentionDays = options.retentionDays || 30;
    this.enabled = options.enabled !== false;
  }

  // Create backup of image storage
  async createBackup() {
    if (!this.enabled) return { success: false, message: 'Backup disabled' };

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(this.backupPath, `backup-${timestamp}`);
    
    try {
      if (!fs.existsSync(this.backupPath)) {
        fs.mkdirSync(this.backupPath, { recursive: true });
      }
      
      // Create backup directory structure
      fs.mkdirSync(backupDir, { recursive: true });
      fs.mkdirSync(path.join(backupDir, 'original'), { recursive: true });
      fs.mkdirSync(path.join(backupDir, 'variants'), { recursive: true });
      
      // Copy files (simplified - in production would use rsync or similar)
      const storageDir = path.join(__dirname, 'storage');
      const originalDir = path.join(storageDir, 'original');
      const variantsDir = path.join(storageDir, 'variants');
      
      if (fs.existsSync(originalDir)) {
        this.copyDirectory(originalDir, path.join(backupDir, 'original'));
      }
      
      if (fs.existsSync(variantsDir)) {
        this.copyDirectory(variantsDir, path.join(backupDir, 'variants'));
      }
      
      // Create backup metadata
      const metadata = {
        timestamp,
        totalFiles: this.countFiles(originalDir) + this.countFiles(variantsDir),
        size: this.calculateDirectorySize(storageDir)
      };
      
      fs.writeFileSync(
        path.join(backupDir, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );
      
      return { 
        success: true, 
        backup: backupDir,
        metadata 
      };
      
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  copyDirectory(src, dest) {
    if (!fs.existsSync(src)) return;
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcFile = path.join(src, file);
      const destFile = path.join(dest, file);
      fs.copyFileSync(srcFile, destFile);
    });
  }

  countFiles(dir) {
    if (!fs.existsSync(dir)) return 0;
    return fs.readdirSync(dir).length;
  }

  calculateDirectorySize(dir) {
    if (!fs.existsSync(dir)) return 0;
    
    let size = 0;
    const files = fs.readdirSync(dir, { recursive: true });
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isFile()) {
        size += fs.statSync(filePath).size;
      }
    });
    
    return size;
  }

  // Clean old backups
  async cleanOldBackups() {
    if (!this.enabled || !fs.existsSync(this.backupPath)) return;

    const cutoffDate = new Date(Date.now() - this.retentionDays * 24 * 60 * 60 * 1000);
    const backups = fs.readdirSync(this.backupPath);
    
    let cleaned = 0;
    backups.forEach(backup => {
      const backupPath = path.join(this.backupPath, backup);
      const stats = fs.statSync(backupPath);
      
      if (stats.isDirectory() && stats.mtime < cutoffDate) {
        fs.rmSync(backupPath, { recursive: true });
        cleaned++;
      }
    });
    
    return { cleaned };
  }
}

module.exports = {
  CloudflareCDNIntegration,
  ImageOptimizer,
  BackupManager
};