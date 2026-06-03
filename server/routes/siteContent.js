const router = require('express').Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const SiteContent = require('../models/SiteContent');

// ── Validation rules ─────────────────────────────────────────
const contentValidationRules = [
  // Hero
  body('hero.headline').optional({ checkFalsy: true }).isString().isLength({ max: 200 }),
  body('hero.subtitle').optional({ checkFalsy: true }).isString().isLength({ max: 500 }),
  body('hero.role').optional({ checkFalsy: true }).isString().isLength({ max: 200 }),
  body('hero.primaryCtaText').optional({ checkFalsy: true }).isString().isLength({ max: 60 }),
  body('hero.primaryCtaHref').optional({ checkFalsy: true }).isString().isLength({ max: 500 }),
  body('hero.secondaryCtaText').optional({ checkFalsy: true }).isString().isLength({ max: 60 }),
  body('hero.secondaryCtaHref').optional({ checkFalsy: true }).isString().isLength({ max: 500 }),

  // About
  body('about.title').optional({ checkFalsy: true }).isString().isLength({ max: 200 }),
  body('about.intro').optional({ checkFalsy: true }).isString().isLength({ max: 2000 }),
  body('about.imageUrl').optional({ checkFalsy: true }).isURL().withMessage('Invalid image URL'),
  body('about.location').optional({ checkFalsy: true }).isString().isLength({ max: 200 }),
  body('about.experienceLabel').optional({ checkFalsy: true }).isString().isLength({ max: 200 }),
  body('about.highlights').optional().isArray({ max: 20 }).withMessage('Too many highlights'),
  body('about.highlights.*.title').optional({ checkFalsy: true }).isString().isLength({ max: 200 }),
  body('about.highlights.*.description').optional({ checkFalsy: true }).isString().isLength({ max: 500 }),

  // Resume
  body('resume.resumeUrl').optional({ checkFalsy: true }).isURL().withMessage('Invalid resume URL'),
  body('resume.updatedAtText').optional({ checkFalsy: true }).isString().isLength({ max: 100 }),

  // Social
  body('socialLinks.github').optional({ checkFalsy: true }).isURL().withMessage('Invalid GitHub URL'),
  body('socialLinks.linkedin').optional({ checkFalsy: true }).isURL().withMessage('Invalid LinkedIn URL'),
  body('socialLinks.email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email'),
  body('socialLinks.phone').optional({ checkFalsy: true }).isString().isLength({ max: 50 }),
  body('socialLinks.location').optional({ checkFalsy: true }).isString().isLength({ max: 200 }),

  // Currently Building
  body('currentlyBuilding').optional().isArray({ max: 20 }).withMessage('Too many items'),
  body('currentlyBuilding.*.title').optional({ checkFalsy: true }).isString().isLength({ max: 200 }),
  body('currentlyBuilding.*.description').optional({ checkFalsy: true }).isString().isLength({ max: 500 }),
  body('currentlyBuilding.*.status').optional({ checkFalsy: true }).isString().isLength({ max: 50 }),
];

// ── GET /api/site-content — Public ───────────────────────────
router.get('/', async (req, res) => {
  try {
    const content = await SiteContent.findOne();
    res.json(content || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/site-content — Admin only ───────────────────────
router.put('/', protect, contentValidationRules, validate, async (req, res) => {
  try {
    const payload = {};

    // Hero
    if (req.body.hero) {
      payload.hero = {
        headline: req.body.hero.headline?.trim() || '',
        subtitle: req.body.hero.subtitle?.trim() || '',
        role: req.body.hero.role?.trim() || '',
        primaryCtaText: req.body.hero.primaryCtaText?.trim() || '',
        primaryCtaHref: req.body.hero.primaryCtaHref?.trim() || '',
        secondaryCtaText: req.body.hero.secondaryCtaText?.trim() || '',
        secondaryCtaHref: req.body.hero.secondaryCtaHref?.trim() || '',
      };
    }

    // About
    if (req.body.about) {
      payload.about = {
        title: req.body.about.title?.trim() || '',
        intro: req.body.about.intro?.trim() || '',
        imageUrl: req.body.about.imageUrl?.trim() || '',
        location: req.body.about.location?.trim() || '',
        experienceLabel: req.body.about.experienceLabel?.trim() || '',
        highlights: Array.isArray(req.body.about.highlights)
          ? req.body.about.highlights.map((h) => ({
              title: h.title?.trim() || '',
              description: h.description?.trim() || '',
            }))
          : [],
      };
    }

    // Resume
    if (req.body.resume) {
      payload.resume = {
        resumeUrl: req.body.resume.resumeUrl?.trim() || '',
        updatedAtText: req.body.resume.updatedAtText?.trim() || '',
      };
    }

    // Social Links
    if (req.body.socialLinks) {
      payload.socialLinks = {
        github: req.body.socialLinks.github?.trim() || '',
        linkedin: req.body.socialLinks.linkedin?.trim() || '',
        email: req.body.socialLinks.email?.trim() || '',
        phone: req.body.socialLinks.phone?.trim() || '',
        location: req.body.socialLinks.location?.trim() || '',
      };
    }

    // Currently Building
    if (Array.isArray(req.body.currentlyBuilding)) {
      payload.currentlyBuilding = req.body.currentlyBuilding.map((item) => ({
        title: item.title?.trim() || '',
        description: item.description?.trim() || '',
        status: item.status?.trim() || 'Active',
      }));
    }

    // Upsert singleton
    const content = await SiteContent.findOneAndUpdate({}, { $set: payload }, { new: true, upsert: true, runValidators: true });

    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
