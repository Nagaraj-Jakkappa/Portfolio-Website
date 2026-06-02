const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'ML / AI', 'Tools', 'Other'],
    default: 'Frontend',
  },
  icon: { type: String, default: 'code' },
  level: { type: Number, default: 80 },
});

module.exports = mongoose.model('Skill', skillSchema);
