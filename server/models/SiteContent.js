const mongoose = require('mongoose');

/**
 * SiteContent — singleton document for dynamic portfolio content.
 * Only one document should exist; upsert on PUT ensures this.
 * All fields are optional so the public site can always fall back to hardcoded defaults.
 */
const siteContentSchema = new mongoose.Schema(
  {
    hero: {
      headline: { type: String, default: '', maxlength: 200 },
      subtitle: { type: String, default: '', maxlength: 500 },
      role: { type: String, default: '', maxlength: 200 },
      primaryCtaText: { type: String, default: '', maxlength: 60 },
      primaryCtaHref: { type: String, default: '', maxlength: 500 },
      secondaryCtaText: { type: String, default: '', maxlength: 60 },
      secondaryCtaHref: { type: String, default: '', maxlength: 500 },
    },
    about: {
      title: { type: String, default: '', maxlength: 200 },
      intro: { type: String, default: '', maxlength: 2000 },
      imageUrl: { type: String, default: '', maxlength: 1000 },
      location: { type: String, default: '', maxlength: 200 },
      experienceLabel: { type: String, default: '', maxlength: 200 },
      highlights: [
        {
          title: { type: String, default: '', maxlength: 200 },
          description: { type: String, default: '', maxlength: 500 },
        },
      ],
    },
    resume: {
      resumeUrl: { type: String, default: '', maxlength: 1000 },
      updatedAtText: { type: String, default: '', maxlength: 100 },
    },
    socialLinks: {
      github: { type: String, default: '', maxlength: 500 },
      linkedin: { type: String, default: '', maxlength: 500 },
      email: { type: String, default: '', maxlength: 200 },
      whatsapp: { type: String, default: '', maxlength: 200 },
      phone: { type: String, default: '', maxlength: 50 },
      location: { type: String, default: '', maxlength: 200 },
    },
    currentlyBuilding: [
      {
        title: { type: String, default: '', maxlength: 200 },
        description: { type: String, default: '', maxlength: 500 },
        status: { type: String, default: 'Active', maxlength: 50 },
      },
    ],
    now: [
      {
        category: { type: String, default: '', maxlength: 50 },
        description: { type: String, default: '', maxlength: 500 },
        icon: { type: String, default: '🚀', maxlength: 10 },
        themeColor: { type: String, default: 'blue', maxlength: 20 },
        size: { type: String, default: 'small', maxlength: 20 },
        visible: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
      },
    ],
    techPulse: [
      {
        title: { type: String, default: '', maxlength: 200 },
        description: { type: String, default: '', maxlength: 500 },
        icon: { type: String, default: '⚡', maxlength: 10 },
        tag: { type: String, default: '', maxlength: 50 },
        themeColor: { type: String, default: 'cyan', maxlength: 20 },
        size: { type: String, default: 'feature', maxlength: 20 },
        visible: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
      },
    ],
    engineeringHighlights: [
      {
        title: { type: String, default: '', maxlength: 200 },
        description: { type: String, default: '', maxlength: 500 },
        icon: { type: String, default: '🛠️', maxlength: 10 },
        tag: { type: String, default: '', maxlength: 50 },
        themeColor: { type: String, default: 'cyan', maxlength: 20 },
        size: { type: String, default: 'feature', maxlength: 20 },
        visible: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
      },
    ],
    seo: {
      title: { type: String, default: '', maxlength: 80 },
      description: { type: String, default: '', maxlength: 180 },
      keywords: { type: String, default: '', maxlength: 250 },
      ogImage: { type: String, default: '', maxlength: 1000 },
      twitterImage: { type: String, default: '', maxlength: 1000 },
    },
    impactMetrics: [
      {
        label: { type: String, default: '', maxlength: 80 },
        value: { type: String, default: '', maxlength: 20 },
        description: { type: String, default: '', maxlength: 160 },
      },
    ],
    footer: {
      brandName: { type: String, default: '', maxlength: 80 },
      tagline: { type: String, default: '', maxlength: 160 },
      copyrightText: { type: String, default: '', maxlength: 160 },
      builtWithText: { type: String, default: '', maxlength: 160 },
    },
    navbar: [
      {
        label: { type: String, default: '', maxlength: 40 },
        href: { type: String, default: '', maxlength: 500 },
        type: { type: String, default: 'section', maxlength: 20 },
        visible: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
      },
    ],
    brandIdentity: {
      wordmarkUrl: { type: String, default: '', maxlength: 1000 },
      logomarkUrl: { type: String, default: '', maxlength: 1000 },
      faviconUrl: { type: String, default: '', maxlength: 1000 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteContent', siteContentSchema);
