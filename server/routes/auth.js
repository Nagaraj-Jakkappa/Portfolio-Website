const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const streamifier = require('streamifier');

const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const cloudinary = require('../utils/cloudinary');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login attempts. Please try again later.',
  },
  skip: (req) => req.method === 'OPTIONS',
});

// Configure Multer for memory storage with validation
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/webp'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, or WebP images are allowed.'), false);
    }
  },
});

// POST /api/auth/login
router.post(
  '/login',
  loginLimiter,
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res) => {
    try {
      const { username, password } = req.body;

      const admin = await Admin.findOne({ username: username.toLowerCase() });
      if (!admin || !(await admin.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin._id, username: admin.username },
        process.env.JWT_SECRET,
        {
          expiresIn: '4h',
        }
      );

      res.json({
        token,
        username: admin.username,
        admin: {
          id: admin._id,
          username: admin.username,
          avatarUrl: admin.avatarUrl,
        },
      });
    } catch (err) {
      console.error('[Auth] Login error:', err);
      res.status(500).json({ error: 'Server error during login' });
    }
  }
);

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ admin });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/avatar/config-status
router.get('/avatar/config-status', protect, (req, res) => {
  res.json({
    success: true,
    cloudinary: {
      cloudName: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
      apiKey: Boolean(process.env.CLOUDINARY_API_KEY),
      apiSecret: Boolean(process.env.CLOUDINARY_API_SECRET),
    },
  });
});

// POST /api/auth/avatar
router.post('/avatar', protect, (req, res) => {
  const isCloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  if (!isCloudinaryConfigured) {
    console.error('Cloudinary missing env:', {
      cloudName: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
      apiKey: Boolean(process.env.CLOUDINARY_API_KEY),
      apiSecret: Boolean(process.env.CLOUDINARY_API_SECRET),
    });
    return res.status(500).json({
      success: false,
      message: 'Cloudinary is not configured on the server.',
    });
  }

  upload.single('avatar')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Image must be under 2MB.' });
      }
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    try {
      const admin = await Admin.findById(req.admin.id);
      if (!admin) return res.status(404).json({ error: 'Admin not found.' });

      // Delete old image if exists
      if (admin.avatarPublicId) {
        await cloudinary.uploader.destroy(admin.avatarPublicId).catch(() => {});
      }

      // Upload new image
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'techartistry/admin/avatar',
              transformation: [
                {
                  width: 400,
                  height: 400,
                  crop: 'fill',
                  gravity: 'face',
                  quality: 'auto',
                  fetch_format: 'auto',
                },
              ],
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req);

      admin.avatarUrl = result.secure_url;
      admin.avatarPublicId = result.public_id;
      await admin.save();

      res.json({ success: true, avatarUrl: admin.avatarUrl });
    } catch (error) {
      console.error('Cloudinary avatar upload failed:', {
        message: error.message,
        http_code: error.http_code,
        name: error.name,
      });
      res.status(500).json({
        success: false,
        message: 'Error uploading image to Cloudinary.',
        detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  });
});

// DELETE /api/auth/avatar
router.delete('/avatar', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found.' });

    if (admin.avatarPublicId) {
      await cloudinary.uploader.destroy(admin.avatarPublicId).catch(console.error);
    }

    admin.avatarUrl = '';
    admin.avatarPublicId = '';
    await admin.save();

    res.json({ success: true, message: 'Avatar removed.' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing avatar.' });
  }
});

// PUT /api/auth/password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin || !(await admin.comparePassword(currentPassword))) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    admin.password = newPassword;
    await admin.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/profile
router.put(
  '/profile',
  protect,
  [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 40 })
      .withMessage('Username must be 3-40 characters'),
    body('currentPassword').notEmpty().withMessage('Current password is required to change profile'),
  ],
  validate,
  async (req, res) => {
    try {
      const { username, currentPassword } = req.body;
      const admin = await Admin.findById(req.admin.id);

      if (!admin || !(await admin.comparePassword(currentPassword))) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Check if username is taken by someone else
      const existing = await Admin.findOne({ username: username.toLowerCase() });
      if (existing && existing._id.toString() !== admin._id.toString()) {
        return res.status(400).json({ error: 'Username is already taken' });
      }

      admin.username = username.toLowerCase();
      await admin.save();

      res.json({ success: true, username: admin.username });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
