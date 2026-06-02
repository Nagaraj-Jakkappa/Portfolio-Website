require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Route Imports
const projectRoutes = require('./routes/projects');
const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skills');
const certificateRoutes = require('./routes/certificates');
const notificationRoutes = require('./routes/notificationRoutes');

// Models & Middleware
const Project = require('./models/Project');
const Message = require('./models/Message');
const Certificate = require('./models/Certificate');
const { protect } = require('./middleware/auth');

const app = express();

// 1. Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// 2. CORS Configuration
const corsOptions = {
  origin: [
    'https://techartistry.in',
    'https://www.techartistry.in',
    /\.vercel\.app$/,
    'http://localhost:5173', // Frontend Vite Port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-confirm-delete', 'x-requested-with'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 3. Request Parsing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// 4. Rate Limiting
app.use(
  '/api',
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS' || process.env.NODE_ENV !== 'production',
    message: { error: 'Too many requests — please slow down.' },
  })
);

// 5. Public/Global Routes
app.get('/api/health', (req, res) =>
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  })
);

// 6. Protected Stats Route
app.get('/api/stats', protect, async (req, res) => {
  try {
    const [projects, messages, certificates] = await Promise.all([
      Project.find().sort({ createdAt: -1 }).limit(5),
      Message.find().sort({ createdAt: -1 }).limit(10),
      Certificate.find().sort({ createdAt: -1 }),
    ]);

    const counts = {
      projectCount: await Project.countDocuments(),
      messageCount: await Message.countDocuments(),
      unreadMessages: await Message.countDocuments({ read: false }),
      certCount: await Certificate.countDocuments(),
    };

    res.json({ projects, messages, certificates, counts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);

// 8. 404 & Error Handling
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error('[Global Error]', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 9. Server & DB Connection
const PORT = parseInt(process.env.PORT) || 5180;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB failed:', err.message);
    process.exit(1);
  });
