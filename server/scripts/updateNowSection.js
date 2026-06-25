/**
 * One-time script to update the #Now section content in the SiteContent database.
 *
 * Usage:
 *   node server/scripts/updateNowSection.js
 *
 * Requires MONGO_URI in your .env.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const SiteContent = require('../models/SiteContent');

const NEW_NOW_CONTENT = [
  {
    category: 'Learning',
    description: 'Production-focused MERN stack development, secure authentication, MongoDB data modeling, REST API structure, and deployment workflows.',
    icon: '🚀',
    themeColor: 'blue',
    size: 'wide',
    visible: true,
    order: 1
  },
  {
    category: 'Building',
    description: 'Upgrading my frontend projects into full MERN applications, including TaskFlow, ThinkFast Quiz, SkyCast Weather Forecast, Mood-Based Travel Explorer, and Pothole Detection.',
    icon: '🛠️',
    themeColor: 'emerald',
    size: 'small',
    visible: true,
    order: 2
  },
  {
    category: 'Practicing',
    description: 'React UI polish, reusable components, API integration, form validation, Git/GitHub workflow, debugging, and clean project documentation.',
    icon: '💻',
    themeColor: 'amber',
    size: 'small',
    visible: true,
    order: 3
  },
  {
    category: 'Current Goal',
    description: 'Become a job-ready junior frontend/full-stack developer by building production-ready MERN projects, improving problem-solving skills, and applying consistently for developer roles.',
    icon: '🎯',
    themeColor: 'violet',
    size: 'wide',
    visible: true,
    order: 4
  }
];

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('ERROR: MONGO_URI not set. Add it to your .env.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  const content = await SiteContent.findOne({});
  if (!content) {
    console.log('No SiteContent document found. Creating one...');
    await SiteContent.create({ now: NEW_NOW_CONTENT });
    console.log('Created SiteContent with new #Now data.');
  } else {
    console.log('Found existing SiteContent document. Updating #Now array...');
    content.now = NEW_NOW_CONTENT;
    await content.save();
    console.log('Updated existing SiteContent with new #Now data.');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
