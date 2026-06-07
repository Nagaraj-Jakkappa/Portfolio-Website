const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    location: { type: String, trim: true, default: '' },
    duration: { type: String, trim: true, default: '' },
    type: { type: String, trim: true, default: 'Internship' }, // Internship, Project, Freelance, etc.
    description: { type: String, trim: true, default: '' },
    highlights: [{ type: String }],
    techStack: [{ type: String }],
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    // Optional expandable breakdown panel
    breakdown: {
      skillsApplied: [{ type: String }],   // rendered as badges
      practices: [{ type: String }],       // rendered as bullet list
      takeaways: [{ type: String }],       // rendered as bullet list
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', experienceSchema);
