const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username and password required' });

    const admin = await Admin.findOne({ username });

    // Check if admin exists and password matches
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // FIXED: Sending username at top level AND admin object 
    // to ensure AuthContext.jsx (data.username) works correctly.
    res.json({
      token,
      username: admin.username,
      admin: { id: admin._id, username: admin.username }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me (verify token)
router.get('/me', protect, (req, res) => {
  res.json({ admin: req.admin });
});

/**
 * TEMPORARY RESET ROUTE 
 * Visit: techartistry-api.onrender.com/api/auth/prod-reset
 * After it works, DELETE THIS ROUTE for security.
 */
router.get('/prod-reset', async (req, res) => {
  try {
    const newPassword = "admin123";
    // This uses your Admin model's middleware to hash the password correctly
    const admin = await Admin.findOneAndUpdate(
      { username: 'admin' },
      { password: newPassword },
      { upsert: true, new: true }
    );
    res.json({ message: "Admin password reset to admin123 successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;