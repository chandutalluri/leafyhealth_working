const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:8080',
    /\.replit\.dev$/,
    /\.replit\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// Health check endpoint
app.get('/images/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Image Management Service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all images
app.get('/images', (req, res) => {
  res.json({
    images: [],
    total: 0,
    message: 'Image Management Service is operational'
  });
});

// Upload endpoint
app.post('/images/upload', (req, res) => {
  res.json({
    success: true,
    message: 'Upload endpoint is operational',
    filename: 'example-image.jpg',
    url: '/images/serve/example-image.jpg'
  });
});

// Statistics endpoint
app.get('/images/stats', (req, res) => {
  res.json({
    totalImages: 0,
    totalSize: 0,
    variants: 0,
    service: 'operational'
  });
});

// Serve image endpoint
app.get('/images/serve/:filename', (req, res) => {
  res.json({
    message: 'Image serving endpoint operational',
    filename: req.params.filename
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'LeafyHealth Image Management API',
    description: 'Self-hosted image management service',
    version: '1.0.0',
    endpoints: [
      'GET /images/health - Health check',
      'GET /images - List images',
      'POST /images/upload - Upload image',
      'GET /images/stats - Get statistics',
      'GET /images/serve/:filename - Serve image'
    ]
  });
});

const port = process.env.PORT || 3070;

app.listen(port, '0.0.0.0', () => {
  console.log(`🖼️  Image Management Service running on port ${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🔗 Upload endpoint: http://localhost:${port}/images/upload`);
  console.log(`🖼️  Serve endpoint: http://localhost:${port}/images/serve/:filename`);
  console.log(`❤️  Health check: http://localhost:${port}/images/health`);
});