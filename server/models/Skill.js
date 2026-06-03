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
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
});

module.exports = mongoose.model('Skill', skillSchema);
