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

app.use(cors({
  origin: [
    'https://techartistry.in',
    'https://www.techartistry.in',
    /\.vercel\.app$/,
    'http://localhost:5173'
  ],
  credentials: true,
  // Explicitly allow these methods to prevent 405 errors
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(morgan('dev'));

// Rate limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many messages, please try again later.' },
});

// ── Routes ────────────────────────────────────────────────────
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certificates', certificateRoutes);

// Apply rate limiter specifically to the message sending endpoint
app.use('/api/messages/send', contactLimiter);

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