require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Route Imports
const projectRoutes = require('./routes/projects');
const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skills');
const certificateRoutes = require('./routes/certificates');
const notificationRoutes = require('./routes/notificationRoutes');
const siteContentRoutes = require('./routes/siteContent');
const adminExportRoutes = require('./routes/adminExport');
const experienceRoutes = require('./routes/experiences');
const visitorEventRoutes = require('./routes/visitorEvents');

// Models & Middleware
const Project = require('./models/Project');
const Message = require('./models/Message');
const Certificate = require('./models/Certificate');
const { protect } = require('./middleware/auth');

const app = express();

// 1. Security Headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "http://localhost:*"],
      fontSrc: ["'self'", "data:", "https:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to be loaded cross-origin if needed
}));

// 2. Cookie Parser
app.use(cookieParser());

// 3. Strict CORS Configuration & CSRF Origin Validation
const getAllowedOrigins = () => {
  const envUrls = process.env.CLIENT_URLS || process.env.CLIENT_URL;
  if (envUrls) {
    return envUrls.split(',').map(url => url.trim());
  }
  return [
    'https://techartistry.in',
    'https://www.techartistry.in',
    'http://localhost:5173',
    'http://localhost:5174'
  ];
};
const allowedOrigins = getAllowedOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-confirm-delete', 'x-requested-with'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// CSRF Protection via Origin validation for state-changing routes
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.headers.origin;
    if (!origin) {
      return res.status(403).json({ error: 'CSRF validation failed: Missing origin' });
    }
    if (!allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: 'CSRF validation failed: Unknown origin' });
    }
  }
  next();
});

// 4. Request Parsing
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
app.use('/api/site-content', siteContentRoutes);
app.use('/api/admin', adminExportRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/visitor-events', visitorEventRoutes);
app.use('/api/insights', visitorEventRoutes);
app.use('/api/site', visitorEventRoutes);

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
