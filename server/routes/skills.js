const router = require('express').Router();
const Skill = require('../models/Skill');
const { protect } = require('../middleware/auth');

// Public: Get all skills
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find().sort({ createdAt: -1 });
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Only: Add a skill
router.post('/', protect, async (req, res) => {
    try {
        const newSkill = await Skill.create(req.body);
        res.status(201).json(newSkill);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Admin Only: Delete a skill
router.delete('/:id', protect, async (req, res) => {
    try {
        await Skill.findByIdAndDelete(req.params.id);
        res.json({ message: 'Skill removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;