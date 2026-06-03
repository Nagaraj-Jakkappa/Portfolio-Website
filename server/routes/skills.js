const router = require('express').Router();
const { body } = require('express-validator');
const Skill = require('../models/Skill');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const skillRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('category')
    .optional()
    .isIn(['Frontend', 'Backend', 'ML / AI', 'Tools', 'Other'])
    .withMessage('Invalid category'),
  body('level').optional().isInt({ min: 0, max: 100 }).withMessage('Level must be 0-100'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be >= 0'),
  body('visible').optional().isBoolean().withMessage('Visible must be boolean'),
];

// Public: Get all visible skills, sorted by order
router.get('/', async (req, res) => {
  try {
    const filter = req.query.admin === 'true' ? {} : { visible: { $ne: false } };
    const skills = await Skill.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Add a skill
router.post('/', protect, skillRules, validate, async (req, res) => {
  try {
    const newSkill = await Skill.create({
      name: req.body.name.trim(),
      category: req.body.category || 'Frontend',
      level: Number(req.body.level) || 80,
      order: Number(req.body.order) || 0,
      visible: req.body.visible !== false,
    });
    res.status(201).json(newSkill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Update a skill
router.put('/:id', protect, skillRules, validate, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name.trim(),
        category: req.body.category || 'Frontend',
        level: Number(req.body.level) || 80,
        order: Number(req.body.order) || 0,
        visible: req.body.visible !== false,
      },
      { new: true, runValidators: true }
    );
    if (!skill) return res.status(404).json({ error: 'Skill not found' });
    res.json(skill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Delete a skill
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ error: 'Skill not found' });
    res.json({ message: 'Skill removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
