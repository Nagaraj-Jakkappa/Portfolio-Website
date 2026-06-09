const mongoose = require('mongoose');

const visitorEventSchema = new mongoose.Schema(
  {
    eventType: { type: String, required: true, trim: true },
    page: { type: String, trim: true },
    path: { type: String, trim: true },
    title: { type: String, trim: true },
    referrer: { type: String, trim: true },
    deviceType: { type: String, trim: true },
    browser: { type: String, trim: true },
    os: { type: String, trim: true },
    sessionId: { type: String, required: true, trim: true },
    source: { type: String, trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VisitorEvent', visitorEventSchema);
