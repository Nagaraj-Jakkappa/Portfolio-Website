const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth'); // Make sure this path is correct
const router = express.Router();

// 1. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username: username.toLowerCase() });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      username: admin.username,
      admin: { id: admin._id, username: admin.username }
    });
  } catch (err) {
    console.error("Server Login Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// 2. GET /me ROUTE (Fixes the 404 Error)
// This verifies the token and keeps the admin logged in on refresh
router.get('/me', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json({ admin });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// 3. THE NUCLEAR SEED ROUTE
router.get('/nuclear-reset', async (req, res) => {
  try {
    await Admin.deleteMany({});
    const newAdmin = new Admin({
      username: 'admin',
      password: 'admin123'
    });
    await newAdmin.save();
    res.json({ message: "Database wiped and fresh admin created!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;