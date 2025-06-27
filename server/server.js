const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Debug: Log environment variables (remove in production)
console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Security middleware with Tesseract.js support
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Required for Tesseract.js web workers
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Required for Tesseract.js
      workerSrc: ["'self'", "blob:"], // Required for Tesseract.js workers
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
    },
  }
}));

// Rate limiting with OCR considerations
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health'
});
app.use(limiter);

// OCR-specific rate limiting for upload endpoints
const ocrLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit OCR processing to 5 requests per minute per IP
  message: {
    error: 'Too many OCR requests, please try again later.',
    retryAfter: 60
  }
});

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files with proper headers for file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png')) {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }
}));

// Routes with rate limiting
app.use('/api/auth', authRoutes);
app.use('/api/expenses/upload', ocrLimiter); // Apply OCR rate limiting to upload endpoint
app.use('/api/expenses', expenseRoutes);

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// OCR service health check
app.get('/api/health/ocr', (req, res) => {
  try {
    const Tesseract = require('tesseract.js');
    res.json({ 
      status: 'OK', 
      message: 'OCR service is available',
      tesseractVersion: Tesseract.version || 'unknown'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'OCR service unavailable',
      error: error.message 
    });
  }
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File too large',
      message: 'File size must be less than 5MB'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Invalid file',
      message: 'Only image files and PDFs are allowed'
    });
  }

  // Handle OCR-specific errors
  if (err.message && err.message.includes('OCR')) {
    return res.status(500).json({
      error: 'OCR processing failed',
      message: 'Unable to extract text from the uploaded file. Please try with a clearer image.'
    });
  }

  // Handle AI service errors
  if (err.message && (err.message.includes('AI') || err.message.includes('Gemini'))) {
    return res.status(500).json({
      error: 'AI processing failed',
      message: 'Unable to analyze the extracted text. Please try again.'
    });
  }

  // Handle MongoDB errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'Please provide a valid ID'
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Please login again'
    });
  }

  // Default error response
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// MongoDB Atlas connection with better error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      console.error('🔍 Please check:');
      console.error('   1. .env file exists in the root directory');
      console.error('   2. MONGODB_URI is properly set in .env file');
      console.error('   3. No extra spaces around the = sign');
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('🔗 Connecting to MongoDB Atlas...');
    console.log('📍 Database URI (masked):', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    // Updated connection options for newer Mongoose versions
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('🔍 This appears to be a connection issue. Please check:');
      console.error('   1. Your internet connection');
      console.error('   2. MongoDB Atlas cluster is running');
      console.error('   3. Your IP address is whitelisted in MongoDB Atlas');
      console.error('   4. The connection string is correct');
    }
    
    if (error.message.includes('authentication failed')) {
      console.error('🔍 Authentication failed. Please check:');
      console.error('   1. Username and password in the connection string');
      console.error('   2. Database user has proper permissions');
    }

    if (error.message.includes('serverSelectionTimeoutMS')) {
      console.error('🔍 Server selection timeout. Please check:');
      console.error('   1. Your internet connection is stable');
      console.error('   2. MongoDB Atlas cluster is accessible');
      console.error('   3. Firewall or network restrictions');
    }
    
    // Exit process with failure
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('📦 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📦 Mongoose disconnected from MongoDB Atlas');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await mongoose.connection.close();
  console.log('📦 MongoDB connection closed');
  process.exit(0);
});

// Connect to database and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  });
});
