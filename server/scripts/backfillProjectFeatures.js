/**
 * backfillProjectFeatures.js
 * Run with: node server/scripts/backfillProjectFeatures.js [--force]
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Project = require('../models/Project');

const force = process.argv.includes('--force');

const backfillData = {
  'HYRR - AI Resume & ATS Optimizer': [
    { title: 'ATS Resume Analysis', description: 'Scans resumes against job requirements and highlights gaps.' },
    { title: 'AI Resume Rewrite', description: 'Helps improve resume bullets with role-focused wording.' },
    { title: 'Secure User Authentication', description: 'Uses protected access patterns for user-specific resume workflows.' },
    { title: 'Resume Version Management', description: 'Supports structured resume updates and saved improvements.' },
    { title: 'Subscription-ready Architecture', description: 'Designed with scalable SaaS workflows in mind.' }
  ],
  'Techartistry.in Portfolio': [
    { title: 'Dynamic Admin CMS', description: 'Allows portfolio content, projects, experience, and certificates to be managed from an admin panel.' },
    { title: 'Secure Project Management', description: 'Uses protected admin routes and backend validation for content updates.' },
    { title: 'Portfolio Analytics', description: 'Tracks important portfolio metrics and recruiter-focused activity.' },
    { title: 'Certificate & Experience Management', description: 'Supports verified experience entries with document links.' },
    { title: 'Optimized Media Delivery', description: 'Uses compressed and optimized media assets for faster loading.' }
  ],
  'Pothole Detection using Deep Learning': [
    { title: 'Image-based Pothole Detection', description: 'Detects road damage from uploaded or processed images.' },
    { title: 'CNN-powered Classification', description: 'Uses deep learning concepts for road anomaly detection.' },
    { title: 'Detection Result Preview', description: 'Presents prediction results in a clear visual interface.' },
    { title: 'Road Safety Use Case', description: 'Built around a practical civic-tech problem.' },
    { title: 'MERN Upgrade Roadmap', description: 'Planned upgrade path includes uploads, history, reports, and admin analytics.' }
  ]
};

const genericFrontendFeatures = [
  { title: 'Frontend Build', description: 'Built as a frontend-focused application with clean UI and interaction flow.' },
  { title: 'MERN Upgrade In Progress', description: 'Being upgraded with backend APIs, authentication, and MongoDB-backed data.' },
  { title: 'Responsive UI', description: 'Designed to work across desktop and mobile screen sizes.' },
  { title: 'Reusable Components', description: 'Structured with reusable UI blocks for maintainability.' },
  { title: 'Practical Product Flow', description: 'Focuses on real user flows instead of static screens.' }
];

async function run() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from .env');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const projects = await Project.find({});
    let updatedCount = 0;
    let skippedCount = 0;

    for (const project of projects) {
      if (!force && project.features && project.features.length > 0) {
        console.log(`Skipping "${project.title}" (already has features)`);
        skippedCount++;
        continue;
      }

      let newFeatures = backfillData[project.title];

      if (!newFeatures) {
        // Apply generic honest frontend features for remaining projects
        newFeatures = genericFrontendFeatures;
      }

      project.features = newFeatures;
      await project.save();
      console.log(`Updated "${project.title}"`);
      updatedCount++;
    }

    console.log(`\nMigration complete. Updated: ${updatedCount}, Skipped: ${skippedCount}`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
