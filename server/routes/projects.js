const express = require('express');
const mongoose = require('mongoose');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const router = express.Router();

const projectValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('techStack').optional().isArray().withMessage('Tech stack must be an array'),
  body('liveUrl').optional({ checkFalsy: true }).isURL().withMessage('Live URL must be a valid URL'),
  body('githubUrl').optional({ checkFalsy: true }).isURL().withMessage('GitHub URL must be a valid URL'),
  body('imageUrl').optional({ checkFalsy: true }).isString().withMessage('Image URL must be a string'),
  body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
  body('status').optional().isIn(['live', 'draft', 'archived']).withMessage('Invalid status'),
  body('category').optional().isIn(['web', 'ml', 'fullstack', 'other']).withMessage('Invalid category'),
  body('caseStudy.problem').optional({ checkFalsy: true }).isString().isLength({ max: 1000 }).withMessage('Problem max 1000 chars'),
  body('caseStudy.solution').optional({ checkFalsy: true }).isString().isLength({ max: 1000 }).withMessage('Solution max 1000 chars'),
  body('caseStudy.impact').optional({ checkFalsy: true }).isString().isLength({ max: 1000 }).withMessage('Impact max 1000 chars'),
];

// GET /api/projects  — supports ?featured=true, ?category=ml, ?search=react, ?page=1, ?limit=100, ?admin=true
router.get('/', async (req, res) => {
  try {
    const {
      featured,
      category,
      search,
      page = 1,
      limit = 100,
      sort = 'order',
      dir = 'asc',
      admin,
    } = req.query;

    let isAdmin = false;
    if (admin === 'true' && req.headers.authorization?.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.id) isAdmin = true;
      } catch (e) {
        // invalid token, treat as public
      }
    }

    const filter = {};
    if (!isAdmin) {
      filter.$or = [{ status: 'live' }, { status: { $exists: false } }];
    }

    if (featured !== undefined) filter.featured = featured === 'true';
    if (category) filter.category = category;
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      if (filter.$or) {
        filter.$and = [
          { $or: filter.$or },
          { $or: [{ title: searchRegex }, { techStack: { $elemMatch: searchRegex } }] }
        ];
        delete filter.$or;
      } else {
        filter.$or = [
          { title: searchRegex },
          { techStack: { $elemMatch: searchRegex } }
        ];
      }
    }
    const SORTS = ['order', 'createdAt', 'title'];
    const sortField = SORTS.includes(sort) ? sort : 'order';
    const sortDir = dir === 'desc' ? -1 : 1;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 100));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Project.find(filter)
        .sort({ [sortField]: sortDir, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Project.countDocuments(filter),
    ]);
    res.json({
      data: items,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid project ID' });
    const project = await Project.findById(req.params.id).lean();
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects
router.post('/', protect, projectValidationRules, validate, async (req, res) => {
  try {
    const project = await Project.create({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      longDescription: req.body.longDescription?.trim() || '',
      techStack: Array.isArray(req.body.techStack) ? req.body.techStack : [],
      imageUrl: req.body.imageUrl?.trim() || '',
      liveUrl: req.body.liveUrl?.trim() || '',
      githubUrl: req.body.githubUrl?.trim() || '',
      featured: Boolean(req.body.featured),
      status: req.body.status || 'live',
      category: req.body.category || 'web',
      order: Number(req.body.order) || 0,
      caseStudy: {
        problem: req.body.caseStudy?.problem?.trim() || '',
        solution: req.body.caseStudy?.solution?.trim() || '',
        impact: req.body.caseStudy?.impact?.trim() || '',
      },
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/projects/:id
router.put('/:id', protect, projectValidationRules, validate, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid project ID' });
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        longDescription: req.body.longDescription?.trim() || '',
        techStack: Array.isArray(req.body.techStack) ? req.body.techStack : [],
        imageUrl: req.body.imageUrl?.trim() || '',
        liveUrl: req.body.liveUrl?.trim() || '',
        githubUrl: req.body.githubUrl?.trim() || '',
        featured: Boolean(req.body.featured),
        status: req.body.status || 'live',
        category: req.body.category || 'web',
        order: Number(req.body.order) || 0,
        caseStudy: {
          problem: req.body.caseStudy?.problem?.trim() || '',
          solution: req.body.caseStudy?.solution?.trim() || '',
          impact: req.body.caseStudy?.impact?.trim() || '',
        },
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid project ID' });
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
