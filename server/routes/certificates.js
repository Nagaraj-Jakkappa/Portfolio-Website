const express = require('express');
const mongoose = require('mongoose');
const { body } = require('express-validator');
const Certificate = require('../models/Certificate');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const router = express.Router();

const certValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('organization').trim().notEmpty().withMessage('Organization is required'),
  body('organizationLogo').optional({ checkFalsy: true }).isString().withMessage('Logo must be a string'),
  body('date').optional({ checkFalsy: true }).isString().withMessage('Date must be a string'),
  body('link').optional({ checkFalsy: true }).isURL().withMessage('Link must be a valid URL'),
  body('description').optional({ checkFalsy: true }).isString().withMessage('Description must be a string'),
];

// GET /api/certificates
router.get('/', async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 }).lean();
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/certificates (protected)
router.post('/', protect, certValidationRules, validate, async (req, res) => {
  try {

    const cert = await Certificate.create({
      title: req.body.title.trim(),
      organization: req.body.organization.trim(),
      organizationLogo: req.body.organizationLogo?.trim() || '', // ADDED THIS LINE
      date: req.body.date || null,
      link: req.body.link?.trim() || '',
      description: req.body.description?.trim() || '',
    });
    res.status(201).json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/certificates/:id (protected)
router.put('/:id', protect, certValidationRules, validate, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    const updated = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title.trim(),
        organization: req.body.organization.trim(),
        organizationLogo: req.body.organizationLogo?.trim() || '', // ADDED THIS LINE
        date: req.body.date || null,
        link: req.body.link?.trim() || '',
        description: req.body.description?.trim() || '',
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/certificates/:id (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
