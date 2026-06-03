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
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteContent', siteContentSchema);
