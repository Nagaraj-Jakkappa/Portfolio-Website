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

// CORS — preserved from current project (multi-origin)
const corsOptions = {
  origin: [
    'https://techartistry.in',
    'https://www.techartistry.in',
    /\.vercel\.app$/,
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-confirm-delete'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: { error: 'Too many requests — please slow down.' },
}));

// Health check
app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  env: process.env.NODE_ENV || 'development',
  timestamp: new Date().toISOString(),
  uptime: Math.floor(process.uptime()),
}));

// Dashboard stats (protected)
app.get('/api/stats', protect, async (req, res) => {
  try {
    const [projects, messages, certs, unread, featured] = await Promise.all([
      Project.countDocuments(),
      Message.countDocuments(),
      Certificate.countDocuments(),
      Message.countDocuments({ read: false }),
      Project.countDocuments({ featured: true }),
    ]);
    res.json({ projects, messages, certificates: certs, unread, featured });
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

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

const PORT = process.env.PORT || 5180;

mongoose
  .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅  MongoDB connected');
    const server = app.listen(PORT, () =>
      console.log(`🚀  Server on http://localhost:${PORT}`)
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
  .catch(err => { console.error('❌  MongoDB failed:', err.message); process.exit(1); });
