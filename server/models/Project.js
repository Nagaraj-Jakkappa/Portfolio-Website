const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
