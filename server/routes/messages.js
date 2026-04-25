const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');
const nodemailer = require('nodemailer'); // Import Nodemailer

const router = express.Router();

// 1. Configure the Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/messages — public contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }

    // A. Save to MongoDB
    const saved = await Message.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
    });

    // B. Send Email Notification
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your nagupoojary33 address
      to: 'nagupoojary33@gmail.com', // Where you want to receive it
      replyTo: email,               // Allows you to reply directly to the sender
      subject: `New Portfolio Message: ${subject || 'No Subject'}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563eb;">New Message from ${name}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    };

    // Use await to ensure we catch any email errors
    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, id: saved._id });
  } catch (err) {
    console.error('SERVER ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── Admin only ────────────────────────────────────────────────

// GET /api/messages — list all messages
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/messages/:id/read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/messages/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;