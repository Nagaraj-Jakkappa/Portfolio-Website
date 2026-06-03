const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Models to export
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Certificate = require('../models/Certificate');
const Message = require('../models/Message');
const SiteContent = require('../models/SiteContent');
const Notification = require('../models/Notification');

// @route   GET /api/admin/export
// @desc    Export a safe JSON backup of all public portfolio data
// @access  Private (Admin only)
router.get('/export', protect, async (req, res) => {
  try {
    const mode = req.query.mode === 'sanitized' ? 'sanitized' : 'full';

    const [projects, skills, certificates, messages, siteContent, notifications] = await Promise.all([
      Project.find().lean(),
      Skill.find().lean(),
      Certificate.find().lean(),
      Message.find().lean(),
      SiteContent.findOne().lean(),
      Notification.find().lean(),
    ]);

    let finalMessages = messages;
    let finalNotifications = notifications;

    let finalSiteContent = siteContent || {};

    if (mode === 'sanitized') {
      finalMessages = messages.map(m => ({
        _id: m._id,
        subject: m.subject,
        read: m.read,
        archived: m.archived,
        createdAt: m.createdAt
      }));
      
      finalNotifications = notifications.map(n => ({
        _id: n._id,
        title: n.title,
        type: n.type,
        read: n.read,
        createdAt: n.createdAt
      }));

      // Sanitize siteContent to remove sensitive contact fields
      if (finalSiteContent.socialLinks) {
        // Deep clone to avoid mutating the original mongoose lean object directly,
        // though strictly lean objects can be mutated, it's safer.
        finalSiteContent = JSON.parse(JSON.stringify(finalSiteContent));
        delete finalSiteContent.socialLinks.email;
        delete finalSiteContent.socialLinks.phone;
      }
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      mode: mode,
      data: {
        projects,
        skills,
        certificates,
        messages: finalMessages,
        siteContent: finalSiteContent,
        notifications: finalNotifications
      }
    };

    res.json(exportData);
  } catch (err) {
    console.error('Export Error:', err.message);
    res.status(500).json({ message: 'Server Error during export' });
  }
});

module.exports = router;
