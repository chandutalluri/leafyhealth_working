const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PORT = 3070;

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

// Simple file parser for multipart/form-data
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
        files.push({
          filename,
          contentType,
          data: Buffer.from(fileData, 'binary')
        });
      }
    }
  }
  
  return files;
}

const server = http.createServer((req, res) => {
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

  // Health check
  if (pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'Image Management Service',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      port: PORT
    }));
    return;
  }

  // Stats endpoint
  if (pathname === '/images/stats' && req.method === 'GET') {
    try {
      const originalFiles = fs.readdirSync(originalDir);
      const variantFiles = fs.readdirSync(variantsDir);
      
      let totalSize = 0;
      originalFiles.forEach(file => {
        const stats = fs.statSync(path.join(originalDir, file));
        totalSize += stats.size;
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        totalImages: originalFiles.length,
        totalVariants: variantFiles.length,
        totalSize: totalSize,
        formattedSize: (totalSize / (1024 * 1024)).toFixed(2) + ' MB'
      }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to get stats' }));
    }
    return;
  }

  // Serve images
  if (pathname.startsWith('/images/serve/') && req.method === 'GET') {
    const filename = pathname.split('/images/serve/')[1];
    const filePath = path.join(originalDir, filename);
    
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Image not found' }));
      return;
    }
    
    const stats = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    let mimeType = 'application/octet-stream';
    
    if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.gif') mimeType = 'image/gif';
    else if (ext === '.webp') mimeType = 'image/webp';
    
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Length': stats.size,
      'Cache-Control': 'public, max-age=31536000'
    });
    
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    return;
  }

  // Upload endpoint (simplified)
  if (pathname === '/images/upload' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString('binary');
    });
    
    req.on('end', () => {
      try {
        const contentType = req.headers['content-type'] || '';
        
        if (contentType.includes('multipart/form-data')) {
          const boundary = contentType.split('boundary=')[1];
          const files = parseMultipartData(body, boundary);
          
          if (files.length === 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No file provided' }));
            return;
          }
          
          const file = files[0];
          const fileId = uuidv4();
          const ext = path.extname(file.filename).toLowerCase();
          const newFilename = `${fileId}${ext}`;
          const filePath = path.join(originalDir, newFilename);
          
          fs.writeFileSync(filePath, file.data);
          
          const result = {
            id: fileId,
            filename: newFilename,
            originalName: file.filename,
            url: `http://localhost:${PORT}/images/serve/${newFilename}`,
            size: file.data.length,
            variants: []
          };
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
          
          console.log(`Upload successful: ${fileId} - ${file.filename}`);
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

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🖼️  Image Management Service running on port ${PORT}`);
  console.log(`🔗 Upload endpoint: http://localhost:${PORT}/images/upload`);
  console.log(`🖼️  Serve endpoint: http://localhost:${PORT}/images/serve/:filename`);
  console.log(`📊 Stats endpoint: http://localhost:${PORT}/images/stats`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});