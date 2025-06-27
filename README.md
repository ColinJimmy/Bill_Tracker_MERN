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

### Backend Deployment (Heroku/Railway/etc.)
1. Set environment variables in hosting platform
2. Ensure MongoDB Atlas connection string is used
3. Deploy server code

### Frontend Deployment (Netlify/Vercel/etc.)
1. Build the React app: `cd client && npm run build`
2. Deploy the `build` folder
3. Set up API proxy or update API endpoints

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB is running locally
   - Verify connection string in `.env`
   - Ensure network access for MongoDB Atlas

2. **AI API Errors**
   - Verify Gemini API key is valid
   - Check API quotas and limits
   - Ensure network connectivity

3. **File Upload Issues**
   - Check file size limits (5MB max)
   - Verify file formats are supported
   - Ensure uploads directory exists and has write permissions

4. **OCR Not Working**
   - Check image quality and resolution
   - Ensure Tesseract.js dependencies are installed
   - Try with different image formats

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on the GitHub repository or contact the development team.