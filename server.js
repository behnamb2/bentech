const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// CORS configuration
const corsOptions = {
  origin: ['https://expense-tracker-behnam.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware before any routes
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
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Serve the API routes first
try {
  const backendServer = require('./backend/server');
  app.use('/api', (req, res, next) => {
    console.log('API request:', req.method, req.url);
    return backendServer(req, res, next);
  });
} catch (error) {
  console.error('Failed to load backend server:', error);
  app.use('/api', (req, res) => {
    res.status(500).json({ error: 'Backend server not available' });
  });
}

// Serve static files from the frontend/dist directory
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Handle all other routes by serving the frontend
app.get('*', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
  } catch (error) {
    console.error('Error serving frontend:', error);
    res.status(500).json({ error: 'Failed to serve frontend' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// For Vercel, we need to export the app instead of listening
module.exports = app; 