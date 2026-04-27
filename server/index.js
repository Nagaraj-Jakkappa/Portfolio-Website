require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// ── Route Imports ─────────────────────────────────────────────
const projectRoutes = require('./routes/projects');
const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skills');
const certificateRoutes = require('./routes/certificates');

const app = express();

// ── Middleware ────────────────────────────────────────────────

// 1. CORS Configuration - MUST BE FIRST to handle Pre-flight (OPTIONS) requests
app.use(cors({
  origin: [
    'https://techartistry.in',         // Your Production URL
    'https://www.techartistry.in',     // The www version
    /\.vercel\.app$/,                 // Matches all Vercel Preview links
    'http://localhost:5173'           // Local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow methods
  allowedHeaders: ['Content-Type', 'Authorization'],    // Ensure Auth headers pass through
}));

// 2. Global Parsers & Logging
app.use(express.json());
app.use(morgan('dev'));

// 3. Rate Limiter for Contact Form - Defined before routes
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many messages, please try again later.' },
});

// ── Routes ────────────────────────────────────────────────────

// Apply specific limiters before the general routes if possible
app.use('/api/messages/send', contactLimiter);

app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certificates', certificateRoutes);

// Health check endpoint (Useful for Render to see if your app is alive)
app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  timestamp: new Date(),
  environment: process.env.NODE_ENV
}));

// ── DB + Server ───────────────────────────────────────────────
const PORT = process.env.PORT || 5180;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });