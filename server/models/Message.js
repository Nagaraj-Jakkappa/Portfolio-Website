const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    subject: {
      type: String,
      trim: true,
      default: 'No Subject',
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
    },
    read: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
