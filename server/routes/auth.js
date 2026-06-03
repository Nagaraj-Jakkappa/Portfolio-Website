const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const router = express.Router();

// POST /api/auth/login
router.post(
  '/login',
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

    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: '4h',
    });

    res.json({
      token,
      username: admin.username,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

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
