const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3070;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Create storage directories
const storageDir = path.join(__dirname, 'storage');
const originalDir = path.join(storageDir, 'original');
const variantsDir = path.join(storageDir, 'variants');
const tempDir = path.join(storageDir, 'temp');

[originalDir, variantsDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const upload = multer({
  dest: tempDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Image variants configuration
const variants = {
  sm: { width: 320, quality: 80 },
  md: { width: 640, quality: 85 },
  lg: { width: 1024, quality: 90 },
  xl: { width: 1920, quality: 95 }
};

// Process image and create variants
async function processImage(tempFilePath, originalName) {
  const fileId = uuidv4();
  const ext = path.extname(originalName).toLowerCase();
  const baseName = `${fileId}${ext}`;
  
  // Copy original
  const originalPath = path.join(originalDir, baseName);
  fs.copyFileSync(tempFilePath, originalPath);
  
  // Get metadata
  const metadata = await sharp(tempFilePath).metadata();
  
  // Create variants
  const createdVariants = [];
  for (const [variantName, config] of Object.entries(variants)) {
    const variantFileName = `${fileId}_${variantName}${ext}`;
    const variantPath = path.join(variantsDir, variantFileName);
    
    await sharp(tempFilePath)
      .resize(config.width, null, { withoutEnlargement: true })
      .jpeg({ quality: config.quality })
      .toFile(variantPath);
    
    createdVariants.push({
      name: variantName,
      filename: variantFileName,
      url: `http://localhost:${PORT}/images/variants/${variantFileName}`
    });
  }
  
  // Cleanup temp file
  fs.unlinkSync(tempFilePath);
  
  return {
    id: fileId,
    filename: baseName,
    originalName,
    url: `http://localhost:${PORT}/images/serve/${baseName}`,
    width: metadata.width,
    height: metadata.height,
    variants: createdVariants
  };
}

// Routes
app.post('/images/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    
    console.log(`Processing upload: ${req.file.originalname} (${req.file.size} bytes)`);
    const result = await processImage(req.file.path, req.file.originalname);
    console.log(`Upload successful: ${result.id} - ${req.file.originalname}`);
    res.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

app.post('/images/upload/multiple', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }
    
    console.log(`Processing multiple uploads: ${req.files.length} files`);
    const results = [];
    
    for (const file of req.files) {
      try {
        const result = await processImage(file.path, file.originalname);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload ${file.originalname}:`, error);
        results.push({ 
          filename: file.originalname, 
          error: error.message 
        });
      }
    }
    
    res.json({
      total: req.files.length,
      successful: results.filter(r => !r.error).length,
      failed: results.filter(r => r.error).length,
      results
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Failed to process images' });
  }
});

app.get('/images/serve/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(originalDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }
  
  // Set cache headers
  res.set({
    'Cache-Control': 'public, max-age=31536000', // 1 year cache
    'Content-Type': 'image/' + path.extname(filename).substring(1)
  });
  
  res.sendFile(filePath);
});

app.get('/images/variants/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(variantsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Image variant not found' });
  }
  
  // Set cache headers
  res.set({
    'Cache-Control': 'public, max-age=31536000', // 1 year cache
    'Content-Type': 'image/' + path.extname(filename).substring(1)
  });
  
  res.sendFile(filePath);
});

app.get('/images/stats', (req, res) => {
  try {
    const originalFiles = fs.readdirSync(originalDir);
    const variantFiles = fs.readdirSync(variantsDir);
    
    let totalSize = 0;
    originalFiles.forEach(file => {
      const stats = fs.statSync(path.join(originalDir, file));
      totalSize += stats.size;
    });
    
    res.json({
      totalImages: originalFiles.length,
      totalVariants: variantFiles.length,
      totalSize: totalSize,
      formattedSize: (totalSize / (1024 * 1024)).toFixed(2) + ' MB'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Image Management Service',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    port: PORT
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🖼️  Image Management Service running on port ${PORT}`);
  console.log(`🔗 Upload endpoint: http://localhost:${PORT}/images/upload`);
  console.log(`🖼️  Serve endpoint: http://localhost:${PORT}/images/serve/:filename`);
  console.log(`📊 Stats endpoint: http://localhost:${PORT}/images/stats`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});