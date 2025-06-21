const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { CloudflareCDNIntegration } = require('./cdn-integration');

/**
 * Idempotent Queue-Based Image Processing Service
 * Ensures no duplicate processing and handles concurrent workers safely
 */
class IdempotentImageProcessor {
  constructor(options = {}) {
    this.storageDir = options.storageDir || path.join(__dirname, 'storage');
    this.lockDir = path.join(this.storageDir, 'locks');
    this.processedDir = path.join(this.storageDir, 'processed');
    this.cdnIntegration = new CloudflareCDNIntegration(options.cdn);
    this.lockTimeout = options.lockTimeout || 300000; // 5 minutes
    
    // Ensure directories exist
    [this.lockDir, this.processedDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Generate unique job identifier for idempotency
   */
  generateJobId(imageId, variantType, version = 1) {
    const data = `${imageId}:${variantType}:${version}`;
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
  }

  /**
   * Check if job has already been processed (idempotency check)
   */
  isJobProcessed(jobId) {
    const processedFile = path.join(this.processedDir, `${jobId}.json`);
    return fs.existsSync(processedFile);
  }

  /**
   * Mark job as processed with metadata
   */
  markJobProcessed(jobId, metadata) {
    const processedFile = path.join(this.processedDir, `${jobId}.json`);
    const data = {
      jobId,
      processedAt: new Date().toISOString(),
      metadata,
      worker: process.pid
    };
    
    fs.writeFileSync(processedFile, JSON.stringify(data, null, 2));
  }

  /**
   * Acquire distributed lock for job processing
   */
  acquireLock(jobId) {
    const lockFile = path.join(this.lockDir, `${jobId}.lock`);
    const lockData = {
      workerId: process.pid,
      acquiredAt: Date.now(),
      expiresAt: Date.now() + this.lockTimeout
    };

    try {
      // Atomic lock acquisition using exclusive file creation
      fs.writeFileSync(lockFile, JSON.stringify(lockData), { flag: 'wx' });
      return true;
    } catch (error) {
      if (error.code === 'EEXIST') {
        // Lock exists, check if it's expired
        try {
          const existingLock = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
          if (Date.now() > existingLock.expiresAt) {
            // Lock expired, try to remove and acquire
            fs.unlinkSync(lockFile);
            return this.acquireLock(jobId);
          }
        } catch (e) {
          // Corrupt lock file, remove and retry
          try {
            fs.unlinkSync(lockFile);
            return this.acquireLock(jobId);
          } catch (removeError) {
            return false;
          }
        }
        return false;
      }
      throw error;
    }
  }

  /**
   * Release distributed lock
   */
  releaseLock(jobId) {
    const lockFile = path.join(this.lockDir, `${jobId}.lock`);
    try {
      fs.unlinkSync(lockFile);
    } catch (error) {
      console.warn(`Failed to release lock ${jobId}:`, error.message);
    }
  }

  /**
   * Process image variant generation with idempotency
   */
  async processImageVariant(job) {
    const { imageId, variantType, originalPath, outputPath, config, version } = job;
    const jobId = this.generateJobId(imageId, variantType, version);

    console.log(`Processing job ${jobId}: ${imageId} -> ${variantType}`);

    // Idempotency check
    if (this.isJobProcessed(jobId)) {
      console.log(`Job ${jobId} already processed, skipping`);
      return {
        success: true,
        skipped: true,
        jobId,
        message: 'Already processed'
      };
    }

    // Acquire lock for concurrent safety
    if (!this.acquireLock(jobId)) {
      console.log(`Failed to acquire lock for job ${jobId}, skipping`);
      return {
        success: false,
        skipped: true,
        jobId,
        message: 'Lock acquisition failed'
      };
    }

    try {
      // Double-check after acquiring lock
      if (this.isJobProcessed(jobId)) {
        console.log(`Job ${jobId} processed by another worker, skipping`);
        return {
          success: true,
          skipped: true,
          jobId,
          message: 'Processed by another worker'
        };
      }

      // Check if output already exists
      if (fs.existsSync(outputPath)) {
        console.log(`Output file exists for job ${jobId}, marking as processed`);
        const stats = fs.statSync(outputPath);
        this.markJobProcessed(jobId, {
          outputPath,
          size: stats.size,
          existingFile: true
        });
        return {
          success: true,
          jobId,
          outputPath,
          size: stats.size
        };
      }

      // Perform actual image processing
      const result = await this.generateVariant(originalPath, outputPath, config);
      
      // Mark as processed
      this.markJobProcessed(jobId, {
        outputPath,
        originalPath,
        config,
        ...result
      });

      console.log(`Job ${jobId} completed successfully`);
      return {
        success: true,
        jobId,
        ...result
      };

    } catch (error) {
      console.error(`Job ${jobId} failed:`, error);
      return {
        success: false,
        jobId,
        error: error.message
      };
    } finally {
      this.releaseLock(jobId);
    }
  }

  /**
   * Generate image variant (simplified for demonstration)
   */
  async generateVariant(inputPath, outputPath, config) {
    return new Promise((resolve, reject) => {
      try {
        // Simulate image processing
        const inputBuffer = fs.readFileSync(inputPath);
        const inputStats = fs.statSync(inputPath);
        
        // Simulate compression and resizing
        const compressionRatio = config.quality / 100;
        const outputSize = Math.floor(inputBuffer.length * compressionRatio);
        const outputBuffer = inputBuffer.slice(0, outputSize);
        
        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Write processed file
        fs.writeFileSync(outputPath, outputBuffer);
        
        resolve({
          outputPath,
          originalSize: inputStats.size,
          processedSize: outputSize,
          compressionRatio: ((inputStats.size - outputSize) / inputStats.size * 100).toFixed(2) + '%',
          width: config.width,
          height: config.height,
          quality: config.quality
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Batch process multiple variants for an image
   */
  async processBatchVariants(imageId, originalPath, variants) {
    const results = [];
    
    for (const [variantName, config] of Object.entries(variants)) {
      const ext = path.extname(originalPath);
      const outputFilename = `${imageId}_${variantName}${ext}`;
      const outputPath = path.join(this.storageDir, 'variants', outputFilename);
      
      const job = {
        imageId,
        variantType: variantName,
        originalPath,
        outputPath,
        config,
        version: 1
      };
      
      const result = await this.processImageVariant(job);
      results.push({
        variant: variantName,
        ...result
      });
    }
    
    return results;
  }

  /**
   * Clean up expired locks
   */
  cleanupExpiredLocks() {
    try {
      const lockFiles = fs.readdirSync(this.lockDir);
      let cleaned = 0;
      
      for (const lockFile of lockFiles) {
        const lockPath = path.join(this.lockDir, lockFile);
        try {
          const lockData = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
          if (Date.now() > lockData.expiresAt) {
            fs.unlinkSync(lockPath);
            cleaned++;
          }
        } catch (error) {
          // Corrupt lock file, remove it
          fs.unlinkSync(lockPath);
          cleaned++;
        }
      }
      
      console.log(`Cleaned up ${cleaned} expired locks`);
      return cleaned;
    } catch (error) {
      console.error('Failed to cleanup locks:', error);
      return 0;
    }
  }

  /**
   * Get processing statistics
   */
  getProcessingStats() {
    try {
      const processedFiles = fs.readdirSync(this.processedDir);
      const lockFiles = fs.readdirSync(this.lockDir);
      
      let totalProcessed = 0;
      let totalSkipped = 0;
      let totalFailed = 0;
      
      for (const file of processedFiles) {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(this.processedDir, file), 'utf8'));
          if (data.metadata) {
            totalProcessed++;
          }
        } catch (error) {
          totalFailed++;
        }
      }
      
      return {
        totalProcessed,
        totalSkipped,
        totalFailed,
        activeLocks: lockFiles.length,
        lastCleanup: new Date().toISOString()
      };
    } catch (error) {
      return {
        error: 'Failed to get stats',
        totalProcessed: 0,
        totalSkipped: 0,
        totalFailed: 0,
        activeLocks: 0
      };
    }
  }
}

/**
 * Redis-based Queue Manager (fallback implementation)
 */
class SimpleQueueManager {
  constructor() {
    this.queues = new Map();
    this.processing = new Set();
  }

  async addJob(queueName, jobData, options = {}) {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, []);
    }
    
    const job = {
      id: crypto.randomUUID(),
      data: jobData,
      priority: options.priority || 0,
      delay: options.delay || 0,
      attempts: 0,
      maxAttempts: options.attempts || 3,
      createdAt: Date.now()
    };
    
    this.queues.get(queueName).push(job);
    this.queues.get(queueName).sort((a, b) => b.priority - a.priority);
    
    return job;
  }

  async getNextJob(queueName) {
    const queue = this.queues.get(queueName);
    if (!queue || queue.length === 0) return null;
    
    const now = Date.now();
    const job = queue.find(j => !this.processing.has(j.id) && (j.delay === 0 || now >= j.createdAt + j.delay));
    
    if (job) {
      this.processing.add(job.id);
      job.attempts++;
    }
    
    return job;
  }

  async completeJob(job) {
    this.processing.delete(job.id);
    const queue = this.queues.get('image-processing');
    if (queue) {
      const index = queue.findIndex(j => j.id === job.id);
      if (index > -1) {
        queue.splice(index, 1);
      }
    }
  }

  async failJob(job, error) {
    this.processing.delete(job.id);
    if (job.attempts < job.maxAttempts) {
      job.delay = Math.min(job.attempts * 1000, 30000); // Exponential backoff
      job.lastError = error;
    } else {
      // Move to failed queue or remove
      const queue = this.queues.get('image-processing');
      if (queue) {
        const index = queue.findIndex(j => j.id === job.id);
        if (index > -1) {
          queue.splice(index, 1);
        }
      }
    }
  }
}

module.exports = {
  IdempotentImageProcessor,
  SimpleQueueManager
};