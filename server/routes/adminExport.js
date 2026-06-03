const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

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
router.get('/export', auth, async (req, res) => {
  try {
    const [projects, skills, certificates, messages, siteContent, notifications] = await Promise.all([
      Project.find().lean(),
      Skill.find().lean(),
      Certificate.find().lean(),
      Message.find().lean(),
      SiteContent.findOne().lean(),
      Notification.find().lean(),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      data: {
        projects,
        skills,
        certificates,
        messages,
        siteContent: siteContent || {},
        notifications
      }
    };

    res.json(exportData);
  } catch (err) {
    console.error('Export Error:', err.message);
    res.status(500).json({ message: 'Server Error during export' });
  }
});

module.exports = router;
