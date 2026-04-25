const router = require('express').Router();
const Skill = require('../models/Skill');
const { protect } = require('../middleware/auth');

// Public: Get all skills
router.get('/', async (req, res) => {
    const skills = await Skill.find();
    res.json(skills);
});

// Admin Only: Add a skill
router.post('/', protect, async (req, res) => {
    const newSkill = await Skill.create(req.body);
    res.status(201).json(newSkill);
});

// Admin Only: Delete a skill
router.delete('/:id', protect, async (req, res) => {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill removed' });
});

module.exports = router;