require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function resetPassword() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
      throw new Error('ADMIN_PASSWORD is required in .env to reset the password');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    let admin = await Admin.findOne({ username });

    if (admin) {
      admin.password = password;
      await admin.save();
    } else {
      admin = new Admin({ username, password });
      await admin.save();
    }

    console.log('Admin password reset successfully');
    console.log('Done');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

resetPassword();
