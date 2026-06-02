/**
 * messages.js — FULLY UPDATED
 * Features:
 * ✅ Contact form save
 * ✅ Email notification
 * ✅ Auto notification creation
 * ✅ Pagination
 * ✅ Read / unread system
 */

const express = require('express');
const nodemailer = require('nodemailer');

const Message = require('../models/Message');
const Notification = require('../models/Notification');

const { protect } = require('../middleware/auth');

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateMessage(body) {
  const errors = {};

  if (!body.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!body.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_RE.test(body.email)) {
    errors.email = 'Invalid email format';
  }

  if (!body.message?.trim()) {
    errors.message = 'Message is required';
  } else if (body.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return errors;
}

/* =========================================================
   POST /api/messages
   Public Contact Form
========================================================= */

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const errors = validateMessage(req.body);

    if (Object.keys(errors).length) {
      return res.status(400).json({
        error: 'Validation failed',
        errors,
      });
    }

    // Save Message
    const saved = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || '',
      message: message.trim(),
      ipAddress: req.ip,
      read: false,
    });

    /* =========================================================
       CREATE REAL NOTIFICATION
    ========================================================= */

    await Notification.create({
      title: 'New Contact Message',
      message: `${name} sent you a message`,
      type: 'message',
      read: false,
    });

    /* =========================================================
       EMAIL NOTIFICATION
    ========================================================= */

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter
        .sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          replyTo: email,

          subject: `New Portfolio Message: ${subject || 'No Subject'}`,

          html: `
            <div style="font-family:sans-serif;padding:20px;color:#333;border:1px solid #ddd;border-radius:10px;">
              <h2 style="color:#2563eb;">
                New Message from ${name}
              </h2>

              <p>
                <strong>Email:</strong> ${email}
              </p>

              <p>
                <strong>Subject:</strong> ${subject || 'N/A'}
              </p>

              <hr style="border:0;border-top:1px solid #eee;margin:20px 0;"/>

              <p style="white-space:pre-wrap;">
                ${message}
              </p>
            </div>
          `,
        })
        .catch((err) => {
          console.error('[Email] Failed:', err.message);
        });
    }

    res.status(201).json({
      success: true,
      id: saved._id,
    });
  } catch (err) {
    console.error('[Messages POST]', err);

    res.status(500).json({
      error: err.message,
    });
  }
});

/* =========================================================
   GET /api/messages
========================================================= */

router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 50, unread } = req.query;

    const filter = {};

    if (unread === 'true') {
      filter.read = false;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);

    const limitNum = Math.min(100, parseInt(limit, 10) || 50);

    const skip = (pageNum - 1) * limitNum;

    const [items, total, unreadCount] = await Promise.all([
      Message.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),

      Message.countDocuments(filter),

      Message.countDocuments({ read: false }),
    ]);

    res.json({
      data: items,

      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        unreadCount,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* =========================================================
   MARK ALL READ
========================================================= */

router.patch('/read-all', protect, async (req, res) => {
  try {
    const result = await Message.updateMany({ read: false }, { read: true });

    res.json({
      success: true,
      updated: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* =========================================================
   MARK SINGLE READ
========================================================= */

router.patch('/:id/read', protect, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });

    if (!msg) {
      return res.status(404).json({
        error: 'Message not found',
      });
    }

    res.json(msg);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* =========================================================
   DELETE SINGLE
========================================================= */

router.delete('/:id', protect, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* =========================================================
   DELETE ALL
========================================================= */

router.delete('/', protect, async (req, res) => {
  try {
    if (req.headers['x-confirm-delete'] !== 'yes') {
      return res.status(400).json({
        error: 'Send header x-confirm-delete: yes to confirm',
      });
    }

    const result = await Message.deleteMany({});

    res.json({
      success: true,
      deleted: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
