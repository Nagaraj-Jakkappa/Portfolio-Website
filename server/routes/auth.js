/**
 * auth.js — MERGED
 * Preserved: username.toLowerCase(), nuclear-reset, { token, username, admin } response shape
 * Added: PUT /password for SettingsPage
 */
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
      return res.status(400).json({ error: 'Username and password are required' });
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: admin.username, admin: { id: admin._id, username: admin.username } });
  } catch (err) { console.error('[Auth] Login error:', err); res.status(500).json({ error: 'Server error' }); }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ admin });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// PUT /api/auth/password  — NEW: used by SettingsPage
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    if (newPassword.length < 8)
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    if (!(await admin.comparePassword(currentPassword)))
      return res.status(401).json({ error: 'Current password is incorrect' });
    admin.password = newPassword; // bcrypt hashed by pre-save hook
    await admin.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/auth/nuclear-reset  — preserved from original (dev utility)
router.get('/nuclear-reset', async (req, res) => {
  try {
    await Admin.deleteMany({});
    const newAdmin = new Admin({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    });
    await newAdmin.save();
    res.json({ message: '✅ Database wiped and fresh admin created!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
