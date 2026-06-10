// server/routes/notificationRoutes.js

const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET ALL NOTIFICATIONS
|--------------------------------------------------------------------------
*/
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error('GET Notifications Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET UNREAD COUNT
|--------------------------------------------------------------------------
*/
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      read: false,
    });

    res.json({ count });
  } catch (error) {
    console.error('Unread Count Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| MARK ALL AS READ
|--------------------------------------------------------------------------
*/
router.put('/mark-all-read', protect, async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Mark Read Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| CREATE NOTIFICATION
|--------------------------------------------------------------------------
*/
router.post('/', protect, async (req, res) => {
  try {
    const { title, message, type } = req.body;

    // Validation
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required',
      });
    }

    const notification = await Notification.create({
      title,
      message,
      type: type || 'system',
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Create Notification Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
