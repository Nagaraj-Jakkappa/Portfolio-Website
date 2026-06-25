const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true
    },
    description: { type: String, required: true },
    longDescription: { type: String },
    techStack: [{ type: String }],
    imageUrl: { type: String },
    liveUrl: { type: String },
    githubUrl: { type: String },
    caseStudy: {
      problem: { type: String, default: '' },
      solution: { type: String, default: '' },
      impact: { type: String, default: '' }
    },
    gallery: [{ type: String, trim: true }],
    galleryPublicIds: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['live', 'draft', 'archived'],
      default: 'live',
    },
    order: { type: Number, default: 0 },
    category: {
      type: String,
      enum: ['web', 'ml', 'fullstack', 'other'],
      default: 'web',
    },
    statusLabels: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
