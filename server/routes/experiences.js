const express = require('express');
const mongoose = require('mongoose');
const { body } = require('express-validator');
const Experience = require('../models/Experience');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const router = express.Router();

// ── Validation ──────────────────────────────────────────────────────────────
const expValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 2, max: 100 }).withMessage('Title must be 2–100 characters'),
  body('organization')
    .trim()
    .notEmpty().withMessage('Organization is required')
    .isLength({ min: 2, max: 100 }).withMessage('Organization must be 2–100 characters'),
  body('location').optional({ checkFalsy: true }).isString(),
  body('duration').optional({ checkFalsy: true }).isString(),
  body('type').optional({ checkFalsy: true }).isString(),
  body('description')
    .optional({ checkFalsy: true })
    .isLength({ max: 1000 }).withMessage('Description must be at most 1000 characters'),
  body('highlights')
    .optional()
    .isArray().withMessage('Highlights must be an array'),
  body('highlights.*')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Each highlight must be at most 200 characters'),
  body('techStack').optional().isArray(),
  body('techStack.*').optional().isString(),
  body('startDate').optional({ checkFalsy: true }).isString(),
  body('endDate').optional({ checkFalsy: true }).isString(),
  body('displayOrder').optional().isNumeric().withMessage('displayOrder must be a number'),
  body('isVisible').optional().isBoolean(),
  // Breakdown sub-document (all optional)
  body('breakdown.skillsApplied').optional().isArray(),
  body('breakdown.skillsApplied.*').optional().isString(),
  body('breakdown.practices').optional().isArray(),
  body('breakdown.practices.*').optional().isString(),
  body('breakdown.takeaways').optional().isArray(),
  body('breakdown.takeaways.*').optional().isString(),
];

// ── Public: GET /api/experiences ─────────────────────────────────────────────
// Returns only visible items, sorted by displayOrder ascending
router.get('/', async (req, res) => {
  try {
    const items = await Experience.find({ isVisible: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin: GET /api/experiences/admin ────────────────────────────────────────
// Returns all items (including hidden), sorted by displayOrder
router.get('/admin', protect, async (req, res) => {
  try {
    const items = await Experience.find()
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin: POST /api/experiences ─────────────────────────────────────────────
router.post('/', protect, expValidation, validate, async (req, res) => {
  try {
    const item = await Experience.create({
      title: req.body.title.trim(),
      organization: req.body.organization.trim(),
      location: req.body.location?.trim() || '',
      duration: req.body.duration?.trim() || '',
      type: req.body.type?.trim() || 'Internship',
      description: req.body.description?.trim() || '',
      highlights: Array.isArray(req.body.highlights) ? req.body.highlights.filter(Boolean) : [],
      techStack: Array.isArray(req.body.techStack) ? req.body.techStack.filter(Boolean) : [],
      startDate: req.body.startDate || '',
      endDate: req.body.endDate || '',
      displayOrder: typeof req.body.displayOrder === 'number' ? req.body.displayOrder : 0,
      isVisible: req.body.isVisible !== false,
      breakdown: {
        skillsApplied: Array.isArray(req.body.breakdown?.skillsApplied)
          ? req.body.breakdown.skillsApplied.filter(Boolean)
          : [],
        practices: Array.isArray(req.body.breakdown?.practices)
          ? req.body.breakdown.practices.filter(Boolean)
          : [],
        takeaways: Array.isArray(req.body.breakdown?.takeaways)
          ? req.body.breakdown.takeaways.filter(Boolean)
          : [],
      },
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin: PUT /api/experiences/:id ──────────────────────────────────────────
router.put('/:id', protect, expValidation, validate, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    const updated = await Experience.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title.trim(),
        organization: req.body.organization.trim(),
        location: req.body.location?.trim() || '',
        duration: req.body.duration?.trim() || '',
        type: req.body.type?.trim() || 'Internship',
        description: req.body.description?.trim() || '',
        highlights: Array.isArray(req.body.highlights) ? req.body.highlights.filter(Boolean) : [],
        techStack: Array.isArray(req.body.techStack) ? req.body.techStack.filter(Boolean) : [],
        startDate: req.body.startDate || '',
        endDate: req.body.endDate || '',
        displayOrder: typeof req.body.displayOrder === 'number' ? req.body.displayOrder : 0,
        isVisible: req.body.isVisible !== false,
        breakdown: {
          skillsApplied: Array.isArray(req.body.breakdown?.skillsApplied)
            ? req.body.breakdown.skillsApplied.filter(Boolean)
            : [],
          practices: Array.isArray(req.body.breakdown?.practices)
            ? req.body.breakdown.practices.filter(Boolean)
            : [],
          takeaways: Array.isArray(req.body.breakdown?.takeaways)
            ? req.body.breakdown.takeaways.filter(Boolean)
            : [],
        },
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin: DELETE /api/experiences/:id ───────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    const item = await Experience.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
