const express = require('express');
const mongoose = require('mongoose');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/webp'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, or WebP images are allowed.'), false);
    }
  },
});

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
  body('statusLabels').optional().isArray().withMessage('Status labels must be an array'),
  body('statusLabels.*').optional().isString().isLength({ max: 100 }).withMessage('Each status label max 100 chars'),
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function generateUniqueSlug(title, excludeId = null) {
  let baseSlug = slugify(title) || 'project';
  let slug = baseSlug;
  
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    
    const existing = await Project.findOne(query).lean();
    if (!existing) break;
    
    const suffix = Math.random().toString(36).substring(2, 6);
    slug = `${baseSlug}-${suffix}`;
  }
  return slug;
}

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

// GET /api/projects/slug/:slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug }).lean();
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    let isAdmin = false;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.id) isAdmin = true;
      } catch (e) {
        // invalid token
      }
    }

    if (!isAdmin && project.status !== 'live' && project.status !== undefined) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects/:id/gallery
router.post('/:id/gallery', protect, upload.array('gallery', 6), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    if (project.gallery.length + req.files.length > 6) {
      return res.status(400).json({ error: 'Maximum 6 gallery images allowed per project' });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'techartistry/projects/gallery' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    const results = await Promise.all(uploadPromises);
    
    results.forEach((result) => {
      project.gallery.push(result.secure_url);
      project.galleryPublicIds.push(result.public_id);
    });

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/projects/:id/gallery
router.delete('/:id/gallery', protect, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'Image URL is required' });

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const index = project.gallery.indexOf(imageUrl);
    if (index === -1) {
      return res.status(404).json({ error: 'Image not found in gallery' });
    }

    const publicId = project.galleryPublicIds[index];
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Cloudinary deletion failed:', err);
      }
    }

    project.gallery.splice(index, 1);
    if (publicId) {
      project.galleryPublicIds.splice(index, 1);
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/projects/:id/gallery/reorder
router.put('/:id/gallery/reorder', protect, async (req, res) => {
  try {
    const { gallery } = req.body;
    if (!Array.isArray(gallery)) {
      return res.status(400).json({ error: 'Gallery array is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Validate that all URLs are existing gallery URLs
    const isValid = gallery.every(url => project.gallery.includes(url));
    if (!isValid || gallery.length !== project.gallery.length) {
      return res.status(400).json({ error: 'Invalid gallery URLs provided for reordering' });
    }

    // Reorder public IDs to match the new gallery order
    const newPublicIds = gallery.map(url => {
      const index = project.gallery.indexOf(url);
      return project.galleryPublicIds[index];
    });

    project.gallery = gallery;
    project.galleryPublicIds = newPublicIds;

    await project.save();
    res.json(project);
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
    const slug = await generateUniqueSlug(req.body.title.trim());
    const project = await Project.create({
      title: req.body.title.trim(),
      slug,
      description: req.body.description.trim(),
      longDescription: req.body.longDescription?.trim() || '',
      techStack: Array.isArray(req.body.techStack) ? req.body.techStack : [],
      imageUrl: req.body.imageUrl?.trim() || '',
      gallery: Array.isArray(req.body.gallery) ? req.body.gallery.filter(Boolean) : [],
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
      statusLabels: Array.isArray(req.body.statusLabels)
        ? req.body.statusLabels.map(s => s.trim()).filter(Boolean)
        : [],
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
      
    const existing = await Project.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    let slug = existing.slug;
    if (req.body.title.trim() !== existing.title || !slug) {
       slug = await generateUniqueSlug(req.body.title.trim(), existing._id);
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title.trim(),
        slug,
        description: req.body.description.trim(),
        longDescription: req.body.longDescription?.trim() || '',
        techStack: Array.isArray(req.body.techStack) ? req.body.techStack : [],
        imageUrl: req.body.imageUrl?.trim() || '',
        gallery: Array.isArray(req.body.gallery) ? req.body.gallery.filter(Boolean) : [],
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
        statusLabels: Array.isArray(req.body.statusLabels)
          ? req.body.statusLabels.map(s => s.trim()).filter(Boolean)
          : [],
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
