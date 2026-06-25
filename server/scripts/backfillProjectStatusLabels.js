/**
 * One-time backfill script to add statusLabels to existing projects.
 *
 * Usage:
 *   node server/scripts/backfillProjectStatusLabels.js
 *
 * Requires MONGO_URI in your .env (or set as environment variable).
 * This script is safe to run multiple times — it overwrites statusLabels
 * only for the 5 matched projects and does not touch any other data.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');

const TARGET_LABELS = ['Frontend Build', 'Backend Upgrade In Progress'];

// Match only these 5 project titles (case-insensitive partial match)
const TARGET_KEYWORDS = [
  'pothole',
  'thinkfast',
  'mood',
  'skycast',
  'taskflow',
];

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('ERROR: MONGO_URI not set. Add it to your .env or set it as an environment variable.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  const allProjects = await Project.find({}).lean();
  let updated = 0;

  for (const project of allProjects) {
    const t = (project.title || '').toLowerCase();
    const isTarget = TARGET_KEYWORDS.some((kw) => t.includes(kw));

    if (isTarget) {
      await Project.updateOne(
        { _id: project._id },
        { $set: { statusLabels: TARGET_LABELS } }
      );
      console.log(`  ✔ Updated: "${project.title}"`);
      updated++;
    }
  }

  console.log(`\nDone. ${updated} project(s) updated with statusLabels.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
