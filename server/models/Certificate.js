const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    organization: { type: String, required: true },
    organizationLogo: { type: String }, // Field for image URL
    date: { type: String },
    link: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', certificateSchema);