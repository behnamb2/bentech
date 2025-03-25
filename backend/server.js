const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const expenseRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Set server timeout
const serverTimeout = 30000; // 30 seconds
app.timeout = serverTimeout;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-name.onrender.com']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Routes with error handling
app.use('/auth', (req, res, next) => {
  authRoutes(req, res, (err) => {
    if (err) {
      console.error('Auth route error:', err);
      return res.status(500).json({ error: err.message || 'Authentication failed' });
    }
    next();
  });
});

app.use('/expenses', auth, (req, res, next) => {
  expenseRoutes(req, res, (err) => {
    if (err) {
      console.error('Expenses route error:', err);
      return res.status(500).json({ error: err.message || 'Failed to process expense request' });
    }
    next();
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@your-cluster.mongodb.net/expense-manager?retryWrites=true&w=majority';

// Connect to MongoDB with improved options
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s
  family: 4 // Use IPv4, skip trying IPv6
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  // Don't crash the server on connection error
  // Instead, we'll handle database errors in the routes
});

// Start the server if not being imported
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the app for Vercel
module.exports = app; 