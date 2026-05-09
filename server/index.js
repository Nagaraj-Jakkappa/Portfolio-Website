require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const projectRoutes = require('./routes/projects');
const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skills');
const certificateRoutes = require('./routes/certificates');

const Project = require('./models/Project');
const Message = require('./models/Message');
const Certificate = require('./models/Certificate');
const { protect } = require('./middleware/auth');

const app = express();

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

const corsOptions = {
  origin: [
    'https://techartistry.in',
    'https://www.techartistry.in',
    /\.vercel\.app$/,
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  // Added 'x-requested-with' which some browsers/libraries require
  allowedHeaders: ['Content-Type', 'Authorization', 'x-confirm-delete', 'x-requested-with'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 3. Payload Size Limit - Increased to 5mb to prevent 400 errors with large inputs
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// 4. Rate Limiting - Increased limit for testing stability
app.use('/api', rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 500, // Increased from 200
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS' || process.env.NODE_ENV !== 'production',
  message: { error: 'Too many requests — please slow down.' },
}));

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  env: process.env.NODE_ENV || 'development',
  timestamp: new Date().toISOString(),
  uptime: Math.floor(process.uptime()),
}));

// Dashboard stats endpoint
app.get('/api/stats', protect, async (req, res) => {
  try {
    const [projects, messages, certificates] = await Promise.all([
      Project.find().sort({ createdAt: -1 }).limit(5),
      Message.find().sort({ createdAt: -1 }).limit(10),
      Certificate.find().sort({ createdAt: -1 })
    ]);

    const counts = {
      projectCount: await Project.countDocuments(),
      messageCount: await Message.countDocuments(),
      unreadMessages: await Message.countDocuments({ read: false }),
      certCount: await Certificate.countDocuments()
    };

    res.json({ projects, messages, certificates, counts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certificates', certificateRoutes);

app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error('[Error]', err);
  // Improved error reporting for debugging
  const status = err.status || err.statusCode || 400;
  res.status(status).json({
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = parseInt(process.env.PORT) || 5180;

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('✅  MongoDB connected');
    const server = app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀  Server running on port ${PORT}`)
    );

    const shutdown = (sig) => {
      console.log(`\n🛑  ${sig} — shutting down`);
      server.close(() => {
        mongoose.connection.close(false).then(() => process.exit(0));
      });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  })
  .catch(err => {
    console.error('❌  MongoDB failed:', err.message);
    process.exit(1);
  });