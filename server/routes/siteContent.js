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

  // SEO
  body('seo.title').optional({ checkFalsy: true }).isString().isLength({ max: 80 }),
  body('seo.description').optional({ checkFalsy: true }).isString().isLength({ max: 180 }),
  body('seo.keywords').optional({ checkFalsy: true }).isString().isLength({ max: 250 }),
  body('seo.ogImage').optional({ checkFalsy: true }).isURL().withMessage('Invalid OG image URL'),
  body('seo.twitterImage').optional({ checkFalsy: true }).isURL().withMessage('Invalid Twitter image URL'),

  // Impact Metrics
  body('impactMetrics').optional().isArray({ max: 10 }).withMessage('Too many metrics'),
  body('impactMetrics.*.label').optional({ checkFalsy: true }).isString().isLength({ max: 80 }),
  body('impactMetrics.*.value').optional({ checkFalsy: true }).isString().isLength({ max: 20 }),
  body('impactMetrics.*.description').optional({ checkFalsy: true }).isString().isLength({ max: 160 }),

  // Footer
  body('footer.brandName').optional({ checkFalsy: true }).isString().isLength({ max: 80 }),
  body('footer.tagline').optional({ checkFalsy: true }).isString().isLength({ max: 160 }),
  body('footer.copyrightText').optional({ checkFalsy: true }).isString().isLength({ max: 160 }),
  body('footer.builtWithText').optional({ checkFalsy: true }).isString().isLength({ max: 160 }),

  // Navbar
  body('navbar').optional().isArray({ max: 20 }).withMessage('Too many links'),
  body('navbar.*.label').optional({ checkFalsy: true }).isString().isLength({ max: 40 }),
  body('navbar.*.href').optional({ checkFalsy: true }).isString().isLength({ max: 500 }).custom((value, { req, path }) => {
    const match = path.match(/\d+/);
    if (!match) return true;
    const index = match[0];
    const item = req.body.navbar[index];
    if (item && item.type === 'section') {
      const validSections = ['#home', '#about', '#skills', '#projects', '#certificates', '#contact'];
      if (!validSections.includes(value)) {
        throw new Error('Invalid section link');
      }
    } else if (item && item.type === 'external') {
      try {
        new URL(value);
      } catch (err) {
        throw new Error('Invalid external URL');
      }
    }
    return true;
  }),
  body('navbar.*.type').optional({ checkFalsy: true }).isIn(['section', 'external']).withMessage('Type must be section or external'),
  body('navbar.*.visible').optional().isBoolean(),
  body('navbar.*.order').optional().isNumeric(),
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

    // SEO
    if (req.body.seo) {
      payload.seo = {
        title: req.body.seo.title?.trim() || '',
        description: req.body.seo.description?.trim() || '',
        keywords: req.body.seo.keywords?.trim() || '',
        ogImage: req.body.seo.ogImage?.trim() || '',
        twitterImage: req.body.seo.twitterImage?.trim() || '',
      };
    }

    // Impact Metrics
    if (Array.isArray(req.body.impactMetrics)) {
      payload.impactMetrics = req.body.impactMetrics.map((m) => ({
        label: m.label?.trim() || '',
        value: m.value?.trim() || '',
        description: m.description?.trim() || '',
      }));
    }

    // Footer
    if (req.body.footer) {
      payload.footer = {
        brandName: req.body.footer.brandName?.trim() || '',
        tagline: req.body.footer.tagline?.trim() || '',
        copyrightText: req.body.footer.copyrightText?.trim() || '',
        builtWithText: req.body.footer.builtWithText?.trim() || '',
      };
    }

    // Navbar
    if (Array.isArray(req.body.navbar)) {
      payload.navbar = req.body.navbar.map((n) => ({
        label: n.label?.trim() || '',
        href: n.href?.trim() || '',
        type: n.type === 'external' ? 'external' : 'section',
        visible: typeof n.visible === 'boolean' ? n.visible : true,
        order: Number(n.order) || 0,
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
