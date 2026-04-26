const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

// 1. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // We lowercase the username to avoid case-sensitivity issues
    const admin = await Admin.findOne({ username: username.toLowerCase() });

    if (!admin) {
      console.log("Login fail: User not found");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log("Login fail: Password mismatch");
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

// 2. THE NUCLEAR SEED ROUTE (Run this once)
router.get('/nuclear-reset', async (req, res) => {
  try {
    await Admin.deleteMany({}); // Final wipe

    const newAdmin = new Admin({
      username: 'admin',
      password: 'admin123'
    });

    await newAdmin.save();
    res.json({ message: "Database wiped and fresh admin created! Use: admin / admin123" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;