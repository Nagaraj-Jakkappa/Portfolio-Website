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

// 1. CORS Configuration - MUST BE FIRST
app.use(cors({
  origin: [
    'https://techartistry.in',
    'https://www.techartistry.in',
    /\.vercel\.app$/,
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 2. Explicit OPTIONS Handling (The "405 Killer")
// This ensures that any pre-flight request is immediately met with a 200 OK
app.options('*', cors());

app.use(express.json());
app.use(morgan('dev'));

// 3. Rate Limiter for Contact Form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many messages, please try again later.' },
});

// ── Routes ────────────────────────────────────────────────────

// Health check endpoint (Always keep this high up)
app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  timestamp: new Date()
}));

// Apply specific limiters
app.use('/api/messages/send', contactLimiter);

// General Routes
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certificates', certificateRoutes);

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