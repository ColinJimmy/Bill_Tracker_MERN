# AI-Based Bill Summarizer and Expense Tracker

A full-stack MERN application that uses AI to automatically extract, categorize, and track expenses from uploaded bills and receipts.

## Features

- **AI-Powered OCR**: Extract text from receipts and invoices using Tesseract.js
- **Smart Categorization**: Automatically categorize expenses using Google Gemini AI
- **Interactive Dashboard**: View expense analytics with charts and visualizations
- **User Authentication**: Secure JWT-based authentication system
- **File Upload**: Support for images (JPG, PNG) and PDF files
- **Expense Management**: Create, read, update, and delete expenses
- **Data Export**: Export expense data for external use
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **Tesseract.js** - OCR processing
- **Google Gemini AI** - Text analysis and summarization
- **Sharp** - Image processing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **React Dropzone** - File upload component
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Toastify** - Notifications

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key

### 1. Clone the repository
```bash
git clone <repository-url>
cd ai-bill-summarizer
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Fill in the required environment variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ai_bill_summarizer

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# AI Service Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### 4. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/ai_bill_summarizer`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Replace `<username>`, `<password>`, and `<cluster-url>` in the connection string
5. Use format: `mongodb+srv://username:password@cluster.mongodb.net/ai_bill_summarizer`

### 5. Get Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

### 6. Start the application
```bash
# Development mode (runs both client and server)
npm run dev

# Or run separately
npm run server  # Starts backend on port 5000
npm run client  # Starts frontend on port 3000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Expenses
- `POST /api/expenses/upload` - Upload and process bill (requires auth)
- `GET /api/expenses` - Get user expenses (requires auth)
- `GET /api/expenses/stats` - Get expense statistics (requires auth)
- `PUT /api/expenses/:id` - Update expense (requires auth)
- `DELETE /api/expenses/:id` - Delete expense (requires auth)

### Utility
- `GET /api/health` - Health check endpoint

## Project Structure

```
ai-bill-summarizer/
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # Reusable components
│       ├── contexts/      # React contexts
│       ├── pages/         # Page components
│       └── App.js         # Main app component
├── server/                # Express backend
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── uploads/          # File uploads
├── .env.example          # Environment variables template
└── README.md            # This file
```

## Usage

### 1. Register/Login
- Create an account or login with existing credentials
- JWT token is stored in localStorage for authentication

### 2. Upload Bills
- Navigate to Dashboard
- Drag and drop or click to upload receipt/bill images
- Supported formats: JPG, PNG, PDF (max 5MB)

### 3. AI Processing
- OCR extracts text from uploaded images
- AI analyzes and categorizes the expense
- Data is automatically saved to your account

### 4. View Analytics
- Dashboard shows expense charts and statistics
- Filter by time period (week/month/year)
- View category breakdowns and spending patterns

### 5. Manage Expenses
- View all expenses in the expense list
- Edit or delete individual expenses
- View detailed AI summaries and extracted text

## Development

### Adding New Features

1. **Backend**: Add routes in `server/routes/`, controllers in `server/controllers/`
2. **Frontend**: Add components in `client/src/components/`, pages in `client/src/pages/`
3. **Database**: Add models in `server/models/`

### Testing

```bash
# Run backend tests
cd server && npm test

# Run frontend tests
cd client && npm test
```

### Building for Production

```bash
# Build frontend
cd client && npm run build

# Start production server
npm start
```

## Deployment

### Frontend Deployment (Vercel - Recommended)

#### Environment Variables for Vercel

When deploying the frontend to Vercel, you need to set these environment variables in your Vercel dashboard:

**Required Environment Variables:**
```env
# API Configuration
REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
REACT_APP_API_BASE_URL=https://your-backend-url.herokuapp.com

# App Configuration
REACT_APP_APP_NAME=AI Bill Summarizer
REACT_APP_VERSION=1.0.0

# Environment
NODE_ENV=production

# Optional: Analytics & Tracking
REACT_APP_GA_TRACKING_ID=your_google_analytics_id
REACT_APP_SENTRY_DSN=your_sentry_dsn_for_error_tracking
```

**Optional Environment Variables:**
```env
# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_PWA=true
REACT_APP_DEBUG_MODE=false

# AI Configuration (if client-side AI features)
REACT_APP_OPENAI_API_KEY=your_openai_key_if_needed
REACT_APP_MAX_FILE_SIZE=5242880

# UI/UX Configuration
REACT_APP_DEFAULT_CURRENCY=USD
REACT_APP_DATE_FORMAT=MM/DD/YYYY
REACT_APP_THEME=default

# Third-party Services
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key_if_payments
REACT_APP_FIREBASE_CONFIG=your_firebase_config_if_used
```

#### Vercel Deployment Steps

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy from Client Directory**
```bash
cd client
vercel --prod
```

4. **Set Environment Variables in Vercel Dashboard**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all the required environment variables listed above
   - Redeploy after adding variables

5. **Alternative: Using vercel.json Configuration**
Create `client/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "@api_url",
    "REACT_APP_APP_NAME": "@app_name"
  }
}
```

### Backend Deployment (Railway/Heroku/Render)

#### Environment Variables for Backend Hosting

**Required Backend Environment Variables:**
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai_bill_summarizer?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_for_production
JWT_EXPIRE=7d

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_key_if_using

# CORS Configuration
CLIENT_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://your-custom-domain.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=/tmp/uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf

# Email Configuration (if using email features)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FROM_EMAIL=your_email@gmail.com

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session Configuration
SESSION_SECRET=your_session_secret_for_production
COOKIE_SECURE=true
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=strict
```

### Complete Deployment Checklist

#### Pre-deployment Setup

1. **Create Production MongoDB Database**
```bash
# Use MongoDB Atlas for production
# Create cluster and get connection string
# Whitelist all IPs (0.0.0.0/0) or specific IPs
```

2. **Prepare Environment Files**
```bash
# Create .env.production for backend
# Set all production environment variables
# Never commit .env files to version control
```

3. **Update API Endpoints**
```bash
# In client/src/config/api.js or similar
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

#### Frontend Deployment (Vercel)

1. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

2. **Domain Configuration**
   - Add custom domain if needed
   - Configure DNS settings
   - Enable HTTPS (automatic with Vercel)

#### Backend Deployment (Railway Example)

1. **Connect Repository**
```bash
# Connect GitHub repository to Railway
# Set up automatic deployments
```

2. **Environment Variables in Railway**
```bash
# Add all backend environment variables
# Use Railway's database services if preferred
```

3. **Health Check Endpoint**
```javascript
// Ensure you have a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

### Production Optimizations

#### Frontend Optimizations
```bash
# Add to package.json build script
"build": "GENERATE_SOURCEMAP=false react-scripts build"

# Enable service worker for PWA
"homepage": "https://your-domain.com"
```

#### Backend Optimizations
```javascript
// Add compression middleware
const compression = require('compression');
app.use(compression());

// Add security headers
const helmet = require('helmet');
app.use(helmet());

// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

### Environment Variable Security

**Security Best Practices:**
- Never commit `.env` files to version control
- Use different API keys for development and production
- Rotate secrets regularly
- Use strong, unique values for JWT_SECRET
- Enable database authentication and use strong passwords
- Use HTTPS in production (automatic with Vercel)

**Environment Variable Validation:**
```javascript
// Add to your backend startup
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'GEMINI_API_KEY'
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});
```