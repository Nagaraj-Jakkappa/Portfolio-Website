const express = require('express');
const { protect } = require('../middleware/auth');
const VisitorEvent = require('../models/VisitorEvent');
const router = express.Router();

// Public route: POST /api/visitor-events/track
router.post('/track', async (req, res) => {
  try {
    const {
      eventType,
      page,
      path,
      title,
      referrer,
      deviceType,
      browser,
      os,
      sessionId,
      source,
      metadata,
    } = req.body;

    if (!eventType || !sessionId) {
      return res.status(400).json({ success: false, error: 'eventType and sessionId are required' });
    }

    // Sanitize strings briefly
    const sanitize = (str) => (typeof str === 'string' ? str.substring(0, 1000) : undefined);

    await VisitorEvent.create({
      eventType: sanitize(eventType),
      page: sanitize(page),
      path: sanitize(path),
      title: sanitize(title),
      referrer: sanitize(referrer),
      deviceType: sanitize(deviceType),
      browser: sanitize(browser),
      os: sanitize(os),
      sessionId: sanitize(sessionId),
      source: sanitize(source),
      metadata: typeof metadata === 'object' ? metadata : {},
    });

    // Always return success even if something minor fails (or just catch the error and still return true if we don't want to break the client)
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('VisitorEvent track error:', err.message);
    // Never crash on bad payload
    res.status(200).json({ success: true });
  }
});

// Protected admin route: GET /api/visitor-events/admin
router.get('/admin', protect, async (req, res) => {
  try {
    const { eventType, page, from, to, limit } = req.query;
    
    const filter = {};
    if (eventType) filter.eventType = eventType;
    if (page) filter.page = page;
    
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    const finalLimit = Math.min(100, Math.max(1, isNaN(parsedLimit) ? 50 : parsedLimit));

    const events = await VisitorEvent.find(filter)
      .sort({ createdAt: -1 })
      .limit(finalLimit)
      .lean();

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected admin summary route: GET /api/visitor-events/admin/summary
router.get('/admin/summary', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalEvents, todayEvents] = await Promise.all([
      VisitorEvent.countDocuments(),
      VisitorEvent.countDocuments({ createdAt: { $gte: today } }),
    ]);

    const pageViews = await VisitorEvent.countDocuments({ eventType: 'page_view' });
    
    const ctaClicks = await VisitorEvent.countDocuments({
      eventType: {
        $in: [
          'github_click',
          'linkedin_click',
          'whatsapp_click',
          'email_click',
          'resume_click',
        ],
      },
    });

    const topPagesAgg = await VisitorEvent.aggregate([
      { $match: { eventType: 'page_view' } },
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const topReferrersAgg = await VisitorEvent.aggregate([
      { $match: { eventType: 'page_view', referrer: { $ne: null, $ne: '' } } },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const deviceBreakdownAgg = await VisitorEvent.aggregate([
      { $match: { eventType: 'page_view', deviceType: { $ne: null } } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentEvents = await VisitorEvent.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      totalEvents,
      todayEvents,
      pageViews,
      ctaClicks,
      topPages: topPagesAgg.map((x) => ({ page: x._id, count: x.count })),
      topReferrers: topReferrersAgg.map((x) => ({ referrer: x._id, count: x.count })),
      deviceBreakdown: deviceBreakdownAgg.map((x) => ({ device: x._id, count: x.count })),
      recentEvents,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
